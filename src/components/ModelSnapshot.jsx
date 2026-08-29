import React from 'react';

export default function ModelSnapshot() {
  const layers = [
    { name: 'Input Tensor', dim: '224 × 224 × 3', type: 'Calibrated PCA Volume' },
    { name: 'Conv2D + ReLU', dim: '32 Filters (3×3)', type: 'Spatial Feature Map' },
    { name: 'MaxPooling', dim: '2×2 Pool', type: 'Downsampling' },
    { name: 'Conv2D + ReLU', dim: '64 Filters (3×3)', type: 'Spectral Pattern Map' },
    { name: 'MaxPooling', dim: '2×2 Pool', type: 'Downsampling' },
    { name: 'Conv2D + ReLU', dim: '128 Filters (3×3)', type: 'High-Level Biofilm Embeddings' },
    { name: 'MaxPooling', dim: '2×2 Pool', type: 'Downsampling' },
    { name: 'Dense + Dropout', dim: '256 Units (0.3 Drop)', type: 'Fully Connected Representation' },
    { name: 'Softmax Output', dim: '6 Classes', type: 'Posterior Probability Vector' }
  ];

  return (
    <section id="model" className="py-12 sm:py-16">
      <div className="sci-surface p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
              Model Architecture Snapshot
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary mt-1">
              Convolutional Neural Network Architecture
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
              Training Acc: <span className="font-bold text-light-textPrimary dark:text-dark-textPrimary">97.6%</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
              Validation Acc: <span className="font-bold text-status-successLight dark:text-status-successDark">85.3%</span>
            </div>
          </div>
        </div>

        {/* Clean Architecture Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {layers.map((layer, idx) => (
            <div
              key={layer.name + idx}
              className="p-3.5 rounded-xl bg-light-card dark:bg-dark-surface border border-light-border dark:border-dark-border flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted block mb-1">
                  L{idx + 1}
                </span>
                <h4 className="text-xs font-bold font-display text-light-textPrimary dark:text-dark-textPrimary leading-tight mb-1">
                  {layer.name}
                </h4>
                <div className="text-[11px] font-mono font-semibold text-brand-blue dark:text-brand-electric">
                  {layer.dim}
                </div>
              </div>
              <div className="text-[10px] text-light-textSecondary dark:text-dark-textSecondary mt-2 pt-2 border-t border-light-border/60 dark:border-dark-border/60">
                {layer.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
