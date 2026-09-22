import React from 'react';

export default function WhyHyperspectral() {
  return (
    <section id="why-hyperspectral" className="py-16 sm:py-24 relative">
      <div className="lab-surface p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A241B] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
            <span>09 // SCIENTIFIC RATIONALE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#F4FFF9]">
            WHY HYPERSPECTRAL AI FOR BIOFILMS?
          </h2>
          <p className="text-xs sm:text-sm text-[#B4C9C0] mt-2 leading-relaxed">
            Hyperspectral imaging captures contiguous narrow-band optical reflectance signatures across spatial dimensions, enabling non-destructive identification of chemical and microbial constituents within complex extracellular matrices.
          </p>
        </div>

        {/* Clean Laboratory Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#1B4435] bg-[#0A241B]/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D2B20] text-[#B4C9C0] border-b border-[#1B4435] uppercase text-[10px] font-mono">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Modality Parameter</th>
                <th className="py-3.5 px-5 text-[#829A90]">Standard RGB Microscopy</th>
                <th className="py-3.5 px-5 text-[#48F5A3] font-bold">Biofilm AI Hyperspectral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B4435] text-[#B4C9C0] font-normal">
              <tr>
                <td className="py-3.5 px-5 font-medium text-[#F4FFF9]">Spectral Resolution</td>
                <td className="py-3.5 px-5 text-[#829A90]">3 Wide Broadband Channels (Red, Green, Blue)</td>
                <td className="py-3.5 px-5 text-[#48F5A3] font-semibold font-mono">236 Contiguous Narrow Bands (λ₁ ... λ₂₃₆)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-[#F4FFF9]">Sample Preparation</td>
                <td className="py-3.5 px-5 text-[#829A90]">Destructive chemical staining (Gram / fluorophore dye)</td>
                <td className="py-3.5 px-5 text-[#9BEFCE] font-semibold">Label-Free, In-Situ & Non-Destructive</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-[#F4FFF9]">Matrix Characterization</td>
                <td className="py-3.5 px-5 text-[#829A90]">Superficial optical morphological inspection only</td>
                <td className="py-3.5 px-5 text-[#48F5A3] font-semibold">Extracellular Polymeric Matrix (EPS) Absorbance</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-[#F4FFF9]">Evaluation Accuracy</td>
                <td className="py-3.5 px-5 text-[#829A90]">Subjective operator-dependent evaluation</td>
                <td className="py-3.5 px-5 text-[#48F5A3] font-bold font-mono">85.3% Validation Accuracy (Deep CNN)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

