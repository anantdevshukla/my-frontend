import React, { useState, useEffect } from 'react';

export default function ProcessingState() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Spectral acquisition & tensor validation', duration: 300 },
    { label: 'Radiometric dark/white calibration', duration: 400 },
    { label: 'PCA dimension reduction (236 → 3 channels)', duration: 450 },
    { label: 'CNN spatial-spectral feature extraction', duration: 500 },
    { label: 'Evaluating 6-class softmax probability distribution', duration: 350 }
  ];

  useEffect(() => {
    let accumulated = 0;
    const timeouts = steps.map((s, idx) => {
      accumulated += s.duration;
      return setTimeout(() => {
        setCurrentStep(idx);
      }, accumulated);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-[#0D2B20] border border-[#18C77A]/40 shadow-xl relative overflow-hidden animate-fadeIn space-y-4">
      {/* Luminous emerald scan line */}
      <div className="spectral-scan-line"></div>

      <div className="flex items-center justify-between border-b border-[#1B4435] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#48F5A3] animate-ping"></span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#48F5A3]">
            SPECTRAL ANALYSIS IN PROGRESS
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#829A90]">
          Inference Protocol v1.0
        </span>
      </div>

      {/* Progressive Stage Checklist */}
      <div className="space-y-2 text-xs font-mono">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isRunning = currentStep === idx;
          return (
            <div
              key={step.label}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isRunning
                  ? 'bg-[#11382A] border-[#48F5A3] text-[#F4FFF9]'
                  : isDone
                  ? 'bg-[#0A241B]/60 border-[#1B4435] text-[#829A90]'
                  : 'bg-transparent border-transparent text-[#829A90]/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <span className="h-4 w-4 rounded-full bg-[#18C77A] text-[#061A14] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : isRunning ? (
                  <span className="h-4 w-4 rounded-full border-2 border-[#48F5A3] border-t-transparent animate-spin"></span>
                ) : (
                  <span className="h-4 w-4 rounded-full border border-[#1B4435] text-transparent">
                    ○
                  </span>
                )}
                <span>{step.label}</span>
              </div>

              <span className="text-[10px] uppercase font-bold">
                {isDone ? (
                  <span className="text-[#48F5A3]">DONE</span>
                ) : isRunning ? (
                  <span className="text-[#9BEFCE] animate-pulse">PROCESSING</span>
                ) : (
                  <span>QUEUED</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
