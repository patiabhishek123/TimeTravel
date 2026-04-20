import prisma from '../utils/prisma';
import { OpenMetadataService } from './openMetadataService';
import { ChangeType } from '@prisma/client';

/**
 * Creates a new metadata snapshot for a dataset and detects changes.
 * 
 * @param datasetName Name of the dataset
 * @returns The newly created MetadataSnapshot
 */
export const createSnapshot = async (datasetIdOrName: string) => {
  // Check if it's an existing dataset ID first
  let dataset = await prisma.dataset.findUnique({
    where: { id: datasetIdOrName }
  }).catch(() => null);

  // Fallback to finding by name if not found by ID
  if (!dataset) {
    dataset = await prisma.dataset.findFirst({
      where: { name: datasetIdOrName }
    });
  }

  // 1. Fetch metadata using the OpenMetadata service
  // Use the actual name of the dataset if we found it, otherwise use the provided string
  const datasetName = dataset ? dataset.name : datasetIdOrName;
  
  let metadata;
  try {
    const details = await OpenMetadataService.getDatasetDetails(datasetName);
    const lineage = await OpenMetadataService.getLineage(datasetName);
    
    metadata = {
      schema: details.tableSchema,
      columns: details.columns,
      lineage: lineage
    };
  } catch (error) {
    console.warn(`[Snapshot Service] OpenMetadata API unavailable. Falling back to mock data for ${datasetName}.`);
    metadata = OpenMetadataService.getMockMetadata(datasetName);
  }

  if (!dataset) {
    dataset = await prisma.dataset.create({
      data: {
        name: datasetName,
        description: `Automatically imported dataset: ${datasetName}`
      }
    });
  }

  // Get the most recent snapshot for comparison
  const lastSnapshot = await prisma.metadataSnapshot.findFirst({
    where: { datasetId: dataset.id },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Store a new MetadataSnapshot in the DB
  const newSnapshot = await prisma.metadataSnapshot.create({
    data: {
      datasetId: dataset.id,
      schema: metadata.schema,
      columns: metadata.columns,
      lineage: metadata.lineage
    }
  });

  // 3. Compare with last snapshot and store detected changes
  if (lastSnapshot) {
    await detectAndStoreChanges(dataset.id, newSnapshot.id, lastSnapshot, metadata);
  }

  return newSnapshot;
};

/**
 * Compares old snapshot with new metadata and creates events for detected changes.
 */
const detectAndStoreChanges = async (
  datasetId: string,
  newSnapshotId: string,
  lastSnapshot: any,
  newMetadata: any
) => {
  const eventsToCreate: any[] = [];

  // 1. Detect Schema Change
  if (JSON.stringify(lastSnapshot.schema) !== JSON.stringify(newMetadata.schema)) {
    eventsToCreate.push({
      datasetId,
      snapshotId: newSnapshotId,
      changeType: ChangeType.SCHEMA_CHANGE,
      description: 'Database schema configuration changed',
      diff: { old: lastSnapshot.schema, new: newMetadata.schema }
    });
  }

  // 2. Detect Lineage Change
  if (JSON.stringify(lastSnapshot.lineage) !== JSON.stringify(newMetadata.lineage)) {
    eventsToCreate.push({
      datasetId,
      snapshotId: newSnapshotId,
      changeType: ChangeType.LINEAGE_CHANGE,
      description: 'Dataset lineage changed',
      diff: { old: lastSnapshot.lineage, new: newMetadata.lineage }
    });
  }

  // 3. Detect Column Added/Removed
  const oldCols = Array.isArray(lastSnapshot.columns) ? lastSnapshot.columns : [];
  const newCols = Array.isArray(newMetadata.columns) ? newMetadata.columns : [];

  const oldColNames = oldCols.map((c: any) => c.name);
  const newColNames = newCols.map((c: any) => c.name);

  const addedColumns = newCols.filter((c: any) => !oldColNames.includes(c.name));
  const removedColumns = oldCols.filter((c: any) => !newColNames.includes(c.name));

  for (const col of addedColumns) {
    eventsToCreate.push({
      datasetId,
      snapshotId: newSnapshotId,
      changeType: ChangeType.COLUMN_ADDED,
      description: `Column added: ${col.name}`,
      diff: { new: col }
    });
  }

  for (const col of removedColumns) {
    eventsToCreate.push({
      datasetId,
      snapshotId: newSnapshotId,
      changeType: ChangeType.COLUMN_REMOVED,
      description: `Column removed: ${col.name}`,
      diff: { old: col }
    });
  }

  // Store all detected events in bulk
  if (eventsToCreate.length > 0) {
    await prisma.metadataChangeEvent.createMany({
      data: eventsToCreate
    });
    console.log(`[Snapshot Service] Stored ${eventsToCreate.length} change events for dataset: ${datasetId}`);
  } else {
    console.log(`[Snapshot Service] No changes detected for dataset: ${datasetId}`);
  }
};
