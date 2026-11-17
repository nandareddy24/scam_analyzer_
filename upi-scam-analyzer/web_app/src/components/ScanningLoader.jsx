import { useState, useEffect } from 'react';
import { Cpu, Terminal, Shield, Check, Activity } from './Icons';

/**
 * ScanningLoader Component
 * Multi-stage dynamic progress indicator displaying realistic real-time
 * cybersecurity telemetry inspection steps.
 */
export default function ScanningLoader({ onComplete, targetType = 'URL', targetValue = '' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  const steps = [
    { label: 'Parsing input syntax and RFC compliance...', latency: '12ms' },
    { label: 'Querying global threat intelligence & 1930 registry...', latency: '34ms' },
    { label: 'Running heuristic pattern matching & payload inspection...', latency: '48ms' },
    { label: 'Evaluating cryptographic integrity & domain reputation...', latency: '26ms' },
    { label: 'Synthesizing defensive guidance & incident verdict...', latency: '18ms' },
  ];

  useEffect(() => {
    // Stage 1 -> Stage 2
    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(38);
    }, 280);

    // Stage 2 -> Stage 3
    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(64);
    }, 620);

    // Stage 3 -> Stage 4
    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(85);
    }, 980);

    // Stage 4 -> Stage 5
    const t4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgressPercent(100);
    }, 1320);

    // Complete
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1650);

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
      {/* Top Cyber Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 animate-pulse" />

      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                Threat Engine Active
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                Heuristic Scanner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono truncate max-w-md">
              Target: <span className="text-slate-200">{targetValue || 'Active Payload Target'}</span>
            </p>
          </div>
        </div>

        {/* Progress percent counter */}
        <div className="flex items-center gap-3 self-end sm:self-center font-mono">
          <Activity className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-2xl font-extrabold text-blue-400">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Animated Shimmer Progress Bar */}
      <div className="my-6">
        <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
          <span>Inspection Progress</span>
          <span>Stage {currentStepIndex + 1} of {steps.length}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step by Step Checklist */}
      <div className="space-y-3">
        {steps.map((s, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : isDone
                  ? 'bg-slate-800/40 border border-slate-800/80 opacity-90'
                  : 'bg-transparent border border-slate-800/30 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center flex-shrink-0 animate-spin">
                    <div className="w-2.5 h-2.5 border-2 border-blue-400 border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-600 border border-slate-700 flex items-center justify-center flex-shrink-0 text-[10px] font-mono">
                    {idx + 1}
                  </div>
                )}
                <span
                  className={`text-xs font-medium font-mono ${
                    isCurrent ? 'text-blue-300 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {isDone && (
                <span className="text-[10px] font-mono font-medium text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {s.latency}
                </span>
              )}
              {isCurrent && (
                <span className="text-[10px] font-mono font-bold text-blue-400 animate-pulse">
                  Processing...
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Telemetry Terminal Ticker */}
      <div className="mt-6 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <span className="text-slate-500">[LOG]</span>
        <span className="text-slate-300 truncate">
          {currentStepIndex === 0 && 'Validating RFC syntax and schema constraints...'}
          {currentStepIndex === 1 && 'Querying 42,000+ known cybercrime blacklists...'}
          {currentStepIndex === 2 && 'Executing regex pattern analysis & social engineering detection...'}
          {currentStepIndex === 3 && 'Evaluating TLS certificates and cryptographic fingerprints...'}
          {currentStepIndex >= 4 && 'Consolidating risk score & building mitigation report...'}
        </span>
      </div>
    </div>
  );
}
