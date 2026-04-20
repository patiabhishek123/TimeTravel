import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MetadataChangeEvent } from '../types';
import HorizontalTimeline from '../components/HorizontalTimeline';
import EventDetailsPanel from '../components/EventDetailsPanel';
import RootCausePanel from '../components/RootCausePanel';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function TimelineView() {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<MetadataChangeEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MetadataChangeEvent | null>(null);

  const fetchTimeline = async () => {
    try {
      const response = await axios.get(`/api/timeline/${id}`);
      // Reverse array so oldest is on the left, newest on right
      setEvents(response.data.data.reverse());
    } catch (error) {
      console.error("Failed to fetch timeline", error);
    }
  };

  useEffect(() => {
    if (id) fetchTimeline();
  }, [id]);

  const handleSimulateSnapshot = async () => {
    try {
      // For this demo, assuming dataset ID is the name or just triggering
      await axios.post(`/api/snapshot/${id}`);
      fetchTimeline();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 style={{ margin: 0 }}>Dataset Timeline Explorer</h1>
        </div>
        <button onClick={handleSimulateSnapshot} className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <RefreshCw size={16} /> Trigger Snapshot
        </button>
      </div>

      <HorizontalTimeline 
        events={events} 
        onSelectEvent={setSelectedEvent} 
        selectedEventId={selectedEvent?.id} 
      />

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <EventDetailsPanel event={selectedEvent} />
        {id && <RootCausePanel datasetId={id} />}
      </div>
    </div>
  );
}
