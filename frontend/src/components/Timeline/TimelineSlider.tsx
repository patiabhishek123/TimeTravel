import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MetadataSnapshot, MetadataChangeEvent } from '../../types';
import EventMarker from '../EventMarker/EventMarker';

interface Props {
  snapshots: MetadataSnapshot[];
  currentSnapshotIndex: number;
  onSelectSnapshot: (index: number) => void;
  selectedEventId?: string;
  onSelectEvent: (event: MetadataChangeEvent) => void;
}

export default function TimelineSlider({ snapshots, currentSnapshotIndex, onSelectSnapshot, selectedEventId, onSelectEvent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="glass-panel p-6 overflow-hidden relative mb-8 z-10">
      <h3 className="text-sm font-bold text-om-primary tracking-widest mb-6">[ TEMPORAL NAVIGATION ]</h3>
      
      <div 
        ref={containerRef}
        className="relative flex items-center min-w-full overflow-x-auto pb-8 pt-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-om-secondary border-t border-b border-black -translate-y-1/2 z-0" />
        
        <motion.div 
          className="absolute top-1/2 left-4 h-1 bg-om-primary shadow-glow-strong -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{ 
            width: snapshots.length > 1 
              ? `calc(${(currentSnapshotIndex / (snapshots.length - 1)) * 100}% - 2rem)` 
              : '0%' 
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />

        <div className="flex items-center gap-8 md:gap-16 relative z-10 px-4 w-full justify-between">
          {snapshots.map((snapshot, idx) => {
            const isActive = idx <= currentSnapshotIndex;
            const isCurrent = idx === currentSnapshotIndex;
            const events = snapshot.events || [];
            
            return (
              <div key={snapshot.id} className="flex items-center gap-8 shrink-0">
                <motion.div 
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => onSelectSnapshot(idx)}
                  whileHover={{ x: [-1, 1, -1, 0] }}
                >
                  <motion.div 
                    animate={isCurrent ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                    transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
                    className={`w-5 h-5 z-10 transition-colors ${isActive ? 'bg-om-primary border border-white shadow-glow-strong' : 'bg-om-bg border border-om-secondary group-hover:border-om-primary group-hover:bg-om-secondary'}`}
                  />
                  <span className={`mt-2 text-xs font-bold ${isCurrent ? 'text-white' : 'text-om-secondary'}`}>
                    V{snapshots.length - idx}
                  </span>
                </motion.div>

                {events.map((event: MetadataChangeEvent) => (
                  <EventMarker 
                    key={event.id}
                    event={event}
                    isActive={selectedEventId === event.id}
                    onClick={() => {
                      onSelectSnapshot(idx);
                      onSelectEvent(event);
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
