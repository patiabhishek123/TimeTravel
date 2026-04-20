import React from 'react';
import { Database, Clock, Activity, FileText } from 'lucide-react';

interface Props {
  datasetId: string;
  totalSnapshots: number;
  totalChanges: number;
  lastUpdated: string;
}

export default function DatasetHeader({ datasetId, totalSnapshots, totalChanges, lastUpdated }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-vercel-panel p-2 rounded-lg border border-vercel-border shadow-sm">
            <Database className="text-vercel-text w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Dataset Explorer</h1>
        </div>
        <p className="text-vercel-muted font-mono text-xs mt-3 bg-[#141414] inline-block px-2 py-1 rounded-md border border-[#333]">ID: {datasetId}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="bg-vercel-panel rounded-xl p-3 border border-vercel-border flex items-center gap-3 shadow-sm min-w-[140px]">
          <Clock className="text-vercel-muted w-4 h-4" />
          <div>
            <p className="text-[10px] text-vercel-muted font-medium uppercase tracking-wider mb-0.5">Last Updated</p>
            <p className="text-sm text-vercel-text font-medium">{new Date(lastUpdated).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-vercel-panel rounded-xl p-3 border border-vercel-border flex items-center gap-3 shadow-sm min-w-[120px]">
          <FileText className="text-vercel-muted w-4 h-4" />
          <div>
            <p className="text-[10px] text-vercel-muted font-medium uppercase tracking-wider mb-0.5">Snapshots</p>
            <p className="text-sm text-vercel-text font-medium">{totalSnapshots}</p>
          </div>
        </div>

        <div className="bg-vercel-panel rounded-xl p-3 border border-vercel-border flex items-center gap-3 shadow-sm min-w-[120px]">
          <Activity className="text-vercel-muted w-4 h-4" />
          <div>
            <p className="text-[10px] text-vercel-muted font-medium uppercase tracking-wider mb-0.5">Total Changes</p>
            <p className="text-sm text-vercel-text font-medium">{totalChanges}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
