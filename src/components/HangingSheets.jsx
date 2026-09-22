import React, { useState } from 'react';

export default function HangingSheets() {
  const [activeSheet, setActiveSheet] = useState(0);

  const sheets = [
    {
      id: 0,
      sheetCode: 'SHEET 01',
      title: 'RAW HYPERSPECTRAL DATA',
      tag: 'OPTICAL MATRIX (X × Y × λ)',
      summary: 'High-dimensional spatial-spectral cube capturing continuous contiguous optical reflectance bands across the microbial colony surface.',
      metrics: ['236 Continuous Bands', '400nm - 1000nm UV-NIR', 'Native TIFF Ingestion'],
      svgVisual: (
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="cubeSliceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#18C77A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#061A14" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`translate(${i * 18}, ${i * 10})`}>
              <polygon points="40,20 180,20 160,80 20,80" fill="url(#cubeSliceGrad)" stroke="#48F5A3" strokeWidth="0.8" />
            </g>
          ))}
          <line x1="20" y1="20" x2="110" y2="70" stroke="#48F5A3" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 1,
      sheetCode: 'SHEET 02',
      title: 'PREPROCESSING & CALIBRATION',
      tag: 'R = (I - D) / (W - D)',
      summary: 'Automated dark/white radiometric normalization, sensor noise reduction, and spatial illumination field uniformity calibration.',
      metrics: ['Dark Current Subtraction', 'White Plate Calibration', 'Gaussian Spatial Filter'],
      svgVisual: (
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <rect x="30" y="20" width="100" height="80" rx="8" fill="#0A241B" stroke="#1B4435" />
          <text x="80" y="65" fill="#829A90" fontSize="10" fontFamily="monospace" textAnchor="middle">RAW INPUT</text>
          <line x1="140" y1="60" x2="170" y2="60" stroke="#48F5A3" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="180" y="20" width="100" height="80" rx="8" fill="#0D2B20" stroke="#48F5A3" />
          <text x="230" y="65" fill="#48F5A3" fontSize="10" fontFamily="monospace" textAnchor="middle">CALIBRATED</text>
        </svg>
      )
    },
    {
      id: 2,
      sheetCode: 'SHEET 03',
      title: 'SPECTRAL SIGNATURES',
      tag: 'CHEMICAL ABSORBANCE (nm)',
      summary: 'Narrow-band reflectance curves identifying microbial matrix proteins, curli curli fibers, and redox-active pyocyanin secretions.',
      metrics: ['Dominant Peak Resolution', 'Pigment Band Matching', 'Derivative Absorbance'],
      svgVisual: (
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <path d="M 30 90 Q 90 20 150 40 T 270 95" fill="none" stroke="#48F5A3" strokeWidth="2.5" />
          <circle cx="110" cy="33" r="5" fill="#48F5A3" />
          <line x1="110" y1="33" x2="110" y2="105" stroke="#18C77A" strokeDasharray="2 2" strokeWidth="1" />
          <text x="110" y="115" fill="#48F5A3" fontSize="9" fontFamily="monospace" textAnchor="middle">λ = 540nm Peak</text>
        </svg>
      )
    },
    {
      id: 3,
      sheetCode: 'SHEET 04',
      title: 'PCA FEATURE SPACE',
      tag: 'EIGEN-PROJECTION (PC₁, PC₂, PC₃)',
      summary: 'Covariance eigenvalue decomposition condensing 236 channels into orthogonal principal components, structuring data into a [224, 224, 3] tensor.',
      metrics: ['99%+ Variance Captured', 'Orthogonal Eigenvectors', 'Collinearity Removed'],
      svgVisual: (
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <line x1="150" y1="110" x2="150" y2="15" stroke="#48F5A3" strokeWidth="1.5" />
          <line x1="40" y1="70" x2="260" y2="70" stroke="#18C77A" strokeWidth="1.5" />
          <ellipse cx="150" cy="70" rx="70" ry="35" fill="none" stroke="#9BEFCE" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="130" cy="60" r="3" fill="#48F5A3" />
          <circle cx="160" cy="80" r="3" fill="#48F5A3" />
          <circle cx="180" cy="55" r="3" fill="#9BEFCE" />
          <circle cx="110" cy="75" r="3" fill="#18C77A" />
        </svg>
      )
    },
    {
      id: 4,
      sheetCode: 'SHEET 05',
      title: 'DEEP CNN ANALYSIS',
      tag: 'CONV32 → CONV64 → CONV128 → FC256',
      summary: 'Hierarchical 2D convolutional filter stacks extracting multi-scale spatial textures, edge morphology, and cellular patterns.',
      metrics: ['224 × 224 × 3 Input Shape', '3 Convolutional Blocks', 'Dropout 0.3 Dense Layer'],
      svgVisual: (
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <rect x="30" y="25" width="45" height="70" fill="#0A241B" stroke="#1B4435" />
          <rect x="95" y="35" width="40" height="50" fill="#0D2B20" stroke="#18C77A" />
          <rect x="155" y="45" width="35" height="30" fill="#11382A" stroke="#48F5A3" />
          <circle cx="220" cy="60" r="14" fill="#18C77A" />
          <line x1="75" y1="60" x2="95" y2="60" stroke="#48F5A3" strokeWidth="1" />
          <line x1="135" y1="60" x2="155" y2="60" stroke="#48F5A3" strokeWidth="1" />
          <line x1="190" y1="60" x2="206" y2="60" stroke="#48F5A3" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: 5,
      sheetCode: 'SHEET 06',
      title: 'PATHOGEN PROFILING',
      tag: '6-CLASS SOFTMAX POSTERIOR',
      summary: 'Classification across the 6 clinical bacterial and fungal target pathogens with 85.3% reported validation accuracy and confidence metrics.',
      metrics: ['85.3% Validation Accuracy', '6 Clinically Relevant Classes', 'Automated Decision Support'],
      svgVisual: (
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <rect x="40" y="30" width="180" height="12" rx="4" fill="#0A241B" />
          <rect x="40" y="30" width="160" height="12" rx="4" fill="#48F5A3" />
          <text x="230" y="40" fill="#48F5A3" fontSize="10" fontFamily="monospace" fontWeight="bold">94.2%</text>
          
          <rect x="40" y="55" width="180" height="8" rx="4" fill="#0A241B" />
          <rect x="40" y="55" width="30" height="8" rx="4" fill="#829A90" />
          
          <rect x="40" y="75" width="180" height="8" rx="4" fill="#0A241B" />
          <rect x="40" y="75" width="18" height="8" rx="4" fill="#829A90" />
        </svg>
      )
    }
  ];

  return (
    <section id="hanging-sheets" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#18C77A]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2B20] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
          <span>04 // SIGNATURE FEATURE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-[#F4FFF9]">
          HANGING SCIENTIFIC SHEETS
        </h2>
        <p className="text-sm sm:text-base text-[#B4C9C0] mt-3 leading-relaxed">
          Suspended physical laboratory panels detailing the critical transformation stages. Hover over any sheet to rotate, illuminate, and inspect underlying architectural parameters.
        </p>
      </div>

      {/* Hanging Panels 3D Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
        {sheets.map((sheet, idx) => {
          const isSelected = activeSheet === sheet.id;
          return (
            <div
              key={sheet.sheetCode}
              onClick={() => setActiveSheet(sheet.id)}
              className={`p-6 rounded-2xl bg-[#0D2B20]/90 border backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group relative ${
                isSelected
                  ? 'border-[#48F5A3] shadow-[0_12px_40px_rgba(72,245,163,0.25)] -translate-y-2'
                  : 'border-[#1B4435] hover:border-[#18C77A]/60 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(24,199,122,0.15)]'
              }`}
            >
              {/* Hanging Suspension Cable Visual */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-transparent via-[#18C77A]/40 to-[#48F5A3] pointer-events-none"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#48F5A3] shadow-[0_0_8px_#48F5A3]"></div>

              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="text-xs font-mono font-bold text-[#48F5A3]">
                    {sheet.sheetCode}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A241B] border border-[#1B4435] text-[#829A90]">
                    STAGE 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-[#F4FFF9] tracking-tight mb-1">
                  {sheet.title}
                </h3>
                <div className="text-[11px] font-mono text-[#829A90] mb-4">
                  {sheet.tag}
                </div>

                {/* SVG Visual Stage Asset */}
                <div className="rounded-xl bg-[#0A241B]/80 border border-[#1B4435] p-2 mb-4 flex items-center justify-center overflow-hidden">
                  {sheet.svgVisual}
                </div>

                <p className="text-xs text-[#B4C9C0] leading-relaxed mb-4">
                  {sheet.summary}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="pt-3 border-t border-[#1B4435] space-y-1.5">
                <div className="text-[10px] font-mono text-[#829A90] uppercase font-semibold">
                  Key Specifications:
                </div>
                <div className="space-y-1">
                  {sheet.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="text-[11px] font-mono text-[#F4FFF9] flex items-center gap-1.5">
                      <span className="text-[#48F5A3]">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
