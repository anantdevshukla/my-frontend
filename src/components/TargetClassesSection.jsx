import React, { useState } from 'react';

export default function TargetClassesSection({ onSelectClass }) {
  const [hoveredClass, setHoveredClass] = useState(null);

  const classes = [
    {
      id: 'ecoli',
      name: 'Escherichia coli',
      short: 'E. coli',
      gram: 'Gram-negative',
      morphology: 'Bacillus rod',
      peak: '520 - 580 nm',
      summary: 'Forms curli fiber & cellulose-rich biofilm structures resistant to penetration.'
    },
    {
      id: 'efaecalis',
      name: 'Enterococcus faecalis',
      short: 'E. faecalis',
      gram: 'Gram-positive',
      morphology: 'Cocci pairs & chains',
      peak: '490 - 540 nm',
      summary: 'Persistent calcified biofilm matrices in root canals and prosthetic devices.'
    },
    {
      id: 'saureus',
      name: 'Staphylococcus aureus',
      short: 'S. aureus',
      gram: 'Gram-positive',
      morphology: 'Cocci clusters',
      peak: '450 - 510 nm',
      summary: 'Staphyloxanthin carotenoid pigments and polysaccharide intercellular adhesin.'
    },
    {
      id: 'kpneumoniae',
      name: 'Klebsiella pneumoniae',
      short: 'K. pneumoniae',
      gram: 'Gram-negative',
      morphology: 'Encapsulated rod',
      peak: '560 - 620 nm',
      summary: 'Hypervirulent capsule polysaccharides with distinct optical reflectance signatures.'
    },
    {
      id: 'paeruginosa',
      name: 'Pseudomonas aeruginosa',
      short: 'P. aeruginosa',
      gram: 'Gram-negative',
      morphology: 'Flagellated rod',
      peak: '690 - 740 nm',
      summary: 'Secretes redox-active pyocyanin and thick alginate extracellular slime.'
    },
    {
      id: 'calbicans',
      name: 'Candida albicans',
      short: 'C. albicans',
      gram: 'Fungal yeast',
      morphology: 'Dimorphic hyphae',
      peak: '600 - 660 nm',
      summary: 'Complex polymicrobial biofilms with extensive fungal hyphal meshworks.'
    }
  ];

  return (
    <section id="taxonomy" className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
          Taxonomic Scope
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary mt-2">
          Six-Class Pathogen Classification
        </h2>
        <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary mt-2">
          The convolutional neural network was evaluated across six clinically significant bacterial and fungal species.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const isHovered = hoveredClass === cls.id;
          return (
            <div
              key={cls.id}
              onMouseEnter={() => setHoveredClass(cls.id)}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => onSelectClass && onSelectClass(cls.name)}
              className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isHovered
                  ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan shadow-md'
                  : 'bg-light-card dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-brand-cyan/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold font-display text-light-textPrimary dark:text-dark-textPrimary">
                    {cls.short}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary">
                    {cls.gram}
                  </span>
                </div>

                <div className="text-xs font-mono text-brand-blue dark:text-brand-electric italic mb-2">
                  {cls.name}
                </div>

                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed mb-4">
                  {cls.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-light-border dark:border-dark-border flex items-center justify-between text-[11px] font-mono">
                <span className="text-light-textMuted dark:text-dark-textMuted">{cls.morphology}</span>
                <span className="text-brand-cyan font-medium">{cls.peak}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
