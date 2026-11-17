import { useState, useEffect } from 'react';
import { Cpu, Terminal, Shield, Check, Activity } from './Icons';

/**
 * ScanningLoader Component
 * Multi-stage dynamic progress indicator displaying real-time
 * cybersecurity telemetry inspection steps.
 */
export default function ScanningLoader({ onComplete, targetType = 'URL', targetValue = '' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);

  const steps = [
    { label: 'Validating input structure and RFC compliance' },
    { label: 'Checking threat signatures and known blacklist patterns' },
    { label: 'Running heuristic analysis and domain reputation evaluation' },
    { label: 'Evaluating protocol security and redirect obfuscation' },
    { label: 'Synthesizing defensive guidance and incident verdict' },
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
    <div className="w-full bg-[#111C2E] rounded-lg border border-[#26364D] p-5 sm:p-6 relative">
      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#26364D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#0F172A] border border-[#26364D] flex items-center justify-center text-[#3B82F6]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#F1F5F9]">
                Threat Engine Active
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 uppercase">
                Heuristic Scanner
              </span>
            </div>
            <p className="text-xs text-[#8291A6] mt-0.5 font-mono truncate max-w-md">
              Target: <span className="text-[#F1F5F9]">{targetValue || 'Active Payload Target'}</span>
            </p>
          </div>
        </div>

        {/* Progress percent counter */}
        <div className="flex items-center gap-2 self-end sm:self-center font-mono">
          <Activity className="w-4 h-4 text-[#16A34A]" />
          <span className="text-xl font-bold text-[#3B82F6]">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-5">
        <div className="flex justify-between text-xs text-[#8291A6] font-mono mb-2">
          <span>Inspection Progress</span>
          <span>Stage {currentStepIndex + 1} of {steps.length}</span>
        </div>
        <div className="w-full h-1.5 bg-[#080F1D] rounded-full overflow-hidden border border-[#26364D]">
          <div
            className="h-full bg-[#3B82F6] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step by Step Checklist */}
      <div className="space-y-2">
        {steps.map((s, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-md flex items-center justify-between transition-colors ${
                isCurrent
                  ? 'bg-[#0F172A] border border-[#3B82F6]/50'
                  : isDone
                  ? 'bg-[#080F1D] border border-[#26364D]'
                  : 'bg-transparent border border-[#26364D]/40 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/50 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-[#080F1D] text-[#8291A6] border border-[#26364D] flex items-center justify-center flex-shrink-0 text-[10px] font-mono">
                    {idx + 1}
                  </div>
                )}
                <span
                  className={`text-xs font-mono ${
                    isCurrent ? 'text-[#F1F5F9] font-medium' : isDone ? 'text-[#A8B5C7]' : 'text-[#8291A6]'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {isDone && (
                <span className="text-[10px] font-mono font-medium text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded border border-[#16A34A]/20">
                  Completed
                </span>
              )}
              {isCurrent && (
                <span className="text-[10px] font-mono font-semibold text-[#3B82F6]">
                  Analyzing...
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Telemetry Log */}
      <div className="mt-4 p-2.5 rounded-md bg-[#080F1D] border border-[#26364D] text-[11px] font-mono text-[#8291A6] flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0" />
        <span className="text-[#8291A6]">[ENGINE]</span>
        <span className="text-[#A8B5C7] truncate">
          {currentStepIndex === 0 && 'Validating RFC syntax and protocol format...'}
          {currentStepIndex === 1 && 'Checking threat signatures against known scam databases...'}
          {currentStepIndex === 2 && 'Executing regex pattern analysis and keyword weighting...'}
          {currentStepIndex === 3 && 'Evaluating protocol security and redirect structure...'}
          {currentStepIndex >= 4 && 'Consolidating risk score and generating mitigation verdict...'}
        </span>
      </div>
    </div>
  );
}
