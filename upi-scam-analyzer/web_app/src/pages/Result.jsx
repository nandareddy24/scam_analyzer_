import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { RelevantHistorySection } from '../components/ScannerPrimitives';
import { getScanHistory, normalizeModuleType } from '../services/scanHistory';
import { ArrowLeft } from '../components/Icons';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate('/', { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  const moduleType = normalizeModuleType(result.type);
  const relevantHistory = getScanHistory(moduleType);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
            <span>Back</span>
          </button>
          <span className="text-xs font-mono font-semibold text-[#64748B] uppercase">
            Scan Assessment Report
          </span>
        </div>

        <ResultsDashboard
          result={result}
          onReset={() => navigate('/')}
        />

        <RelevantHistorySection
          title={`Recent ${moduleType} Scans`}
          items={relevantHistory}
          onSelect={(selected) => navigate('/result', { state: { result: selected } })}
        />
      </div>
    </AppLayout>
  );
}
