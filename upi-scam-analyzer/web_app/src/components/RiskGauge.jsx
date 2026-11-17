import { ShieldAlert, ShieldCheck, AlertTriangle } from './Icons';

/**
 * RiskGauge Component
 * Clean, production-grade security verdict card.
 * Replaces gimmicky circular gauges with a clean status banner,
 * horizontal severity bar, and numerical penalty score.
 */
export default function RiskGauge({ score = 0, maxScore = 25, status = 'VERIFIED SAFE', confidence = 95, riskLevel = 'low' }) {
  const normalized = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));

  const isHighRisk = riskLevel === 'high' || score >= 12;
  const isMediumRisk = riskLevel === 'medium' || (score >= 5 && score < 12);

  const config = isHighRisk
    ? {
        border: 'border-red-900/60 bg-red-950/20',
        badge: 'bg-red-900/40 text-red-300 border-red-800',
        barColor: 'bg-red-500',
        icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
        label: 'HIGH RISK THREAT',
        desc: 'Multiple critical fraud indicators detected. High probability of financial loss.',
      }
    : isMediumRisk
    ? {
        border: 'border-amber-900/60 bg-amber-950/20',
        badge: 'bg-amber-900/40 text-amber-300 border-amber-800',
        barColor: 'bg-amber-500',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        label: 'SUSPICIOUS WARNING',
        desc: 'Unusual patterns detected. Exercise caution and verify identity before sending money.',
      }
    : {
        border: 'border-emerald-900/60 bg-emerald-950/20',
        badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-800',
        barColor: 'bg-emerald-500',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        label: 'VERIFIED SAFE',
        desc: 'No known phishing or fraud indicators detected. Follow standard payment precautions.',
      };

  return (
    <div className={`p-5 rounded-lg border ${config.border} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${config.badge}`}>
                {config.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {config.desc}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right flex-shrink-0">
          <div className="text-2xl font-bold font-mono text-slate-100">
            {score} <span className="text-xs font-normal text-slate-400">/ {maxScore}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Penalty Score ({normalized}% risk)
          </div>
        </div>
      </div>

      {/* Clean Severity Bar */}
      <div>
        <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
          <span>Safe (0)</span>
          <span>Suspicious (5)</span>
          <span>High Risk (12+)</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full ${config.barColor} rounded-full transition-all duration-300`}
            style={{ width: `${Math.max(4, normalized)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
