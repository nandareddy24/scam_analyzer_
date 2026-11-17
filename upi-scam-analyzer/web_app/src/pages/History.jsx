import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import {
  ModuleHeader,
  getRiskBadgeStyles,
} from '../components/ScannerPrimitives';
import {
  getScanHistory,
  clearScanHistory,
  classifyRisk,
  formatScanTimestamp,
  normalizeModuleType,
} from '../services/scanHistory';
import {
  Clock,
  Trash2,
  Search,
  RefreshCw,
  ChevronRight,
  X,
  ArrowRight,
} from '../components/Icons';

const TYPE_FILTERS = [
  { id: 'ALL', label: 'All Modules' },
  { id: 'URL', label: 'URL' },
  { id: 'MESSAGE', label: 'SMS / Message' },
  { id: 'UPI', label: 'UPI VPA' },
  { id: 'PHONE', label: 'Phone' },
  { id: 'OCR', label: 'QR / OCR' },
];

const RISK_FILTERS = [
  { id: 'ALL', label: 'All Classifications' },
  { id: 'dangerous', label: 'Dangerous' },
  { id: 'warning', label: 'Warning' },
  { id: 'safe', label: 'Safe' },
];

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedScan, setSelectedScan] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const detailRef = useRef(null);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const counts = useMemo(() => {
    return history.reduce(
      (acc, item) => {
        const risk = classifyRisk(item);
        acc.total += 1;
        acc[risk.key] += 1;
        return acc;
      },
      { total: 0, dangerous: 0, warning: 0, safe: 0 }
    );
  }, [history]);

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return history.filter((item) => {
      if (typeFilter !== 'ALL' && normalizeModuleType(item.type) !== typeFilter) {
        return false;
      }
      if (riskFilter !== 'ALL' && classifyRisk(item).key !== riskFilter) {
        return false;
      }
      if (q) {
        const haystack = [
          item.target,
          item.verdict,
          item.type,
          ...(Array.isArray(item.reasons) ? item.reasons : []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [history, searchQuery, typeFilter, riskFilter]);

  function handleClearAll() {
    clearScanHistory();
    setHistory([]);
    setSelectedScan(null);
    setConfirmClear(false);
  }

  function handleSelectScan(item) {
    if (item.fullResult) {
      setSelectedScan(item.fullResult);
    } else {
      const risk = classifyRisk(item);
      setSelectedScan({
        type: normalizeModuleType(item.type).toLowerCase(),
        input: item.target,
        score: risk.score,
        riskLevel:
          risk.key === 'dangerous' ? 'high' : risk.key === 'warning' ? 'medium' : 'low',
        status: item.status || risk.shortLabel,
        result: item.verdict || risk.label,
        timestamp: item.timestamp,
        reasons:
          Array.isArray(item.reasons) && item.reasons.length > 0
            ? item.reasons
            : ['Detailed heuristic breakdown was not stored for this legacy session entry.'],
        advice:
          item.advice ||
          'Re-run this identifier in the corresponding scanner module to generate full indicator details.',
        indicators: item.indicators || {},
      });
    }
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  }

  function resetFilters() {
    setSearchQuery('');
    setTypeFilter('ALL');
    setRiskFilter('ALL');
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 || typeFilter !== 'ALL' || riskFilter !== 'ALL';

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<Clock className="w-5 h-5" />}
          title="Audit History"
          badge="Session Log"
          description="Search, filter, and review past heuristic inspections, risk classifications, detection reasons, and scan timestamps from your local session."
          action={
            history.length > 0 &&
            (confirmClear ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3.5 h-10 rounded-lg text-sm font-semibold bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-colors"
                >
                  Confirm Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="btn-secondary"
              >
                <Trash2 className="w-4 h-4 text-[#64748B]" />
                <span>Clear Audit Log</span>
              </button>
            ))
          }
        />

        {/* Real Session Summary KPI Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Session scan summary">
          <div className="card-enterprise p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Total Session Scans
            </div>
            <div className="text-2xl font-bold font-mono text-[#14243A] mt-1">
              {counts.total}
            </div>
          </div>
          <div className="card-enterprise p-4 border-l-[3px] border-l-[#DC2626]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Dangerous
            </div>
            <div className="text-2xl font-bold font-mono text-[#DC2626] mt-1">
              {counts.dangerous}
            </div>
          </div>
          <div className="card-enterprise p-4 border-l-[3px] border-l-[#D97706]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Warning
            </div>
            <div className="text-2xl font-bold font-mono text-[#D97706] mt-1">
              {counts.warning}
            </div>
          </div>
          <div className="card-enterprise p-4 border-l-[3px] border-l-[#16A34A]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Safe
            </div>
            <div className="text-2xl font-bold font-mono text-[#16A34A] mt-1">
              {counts.safe}
            </div>
          </div>
        </section>

        {/* Filter & Search Toolbar */}
        {history.length > 0 && (
          <section className="card-enterprise p-4 sm:p-5 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative">
                <label htmlFor="audit-search" className="sr-only">
                  Search audit history
                </label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="audit-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by target URL, UPI VPA, phone number, message, or reason..."
                  className="w-full h-10 pl-10 pr-14 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#64748B] hover:text-[#172B4D]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="risk-filter" className="sr-only">
                  Filter by risk classification
                </label>
                <select
                  id="risk-filter"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                >
                  {RISK_FILTERS.map((rf) => (
                    <option key={rf.id} value={rf.id}>
                      {rf.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2E8F0]">
              <div className="flex flex-wrap items-center gap-1.5">
                {TYPE_FILTERS.map((tf) => {
                  const active = typeFilter === tf.id;
                  return (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setTypeFilter(tf.id)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-[#14243A] text-white'
                          : 'bg-[#F5F7FA] text-[#64748B] border border-[#E2E8F0] hover:text-[#172B4D]'
                      }`}
                    >
                      {tf.label}
                    </button>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </section>
        )}

        {/* Selected Audit Record Full Detail */}
        {selectedScan && (
          <div ref={detailRef} className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Selected Audit Record
              </span>
              <button
                type="button"
                onClick={() => setSelectedScan(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#172B4D]"
              >
                <X className="w-4 h-4" />
                <span>Close Detail</span>
              </button>
            </div>
            <ResultsDashboard
              result={selectedScan}
              onReset={() => setSelectedScan(null)}
            />
          </div>
        )}

        {/* Structured Audit Log Table */}
        <section className="card-enterprise overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-white flex items-center justify-between text-xs">
            <span className="font-semibold text-[#14243A] uppercase tracking-wider">
              Recorded Inspections
            </span>
            <span className="font-mono text-[#64748B]">
              Showing {filteredHistory.length} of {history.length}
            </span>
          </div>

          {filteredHistory.length > 0 ? (
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
                  {filteredHistory.map((item, idx) => {
                    const risk = getRiskBadgeStyles(item);
                    return (
                      <tr
                        key={item.id || idx}
                        onClick={() => handleSelectScan(item)}
                        className="cursor-pointer hover:bg-[#F5F7FA] transition-colors"
                      >
                        <td className="py-3 px-5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-[#F5F7FA] text-[#172B4D] font-mono text-[11px] font-semibold border border-[#E2E8F0]">
                            {normalizeModuleType(item.type)}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[260px] lg:max-w-[380px]">
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
                            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : history.length > 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-sm text-[#64748B]">
                No recorded scans match your current search or filter criteria.
              </p>
              <button type="button" onClick={resetFilters} className="btn-secondary">
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <div className="p-10 text-center space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#14243A]">
                  No Scans Recorded Yet
                </h3>
                <p className="text-[13.5px] text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Every scan executed across the URL, SMS, UPI VPA, Phone, and QR/OCR modules is automatically logged here with its timestamp and findings.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Link to="/url" className="btn-primary">
                  <span>Open URL Scanner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/upi" className="btn-secondary">
                  <span>Open UPI Checker</span>
                </Link>
                <Link to="/phone" className="btn-secondary">
                  <span>Open Phone Analyzer</span>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
