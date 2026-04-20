import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { RootCauseResult } from '../../types';
import { Activity, AlertTriangle, Zap } from 'lucide-react';

interface Props {
  datasetId: string;
}

export default function RootCausePanel({ datasetId }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RootCauseResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Small simulated delay to show off the "AI thinking" animation for the demo
      await new Promise(r => setTimeout(r, 1500));
      const response = await axios.get(`/api/analyze/${datasetId}`);
      setResult(response.data.data);
    } catch (error) {
      console.error("Failed to analyze root cause", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="text-om-schema" /> Automated Root Cause Engine
        </h2>
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="bg-om-lineage hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          {loading ? <Activity className="animate-spin" size={18} /> : <Activity size={18} />}
          {loading ? 'Analyzing Timeline...' : 'Analyze Root Cause'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 space-y-4"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-om-schema rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-mono text-sm animate-pulse">Running heuristic analysis on metadata events...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-om-removed/10 border border-om-removed/30 rounded-lg p-5 flex items-start gap-4">
              <AlertTriangle className="text-om-removed shrink-0 w-8 h-8" />
              <div>
                <p className="text-xs font-bold text-om-removed uppercase tracking-wider mb-1">High Probability Root Cause</p>
                <p className="text-white text-lg font-medium leading-relaxed">{result.probableCause}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Confidence Score</span>
                <span className="text-white font-bold">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full ${result.confidence > 0.8 ? 'bg-om-removed' : 'bg-om-schema'}`}
                />
              </div>
            </div>

            {result.relatedEvents.length > 0 && (
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Linked Flagged Events</p>
                <div className="space-y-2">
                  {result.relatedEvents.map((ev: any) => (
                    <div key={ev.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 flex justify-between items-center hover:bg-slate-800 transition-colors cursor-pointer">
                      <span className="text-sm font-semibold text-slate-300">{ev.changeType.replace('_', ' ')}</span>
                      <span className="text-xs text-slate-500">{new Date(ev.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
