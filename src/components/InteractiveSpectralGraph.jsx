import React, { useState } from 'react';
import { BIOFILM_SPECIES, getBiofilmByQuery } from '../utils/biofilmAssets';

export default function InteractiveSpectralGraph() {
  const [hoveredWl, setHoveredWl] = useState(545);
  const [selectedPathogenId, setSelectedPathogenId] = useState('ecoli');

  const activeBiofilm = getBiofilmByQuery(selectedPathogenId);

  // Calculate live interpolated reflectance for the hovered wavelength
  const getInterpolatedReflectance = (wl) => {
    const pts = activeBiofilm.points;
    if (wl <= pts[0].wl) return pts[0].r;
    if (wl >= pts[pts.length - 1].wl) return pts[pts.length - 1].r;
    for (let i = 0; i < pts.length - 1; i++) {
      if (wl >= pts[i].wl && wl <= pts[i + 1].wl) {
        const t = (wl - pts[i].wl) / (pts[i + 1].wl - pts[i].wl);
        return pts[i].r + t * (pts[i + 1].r - pts[i].r);
      }
    }
    return 0.5;
  };

  const currentReflectance = getInterpolatedReflectance(hoveredWl);

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const wlToX = (wl) => paddingX + ((wl - 400) / 600) * graphWidth;
  const rToY = (r) => paddingY + (1 - r) * graphHeight;

  // Build SVG Path
  const points = activeBiofilm.points;
  let pathD = `M ${wlToX(points[0].wl)} ${rToY(points[0].r)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (wlToX(prev.wl) + wlToX(curr.wl)) / 2;
    pathD += ` C ${midX} ${rToY(prev.r)}, ${midX} ${rToY(curr.r)}, ${wlToX(curr.wl)} ${rToY(curr.r)}`;
  }

  const areaD = `${pathD} L ${wlToX(1000)} ${svgHeight - paddingY} L ${wlToX(400)} ${svgHeight - paddingY} Z`;

  const hoveredX = wlToX(hoveredWl);
  const hoveredY = rToY(currentReflectance);

  return (
    <section id="spectral-explorer" className="py-16 sm:py-24 relative">
      <div className="lab-surface p-6 sm:p-10 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1B4435]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A241B] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
              <span>01 // LIVE SPECTRAL PROBE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#F4FFF9]">
              Optical Reflectance Signature (400 - 1000 nm)
            </h2>
            <p className="text-xs sm:text-sm text-[#B4C9C0] mt-1.5">
              Hover across the spectrum to inspect optical absorption variations between biological biofilm isolates.
            </p>
          </div>

          {/* Pathogen Selector Pills with Real Micrograph Thumbnails */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {BIOFILM_SPECIES.map((s) => {
              const isSelected = selectedPathogenId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedPathogenId(s.id);
                    setHoveredWl(s.peakWl);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#18C77A] text-[#061A14] font-bold shadow-[0_0_12px_rgba(24,199,122,0.4)] border-[#48F5A3]'
                      : 'bg-[#0A241B] text-[#B4C9C0] border-[#1B4435] hover:border-[#18C77A]/50 hover:text-[#F4FFF9]'
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.short}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{s.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Split: Specimen Card & Interactive SVG Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Specimen Feature Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0D2B20] border border-[#1B4435] space-y-4 shadow-lg">
            <div className="relative h-36 w-full rounded-xl overflow-hidden border border-[#48F5A3]/40 bg-[#061A14]">
              <img
                src={activeBiofilm.image}
                alt={activeBiofilm.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061A14] via-transparent to-transparent opacity-70" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#061A14]/85 text-[10px] font-mono text-[#48F5A3] border border-[#18C77A]/40 font-bold">
                {activeBiofilm.gram}
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-[#F4FFF9]">
                <span className="font-bold truncate">{activeBiofilm.short}</span>
                <span className="text-[#9BEFCE]">λ {activeBiofilm.peakWl} nm</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-[#829A90] text-[10px]">DIAGNOSTIC ABSORBANCE BAND:</div>
              <div className="text-[#48F5A3] font-bold text-xs">
                {activeBiofilm.pigment}
              </div>
              <p className="text-[11px] text-[#B4C9C0] leading-relaxed line-clamp-3">
                {activeBiofilm.spectralProfile}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1B4435] flex items-center justify-between text-xs font-mono">
              <span className="text-[#829A90]">Peak Resonance:</span>
              <span className="text-[#48F5A3] font-bold">{activeBiofilm.peak}</span>
            </div>
          </div>

          {/* Right: Interactive SVG Spectrum Graph */}
          <div className="lg:col-span-8 bg-[#061A14] p-4 sm:p-6 rounded-2xl border border-[#1B4435] relative">
            <div className="flex items-center justify-between text-xs font-mono mb-3 text-[#829A90]">
              <span>400 nm (Near-UV / Blue)</span>
              <div className="flex items-center gap-2 bg-[#0D2B20] px-3 py-1 rounded-lg border border-[#1B4435] text-[#F4FFF9]">
                <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-pulse"></span>
                <span>λ: <strong className="text-[#48F5A3]">{hoveredWl} nm</strong></span>
                <span>• R: <strong className="text-[#9BEFCE]">{(currentReflectance * 100).toFixed(1)}%</strong></span>
              </div>
              <span>1000 nm (Near-Infrared)</span>
            </div>

            {/* SVG Graph Canvas */}
            <div className="relative w-full h-[220px] sm:h-[260px] cursor-crosshair">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, (x - (paddingX / svgWidth) * rect.width) / ((graphWidth / svgWidth) * rect.width)));
                  const wl = Math.round(400 + ratio * 600);
                  setHoveredWl(wl);
                }}
              >
                <defs>
                  <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#48F5A3" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#18C77A" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#061A14" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#18C77A" />
                    <stop offset="50%" stopColor="#48F5A3" />
                    <stop offset="100%" stopColor="#9BEFCE" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0.25, 0.5, 0.75, 1.0].map((val) => (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={rToY(val)}
                      x2={svgWidth - paddingX}
                      y2={rToY(val)}
                      stroke="#1B4435"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={rToY(val) + 4}
                      fill="#829A90"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {Math.round(val * 100)}%
                    </text>
                  </g>
                ))}

                {/* Vertical Wavelength Gridlines */}
                {[500, 600, 700, 800, 900].map((wl) => (
                  <line
                    key={wl}
                    x1={wlToX(wl)}
                    y1={paddingY}
                    x2={wlToX(wl)}
                    y2={svgHeight - paddingY}
                    stroke="#1B4435"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Filled Area */}
                <path d={areaD} fill="url(#spectrumGradient)" />

                {/* Main Spectral Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Hover Probe Indicator Line & Dot */}
                <line
                  x1={hoveredX}
                  y1={paddingY}
                  x2={hoveredX}
                  y2={svgHeight - paddingY}
                  stroke="#48F5A3"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                <circle
                  cx={hoveredX}
                  cy={hoveredY}
                  r="6"
                  fill="#48F5A3"
                  stroke="#061A14"
                  strokeWidth="2.5"
                  className="shadow-lg"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
