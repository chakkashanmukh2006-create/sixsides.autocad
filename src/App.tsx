import React, { useState } from 'react';
import { 
  Building2, Cpu, UploadCloud, Layers, 
  Sparkles, CheckCircle2, ChevronDown, Sliders, ExternalLink
} from 'lucide-react';
import { BlueprintDataset } from './types';
import { INITIAL_DATASETS } from './data/mockDatasets';
import { CadViewer } from './components/CadViewer';
import { PredictionsPanel } from './components/PredictionsPanel';
import { TrainingStudio } from './components/TrainingStudio';
import { UploadModal } from './components/UploadModal';

export const App: React.FC = () => {
  const [datasets, setDatasets] = useState<BlueprintDataset[]>(INITIAL_DATASETS);
  const [currentDatasetId, setCurrentDatasetId] = useState<string>(INITIAL_DATASETS[0].id);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'workspace' | 'training'>('workspace');
  const [activeWeights, setActiveWeights] = useState<string>('v2.4-Standard');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Active layers state
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'A-WALL': true,
    'A-ROOM': true,
    'A-DOOR': true,
    'EQUIPMENT': true,
    'DEFECTS': true,
  });

  const currentDataset = datasets.find(d => d.id === currentDatasetId) || datasets[0];

  const handleToggleLayer = (layer: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleSelectDefect = (defectId: string) => {
    setSelectedDefectId(prev => (prev === defectId ? null : defectId));
  };

  const handleResolveDefect = (defectId: string) => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id !== currentDataset.id) return ds;
      return {
        ...ds,
        defects: ds.defects.map(def => {
          if (def.id !== defectId) return def;
          return {
            ...def,
            status: def.status === 'RESOLVED' ? 'FLAGGED' : 'RESOLVED',
          };
        }),
      };
    }));
  };

  const handleDeployTrainedModel = (newWeightsVersion: string) => {
    setActiveWeights(newWeightsVersion);
    // Recalibrate current dataset defect confidence scores to reflect newly trained weights
    setDatasets(prev => prev.map(ds => ({
      ...ds,
      defects: ds.defects.map(d => ({
        ...d,
        confidenceScore: Math.min(0.99, Number((d.confidenceScore * 1.05).toFixed(2))),
      })),
    })));
    setActiveView('workspace');
  };

  const handleSelectDataset = (newDataset: BlueprintDataset) => {
    // If it's a new custom dataset, add it to list
    if (!datasets.some(d => d.id === newDataset.id)) {
      setDatasets(prev => [newDataset, ...prev]);
    }
    setCurrentDatasetId(newDataset.id);
    setSelectedDefectId(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Engineering Navbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-extrabold tracking-wide font-mono text-white">
                CAD-SPEC <span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Architectural Blueprint & Healthcare Validation Engine
            </p>
          </div>
        </div>

        {/* Facility Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={currentDatasetId}
              onChange={e => {
                setCurrentDatasetId(e.target.value);
                setSelectedDefectId(null);
              }}
              className="appearance-none bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-white font-mono rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-lg"
            >
              {datasets.map(ds => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} ({ds.fileType.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Model Weights Badge */}
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">MODEL:</span>
            <span className="text-cyan-300 font-bold">{activeWeights}</span>
          </div>
        </div>

        {/* View Switchers & Upload Action */}
        <div className="flex items-center space-x-2">
          {/* Workspace Tab */}
          <button
            onClick={() => setActiveView('workspace')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center space-x-1.5 ${
              activeView === 'workspace'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>CAD VIEWER</span>
          </button>

          {/* Training Studio Tab */}
          <button
            onClick={() => setActiveView('training')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center space-x-1.5 ${
              activeView === 'training'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>TRAIN MODEL</span>
          </button>

          <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>

          {/* Upload Documents Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-mono font-semibold transition flex items-center space-x-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>LOAD CAD & SPECS</span>
          </button>
        </div>
      </header>

      {/* Main Body Area */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        {activeView === 'workspace' ? (
          <div className="w-full h-full flex">
            {/* Left Pane: Interactive CAD Canvas Viewer (64% Width) */}
            <section className="w-[64%] h-full relative">
              <CadViewer
                dataset={currentDataset}
                selectedDefectId={selectedDefectId}
                onSelectDefect={handleSelectDefect}
                activeLayers={activeLayers}
                onToggleLayer={handleToggleLayer}
              />
            </section>

            {/* Right Pane: Predictions, Defect Inspector & Storyteller (36% Width) */}
            <section className="w-[36%] h-full">
              <PredictionsPanel
                dataset={currentDataset}
                selectedDefectId={selectedDefectId}
                onSelectDefect={handleSelectDefect}
                onResolveDefect={handleResolveDefect}
              />
            </section>
          </div>
        ) : (
          /* Training & Calibration Studio View */
          <TrainingStudio
            onDeployTrainedModel={handleDeployTrainedModel}
            activeWeights={activeWeights}
          />
        )}
      </main>

      {/* Dual Document Upload & Selection Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectDataset={handleSelectDataset}
      />
    </div>
  );
};

export default App;
