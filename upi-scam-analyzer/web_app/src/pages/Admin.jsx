import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { getCurrentUser } from '../services/authService';
import { Lock, Shield, CheckCircle2, Ban, AlertTriangle, User } from '../components/Icons';

export default function Admin() {
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || 'nandakumarreddy63@gmail.com';
  const isAdmin = userEmail === 'nandakumarreddy63@gmail.com';

  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'UPI',
      target: 'refund-fake-helpdesk@ybl',
      reason: 'Claimed to refund Google Pay transaction of ₹4,999, asked to accept UPI request.',
      proof: 'Screenshot evidence: Ask to approve ₹4999 collect request.',
      status: 'Pending',
      date: '10 mins ago',
    },
    {
      id: 2,
      type: 'URL',
      target: 'http://192.168.1.55/update-kyc-bank',
      reason: 'SMS link claiming SBI account will be blocked if KYC not updated in 2 hours.',
      proof: 'SMS header VK-SBIINB: Click http://192.168.1.55/update-kyc-bank.',
      status: 'Pending',
      date: '1 hour ago',
    },
    {
      id: 3,
      type: 'SMS',
      target: '+919876543210',
      reason: 'Lottery scam message offering ₹25 Lakhs cash prize via KBC WhatsApp.',
      proof: 'Message text: Dear customer, your number won ₹25 Lakhs in Lucky Draw.',
      status: 'Pending',
      date: '3 hours ago',
    },
  ]);

  const [blacklists, setBlacklists] = useState([
    { target: 'lottery-winner-kbc@ybl', type: 'UPI', addedBy: 'nandakumarreddy63@gmail.com', date: 'Yesterday' },
    { target: 'http://verify-bank-account-gpay.com', type: 'URL', addedBy: 'nandakumarreddy63@gmail.com', date: '2 days ago' },
  ]);

  const [newBlacklistTarget, setNewBlacklistTarget] = useState('');
  const [newBlacklistType, setNewBlacklistType] = useState('UPI');

  function handleApprove(id) {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          setBlacklists((bl) => [
            ...bl,
            { target: r.target, type: r.type, addedBy: userEmail, date: 'Just now' },
          ]);
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

  function handleAddBlacklist(e) {
    e.preventDefault();
    if (!newBlacklistTarget.trim()) return;
    setBlacklists((prev) => [
      ...prev,
      { target: newBlacklistTarget.trim(), type: newBlacklistType, addedBy: userEmail, date: 'Just now' },
    ]);
    setNewBlacklistTarget('');
  }

  const pendingCount = reports.filter((r) => r.status === 'Pending').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-[#111C2E] text-[#F1F5F9] p-5 rounded-lg border border-[#26364D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider font-mono">
                Admin Console
              </span>
              <span className="text-xs text-[#8291A6] font-mono">{userEmail}</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-[#F1F5F9]">
              Security Moderation Console
            </h1>
            <p className="text-xs text-[#A8B5C7] mt-0.5">
              Review flagged payment entities, verify reports, and manage heuristic blacklists.
            </p>
          </div>
          <div className="w-9 h-9 rounded-md bg-[#0F172A] border border-[#26364D] text-[#A8B5C7] flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        {!isAdmin && (
          <div className="bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] p-3 rounded-md text-xs font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0" />
            <span>Administrator preview active for demonstration. Production actions require root permissions.</span>
          </div>
        )}

        {/* Operational Queue Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111C2E] p-4 rounded-lg border border-[#26364D]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8291A6]">Pending Review</div>
            <div className="text-2xl font-bold text-[#D97706] font-mono mt-1">{pendingCount}</div>
            <div className="text-[11px] text-[#8291A6] mt-0.5">Awaiting moderator verdict</div>
          </div>

          <div className="bg-[#111C2E] p-4 rounded-lg border border-[#26364D]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8291A6]">Total Submissions</div>
            <div className="text-2xl font-bold text-[#3B82F6] font-mono mt-1">{reports.length}</div>
            <div className="text-[11px] text-[#8291A6] mt-0.5">Logged in current session</div>
          </div>

          <div className="bg-[#111C2E] p-4 rounded-lg border border-[#26364D]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8291A6]">Blacklisted Entities</div>
            <div className="text-2xl font-bold text-[#16A34A] font-mono mt-1">{blacklists.length}</div>
            <div className="text-[11px] text-[#8291A6] mt-0.5">Active heuristic rules</div>
          </div>
        </div>

        {/* Community Reports Moderation Queue */}
        <div className="bg-[#111C2E] p-5 rounded-lg border border-[#26364D] space-y-4">
          <div className="border-b border-[#26364D] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">User Report Moderation Queue</h3>
              <p className="text-[#A8B5C7] text-xs mt-0.5">
                Approving a submitted threat adds the identifier directly to the heuristic blacklist database.
              </p>
            </div>
            <div className="text-xs font-mono text-[#8291A6]">
              {reports.length} Records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#080F1D] text-[#8291A6] font-semibold uppercase text-[10px] tracking-wider border-b border-[#26364D]">
                  <th className="p-3">Type</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Incident Description</th>
                  <th className="p-3">Proof Evidence</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26364D]">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#16243B] transition-colors">
                    <td className="p-3">
                      <span className="bg-[#0F172A] text-[#A8B5C7] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#26364D]">
                        {rep.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#F1F5F9] font-mono">{rep.target}</td>
                    <td className="p-3 text-[#A8B5C7] max-w-xs">{rep.reason}</td>
                    <td className="p-3 text-[#8291A6] text-[11px] font-mono">{rep.proof}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider border ${
                        rep.status === 'Approved' ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30' :
                        rep.status === 'Rejected' ? 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30' :
                        'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {rep.status === 'Pending' ? (
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleApprove(rep.id)}
                            className="bg-[#16A34A] hover:bg-[#15803d] text-white px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(rep.id)}
                            className="bg-[#0F172A] hover:bg-[#16243B] text-[#A8B5C7] border border-[#26364D] px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#8291A6] text-xs">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add To Blacklist Section */}
        <div className="bg-[#111C2E] p-5 rounded-lg border border-[#26364D] space-y-3">
          <div className="border-b border-[#26364D] pb-2.5">
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Direct Blacklist Entry</h3>
            <p className="text-[#A8B5C7] text-xs mt-0.5">
              Add known fraudulent UPI handles or phishing links directly into the system database.
            </p>
          </div>

          <form onSubmit={handleAddBlacklist} className="flex gap-2 flex-col sm:flex-row">
            <select
              value={newBlacklistType}
              onChange={(e) => setNewBlacklistType(e.target.value)}
              className="px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs font-semibold text-[#F1F5F9] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            >
              <option value="UPI">UPI VPA</option>
              <option value="URL">Phishing URL</option>
              <option value="SMS">SMS / Phone</option>
            </select>

            <input
              type="text"
              placeholder="e.g. scammer-vpa@ybl or http://phishing-site.com"
              value={newBlacklistTarget}
              onChange={(e) => setNewBlacklistTarget(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono"
            />

            <button
              type="submit"
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Add to Blacklist
            </button>
          </form>
        </div>

        {/* Active Blacklisted Database Table */}
        <div className="bg-[#111C2E] p-5 rounded-lg border border-[#26364D] space-y-3">
          <div className="flex items-center justify-between border-b border-[#26364D] pb-2.5">
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Active Blacklisted Entities</h3>
            <span className="text-xs text-[#8291A6] font-mono">{blacklists.length} Identifiers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#080F1D] text-[#8291A6] font-semibold uppercase text-[10px] tracking-wider border-b border-[#26364D]">
                  <th className="p-3">Type</th>
                  <th className="p-3">Identifier / Target</th>
                  <th className="p-3">Logged By</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26364D]">
                {blacklists.map((b, idx) => (
                  <tr key={idx} className="hover:bg-[#16243B] transition-colors">
                    <td className="p-3">
                      <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {b.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#F1F5F9] font-mono">{b.target}</td>
                    <td className="p-3 text-[#A8B5C7] text-xs">{b.addedBy}</td>
                    <td className="p-3 text-right text-[#8291A6] text-xs">{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
