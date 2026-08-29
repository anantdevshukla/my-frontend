import React from 'react';
import HeroDataCube3D from './HeroDataCube3D';

export default function HeroSection({ isDarkMode, onNavigateAnalyze, onNavigateWorkflow }) {
  return (
    <section className="relative w-full pt-6 sm:pt-12 pb-12 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Text Composition (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border text-xs font-mono text-brand-blue dark:text-brand-electric">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan"></span>
            <span className="font-semibold tracking-wider uppercase text-[11px]">AI + HSI Research Platform</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary leading-[1.1]">
            AI-Driven <br />
            <span className="signature-gradient-text">Hyperspectral</span> <br />
            Biofilm Profiling
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-light-textSecondary dark:text-dark-textSecondary max-w-xl leading-relaxed font-normal">
            AI-assisted spectral–spatial analysis for classification of pathogens in mixed biofilm environments.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateAnalyze}
              className="px-7 py-3.5 rounded-xl font-display font-bold text-sm text-white signature-gradient shadow-md hover:opacity-95 active:scale-[0.99] transition cursor-pointer flex items-center gap-2"
            >
              <span>Analyze Sample</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={onNavigateWorkflow}
              className="px-6 py-3.5 rounded-xl font-display font-semibold text-sm bg-light-card dark:bg-dark-surface hover:bg-light-secondary dark:hover:bg-dark-elevated border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary transition cursor-pointer"
            >
              Explore Workflow
            </button>
          </div>

          {/* Subtle Metadata Chips */}
          <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-mono text-light-textSecondary dark:text-dark-textSecondary">
            <span className="px-3 py-1 rounded-md bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
              Research Prototype
            </span>
            <span className="px-3 py-1 rounded-md bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border">
              6 Target Classes
            </span>
            <span className="px-3 py-1 rounded-md bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border text-status-successLight dark:text-status-successDark font-semibold">
              85.3% Reported Val Acc
            </span>
          </div>
        </div>

        {/* Right 3D Hyperspectral Data Cube Visual (5 cols on desktop) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Faint ambient glow behind cube */}
          <div className="absolute inset-0 bg-brand-cyan/5 dark:bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
          <HeroDataCube3D isDarkMode={isDarkMode} />
        </div>
      </div>
    </section>
  );
}
