import prisma from '../utils/prisma';
import { ChangeType, MetadataChangeEvent } from '@prisma/client';

export interface RootCauseResult {
  probableCause: string;
  confidence: number;
  relatedEvents: MetadataChangeEvent[];
}

/**
 * Analyzes recent metadata changes to deduce the probable root cause of a pipeline or data failure.
 * 
 * @param datasetId - The ID of the dataset to analyze
 * @returns An object containing the probable cause, confidence score (0 to 1), and related events.
 */
export const analyzeRootCause = async (datasetId: string): Promise<RootCauseResult> => {
  // Simulate getting the latest failure for the dataset.
  // In a real scenario, this might query an orchestrator (like Airflow) or Data Quality tool.
  console.log(`[Root Cause Service] Analyzing recent failures for dataset: ${datasetId}`);
  
  // Look at the last 10 MetadataChangeEvents
  const recentEvents = await prisma.metadataChangeEvent.findMany({
    where: { datasetId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (recentEvents.length === 0) {
    return {
      probableCause: 'No recent metadata changes detected. The failure might be purely data-related (e.g., bad data quality) or infrastructure-related.',
      confidence: 0.1,
      relatedEvents: [],
    };
  }

  let probableCause = 'Unknown';
  let confidence = 0.2;
  const suspiciousEvents: MetadataChangeEvent[] = [];

  // Evaluate events based on suspicion priority
  // High: COLUMN_REMOVED
  // Medium: LINEAGE_CHANGE, SCHEMA_CHANGE
  // Low: COLUMN_ADDED
  for (const event of recentEvents) {
    if (event.changeType === ChangeType.COLUMN_REMOVED) {
      // Highest priority: Break immediately
      const colName = (event.diff as any)?.old?.name || 'unknown';
      probableCause = `A column ('${colName}') was recently removed. This frequently breaks downstream pipelines expecting the column.`;
      confidence = 0.95;
      suspiciousEvents.push(event);
      break; 
    } 
    else if (event.changeType === ChangeType.LINEAGE_CHANGE) {
      if (confidence < 0.7) {
        probableCause = 'Upstream lineage changed recently. The source data format, timing, or availability might have been altered.';
        confidence = 0.75;
      }
      suspiciousEvents.push(event);
    } 
    else if (event.changeType === ChangeType.SCHEMA_CHANGE) {
      if (confidence < 0.6) {
        probableCause = 'Database schema configuration was modified. This might cause compatibility issues with existing queries.';
        confidence = 0.65;
      }
      suspiciousEvents.push(event);
    } 
    else if (event.changeType === ChangeType.COLUMN_ADDED) {
      suspiciousEvents.push(event);
      if (confidence <= 0.3) {
        probableCause = 'A new column was added. While usually backwards-compatible, it could affect `SELECT *` queries or strict schema validations downstream.';
        confidence = 0.4;
      }
    }
  }

  if (suspiciousEvents.length > 0 && probableCause === 'Unknown') {
    probableCause = 'Recent metadata modifications were detected, but they do not match typical breaking patterns.';
    confidence = 0.3;
  }

  return {
    probableCause,
    confidence,
    relatedEvents: suspiciousEvents,
  };
};
