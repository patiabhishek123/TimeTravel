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
    <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <Database className="text-om-lineage w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dataset Explorer</h1>
        </div>
        <p className="text-slate-400 font-mono text-xs">ID: {datasetId}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex items-center gap-3">
          <Clock className="text-slate-400 w-5 h-5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Last Updated</p>
            <p className="text-sm text-slate-200 font-medium">{new Date(lastUpdated).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex items-center gap-3">
          <FileText className="text-slate-400 w-5 h-5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Snapshots</p>
            <p className="text-sm text-slate-200 font-medium">{totalSnapshots}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex items-center gap-3">
          <Activity className="text-slate-400 w-5 h-5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Changes</p>
            <p className="text-sm text-slate-200 font-medium">{totalChanges}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
