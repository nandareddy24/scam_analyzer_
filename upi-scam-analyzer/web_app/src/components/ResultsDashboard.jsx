import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RiskGauge from './RiskGauge';
import ThreatIndicators from './ThreatIndicators';
import {
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  PhoneCall,
  Clock,
  CheckCircle2,
  ShieldAlert,
} from './Icons';
import { classifyRisk, formatScanTimestamp, normalizeModuleType } from '../services/scanHistory';

/**
 * ResultsDashboard Component
 * Structured enterprise security report clearly separating:
 * 1. Target Identity & Timestamp
 * 2. Risk Classification & Score
 * 3. Detected Threats / Triggered Rules vs. Recommended Safety Actions
 * 4. Supporting Technical Evidence (4-card grid)
 * 5. Report & Escalation Actions
 */
export default function ResultsDashboard({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!result) return null;

  const risk = classifyRisk(result);
  const moduleType = normalizeModuleType(result.type);
  const scanTimestamp = formatScanTimestamp(result.timestamp || new Date().toISOString());

  function mapReportCategory(type) {
    if (type === 'URL') return 'URL';
    if (type === 'UPI') return 'UPI';
    if (type === 'PHONE') return 'PHONE';
    return 'SMS';
  }

  function handleCopyReport() {
    const reportText = [
      'UPI SCAM ANALYZER - HEURISTIC SCAN SUMMARY',
      `Scanned At: ${scanTimestamp}`,
      `Module: ${moduleType}`,
      `Target: ${result.input}`,
      `Classification: ${risk.label} (${risk.score}/25)`,
      `Summary: ${result.result || risk.label}`,
      '',
      'Detected Threats & Triggered Rules:',
      ...(result.reasons && result.reasons.length > 0
        ? result.reasons.map((r, i) => `${i + 1}. ${r}`)
        : ['No heuristic flags triggered.']),
      '',
      'Recommended Safety Action:',
      result.advice || 'Verify recipient independently before transacting.',
      '',
      'Note: Heuristic indicators do not constitute confirmed fraud.',
      'National Cyber Crime Helpline: 1930 | https://cybercrime.gov.in',
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reportText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function handleReportEntity() {
    navigate('/report', {
      state: {
        prefillType: mapReportCategory(moduleType),
        prefillTarget: String(result.input || '').slice(0, 200),
      },
    });
  }

  const safetySteps =
    moduleType === 'URL'
      ? [
          { title: 'Verify Domain Manually', text: 'Navigate to banking or payment portals by typing the official address directly instead of following links.' },
          { title: 'Protect Credentials', text: 'Do not enter net banking passwords, card CVV, or UPI PINs on pages opened from SMS or chat links.' },
          { title: 'Escalate Phishing Links', text: 'Log suspicious links in Fraud Entity Reporting or report financial loss immediately via 1930.' },
        ]
      : moduleType === 'PHONE'
      ? [
          { title: 'Never Share OTPs or Screen Access', text: 'Banks never call asking for OTPs, PINs, or installation of remote-access apps (AnyDesk, TeamViewer).' },
          { title: 'Call Back via Official Channels', text: 'Hang up and dial the support number printed on your bank card or inside your official banking app.' },
          { title: 'Block & Report Fraud Callers', text: 'Block suspected scam numbers on your device and report active fraud calls to 1930 or cybercrime.gov.in.' },
        ]
      : [
          { title: 'UPI PIN Is Only for Sending Money', text: 'Entering a UPI PIN always authorizes a debit. Receiving refunds, prizes, or payments never requires a UPI PIN.' },
          { title: 'Confirm Beneficiary Name in App', text: 'Check the verified legal account name shown inside your UPI app before approving any transfer or collect request.' },
          { title: 'Act Within the Golden Hour', text: 'If funds are debited fraudulently, call National Cyber Crime Helpline 1930 immediately to request a freeze.' },
        ];

  return (
    <div className="space-y-5 w-full" aria-label="Security scan assessment results">
      {/* 1. Target Identity & Timestamp Bar */}
      <div className="card-enterprise px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-[#14243A] font-mono font-semibold text-white text-[11px]">
              {moduleType}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#64748B] font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Scanned: {scanTimestamp}</span>
            </span>
          </div>
          <div
            className="text-[15px] font-mono text-[#14243A] font-semibold truncate"
            title={result.input}
          >
            {result.input}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyReport}
            className="btn-secondary"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[#16A34A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#64748B]" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Risk Classification & Score */}
      <RiskGauge
        score={result.score}
        maxScore={25}
        resultLabel={result.result}
        riskLevel={result.riskLevel}
      />

      {/* 3. Detected Threats & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Detected Threats / Triggered Rules */}
        <section className="lg:col-span-6 card-enterprise p-5 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-[15px] font-semibold text-[#14243A]">
                Detected Threats &amp; Triggered Rules
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Specific heuristic findings that generated this risk score
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#F5F7FA] border border-[#E2E8F0] font-mono text-xs font-medium text-[#172B4D]">
              {result.reasons ? result.reasons.length : 0} {result.reasons?.length === 1 ? 'finding' : 'findings'}
            </span>
          </div>

          <div className="space-y-2.5">
            {result.reasons && result.reasons.length > 0 ? (
              result.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] flex items-start gap-2.5 text-[13.5px]"
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      risk.key === 'dangerous'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                        : risk.key === 'warning'
                        ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                    }`}
                  >
                    {risk.key === 'dangerous' ? (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    ) : risk.key === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <p className="text-[#172B4D] leading-relaxed">{reason}</p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-[13.5px] text-[#64748B]">
                No specific heuristic rule findings were returned for this input.
              </div>
            )}
          </div>
        </section>

        {/* Recommended Safety Actions */}
        <section className="lg:col-span-6 card-enterprise p-5 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="text-[15px] font-semibold text-[#14243A]">
              Recommended Safety Actions
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Practical defensive steps based on this assessment
            </p>
          </div>

          <div
            className={`p-3.5 rounded-lg border text-[13.5px] leading-relaxed font-medium ${
              risk.key === 'dangerous'
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                : risk.key === 'warning'
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
                : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
            }`}
          >
            {result.advice}
          </div>

          <div className="space-y-2.5 text-[13.5px] text-[#64748B]">
            {safetySteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-[#172B4D]">{step.title}:</strong> {step.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Supporting Technical Evidence */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Supporting Technical Evidence
          </h3>
          <span className="text-xs text-[#64748B]">
            Deterministic client-side rule checks
          </span>
        </div>
        <ThreatIndicators indicators={result.indicators || {}} type={result.type} />
      </section>

      {/* 5. Action Toolbar */}
      <div className="card-enterprise px-5 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn-secondary"
            >
              <RefreshCw className="w-4 h-4 text-[#64748B]" />
              <span>Run New Scan</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReportEntity}
            className="btn-secondary"
          >
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            <span>Report This Entity</span>
          </button>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <PhoneCall className="w-4 h-4" />
          <span>National Cyber Crime Portal (1930)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
