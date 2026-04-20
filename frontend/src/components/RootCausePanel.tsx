import React, { useState } from 'react';
import axios from 'axios';
import { RootCauseResult } from '../types';
import { Activity, AlertTriangle } from 'lucide-react';

interface Props {
  datasetId: string;
}

export default function RootCausePanel({ datasetId }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RootCauseResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/analyze/${datasetId}`);
      setResult(response.data.data);
    } catch (error) {
      console.error("Failed to analyze root cause", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--accent-secondary)', margin: 0 }}>Root Cause Analysis</h2>
        <button onClick={handleAnalyze} className="btn-primary" disabled={loading}>
          <Activity size={18} /> {loading ? 'Analyzing...' : 'Analyze Now'}
        </button>
      </div>

      {result && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '1rem' }}>
            <AlertTriangle color="var(--high-priority)" />
            <div>
              <strong style={{ color: 'var(--high-priority)', display: 'block', marginBottom: '0.5rem' }}>Probable Cause</strong>
              <p style={{ margin: 0, color: 'white' }}>{result.probableCause}</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Confidence Score: </span>
            <strong style={{ color: 'white' }}>{(result.confidence * 100).toFixed(0)}%</strong>
          </div>

          {result.relatedEvents.length > 0 && (
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Suspicious Events Identified:</span>
              <ul style={{ paddingLeft: '1.5rem', color: 'white', margin: 0 }}>
                {result.relatedEvents.map(ev => (
                  <li key={ev.id} style={{ marginBottom: '0.25rem' }}>
                    <strong>{ev.changeType}</strong> - {new Date(ev.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
