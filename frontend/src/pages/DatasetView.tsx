import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Logo from '../components/Logo';

interface Dataset {
  id: string;
  name: string;
  fullyQualifiedName: string;
}

export default function DatasetView() {
  const [datasetName, setDatasetName] = useState('');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await axios.get('/api/datasets');
        setDatasets(response.data.data);
        if (response.data.data.length > 0) {
          setDatasetName(response.data.data[0].fullyQualifiedName || response.data.data[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch datasets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (datasetName.trim()) {
      navigate(`/dataset/${encodeURIComponent(datasetName)}/timeline`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center px-4"
    >
      <div className="mb-10 relative w-full flex flex-col items-center">
        <div className="bg-vercel-panel p-4 rounded-2xl border border-vercel-border mb-6 shadow-soft flex flex-col items-center">
          <Logo className="w-10 h-10 text-white mb-3 drop-shadow-md" />
          <span className="text-[10px] text-vercel-muted font-mono tracking-widest uppercase px-2">Powered by OpenMetadata</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
          Metadata Time-Travel
        </h1>
        <p className="text-vercel-muted text-lg">
          Proactively debug broken pipelines by inspecting schema evolution and lineage changes.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-3 relative">
        <div className="flex-1 relative">
          {loading ? (
            <div className="w-full bg-vercel-panel border border-vercel-border rounded-xl px-4 py-3 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-vercel-border border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <select 
              value={datasetName} 
              onChange={e => setDatasetName(e.target.value)} 
              className="w-full bg-vercel-panel border border-vercel-border rounded-xl px-4 py-3 text-vercel-text focus:outline-none focus:border-vercel-muted focus:ring-1 focus:ring-vercel-muted transition-all shadow-sm font-mono text-sm appearance-none cursor-pointer"
            >
              {datasets.map(ds => (
                <option key={ds.id} value={ds.fullyQualifiedName || ds.name}>
                  {ds.name} ({ds.fullyQualifiedName || ds.name})
                </option>
              ))}
            </select>
          )}
          {!loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-vercel-muted text-xs">
              ▼
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !datasetName}
          className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={18} /> Investigate
        </button>
      </form>
    </motion.div>
  );
}
