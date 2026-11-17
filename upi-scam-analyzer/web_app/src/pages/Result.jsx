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
        <div className="flex items-center justify-between border-b border-[#26364D] pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#A8B5C7] hover:text-[#F1F5F9] bg-[#111C2E] hover:bg-[#16243B] px-3.5 py-2 rounded-md border border-[#26364D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Previous Screen</span>
          </button>
          <span className="text-xs font-mono text-[#8291A6] uppercase">
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
