import React, { useState } from 'react';
import { BIOFILM_SPECIES } from '../utils/biofilmAssets';

export default function TargetClassesSection({ onSelectClass }) {
  const [hoveredClass, setHoveredClass] = useState(null);

  return (
    <section id="taxonomy" className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#48F5A3]">
          Taxonomic Scope
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#F4FFF9] mt-2">
          Six-Class Pathogen Classification
        </h2>
        <p className="text-xs sm:text-sm text-[#B4C9C0] mt-2">
          The convolutional neural network was evaluated across six clinically significant bacterial and fungal species.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BIOFILM_SPECIES.map((cls) => {
          const isHovered = hoveredClass === cls.id;
          return (
            <div
              key={cls.id}
              onMouseEnter={() => setHoveredClass(cls.id)}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => onSelectClass && onSelectClass(cls.name)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isHovered
                  ? 'bg-[#11382A] border-[#48F5A3] shadow-lg shadow-[#18C77A]/15'
                  : 'bg-[#0D2B20] border-[#1B4435] hover:border-[#18C77A]/50'
              }`}
            >
              <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3.5 bg-[#061A14] border border-[#1B4435]">
                <img
                  src={cls.image}
                  alt={cls.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B20] via-transparent to-transparent opacity-70" />
                <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#061A14]/85 border border-[#18C77A]/40 text-[#48F5A3]">
                  {cls.gram}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-bold font-display text-[#F4FFF9]">
                    {cls.short}
                  </span>
                  <span className="text-[10px] font-mono text-[#829A90]">
                    {cls.peak}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#48F5A3] italic mb-2">
                  {cls.name}
                </div>

                <p className="text-xs text-[#B4C9C0] leading-relaxed mb-3 line-clamp-2">
                  {cls.desc}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#1B4435] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#829A90]">{cls.morphology.split(' ')[0]}</span>
                <span className="text-[#48F5A3] font-semibold">Select Class →</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
