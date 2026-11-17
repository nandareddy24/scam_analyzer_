import { ShieldAlert, ShieldCheck, AlertTriangle } from './Icons';

/**
 * RiskGauge Component
 * Clean, production-ready threat assessment meter.
 * Displays calculated threat score (0-25), risk index percentage,
 * and high-contrast severity badge without decorative blur artifacts.
 */
export default function RiskGauge({ score = 0, maxScore = 25, status = 'VERIFIED SAFE', confidence = 95, riskLevel = 'low' }) {
  const normalized = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * (circumference * 0.75);

  const isHighRisk = riskLevel === 'high' || score >= 12;
  const isMediumRisk = riskLevel === 'medium' || (score >= 5 && score < 12);

  const colorConfig = isHighRisk
    ? {
        stroke: '#ef4444',
        text: 'text-red-400',
        bgPill: 'bg-red-500/10 text-red-400 border-red-500/30',
        icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
        label: 'HIGH RISK THREAT',
      }
    : isMediumRisk
    ? {
        stroke: '#f59e0b',
        text: 'text-amber-400',
        bgPill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        label: 'SUSPICIOUS WARNING',
      }
    : {
        stroke: '#10b981',
        text: 'text-emerald-400',
        bgPill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        label: 'VERIFIED SAFE',
      };

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-slate-900 rounded-xl border border-slate-800">
      {/* SVG Arc Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-135" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />

          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
          <div className="flex items-baseline gap-0.5">
            <span className={`text-3xl font-extrabold font-mono ${colorConfig.text}`}>
              {score}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              /{maxScore}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
            Threat Score
          </span>
          <span className="text-[11px] font-mono text-slate-400 mt-0.5">
            {normalized}% Risk Index
          </span>
        </div>
      </div>

      {/* Status Pill Badge */}
      <div className="mt-2 flex flex-col items-center gap-1.5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-bold tracking-wide uppercase ${colorConfig.bgPill}`}>
          {colorConfig.icon}
          <span>{status || colorConfig.label}</span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Confidence Rating: <strong className="text-slate-200">{confidence}%</strong>
        </div>
      </div>
    </div>
  );
}
