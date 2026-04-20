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
      case 'COLUMN_REMOVED': return 'border-om-removed';
      case 'COLUMN_ADDED': return 'border-om-added';
      case 'SCHEMA_CHANGE': return 'border-om-primary';
      case 'LINEAGE_CHANGE': return 'border-om-primary';
      default: return 'border-om-secondary';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'COLUMN_REMOVED': return 'bg-om-removed/40';
      case 'COLUMN_ADDED': return 'bg-om-added/40';
      case 'SCHEMA_CHANGE': return 'bg-om-primary/40';
      case 'LINEAGE_CHANGE': return 'bg-om-primary/40';
      default: return 'bg-om-secondary/40';
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
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: [0, 1, 0.5, 1], x: [-5, 2, -2, 0] }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 w-56 bg-om-bg text-xs border border-om-primary shadow-glow z-50 p-3 pointer-events-none uppercase tracking-widest"
          >
            <p className="font-bold text-om-primary mb-1 truncate">[{event.changeType.replace('_', ' ')}]</p>
            <p className="text-om-text truncate">{event.description}</p>
            <p className="text-om-secondary mt-2 text-[10px]">{new Date(event.createdAt).toLocaleTimeString()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        whileHover={{ scale: 1.3, rotate: [0, -5, 5, 0] }}
        animate={{ 
          scale: isActive ? 1.4 : 1,
          boxShadow: isActive || isHovered ? `0 0 15px rgba(255,43,43,0.8)` : 'none'
        }}
        className={`w-4 h-4 border-2 ${colorClass} ${bgClass} z-10 transition-colors rounded-none scanline-effect`}
      />
      
      <div className={`mt-2 text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-om-secondary group-hover:text-om-text'}`}>
        {new Date(event.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
