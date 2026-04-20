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
    <div className="glass-panel p-6 overflow-hidden relative mb-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Time Travel Slider</h3>
      
      <div 
        ref={containerRef}
        className="relative flex items-center min-w-full overflow-x-auto pb-8 pt-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
        
        <motion.div 
          className="absolute top-1/2 left-4 h-1 bg-om-lineage -translate-y-1/2 z-0 rounded-full"
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
                <div 
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => onSelectSnapshot(idx)}
                >
                  <motion.div 
                    animate={{ scale: isCurrent ? 1.5 : 1 }}
                    className={`w-5 h-5 rounded border-2 z-10 transition-colors ${isActive ? 'bg-om-lineage border-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-slate-900 border-slate-600 group-hover:border-slate-400'}`}
                  />
                  <span className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    V{snapshots.length - idx}
                  </span>
                </div>

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
