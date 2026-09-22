import React, { useState, useRef } from 'react';

export default function RGBToHSISlider() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [selectedBand, setSelectedBand] = useState(540);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section id="rgb-vs-hsi" className="py-16 sm:py-24 relative">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2B20] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#18C77A]"></span>
          <span>01 // SPECTRAL DIFFERENTIATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-[#F4FFF9]">
          EVERY PIXEL HAS A SPECTRUM
        </h2>
        <p className="text-sm sm:text-base text-[#B4C9C0] mt-3 leading-relaxed">
          A conventional RGB microscope captures superficial spatial appearance across 3 broad bands. Hyperspectral imaging captures a continuous spectral signature for every spatial coordinate, resolving chemical fingerprints invisible to the human eye.
        </p>
      </div>

      {/* Main Interactive Comparison Console */}
      <div className="lab-surface p-6 sm:p-8 relative overflow-hidden">
        {/* Top Header Information */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1B4435]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#48F5A3]">
              Interactive Spatial–Spectral Comparator
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#829A90]">Active Wavelength Band:</span>
            <span className="px-2.5 py-0.5 rounded bg-[#11382A] text-[#48F5A3] border border-[#1B4435] font-bold">
              λ = {selectedBand} nm
            </span>
          </div>
        </div>

        {/* Interactive Split-Screen Image Slider */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerUp}
          className="relative w-full h-[360px] sm:h-[460px] rounded-2xl overflow-hidden mt-6 cursor-ew-resize select-none border border-[#1B4435]"
        >
          {/* Right Side: Hyperspectral False-Color Heatmap Representation */}
          <div className="absolute inset-0 bg-[#061A14] flex items-center justify-center">
            {/* Procedural High-Dimensional Spectral False-Color Visualization */}
            <svg className="w-full h-full object-cover" viewBox="0 0 800 500" preserveAspectRatio="none">
              <defs>
                <radialGradient id="hsiColony1" cx="35%" cy="45%" r="35%">
                  <stop offset="0%" stopColor="#48F5A3" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#18C77A" stopOpacity="0.7" />
                  <stop offset="75%" stopColor="#11382A" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#061A14" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="hsiColony2" cx="70%" cy="55%" r="30%">
                  <stop offset="0%" stopColor="#9BEFCE" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#20E08B" stopOpacity="0.6" />
                  <stop offset="85%" stopColor="#0D2B20" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#061A14" stopOpacity="0" />
                </radialGradient>
                <pattern id="hsiGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(72, 245, 163, 0.15)" strokeWidth="0.8" />
                </pattern>
              </defs>

              <rect width="800" height="500" fill="#0A241B" />
              <rect width="800" height="500" fill="url(#hsiGrid)" />

              {/* Biofilm matrix spectral absorptions */}
              <circle cx="280" cy="220" r="160" fill="url(#hsiColony1)" />
              <circle cx="560" cy="280" r="140" fill="url(#hsiColony2)" />
              <circle cx="420" cy="380" r="90" fill="url(#hsiColony1)" opacity="0.6" />

              {/* Optical contour isolines */}
              <ellipse cx="280" cy="220" rx="130" ry="110" fill="none" stroke="#48F5A3" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
              <ellipse cx="280" cy="220" rx="80" ry="70" fill="none" stroke="#9BEFCE" strokeWidth="1.2" opacity="0.9" />
              <ellipse cx="560" cy="280" rx="100" ry="85" fill="none" stroke="#48F5A3" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            </svg>

            {/* Label Overlay on Right */}
            <div className="absolute top-4 right-4 pointer-events-none bg-[#0D2B20]/90 border border-[#18C77A]/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#48F5A3] shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-ping"></span>
              <span className="font-bold">HYPERSPECTRAL RECONSTRUCTION (236 BANDS)</span>
            </div>

            <div className="absolute bottom-4 right-4 pointer-events-none bg-[#061A14]/85 border border-[#1B4435] backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-[#B4C9C0]">
              Optical Absorption Matrix (λ: 400nm - 1000nm)
            </div>
          </div>

          {/* Left Side: Conventional 3-Channel RGB Microscopy Image (Clipped by slider position) */}
          <div
            className="absolute inset-0 bg-[#061A14] flex items-center justify-center overflow-hidden border-r-2 border-[#48F5A3]"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-[800px] h-full">
              <svg className="w-full h-full object-cover" viewBox="0 0 800 500" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="rgbColony1" cx="35%" cy="45%" r="35%">
                    <stop offset="0%" stopColor="#96A69F" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#4F635B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22362F" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="rgbColony2" cx="70%" cy="55%" r="30%">
                    <stop offset="0%" stopColor="#8A9992" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#485952" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#22362F" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Flat Grayish RGB Microscopy Background */}
                <rect width="800" height="500" fill="#1C2E27" />
                <circle cx="280" cy="220" r="160" fill="url(#rgbColony1)" />
                <circle cx="560" cy="280" r="140" fill="url(#rgbColony2)" />
                <circle cx="420" cy="380" r="90" fill="url(#rgbColony1)" opacity="0.4" />
              </svg>
            </div>

            {/* Label Overlay on Left */}
            <div className="absolute top-4 left-4 pointer-events-none bg-[#0A241B]/90 border border-[#1B4435] backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#B4C9C0] shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#829A90]"></span>
              <span className="font-semibold">CONVENTIONAL RGB (3 BROADBAND CHANNELS)</span>
            </div>

            <div className="absolute bottom-4 left-4 pointer-events-none bg-[#061A14]/85 border border-[#1B4435] backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-[#829A90]">
              Superficial Color Appearance Only
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#48F5A3] shadow-[0_0_15px_#48F5A3] cursor-ew-resize flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="h-10 w-10 rounded-full bg-[#0D2B20] border-2 border-[#48F5A3] shadow-[0_0_20px_rgba(72,245,163,0.8)] flex items-center justify-center text-[#48F5A3] text-xs font-mono">
              ↔
            </div>
          </div>
        </div>

        {/* Bottom Technical Rationale Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#1B4435]">
          <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#48F5A3] font-bold">Spatial Resolution</span>
            <h4 className="text-sm font-bold text-[#F4FFF9] font-display">224 × 224 Pixel Coordinate Matrix</h4>
            <p className="text-xs text-[#829A90]">Maintains fine optical cellular morphology and extracellular matrix distribution.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#48F5A3] font-bold">Spectral Resolution</span>
            <h4 className="text-sm font-bold text-[#F4FFF9] font-display">236 Contiguous Narrow Bands</h4>
            <p className="text-xs text-[#829A90]">Extracts distinct optical absorbance and pigment chromophores across 400 - 1000 nm.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#48F5A3] font-bold">AI Feature Extraction</span>
            <h4 className="text-sm font-bold text-[#F4FFF9] font-display">Spatial-Spectral Tensor Fusion</h4>
            <p className="text-xs text-[#829A90]">Deep CNN extracts orthogonal eigen-projections for reliable multi-pathogen profiling.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
