import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MetadataSnapshot, MetadataChangeEvent } from '../types';
import DatasetHeader from '../components/Header/DatasetHeader';
import TimelineSlider from '../components/Timeline/TimelineSlider';
import EventInspector from '../components/SidePanel/EventInspector';
import MetadataDiff from '../components/DiffViewer/MetadataDiff';
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
        <div className="w-12 h-12 border-4 border-om-secondary border-t-om-primary rounded-none animate-spin shadow-glow"></div>
      </div>
    );
  }

  const currentSnapshot = snapshots[currentSnapshotIndex];
  const prevSnapshot = currentSnapshotIndex > 0 ? snapshots[currentSnapshotIndex - 1] : null;

  const totalChanges = snapshots.reduce((acc, snap) => acc + (snap.events?.length || 0), 0);
  const lastUpdated = snapshots[snapshots.length - 1]?.createdAt || new Date().toISOString();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pb-20 scanline-effect min-h-screen">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <Link to="/" className="flex items-center gap-2 text-om-text hover:text-white bg-om-bg px-4 py-2 border-l-4 border-om-primary hover:bg-om-secondary transition-all">
          <ArrowLeft size={16} /> [ ABORT ]
        </Link>
        <button onClick={handleSimulateSnapshot} className="flex items-center gap-2 text-om-text bg-om-secondary px-4 py-2 border-r-4 border-om-primary hover:bg-om-primary transition-all">
          <RefreshCw size={16} /> [ TRIGGER SIMULATION ]
        </button>
      </div>

      <DatasetHeader 
        datasetId={id || ''} 
        totalSnapshots={snapshots.length} 
        totalChanges={totalChanges} 
        lastUpdated={lastUpdated} 
      />

      {snapshots.length > 0 ? (
        <>
          <TimelineSlider 
            snapshots={snapshots}
            currentSnapshotIndex={currentSnapshotIndex}
            onSelectSnapshot={setCurrentSnapshotIndex}
            selectedEventId={selectedEvent?.id}
            onSelectEvent={setSelectedEvent}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            <div className="lg:col-span-2">
              <MetadataDiff 
                currentSnapshot={currentSnapshot} 
                previousSnapshot={prevSnapshot} 
              />
            </div>
            <div className="lg:col-span-1">
              <RootCausePanel datasetId={id || ''} />
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel p-12 text-center mt-12">
          <p className="text-om-primary text-xl">ERR: NO SNAPSHOTS FOUND FOR GIVEN UUID.</p>
        </div>
      )}

      {/* Side Panel Overlay */}
      <EventInspector 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </motion.div>
  );
}
