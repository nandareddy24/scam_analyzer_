import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { ArrowLeft } from '../components/Icons';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/');
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Previous Screen</span>
          </button>
          <span className="text-xs font-mono text-slate-500 uppercase">
            Forensic Verdict
          </span>
        </div>

        <ResultsDashboard
          result={result}
          onReset={() => navigate('/')}
        />
      </div>
    </AppLayout>
  );
}
