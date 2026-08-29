import React from 'react';

export default function Navbar({ isDarkMode, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0B1726]/95 border-b border-[#D8E3EA] dark:border-[#233B50] px-4 sm:px-8 py-3 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#1261A0] dark:bg-[#35B9E9] flex items-center justify-center text-white dark:text-[#07111F] font-bold shadow-sm shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-display tracking-tight text-[#102A43] dark:text-[#F4F8FC]">
                BIOFILM <span className="signature-gradient-text">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#EDF3F7] dark:bg-[#13283C] text-[#1261A0] dark:text-[#35B9E9] border border-[#D8E3EA] dark:border-[#233B50]">
                Research Prototype
              </span>
            </div>
            <p className="text-[11px] text-[#506579] dark:text-[#A9B9C9] font-normal tracking-tight hidden sm:block">
              AI-Driven Hyperspectral Biofilm Profiling
            </p>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#506579] dark:text-[#A9B9C9]">
            <a href="#how-it-works" className="hover:text-[#102A43] dark:hover:text-[#F4F8FC] transition">
              Overview
            </a>
            <a href="#workflow" className="hover:text-[#102A43] dark:hover:text-[#F4F8FC] transition">
              Workflow
            </a>
            <a href="#taxonomy" className="hover:text-[#102A43] dark:hover:text-[#F4F8FC] transition">
              Taxonomy
            </a>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="px-3 py-1.5 rounded-lg bg-[#EDF3F7] dark:bg-[#13283C] border border-[#D8E3EA] dark:border-[#233B50] text-[#102A43] dark:text-[#F4F8FC] hover:border-[#18C7D1] transition text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#35B9E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-[#F4F8FC]">Light</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-[#1261A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="text-[#102A43]">Dark</span>
              </>
            )}
          </button>

          {/* Primary CTA button */}
          <a
            href="#analyze-workspace"
            className="px-3.5 py-1.5 rounded-lg text-xs font-display font-bold text-white signature-gradient shadow-sm hover:opacity-95 transition cursor-pointer"
          >
            Analyze Sample
          </a>
        </div>
      </div>
    </header>
  );
}
