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
      <div className="mb-12 relative w-full scanline-effect py-8 border-l-4 border-om-primary pl-4">
        <motion.h1 
          animate={{ x: [-2, 2, -1, 0] }}
          transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror", repeatDelay: 3 }}
          className="text-4xl md:text-5xl font-extrabold tracking-widest mb-4 relative z-10 text-om-primary uppercase drop-shadow-[0_0_10px_rgba(255,43,43,0.8)]"
        >
          [ METADATA // DEBUGGER ]
        </motion.h1>
        <p className="text-om-text text-lg relative z-10 tracking-widest uppercase opacity-80">
          Initialize temporal scan & isolate anomalies.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-panel p-8 w-full flex flex-col md:flex-row gap-4 relative z-10">
        <input 
          type="text" 
          value={datasetId} 
          onChange={e => setDatasetId(e.target.value)} 
          placeholder="ENTER TARGET UUID..." 
          className="flex-1 bg-om-bg border border-om-secondary px-4 py-3 text-om-text placeholder-om-secondary focus:outline-none focus:border-om-primary focus:shadow-glow transition-all uppercase tracking-widest"
        />
        <motion.button 
          whileHover={{ scale: 1.02, x: [0, -2, 2, 0] }}
          type="submit" 
          className="bg-om-secondary hover:bg-om-primary text-om-text font-bold px-8 py-3 flex items-center justify-center gap-2 border-r-4 border-om-primary transition-all uppercase tracking-widest"
        >
          <Search size={18} /> INITIATE
        </motion.button>
      </form>
    </motion.div>
  );
}
