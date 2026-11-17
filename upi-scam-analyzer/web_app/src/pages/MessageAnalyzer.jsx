import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeMessage } from '../services/analyzer';
import { MessageSquare, Search } from '../components/Icons';

export default function MessageAnalyzer() {
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState(null);

  const presets = [
    { 
      label: 'Electricity Power Disconnection', 
      val: 'URGENT: Dear customer, your electricity power will be disconnected tonight at 9:30 PM because your previous bill was not updated. Immediately contact our officer at 9876543210.' 
    },
    { 
      label: 'Lottery Prize Lure', 
      val: 'Congratulations! Your mobile number won ₹25 Lakhs in Lucky Draw. To credit your reward immediately verify bank details and OTP.' 
    },
    { 
      label: 'Standard Account Alert', 
      val: 'Your account XXX1234 has been credited with INR 3,000 on 17-Nov-2026. Available balance is INR 28,450.00. Thank you for banking with us.' 
    },
  ];

  function handleCheck(e) {
    if (e) e.preventDefault();
    if (!msg.trim()) return;
    setResult(analyzeMessage(msg.trim()));
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                SMS & Message Scam Lure Scanner
              </h1>
              <p className="text-xs text-slate-400">
                Detect urgent electricity disconnection threats, fake bank lottery claims, and OTP harvesting traps.
              </p>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Message Content (SMS, WhatsApp, or Notification)
              </label>
              <textarea
                rows={4}
                placeholder="Paste the SMS or message content here..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Test examples:</span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMsg(p.val);
                    setResult(analyzeMessage(p.val));
                  }}
                  className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!msg.trim()}
              className="py-2.5 px-5 rounded font-semibold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Analyze Message</span>
            </button>
          </form>
        </div>

        {/* Results Component */}
        {result && (
          <ResultsDashboard
            result={result}
            onReset={() => {
              setResult(null);
              setMsg('');
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
