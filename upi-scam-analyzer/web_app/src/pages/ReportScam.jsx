import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert } from '../components/Icons';

export default function ReportScam() {
  const [type, setType] = useState('UPI');
  const [target, setTarget] = useState('');
  const [reason, setReason] = useState('');
  const [proofText, setProofText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!target.trim() || !reason.trim()) return;
    setSubmitted(true);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Report Fraudulent Entity</h1>
              <p className="text-xs text-slate-400">
                Submit suspicious UPI handles, phishing web links, or deceptive SMS senders into our threat intelligence moderation queue.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="p-8 text-center bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Report Submitted to Threat Registry</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Your report for <strong className="font-mono text-blue-400">{target}</strong> has been logged into the moderation review queue for heuristic pattern indexing.
                </p>
              </div>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30"
                onClick={() => { setSubmitted(false); setTarget(''); setReason(''); setProofText(''); }}
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Threat Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="UPI">UPI Virtual Payment Address (VPA)</option>
                  <option value="URL">Phishing Web Link / Domain</option>
                  <option value="SMS">SMS or WhatsApp Message Sender</option>
                  <option value="PHONE">Spoofed Phone Caller ID</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Reported Identifier or Link
                </label>
                <input
                  type="text"
                  placeholder={
                    type === 'UPI'
                      ? 'e.g. fake-refund-care@ybl'
                      : type === 'URL'
                      ? 'e.g. http://fake-bank-login.com'
                      : 'e.g. +919876543210'
                  }
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Details of the Scam Incident
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the fraud method, e.g. caller impersonated customer support and requested a collect authorization..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Evidence Notes or Source Header (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Screenshot URL, SMS sender header (e.g. VK-SBIINB)"
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <span>Submit Fraud Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
