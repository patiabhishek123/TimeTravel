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
    <div className="relative py-2 z-10 w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="relative flex items-center min-w-full overflow-x-auto pb-6 pt-4 px-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="absolute top-[22px] left-8 right-8 h-[2px] bg-vercel-border z-0" />
        
        <motion.div 
          className="absolute top-[22px] left-8 h-[2px] bg-white z-0"
          initial={{ width: 0 }}
          animate={{ 
            width: snapshots.length > 1 
              ? `calc(${(currentSnapshotIndex / (snapshots.length - 1)) * 100}% - 4rem)` 
              : '0%' 
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />

        <div className="flex items-center gap-12 md:gap-20 relative z-10 w-full justify-between">
          {snapshots.map((snapshot, idx) => {
            const isActive = idx <= currentSnapshotIndex;
            const isCurrent = idx === currentSnapshotIndex;
            const events = snapshot.events || [];
            
            return (
              <div key={snapshot.id} className="flex flex-col items-center shrink-0 relative">
                {isCurrent && (
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: 40 }} 
                    className="absolute top-6 left-1/2 w-[2px] bg-[#333] -translate-x-1/2 z-0"
                  />
                )}
                
                <div className="flex items-center gap-6">
                  <motion.div 
                    className="flex flex-col items-center cursor-pointer group relative z-10"
                    onClick={() => onSelectSnapshot(idx)}
                  >
                    <motion.div 
                      animate={isCurrent ? { scale: 1.4 } : { scale: 1 }}
                      className={`w-3.5 h-3.5 rounded-full z-10 transition-colors duration-200 shadow-sm ${isActive ? 'bg-white border-2 border-[#0A0A0A]' : 'bg-vercel-border border-2 border-[#0A0A0A] group-hover:bg-vercel-muted'}`}
                    />
                    <span className={`absolute top-full mt-2 text-[10px] font-medium whitespace-nowrap ${isCurrent ? 'text-white' : 'text-vercel-muted'}`}>
                      {new Date(snapshot.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
