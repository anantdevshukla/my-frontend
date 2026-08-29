import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Hyperspectral Data',
      desc: 'Acquires continuous spatial and narrow-band optical reflectance data across the biofilm surface.'
    },
    {
      num: '02',
      title: 'Preprocessing + PCA',
      desc: 'Applies automated radiometric calibration and principal component reduction to extract key variance axes.'
    },
    {
      num: '03',
      title: 'CNN Feature Extraction',
      desc: 'Processes the standardized 224 × 224 × 3 tensor to extract deep morphological and spectral patterns.'
    },
    {
      num: '04',
      title: 'Pathogen Classification',
      desc: 'Computes posterior probabilities across the six target pathogen classes with 85.3% reported accuracy.'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
          System Overview
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary mt-2">
          From Spectral Data to AI Prediction
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="p-6 rounded-2xl bg-light-card dark:bg-dark-surface border border-light-border dark:border-dark-border flex flex-col justify-between relative group hover:border-brand-cyan/40 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-brand-blue dark:text-brand-electric">
                  {step.num}
                </span>
                {idx < steps.length - 1 && (
                  <span className="hidden md:inline text-xs font-mono text-light-textMuted dark:text-dark-textMuted">
                    →
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold font-display text-light-textPrimary dark:text-dark-textPrimary mb-2">
                {step.title}
              </h3>

              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
