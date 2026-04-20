import React, { useMemo } from 'react';
import { MetadataSnapshot } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  currentSnapshot: MetadataSnapshot;
  previousSnapshot: MetadataSnapshot | null;
}

export default function MetadataDiff({ currentSnapshot, previousSnapshot }: Props) {
  // A naive but visually effective string-diffing for hackathon purposes
  const diffs = useMemo(() => {
    const buildView = (oldObj: any, newObj: any) => {
      const oldLines = JSON.stringify(oldObj || {}, null, 2).split('\n');
      const newLines = JSON.stringify(newObj || {}, null, 2).split('\n');
      
      const oldView = oldLines.map(line => {
        const isRemoved = !newLines.includes(line);
        // Approximation of change vs remove
        const isChanged = isRemoved && newLines.some(nLine => nLine.split(':')[0] === line.split(':')[0] && nLine !== line);
        return { 
          line, 
          status: isChanged ? 'changed' : (isRemoved ? 'removed' : 'unchanged') 
        };
      });

      const newView = newLines.map(line => {
        const isAdded = !oldLines.includes(line);
        const isChanged = isAdded && oldLines.some(oLine => oLine.split(':')[0] === line.split(':')[0] && oLine !== line);
        return { 
          line, 
          status: isChanged ? 'changed' : (isAdded ? 'added' : 'unchanged') 
        };
      });

      return { oldView, newView };
    };

    return {
      schema: buildView(previousSnapshot?.schema, currentSnapshot.schema),
      columns: buildView(previousSnapshot?.columns, currentSnapshot.columns),
      lineage: buildView(previousSnapshot?.lineage, currentSnapshot.lineage)
    };
  }, [currentSnapshot, previousSnapshot]);

  const renderPanel = (title: string, view: { line: string, status: string }[], type: 'prev' | 'curr') => (
    <div className="flex-1 bg-om-bg border-2 border-om-secondary overflow-hidden flex flex-col scanline-effect relative">
      <div className="bg-om-secondary px-4 py-2 border-b-2 border-om-primary text-xs font-bold text-om-bg uppercase tracking-widest flex justify-between z-10">
        <span>[{title}]</span>
        <span className={type === 'prev' ? 'text-[#ffcccc]' : 'text-[#ccffcc]'}>
          {type === 'prev' ? 'SYS.PREV_STATE' : 'SYS.CURR_STATE'}
        </span>
      </div>
      <motion.div 
        animate={{ opacity: [1, 0.8, 1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="p-4 overflow-auto custom-scrollbar flex-1 font-mono text-[11px] md:text-xs leading-relaxed z-10"
      >
        {view.map((item, i) => {
          let bg = 'bg-transparent';
          let text = 'text-om-text opacity-70';
          let border = 'border-transparent';
          if (item.status === 'added') { bg = 'bg-om-added/30'; text = 'text-[#00ff00] font-bold'; border = 'border-[#00ff00]'; }
          if (item.status === 'removed') { bg = 'bg-om-removed/40'; text = 'text-om-primary font-bold'; border = 'border-om-primary'; }
          if (item.status === 'changed') { bg = 'bg-om-secondary/40'; text = 'text-om-primary font-bold'; border = 'border-om-primary'; }
          
          return (
            <div key={i} className={`px-2 py-0.5 whitespace-pre ${bg} ${text} border-l-2 ${border} hover:bg-om-secondary/20 transition-colors`}>
              {item.line}
            </div>
          );
        })}
      </motion.div>
    </div>
  );

  return (
    <div className="glass-panel p-6 flex flex-col h-[600px] border-r-0 border-b-4 border-b-om-primary">
      <h3 className="text-sm font-bold text-om-primary tracking-widest mb-6">[ DIFF VIEWER TERMINAL ]</h3>
      
      <div className="flex-1 flex gap-4 overflow-hidden">
        {renderPanel('METADATA.COLUMNS', diffs.columns.oldView, 'prev')}
        {renderPanel('METADATA.COLUMNS', diffs.columns.newView, 'curr')}
      </div>
    </div>
  );
}
