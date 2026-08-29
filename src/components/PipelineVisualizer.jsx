import React, { useState } from 'react';

export default function PipelineVisualizer({ currentStep, isAnalyzing }) {
  const [selectedStep, setSelectedStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: 'Hyperspectral Data',
      badge: 'TIFF (.tif/.tiff)',
      category: 'Data Acquisition',
      accentColor: 'text-brand-blue dark:text-brand-electric',
      summary: 'Continuous Multi-Band Imaging',
      description:
        'Continuous spectral bands (λ₁...λₙ) capturing complete spatial coordinates and narrow-band optical reflectance across the biofilm surface.',
      details: [
        'Native hyperspectral TIFF ingestion',
        'Spatial matrix (X, Y) with N contiguous wavelength channels',
        'Non-destructive optical chemical absorption profiling'
      ]
    },
    {
      id: 2,
      title: 'Preprocessing',
      badge: 'Auto Calibrated',
      category: 'Signal Conditioning',
      accentColor: 'text-brand-blue dark:text-brand-electric',
      summary: 'Radiometric Calibration',
      description:
        'Automated dark and white reference normalization, sensor noise reduction, and spatial Gaussian filtering.',
      details: [
        'Automated dark/white reference standardization: R = (I - D) / (W - D)',
        'Sensor noise reduction and illumination correction',
        'Zero manual pre-formatting required by the operator'
      ]
    },
    {
      id: 3,
      title: 'PCA',
      badge: 'Dimension Reduction',
      category: 'Hyperspectral Processing',
      accentColor: 'text-brand-cyan dark:text-brand-darkCyan',
      summary: 'Principal Components',
      description:
        'Principal Component Analysis extracts the most dominant variance axes across spectral bands while eliminating collinearity.',
      details: [
        'Eigenvalue decomposition of spectral covariance matrix',
        'Condenses high-dimensional spectral channels into 3 principal eigen-layers',
        'Standardizes spatial-spectral shape to 224 × 224 × 3'
      ]
    },
    {
      id: 4,
      title: 'CNN',
      badge: 'Deep Architecture',
      category: 'AI Feature Extraction',
      accentColor: 'text-brand-violet dark:text-brand-darkViolet',
      summary: '224 × 224 × 3 Tensor',
      description:
        'Deep Convolutional Neural Network extracts microscopic biofilm morphological textures and cellular spectral patterns.',
      details: [
        'Standardized tensor input: [224, 224, 3]',
        'Hierarchical convolutional filters and residual feature mapping',
        'Trained on validated multi-pathogen biofilm hyperspectral datasets'
      ]
    },
    {
      id: 5,
      title: 'Classification',
      badge: '6 Target Classes',
      category: 'Microbial Profiling',
      accentColor: 'text-brand-violet dark:text-brand-darkViolet',
      summary: 'Pathogen Probabilities',
      description:
        'Softmax output layer computes posterior class probabilities, identifying the dominant pathogen with 85.3% reported validation accuracy.',
      details: [
        'Calculates posterior probabilities across 6 target microbial species',
        'Reported validation accuracy: 85.3%',
        'Comprehensive diagnostic confidence scoring'
      ]
    }
  ];

  return (
    <div className="scientific-card p-6 sm:p-7 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
              AI Processing Pipeline
            </span>
            <span className="text-xs text-light-textMuted dark:text-dark-textMuted font-mono">
              (5-Stage Architecture)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary">
            Hyperspectral Data → Classification Workflow
          </h2>
        </div>

        {/* Informative Guidance Callout */}
        <div className="bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border rounded-lg px-4 py-2.5 text-xs text-light-textSecondary dark:text-dark-textSecondary flex items-start gap-2.5 max-w-md">
          <svg className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="text-light-textPrimary dark:text-dark-textPrimary block font-medium">
              Automated Tensor Conversion
            </strong>
            <span>
              The AI pipeline automatically calibrates and formats raw TIFF data into the required 224 × 224 × 3 tensor. Manual preprocessing is not required.
            </span>
          </div>
        </div>
      </div>

      {/* Steps Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id || (isAnalyzing && currentStep >= step.id);
          const isSelected = selectedStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setSelectedStep(isSelected ? null : step.id)}
              className={`cursor-pointer rounded-lg p-4 transition-all duration-200 relative border flex flex-col justify-between ${
                isActive
                  ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan shadow-sm ring-1 ring-brand-cyan/40'
                  : isSelected
                  ? 'bg-light-secondary dark:bg-dark-secondary border-brand-blue dark:border-brand-electric'
                  : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border hover:border-brand-blue/40 dark:hover:border-brand-electric/40'
              }`}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-light-textMuted dark:text-dark-textMuted font-mono text-xs pointer-events-none">
                  →
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`h-6 w-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                      isActive
                        ? 'bg-brand-blue text-white dark:bg-brand-electric dark:text-dark-bg'
                        : 'bg-light-secondary dark:bg-dark-secondary text-light-textSecondary dark:text-dark-textSecondary border border-light-border dark:border-dark-border'
                    }`}
                  >
                    0{step.id}
                  </span>
                  <span className="text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted">
                    STAGE {step.id}
                  </span>
                </div>

                <div className={`text-[10px] font-mono font-semibold uppercase tracking-wider mb-1 ${step.accentColor}`}>
                  {step.badge}
                </div>
                <h3 className="text-sm font-bold text-light-textPrimary dark:text-dark-textPrimary mb-1 font-display">
                  {step.title}
                </h3>
                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary line-clamp-2 leading-relaxed">
                  {step.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-light-textMuted dark:text-dark-textMuted">
                  {isSelected ? 'Collapse' : 'Inspect'}
                </span>
                <span className="text-brand-blue dark:text-brand-electric">
                  {isSelected ? '▲' : '▼'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Technical Inspector */}
      {selectedStep && (
        <div className="mt-4 p-4 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border animate-fadeIn">
          {(() => {
            const step = steps.find((s) => s.id === selectedStep);
            if (!step) return null;
            return (
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start text-xs">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-cyan"></span>
                    <h4 className="font-bold font-mono text-light-textPrimary dark:text-dark-textPrimary">
                      Stage 0{step.id}: {step.title} ({step.category})
                    </h4>
                  </div>
                  <p className="text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="bg-light-card dark:bg-dark-card p-3 rounded border border-light-border dark:border-dark-border flex-1 min-w-[260px]">
                  <span className="text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted font-semibold block mb-1.5 uppercase">
                    Stage Specifications
                  </span>
                  <ul className="space-y-1 text-[11px] text-light-textSecondary dark:text-dark-textSecondary">
                    {step.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-brand-cyan mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
