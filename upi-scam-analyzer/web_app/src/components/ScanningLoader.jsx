import { useState, useEffect } from 'react';
import { Cpu, Terminal, Check, Activity } from './Icons';

/**
 * ScanningLoader Component (Light/White Enterprise Theme)
 */
export default function ScanningLoader({ onComplete, targetValue = '' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);

  const steps = [
    { label: 'Validating input syntax and format' },
    { label: 'Evaluating local keyword and pattern rules' },
    { label: 'Checking hostname, prefix, or handle structure' },
    { label: 'Calculating heuristic risk score (0 to 25)' },
    { label: 'Preparing structured indicators and safety notes' },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(40);
    }, 280);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(65);
    }, 600);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(85);
    }, 920);

    const t4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgressPercent(100);
    }, 1250);

    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div className="w-full bg-white rounded-lg border border-[#E2E8F0] p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#0F172A]">
                Rule Inspection Running
              </h3>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] uppercase">
                Heuristic
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-0.5 font-mono truncate max-w-md">
              Target: <span className="text-[#0F172A]">{targetValue || 'Active Payload'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center font-mono">
          <Activity className="w-4 h-4 text-[#16A34A]" />
          <span className="text-2xl font-bold text-[#2563EB]">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="my-5">
        <div className="flex justify-between text-xs text-[#64748B] font-mono mb-2">
          <span>Inspection Progress</span>
          <span>Stage {currentStepIndex + 1} of {steps.length}</span>
        </div>
        <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
          <div
            className="h-full bg-[#2563EB] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((s, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                isCurrent
                  ? 'bg-[#EFF6FF] border border-[#BFDBFE]'
                  : isDone
                  ? 'bg-[#F8FAFC] border border-[#E2E8F0]'
                  : 'bg-white border border-[#E2E8F0]/60 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#2563EB] border border-[#93C5FD] flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] flex items-center justify-center flex-shrink-0 text-xs font-mono">
                    {idx + 1}
                  </div>
                )}
                <span
                  className={`text-sm font-mono ${
                    isCurrent ? 'text-[#0F172A] font-semibold' : isDone ? 'text-[#334155]' : 'text-[#64748B]'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {isDone && (
                <span className="text-xs font-mono font-medium text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                  Completed
                </span>
              )}
              {isCurrent && (
                <span className="text-xs font-mono font-semibold text-[#2563EB]">
                  Checking...
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#475569] flex items-center gap-2">
        <Terminal className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
        <span className="text-[#64748B]">[ENGINE]</span>
        <span className="text-[#0F172A] truncate">
          {currentStepIndex === 0 && 'Validating input syntax and format...'}
          {currentStepIndex === 1 && 'Evaluating local keyword and pattern rules...'}
          {currentStepIndex === 2 && 'Checking hostname, prefix, or handle structure...'}
          {currentStepIndex === 3 && 'Calculating heuristic risk score (0 to 25)...'}
          {currentStepIndex >= 4 && 'Preparing structured indicators and safety notes...'}
        </span>
      </div>
    </div>
  );
}
