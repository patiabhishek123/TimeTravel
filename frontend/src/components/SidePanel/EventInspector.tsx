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
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ ease: "linear", duration: 0.15 }}
          className="fixed top-0 right-0 h-full w-96 bg-[#0f0f0f] border-l-4 border-om-primary z-50 flex flex-col shadow-[-10px_0_20px_rgba(255,43,43,0.15)] uppercase tracking-widest scanline-effect"
        >
          <div className="p-4 border-b-2 border-om-secondary flex items-center justify-between bg-om-bg">
            <h2 className="text-lg font-bold text-om-primary">[ EVENT DATA ]</h2>
            <button onClick={onClose} className="p-1 border border-om-secondary text-om-secondary hover:text-om-primary hover:border-om-primary transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-8">
              <p className="text-[10px] text-om-secondary mb-1"> TYPE</p>
              <div className="inline-block px-3 py-1 bg-om-bg border border-om-primary text-sm font-bold text-om-primary shadow-glow">
                {event.changeType.replace('_', ' ')}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] text-om-secondary mb-1"> DESCRIPTION</p>
              <p className="text-om-text border-l-2 border-om-secondary pl-3">{event.description}</p>
            </div>

            <div className="mb-8">
              <p className="text-[10px] text-om-secondary mb-2"> JSON PAYLOAD</p>
              <pre className="bg-om-bg p-4 border border-om-secondary text-[11px] text-om-primary font-mono overflow-x-auto shadow-inner">
                {JSON.stringify(event.diff, null, 2)}
              </pre>
            </div>
            
            <div>
              <p className="text-[10px] text-om-secondary mb-1"> TIMESTAMP</p>
              <p className="text-sm text-om-text">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
