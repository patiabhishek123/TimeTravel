import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetadataChangeEvent } from '../../types';

interface Props {
  event: MetadataChangeEvent;
  isActive: boolean;
  onClick: () => void;
}

export default function EventMarker({ event, isActive, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = (type: string) => {
    switch (type) {
      case 'COLUMN_REMOVED': return 'border-om-removed shadow-om-removed/40';
      case 'COLUMN_ADDED': return 'border-om-added shadow-om-added/40';
      case 'SCHEMA_CHANGE': return 'border-om-schema shadow-om-schema/40';
      case 'LINEAGE_CHANGE': return 'border-om-lineage shadow-om-lineage/40';
      default: return 'border-slate-500';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'COLUMN_REMOVED': return 'bg-om-removed/20';
      case 'COLUMN_ADDED': return 'bg-om-added/20';
      case 'SCHEMA_CHANGE': return 'bg-om-schema/20';
      case 'LINEAGE_CHANGE': return 'bg-om-lineage/20';
      default: return 'bg-slate-500/20';
    }
  };

  const colorClass = getColor(event.changeType);
  const bgClass = getBgColor(event.changeType);

  return (
    <div 
      className="relative flex flex-col items-center group cursor-pointer shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 w-48 bg-slate-800 text-xs rounded shadow-xl border border-slate-700 z-50 p-2 pointer-events-none"
          >
            <p className="font-bold text-white mb-1 truncate">{event.changeType.replace('_', ' ')}</p>
            <p className="text-slate-300 truncate">{event.description}</p>
            <p className="text-slate-500 mt-1 text-[10px]">{new Date(event.createdAt).toLocaleTimeString()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        whileHover={{ scale: 1.3 }}
        animate={{ 
          scale: isActive ? 1.4 : 1,
          boxShadow: isActive || isHovered ? `0 0 15px var(--tw-shadow-color)` : 'none'
        }}
        className={`w-4 h-4 rounded-full border-2 ${colorClass} ${bgClass} z-10 transition-colors`}
      />
      
      <div className={`mt-2 text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {new Date(event.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
