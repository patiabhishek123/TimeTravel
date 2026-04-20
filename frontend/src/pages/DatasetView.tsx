import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function DatasetView() {
  const [datasetId, setDatasetId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (datasetId.trim()) {
      navigate(`/dataset/${datasetId}/timeline`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
        Time Travel Debugger
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>Track and debug metadata schema and lineage changes over time.</p>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
        <input 
          type="text" 
          value={datasetId} 
          onChange={e => setDatasetId(e.target.value)} 
          placeholder="Enter Dataset ID (e.g. your-uuid-here)" 
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none' }}
        />
        <button type="submit" className="btn-primary">
          <Search size={18} /> Investigate
        </button>
      </form>
    </div>
  );
}
