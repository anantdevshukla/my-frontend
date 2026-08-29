import React from 'react';

export default function WhyHyperspectral() {
  return (
    <section className="py-12 sm:py-16">
      <div className="sci-surface p-6 sm:p-8">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
            Scientific Rationale
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary mt-1">
            Why Hyperspectral Imaging for Biofilms
          </h2>
          <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary mt-2 leading-relaxed">
            Hyperspectral imaging captures contiguous narrow-band optical reflectance signatures across space, enabling non-destructive identification of chemical and microbial constituents within complex extracellular matrices.
          </p>
        </div>

        {/* Clean Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-light-secondary dark:bg-dark-secondary text-light-textSecondary dark:text-dark-textSecondary border-b border-light-border dark:border-dark-border uppercase text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Parameter</th>
                <th className="py-3 px-4">Standard RGB Microscopy</th>
                <th className="py-3 px-4 text-brand-blue dark:text-brand-electric font-bold">Biofilm AI Hyperspectral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-dark-border text-light-textSecondary dark:text-dark-textSecondary font-normal">
              <tr>
                <td className="py-3 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Spectral Resolution</td>
                <td className="py-3 px-4 text-light-textMuted dark:text-dark-textMuted">3 Wide Broadband Channels (Red, Green, Blue)</td>
                <td className="py-3 px-4 text-brand-blue dark:text-brand-electric font-semibold font-mono">236 Contiguous Narrow Bands (λ₁ ... λₙ)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Sample Preparation</td>
                <td className="py-3 px-4 text-light-textMuted dark:text-dark-textMuted">Chemical staining (Gram / fluorophore dye)</td>
                <td className="py-3 px-4 text-status-successLight dark:text-status-successDark font-semibold">Label-Free & Non-Destructive</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Matrix Characterization</td>
                <td className="py-3 px-4 text-light-textMuted dark:text-dark-textMuted">Superficial optical morphological inspection</td>
                <td className="py-3 px-4 text-brand-cyan font-semibold">Extracellular Polymeric Matrix Absorbance</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Evaluation Metric</td>
                <td className="py-3 px-4 text-light-textMuted dark:text-dark-textMuted">Subjective operator-dependent evaluation</td>
                <td className="py-3 px-4 text-status-successLight dark:text-status-successDark font-bold font-mono">85.3% Validation Accuracy (CNN)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
