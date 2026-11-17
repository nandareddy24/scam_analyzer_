import { CheckCircle2, AlertTriangle, ShieldAlert } from './Icons';

export default function RiskBadge({ level, score }) {
  const isHigh = level === 'high' || level === 'danger';
  const isMed = level === 'medium' || level === 'warning';

  if (isHigh) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 text-xs font-bold uppercase tracking-wider font-mono">
        <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
        <span>HIGH RISK &bull; {score}/100</span>
      </span>
    );
  }

  if (isMed) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 text-xs font-bold uppercase tracking-wider font-mono">
        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
        <span>MEDIUM RISK &bull; {score}/100</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 text-xs font-bold uppercase tracking-wider font-mono">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
      <span>LOW RISK &bull; {score}/100</span>
    </span>
  );
}

