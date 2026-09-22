import React, { useState } from 'react';
import { BIOFILM_SPECIES } from '../utils/biofilmAssets';

export default function PathogenAtlas({ onSelectClass }) {
  const [selectedModalPathogen, setSelectedModalPathogen] = useState(null);

  const handleInspect = (pathogen) => {
    setSelectedModalPathogen(pathogen);
  };

  const handleDirectAnalyze = (pathogen) => {
    setSelectedModalPathogen(null);
    if (onSelectClass) {
      onSelectClass(pathogen.name);
    }
  };

  return (
    <section id="pathogen-atlas" className="py-16 sm:py-24 relative">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2B20] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#18C77A]"></span>
          <span>05 // TAXONOMIC SCOPE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-[#F4FFF9]">
          PATHOGEN ATLAS
        </h2>
        <p className="text-sm sm:text-base text-[#B4C9C0] mt-3 leading-relaxed">
          The convolutional neural network was rigorously trained and evaluated across six clinically significant bacterial and fungal species. Click any organism to inspect its diagnostic profile and microscopy imagery.
        </p>
      </div>

      {/* 6 Pathogen Atlas Cards with Rich Biofilm Specimen Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BIOFILM_SPECIES.map((p) => (
          <div
            key={p.id}
            onClick={() => handleInspect(p)}
            className="group p-5 rounded-2xl bg-[#0D2B20] border border-[#1B4435] hover:border-[#48F5A3]/70 hover:bg-[#11382A] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            {/* Top Specimen Image Preview with Holographic Scanning Effect */}
            <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-[#061A14] border border-[#1B4435]">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 filter contrast-105"
              />
              {/* Scanline & Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B20] via-transparent to-transparent opacity-80 pointer-events-none" />
              
              {/* Optical Scanning Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(72,245,163,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(72,245,163,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Status Badges Overlay */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.8 rounded-lg bg-[#061A14]/85 backdrop-blur-md border border-[#18C77A]/50 text-[#48F5A3] font-bold">
                  {p.gram}
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5">
                <span className="text-[10px] font-mono px-2 py-0.8 rounded-lg bg-[#061A14]/85 backdrop-blur-md border border-[#1B4435] text-[#9BEFCE]">
                  λ {p.peakWl} nm
                </span>
              </div>

              {/* Bottom Quick Indicator */}
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-[#F4FFF9] bg-[#061A14]/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#1B4435]/60">
                <span className="text-[#829A90] truncate">{p.pigment}</span>
                <span className="text-[#48F5A3] font-semibold flex-shrink-0">🔍 Inspect</span>
              </div>
            </div>

            {/* Pathogen Identification & Taxonomy */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl font-bold font-display text-[#F4FFF9] group-hover:text-[#48F5A3] transition">
                  {p.short}
                </span>
                <span className="text-[10px] font-mono text-[#829A90]">
                  {p.morphology.split(' ')[0]}
                </span>
              </div>

              <div className="text-xs font-mono text-[#48F5A3] italic mb-2.5">
                {p.name}
              </div>

              <p className="text-xs text-[#B4C9C0] leading-relaxed mb-4 line-clamp-2">
                {p.desc}
              </p>
            </div>

            {/* Specimen Metrics Footer */}
            <div className="pt-3 border-t border-[#1B4435] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#829A90]">Absorption Band:</span>
                <span className="text-[#9BEFCE] font-bold">{p.peak}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#829A90]">Model Precision:</span>
                <span className="text-[#48F5A3] font-bold">{p.modelAccuracy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Modal Inspector with High-Res Biofilm View & Spectral Curve */}
      {selectedModalPathogen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D2B20] border border-[#48F5A3]/50 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-fadeIn space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1B4435] pb-4">
              <div>
                <span className="text-xs font-mono text-[#48F5A3] font-bold uppercase tracking-wider">
                  SPECIMEN DIAGNOSTIC PROFILE
                </span>
                <h3 className="text-2xl font-bold font-display text-[#F4FFF9]">
                  {selectedModalPathogen.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModalPathogen(null)}
                className="h-8 w-8 rounded-lg bg-[#0A241B] border border-[#1B4435] text-[#B4C9C0] hover:text-[#F4FFF9] hover:bg-[#11382A] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* High-Res Biofilm Specimen Microscope View */}
            <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden border-2 border-[#18C77A]/40 bg-[#061A14]">
              <img
                src={selectedModalPathogen.image}
                alt={selectedModalPathogen.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061A14] via-transparent to-transparent opacity-60" />

              {/* Reticle / Lens Crosshair Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-32 h-32 rounded-full border border-[#48F5A3] flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-dashed border-[#9BEFCE]" />
                </div>
              </div>

              {/* Image Label Overlay */}
              <div className="absolute bottom-3 left-3 bg-[#061A14]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1B4435] text-xs font-mono text-[#F4FFF9]">
                <span>Hyperspectral Micrograph: </span>
                <strong className="text-[#48F5A3]">{selectedModalPathogen.short}</strong>
              </div>
            </div>

            {/* Diagnostic Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
                <div className="text-[#829A90] text-[10px]">GRAM CLASSIFICATION:</div>
                <div className="text-[#F4FFF9] font-bold">{selectedModalPathogen.gram}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
                <div className="text-[#829A90] text-[10px]">CELLULAR MORPHOLOGY:</div>
                <div className="text-[#F4FFF9] font-bold">{selectedModalPathogen.morphology}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
                <div className="text-[#829A90] text-[10px]">EPS MATRIX PIGMENT:</div>
                <div className="text-[#9BEFCE] font-bold">{selectedModalPathogen.pigment}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-1">
                <div className="text-[#829A90] text-[10px]">CLINICAL SIGNIFICANCE:</div>
                <div className="text-[#48F5A3] font-bold">{selectedModalPathogen.clinicalRisk}</div>
              </div>
            </div>

            {/* Biofilm Matrix Pathology Description */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-[#F4FFF9] font-display text-sm">
                Extracellular Matrix & Pathogenesis
              </div>
              <p className="text-[#B4C9C0] leading-relaxed">
                {selectedModalPathogen.desc}
              </p>
              <div className="p-3 rounded-xl bg-[#0A241B]/90 border border-[#1B4435] text-[11px] text-[#9BEFCE] leading-relaxed">
                <strong>Hyperspectral Optical Signature:</strong> {selectedModalPathogen.spectralProfile}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-[#1B4435] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#829A90]">
                Model Validation: <strong className="text-[#48F5A3]">{selectedModalPathogen.modelAccuracy}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedModalPathogen(null)}
                  className="px-4 py-2 rounded-xl bg-[#0A241B] text-xs font-mono text-[#B4C9C0] hover:text-[#F4FFF9] border border-[#1B4435] cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDirectAnalyze(selectedModalPathogen)}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold emerald-gradient-btn cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span>Test in Analyzer</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
