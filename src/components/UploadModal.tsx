import React, { useState } from 'react';
import { 
  X, UploadCloud, FileCode, FileText, 
  Sparkles, CheckCircle2, ArrowRight, Building2, Warehouse, Activity
} from 'lucide-react';
import { BlueprintDataset } from '../types';
import { INITIAL_DATASETS } from '../data/mockDatasets';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDataset: (dataset: BlueprintDataset) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSelectDataset,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // Custom upload state
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [specFile, setSpecFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCadFile(file);
      if (!projectName) {
        setProjectName(file.name.replace(/\.[^/.]+$/, ''));
      }
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSpecFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpecFile(e.target.files[0]);
    }
  };

  const handleProcessCustom = () => {
    if (!cadFile || !specFile) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Create parsed custom dataset
      const customDataset: BlueprintDataset = {
        id: `custom-${Date.now()}`,
        name: projectName || cadFile.name,
        facilityType: 'Custom Upload',
        filename: cadFile.name,
        fileType: cadFile.name.endsWith('.dxf') ? 'dxf' : cadFile.name.endsWith('.pdf') ? 'pdf' : 'img',
        dimensions: {
          width: 1400,
          height: 900,
          scaleLabel: '1:50 Metric (Auto-detected)',
          unit: 'mm',
          realWidthMm: 70000,
          realHeightMm: 45000,
        },
        specDocument: {
          title: specFile.name,
          authority: 'Custom Specification Authority',
          version: 'Uploaded Spec v1.0',
          summary: `Extracted spatial criteria and compliance thresholds from uploaded document: ${specFile.name}.`
        },
        storyNarrative: {
          summary: `Spatial validation analysis for custom architectural blueprint ${cadFile.name} cross-referenced against ${specFile.name}.`,
          spatialFlow: 'Primary spatial egress network verified. Egress corridors analyzed for clear travel width.',
          safetyRisk: 'CRITICAL FLAGGED: Specification requires 2,400mm clearance for critical corridors; current drawing shows potential pinch point violations.',
          logisticalEfficiency: 'Functional zoning aligns with general operational throughput, but clearance envelopes require realignment.',
          keyFindings: [
            'Corridor travel envelope flagged for code compliance verification.',
            'Fire egress door swing clear path matches standard criteria.',
            'Zoning spatial partitions validated against uploaded requirements.'
          ]
        },
        defects: [
          {
            id: 'CUST-DEF-001',
            title: 'Specification Mismatch on Corridors Clear Envelope',
            discipline: 'LifeSafety',
            severity: 'CRITICAL',
            status: 'FLAGGED',
            specCode: 'CUSTOM-SPEC §3.1',
            specRequirement: 'Minimum unobstructed clear width of 2,400 mm along primary circulation path.',
            actualMeasured: 'CAD drawing measurement: 1,920 mm (-480 mm code deficit)',
            deviation: '-480 mm non-compliant narrow corridor',
            remediation: 'Relocate perimeter partition boundary to satisfy 2,400 mm clear standard.',
            storyNarrative: 'Circulation bottleneck detected in uploaded CAD drawing based on specification rules.',
            boundingBox: { x: 450, y: 350, width: 320, height: 80 },
            targetLabel: 'PRIMARY CIRCULATION PATH',
            layer: 'A-WALL',
            confidenceScore: 0.94
          },
          {
            id: 'CUST-DEF-002',
            title: 'Equipment Clearance Envelope Conflict',
            discipline: 'HealthcareEquipment',
            severity: 'MAJOR',
            status: 'FLAGGED',
            specCode: 'CUSTOM-SPEC §5.4',
            specRequirement: 'Equipment buffer perimeter requires 1,200 mm clearance for maintenance access.',
            actualMeasured: 'Encroachment detected: 780 mm actual clearance',
            deviation: '-420 mm maintenance buffer encroachment',
            remediation: 'Re-orient equipment layout to maintain 1,200 mm surrounding service zone.',
            storyNarrative: 'Service technicians and staff will have restricted accessibility to equipment ports.',
            boundingBox: { x: 820, y: 180, width: 140, height: 120 },
            targetLabel: 'PRIMARY EQUIPMENT ZONE',
            layer: 'A-ROOM',
            confidenceScore: 0.91
          }
        ],
        specs: [
          {
            id: 'CUST-RULE-01',
            code: 'SPEC-CIRC-01',
            category: 'Circulation',
            title: 'Primary Corridor Minimum Width',
            requirement: 'Clear width ≥ 2,400 mm',
            status: 'FAIL',
            matchedEntitiesCount: 2,
            threshold: '≥ 2,400 mm'
          },
          {
            id: 'CUST-RULE-02',
            code: 'SPEC-EQUIP-02',
            category: 'Equipment Clearance',
            title: 'Service Envelope Buffer',
            requirement: 'Maintenance clearance ≥ 1,200 mm',
            status: 'FAIL',
            matchedEntitiesCount: 1,
            threshold: '≥ 1,200 mm'
          }
        ],
        cadEntities: INITIAL_DATASETS[0].cadEntities,
        customImageUrl: previewUrl || undefined
      };

      setIsProcessing(false);
      onSelectDataset(customDataset);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-darker w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Load Blueprints & Specification Documents</h2>
              <p className="text-xs text-slate-400">Choose a benchmark healthcare/logistics facility or upload custom files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              activeTab === 'presets'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            BENCHMARK FACILITY DATASETS
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CUSTOM AUTOCAD & SPEC UPLOAD
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-2">
                Select a pre-validated facility with real-world CAD entities, extracted specification criteria, and annotated defects:
              </div>

              {INITIAL_DATASETS.map(ds => (
                <div
                  key={ds.id}
                  onClick={() => {
                    onSelectDataset(ds);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition">
                      {ds.id === 'hospital-icu' && <Activity className="w-5 h-5" />}
                      {ds.id === 'pharma-warehouse' && <Warehouse className="w-5 h-5" />}
                      {ds.id === 'radiology-suite' && <Building2 className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                          {ds.name}
                        </h3>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ds.fileType.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400 mt-1">
                        CAD: <span className="text-slate-300">{ds.filename}</span> | Spec: <span className="text-cyan-400">{ds.specDocument.title}</span>
                      </div>

                      <div className="flex items-center space-x-3 mt-2 text-[11px] font-mono text-slate-400">
                        <span className="text-red-400 font-semibold">{ds.defects.length} Detected Flaws</span>
                        <span>•</span>
                        <span>{ds.specs.length} Validated Code Rules</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 font-bold transition flex items-center space-x-1">
                    <span>LOAD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">PROJECT / FACILITY NAME</label>
                <input
                  type="text"
                  placeholder="e.g. St. Anthony Trauma Center Phase 2"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Dropzone 1: CAD Blueprint */}
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 text-center transition flex flex-col items-center justify-center relative">
                  <input
                    type="file"
                    accept=".dxf,.dwg,.pdf,.png,.jpg,.jpeg,.svg"
                    onChange={handleCadFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-2">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {cadFile ? cadFile.name : '1. Upload AutoCAD / Blueprint'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Accepts .DXF, .DWG, .PDF, or High-Res Blueprint Images
                  </div>
                  {cadFile && (
                    <span className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Blueprint Loaded</span>
                    </span>
                  )}
                </div>

                {/* Dropzone 2: Specification Document */}
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 text-center transition flex flex-col items-center justify-center relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.json"
                    onChange={handleSpecFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {specFile ? specFile.name : '2. Upload Specification Document'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Building codes, FGI standards, or room criteria sheets
                  </div>
                  {specFile && (
                    <span className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Spec Book Loaded</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProcessCustom}
                disabled={!cadFile || !specFile || isProcessing}
                className={`w-full py-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center space-x-2 transition ${
                  !cadFile || !specFile || isProcessing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>PARSING BLUEPRINT & CROSS-REFERENCING SPECS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>RUN AI SPECIFICATION VALIDATION ENGINE</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
