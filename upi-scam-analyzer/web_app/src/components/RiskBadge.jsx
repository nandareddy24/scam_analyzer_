import { CheckCircle2, AlertTriangle, ShieldAlert } from './Icons';

export default function RiskBadge({ level, score, maxScore = 25 }) {
  const isDangerous = level === 'high' || level === 'danger' || level === 'dangerous' || score >= 12;
  const isWarning = !isDangerous && (level === 'medium' || level === 'warning' || score >= 5);

  if (isDangerous) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] text-xs font-semibold uppercase tracking-wider font-mono">
        <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
        <span>Dangerous &bull; {score}/{maxScore}</span>
      </span>
    );
  }

  if (isWarning) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] text-xs font-semibold uppercase tracking-wider font-mono">
        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
        <span>Warning &bull; {score}/{maxScore}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] text-xs font-semibold uppercase tracking-wider font-mono">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
      <span>Safe &bull; {score}/{maxScore}</span>
    </span>
  );
}
