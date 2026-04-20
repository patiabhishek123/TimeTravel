import React, { useMemo } from 'react';
import { Network, ArrowRight } from 'lucide-react';
import { MetadataSnapshot } from '../../types';

interface Props {
  datasetName: string;
  currentSnapshot: MetadataSnapshot;
  previousSnapshot: MetadataSnapshot | null;
}

export default function LineagePanel({ datasetName, currentSnapshot, previousSnapshot }: Props) {
  const { currentLineage, prevLineage } = useMemo(() => {
    return {
      currentLineage: currentSnapshot.lineage || { upstreamEdges: [], downstreamEdges: [] },
      prevLineage: previousSnapshot?.lineage || { upstreamEdges: [], downstreamEdges: [] }
    };
  }, [currentSnapshot, previousSnapshot]);

  const getUpstreams = (lineage: any) => {
    if (!lineage) return [];
    if (lineage.upstreamEdges) return lineage.upstreamEdges.map((e: any) => e.fromEntity);
    if (lineage.upstream) return lineage.upstream;
    return [];
  };

  const getDownstreams = (lineage: any) => {
    if (!lineage) return [];
    if (lineage.downstreamEdges) return lineage.downstreamEdges.map((e: any) => e.toEntity);
    if (lineage.downstream) return lineage.downstream;
    return [];
  };

  const currentUpstreams = getUpstreams(currentLineage);
  const currentDownstreams = getDownstreams(currentLineage);
  
  const prevUpstreams = getUpstreams(prevLineage);
  const prevDownstreams = getDownstreams(prevLineage);

  const determineStatus = (node: string, currentNodes: string[], prevNodes: string[]) => {
    if (!previousSnapshot) return 'unchanged';
    const isCurrent = currentNodes.includes(node);
    const isPrev = prevNodes.includes(node);
    if (isCurrent && !isPrev) return 'added';
    if (!isCurrent && isPrev) return 'removed';
    return 'unchanged';
  };

  // Combine to show both current and removed nodes
  const allUpstreams = Array.from(new Set([...currentUpstreams, ...prevUpstreams]));
  const allDownstreams = Array.from(new Set([...currentDownstreams, ...prevDownstreams]));

  const renderNode = (node: string, type: 'upstream' | 'downstream' | 'main') => {
    let status = 'unchanged';
    if (type === 'upstream') status = determineStatus(node, currentUpstreams, prevUpstreams);
    if (type === 'downstream') status = determineStatus(node, currentDownstreams, prevDownstreams);

    let baseClasses = "px-4 py-2.5 rounded-lg text-xs font-mono font-medium border flex items-center justify-center text-center transition-colors min-w-[160px] shadow-sm truncate max-w-[200px]";
    
    if (type === 'main') {
      baseClasses += " bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]";
    } else {
      if (status === 'added') {
        baseClasses += " bg-status-added-bg text-status-added border-status-added";
      } else if (status === 'removed') {
        baseClasses += " bg-status-removed-bg text-status-removed border-status-removed line-through opacity-50";
      } else {
        baseClasses += " bg-vercel-panel text-vercel-text border-vercel-border";
      }
    }

    return (
      <div key={node} className={baseClasses} title={node}>
        {node}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 bg-[#0F0F0F] flex flex-col mt-6 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Network className="text-vercel-muted w-4 h-4" /> Data Lineage Map
        </h3>
        <div className="flex gap-4 text-[10px] font-medium uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-added"></span> Added</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-removed"></span> Removed</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[200px] py-4 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-6 md:gap-12 min-w-max px-4 pb-4">
          
          {/* UPSTREAM */}
          <div className="flex flex-col gap-4">
            {allUpstreams.length === 0 ? (
              <span className="text-vercel-muted text-xs font-mono px-4 py-2 border border-dashed border-vercel-border rounded-lg">No upstreams</span>
            ) : (
              allUpstreams.map(node => renderNode(node, 'upstream'))
            )}
          </div>

          {/* ARROW 1 */}
          <div className="flex flex-col items-center text-[#444]">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* MAIN NODE */}
          <div className="flex flex-col">
            {renderNode(datasetName, 'main')}
          </div>

          {/* ARROW 2 */}
          <div className="flex flex-col items-center text-[#444]">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* DOWNSTREAM */}
          <div className="flex flex-col gap-4">
            {allDownstreams.length === 0 ? (
              <span className="text-vercel-muted text-xs font-mono px-4 py-2 border border-dashed border-vercel-border rounded-lg">No downstreams</span>
            ) : (
              allDownstreams.map(node => renderNode(node, 'downstream'))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
