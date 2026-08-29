import React from 'react';

export default function PredictionResult({ predictionResult, onReset }) {
  if (!predictionResult) return null;

  const { predictedClass, confidence, probabilities, inferenceTime, filename } = predictionResult;

  return (
    <section id="results" className="py-8 animate-fadeIn">
      <div className="sci-surface p-6 sm:p-8 relative overflow-hidden border border-brand-cyan/40">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 signature-gradient"></div>

        {/* Top Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-status-successLight dark:bg-status-successDark"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-status-successLight dark:text-status-successDark">
              Analysis Complete
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-light-textSecondary dark:text-dark-textSecondary font-mono">
            <span>{filename || 'Sample TIFF'}</span>
            {inferenceTime && <span>• {inferenceTime}</span>}
            <button
              onClick={onReset}
              className="px-3 py-1 rounded-lg bg-light-secondary dark:bg-dark-secondary hover:bg-light-elevated dark:hover:bg-dark-highest text-light-textPrimary dark:text-dark-textPrimary transition border border-light-border dark:border-dark-border cursor-pointer font-sans text-xs font-medium"
            >
              Analyze Another Sample
            </button>
          </div>
        </div>

        {/* Main Discovery Banner */}
        <div className="py-8 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
            Predicted Pathogen
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary">
            {predictedClass}
          </h2>

          {typeof confidence === 'number' && (
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-light-textSecondary dark:text-dark-textSecondary">
              <span>Model Confidence:</span>
              <span className="font-bold text-brand-cyan text-sm">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Probability Distribution (Horizontal Bars) if probabilities exist */}
        {probabilities && Object.keys(probabilities).length > 0 && (
          <div className="pt-4 pb-6 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
              Six-Class Posterior Probabilities
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(probabilities).map(([className, prob]) => {
                const isWinner = className === predictedClass;
                const pct = (prob * 100).toFixed(1);

                return (
                  <div
                    key={className}
                    className={`p-3.5 rounded-xl border transition ${
                      isWinner
                        ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan/60 shadow-sm'
                        : 'bg-light-secondary/40 dark:bg-dark-surface border-light-border dark:border-dark-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                      <span className={`font-semibold ${isWinner ? 'text-brand-blue dark:text-brand-electric font-bold' : 'text-light-textPrimary dark:text-dark-textPrimary'}`}>
                        {className}
                      </span>
                      <span className="font-mono text-xs font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                        {pct}%
                      </span>
                    </div>

                    <div className="w-full bg-light-secondary dark:bg-dark-secondary h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isWinner ? 'bg-brand-cyan' : 'bg-light-textMuted/40 dark:bg-dark-textMuted/40'
                        }`}
                        style={{ width: `${Math.max(prob * 100, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scientific Interpretation & Disclaimer */}
        <div className="pt-6 border-t border-light-border dark:border-dark-border space-y-2 text-xs text-light-textSecondary dark:text-dark-textSecondary">
          <div className="font-semibold text-light-textPrimary dark:text-dark-textPrimary">
            AI-Assisted Interpretation
          </div>
          <p className="leading-relaxed">
            The model predicts the uploaded sample as <strong className="text-light-textPrimary dark:text-dark-textPrimary">{predictedClass}</strong> based on the submitted hyperspectral spectral–spatial input tensor.
          </p>
          <p className="text-[11px] text-light-textMuted dark:text-dark-textMuted leading-relaxed">
            Research prototype — this prediction is an experimental decision-support model output and should not be treated as a definitive clinical diagnosis.
          </p>
        </div>
      </div>
    </section>
  );
}
