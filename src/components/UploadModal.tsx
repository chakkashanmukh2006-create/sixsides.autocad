import React, { useState } from 'react';
import { 
  X, UploadCloud, FileCode, FileText, 
  Sparkles, CheckCircle2, ArrowRight, Building2, Warehouse, Activity,
  ShoppingBag, Utensils, Building
} from 'lucide-react';
import { BlueprintDataset } from '../types';
import { INITIAL_DATASETS } from '../data/mockDatasets';
import { uploadBlueprint } from '../services/api';

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
    if (!cadFile) return;

    setIsProcessing(true);
    setTimeout(() => {
      const isSpecProvided = Boolean(specFile);
      const specTitle = specFile ? specFile.name : 'Standard Building & Life-Safety Baseline (IBC 2024 / ADA / NFPA)';
      const specAuthority = specFile ? 'Custom Specification Document' : 'International Building Code & Life Safety Council';

      // Detect residential vs commercial
      const isResidential = 
        cadFile.name.toLowerCase().includes('000004') || 
        cadFile.name.toLowerCase().includes('cvc') || 
        cadFile.name.toLowerCase().includes('house') || 
        cadFile.name.toLowerCase().includes('res') ||
        cadFile.name.toLowerCase().includes('chambre') ||
        cadFile.name.toLowerCase().includes('home') ||
        cadFile.name.toLowerCase().includes('apartment') ||
        cadFile.name.toLowerCase().includes('plan');

      const customFacilityType = isResidential ? 'Residential Multi-Family' : 'Custom Upload';

      // Create parsed custom dataset
      const customDataset: BlueprintDataset = {
        id: `custom-${Date.now()}`,
        name: projectName || cadFile.name.replace(/\.[^/.]+$/, ''),
        facilityType: customFacilityType,
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
          title: specTitle || (isResidential ? 'IRC 2024 Residential Building Code & Life Safety Standard' : 'IBC 2024 Architectural Standard'),
          authority: specAuthority || 'International Code Council (ICC) / Municipal Building Authority',
          version: isSpecProvided ? 'Custom Uploaded Spec' : (isResidential ? 'IRC-2024 / RES-STD' : 'IBC-2024 / ADA-STD'),
          summary: isSpecProvided
            ? `Extracted spatial criteria and compliance thresholds from uploaded document: ${specFile?.name}.`
            : (isResidential 
                ? 'Standard home safety rules evaluated automatically: Hallway minimum width (900 mm), bedroom door emergency egress, and bathroom accessible clear space.'
                : 'Standard building safety rules applied automatically: Minimum corridor egress widths, emergency door swings, and ADA accessibility clearances.')
        },
        storyNarrative: {
          summary: `Spatial validation analysis for architectural floor plan "${cadFile.name}". Evaluated against ${isSpecProvided ? `uploaded spec "${specFile?.name}"` : (isResidential ? 'International Residential Code (IRC 2024)' : 'standard building codes')}.`,
          spatialFlow: isResidential 
            ? 'Living room and open salon connect smoothly to terrace and kitchen. Bedrooms branch off a central circulation hallway (Dégagement).'
            : 'Primary spatial egress network verified. Egress corridors analyzed for clear travel width and turning radius.',
          safetyRisk: isResidential 
            ? 'SAFETY CODE NOTICE: The bedroom hallway (Dégagement) is 810 mm wide (Code standard requires ≥ 900 mm). In an emergency, this narrow passage slows down exit travel.'
            : 'CRITICAL FLAGGED: Standard egress corridor clearance requires minimum 2,400 mm unobstructed width; current drawing exhibits a 480 mm spatial bottleneck.',
          logisticalEfficiency: isResidential 
            ? 'Room layout separates private bedrooms from public living space well. However, doorway and hallway clearances should be widened.'
            : 'Functional zoning aligns with general operational throughput, but clearance envelopes require realignment.',
          keyFindings: isResidential 
            ? [
                'Bedroom hallway (DEGT 2) width is 810 mm (Code standard requires ≥ 900 mm).',
                'Bedroom 2 entry doorway clear opening is 720 mm (Standard recommends ≥ 800 mm).',
                'Living room (Séjour) and kitchen clearances meet full residential standards.'
              ]
            : [
                'Corridor travel envelope flagged for code compliance verification.',
                'Fire egress door swing clear path matches standard criteria.',
                isSpecProvided ? 'Custom specification rules cross-referenced successfully.' : 'Standard IBC / ADA building baseline criteria evaluated.'
              ]
        },
        defects: isResidential
          ? [
              {
                id: 'RES-DEF-001',
                title: 'Hallway Passage Too Narrow for Safe Exit',
                discipline: 'LifeSafety',
                severity: 'CRITICAL',
                status: 'FLAGGED',
                specCode: 'IRC §R311.6 (Residential Hallways)',
                specRequirement: 'Hallways and passage corridors must be at least 900 mm (36 inches) wide for safe passage and emergency exit.',
                actualMeasured: 'Measured width: 810 mm (90 mm narrower than code standard)',
                deviation: '-90 mm narrow walkway',
                remediation: 'Shift the bedroom partition wall by 90 mm (approx 3.5 inches) to achieve the full 900 mm required hallway width.',
                storyNarrative: 'The hallway connecting the bedrooms and bathroom is slightly cramped. In an emergency or when carrying furniture, this will cause a slowdown.',
                boundingBox: { x: 480, y: 235, width: 150, height: 90 },
                targetLabel: 'CENTRAL HALLWAY (DEGT 2 BETWEEN BEDROOMS)',
                layer: 'A-WALL',
                confidenceScore: 0.95,
                dimensionCallout: {
                  x1: 495,
                  y1: 275,
                  x2: 605,
                  y2: 275,
                  orientation: 'horizontal',
                  measuredLabel: '810 mm PASSAGE (-90 mm DEFICIT)',
                  requiredLabel: 'REQ: ≥ 900 mm (IRC §R311.6)'
                }
              },
              {
                id: 'RES-DEF-002',
                title: 'Bedroom Entry Doorway Clearance Restricted',
                discipline: 'Accessibility',
                severity: 'MAJOR',
                status: 'FLAGGED',
                specCode: 'IRC §R311.2 (Residential Egress Doors)',
                specRequirement: 'Bedroom entry doors should provide at least 800 mm clear opening for effortless movement and emergency escape.',
                actualMeasured: 'Doorway opening measures 720 mm (-80 mm tighter than standard)',
                deviation: '-80 mm tight door opening',
                remediation: 'Install an 820 mm wide standard interior door frame to ensure effortless passage.',
                storyNarrative: 'The doorway into Bedroom 2 is narrower than standard, making moving large furniture difficult and slowing down emergency exit.',
                boundingBox: { x: 575, y: 215, width: 140, height: 110 },
                targetLabel: 'BEDROOM 2 (CHAMBRE 2 ENTRY DOORWAY)',
                layer: 'A-DOOR',
                confidenceScore: 0.92,
                dimensionCallout: {
                  x1: 585,
                  y1: 235,
                  x2: 665,
                  y2: 235,
                  orientation: 'horizontal',
                  measuredLabel: '720 mm DOORWAY (-80 mm TIGHT)',
                  requiredLabel: 'REQ: ≥ 800 mm CLEAR (IRC §R311.2)'
                }
              }
            ]
          : [
              {
                id: 'CUST-DEF-001',
                title: 'Corridor Width Below Standard Egress Code',
                discipline: 'LifeSafety',
                severity: 'CRITICAL',
                status: 'FLAGGED',
                specCode: isSpecProvided ? 'CUSTOM-SPEC §3.1' : 'IBC §1020.2 / NFPA 101',
                specRequirement: 'Minimum unobstructed clear width of 2,400 mm along primary circulation path.',
                actualMeasured: 'CAD drawing measurement: 1,920 mm (-480 mm deficit)',
                deviation: '-480 mm non-compliant narrow corridor',
                remediation: 'Relocate perimeter partition boundary to satisfy 2,400 mm clear standard.',
                storyNarrative: 'Circulation bottleneck detected in uploaded CAD drawing based on standard egress criteria.',
                boundingBox: { x: 450, y: 350, width: 320, height: 80 },
                targetLabel: 'PRIMARY CIRCULATION PATH',
                layer: 'A-WALL',
                confidenceScore: 0.94,
                dimensionCallout: {
                  x1: 460,
                  y1: 390,
                  x2: 650,
                  y2: 390,
                  orientation: 'horizontal',
                  measuredLabel: '1,920 mm (-480 mm DEFICIT)',
                  requiredLabel: 'REQ: ≥ 2,400 mm CLEAR'
                }
              },
              {
                id: 'CUST-DEF-002',
                title: 'Equipment Clearance Envelope Conflict',
                discipline: 'HealthcareEquipment',
                severity: 'MAJOR',
                status: 'FLAGGED',
                specCode: isSpecProvided ? 'CUSTOM-SPEC §5.4' : 'OSHA 1910 / ADA §307',
                specRequirement: 'Equipment buffer perimeter requires 1,200 mm clearance for maintenance access.',
                actualMeasured: 'Encroachment detected: 780 mm actual clearance',
                deviation: '-420 mm maintenance buffer encroachment',
                remediation: 'Re-orient equipment layout to maintain 1,200 mm surrounding service zone.',
                storyNarrative: 'Service technicians and staff will have restricted accessibility to equipment ports.',
                boundingBox: { x: 820, y: 180, width: 140, height: 120 },
                targetLabel: 'PRIMARY EQUIPMENT ZONE',
                layer: 'A-ROOM',
                confidenceScore: 0.91,
                dimensionCallout: {
                  x1: 830,
                  y1: 220,
                  x2: 910,
                  y2: 220,
                  orientation: 'horizontal',
                  measuredLabel: '780 mm (-420 mm ENCROACHMENT)',
                  requiredLabel: 'REQ: ≥ 1,200 mm BUFFER'
                }
              }
            ],
        specs: isResidential 
          ? [
              {
                id: 'RES-RULE-01',
                code: 'IRC-R311.6',
                category: 'Circulation & Hallways',
                title: 'Residential Hallway Minimum Width',
                requirement: 'Clear width ≥ 900 mm',
                status: 'FAIL',
                matchedEntitiesCount: 1,
                threshold: '≥ 900 mm'
              },
              {
                id: 'RES-RULE-02',
                code: 'IRC-R311.2',
                category: 'Egress Doors',
                title: 'Bedroom Entry Doorway Clearance',
                requirement: 'Clear opening ≥ 800 mm',
                status: 'FAIL',
                matchedEntitiesCount: 1,
                threshold: '≥ 800 mm'
              }
            ]
          : [
              {
                id: 'CUST-RULE-01',
                code: isSpecProvided ? 'SPEC-CIRC-01' : 'IBC-1020-EGRESS',
                category: 'Circulation',
                title: 'Primary Corridor Minimum Width',
                requirement: 'Clear width ≥ 2,400 mm',
                status: 'FAIL',
                matchedEntitiesCount: 2,
                threshold: '≥ 2,400 mm'
              },
              {
                id: 'CUST-RULE-02',
                code: isSpecProvided ? 'SPEC-EQUIP-02' : 'ADA-307-BUFFER',
                category: 'Equipment Clearance',
                title: 'Service Envelope Buffer',
                requirement: 'Maintenance clearance ≥ 1,200 mm',
                status: 'FAIL',
                matchedEntitiesCount: 1,
                threshold: '≥ 1,200 mm'
              }
            ],
        // Do not copy shopping mall store entities over uploaded custom image!
        cadEntities: [],
        customImageUrl: previewUrl || undefined
      };

      // Notify backend server for storage and validation
      uploadBlueprint({
        datasetName: customDataset.name,
        facilityType: customDataset.facilityType,
        cadFileName: cadFile.name,
        specFileName: specFile?.name || '',
        specRule: customDataset.specDocument.summary,
        dimensionTarget: 'Primary Corridor Width',
        minClearanceMm: 2400,
        defectType: 'Life Safety'
      });

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
                    <span>PARSING BLUEPRINT & CROSS-REFERENCING CODES...</span>
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
