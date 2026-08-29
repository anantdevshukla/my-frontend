import React, { useState } from 'react';

export default function Footer({
  backendHealth,
  backendInfo,
  isCheckingHealth,
  onRefreshHealth
}) {
  const [showApiModal, setShowApiModal] = useState(false);

  const isHealthy = backendHealth && backendHealth.status === 'healthy';
  const modelLoaded =
    (backendHealth && backendHealth.model_loaded) ||
    (backendInfo && backendInfo.num_classes === 6);

  return (
    <footer className="w-full border-t border-light-border dark:border-dark-border bg-light-secondary/40 dark:bg-dark-secondary/60 mt-20 py-12 px-4 sm:px-8 text-xs text-light-textSecondary dark:text-dark-textSecondary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Branding */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-light-textPrimary dark:text-dark-textPrimary font-display text-sm tracking-tight">
              BIOFILM <span className="signature-gradient-text">AI</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-light-card dark:bg-dark-surface border border-light-border dark:border-dark-border">
              Research Prototype
            </span>
          </div>
          <p className="text-light-textMuted dark:text-dark-textMuted text-xs font-normal">
            AI-assisted hyperspectral biofilm profiling for microbial classification.
          </p>
        </div>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <a href="#how-it-works" className="hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition">
            How it works
          </a>
          <a href="#workflow" className="hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition">
            Workflow
          </a>
          <a href="#taxonomy" className="hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition">
            Taxonomy
          </a>
          <a href="#analyze-workspace" className="text-brand-blue dark:text-brand-electric hover:underline transition">
            Analyze
          </a>
        </div>

        {/* Right Action: API Online Status Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-light-card dark:bg-dark-surface hover:bg-light-elevated dark:hover:bg-dark-elevated border border-light-border dark:border-dark-border text-xs font-mono transition shadow-sm cursor-pointer"
            title="Click to view Backend API Details & Health"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isHealthy
                    ? 'bg-status-successLight dark:bg-status-successDark'
                    : 'bg-status-warningLight dark:bg-status-warningDark'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isHealthy
                    ? 'bg-status-successLight dark:bg-status-successDark'
                    : 'bg-status-warningLight dark:bg-status-warningDark'
                }`}
              ></span>
            </span>

            <span className="text-light-textPrimary dark:text-dark-textPrimary font-medium text-[11px]">
              {isCheckingHealth
                ? 'Connecting...'
                : isHealthy
                ? 'API Online'
                : 'Render Standby'}
            </span>

            {modelLoaded && (
              <span className="text-[10px] bg-status-successLight/10 dark:bg-status-successDark/15 text-status-successLight dark:text-status-successDark px-1.5 py-0.2 rounded font-semibold">
                CNN Ready
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-light-border/60 dark:border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-light-textMuted dark:text-dark-textMuted">
        <div>
          © {new Date().getFullYear()} Biofilm AI Research Platform.
        </div>
        <div>
          Scientific Decision Support • Experimental Prototype
        </div>
      </div>

      {/* Backend API Info Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-sm font-bold font-display text-light-textPrimary dark:text-dark-textPrimary">
                  System Architecture & Health
                </h3>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-light-textMuted dark:text-dark-textMuted hover:text-light-textPrimary dark:hover:text-dark-textPrimary text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
                <span className="text-light-textMuted dark:text-dark-textMuted block mb-1">Target Base URL:</span>
                <span className="text-brand-blue dark:text-brand-electric break-all font-semibold">
                  https://my-backend-biofilm-app-1.onrender.com
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
                  <span className="text-light-textMuted dark:text-dark-textMuted block mb-1">GET /health:</span>
                  <span className={isHealthy ? 'text-status-successLight dark:text-status-successDark font-bold' : 'text-status-warningLight dark:text-status-warningDark'}>
                    {backendHealth ? JSON.stringify(backendHealth) : 'Connecting...'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
                  <span className="text-light-textMuted dark:text-dark-textMuted block mb-1">Target Classes:</span>
                  <span className="text-brand-violet dark:text-brand-softViolet font-bold">
                    6 Pathogen Classes
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary space-y-1">
                <div className="text-brand-blue dark:text-brand-electric font-semibold">Pipeline Protocol:</div>
                <div>• Input Shape: [null, 224, 224, 3]</div>
                <div>• Preprocessing: Automated Radiometric & PCA Extraction</div>
                <div>• Reported Validation Accuracy: 85.3%</div>
                <div>• POST /predict: multipart/form-data</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onRefreshHealth}
                className="px-4 py-2 rounded-lg bg-brand-blue dark:bg-brand-electric text-white dark:text-dark-bg font-semibold font-mono text-xs transition cursor-pointer"
              >
                Ping Health
              </button>
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 rounded-lg bg-light-secondary dark:bg-dark-elevated text-light-textPrimary dark:text-dark-textPrimary font-mono text-xs transition border border-light-border dark:border-dark-border cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
