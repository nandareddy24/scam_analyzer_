import { ShieldAlert, ShieldCheck, AlertTriangle } from './Icons';

/**
 * RiskGauge Component
 * Enterprise cybersecurity verdict presentation.
 * Uses exact tokens: #111C2E (card), #26364D (border), #F1F5F9 (primary), #A8B5C7 (secondary), #8291A6 (muted).
 * Danger (#DC2626), Warning (#D97706), Success (#16A34A).
 */
export default function RiskGauge({ score = 0, maxScore = 25, status = 'VERIFIED SAFE', confidence = 95, riskLevel = 'low' }) {
  const normalized = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));

  const isHighRisk = riskLevel === 'high' || score >= 12;
  const isMediumRisk = riskLevel === 'medium' || (score >= 5 && score < 12);

  const config = isHighRisk
    ? {
        border: 'border-[#DC2626]/40 bg-[#DC2626]/10',
        badge: 'bg-[#DC2626]/20 text-[#DC2626] border border-[#DC2626]/50',
        barColor: 'bg-[#DC2626]',
        icon: <ShieldAlert className="w-5 h-5 text-[#DC2626]" />,
        label: 'HIGH RISK THREAT',
        desc: 'Critical fraud indicators detected. High probability of financial loss.',
      }
    : isMediumRisk
    ? {
        border: 'border-[#D97706]/40 bg-[#D97706]/10',
        badge: 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/50',
        barColor: 'bg-[#D97706]',
        icon: <AlertTriangle className="w-5 h-5 text-[#D97706]" />,
        label: 'SUSPICIOUS WARNING',
        desc: 'Unusual patterns detected. Exercise caution and verify identity before transacting.',
      }
    : {
        border: 'border-[#16A34A]/40 bg-[#16A34A]/10',
        badge: 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/50',
        barColor: 'bg-[#16A34A]',
        icon: <ShieldCheck className="w-5 h-5 text-[#16A34A]" />,
        label: 'VERIFIED SAFE',
        desc: 'No known phishing or fraud indicators detected. Follow standard payment rules.',
      };

  return (
    <div className={`p-4 sm:p-5 rounded-lg border ${config.border} space-y-3`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#080F1D] border border-[#26364D] flex items-center justify-center flex-shrink-0">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${config.badge}`}>
                {config.label}
              </span>
              <span className="text-xs text-[#8291A6] font-mono">
                {status}
              </span>
            </div>
            <p className="text-xs text-[#A8B5C7] mt-1 leading-relaxed">
              {config.desc}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right flex-shrink-0">
          <div className="text-xl font-bold font-mono text-[#F1F5F9]">
            {score} <span className="text-xs font-normal text-[#8291A6]">/ {maxScore}</span>
          </div>
          <div className="text-[11px] text-[#8291A6]">
            Penalty Index: {normalized}%
          </div>
        </div>
      </div>

      {/* Threshold severity bar */}
      <div className="pt-1">
        <div className="flex justify-between text-[11px] text-[#8291A6] mb-1 font-mono">
          <span>Safe (0-4)</span>
          <span>Suspicious (5-11)</span>
          <span>High Risk (12+)</span>
        </div>
        <div className="w-full h-1.5 bg-[#080F1D] rounded-full overflow-hidden border border-[#26364D]">
          <div
            className={`h-full ${config.barColor} rounded-full transition-all duration-300`}
            style={{ width: `${Math.max(4, normalized)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
