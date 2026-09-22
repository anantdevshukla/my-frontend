import React, { useState } from 'react';
import { getBiofilmByQuery, getBiofilmImage } from '../utils/biofilmAssets';

export default function ModelAttentionMap({ predictedClass }) {
  const [heatmapOpacity, setHeatmapOpacity] = useState(75);
  const [activeLayer, setActiveLayer] = useState('both'); // 'raw', 'gradcam', 'both'

  const biofilm = getBiofilmByQuery(predictedClass);

  return (
    <div className="p-6 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1B4435]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-pulse"></span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#48F5A3]">
            SPATIAL-SPECTRAL MODEL ATTENTION MAP (GRAD-CAM)
          </span>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-[#061A14] p-1 rounded-xl border border-[#1B4435] text-[11px] font-mono">
          <button
            onClick={() => setActiveLayer('raw')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeLayer === 'raw' ? 'bg-[#18C77A] text-[#061A14] font-bold' : 'text-[#829A90] hover:text-[#F4FFF9]'
            }`}
          >
            Raw Micrograph
          </button>
          <button
            onClick={() => setActiveLayer('both')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeLayer === 'both' ? 'bg-[#18C77A] text-[#061A14] font-bold' : 'text-[#829A90] hover:text-[#F4FFF9]'
            }`}
          >
            Grad-CAM Overlay
          </button>
          <button
            onClick={() => setActiveLayer('gradcam')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeLayer === 'gradcam' ? 'bg-[#18C77A] text-[#061A14] font-bold' : 'text-[#829A90] hover:text-[#F4FFF9]'
            }`}
          >
            Thermal Map
          </button>
        </div>
      </div>

      <p className="text-xs text-[#B4C9C0] leading-relaxed">
        High activation regions highlight distinctive optical absorption bands and cellular curli/EPS aggregation clusters for <strong className="text-[#F4FFF9]">{predictedClass}</strong>.
      </p>

      {/* Interactive Biofilm Attention Map Canvas with Image Blend */}
      <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-[#1B4435] bg-[#061A14]">
        {/* Layer 1: Real Biofilm Micrograph Image */}
        <img
          src={biofilm.image}
          alt={predictedClass}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            activeLayer === 'gradcam' ? 'opacity-15 grayscale' : 'opacity-100'
          }`}
        />

        {/* Layer 2: Synthetic Grad-CAM Attention Heatmap Hotspots */}
        {(activeLayer === 'both' || activeLayer === 'gradcam') && (
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none mix-blend-screen"
            style={{ opacity: heatmapOpacity / 100 }}
          >
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <radialGradient id="gradAttention1" cx="35%" cy="45%" r="35%">
                  <stop offset="0%" stopColor="#48F5A3" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#18C77A" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="#11382A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#061A14" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="gradAttention2" cx="72%" cy="58%" r="30%">
                  <stop offset="0%" stopColor="#9BEFCE" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#18C77A" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#061A14" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="gradAttention3" cx="50%" cy="30%" r="22%">
                  <stop offset="0%" stopColor="#20E08B" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#061A14" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Heatmap Hotspots */}
              <circle cx="175" cy="90" r="95" fill="url(#gradAttention1)" />
              <circle cx="360" cy="115" r="80" fill="url(#gradAttention2)" />
              <circle cx="250" cy="60" r="55" fill="url(#gradAttention3)" />

              {/* Contour Lines */}
              <ellipse cx="175" cy="90" rx="80" ry="55" fill="none" stroke="#48F5A3" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
              <ellipse cx="175" cy="90" rx="40" ry="28" fill="none" stroke="#9BEFCE" strokeWidth="1.5" opacity="0.9" />
              <ellipse cx="360" cy="115" rx="65" ry="45" fill="none" stroke="#48F5A3" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
            </svg>
          </div>
        )}

        {/* Reticle Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(72,245,163,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(72,245,163,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Specimen Tag */}
        <div className="absolute top-3 left-3 bg-[#061A14]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1B4435] text-xs font-mono text-[#F4FFF9] flex items-center gap-2">
          <img
            src={biofilm.image}
            alt={biofilm.name}
            className="w-4 h-4 rounded-full object-cover border border-[#48F5A3]"
          />
          <span>{biofilm.short} Extracellular Attention Zone</span>
        </div>

        {/* Heatmap intensity scale indicator */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[10px] font-mono text-[#B4C9C0] bg-[#0D2B20]/90 px-3 py-1.5 rounded-lg border border-[#1B4435] shadow-md">
          <span>Low Activation</span>
          <div className="w-16 h-2 rounded bg-gradient-to-r from-[#061A14] via-[#18C77A] to-[#48F5A3]"></div>
          <span className="text-[#48F5A3] font-bold">Peak Signal</span>
        </div>
      </div>

      {/* Heatmap Opacity Slider Control */}
      {activeLayer === 'both' && (
        <div className="flex items-center justify-between gap-4 pt-1 text-xs font-mono text-[#829A90]">
          <div className="flex items-center gap-2">
            <span>Overlay Blend Opacity:</span>
            <strong className="text-[#48F5A3]">{heatmapOpacity}%</strong>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={heatmapOpacity}
            onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
            className="w-40 sm:w-56 accent-[#18C77A] cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
