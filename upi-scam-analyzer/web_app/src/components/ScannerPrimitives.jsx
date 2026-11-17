import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Trash2,
  ChevronRight,
  Activity,
  Shield,
} from './Icons';
import { classifyRisk, formatScanTimestamp } from '../services/scanHistory';

/**
 * Consistent risk badge styling across all modules and tables.
 * Safe: #16A34A | Warning: #D97706 | Dangerous: #DC2626
 */
export function getRiskBadgeStyles(item) {
  const risk = classifyRisk(item);
  if (risk.key === 'dangerous') {
    return {
      ...risk,
      badge: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]',
      subtleBg: 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]',
      dot: 'bg-[#DC2626]',
      text: 'text-[#DC2626]',
      bar: 'bg-[#DC2626]',
    };
  }
  if (risk.key === 'warning') {
    return {
      ...risk,
      badge: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
      subtleBg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]',
      dot: 'bg-[#D97706]',
      text: 'text-[#D97706]',
      bar: 'bg-[#D97706]',
    };
  }
  return {
    ...risk,
    badge: 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]',
    subtleBg: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]',
    dot: 'bg-[#16A34A]',
    text: 'text-[#16A34A]',
    bar: 'bg-[#16A34A]',
  };
}

/**
 * Consistent enterprise page header aligned to the main content grid.
 */
export function ModuleHeader({ icon, title, description, badge, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-[10px] accent-blue-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_1px_2px_rgba(20,36,58,0.08)]">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[22px] sm:text-2xl font-bold text-[#14243A] tracking-tight leading-tight">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#2563EB]">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[13.5px] text-[#64748B] mt-1 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Right-rail Scope & Heuristic Rules reference panel with dark navy security header band.
 */
export function ModuleScopeCard({ title = 'What This Module Checks', subtitle, checks = [], footerNote }) {
  return (
    <aside className="card-enterprise overflow-hidden">
      <div className="panel-navy-gradient px-5 py-4 flex items-start gap-3 text-white">
        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 text-[#93C5FD] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4 bg-white">
        <ul className="space-y-2.5">
          {checks.map((check, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-[13px] text-[#172B4D] leading-relaxed"
            >
              <span className="font-mono text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <span>{check}</span>
            </li>
          ))}
        </ul>

        <div className="pt-3 border-t border-[#E2E8F0] flex items-start gap-2 text-xs text-[#64748B] leading-relaxed">
          <Info className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
          <span>
            {footerNote ||
              'Scores (0 to 25) represent local heuristic indicators, not guarantees of safety or legal confirmation of fraud.'}
          </span>
        </div>
      </div>
    </aside>
  );
}

/**
 * Consistent inline validation / error banner.
 */
export function ValidationBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[13.5px] text-[#991B1B] flex items-start justify-between gap-3"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-[#DC2626] text-xs uppercase tracking-wider">
            Validation Error
          </div>
          <p className="text-[#7F1D1D] leading-relaxed">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-medium text-[#DC2626] hover:text-[#991B1B] flex-shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

/**
 * Consistent inline success status banner.
 */
export function SuccessBanner({ title, message }) {
  if (!message && !title) return null;
  return (
    <div
      role="status"
      className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[13.5px] flex items-start gap-2.5"
    >
      <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        {title && <div className="font-semibold text-[#16A34A]">{title}</div>}
        {message && <p className="text-[#166534] leading-relaxed">{message}</p>}
      </div>
    </div>
  );
}

/**
 * Restrained loading state displayed while local heuristic checks run.
 */
export function ScannerLoadingState({ label = 'Running heuristic rule checks...', target }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="card-enterprise p-5 space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-[#2563EB]" />
          <span className="text-sm font-semibold text-[#14243A]">{label}</span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded">
          RUNNING
        </span>
      </div>
      {target && (
        <div className="text-[13px] font-mono text-[#172B4D] bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-2 truncate">
          {target}
        </div>
      )}
      <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-[#2563EB] rounded-full" />
      </div>
    </div>
  );
}

/**
 * Kept for backwards compatibility where an inline empty card is preferred.
 */
export function ScannerEmptyState({ title, description, checks = [] }) {
  return (
    <div className="card-enterprise p-5 space-y-3.5">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-[#14243A]">{title}</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      {checks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checks.map((check, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-[13px] text-[#172B4D] flex items-start gap-2.5"
            >
              <span className="font-mono text-[11px] font-semibold text-[#2563EB] bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 flex-shrink-0">
                0{idx + 1}
              </span>
              <span className="leading-relaxed">{check}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Structured SaaS table for Relevant Scan History across all scanner modules.
 */
export function RelevantHistorySection({
  title = 'Relevant Scan History',
  emptyText = 'No scans recorded for this module in the current session.',
  items = [],
  onSelect,
  onClear,
  maxItems = 6,
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const visibleItems = items.slice(0, maxItems);

  return (
    <section className="card-enterprise overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 bg-white">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#64748B]" />
          <h2 className="text-xs font-semibold text-[#14243A] uppercase tracking-wider">
            {title}
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] font-mono font-semibold text-[#2563EB]">
            {items.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/history"
            className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors"
          >
            View Full Audit History
          </Link>

          {items.length > 0 && onClear && (
            confirmClear ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-[#64748B] border border-[#CBD5E1] hover:text-[#172B4D] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#DC2626] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )
          )}
        </div>
      </div>

      {visibleItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                <th className="py-2.5 px-5">Module</th>
                <th className="py-2.5 px-4">Target Identifier</th>
                <th className="py-2.5 px-4 hidden md:table-cell">Assessment</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Score</th>
                <th className="py-2.5 px-5 text-right hidden sm:table-cell">Scanned At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
              {visibleItems.map((item, idx) => {
                const risk = getRiskBadgeStyles(item);
                const selectable = Boolean(onSelect && item.fullResult);
                return (
                  <tr
                    key={item.id || idx}
                    onClick={selectable ? () => onSelect(item.fullResult) : undefined}
                    className={selectable ? 'cursor-pointer hover:bg-[#F5F7FA] transition-colors' : ''}
                  >
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#F5F7FA] text-[#172B4D] font-mono text-[11px] font-semibold border border-[#E2E8F0]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[260px] lg:max-w-[360px]">
                      <div
                        className="font-mono font-medium text-[#172B4D] truncate"
                        title={item.target}
                      >
                        {item.target}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] hidden md:table-cell truncate max-w-[220px]">
                      {item.verdict}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md ${risk.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                        {risk.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#172B4D] whitespace-nowrap">
                      {risk.score}/25
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-xs text-[#64748B] whitespace-nowrap hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <span>{formatScanTimestamp(item.timestamp)}</span>
                        {selectable && <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-[13px] text-[#64748B]">
          {emptyText}
        </div>
      )}
    </section>
  );
}
