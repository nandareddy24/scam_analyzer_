import AppLayout from '../components/AppLayout';
import { Clock, ShieldAlert, ShieldCheck, AlertTriangle } from '../components/Icons';

export default function History() {
  const mockScans = [
    { type: 'UPI', target: 'scam-refund@ybl', result: 'High Risk Scam Handle', badge: 'danger', score: '22/25', date: 'Just now' },
    { type: 'URL', target: 'http://192.168.1.1/login', result: 'Phishing Domain', badge: 'danger', score: '18/25', date: '10 mins ago' },
    { type: 'SMS', target: 'Dear customer your account will be blocked...', result: 'Suspicious Warning', badge: 'warning', score: '9/25', date: '1 hour ago' },
    { type: 'UPI', target: 'nandareddy@oksbi', result: 'Verified Standard Handle', badge: 'safe', score: '0/25', date: 'Yesterday' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Personal Scan Audit History</h1>
              <p className="text-xs text-slate-400">
                Review past inspections, threat scores, and flagged payloads across your account session.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl divide-y divide-slate-800/80 overflow-hidden">
          {mockScans.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-800/40 transition-colors gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${
                    item.badge === 'danger'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : item.badge === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {item.type}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 text-xs sm:text-sm font-mono">{item.target}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.result} &bull; {item.date}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                    item.badge === 'danger'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : item.badge === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {item.badge}
                </span>
                <div className="text-xs font-mono font-bold text-slate-400">
                  Score: {item.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
