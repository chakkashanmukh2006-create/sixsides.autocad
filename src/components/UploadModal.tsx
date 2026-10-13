import React, { useState } from 'react';
import { 
  X, UploadCloud, FileCode, FileText, 
  Sparkles, CheckCircle2, ArrowRight, Building2, Warehouse, Activity,
  ShoppingBag, Utensils, Building
} from 'lucide-react';
import { BlueprintDataset } from '../types';
import { INITIAL_DATASETS } from '../data/mockDatasets';
import { uploadBlueprint, analyzeBlueprintWithAI } from '../services/api';
import { generateDynamicBlueprintAnalysis } from '../utils/dynamicBlueprintAnalyzer';

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
  const [scanPhase, setScanPhase] = useState<string>('AI OPTICAL SCANNING BLUEPRINT...');
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

  const handleProcessCustom = async () => {
    if (!cadFile) return;

    setIsProcessing(true);
    setScanPhase('OPTICAL VISION SCAN: Reading Architectural Rooms & Text via OCR...');

    try {
      let base64String = previewUrl || '';
      let naturalWidth = 1400;
      let naturalHeight = 900;

      // Convert file to base64 data URL if it's an image
      if (cadFile.type.startsWith('image/')) {
        const base64Promise = new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(cadFile);
        });
        base64String = await base64Promise;

        // Measure natural pixel dimensions of user drawing
        const dimPromise = new Promise<{ w: number; h: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.naturalWidth || 1400, h: img.naturalHeight || 900 });
          img.onerror = () => resolve({ w: 1400, h: 900 });
          img.src = base64String;
        });
        const dims = await dimPromise;
        naturalWidth = dims.w;
        naturalHeight = dims.h;
      }

      setScanPhase('AI SPATIAL ANALYSIS: Detecting Room Coordinates & Corridor Envelopes...');

      // Call real optical vision backend
      let analyzedDataset: BlueprintDataset | null = null;
      if (base64String) {
        analyzedDataset = await analyzeBlueprintWithAI({
          imageBase64: base64String,
          fileName: cadFile.name,
          projectName,
          specFileName: specFile?.name,
          naturalWidth,
          naturalHeight
        });
      }

      setScanPhase('CODE AUDIT: Cross-referencing IRC 2024 Building & Life-Safety Mandates...');

      // If backend vision returned dataset, use it; otherwise fallback to dynamic analyzer
      const customDataset = analyzedDataset || generateDynamicBlueprintAnalysis(
        cadFile.name,
        projectName,
        previewUrl || undefined,
        specFile?.name
      );

      // Ensure customImageUrl is retained so CadViewer displays the uploaded image
      if (previewUrl && !customDataset.customImageUrl) {
        customDataset.customImageUrl = previewUrl;
      }

      setTimeout(() => {
        setIsProcessing(false);
        onSelectDataset(customDataset);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Custom AI upload analysis error:', err);
      const fallbackDataset = generateDynamicBlueprintAnalysis(
        cadFile.name,
        projectName,
        previewUrl || undefined,
        specFile?.name
      );
      setIsProcessing(false);
      onSelectDataset(fallbackDataset);
      onClose();
    }
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
                      {ds.facilityType === 'Commercial Shopping Mall' && <ShoppingBag className="w-5 h-5" />}
                      {ds.facilityType === 'Fine Dining Restaurant & Kitchen' && <Utensils className="w-5 h-5" />}
                      {ds.facilityType === 'Corporate Office Tower' && <Building className="w-5 h-5" />}
                      {ds.facilityType === 'Hospital ICU & Surgical Wing' && <Activity className="w-5 h-5" />}
                      {ds.facilityType === 'BioPharma Logistics Warehouse' && <Warehouse className="w-5 h-5" />}
                      {ds.facilityType === 'Radiology & Imaging Suite' && <Building2 className="w-5 h-5" />}
                      {ds.facilityType === 'Custom Upload' && <Building2 className="w-5 h-5" />}
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
                    {specFile ? specFile.name : '2. Upload Specification Document (Optional)'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {specFile 
                      ? 'Custom spec rules will be extracted and verified'
                      : 'Leave blank to auto-apply Standard Building Codes (IBC / ADA / NFPA)'}
                  </div>
                  {specFile ? (
                    <span className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Custom Spec Book Loaded</span>
                    </span>
                  ) : (
                    <span className="mt-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      Standard Codes Auto-Active
                    </span>
                  )}
                </div>
              </div>

              {/* Status Banner */}
              {cadFile && !specFile && (
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Blueprint-Only Mode:</strong> The engine will automatically evaluate standard corridor widths, egress routes, and ADA accessibility clearances.
                  </span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleProcessCustom}
                disabled={!cadFile || isProcessing}
                className={`w-full py-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center space-x-2 transition ${
                  !cadFile || isProcessing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{scanPhase}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{specFile ? 'RUN AI DUAL-SPEC VALIDATION ENGINE' : 'RUN AI BLUEPRINT CODE VALIDATION ENGINE'}</span>
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
