import React, { useState, useEffect } from 'react';

export default function Navbar({ onNavigateAnalyze }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Spectral Live', href: '#spectral-graph' },
    { label: '3D Pipeline', href: '#pipeline-3d' },
    { label: 'Pathogen Atlas', href: '#pathogen-atlas' },
    { label: 'AI Analyzer', href: '#analyze-workspace' },
    { label: 'Performance', href: '#performance-lab' },
    { label: 'Research', href: '#research' }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-8 py-3.5 ${
        isScrolled
          ? 'bg-[#061A14]/85 backdrop-blur-xl border-b border-[#1B4435] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Identity */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-[#0D2B20] border border-[#18C77A]/40 group-hover:border-[#48F5A3] flex items-center justify-center text-[#48F5A3] font-bold shadow-[0_0_15px_rgba(24,199,122,0.2)] transition-all duration-300 shrink-0">
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-display tracking-tight text-[#F4FFF9]">
                BIOFILM <span className="text-[#48F5A3]">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#11382A] text-[#48F5A3] border border-[#1B4435] uppercase tracking-wider">
                Digital Lab
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#829A90] tracking-tight hidden sm:block">
              HSI × AI × MICROBIAL PROFILING
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-[#B4C9C0]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#48F5A3] transition-colors py-1 hover:drop-shadow-[0_0_8px_rgba(72,245,163,0.4)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA / Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#analyze-workspace"
            onClick={(e) => {
              if (onNavigateAnalyze) {
                e.preventDefault();
                onNavigateAnalyze();
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-display font-bold emerald-gradient-btn flex items-center gap-1.5 cursor-pointer"
          >
            <span>Analyze Sample</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#0D2B20] border border-[#1B4435] text-[#B4C9C0] hover:text-[#48F5A3] transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 p-4 rounded-2xl bg-[#0A241B]/95 border border-[#1B4435] backdrop-blur-2xl shadow-2xl animate-fadeIn space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#0D2B20] text-[#B4C9C0] hover:text-[#48F5A3] hover:bg-[#11382A] border border-[#1B4435]/60 transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

