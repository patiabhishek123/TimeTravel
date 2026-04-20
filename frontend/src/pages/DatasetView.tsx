import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center px-4"
    >
      <div className="mb-10 relative w-full flex flex-col items-center">
        <div className="bg-vercel-panel p-3 rounded-2xl border border-vercel-border mb-6 shadow-soft">
          <Database className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
          Metadata Time-Travel
        </h1>
        <p className="text-vercel-muted text-lg">
          Proactively debug broken pipelines by inspecting schema evolution and lineage changes.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-3">
        <input 
          type="text" 
          value={datasetId} 
          onChange={e => setDatasetId(e.target.value)} 
          placeholder="Enter Dataset UUID..." 
          className="flex-1 bg-vercel-panel border border-vercel-border rounded-xl px-4 py-3 text-vercel-text placeholder-[#555] focus:outline-none focus:border-vercel-muted focus:ring-1 focus:ring-vercel-muted transition-all shadow-sm font-mono text-sm"
        />
        <button 
          type="submit" 
          className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Search size={18} /> Investigate
        </button>
      </form>
    </motion.div>
  );
}
