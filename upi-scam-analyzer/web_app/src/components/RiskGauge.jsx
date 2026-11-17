import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from './Icons';
import { classifyRisk } from '../services/scanHistory';

/**
 * RiskGauge Component
 * Commercial SaaS risk verdict summary (Safe / Warning / Dangerous + 0-25 rule score).
 */
export default function RiskGauge({
  score = 0,
  maxScore = 25,
  resultLabel = '',
  riskLevel = 'low',
}) {
  const risk = classifyRisk({ score, riskLevel });
  const percent = Math.min(100, Math.max(0, Math.round((risk.score / maxScore) * 100)));

  const config =
    risk.key === 'dangerous'
      ? {
          cardBorder: 'border-[#FECACA]',
          bannerBg: 'bg-[#FEF2F2] border-b border-[#FECACA]',
          badge: 'bg-[#DC2626] text-white',
          barColor: 'bg-[#DC2626]',
          scoreColor: 'text-[#DC2626]',
          iconWrap: 'bg-white border-[#FECACA] text-[#DC2626]',
          icon: <ShieldAlert className="w-5 h-5" />,
          classification: 'Dangerous',
          summary:
            'High-risk heuristic indicators were detected. Do not authorize payments, click links, or share credentials without independent verification.',
          distinctionTitle: 'Detected Indicators vs. Confirmed Fraud',
          distinctionText:
            'This classification reflects local heuristic rule matches, not legally confirmed fraud. Verify independently with your bank or report financial fraud via 1930 / cybercrime.gov.in.',
        }
      : risk.key === 'warning'
      ? {
          cardBorder: 'border-[#FDE68A]',
          bannerBg: 'bg-[#FFFBEB] border-b border-[#FDE68A]',
          badge: 'bg-[#D97706] text-white',
          barColor: 'bg-[#D97706]',
          scoreColor: 'text-[#D97706]',
          iconWrap: 'bg-white border-[#FDE68A] text-[#D97706]',
          icon: <AlertTriangle className="w-5 h-5" />,
          classification: 'Warning',
          summary:
            'Suspicious heuristic patterns were flagged. Confirm the counterparty identity through an official channel before proceeding.',
          distinctionTitle: 'Detected Indicators vs. Confirmed Fraud',
          distinctionText:
            'Warning flags indicate risk patterns that may occasionally appear in legitimate inputs. Treat this as a prompt for manual verification, not proof of confirmed fraud.',
        }
      : {
          cardBorder: 'border-[#BBF7D0]',
          bannerBg: 'bg-[#F0FDF4] border-b border-[#BBF7D0]',
          badge: 'bg-[#16A34A] text-white',
          barColor: 'bg-[#16A34A]',
          scoreColor: 'text-[#16A34A]',
          iconWrap: 'bg-white border-[#BBF7D0] text-[#16A34A]',
          icon: <ShieldCheck className="w-5 h-5" />,
          classification: 'Safe',
          summary:
            'No high-risk heuristic indicators were triggered by local rule checks. Follow standard UPI and payment verification steps before transacting.',
          distinctionTitle: 'Assessment Scope',
          distinctionText:
            'A Safe rating means no local heuristic rules matched. It does not guarantee legitimacy against newly created or unreported fraud. Always verify the beneficiary name in your payment app.',
        };

  return (
    <div className={`bg-white rounded-[10px] border shadow-[0_1px_2px_rgba(20,36,58,0.04)] overflow-hidden ${config.cardBorder}`}>
      {/* Classification Header */}
      <div className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${config.bannerBg}`}>
        <div className="flex items-start gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-[10px] border flex items-center justify-center flex-shrink-0 ${config.iconWrap}`}>
            {config.icon}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${config.badge}`}>
                {config.classification}
              </span>
              {resultLabel && (
                <span className="text-base font-bold text-[#14243A]">
                  {resultLabel}
                </span>
              )}
            </div>
            <p className="text-[13.5px] text-[#172B4D] mt-1 leading-relaxed max-w-3xl">
              {config.summary}
            </p>
          </div>
        </div>

        {/* Numeric Risk Score Box */}
        <div className="sm:text-right flex-shrink-0 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Heuristic Score
          </div>
          <div className="flex items-baseline sm:justify-end gap-1 mt-0.5">
            <span className={`text-2xl font-bold font-mono ${config.scoreColor}`}>
              {risk.score}
            </span>
            <span className="text-xs font-mono text-[#64748B]">/ {maxScore}</span>
          </div>
          <div className="text-[11px] font-mono text-[#64748B]">
            Band: {risk.rangeLabel}
          </div>
        </div>
      </div>

      {/* Threshold Scale & Indicator Scope */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-6 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
            <span className="text-[#16A34A]">Safe (0-4)</span>
            <span className="text-[#D97706]">Warning (5-11)</span>
            <span className="text-[#DC2626]">Dangerous (12-25)</span>
          </div>
          <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E2E8F0]">
            <div
              className={`h-full ${config.barColor} rounded-full transition-all duration-200`}
              style={{ width: `${Math.max(4, percent)}%` }}
            />
          </div>
          <p className="text-xs text-[#64748B]">
            Weighted point total from triggered rules (0 = no flags, 25 = maximum rule score).
          </p>
        </div>

        <div className="lg:col-span-6 p-3.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-semibold text-[#14243A]">{config.distinctionTitle}</div>
            <p className="text-[#64748B] leading-relaxed">{config.distinctionText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
