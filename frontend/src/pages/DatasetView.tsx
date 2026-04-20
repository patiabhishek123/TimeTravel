import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center"
    >
      <div className="mb-8 relative w-full">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-om-lineage to-om-schema rounded-full"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Metadata Time-Travel
        </h1>
        <p className="text-slate-400 text-lg relative z-10">
          Proactively debug broken pipelines by inspecting schema evolution and lineage changes.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-panel p-6 w-full flex flex-col md:flex-row gap-4 relative z-10">
        <input 
          type="text" 
          value={datasetId} 
          onChange={e => setDatasetId(e.target.value)} 
          placeholder="Enter Dataset ID (UUID)..." 
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-om-lineage transition-colors"
        />
        <button type="submit" className="bg-om-lineage hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Search size={18} /> Investigate
        </button>
      </form>
    </motion.div>
  );
}
