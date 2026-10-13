import { BlueprintDataset, TrainingSample } from '../types';
import { INITIAL_DATASETS, INITIAL_TRAINING_SAMPLES } from '../data/mockDatasets';

const API_BASE = '/api';

export interface HealthStatus {
  status: string;
  version: string;
  service: string;
  activeWeights: string;
  uptime: number;
  datasetsCount: number;
  timestamp: string;
}

export interface TrainingRunResponse {
  success: boolean;
  epochs: number;
  backbone: string;
  domain: string;
  checkpoint: string;
  finalMetrics: {
    epoch: number;
    trainLoss: number;
    valLoss: number;
    mAP: number;
    recall: number;
  };
  history: Array<{
    epoch: number;
    trainLoss: number;
    valLoss: number;
    mAP: number;
    recall: number;
  }>;
}

// 1. Healthcheck
export async function getBackendHealth(): Promise<HealthStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// 2. Fetch Datasets
export async function getDatasets(): Promise<BlueprintDataset[]> {
  try {
    const res = await fetch(`${API_BASE}/datasets`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data.datasets || INITIAL_DATASETS;
  } catch (err) {
    console.warn('[CAD-Spec API] Backend unreachable, falling back to local datasets:', err);
    return INITIAL_DATASETS;
  }
}

// 3. Upload and Process Blueprint
export async function uploadBlueprint(payload: {
  dataset?: BlueprintDataset;
  datasetName?: string;
  facilityType?: string;
  cadFileName?: string;
  specFileName?: string;
  specRule?: string;
  dimensionTarget?: string;
  minClearanceMm?: number;
  defectType?: string;
  customImageUrl?: string;
}): Promise<BlueprintDataset | null> {
  try {
    const res = await fetch(`${API_BASE}/datasets/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.dataset;
  } catch (err) {
    console.warn('[CAD-Spec API] Upload failed or backend unreachable:', err);
    return null;
  }
}

// 4. Toggle Defect Status
export async function toggleDefectResolution(datasetId: string, defectId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/defects/${defectId}`, {
      method: 'PATCH'
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 5. Fetch Training Samples
export async function getTrainingSamples(): Promise<TrainingSample[]> {
  try {
    const res = await fetch(`${API_BASE}/training/samples`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data.samples || INITIAL_TRAINING_SAMPLES;
  } catch {
    return INITIAL_TRAINING_SAMPLES;
  }
}

// 6. Run Training Simulation
export async function runTrainingJob(payload: {
  epochs: number;
  learningRate: number;
  backbone: string;
  domain: string;
}): Promise<TrainingRunResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/training/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Training request failed');
    return await res.json();
  } catch (err) {
    console.warn('[CAD-Spec API] Training job API failed:', err);
    return null;
  }
}

// 7. Deploy Model Weights
export async function deployModelWeights(weightsVersion: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/training/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weightsVersion })
    });
    return res.ok;
  } catch {
    return false;
  }
}
