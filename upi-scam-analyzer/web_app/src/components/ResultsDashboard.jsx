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
  Terminal,
  Lock
} from './Icons';

/**
 * ResultsDashboard Component
 * High-trust, professional cybersecurity forensic report.
 * Provides clear risk status, granular findings, and immediate actionable steps.
 */
export default function ResultsDashboard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isHighRisk = result.riskLevel === 'high' || result.score >= 12;
  const isMediumRisk = result.riskLevel === 'medium' || (result.score >= 5 && result.score < 12);

  function handleCopyReport() {
    const reportText = `[UPI SCAM ANALYZER REPORT]
Target: ${result.input}
Type: ${result.type ? result.type.toUpperCase() : 'PAYLOAD'}
Status: ${result.status}
Score: ${result.score} / 25
Verdict: ${result.result}

Key Findings:
${result.reasons ? result.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'No threats flagged.'}

Action:
${result.advice}

National Cyber Crime Helpline: 1930 | cybercrime.gov.in`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6 w-full">
      {/* Primary Security Verdict Banner */}
      <RiskGauge
        score={result.score}
        maxScore={25}
        status={result.status}
        confidence={result.confidence}
        riskLevel={result.riskLevel}
      />

      {/* Target Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="overflow-hidden">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Inspected Payload ({result.type ? result.type.toUpperCase() : 'INPUT'})
          </div>
          <div className="text-sm font-mono text-slate-100 font-semibold truncate mt-0.5" title={result.input}>
            {result.input}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnostic Threat Indicators */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Forensic Diagnostics
        </div>
        <ThreatIndicators indicators={result.indicators} type={result.type} />
      </div>

      {/* Detailed Findings & Action Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Detection Findings */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5 space-y-3">
          <div className="border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-slate-100">
              Inspection Findings & Rule Evaluation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific heuristic indicators triggered during pattern analysis
            </p>
          </div>

          <div className="space-y-2">
            {result.reasons && result.reasons.length > 0 ? (
              result.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-md bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs"
                >
                  <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {reason}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-400">
                All parameters conform to recognized legitimate standards. No malicious signatures matched.
              </div>
            )}
          </div>
        </div>

        {/* Actionable Guidance & Safety Checklist */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5 space-y-3">
          <div className="border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-slate-100">
              Actionable Security Protocol
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recommended actions to protect your bank account and data
            </p>
          </div>

          {/* Primary Recommendation */}
          <div className={`p-3.5 rounded-md border text-xs leading-relaxed font-medium ${
            isHighRisk
              ? 'bg-red-950/30 border-red-800 text-red-200'
              : isMediumRisk
              ? 'bg-amber-950/30 border-amber-800 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
          }`}>
            {result.advice}
          </div>

          {/* Core UPI Safety Rules */}
          <div className="space-y-2 text-xs text-slate-300 pt-1">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">&#10003;</span>
              <span><strong>UPI PIN Rule:</strong> You only enter a PIN to send money. You NEVER enter a PIN to receive a payment, cashback, or refund.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">&#10003;</span>
              <span><strong>Beneficiary Check:</strong> Confirm the account holder name displayed on your banking screen before authorizing.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">&#10003;</span>
              <span><strong>Emergency Helpline:</strong> Call <strong>1930</strong> immediately if money has been wrongfully transferred from your account.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-slate-900 border border-slate-800">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Scan Another Identifier</span>
        </button>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Report Incident (National Helpline 1930)</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
