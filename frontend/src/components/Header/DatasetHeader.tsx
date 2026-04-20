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
    <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-om-secondary p-2 border-l-2 border-om-primary">
            <Database className="text-om-text w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-om-primary tracking-widest">[ DATASET EXPLORER ]</h1>
        </div>
        <p className="text-om-text font-mono text-xs opacity-80 pl-2 border-l-2 border-om-secondary">ID: {datasetId}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-om-bg p-3 border-l-2 border-om-primary flex items-center gap-3">
          <Clock className="text-om-primary w-5 h-5" />
          <div>
            <p className="text-xs text-om-secondary font-bold uppercase tracking-wider">LAST UPDATED</p>
            <p className="text-sm text-om-text font-medium">{new Date(lastUpdated).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-om-bg p-3 border-l-2 border-om-primary flex items-center gap-3">
          <FileText className="text-om-primary w-5 h-5" />
          <div>
            <p className="text-xs text-om-secondary font-bold uppercase tracking-wider">SNAPSHOTS</p>
            <p className="text-sm text-om-text font-medium">{totalSnapshots}</p>
          </div>
        </div>

        <div className="bg-om-bg p-3 border-l-2 border-om-primary flex items-center gap-3">
          <Activity className="text-om-primary w-5 h-5" />
          <div>
            <p className="text-xs text-om-secondary font-bold uppercase tracking-wider">TOTAL CHANGES</p>
            <p className="text-sm text-om-text font-medium">{totalChanges}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
