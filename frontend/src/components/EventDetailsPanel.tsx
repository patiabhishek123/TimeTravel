import React from 'react';
import { MetadataChangeEvent } from '../types';

interface Props {
  event: MetadataChangeEvent | null;
}

export default function EventDetailsPanel({ event }: Props) {
  if (!event) return (
    <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Select an event on the timeline to view details</p>
    </div>
  );

  return (
    <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
      <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Event Details</h2>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Type: </span>
        <strong style={{ color: 'white' }}>{event.changeType}</strong>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Description: </span>
        <span style={{ color: 'white' }}>{event.description}</span>
      </div>
      <div>
        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Diff payload:</span>
        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>
          {JSON.stringify(event.diff, null, 2)}
        </pre>
      </div>
    </div>
  );
}
