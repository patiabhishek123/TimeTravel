export interface MetadataChangeEvent {
  id: string;
  datasetId: string;
  snapshotId: string;
  changeType: 'SCHEMA_CHANGE' | 'COLUMN_ADDED' | 'COLUMN_REMOVED' | 'LINEAGE_CHANGE';
  description: string;
  diff: any;
  createdAt: string;
}

export interface RootCauseResult {
  probableCause: string;
  confidence: number;
  relatedEvents: MetadataChangeEvent[];
}
