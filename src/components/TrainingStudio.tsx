import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, CheckCircle, Flame, 
  Cpu, Database, Sparkles, Sliders, LineChart, 
  Layers, UploadCloud, Terminal, Award, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrainingSample, TrainingState, BlueprintDataset } from '../types';
import { INITIAL_TRAINING_SAMPLES } from '../data/mockDatasets';

interface TrainingStudioProps {
  onDeployTrainedModel: (newWeightsVersion: string) => void;
  activeWeights: string;
}

export const TrainingStudio: React.FC<TrainingStudioProps> = ({
  onDeployTrainedModel,
  activeWeights,
}) => {
  const [samples, setSamples] = useState<TrainingSample[]>(INITIAL_TRAINING_SAMPLES);
  const [backbone, setBackbone] = useState<string>('Spatial-ViT-LoRA');
  const [epochs, setEpochs] = useState<number>(10);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [batchSize, setBatchSize] = useState<number>(4);

  const [trainingState, setTrainingState] = useState<TrainingState>({
    isTraining: false,
    epochsTotal: 10,
    currentEpoch: 0,
    currentTrainLoss: 0.85,
    currentValLoss: 0.92,
    mAP50: 0.68,
    recall: 0.65,
    history: [
      { epoch: 1, trainLoss: 0.85, valLoss: 0.92, mAP: 0.68, recall: 0.65 }
    ],
    activeWeights: activeWeights,
    logs: [
      '[SYSTEM]: CAD-SPEC Training Engine Initialized.',
      `[LOAD]: Active Base Checkpoint: ${activeWeights}`,
      '[INFO]: Ready to calibrate spatial attention layers against ground-truth blueprints.'
    ]
  });

  const [deployedSuccess, setDeployedSuccess] = useState<boolean>(false);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [trainingState.logs]);

  // Execute interactive training simulation
  const handleStartTraining = () => {
    setDeployedSuccess(false);
    setTrainingState(prev => ({
      ...prev,
      isTraining: true,
      currentEpoch: 0,
      epochsTotal: epochs,
      history: [],
      logs: [
        ...prev.logs,
        `--- STARTING TRAINING RUN: ${backbone} (Epochs: ${epochs}, LR: ${learningRate}, Batch: ${batchSize}) ---`,
        '[PIPELINE]: Ingesting multi-page blueprints & architectural rule vectors...',
        '[AUGMENT]: Applying spatial rotations, affine scaling, layer masking...'
      ]
    }));

    let current = 0;
    const historyAcc: typeof trainingState.history = [];

    const interval = setInterval(() => {
      current += 1;
      const progress = current / epochs;

      // Realistic decay of loss and increase in accuracy
      const trainLoss = Number((0.95 * Math.exp(-2.2 * progress) + 0.05 + (Math.random() * 0.02 - 0.01)).toFixed(4));
      const valLoss = Number((1.02 * Math.exp(-2.0 * progress) + 0.08 + (Math.random() * 0.03 - 0.015)).toFixed(4));
      const mAP = Number((0.65 + 0.32 * (1 - Math.exp(-2.5 * progress)) + (Math.random() * 0.01 - 0.005)).toFixed(3));
      const recall = Number((0.62 + 0.34 * (1 - Math.exp(-2.4 * progress)) + (Math.random() * 0.01 - 0.005)).toFixed(3));

      const newRecord = { epoch: current, trainLoss, valLoss, mAP, recall };
      historyAcc.push(newRecord);

      setTrainingState(prev => ({
        ...prev,
        currentEpoch: current,
        currentTrainLoss: trainLoss,
        currentValLoss: valLoss,
        mAP50: mAP,
        recall: recall,
        history: [...historyAcc],
        logs: [
          ...prev.logs,
          `[Epoch ${String(current).padStart(2, '0')}/${epochs}] train_loss: ${trainLoss} | val_loss: ${valLoss} | mAP@50: ${(mAP * 100).toFixed(1)}% | recall: ${(recall * 100).toFixed(1)}%`
        ]
      }));

      if (current >= epochs) {
        clearInterval(interval);
        const newWeightTag = `v3.0-Trained-${Date.now().toString().slice(-4)}`;
        setTrainingState(prev => ({
          ...prev,
          isTraining: false,
          logs: [
            ...prev.logs,
            '✅ CONVERGENCE ACHIEVED: Model loss reached optimal plateau.',
            `💾 CHECKPOINT CREATED: CAD-Spec-${newWeightTag}.bin`,
            '🚀 Model ready for live deployment to inference engine!'
          ]
        }));
      }
    }, 700);
  };

  const handleDeploy = () => {
    const newVersion = `v3.0-Trained-${Date.now().toString().slice(-4)}`;
    onDeployTrainedModel(newVersion);
    setDeployedSuccess(true);
    setTrainingState(prev => ({
      ...prev,
      activeWeights: newVersion,
      logs: [
        ...prev.logs,
        `⭐ [DEPLOYED]: Inference pipeline successfully swapped to weights [${newVersion}]!`
      ]
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto cad-grid-bg select-none">
      {/* Studio Header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              STUDIO CALIBRATION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              ACTIVE WEIGHTS: <strong className="text-white">{trainingState.activeWeights}</strong>
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>AutoCAD Spatial AI Training & Calibration Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Fine-tune spatial-attention graph backbones using paired architectural floorplans and specification documents. Calibrate detection thresholds for code violations, ADA clearances, and room dimension limits.
          </p>
        </div>

        {/* Deploy Model Button */}
        <div className="flex items-center space-x-3">
          {deployedSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>ACTIVE IN INFERENCE</span>
            </span>
          )}
          <button
            onClick={handleDeploy}
            disabled={trainingState.isTraining || trainingState.currentEpoch === 0}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition shadow-xl ${
              trainingState.isTraining || trainingState.currentEpoch === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 border border-emerald-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>DEPLOY WEIGHTS TO INFERENCE</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Hyperparameters & Training Set (4 cols) */}
        <div className="col-span-4 space-y-6">
          {/* Hyperparameter Settings */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-cyan-300 font-mono uppercase mb-3 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Model Hyperparameters</span>
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">VISION-SPATIAL BACKBONE</label>
                <select
                  value={backbone}
                  disabled={trainingState.isTraining}
                  onChange={e => setBackbone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Spatial-ViT-LoRA">Spatial-ViT-LoRA (Transformer Attention)</option>
                  <option value="CAD-Graph-GNN">CAD-Graph-GNN (Topological Node Graph)</option>
                  <option value="ResNet101-FloorPlan">ResNet101-FloorPlan (Convolutional BBox)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>EPOCHS</span>
                  <span className="text-white font-bold">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={epochs}
                  disabled={trainingState.isTraining}
                  onChange={e => setEpochs(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>LEARNING RATE</span>
                  <span className="text-white font-bold">{learningRate}</span>
                </div>
                <select
                  value={learningRate}
                  disabled={trainingState.isTraining}
                  onChange={e => setLearningRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={0.0005}>0.0005 (Fine Precision Tuning)</option>
                  <option value={0.001}>0.0010 (Balanced Default)</option>
                  <option value={0.005}>0.0050 (Fast Convergence)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>BATCH SIZE</span>
                  <span className="text-white font-bold">{batchSize}</span>
                </div>
                <select
                  value={batchSize}
                  disabled={trainingState.isTraining}
                  onChange={e => setBatchSize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={2}>2 Blueprints / Step</option>
                  <option value={4}>4 Blueprints / Step</option>
                  <option value={8}>8 Blueprints / Step</option>
                </select>
              </div>

              <button
                onClick={handleStartTraining}
                disabled={trainingState.isTraining}
                className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition shadow-xl ${
                  trainingState.isTraining
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 cursor-wait animate-pulse'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
                }`}
              >
                {trainingState.isTraining ? (
                  <>
                    <Flame className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>TRAINING IN PROGRESS ({trainingState.currentEpoch}/{epochs})...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>START MODEL TRAINING</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Ground Truth Training Pairs */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Training Pairs ({samples.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                VERIFIED SET
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono max-h-60 overflow-y-auto">
              {samples.map(sample => (
                <div key={sample.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-white font-semibold mb-1">
                    <span className="truncate max-w-[200px]">{sample.blueprintName}</span>
                    <span className="text-[10px] text-emerald-400">{Math.round(sample.verifiedAccuracy * 100)}% Acc</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{sample.specName}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span>{sample.annotatedDefectsCount} ground-truth flaws</span>
                    <span className="uppercase text-cyan-400">{sample.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Metrics, Visual Curves & Terminal (8 cols) */}
        <div className="col-span-8 space-y-6">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">CURRENT EPOCH</div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {trainingState.currentEpoch} <span className="text-xs text-slate-500 font-normal">/ {epochs}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${(trainingState.currentEpoch / epochs) * 100}%` }}
                />
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">TRAINING LOSS</div>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {trainingState.currentTrainLoss}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">CROSS-ENTROPY</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">VALIDATION LOSS</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {trainingState.currentValLoss}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">GENERALIZATION</div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">mAP@50 ACCURACY</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {(trainingState.mAP50 * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] font-mono text-emerald-400/80 mt-1">Recall: {(trainingState.recall * 100).toFixed(1)}%</div>
            </div>
          </div>

          {/* Dynamic SVG Training Loss & mAP Curves */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white font-mono uppercase flex items-center space-x-2">
                <LineChart className="w-4 h-4 text-cyan-400" />
                <span>Live Training Curves (Loss & mAP@50)</span>
              </h3>
              <div className="flex items-center space-x-4 text-xs font-mono">
                <span className="flex items-center space-x-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Train Loss</span>
                </span>
                <span className="flex items-center space-x-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Val Loss</span>
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>mAP@50 Acc</span>
                </span>
              </div>
            </div>

            {/* SVG Visual Graph */}
            <div className="h-56 w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 relative flex items-center justify-center">
              {trainingState.history.length === 0 ? (
                <div className="text-center text-xs font-mono text-slate-500">
                  Click "START MODEL TRAINING" to generate live loss and precision curves.
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 50, 100, 150].map(y => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  ))}

                  {/* Train Loss Path (Cyan) */}
                  <path
                    d={trainingState.history.map((pt, i) => {
                      const x = (i / (epochs - 1 || 1)) * 580 + 10;
                      const y = Math.max(10, Math.min(190, pt.trainLoss * 180));
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="3"
                  />

                  {/* Val Loss Path (Amber) */}
                  <path
                    d={trainingState.history.map((pt, i) => {
                      const x = (i / (epochs - 1 || 1)) * 580 + 10;
                      const y = Math.max(10, Math.min(190, pt.valLoss * 180));
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />

                  {/* mAP Curve (Emerald) */}
                  <path
                    d={trainingState.history.map((pt, i) => {
                      const x = (i / (epochs - 1 || 1)) * 580 + 10;
                      const y = Math.max(10, Math.min(190, (1 - pt.mAP) * 220));
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />

                  {/* Data Dots on points */}
                  {trainingState.history.map((pt, i) => {
                    const x = (i / (epochs - 1 || 1)) * 580 + 10;
                    const yTrain = Math.max(10, Math.min(190, pt.trainLoss * 180));
                    const yMap = Math.max(10, Math.min(190, (1 - pt.mAP) * 220));
                    return (
                      <g key={i}>
                        <circle cx={x} cy={yTrain} r="4" fill="#00e5ff" />
                        <circle cx={x} cy={yMap} r="4" fill="#10b981" />
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Streaming Console Logs */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase mb-2 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Training Pipeline Console Stream</span>
            </h3>

            <div 
              ref={logContainerRef}
              className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-xs text-slate-300 h-36 overflow-y-auto space-y-1"
            >
              {trainingState.logs.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  {log.startsWith('✅') || log.startsWith('💾') || log.startsWith('⭐') ? (
                    <span className="text-emerald-400 font-bold">{log}</span>
                  ) : log.startsWith('[Epoch') ? (
                    <span className="text-cyan-300">{log}</span>
                  ) : log.startsWith('---') ? (
                    <span className="text-amber-400 font-semibold">{log}</span>
                  ) : (
                    <span className="text-slate-400">{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
