import { useState } from 'react';
import RiskGauge from './RiskGauge';
import ThreatIndicators from './ThreatIndicators';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  PhoneCall, 
  Info,
  Terminal,
  Lock
} from './Icons';

/**
 * ResultsDashboard Component
 * Modular, high-trust cybersecurity results dashboard featuring:
 * - Prominent Risk Score Gauge & Severity Badge
 * - Categorized Threat Indicators Grid
 * - Detailed Heuristic Findings
 * - Clear, Actionable Defensive Guidance
 * - Incident Reporting & Verification Actions
 */
export default function ResultsDashboard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isHighRisk = result.riskLevel === 'high' || result.score >= 12;
  const isMediumRisk = result.riskLevel === 'medium' || (result.score >= 5 && result.score < 12);
  const isSafe = !isHighRisk && !isMediumRisk;

  function handleCopyReport() {
    const reportText = `[UPI SCAM ANALYZER INCIDENT REPORT]
Target: ${result.input}
Type: ${result.type?.toUpperCase()}
Verdict: ${result.status}
Threat Score: ${result.score} / 25 (${Math.round((result.score / 25) * 100)}% Risk Index)
Confidence: ${result.confidence}%
Summary: ${result.result}

Key Findings:
${result.reasons?.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Actionable Guidance:
${result.advice}

National Cyber Crime Helpline: 1930 (https://cybercrime.gov.in)
Verified by UPI Scam Analyzer Threat Engine.`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Primary Result Banner & Risk Gauge Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Accent Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isHighRisk ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' :
            isMediumRisk ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]' :
            'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Risk Gauge */}
          <div className="lg:col-span-5 flex justify-center">
            <RiskGauge
              score={result.score}
              maxScore={25}
              status={result.status}
              confidence={result.confidence}
              riskLevel={result.riskLevel}
            />
          </div>

          {/* Right Column: Threat Summary & Target Metadata */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                {result.type?.toUpperCase()} ANALYSIS
              </span>
              <span
                className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  isHighRisk
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : isMediumRisk
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {result.status}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {result.result}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {result.findings}
              </p>
            </div>

            {/* Target Value Bar */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-slate-500 text-xs font-mono font-semibold uppercase">
                  Target:
                </span>
                <span className="text-xs font-mono font-medium text-blue-300 truncate" title={result.input}>
                  {result.input}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/80 flex-shrink-0"
                title="Copy forensic incident report"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Report</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-500">Confidence Score</div>
                <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">{result.confidence}% Verified</div>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-500">Heuristic Flags</div>
                <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                  {result.reasons?.length || 0} Patterns
                </div>
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono uppercase text-slate-500">Intervention SLA</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Golden Hour (1930)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Threat Indicators Component */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
          Categorized Threat Indicators
        </h3>
        <ThreatIndicators indicators={result.indicators} type={result.type} />
      </div>

      {/* Granular Detection Findings & Actionable Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Detection Findings */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Heuristic & Pattern Detection Findings
              </h4>
              <p className="text-[11px] text-slate-400">
                Breakdown of matched indicators and signature evaluations
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {result.reasons && result.reasons.length > 0 ? (
              result.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {reason}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                No active threats detected. All tested parameters match legitimate baseline patterns.
              </div>
            )}
          </div>
        </div>

        {/* Box 2: Actionable Security Recommendations */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isHighRisk ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              isMediumRisk ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Actionable Defense Recommendations
              </h4>
              <p className="text-[11px] text-slate-400">
                Recommended user response protocol based on risk level
              </p>
            </div>
          </div>

          {/* Primary Advice Pill */}
          <div className={`p-4 rounded-xl border ${
            isHighRisk ? 'bg-red-500/10 border-red-500/30 text-red-200' :
            isMediumRisk ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-xs leading-relaxed">
                {result.advice}
              </span>
            </div>
          </div>

          {/* Safety Checklist */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>UPI PIN Rule:</strong> UPI PIN is strictly for sending money. Receiving money never requires entering a PIN.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Beneficiary Verification:</strong> Always confirm the legal recipient name displayed on your banking screen before authorizing.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>National Cyber Helpline:</strong> Dial 1930 immediately if money was transferred to lock recipient accounts within the golden hour.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Scan Another Entity</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-950/40"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Report to Cyber Cell 1930</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
