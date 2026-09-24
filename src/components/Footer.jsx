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
    <footer className="w-full border-t border-[#1B4435] bg-[#061A14]/90 mt-24 py-12 px-4 sm:px-8 text-xs text-[#B4C9C0]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Branding */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="font-bold text-[#F4FFF9] font-display text-base tracking-tight">
              SPECTRAL <span className="text-[#48F5A3]">AI</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D2B20] text-[#48F5A3] border border-[#1B4435]">
              Digital Lab
            </span>
          </div>
          <p className="text-[#829A90] text-xs font-mono">
            HSI × ARTIFICIAL INTELLIGENCE × MICROBIAL PROFILING
          </p>
        </div>

        {/* Center Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-mono">
          <a href="#overview" className="hover:text-[#48F5A3] transition">
            Overview
          </a>
          <a href="#spectral-graph" className="hover:text-[#48F5A3] transition">
            Spectral Graph
          </a>
          <a href="#pipeline-3d" className="hover:text-[#48F5A3] transition">
            3D Pipeline
          </a>
          <a href="#pathogen-atlas" className="hover:text-[#48F5A3] transition">
            Pathogens
          </a>
          <a href="#analyze-workspace" className="text-[#48F5A3] font-bold hover:underline transition">
            Analyzer →
          </a>
        </div>

        {/* Right Action: API Online Status Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#0D2B20] hover:bg-[#11382A] border border-[#1B4435] hover:border-[#18C77A]/50 text-xs font-mono transition shadow-md cursor-pointer"
            title="Click to view Backend API Details & Health"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isHealthy ? 'bg-[#48F5A3]' : 'bg-[#F5C451]'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isHealthy ? 'bg-[#48F5A3]' : 'bg-[#F5C451]'
                }`}
              ></span>
            </span>

            <span className="text-[#F4FFF9] font-medium text-[11px]">
              {isCheckingHealth
                ? 'Connecting...'
                : isHealthy
                ? 'API Online'
                : 'Render Standby'}
            </span>

            {modelLoaded && (
              <span className="text-[10px] bg-[#18C77A]/20 text-[#48F5A3] px-1.5 py-0.2 rounded font-bold">
                CNN Ready
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#1B4435]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#829A90]">
        <div>
          © {new Date().getFullYear()} SPECTRAL AI Research Platform. All rights reserved.
        </div>
        <div>
          Non-Destructive Microbial Decision Support System
        </div>
      </div>

      {/* Backend API Info Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2B20] border border-[#48F5A3]/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B4435]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#48F5A3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-sm font-bold font-display text-[#F4FFF9]">
                  Backend API & Pipeline Status
                </h3>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-[#829A90] hover:text-[#48F5A3] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <span className="text-[#829A90] block mb-1">Target Base URL:</span>
                <span className="text-[#48F5A3] break-all font-semibold">
                  https://my-backend-biofilm-app-1.onrender.com
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                  <span className="text-[#829A90] block mb-1">GET /health:</span>
                  <span className={isHealthy ? 'text-[#48F5A3] font-bold' : 'text-[#F5C451]'}>
                    {backendHealth ? JSON.stringify(backendHealth) : 'Connecting...'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                  <span className="text-[#829A90] block mb-1">Target Classes:</span>
                  <span className="text-[#9BEFCE] font-bold">
                    6 Microbial Classes
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A241B] border border-[#1B4435] text-[#B4C9C0] space-y-1">
                <div className="text-[#48F5A3] font-semibold">Pipeline Architecture:</div>
                <div>• Input Shape: [null, 224, 224, 3]</div>
                <div>• Radiometric Calibration & PCA Dimension Reduction</div>
                <div>• Reported Validation Accuracy: 85.3%</div>
                <div>• POST /predict: multipart/form-data</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5 pt-2 border-t border-[#1B4435]">
              <button
                onClick={onRefreshHealth}
                className="px-4 py-2 rounded-xl bg-[#18C77A] text-[#061A14] font-bold font-mono text-xs transition cursor-pointer shadow-md"
              >
                Ping Health
              </button>
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0A241B] text-[#F4FFF9] font-mono text-xs transition border border-[#1B4435] cursor-pointer"
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

