import React from 'react';
import Biofilm3DHero from './Biofilm3DHero';

export default function HeroSection({ onNavigateAnalyze, onNavigateWorkflow }) {
  return (
    <section id="overview" className="relative w-full pt-6 sm:pt-14 pb-14 sm:pb-24 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#18C77A]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Text Composition (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-7 text-left z-10">
          {/* Scientific Lab Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D2B20] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] shadow-[0_0_20px_rgba(24,199,122,0.15)]">
            <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-pulse"></span>
            <span className="font-semibold tracking-wider uppercase text-[11px]">
              DIGITAL HYPERSPECTRAL LABORATORY
            </span>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold font-display tracking-tight text-[#F4FFF9] leading-[1.08]">
              AI-DRIVEN <br />
              <span className="emerald-gradient-text">HYPERSPECTRAL</span> <br />
              BIOFILM PROFILING
            </h1>
          </div>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#B4C9C0] max-w-xl leading-relaxed font-normal">
            Uncover hidden microbial signatures through hyperspectral imaging and artificial intelligence. Transform continuous spectral–spatial tensors into accurate pathogen classification without destructive staining.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              onClick={onNavigateAnalyze}
              className="px-8 py-4 rounded-xl font-display font-bold text-sm emerald-gradient-btn flex items-center gap-2.5 cursor-pointer shadow-lg"
            >
              <span>Analyze Sample</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={onNavigateWorkflow}
              className="px-7 py-4 rounded-xl font-display font-semibold text-sm bg-[#0D2B20] hover:bg-[#11382A] border border-[#1B4435] hover:border-[#18C77A]/50 text-[#F4FFF9] transition duration-200 cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>Explore the Science</span>
              <span className="text-[#48F5A3] font-mono">→</span>
            </button>
          </div>

          {/* Technical Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-mono text-[#829A90]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A241B] border border-[#1B4435]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#18C77A]"></span>
              <span>HYPERSPECTRAL IMAGING</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A241B] border border-[#1B4435]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
              <span>DEEP LEARNING</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A241B] border border-[#1B4435]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9BEFCE]"></span>
              <span>PATHOGEN PROFILING</span>
            </div>
          </div>
        </div>

        {/* Right 3D Biological Visualization (5 cols on desktop) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <Biofilm3DHero />
        </div>
      </div>
    </section>
  );
}

