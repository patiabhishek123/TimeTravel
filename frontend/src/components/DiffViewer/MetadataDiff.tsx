import React, { useMemo } from 'react';
import { MetadataSnapshot } from '../../types';

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
    <div className="flex-1 bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
        <span>{title}</span>
        <span className={type === 'prev' ? 'text-om-removed' : 'text-om-added'}>
          {type === 'prev' ? 'Previous Snapshot' : 'Current Snapshot'}
        </span>
      </div>
      <div className="p-4 overflow-auto custom-scrollbar flex-1 font-mono text-[11px] md:text-xs leading-relaxed">
        {view.map((item, i) => {
          let bg = 'bg-transparent';
          let text = 'text-slate-300';
          if (item.status === 'added') { bg = 'bg-om-added/20'; text = 'text-om-added'; }
          if (item.status === 'removed') { bg = 'bg-om-removed/20'; text = 'text-om-removed'; }
          if (item.status === 'changed') { bg = 'bg-om-schema/20'; text = 'text-om-schema'; }
          
          return (
            <div key={i} className={`px-2 py-0.5 whitespace-pre ${bg} ${text} hover:bg-slate-800 transition-colors`}>
              {item.line}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-6 flex flex-col h-[600px]">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Split-Screen Metadata Diff</h3>
      
      <div className="flex-1 flex gap-4 overflow-hidden">
        {renderPanel('State', diffs.columns.oldView, 'prev')}
        {renderPanel('State', diffs.columns.newView, 'curr')}
      </div>
    </div>
  );
}
