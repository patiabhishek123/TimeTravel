import React, { useMemo } from 'react';
import { MetadataSnapshot } from '../../types';

interface Props {
  currentSnapshot: MetadataSnapshot;
  previousSnapshot: MetadataSnapshot | null;
}

export default function MetadataDiff({ currentSnapshot, previousSnapshot }: Props) {
  const diffs = useMemo(() => {
    const buildView = (oldObj: any, newObj: any) => {
      const oldLines = JSON.stringify(oldObj || {}, null, 2).split('\n');
      const newLines = JSON.stringify(newObj || {}, null, 2).split('\n');
      
      const oldView = oldLines.map(line => {
        const isRemoved = !newLines.includes(line);
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
    <div className="flex-1 bg-vercel-bg border border-vercel-border rounded-xl overflow-hidden flex flex-col shadow-sm">
      <div className="bg-[#141414] px-4 py-3 border-b border-vercel-border text-xs font-semibold text-vercel-muted flex justify-between items-center">
        <span className="uppercase tracking-wider">{title}</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${type === 'prev' ? 'bg-status-removed-bg text-status-removed' : 'bg-status-added-bg text-status-added'}`}>
          {type === 'prev' ? 'PREVIOUS' : 'CURRENT'}
        </span>
      </div>
      <div className="p-4 overflow-auto custom-scrollbar flex-1 font-mono text-xs leading-relaxed bg-[#0A0A0A]">
        {view.map((item, i) => {
          let bg = 'bg-transparent';
          let text = 'text-[#D4D4D4]';
          let border = 'border-transparent';
          if (item.status === 'added') { bg = 'bg-status-added-bg'; text = 'text-status-added'; border = 'border-status-added'; }
          if (item.status === 'removed') { bg = 'bg-status-removed-bg'; text = 'text-status-removed'; border = 'border-status-removed'; }
          if (item.status === 'changed') { bg = 'bg-status-changed-bg'; text = 'text-status-changed'; border = 'border-status-changed'; }
          
          return (
            <div key={i} className={`px-3 py-0.5 whitespace-pre ${bg} ${text} border-l-2 ${border} hover:bg-[#1A1A1A] transition-colors rounded-r-sm`}>
              {item.line}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-6 flex flex-col h-full bg-[#0F0F0F]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white">Metadata Diff Viewer</h3>
        <div className="flex gap-4 text-[10px] font-medium uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-added"></span> Added</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-removed"></span> Removed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-changed"></span> Changed</span>
        </div>
      </div>
      
      <div className="flex-1 flex gap-4 overflow-hidden min-h-[500px]">
        {renderPanel('Columns State', diffs.columns.oldView, 'prev')}
        {renderPanel('Columns State', diffs.columns.newView, 'curr')}
      </div>
    </div>
  );
}
