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
      case 'COLUMN_REMOVED': return 'bg-status-removed';
      case 'COLUMN_ADDED': return 'bg-status-added';
      case 'SCHEMA_CHANGE': return 'bg-status-changed';
      case 'LINEAGE_CHANGE': return 'bg-white';
      default: return 'bg-vercel-muted';
    }
  };

  const colorClass = getColor(event.changeType);

  return (
    <div 
      className="relative flex flex-col items-center group cursor-pointer shrink-0 z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 w-48 bg-white text-black text-xs rounded-lg shadow-soft z-50 p-2.5 pointer-events-none text-left"
          >
            <p className="font-semibold mb-1 truncate text-[11px] uppercase tracking-wider">{event.changeType.replace('_', ' ')}</p>
            <p className="text-gray-600 truncate">{event.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        whileHover={{ scale: 1.2 }}
        animate={{ 
          scale: isActive ? 1.4 : 1,
          boxShadow: isActive ? `0 0 0 4px rgba(255,255,255,0.1)` : 'none'
        }}
        className={`w-2.5 h-2.5 rounded-full ${colorClass} transition-all`}
      />
      
      <div className={`absolute top-full mt-2 text-[10px] font-medium transition-colors whitespace-nowrap ${isActive ? 'text-white' : 'text-transparent group-hover:text-vercel-muted'}`}>
        {event.changeType.replace('_', ' ')}
      </div>
    </div>
  );
}
