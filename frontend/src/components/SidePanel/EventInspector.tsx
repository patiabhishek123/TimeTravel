import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetadataChangeEvent } from '../../types';
import { X } from 'lucide-react';

interface Props {
  event: MetadataChangeEvent | null;
  onClose: () => void;
}

export default function EventInspector({ event, onClose }: Props) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="fixed top-0 right-0 h-full w-96 glass-panel rounded-none border-y-0 border-r-0 z-50 flex flex-col shadow-2xl"
        >
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-om-schema">Event Inspector</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Type</p>
              <div className="inline-block px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm font-semibold text-white">
                {event.changeType.replace('_', ' ')}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Description</p>
              <p className="text-slate-200">{event.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">JSON Diff Payload</p>
              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs text-slate-300 font-mono border border-slate-800">
                {JSON.stringify(event.diff, null, 2)}
              </pre>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Timestamp</p>
              <p className="text-sm text-slate-400">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
