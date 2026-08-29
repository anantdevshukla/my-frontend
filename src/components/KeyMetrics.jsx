import React from 'react';

export default function KeyMetrics() {
  const metrics = [
    { value: '370', label: 'Hyperspectral Images', desc: 'Curated biofilm dataset' },
    { value: '236', label: 'Spectral Bands', desc: 'Continuous narrow-band channels' },
    { value: '6', label: 'Target Classes', desc: 'Bacterial & fungal pathogens' },
    { value: '85.3%', label: 'Reported Validation Accuracy', desc: 'Standardized CNN evaluation' }
  ];

  return (
    <section className="py-8">
      <div className="sci-surface p-6 sm:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-light-border dark:divide-dark-border">
          {metrics.map((m, idx) => (
            <div key={m.label} className={`space-y-1 ${idx > 0 ? 'pt-4 lg:pt-0 lg:pl-8' : ''}`}>
              <div className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary">
                {m.value}
              </div>
              <div className="text-xs font-semibold text-brand-blue dark:text-brand-electric">
                {m.label}
              </div>
              <div className="text-[11px] text-light-textMuted dark:text-dark-textMuted">
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
