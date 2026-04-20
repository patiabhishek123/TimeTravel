import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { RootCauseResult } from '../../types';
import { Activity, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

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
      await new Promise(r => setTimeout(r, 1000));
      const response = await axios.get(`/api/analyze/${datasetId}`);
      setResult(response.data.data);
    } catch (error) {
      console.error("Failed to analyze root cause", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 bg-[#0F0F0F] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Zap className="text-vercel-muted w-4 h-4" /> Root Cause Analysis
        </h2>
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="bg-white hover:bg-gray-200 text-black px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? <Activity className="animate-spin w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4 flex-1"
          >
            <div className="w-8 h-8 border-2 border-vercel-border border-t-white rounded-full animate-spin"></div>
            <p className="text-vercel-muted text-xs font-medium">Scanning metadata anomalies...</p>
          </motion.div>
        )}

        {!loading && !result && (
           <motion.div 
           key="empty"
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
           className="flex flex-col items-center justify-center py-12 text-center flex-1"
         >
           <Activity className="w-8 h-8 text-vercel-border mb-3" />
           <p className="text-vercel-muted text-xs font-medium">Run analysis to detect pipeline issues automatically.</p>
         </motion.div>
        )}

        {result && !loading && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6 flex-1"
          >
            <div className={`p-4 rounded-xl border ${result.confidence > 0.8 ? 'bg-status-removed-bg border-status-removed/30' : 'bg-status-changed-bg border-status-changed/30'} flex items-start gap-3`}>
              {result.confidence > 0.8 ? (
                <AlertTriangle className="text-status-removed shrink-0 w-5 h-5 mt-0.5" />
              ) : (
                <CheckCircle2 className="text-status-changed shrink-0 w-5 h-5 mt-0.5" />
              )}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${result.confidence > 0.8 ? 'text-status-removed' : 'text-status-changed'}`}>
                  Probable Cause
                </p>
                <p className="text-sm text-vercel-text font-medium leading-relaxed">
                  {result.probableCause}
                </p>
              </div>
            </div>
            
            <div className="bg-vercel-panel p-4 rounded-xl border border-vercel-border">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-vercel-muted font-medium">Confidence Score</span>
                <span className="text-white font-medium">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#222] rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full ${result.confidence > 0.8 ? 'bg-status-removed' : 'bg-status-changed'}`}
                />
              </div>
            </div>

            {result.relatedEvents.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] text-vercel-muted font-bold uppercase tracking-wider mb-3 px-1">Related Events</p>
                <div className="space-y-2">
                  {result.relatedEvents.map((ev: any) => (
                    <div key={ev.id} className="bg-vercel-panel p-3 rounded-xl border border-vercel-border flex justify-between items-center text-xs">
                      <span className="font-medium text-vercel-text">{ev.changeType.replace('_', ' ')}</span>
                      <span className="text-vercel-muted">{new Date(ev.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
