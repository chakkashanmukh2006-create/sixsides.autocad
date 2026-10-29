export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'COMPLIANT';

export type DisciplineType = 
  | 'Architectural' 
  | 'LifeSafety' 
  | 'MEP' 
  | 'CommercialKitchen' 
  | 'HealthSafety' 
  | 'HealthcareEquipment' 
  | 'Accessibility' 
  | 'RetailZoning';

export interface DimensionCallout {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  measuredLabel: string;
  requiredLabel: string;
  orientation?: 'horizontal' | 'vertical';
  offset?: number;
}

export interface DefectAnnotation {
  id: string;
  title: string;
  discipline: DisciplineType;
  severity: DefectSeverity;
  status: 'FLAGGED' | 'RESOLVED' | 'IGNORED';
  specCode: string;
  specRequirement: string;
  actualMeasured: string;
  deviation: string;
  remediation: string;
  storyNarrative: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  targetLabel: string;
  layer: string;
  confidenceScore: number;
  dimensionCallout?: DimensionCallout;
}

export interface SpecificationRule {
  id: string;
  code: string;
  category: string;
  title: string;
  requirement: string;
  status: 'FAIL' | 'PASS' | 'WARNING';
  matchedEntitiesCount: number;
  threshold?: string;
}

export interface CadEntity {
  id: string;
  type: 
    | 'wall' 
    | 'door' 
    | 'room' 
    | 'equipment' 
    | 'dimension' 
    | 'corridor' 
    | 'hazard' 
    | 'duct' 
    | 'bed' 
    | 'table' 
    | 'chair'
    | 'sink' 
    | 'fryer' 
    | 'escalator' 
    | 'kiosk' 
    | 'shutter';
  layer: string;
  label?: string;
  subDetails?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  color?: string;
  subType?: string;
  status?: string;
  rotation?: number;
}

export type CadViewType = 'plan' | 'elevation' | 'section' | 'site';

export interface BlueprintDataset {
  id: string;
  name: string;
  facilityType: 
    | 'Commercial Shopping Mall' 
    | 'Fine Dining Restaurant & Kitchen' 
    | 'Corporate Office Tower' 
    | 'Hospital ICU & Surgical Wing' 
    | 'BioPharma Logistics Warehouse' 
    | 'Radiology & Imaging Suite' 
    | 'Residential Multi-Family' 
    | 'Commercial & Industrial Facility'
    | 'Custom Upload';
  filename: string;
  fileType: 'dxf' | 'dwg' | 'pdf' | 'img';
  viewType?: CadViewType;
  dimensions: {
    width: number;
    height: number;
    scaleLabel: string;
    unit: 'mm' | 'ft';
    realWidthMm: number;
    realHeightMm: number;
  };
  specDocument: {
    title: string;
    authority: string;
    version: string;
    summary: string;
  };
  storyNarrative: {
    summary: string;
    spatialFlow: string;
    safetyRisk: string;
    logisticalEfficiency: string;
    keyFindings: string[];
  };
  defects: DefectAnnotation[];
  specs: SpecificationRule[];
  cadEntities: CadEntity[];
  customImageUrl?: string;
}

export interface TrainingSample {
  id: string;
  blueprintName: string;
  specName: string;
  annotatedDefectsCount: number;
  status: 'ground_truth' | 'augmented' | 'synthetic';
  verifiedAccuracy: number;
  source: 'Kaggle: CVC-FP' | 'Kaggle: FloorPlans-500' | 'Kaggle: Tell2Design' | 'CubiCasa5k-Vector' | 'Benchmark-GroundTruth' | 'Synthetic-Augmented';
  domain: 'Commercial & Retail' | 'Restaurants & Kitchens' | 'Offices & Corporate' | 'Healthcare' | 'Residential' | 'Industrial';
  description: string;
}

export interface TrainingEpochRecord {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  mAP: number;
  recall: number;
}

export interface TrainingState {
  isTraining: boolean;
  epochsTotal: number;
  currentEpoch: number;
  currentTrainLoss: number;
  currentValLoss: number;
  mAP50: number;
  recall: number;
  history: TrainingEpochRecord[];
  activeWeights: string;
  logs: string[];
}
