import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { getCurrentUser } from '../services/authService';
import { getSubmittedReports, formatScanTimestamp } from '../services/scanHistory';
import { Lock, AlertTriangle, Info, ArrowRight } from '../components/Icons';

const SESSION_WATCHLIST_KEY = 'scam_analyzer_session_watchlist';

export default function Admin() {
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'Not signed in';
  const isAdmin = userEmail === 'nandakumarreddy63@gmail.com';

  const [reports, setReports] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState('UPI');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const submitted = getSubmittedReports().map((rep) => ({
      ...rep,
      status: rep.status === 'Logged for Review' ? 'Pending' : rep.status,
    }));
    setReports(submitted);

    try {
      const savedWatchlist = localStorage.getItem(SESSION_WATCHLIST_KEY);
      if (savedWatchlist) {
        const parsed = JSON.parse(savedWatchlist);
        if (Array.isArray(parsed)) setWatchlist(parsed);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  function persistWatchlist(nextList) {
    setWatchlist(nextList);
    try {
      localStorage.setItem(SESSION_WATCHLIST_KEY, JSON.stringify(nextList));
    } catch {
      // Ignore storage errors
    }
  }

  function handleApprove(id) {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const entry = {
            target: r.target,
            type: r.type,
            addedBy: userEmail,
            timestamp: new Date().toISOString(),
          };
          persistWatchlist([entry, ...watchlist]);
          return { ...r, status: 'Approved' };
        }
        return r;
      })
    );
  }

  function handleReject(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  }

  function handleAddWatchlist(e) {
    e.preventDefault();
    const cleaned = newTarget.trim();
    if (!cleaned) {
      setFormError('Enter an identifier before adding it to the session watchlist.');
      return;
    }
    setFormError('');
    const entry = {
      target: cleaned,
      type: newType,
      addedBy: userEmail,
      timestamp: new Date().toISOString(),
    };
    persistWatchlist([entry, ...watchlist]);
    setNewTarget('');
  }

  const pendingCount = reports.filter((r) => r.status === 'Pending').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Dark Navy Security Header Panel */}
        <div className="panel-navy-gradient text-white p-6 rounded-[10px] shadow-[0_1px_3px_rgba(20,36,58,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="bg-white/10 text-[#93C5FD] border border-white/15 text-xs font-semibold uppercase px-2.5 py-0.5 rounded tracking-wider font-mono">
                Session Moderation
              </span>
              <span className="text-sm text-[#CBD5E1] font-mono">{userEmail}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Local Report Moderation Console
            </h1>
            <p className="text-sm text-[#CBD5E1] mt-1">
              Review fraud reports logged during this browser session and manage a local session watchlist.
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 text-[#93C5FD] flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        {/* Scope Notice */}
        <div className="bg-white border border-[#E2E8F0] text-[#475569] p-4 rounded-lg text-sm flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0F172A]">Local Session Scope:</strong> This console displays reports submitted from this browser via the Fraud Entity Reporting page. Moderation actions update local browser storage only and do not publish to an external threat-intelligence feed or law enforcement system.
          </p>
        </div>

        {!isAdmin && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] p-3.5 rounded-lg text-sm font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0" />
            <span>Signed in as a standard user account. Administrative actions apply only to your local browser session.</span>
          </div>
        )}

        {/* Real Session Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Pending Review</div>
            <div className="text-3xl font-bold text-[#D97706] font-mono mt-1">{pendingCount}</div>
            <div className="text-xs text-[#64748B] mt-1">Submitted in this browser</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Total Session Reports</div>
            <div className="text-3xl font-bold text-[#2563EB] font-mono mt-1">{reports.length}</div>
            <div className="text-xs text-[#64748B] mt-1">Logged via Fraud Entity Reporting</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Session Watchlist</div>
            <div className="text-3xl font-bold text-[#16A34A] font-mono mt-1">{watchlist.length}</div>
            <div className="text-xs text-[#64748B] mt-1">Locally recorded identifiers</div>
          </div>
        </div>

        {/* User Report Queue */}
        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Submitted Reports Queue</h2>
              <p className="text-[#475569] text-sm mt-0.5">
                Approving a report copies the identifier into the local session watchlist below.
              </p>
            </div>
            <div className="text-xs font-mono text-[#64748B]">
              {reports.length} {reports.length === 1 ? 'Record' : 'Records'}
            </div>
          </div>

          {reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#64748B] font-semibold uppercase text-xs tracking-wider border-b border-[#E2E8F0]">
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Identifier</th>
                    <th className="p-3.5">Incident Description</th>
                    <th className="p-3.5">Evidence Notes</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="p-3.5">
                        <span className="bg-[#F1F5F9] text-[#334155] font-mono text-xs font-semibold px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {rep.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-[#0F172A] font-mono">{rep.target}</td>
                      <td className="p-3.5 text-[#334155] max-w-xs">{rep.reason}</td>
                      <td className="p-3.5 text-[#64748B] text-xs font-mono">{rep.proofText || 'None provided'}</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`text-xs font-semibold font-mono px-2.5 py-0.5 rounded uppercase tracking-wider border ${
                            rep.status === 'Approved'
                              ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                              : rep.status === 'Rejected'
                              ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
                              : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {rep.status === 'Pending' ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleApprove(rep.id)}
                              className="bg-[#16A34A] hover:bg-[#15803d] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(rep.id)}
                              className="bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#CBD5E1] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#64748B] text-xs">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <p className="text-sm text-[#475569]">
                No fraud reports have been submitted in this browser session yet.
              </p>
              <Link to="/report" className="btn-secondary">
                <span>Open Fraud Entity Reporting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Manual Session Watchlist Entry */}
        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-semibold text-[#0F172A]">Add Session Watchlist Entry</h2>
            <p className="text-[#475569] text-sm mt-0.5">
              Record a suspicious UPI handle, URL, or phone number in your local session watchlist.
            </p>
          </div>

          {formError && (
            <div className="text-sm text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3.5 py-2.5">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddWatchlist} className="flex gap-2.5 flex-col sm:flex-row">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option value="UPI">UPI VPA</option>
              <option value="URL">Phishing URL</option>
              <option value="SMS">SMS / Message</option>
              <option value="PHONE">Phone Number</option>
            </select>

            <input
              type="text"
              placeholder="e.g. scammer-vpa@ybl or http://phishing-site.com"
              value={newTarget}
              onChange={(e) => {
                setNewTarget(e.target.value);
                if (formError) setFormError('');
              }}
              className="flex-1 h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-[15px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 font-mono"
            />

            <button
              type="submit"
              className="btn-primary h-11 whitespace-nowrap"
            >
              Add to Watchlist
            </button>
          </form>
        </div>

        {/* Local Watchlist Table */}
        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-semibold text-[#0F172A]">Local Session Watchlist</h2>
            <span className="text-xs text-[#64748B] font-mono">{watchlist.length} Entries</span>
          </div>

          {watchlist.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#64748B] font-semibold uppercase text-xs tracking-wider border-b border-[#E2E8F0]">
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Identifier / Target</th>
                    <th className="p-3.5">Recorded By</th>
                    <th className="p-3.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {watchlist.map((b, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="p-3.5">
                        <span className="bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] text-xs font-mono font-semibold px-2 py-0.5 rounded">
                          {b.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-[#0F172A] font-mono">{b.target}</td>
                      <td className="p-3.5 text-[#475569]">{b.addedBy}</td>
                      <td className="p-3.5 text-right text-[#64748B] text-xs font-mono">
                        {formatScanTimestamp(b.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              No watchlist entries have been recorded in this session yet.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
