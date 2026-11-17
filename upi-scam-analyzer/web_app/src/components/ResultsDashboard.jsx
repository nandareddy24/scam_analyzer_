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
  PhoneCall
} from './Icons';

/**
 * ResultsDashboard Component
 * Enterprise cybersecurity forensic report.
 * Visual Tokens:
 * Cards: #111C2E, Borders: #26364D, Primary Text: #F1F5F9, Secondary: #A8B5C7, Muted: #8291A6.
 * Actions: #3B82F6, Danger: #DC2626, Warning: #D97706, Success: #16A34A.
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
    <div className="space-y-4 w-full">
      {/* 1. Target Identity Header (Context Established First) */}
      <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="overflow-hidden">
          <div className="text-[11px] font-semibold text-[#8291A6] uppercase tracking-wider">
            Inspected Payload ({result.type ? result.type.toUpperCase() : 'INPUT'})
          </div>
          <div className="text-sm font-mono text-[#F1F5F9] font-medium truncate mt-0.5" title={result.input}>
            {result.input}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#080F1D] hover:bg-[#16243b] text-[#F1F5F9] border border-[#26364D] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-[#16A34A] font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8291A6]" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Primary Security Verdict & Score */}
      <RiskGauge
        score={result.score}
        maxScore={25}
        status={result.status}
        confidence={result.confidence}
        riskLevel={result.riskLevel}
      />

      {/* 3. Diagnostic Threat Indicators */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#8291A6] px-1">
          Forensic Diagnostics
        </div>
        <ThreatIndicators indicators={result.indicators} type={result.type} />
      </div>

      {/* 4. Findings & Actionable Guidance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Inspection Findings */}
        <div className="bg-[#111C2E] rounded-lg border border-[#26364D] p-4 sm:p-5 space-y-3">
          <div className="border-b border-[#26364D] pb-2.5">
            <h3 className="text-sm font-semibold text-[#F1F5F9]">
              Inspection Findings & Rule Evaluation
            </h3>
            <p className="text-xs text-[#8291A6] mt-0.5">
              Specific heuristic indicators triggered during pattern analysis
            </p>
          </div>

          <div className="space-y-2">
            {result.reasons && result.reasons.length > 0 ? (
              result.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-md bg-[#080F1D] border border-[#26364D] flex items-start gap-2.5 text-xs"
                >
                  <span className="w-5 h-5 rounded bg-[#111C2E] text-[#A8B5C7] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#26364D]">
                    {idx + 1}
                  </span>
                  <p className="text-[#A8B5C7] leading-relaxed">
                    {reason}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-md bg-[#080F1D] border border-[#26364D] text-xs text-[#8291A6]">
                All parameters conform to recognized standards. No malicious signatures matched.
              </div>
            )}
          </div>
        </div>

        {/* Actionable Guidance */}
        <div className="bg-[#111C2E] rounded-lg border border-[#26364D] p-4 sm:p-5 space-y-3">
          <div className="border-b border-[#26364D] pb-2.5">
            <h3 className="text-sm font-semibold text-[#F1F5F9]">
              Actionable Security Protocol
            </h3>
            <p className="text-xs text-[#8291A6] mt-0.5">
              Recommended actions to safeguard your accounts
            </p>
          </div>

          {/* Primary Recommendation */}
          <div className={`p-3.5 rounded-md border text-xs leading-relaxed font-medium ${
            isHighRisk
              ? 'bg-[#DC2626]/10 border-[#DC2626]/40 text-[#DC2626]'
              : isMediumRisk
              ? 'bg-[#D97706]/10 border-[#D97706]/40 text-[#D97706]'
              : 'bg-[#16A34A]/10 border-[#16A34A]/40 text-[#16A34A]'
          }`}>
            {result.advice}
          </div>

          {/* Core UPI Safety Rules */}
          <div className="space-y-2 text-xs text-[#A8B5C7] pt-1">
            <div className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">&#10003;</span>
              <span><strong>UPI PIN Rule:</strong> UPI PIN is strictly for debiting funds. Receiving payments or refunds never requires entering a PIN.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">&#10003;</span>
              <span><strong>Beneficiary Check:</strong> Confirm the account holder name displayed on your banking screen before authorizing.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#16A34A] font-bold">&#10003;</span>
              <span><strong>Emergency Helpline:</strong> Call <strong>1930</strong> immediately if money has been wrongfully transferred from your account.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-[#111C2E] border border-[#26364D]">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary w-full sm:w-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8291A6]" />
          <span>Scan Another Identifier</span>
        </button>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full sm:w-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Report Incident to Cyber Cell (1930)</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
