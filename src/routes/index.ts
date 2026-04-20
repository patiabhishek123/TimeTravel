import { Router } from 'express';
import { checkHealth } from '../controllers/healthController';
import {
  triggerSnapshot,
  getDatasetTimeline,
  getDatasetSnapshots,
  getRootCauseAnalysis,
  listDatasets
} from '../controllers/datasetController';

const router = Router();

// Health check
router.get('/health', checkHealth);

// Datasets list
router.get('/datasets', listDatasets);

// Dataset Metadata Snapshot & Timeline endpoints
router.post('/snapshot/:datasetName', triggerSnapshot);
router.get('/timeline/:datasetId', getDatasetTimeline);
router.get('/snapshots/:datasetId', getDatasetSnapshots);
router.get('/analyze/:datasetId', getRootCauseAnalysis);

export default router;
