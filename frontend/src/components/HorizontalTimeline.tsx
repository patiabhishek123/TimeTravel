import React from 'react';
import { MetadataChangeEvent } from '../types';

interface Props {
  events: MetadataChangeEvent[];
  onSelectEvent: (event: MetadataChangeEvent) => void;
  selectedEventId?: string;
}

export default function HorizontalTimeline({ events, onSelectEvent, selectedEventId }: Props) {
  const getPriorityClass = (type: string) => {
    if (type === 'COLUMN_REMOVED') return 'priority-high';
    if (type === 'LINEAGE_CHANGE' || type === 'SCHEMA_CHANGE') return 'priority-medium';
    return 'priority-low';
  };

  return (
    <div className="timeline-wrapper glass-panel" style={{ padding: '4rem 2rem', marginBottom: '2rem' }}>
      <div className="timeline-line"></div>
      {events.map((event) => (
        <div 
          key={event.id}
          className={`timeline-marker ${getPriorityClass(event.changeType)} ${selectedEventId === event.id ? 'active' : ''}`}
          onClick={() => onSelectEvent(event)}
        >
          <span className="timeline-date">{new Date(event.createdAt).toLocaleDateString()}</span>
          <span className="timeline-type">{event.changeType.replace('_', ' ')}</span>
        </div>
      ))}
      {events.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>No events found for this dataset.</p>}
    </div>
  );
}
