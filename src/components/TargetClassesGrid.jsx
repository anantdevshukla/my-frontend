import React from 'react';
import { PATHOGEN_INFO } from './ResultsSection';

export default function TargetClassesGrid({ onSelectClass, activeClass }) {
  const classesList = Object.entries(PATHOGEN_INFO);

  return (
    <div className="scientific-card p-6 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
              Taxonomic Database
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-light-secondary dark:bg-dark-secondary text-brand-violet dark:text-brand-darkViolet border border-light-border dark:border-dark-border">
              6 Target Classes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-light-textPrimary dark:text-dark-textPrimary mt-1">
            Pathogen Taxonomic Scope
          </h2>
        </div>

        <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-mono bg-light-secondary dark:bg-dark-secondary px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border">
          Validation Accuracy: <span className="text-status-successLight dark:text-status-successDark font-bold">85.3%</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classesList.map(([fullName, info]) => {
          const isSelected = activeClass === fullName;

          return (
            <div
              key={fullName}
              onClick={() => onSelectClass && onSelectClass(fullName)}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan ring-1 ring-brand-cyan/50 shadow-sm'
                  : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border hover:border-brand-cyan/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-base font-bold font-display text-light-textPrimary dark:text-dark-textPrimary">
                    {info.shortName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-light-secondary dark:bg-dark-secondary text-light-textSecondary dark:text-dark-textSecondary border border-light-border dark:border-dark-border">
                    {info.gram}
                  </span>
                </div>

                <div className="text-xs font-mono text-brand-blue dark:text-brand-electric italic mb-2">
                  {fullName}
                </div>

                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed mb-3">
                  {info.description}
                </p>
              </div>

              <div className="pt-3 border-t border-light-border dark:border-dark-border space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-light-textSecondary dark:text-dark-textSecondary">
                  <span>Morphology:</span>
                  <span className="text-light-textPrimary dark:text-dark-textPrimary font-medium">{info.morphology}</span>
                </div>
                <div className="flex justify-between text-light-textSecondary dark:text-dark-textSecondary">
                  <span>Spectral Peak:</span>
                  <span className="text-brand-cyan font-medium">{info.pigmentPeak}</span>
                </div>
                <div className="flex justify-between text-light-textSecondary dark:text-dark-textSecondary">
                  <span>Biofilm Impact:</span>
                  <span className="text-brand-violet dark:text-brand-darkViolet text-[10px] truncate max-w-[130px]">
                    {info.biofilmRisk}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
