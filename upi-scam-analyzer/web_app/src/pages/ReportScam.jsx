import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { AlertTriangle, CheckCircle2, ArrowRight } from '../components/Icons';

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
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-slate-800 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">Report Fraud Incident</h1>
              <p className="text-xs text-slate-400">
                Submit suspicious UPI handles, phishing web links, or deceptive SMS senders to our review queue.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
          {submitted ? (
            <div className="p-6 text-center bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Report Successfully Submitted</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Your report for <strong className="font-mono text-slate-200">{target}</strong> has been logged for heuristic review and pattern indexing.
                </p>
              </div>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded text-xs transition-colors"
                onClick={() => { setSubmitted(false); setTarget(''); setReason(''); setProofText(''); }}
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Threat Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="UPI">UPI Virtual Payment Address (VPA)</option>
                  <option value="URL">Phishing Web Link / Domain</option>
                  <option value="SMS">SMS or WhatsApp Message Sender</option>
                  <option value="PHONE">Phone Caller ID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Incident Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the fraud method, e.g. caller impersonated customer support and requested a collect approval..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Evidence Notes or SMS Header (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SMS header VK-SBIINB or WhatsApp number"
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Submit Incident Report</span>
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
