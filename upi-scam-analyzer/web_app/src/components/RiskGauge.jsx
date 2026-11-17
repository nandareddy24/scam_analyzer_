import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from './Icons';

/**
 * RiskGauge Component
 * High-trust visual risk meter displaying 0-25 score (with 0-100% normalization),
 * color-coded SVG arc, ambient threat glow, and severity badge.
 */
export default function RiskGauge({ score = 0, maxScore = 25, status = 'VERIFIED SAFE', confidence = 95, riskLevel = 'low' }) {
  // Normalize score to percentage 0 - 100
  const normalized = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));

  // SVG Gauge calculations (circumference for r=54 is ~339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc gauge
  const strokeDashoffset = circumference - (normalized / 100) * (circumference * 0.75);

  // Threat colors
  const isHighRisk = riskLevel === 'high' || score >= 12;
  const isMediumRisk = riskLevel === 'medium' || (score >= 5 && score < 12);
  const isSafe = !isHighRisk && !isMediumRisk;

  const colorConfig = isHighRisk
    ? {
        stroke: '#ef4444',
        text: 'text-red-400',
        bgPill: 'bg-red-500/10 text-red-400 border-red-500/30',
        glow: 'rgba(239, 68, 68, 0.35)',
        icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
        label: 'HIGH RISK THREAT',
      }
    : isMediumRisk
    ? {
        stroke: '#f59e0b',
        text: 'text-amber-400',
        bgPill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        glow: 'rgba(245, 158, 11, 0.35)',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        label: 'SUSPICIOUS WARNING',
      }
    : {
        stroke: '#10b981',
        text: 'text-emerald-400',
        bgPill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        glow: 'rgba(16, 185, 129, 0.35)',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        label: 'VERIFIED SAFE',
      };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
      {/* Ambient Radial Glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-700 opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${colorConfig.glow} 0%, transparent 70%)`,
        }}
      />

      {/* SVG Arc Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-135" viewBox="0 0 130 130">
          {/* Background Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colorConfig.stroke})`,
            }}
          />
        </svg>

        {/* Centered Readout Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
          <div className="flex items-baseline gap-0.5">
            <span className={`text-4xl font-extrabold tracking-tight font-mono ${colorConfig.text}`}>
              {score}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              /{maxScore}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Threat Score
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-medium mt-1">
            {normalized}% Risk Index
          </span>
        </div>
      </div>

      {/* Status Pill Badge */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase shadow-sm ${colorConfig.bgPill}`}>
          {colorConfig.icon}
          <span>{status || colorConfig.label}</span>
        </div>

        {/* Confidence level */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Confidence: <strong className="text-slate-200">{confidence}%</strong></span>
        </div>
      </div>
    </div>
  );
}
