import React from 'react';

export default function ResearchSection() {
  return (
    <section id="research" className="py-16 sm:py-24 relative">
      <div className="lab-surface p-8 sm:p-12 relative overflow-hidden border border-[#18C77A]/30">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A241B] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
            <span>08 // SCIENTIFIC PUBLICATION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-[#F4FFF9] leading-snug">
            AI-Driven Hyperspectral Morphotoxic Profiling of Opportunistic Pathogens in Mixed Biofilm Contaminations
          </h2>

          <p className="text-xs sm:text-sm text-[#829A90] font-mono">
            Research Showcase • Hyperspectral Machine Learning Laboratory • Continuous Narrow-Band Spectroscopy
          </p>

          {/* Abstract / Scientific Summary */}
          <div className="p-6 rounded-2xl bg-[#0A241B] border border-[#1B4435] text-xs sm:text-sm text-[#B4C9C0] leading-relaxed space-y-3 font-normal">
            <p>
              Mixed microbial biofilms present severe nosocomial and industrial contamination risks. Conventional brightfield microscopy requires destructive staining and lacks biochemical resolution.
            </p>
            <p>
              This study demonstrates a non-invasive pipeline combining 236-channel narrow-band hyperspectral imaging (400 - 1000 nm) with radiometric calibration, principal component dimension reduction, and a deep convolutional neural network. The system classifies six distinct pathogenic isolates with <strong>85.3% reported validation accuracy</strong> directly from optical bio-signatures.
            </p>
          </div>

          {/* Research Highlights & Key Contributions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0D2B20] border border-[#1B4435] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#48F5A3] font-bold">Non-Destructive</span>
              <h4 className="text-xs font-bold text-[#F4FFF9]">Label-Free Profiling</h4>
              <p className="text-[11px] text-[#829A90]">No chemical Gram-staining or fluorophore alteration needed.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D2B20] border border-[#1B4435] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#48F5A3] font-bold">236 Band Spectrum</span>
              <h4 className="text-xs font-bold text-[#F4FFF9]">Biochemical Resolution</h4>
              <p className="text-[11px] text-[#829A90]">Resolves pyocyanin, carotenoid, and amyloid signatures.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D2B20] border border-[#1B4435] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#48F5A3] font-bold">CNN Architecture</span>
              <h4 className="text-xs font-bold text-[#F4FFF9]">Automated Ingestion</h4>
              <p className="text-[11px] text-[#829A90]">Automated calibration and 224×224×3 tensor formatting.</p>
            </div>
          </div>

          {/* CTA & Reference Link */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="https://biofilm-ai.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl text-xs font-display font-bold emerald-gradient-btn flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Explore Research Platform</span>
              <span className="font-mono">→</span>
            </a>
            <span className="text-xs font-mono text-[#829A90]">
              DOI: 10.1016/j.biofilm.2025.04.019 (Reference Protocol)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
