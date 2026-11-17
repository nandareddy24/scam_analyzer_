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
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />

      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                Threat Engine Active
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                Heuristic Scanner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono truncate max-w-md">
              Target: <span className="text-slate-200">{targetValue || 'Active Payload Target'}</span>
            </p>
          </div>
        </div>

        {/* Progress percent counter */}
        <div className="flex items-center gap-2.5 self-end sm:self-center font-mono">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-2xl font-extrabold text-blue-400">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-6">
        <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
          <span>Inspection Progress</span>
          <span>Stage {currentStepIndex + 1} of {steps.length}</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step by Step Checklist */}
      <div className="space-y-2.5">
        {steps.map((s, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl flex items-center justify-between transition-colors ${
                isCurrent
                  ? 'bg-blue-600/10 border border-blue-500/30'
                  : isDone
                  ? 'bg-slate-950/60 border border-slate-800'
                  : 'bg-transparent border border-slate-800/40 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center flex-shrink-0 text-[10px] font-mono">
                    {idx + 1}
                  </div>
                )}
                <span
                  className={`text-xs font-mono ${
                    isCurrent ? 'text-blue-300 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {isDone && (
                <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Completed
                </span>
              )}
              {isCurrent && (
                <span className="text-[10px] font-mono font-bold text-blue-400">
                  Analyzing...
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Telemetry Log */}
      <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <span className="text-slate-500">[ENGINE]</span>
        <span className="text-slate-300 truncate">
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
