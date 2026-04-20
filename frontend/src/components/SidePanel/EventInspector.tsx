import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetadataChangeEvent } from '../../types';
import { X, Info, FileJson, Clock } from 'lucide-react';

interface Props {
  event: MetadataChangeEvent | null;
  onClose: () => void;
}

export default function EventInspector({ event, onClose }: Props) {
  if (!event) {
    return (
      <div className="glass-panel p-8 flex flex-col items-center justify-center text-center h-48 border-dashed border-2 border-vercel-border bg-transparent">
        <Info className="w-8 h-8 text-vercel-muted mb-3" />
        <p className="text-vercel-muted text-sm font-medium">Select an event from the timeline to view details.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel flex flex-col overflow-hidden relative"
    >
      <div className="p-4 border-b border-vercel-border flex items-center justify-between bg-[#141414]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Info size={16} className="text-vercel-muted" /> Event Details
        </h2>
        <button onClick={onClose} className="p-1 text-vercel-muted hover:text-white transition-colors rounded hover:bg-vercel-border">
          <X size={16} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-vercel-border text-white border border-[#333]">
            {event.changeType.replace('_', ' ')}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-vercel-muted font-medium mb-2 uppercase tracking-wider">Description</p>
          <p className="text-sm text-vercel-text leading-relaxed">{event.description}</p>
        </div>

        <div className="mb-6">
          <p className="text-xs text-vercel-muted font-medium mb-2 uppercase tracking-wider flex items-center gap-1">
            <FileJson size={14} /> JSON Payload
          </p>
          <pre className="bg-[#050505] p-3 rounded-lg overflow-x-auto text-[11px] text-vercel-muted font-mono border border-vercel-border">
            {JSON.stringify(event.diff, null, 2)}
          </pre>
        </div>
        
        <div className="mt-auto pt-4 border-t border-vercel-border/50">
          <p className="text-xs text-vercel-muted flex items-center gap-1">
            <Clock size={12} /> {new Date(event.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
