import React, { useState } from 'react';

export default function WorkflowPipeline() {
  const [activeStep, setActiveStep] = useState(1);

  const pipelineSteps = [
    {
      num: '01',
      title: 'Hyperspectral Acquisition',
      sub: 'Multi-Band Imaging',
      tag: 'Raw Data',
      desc: 'Acquires continuous spatial coordinates (X, Y) across 236 narrow wavelength bands (400 - 1000 nm) to capture complete optical absorption profiles without chemical staining.'
    },
    {
      num: '02',
      title: 'Preprocessing & Calibration',
      sub: 'Radiometric Standardization',
      tag: 'Correction',
      desc: 'Automated dark current and white reference normalization via R = (I - D)/(W - D), followed by spatial Gaussian denoising and illumination uniformity correction.'
    },
    {
      num: '03',
      title: 'Spectral Feature Extraction',
      sub: 'Biofilm Fingerprints',
      tag: 'Optical Signatures',
      desc: 'Resolves unique chemical absorption peaks corresponding to pathogen extracellular polymeric substances (EPS), alginate slimes, and carotenoid chromophores.'
    },
    {
      num: '04',
      title: 'PCA Dimension Reduction',
      sub: 'Eigen-Space Projection',
      tag: '224 × 224 × 3',
      desc: 'Principal Component Analysis decomposes 236-band covariance into orthogonal eigenvectors (PC₁, PC₂, PC₃), preserving 99%+ variance while structuring input into standard tensors.'
    },
    {
      num: '05',
      title: 'Deep CNN Inference',
      sub: 'Hierarchical Feature Maps',
      tag: 'Neural Network',
      desc: 'Processes the standardized 3D volume through stacked 2D convolutional filters (Conv32 → Conv64 → Conv128), max pooling, and dense dropout layers (256 units).'
    },
    {
      num: '06',
      title: 'Pathogen Profiling',
      sub: '6-Class Softmax Vector',
      tag: '85.3% Val Acc',
      desc: 'Computes posterior probabilities across the six target microbial species (*E. coli*, *S. aureus*, *P. aeruginosa*, *K. pneumoniae*, *E. faecalis*, *C. albicans*) with diagnostic confidence.'
    }
  ];

  return (
    <section id="workflow" className="py-16 sm:py-24 relative">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2B20] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#18C77A]"></span>
          <span>02 // COMPUTATIONAL PIPELINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-[#F4FFF9]">
          FROM IMAGE TO INTELLIGENCE
        </h2>
        <p className="text-sm sm:text-base text-[#B4C9C0] mt-3 leading-relaxed">
          The end-to-end computational pipeline transforming complex high-dimensional optical reflectance data into verifiable microbiological intelligence.
        </p>
      </div>

      {/* 6-Stage Interactive Grid with Connector Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pipelineSteps.map((step, idx) => {
          const isActive = activeStep === idx + 1;
          return (
            <div
              key={step.num}
              onClick={() => setActiveStep(idx + 1)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                isActive
                  ? 'bg-[#11382A] border-[#48F5A3] shadow-[0_8px_30px_rgba(24,199,122,0.2)]'
                  : 'bg-[#0D2B20] border-[#1B4435] hover:border-[#18C77A]/50 hover:bg-[#0F3225]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#0A241B] text-[#48F5A3] border border-[#1B4435]">
                    STAGE {step.num}
                  </span>
                  <span className="text-[11px] font-mono text-[#829A90] group-hover:text-[#48F5A3] transition">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-[#F4FFF9] mb-1">
                  {step.title}
                </h3>
                <div className="text-xs font-mono text-[#48F5A3] mb-3">
                  // {step.sub}
                </div>

                <p className="text-xs sm:text-sm text-[#B4C9C0] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1B4435] flex items-center justify-between text-xs font-mono text-[#829A90]">
                <span>Pipeline Stage 0{idx + 1}/06</span>
                <span className="text-[#48F5A3] font-bold">
                  {isActive ? '● ACTIVE' : '○ INSPECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
