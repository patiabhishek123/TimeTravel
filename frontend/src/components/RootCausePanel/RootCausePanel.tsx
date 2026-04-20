import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { RootCauseResult } from '../../types';
import { Activity, AlertTriangle, Zap } from 'lucide-react';

interface Props {
  datasetId: string;
}

const TypewriterText = ({ text }: { text: string }) => (
  <motion.span
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
    }}
  >
    {text.split("").map((char, index) => (
      <motion.span key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        {char}
      </motion.span>
    ))}
    <motion.span 
      animate={{ opacity: [1, 0, 1] }} 
      transition={{ repeat: Infinity, duration: 0.8 }}
      className="inline-block w-2 h-4 bg-om-primary ml-1 align-middle"
    />
  </motion.span>
);

export default function RootCausePanel({ datasetId }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RootCauseResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
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
    <div className="glass-panel p-6 border-t-0 border-l-4 border-l-om-primary h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-xl font-bold text-om-primary flex items-center gap-2 uppercase tracking-widest">
          <Zap className="text-om-primary" /> [ ROOT CAUSE ENGINE ]
        </h2>
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="bg-om-secondary hover:bg-om-primary border border-om-primary text-om-text px-4 py-2 font-bold flex items-center gap-2 transition-all uppercase tracking-widest shadow-glow"
        >
          {loading ? <Activity className="animate-spin" size={18} /> : <Activity size={18} />}
          {loading ? 'ANALYZING...' : 'INITIATE SCAN'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <div className="text-om-primary text-2xl animate-pulse font-bold tracking-widest">
              [ SCANNING METADATA ]
            </div>
            <p className="text-om-secondary font-mono text-sm uppercase opacity-80">Isolating anomalies...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-om-bg border-2 border-om-primary p-5 flex items-start gap-4 shadow-glow-strong scanline-effect relative overflow-hidden">
              <AlertTriangle className="text-om-primary shrink-0 w-8 h-8 relative z-10" />
              <div className="relative z-10">
                <p className="text-xs font-bold text-om-secondary uppercase tracking-widest mb-2"> FATAL EXCEPTION DETECTED</p>
                <p className="text-om-text text-lg font-bold leading-relaxed uppercase">
                  <TypewriterText text={result.probableCause} />
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2 uppercase tracking-widest">
                <span className="text-om-secondary font-bold">CONFIDENCE SCORE</span>
                <span className="text-om-primary font-bold">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-om-bg border border-om-secondary h-4 overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-om-primary shadow-glow"
                />
              </div>
            </div>

            {result.relatedEvents.length > 0 && (
              <div className="pt-6 border-t-2 border-om-secondary">
                <p className="text-xs text-om-secondary font-bold uppercase tracking-widest mb-4">LINKED CORRUPTIONS</p>
                <div className="space-y-3">
                  {result.relatedEvents.map((ev: any) => (
                    <div key={ev.id} className="bg-om-bg p-3 border-l-4 border-om-secondary flex justify-between items-center hover:border-om-primary transition-colors cursor-pointer uppercase tracking-widest group">
                      <span className="text-sm font-bold text-om-text group-hover:text-om-primary transition-colors">[{ev.changeType.replace('_', ' ')}]</span>
                      <span className="text-xs text-om-secondary opacity-80">{new Date(ev.createdAt).toLocaleString()}</span>
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
