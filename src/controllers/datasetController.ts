import { Request, Response } from 'express';
import { createSnapshot } from '../services/snapshotService';
import { analyzeRootCause } from '../services/rootCauseService';
import { OpenMetadataService } from '../services/openMetadataService';
import prisma from '../utils/prisma';

const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const resolveDatasetId = async (idOrName: string) => {
  let dataset = null;
  if (isUUID(idOrName)) {
    dataset = await prisma.dataset.findUnique({ where: { id: idOrName } }).catch(() => null);
  }
  if (!dataset) {
    dataset = await prisma.dataset.findFirst({ where: { name: idOrName } });
  }
  return dataset?.id;
};

export const listDatasets = async (req: Request, res: Response) => {
  try {
    const datasets = await OpenMetadataService.listDatasets();
    return res.status(200).json({
      message: 'Datasets fetched from OpenMetadata successfully',
      data: datasets,
    });
  } catch (error: any) {
    console.warn(`[Controller] OpenMetadata API unavailable. Falling back to local demo list.`);
    return res.status(200).json({
      message: 'Fallback datasets fetched successfully',
      data: [
        { id: 'demo-1', name: 'demo_transactions', fullyQualifiedName: 'demo_transactions' },
        { id: 'demo-2', name: 'user_analytics', fullyQualifiedName: 'user_analytics' }
      ],
    });
  }
};

export const triggerSnapshot = async (req: Request, res: Response) => {
  const datasetName = req.params.datasetName as string;

  try {
    if (!datasetName) {
      return res.status(400).json({ error: 'datasetName parameter is required' });
    }

    const snapshot = await createSnapshot(datasetName);

    return res.status(201).json({
      message: 'Snapshot created successfully',
      data: snapshot,
    });
  } catch (error: any) {
    console.error(`Error in triggerSnapshot: ${error.message}`);
    return res.status(500).json({
      error: 'Failed to create snapshot',
      details: error.message,
    });
  }
};

export const getDatasetTimeline = async (req: Request, res: Response) => {
  const datasetParam = req.params.datasetId as string;

  try {
    if (!datasetParam) return res.status(400).json({ error: 'datasetId parameter is required' });

    const datasetId = await resolveDatasetId(datasetParam);
    if (!datasetId) return res.status(404).json({ error: 'Dataset not found' });

    const events = await prisma.metadataChangeEvent.findMany({
      where: { datasetId },
      orderBy: { createdAt: 'desc' }, 
    });

    return res.status(200).json({
      message: 'Timeline events fetched successfully',
      data: events,
    });
  } catch (error: any) {
    console.error(`Error in getDatasetTimeline: ${error.message}`);
    return res.status(500).json({
      error: 'Failed to fetch timeline events',
      details: error.message,
    });
  }
};

export const getDatasetSnapshots = async (req: Request, res: Response) => {
  const datasetParam = req.params.datasetId as string;

  try {
    if (!datasetParam) return res.status(400).json({ error: 'datasetId parameter is required' });

    const datasetId = await resolveDatasetId(datasetParam);
    if (!datasetId) return res.status(404).json({ error: 'Dataset not found' });

    const snapshots = await prisma.metadataSnapshot.findMany({
      where: { datasetId },
      orderBy: { createdAt: 'desc' }, 
      include: {
        events: true, 
      }
    });

    return res.status(200).json({
      message: 'Snapshots fetched successfully',
      data: snapshots,
    });
  } catch (error: any) {
    console.error(`Error in getDatasetSnapshots: ${error.message}`);
    return res.status(500).json({
      error: 'Failed to fetch snapshots',
      details: error.message,
    });
  }
};

export const getRootCauseAnalysis = async (req: Request, res: Response) => {
  const datasetParam = req.params.datasetId as string;

  try {
    if (!datasetParam) return res.status(400).json({ error: 'datasetId parameter is required' });

    const datasetId = await resolveDatasetId(datasetParam);
    if (!datasetId) return res.status(404).json({ error: 'Dataset not found' });

    const analysis = await analyzeRootCause(datasetId);

    return res.status(200).json({
      message: 'Root cause analysis completed successfully',
      data: analysis,
    });
  } catch (error: any) {
    console.error(`Error in getRootCauseAnalysis: ${error.message}`);
    return res.status(500).json({
      error: 'Failed to perform root cause analysis',
      details: error.message,
    });
  }
};
