import React, { useState } from 'react';
import { 
  AlertCircle, AlertTriangle, CheckCircle2, 
  Search, ExternalLink, ShieldAlert, BookOpen, 
  Compass, Volume2, VolumeX, Sparkles, SlidersHorizontal, Check, ArrowRight
} from 'lucide-react';
import { BlueprintDataset, DefectAnnotation, DefectSeverity } from '../types';

interface PredictionsPanelProps {
  dataset: BlueprintDataset;
  selectedDefectId: string | null;
  onSelectDefect: (defectId: string) => void;
  onResolveDefect: (defectId: string) => void;
}

export const PredictionsPanel: React.FC<PredictionsPanelProps> = ({
  dataset,
  selectedDefectId,
  onSelectDefect,
  onResolveDefect,
}) => {
  const [activeTab, setActiveTab] = useState<'defects' | 'specs' | 'storyteller'>('defects');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Compute compliance score
  const totalDefects = dataset.defects.length;
  const criticalCount = dataset.defects.filter(d => d.severity === 'CRITICAL' && d.status === 'FLAGGED').length;
  const majorCount = dataset.defects.filter(d => d.severity === 'MAJOR' && d.status === 'FLAGGED').length;
  const minorCount = dataset.defects.filter(d => d.severity === 'MINOR' && d.status === 'FLAGGED').length;
  const resolvedCount = dataset.defects.filter(d => d.status === 'RESOLVED').length;

  const compliancePercentage = Math.max(
    0,
    Math.round(100 - (criticalCount * 22 + majorCount * 12 + minorCount * 5))
  );

  // Filter defects
  const filteredDefects = dataset.defects.filter(d => {
    const matchesSeverity = filterSeverity === 'ALL' || d.severity === filterSeverity || (filterSeverity === 'RESOLVED' && d.status === 'RESOLVED');
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  // Text-To-Speech Architectural Storyteller reader
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const narrativeText = `${dataset.storyNarrative.summary}. Spatial Flow: ${dataset.storyNarrative.spatialFlow}. Safety and Life Code Risk: ${dataset.storyNarrative.safetyRisk}.`;
      const utterance = new SpeechSynthesisUtterance(narrativeText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel-darker border-l border-slate-800 select-none">
      {/* Header & Overall Compliance Scorecard */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                SPEC-ENGINE V2.4
              </span>
              <span className="text-[11px] font-mono text-slate-400">{dataset.facilityType}</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">{dataset.name}</h2>
          </div>

          {/* Radial / Numerical Compliance Gauge */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline space-x-1">
              <span className={`text-2xl font-black font-mono ${
                compliancePercentage > 85 ? 'text-emerald-400' : compliancePercentage > 60 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {compliancePercentage}%
              </span>
              <span className="text-[11px] font-mono text-slate-400">SCORE</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {compliancePercentage > 85 ? 'SPEC COMPLIANT' : 'VIOLATIONS DETECTED'}
            </span>
          </div>
        </div>

        {/* Quick Severity Metric Counters */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
            <div className="text-sm font-bold text-red-400">{criticalCount}</div>
            <div className="text-[9px] text-red-400/80 uppercase">Critical</div>
          </div>
          <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
            <div className="text-sm font-bold text-amber-400">{majorCount}</div>
            <div className="text-[9px] text-amber-400/80 uppercase">Major</div>
          </div>
          <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300">
            <div className="text-sm font-bold text-purple-400">{minorCount}</div>
            <div className="text-[9px] text-purple-400/80 uppercase">Minor</div>
          </div>
          <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <div className="text-sm font-bold text-emerald-400">{resolvedCount}</div>
            <div className="text-[9px] text-emerald-400/80 uppercase">Resolved</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mt-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('defects')}
            className={`flex-1 py-2 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'defects'
                ? 'border-red-500 text-red-400 font-bold bg-red-950/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>FLAWS ({dataset.defects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('storyteller')}
            className={`flex-1 py-2 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'storyteller'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>STORYTELLER</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-2 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'specs'
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>SPECS ({dataset.specs.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Defect Inspector */}
      {activeTab === 'defects' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filter & Search Bar */}
          <div className="p-3 border-b border-slate-800/80 flex items-center space-x-2 bg-slate-900/30">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search flaw, code, room..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Severity Pill Filter */}
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="CRITICAL">🔴 CRITICAL</option>
              <option value="MAJOR">🟠 MAJOR</option>
              <option value="MINOR">🟣 MINOR</option>
              <option value="RESOLVED">🟢 RESOLVED</option>
            </select>
          </div>

          {/* Defect Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredDefects.map(defect => {
              const isSelected = defect.id === selectedDefectId;
              const isResolved = defect.status === 'RESOLVED';

              return (
                <div
                  key={defect.id}
                  onClick={() => onSelectDefect(defect.id)}
                  className={`p-3.5 rounded-xl transition cursor-pointer relative border ${
                    isSelected
                      ? 'bg-red-950/20 border-red-500 shadow-lg shadow-red-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        defect.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : defect.severity === 'MAJOR'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-purple-950 text-purple-400 border border-purple-800'
                      }`}>
                        {defect.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">{defect.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({Math.round(defect.confidenceScore * 100)}% Conf)</span>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {defect.discipline}
                    </span>
                  </div>

                  {/* Title & Target */}
                  <h3 className="text-sm font-semibold text-white leading-snug mb-1">
                    {defect.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-300 mb-2.5 flex items-center space-x-1">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>TARGET: {defect.targetLabel}</span>
                  </div>

                  {/* Code Mandate & Actual Measured Comparison */}
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono space-y-1.5 mb-2.5">
                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">SPEC MANDATE:</span>
                      <span className="text-slate-200 text-right">{defect.specCode}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 pl-2 border-l border-slate-700">
                      {defect.specRequirement}
                    </div>

                    <div className="flex items-start justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-red-400">MEASURED FLIP:</span>
                      <span className="text-red-300 font-bold text-right">{defect.deviation}</span>
                    </div>
                    <div className="text-[11px] text-red-200/90 pl-2 border-l border-red-500/50">
                      {defect.actualMeasured}
                    </div>
                  </div>

                  {/* Storyteller Risk Narrative */}
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-3 italic">
                    "{defect.storyNarrative}"
                  </p>

                  {/* Remediation Note */}
                  <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-200 mb-3 flex items-start space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300 font-mono text-[10px] block">RECOMMENDED REMEDIATION:</strong>
                      {defect.remediation}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs font-mono">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDefect(defect.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/40 border border-red-500/40 transition flex items-center space-x-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>ZOOM ON CAD CANVAS</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolveDefect(defect.id);
                      }}
                      className={`px-2 py-1 rounded transition flex items-center space-x-1 ${
                        isResolved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isResolved ? 'RESOLVED' : 'MARK RESOLVED'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Multimodal Architectural Storyteller */}
      {activeTab === 'storyteller' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase font-bold">MULTIMODAL ARCHITECTURAL AUDITOR</div>
              <div className="text-[11px] text-slate-400">Contextual Narrative Analysis of Blueprint & Specifications</div>
            </div>

            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-lg transition flex items-center space-x-1 text-xs font-mono ${
                isSpeaking 
                  ? 'bg-cyan-500 text-slate-950 font-bold' 
                  : 'bg-slate-800 text-slate-300 hover:text-cyan-400'
              }`}
              title="Voice Reader"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'STOP AUDIO' : 'READ STORY'}</span>
            </button>
          </div>

          {/* Narrative Synopsis */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>SPATIAL CONTEXT & FUNCTIONAL PURPOSE</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {dataset.storyNarrative.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>CIRCULATION FLOW & OPERATIONAL LOGISTICS</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {dataset.storyNarrative.spatialFlow}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
            <h4 className="text-xs font-bold text-red-300 font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>LIFE SAFETY CODE EXPOSURE & LIABILITY RISK</span>
            </h4>
            <p className="text-xs text-red-200 leading-relaxed">
              {dataset.storyNarrative.safetyRisk}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
              KEY ARCHITECTURAL FINDINGS
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {dataset.storyNarrative.keyFindings.map((finding, idx) => (
                <li key={idx} className="leading-snug">{finding}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Specification Matrix */}
      {activeTab === 'specs' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE SPECIFICATION DOCUMENT</div>
            <h3 className="text-xs font-bold text-white mt-0.5">{dataset.specDocument.title}</h3>
            <div className="text-[11px] text-cyan-300 font-mono mt-1">Authority: {dataset.specDocument.authority}</div>
            <p className="text-[11px] text-slate-300 mt-1">{dataset.specDocument.summary}</p>
          </div>

          {dataset.specs.map(rule => (
            <div
              key={rule.id}
              className={`p-3 rounded-xl border ${
                rule.status === 'FAIL'
                  ? 'bg-red-950/20 border-red-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    rule.status === 'FAIL' ? 'bg-red-900 text-red-300' : 'bg-emerald-900 text-emerald-300'
                  }`}>
                    {rule.status === 'FAIL' ? '❌ VIOLATED' : '✅ COMPLIANT'}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{rule.code}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{rule.category}</span>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 mt-1">{rule.title}</h4>
              <p className="text-xs font-mono text-slate-400 mt-1">Mandate: {rule.requirement}</p>
              {rule.threshold && (
                <div className="text-[10px] font-mono text-cyan-300 mt-1">Threshold: {rule.threshold}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
