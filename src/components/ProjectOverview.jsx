import React from 'react';

export default function ProjectOverview() {
  return (
    <div className="scientific-card p-6 sm:p-8 relative">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
            Scientific Foundation
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-display text-light-textPrimary dark:text-dark-textPrimary tracking-tight mb-4">
          Hyperspectral Imaging & AI Biofilm Profiling
        </h2>

        {/* Highlight Quote */}
        <div className="p-4 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary text-sm sm:text-base leading-relaxed mb-6 font-medium">
          "Hyperspectral imaging captures spatial and spectral information, which is combined with AI to identify pathogen patterns in mixed biofilm environments."
        </div>

        {/* 3 Scientific Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border space-y-2">
            <div className="h-7 w-7 rounded-md bg-brand-blue/10 dark:bg-brand-electric/15 text-brand-blue dark:text-brand-electric flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-light-textPrimary dark:text-dark-textPrimary font-mono uppercase tracking-wider">
              Spatial-Spectral Fusion
            </h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
              Measures continuous optical reflectance across contiguous narrow wavelength bands for every pixel, resolving chemical absorption signatures invisible to conventional sensors.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border space-y-2">
            <div className="h-7 w-7 rounded-md bg-brand-cyan/10 dark:bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-light-textPrimary dark:text-dark-textPrimary font-mono uppercase tracking-wider">
              Biofilm Fingerprinting
            </h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
              Pathogen extracellular polymeric substances (EPS), matrix proteins, and chromophores generate unique non-destructive optical absorption profiles.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border space-y-2">
            <div className="h-7 w-7 rounded-md bg-brand-violet/10 dark:bg-brand-violet/15 text-brand-violet dark:text-brand-darkViolet flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-light-textPrimary dark:text-dark-textPrimary font-mono uppercase tracking-wider">
              Automated AI Pipeline
            </h3>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
              Raw multi-band TIFF files are calibrated, PCA-compressed, and evaluated through a deep CNN achieving 85.3% reported validation accuracy without manual preprocessing.
            </p>
          </div>
        </div>

        {/* Scientific Comparison Table */}
        <div className="overflow-x-auto rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-light-secondary dark:bg-dark-secondary text-light-textSecondary dark:text-dark-textSecondary border-b border-light-border dark:border-dark-border uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Modality Parameter</th>
                <th className="py-2.5 px-4">Standard RGB Microscopy</th>
                <th className="py-2.5 px-4 text-brand-blue dark:text-brand-electric font-bold">SPECTRAL AI Hyperspectral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-dark-border text-light-textSecondary dark:text-dark-textSecondary">
              <tr>
                <td className="py-2.5 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Spectral Channels</td>
                <td className="py-2.5 px-4 text-light-textMuted dark:text-dark-textMuted">3 Discrete Bands (RGB)</td>
                <td className="py-2.5 px-4 text-brand-blue dark:text-brand-electric font-semibold">Continuous Multi-Band (λ₁ ... λₙ)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Sample Preparation</td>
                <td className="py-2.5 px-4 text-light-textMuted dark:text-dark-textMuted">Destructive chemical Gram-staining</td>
                <td className="py-2.5 px-4 text-status-successLight dark:text-status-successDark font-semibold">Non-Destructive & Label-Free</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Matrix Characterization</td>
                <td className="py-2.5 px-4 text-light-textMuted dark:text-dark-textMuted">Superficial morphological visual inspection</td>
                <td className="py-2.5 px-4 text-brand-cyan font-semibold">Deep Polymeric Matrix Absorbance</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-light-textPrimary dark:text-dark-textPrimary">Classification Benchmark</td>
                <td className="py-2.5 px-4 text-light-textMuted dark:text-dark-textMuted">Subjective operator dependent</td>
                <td className="py-2.5 px-4 text-status-successLight dark:text-status-successDark font-bold">85.3% Deep Neural Network Accuracy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
