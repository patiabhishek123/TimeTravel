import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MetadataSnapshot, MetadataChangeEvent } from '../types';
import DatasetHeader from '../components/Header/DatasetHeader';
import TimelineSlider from '../components/Timeline/TimelineSlider';
import EventInspector from '../components/SidePanel/EventInspector';
import MetadataDiff from '../components/DiffViewer/MetadataDiff';
import LineagePanel from '../components/LineageViewer/LineagePanel';
import RootCausePanel from '../components/RootCausePanel/RootCausePanel';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TimelineView() {
  const { id } = useParams<{ id: string }>();
  const [snapshots, setSnapshots] = useState<MetadataSnapshot[]>([]);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<MetadataChangeEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSnapshots = async () => {
    try {
      const response = await axios.get(`/api/snapshots/${id}`);
      setSnapshots(response.data.data.reverse());
      setCurrentSnapshotIndex(response.data.data.length > 0 ? response.data.data.length - 1 : 0);
    } catch (error) {
      console.error("Failed to fetch snapshots", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSnapshots();
  }, [id]);

  const handleSimulateSnapshot = async () => {
    try {
      await axios.post(`/api/snapshot/${id}`);
      fetchSnapshots();
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-vercel-border border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentSnapshot = snapshots[currentSnapshotIndex];
  const prevSnapshot = currentSnapshotIndex > 0 ? snapshots[currentSnapshotIndex - 1] : null;

  const totalChanges = snapshots.reduce((acc, snap) => acc + (snap.events?.length || 0), 0);
  const lastUpdated = snapshots[snapshots.length - 1]?.createdAt || new Date().toISOString();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-20">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-vercel-muted hover:text-white transition-colors bg-vercel-panel border border-vercel-border px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
            <ArrowLeft size={16} /> Back to Search
          </Link>
          <button onClick={handleSimulateSnapshot} className="flex items-center gap-2 text-white bg-vercel-panel border border-vercel-border px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors shadow-sm text-sm font-medium">
            <RefreshCw size={16} /> Trigger Snapshot
          </button>
        </div>

        <DatasetHeader 
          datasetId={id || ''} 
          totalSnapshots={snapshots.length} 
          totalChanges={totalChanges} 
          lastUpdated={lastUpdated} 
        />

        {snapshots.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md pt-4 pb-2 -mx-4 px-4 border-b border-vercel-border shadow-sm mb-2">
              <TimelineSlider 
                snapshots={snapshots}
                currentSnapshotIndex={currentSnapshotIndex}
                onSelectSnapshot={setCurrentSnapshotIndex}
                selectedEventId={selectedEvent?.id}
                onSelectEvent={setSelectedEvent}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              <div className="lg:col-span-8 flex flex-col min-h-[600px]">
                <MetadataDiff 
                  currentSnapshot={currentSnapshot} 
                  previousSnapshot={prevSnapshot} 
                />
                <LineagePanel
                  datasetName={id || ''}
                  currentSnapshot={currentSnapshot}
                  previousSnapshot={prevSnapshot}
                />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <EventInspector 
                  event={selectedEvent} 
                  onClose={() => setSelectedEvent(null)} 
                />
                <RootCausePanel datasetId={id || ''} />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 text-center mt-12">
            <p className="text-vercel-muted text-lg">No snapshots found for this dataset.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
