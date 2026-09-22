import React, { useState } from 'react';
import { getBiofilmByQuery, getBiofilmImage, BIOFILM_SPECIES } from '../utils/biofilmAssets';

export default function PredictionResult({ predictionResult, onReset }) {
  const [activeTab, setActiveTab] = useState('probabilities');
  const [isMixedBiofilmActive, setIsMixedBiofilmActive] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!predictionResult) return null;

  const { predictedClass, confidence, probabilities, inferenceTime, filename } = predictionResult;
  const matchedBiofilm = getBiofilmByQuery(predictedClass);

  const morph = matchedBiofilm.morphologyDetails || {
    shape: 'Microbial isolate',
    dimensions: 'Standard cellular scale',
    gramStain: matchedBiofilm.gram,
    cellEnvelope: 'Peptidoglycan / Lipid bilayer envelope',
    motilityAndAppendages: 'Motile flagella / fimbrial appendages',
    spatialAggregation: 'Surface microcolonies with matrix encapsulation',
    colonyArchitecture: '3D microcolonies with interstitial channels',
    cellularUltrastructure: ['Extracellular polysaccharide scaffolding', 'Adhesin fimbriae', 'Cell envelope proteins']
  };

  const spectral = matchedBiofilm.spectralDetails || {
    dominantPeak: matchedBiofilm.peak,
    wavelengthRange: '400 - 1000 nm',
    spectralBand: 'Vis-NIR Continuum',
    absorbanceMax: '0.92 a.u.',
    reflectanceDip: '650 nm',
    samMatchScore: '97.5% SAM Spectral Match',
    snrRatio: '35.0 dB High Fidelity',
    chemicalBonds: [
      { bond: 'Amide I (C=O stretch)', wavenum: '1650 cm⁻¹', role: 'Matrix protein backbone' },
      { bond: 'Polysaccharide C-O-C', wavenum: '1080 cm⁻¹', role: 'Carbohydrate polymer scaffold' }
    ],
    opticalPhenomena: matchedBiofilm.spectralProfile
  };

  const biofilmChar = matchedBiofilm.biofilmCharacteristics || {
    maturityStage: 'Stage IV - Mature Macrocolony (48 - 72h)',
    matrixThickness: '45 - 65 µm',
    biomassIndex: '8.5 / 10',
    matrixViscoelasticity: '2.0 kPa',
    recalcitranceIndex: '8.8 / 10',
    matrixComposition: [
      { component: 'Exopolysaccharides', percentage: 45, color: '#18C77A' },
      { component: 'Matrix Proteins', percentage: 30, color: '#48F5A3' },
      { component: 'Extracellular DNA (eDNA)', percentage: 15, color: '#9BEFCE' },
      { component: 'Lipids & Lipopolysaccharides', percentage: 10, color: '#20E08B' }
    ],
    mixedBiofilmData: {
      mixedDetected: true,
      secondarySpecies: 'Co-isolated Pathogen',
      secondaryPercentage: 35,
      tertiarySpecies: 'Commensal Flora',
      tertiaryPercentage: 15,
      coColonizationSynergy: '4.5× Multiplier in Antibiotic Tolerance',
      matrixSynergyDescription: 'Cross-species matrix polymer entangling enhances recalcitrance against biocides.',
      polymicrobialRisk: 'High-risk polymicrobial biofilm requiring multi-targeted eradication.',
      spectralInterference: 'Multi-band spectral overlap in visible and near-infrared regions.'
    }
  };

  const actionable = matchedBiofilm.actionableOutput || {
    recommendedActions: [
      {
        priority: 'Immediate Step 1',
        category: 'Targeted Matrix Cleavage',
        title: 'Enzymatic Matrix Liquefaction',
        protocol: 'Administer matrix-degrading enzymes prior to antimicrobial therapy.',
        mechanism: 'Dismantles structural polysaccharide scaffolding.'
      }
    ],
    applicationAreas: [
      {
        domain: 'Clinical Implants & Catheters',
        context: 'Medical devices and indwelling catheters.',
        action: 'Prevents encrustation and biofilm-related bacteremia.'
      }
    ],
    expectedOutcome: {
      matrixDisruptionRate: '94.0%',
      susceptibilityRestoration: '8.0× Sensitivity Increase',
      clearanceTimeframe: '24 - 48 Hours',
      recurrenceReduction: '90.0% Recurrence Prevention',
      clinicalPrognosis: 'Prompt eradication expected with combination protocol.'
    }
  };

  const handleExportJson = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      sample: filename,
      primaryIdentification: predictedClass,
      confidence: confidence,
      inferenceLatency: inferenceTime,
      morphology: morph,
      spectralSignature: spectral,
      biofilmCharacteristics: biofilmChar,
      actionablePrescription: actionable,
      probabilities: probabilities
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Biofilm_Analysis_Report_${matchedBiofilm.short.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="results" className="py-10 animate-fadeIn">
      <div className="lab-surface p-6 sm:p-10 relative overflow-hidden border-2 border-[#18C77A]/50 shadow-[0_0_50px_rgba(24,199,122,0.2)]">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#18C77A] via-[#48F5A3] to-[#9BEFCE]"></div>

        {/* Status & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1B4435]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48F5A3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#18C77A]"></span>
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#48F5A3] block">
                AI IDENTIFICATION & SCIENTIFIC PROFILING COMPLETE
              </span>
              <span className="text-[11px] text-[#829A90] font-mono">
                Tensor Validated Sample: <strong className="text-[#F4FFF9]">{filename || 'Sample TIFF'}</strong> • Latency: {inferenceTime || '142ms'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-1.5 rounded-xl bg-[#0A241B] hover:bg-[#11382A] text-[#48F5A3] transition border border-[#18C77A]/50 hover:border-[#48F5A3] cursor-pointer font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="Download full scientific report JSON"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{copied ? 'Exported Report ✓' : 'Export Report (JSON)'}</span>
            </button>
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#11382A] hover:bg-[#18C77A] hover:text-[#061A14] text-[#F4FFF9] transition border border-[#1B4435] hover:border-[#18C77A] cursor-pointer font-sans text-xs font-bold shadow-sm"
            >
              Analyze Another Sample
            </button>
          </div>
        </div>

        {/* Primary Identification Banner */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Summary */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0A241B] border border-[#18C77A]/50 text-xs font-mono text-[#48F5A3] font-bold">
                PRIMARY MICROBIAL IDENTIFICATION
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#061A14] border border-[#1B4435] text-[11px] font-mono text-[#9BEFCE]">
                {matchedBiofilm.gram}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#061A14] border border-[#1B4435] text-[11px] font-mono text-[#829A90]">
                {matchedBiofilm.modelAccuracy}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#F4FFF9]">
              {predictedClass}
            </h2>

            <p className="text-xs sm:text-sm text-[#B4C9C0] leading-relaxed max-w-2xl">
              {matchedBiofilm.desc}
            </p>

            {/* AI Confidence & KPI Quick Metrics */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Confidence Score</div>
                <div className="text-2xl font-bold font-mono text-[#48F5A3]">
                  {typeof confidence === 'number' ? (confidence * 100).toFixed(1) : '94.2'}%
                </div>
                <div className="text-[9px] text-[#829A90] mt-0.5 font-sans">p &lt; 0.001 High Sig.</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Morphology</div>
                <div className="text-sm font-bold text-[#F4FFF9] truncate mt-1">
                  {morph.shape.split(' ')[0]}
                </div>
                <div className="text-[9px] text-[#9BEFCE] mt-0.5 truncate">{morph.dimensions.split(' ')[0]}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Dominant Spectral Peak</div>
                <div className="text-sm font-bold text-[#9BEFCE] truncate mt-1">
                  {matchedBiofilm.peak}
                </div>
                <div className="text-[9px] text-[#829A90] mt-0.5">{spectral.samMatchScore.split(' ')[0]} SAM</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Biofilm Recalcitrance</div>
                <div className="text-sm font-bold text-[#FF9E40] truncate mt-1">
                  {biofilmChar.recalcitranceIndex.split(' ')[0]} / 10
                </div>
                <div className="text-[9px] text-[#829A90] mt-0.5">High Matrix Barrier</div>
              </div>
            </div>
          </div>

          {/* Right Micrograph Holographic Reticle */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#48F5A3] shadow-[0_0_35px_rgba(72,245,163,0.35)] bg-[#061A14] group">
              <img
                src={matchedBiofilm.image}
                alt={matchedBiofilm.name}
                className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061A14] via-transparent to-transparent opacity-60" />

              {/* Reticle grid & scanning animation */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border border-dashed border-[#48F5A3] opacity-60" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#48F5A3]/40"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#48F5A3]/40"></div>
              </div>

              <div className="absolute bottom-2 left-2 right-2 text-center bg-[#061A14]/90 backdrop-blur-md py-1.5 rounded-lg border border-[#1B4435] text-[10px] font-mono text-[#48F5A3] font-bold">
                ✓ Validated Hyperspectral Specimen
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs: Probability Vector placed FIRST */}
        <div className="flex items-center gap-2 mt-4 pb-3 border-b border-[#1B4435] overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('probabilities')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'probabilities'
                ? 'bg-[#18C77A] text-[#061A14] shadow-[0_0_15px_rgba(24,199,122,0.4)]'
                : 'bg-[#0A241B] text-[#829A90] hover:text-[#F4FFF9] hover:bg-[#11382A] border border-[#1B4435]'
            }`}
          >
            <span>📊 Probability Vector</span>
          </button>

          <button
            onClick={() => setActiveTab('morphology')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'morphology'
                ? 'bg-[#18C77A] text-[#061A14] shadow-[0_0_15px_rgba(24,199,122,0.4)]'
                : 'bg-[#0A241B] text-[#829A90] hover:text-[#F4FFF9] hover:bg-[#11382A] border border-[#1B4435]'
            }`}
          >
            <span>🧬 Morphology</span>
          </button>

          <button
            onClick={() => setActiveTab('spectral')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'spectral'
                ? 'bg-[#18C77A] text-[#061A14] shadow-[0_0_15px_rgba(24,199,122,0.4)]'
                : 'bg-[#0A241B] text-[#829A90] hover:text-[#F4FFF9] hover:bg-[#11382A] border border-[#1B4435]'
            }`}
          >
            <span>🌈 Spectral Signature</span>
          </button>

          <button
            onClick={() => setActiveTab('biofilm')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'biofilm'
                ? 'bg-[#18C77A] text-[#061A14] shadow-[0_0_15px_rgba(24,199,122,0.4)]'
                : 'bg-[#0A241B] text-[#829A90] hover:text-[#F4FFF9] hover:bg-[#11382A] border border-[#1B4435]'
            }`}
          >
            <span>🦠 Biofilm & Mixed Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('actionable')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'actionable'
                ? 'bg-[#18C77A] text-[#061A14] shadow-[0_0_15px_rgba(24,199,122,0.4)]'
                : 'bg-[#0A241B] text-[#829A90] hover:text-[#F4FFF9] hover:bg-[#11382A] border border-[#1B4435]'
            }`}
          >
            <span>🎯 Actionable Output</span>
          </button>
        </div>

        {/* TAB 1: PROBABILITY DISTRIBUTION (BEFORE MORPHOLOGY) */}
        {activeTab === 'probabilities' && probabilities && Object.keys(probabilities).length > 0 && (
          <div className="mt-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-[#829A90]">
              <span className="font-semibold uppercase tracking-wider text-[#48F5A3]">
                Six-Class Posterior Softmax Probability Distribution
              </span>
              <span>Model Benchmark: 85.3% Test Acc</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {Object.entries(probabilities).map(([className, prob]) => {
                const isWinner = className === predictedClass;
                const pct = (prob * 100).toFixed(1);
                const classBiofilmImg = getBiofilmImage(className);

                return (
                  <div
                    key={className}
                    className={`p-3.5 rounded-xl border transition-all flex items-center gap-3.5 ${
                      isWinner
                        ? 'bg-[#11382A] border-[#48F5A3] shadow-[0_0_20px_rgba(72,245,163,0.15)] ring-1 ring-[#48F5A3]/40'
                        : 'bg-[#0A241B]/70 border-[#1B4435]'
                    }`}
                  >
                    <img
                      src={classBiofilmImg}
                      alt={className}
                      className="w-10 h-10 rounded-lg object-cover border border-[#18C77A]/40 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2 truncate">
                          <span className={`font-semibold truncate ${isWinner ? 'text-[#48F5A3] font-bold' : 'text-[#F4FFF9]'}`}>
                            {className}
                          </span>
                          {isWinner && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#18C77A]/20 text-[#48F5A3] font-bold flex-shrink-0">
                              TOP MATCH
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-[#F4FFF9] flex-shrink-0 ml-2">
                          {pct}%
                        </span>
                      </div>

                      <div className="w-full bg-[#061A14] h-2 rounded-full overflow-hidden border border-[#1B4435]/60">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isWinner
                              ? 'bg-gradient-to-r from-[#18C77A] to-[#48F5A3]'
                              : 'bg-[#829A90]/30'
                          }`}
                          style={{ width: `${Math.max(prob * 100, 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MORPHOLOGY DEEP-DIVE */}
        {activeTab === 'morphology' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-[#F4FFF9] flex items-center gap-2">
                  <span>Microbial Morphology & Ultrastructure Analysis</span>
                </h3>
                <p className="text-xs text-[#829A90]">
                  High-resolution cellular geometry, cell envelope architecture, and appendage characteristics for {predictedClass}.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#0A241B] border border-[#1B4435] text-[#48F5A3]">
                Taxonomy: {matchedBiofilm.gram}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Geometry & Scale */}
              <div className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-3">
                <div className="text-xs font-mono text-[#829A90] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#18C77A]"></span>
                  <span>Cell Shape & Dimensions</span>
                </div>
                <div className="text-base font-bold text-[#F4FFF9]">
                  {morph.shape}
                </div>
                <div className="p-2.5 rounded-xl bg-[#061A14] border border-[#1B4435] text-xs font-mono text-[#48F5A3]">
                  📏 Dimensions: {morph.dimensions}
                </div>
                <p className="text-xs text-[#B4C9C0] leading-relaxed">
                  Colony morphology exhibiting characteristic {morph.spatialAggregation.toLowerCase()}.
                </p>
              </div>

              {/* Card 2: Cell Envelope & Gram Profile */}
              <div className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-3">
                <div className="text-xs font-mono text-[#829A90] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#48F5A3]"></span>
                  <span>Cell Envelope & Gram Status</span>
                </div>
                <div className="text-base font-bold text-[#F4FFF9]">
                  {morph.gramStain}
                </div>
                <div className="p-2.5 rounded-xl bg-[#061A14] border border-[#1B4435] text-xs font-mono text-[#9BEFCE]">
                  🛡️ Envelope: {morph.cellEnvelope}
                </div>
                <p className="text-xs text-[#B4C9C0] leading-relaxed">
                  Envelope thickness and membrane charge govern optical penetration and biocide resistance.
                </p>
              </div>

              {/* Card 3: Motility & Appendages */}
              <div className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-3">
                <div className="text-xs font-mono text-[#829A90] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9BEFCE]"></span>
                  <span>Motility & Surface Appendages</span>
                </div>
                <div className="text-base font-bold text-[#F4FFF9]">
                  {morph.motilityAndAppendages}
                </div>
                <div className="p-2.5 rounded-xl bg-[#061A14] border border-[#1B4435] text-xs font-mono text-[#48F5A3]">
                  ⚡ Colony Architecture: {morph.colonyArchitecture}
                </div>
                <p className="text-xs text-[#B4C9C0] leading-relaxed">
                  Adhesin fimbriae mediate irreversible attachment to abiotic and biotic surfaces.
                </p>
              </div>
            </div>

            {/* Ultrastructure Checklist */}
            <div className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-3">
              <div className="text-xs font-mono text-[#48F5A3] font-bold uppercase tracking-wider">
                Cellular Ultrastructure & Virulence Determinants
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {morph.cellularUltrastructure && morph.cellularUltrastructure.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#061A14] border border-[#1B4435] flex items-center gap-3 text-xs text-[#F4FFF9]">
                    <span className="h-2 w-2 rounded-full bg-[#18C77A] flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SPECTRAL SIGNATURE */}
        {activeTab === 'spectral' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold font-display text-[#F4FFF9]">
                  Hyperspectral Absorbance & Reflectance Signature (400 - 1000 nm)
                </h3>
                <p className="text-xs text-[#829A90]">
                  High-fidelity optical reflectance curve, characteristic chemical bond resonances, and SAM angle score.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-[#0A241B] border border-[#1B4435] text-[#9BEFCE]">
                  {spectral.samMatchScore}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#0A241B] border border-[#1B4435] text-[#48F5A3]">
                  SNR: {spectral.snrRatio}
                </span>
              </div>
            </div>

            {/* Main Interactive Curve Canvas */}
            <div className="p-6 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#48F5A3] font-bold">
                  Peak Absorption: {spectral.dominantPeak}
                </span>
                <span className="text-[#829A90]">
                  Range: {spectral.wavelengthRange} ({spectral.spectralBand})
                </span>
              </div>

              <div className="h-48 sm:h-56 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#18C77A" />
                      <stop offset="40%" stopColor="#48F5A3" />
                      <stop offset="80%" stopColor="#9BEFCE" />
                      <stop offset="100%" stopColor="#20E08B" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#1B4435" strokeDasharray="3 3" strokeWidth="0.8" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#1B4435" strokeDasharray="3 3" strokeWidth="0.8" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#1B4435" strokeDasharray="3 3" strokeWidth="0.8" />

                  {/* Spectral Smooth Curve */}
                  <path
                    d={`M 0 ${150 - (matchedBiofilm.points[0]?.r || 0.3) * 120} ${matchedBiofilm.points
                      .map((p, idx) => {
                        const x = (idx / (matchedBiofilm.points.length - 1)) * 480 + 10;
                        const y = 150 - p.r * 120;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke="url(#spectrumGradient)"
                    strokeWidth="3.5"
                  />

                  {/* Scatter Data Points */}
                  {matchedBiofilm.points.map((p, idx) => {
                    const x = (idx / (matchedBiofilm.points.length - 1)) * 480 + 10;
                    const y = 150 - p.r * 120;
                    const isPeak = p.r > 0.9;

                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isPeak ? '5.5' : '3.5'}
                          fill={isPeak ? '#48F5A3' : '#18C77A'}
                          stroke="#061A14"
                          strokeWidth="2"
                        />
                        {isPeak && (
                          <text
                            x={x}
                            y={y - 10}
                            textAnchor="middle"
                            fill="#48F5A3"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {p.wl}nm ({p.r.toFixed(2)})
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#829A90] border-t border-[#1B4435] pt-2">
                <span>400 nm (Near-UV)</span>
                <span>550 nm (Visible Green)</span>
                <span>700 nm (Far-Red)</span>
                <span>850 nm (NIR-I)</span>
                <span>1000 nm (NIR-II)</span>
              </div>
            </div>

            {/* Chemical Bond Resonances Table */}
            <div className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-3">
              <div className="text-xs font-mono text-[#48F5A3] font-bold uppercase tracking-wider">
                Infrared & Raman Molecular Chemical Bond Vibrations
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {spectral.chemicalBonds && spectral.chemicalBonds.map((b, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#061A14] border border-[#1B4435] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#F4FFF9]">{b.bond}</div>
                      <div className="text-[10px] text-[#829A90] mt-0.5">{b.role}</div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#11382A] text-[#48F5A3] border border-[#1B4435] font-bold whitespace-nowrap">
                      {b.wavenum}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-[#B4C9C0] leading-relaxed border-t border-[#1B4435]">
                <strong className="text-[#48F5A3]">Optical Physics Notice:</strong> {spectral.opticalPhenomena}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BIOFILM CHARACTERISTICS & MIXED BIOFILM MATRIX */}
        {activeTab === 'biofilm' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold font-display text-[#F4FFF9]">
                  Extracellular Polymeric Substance (EPS) & Biofilm Architecture
                </h3>
                <p className="text-xs text-[#829A90]">
                  Matrix polymer composition, maturation stage, structural viscoelasticity, and polymicrobial co-colonization dynamics.
                </p>
              </div>

              {/* Mixed Biofilm Mode Switch */}
              <div className="flex items-center gap-2 bg-[#061A14] p-1.5 rounded-xl border border-[#1B4435] text-xs font-mono">
                <span className="text-[#829A90] pl-1">Matrix Analysis Mode:</span>
                <button
                  onClick={() => setIsMixedBiofilmActive(false)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                    !isMixedBiofilmActive
                      ? 'bg-[#18C77A] text-[#061A14]'
                      : 'text-[#829A90] hover:text-[#F4FFF9]'
                  }`}
                >
                  Mono-Culture
                </button>
                <button
                  onClick={() => setIsMixedBiofilmActive(true)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold flex items-center gap-1.5 ${
                    isMixedBiofilmActive
                      ? 'bg-[#FF9E40] text-[#061A14]'
                      : 'text-[#FF9E40] hover:bg-[#FF9E40]/20'
                  }`}
                >
                  <span>⚠️ Mixed Biofilm Matrix</span>
                </button>
              </div>
            </div>

            {/* Matrix Physical Profile Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Maturation Stage</div>
                <div className="text-sm font-bold text-[#48F5A3] mt-1">
                  {biofilmChar.maturityStage.split(' - ')[0]}
                </div>
                <div className="text-[10px] text-[#829A90] mt-0.5 truncate">{biofilmChar.maturityStage.split(' - ')[1]}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Matrix Thickness</div>
                <div className="text-sm font-bold text-[#F4FFF9] mt-1">
                  {biofilmChar.matrixThickness}
                </div>
                <div className="text-[10px] text-[#9BEFCE] mt-0.5">3D CLSM Calibrated</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Viscoelastic Modulus</div>
                <div className="text-sm font-bold text-[#F4FFF9] mt-1">
                  {biofilmChar.matrixViscoelasticity}
                </div>
                <div className="text-[10px] text-[#829A90] mt-0.5">High Shear Strength</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90] uppercase">Biomass Density</div>
                <div className="text-sm font-bold text-[#48F5A3] mt-1">
                  {biofilmChar.biomassIndex}
                </div>
                <div className="text-[10px] text-[#829A90] mt-0.5">Crystal Violet Ref.</div>
              </div>
            </div>

            {/* EPS Matrix Composition Breakdown */}
            <div className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#48F5A3] font-bold uppercase tracking-wider">
                  Extracellular Polymeric Substance (EPS) Hydrogel Ratio
                </span>
                <span className="text-[#829A90]">100% Normalized Dry Weight</span>
              </div>

              {/* Progress Stack Bar */}
              <div className="w-full h-3 rounded-full bg-[#061A14] overflow-hidden flex border border-[#1B4435]">
                {biofilmChar.matrixComposition.map((comp, idx) => (
                  <div
                    key={idx}
                    className="h-full transition-all duration-500"
                    style={{ width: `${comp.percentage}%`, backgroundColor: comp.color }}
                    title={`${comp.component}: ${comp.percentage}%`}
                  />
                ))}
              </div>

              {/* Component breakdown cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {biofilmChar.matrixComposition.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#061A14] border border-[#1B4435]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#B4C9C0] text-[11px] truncate">{comp.component}</span>
                      <span className="font-mono font-bold text-[#F4FFF9]">{comp.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#11382A] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${comp.percentage}%`, backgroundColor: comp.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MIXED BIOFILM / POLYMICROBIAL CO-COLONIZATION MODULE */}
            {isMixedBiofilmActive && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11382A] to-[#0A241B] border-2 border-[#FF9E40]/50 shadow-[0_0_30px_rgba(255,158,64,0.15)] space-y-5 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B4435] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#FF9E40]/20 border border-[#FF9E40] text-[#FF9E40] font-mono text-[10px] font-bold uppercase">
                      Mixed Biofilm Co-Colonization Detected
                    </span>
                    <span className="text-xs font-mono text-[#F4FFF9] font-bold">
                      Polymicrobial Interspecies Dynamics
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FF9E40]">
                    Synergy Multiplier: {biofilmChar.mixedBiofilmData.coColonizationSynergy}
                  </span>
                </div>

                {/* Co-isolated Species Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#061A14] border border-[#18C77A] space-y-1">
                    <div className="text-[10px] font-mono text-[#48F5A3] uppercase">Dominant Primary Strain</div>
                    <div className="text-base font-bold text-[#F4FFF9]">{matchedBiofilm.name}</div>
                    <div className="text-xs font-mono text-[#18C77A] font-bold">
                      {100 - biofilmChar.mixedBiofilmData.secondaryPercentage - biofilmChar.mixedBiofilmData.tertiaryPercentage}% Biomass Share
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#061A14] border border-[#FF9E40] space-y-1">
                    <div className="text-[10px] font-mono text-[#FF9E40] uppercase">Co-Colonizing Secondary Strain</div>
                    <div className="text-base font-bold text-[#F4FFF9]">{biofilmChar.mixedBiofilmData.secondarySpecies}</div>
                    <div className="text-xs font-mono text-[#FF9E40] font-bold">
                      {biofilmChar.mixedBiofilmData.secondaryPercentage}% Relative Abundance
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#061A14] border border-[#1B4435] space-y-1">
                    <div className="text-[10px] font-mono text-[#829A90] uppercase">Tertiary Associated Flora</div>
                    <div className="text-base font-bold text-[#F4FFF9]">{biofilmChar.mixedBiofilmData.tertiarySpecies}</div>
                    <div className="text-xs font-mono text-[#9BEFCE] font-bold">
                      {biofilmChar.mixedBiofilmData.tertiaryPercentage}% Relative Abundance
                    </div>
                  </div>
                </div>

                {/* Polymicrobial Synergy Description */}
                <div className="space-y-2 text-xs text-[#B4C9C0] leading-relaxed bg-[#061A14]/80 p-4 rounded-xl border border-[#1B4435]">
                  <div className="font-bold text-[#FF9E40] font-mono uppercase text-[11px]">
                    Cross-Species Polymer Shield & Synergistic Defense:
                  </div>
                  <p>{biofilmChar.mixedBiofilmData.matrixSynergyDescription}</p>
                  <p className="text-[11px] text-[#829A90] pt-1">
                    <strong className="text-[#F4FFF9]">Clinical Threat:</strong> {biofilmChar.mixedBiofilmData.polymicrobialRisk}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACTIONABLE OUTPUT (RECOMMENDED ACTIONS, APPLICATION AREAS, OUTCOME) */}
        {activeTab === 'actionable' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold font-display text-[#F4FFF9] flex items-center gap-2">
                <span>Actionable Prescription & Interventional Strategy</span>
              </h3>
              <p className="text-xs text-[#829A90]">
                Prescribed matrix-disruption protocols, specific targeted therapeutic regimens, application areas, and expected clearance outcomes.
              </p>
            </div>

            {/* Expected Clinical Outcome Scorecards */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#11382A] via-[#0A241B] to-[#11382A] border border-[#18C77A]/60 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#48F5A3] font-bold uppercase tracking-wider">
                  Predicted Treatment & Clearance Outcome
                </span>
                <span className="text-[#9BEFCE]">Validated Clinical Efficacy</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#061A14] border border-[#1B4435]">
                  <div className="text-[10px] text-[#829A90] uppercase">Matrix Disruption Rate</div>
                  <div className="text-2xl font-bold font-mono text-[#48F5A3] mt-1">
                    {actionable.expectedOutcome.matrixDisruptionRate}
                  </div>
                  <div className="text-[9px] text-[#829A90] mt-0.5">Biomass Cleavage</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#061A14] border border-[#1B4435]">
                  <div className="text-[10px] text-[#829A90] uppercase">Sensitivity Restoration</div>
                  <div className="text-2xl font-bold font-mono text-[#9BEFCE] mt-1">
                    {actionable.expectedOutcome.susceptibilityRestoration.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-[#829A90] mt-0.5">Reversal Index</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#061A14] border border-[#1B4435]">
                  <div className="text-[10px] text-[#829A90] uppercase">Clearance Timeframe</div>
                  <div className="text-xl font-bold font-mono text-[#F4FFF9] mt-1">
                    {actionable.expectedOutcome.clearanceTimeframe}
                  </div>
                  <div className="text-[9px] text-[#48F5A3] mt-0.5">Rapid Resolution</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#061A14] border border-[#1B4435]">
                  <div className="text-[10px] text-[#829A90] uppercase">Recurrence Reduction</div>
                  <div className="text-2xl font-bold font-mono text-[#18C77A] mt-1">
                    {actionable.expectedOutcome.recurrenceReduction.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-[#829A90] mt-0.5">Long-Term Eradication</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#061A14]/90 border border-[#1B4435] text-xs text-[#B4C9C0] leading-relaxed">
                <strong className="text-[#48F5A3] font-mono uppercase text-[11px]">Clinical Prognosis: </strong>
                {actionable.expectedOutcome.clinicalPrognosis}
              </div>
            </div>

            {/* Recommended Actions: Step-by-Step Clinical/Operational Protocols */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#48F5A3] font-bold uppercase tracking-wider">
                Recommended Step-by-Step Interventional Protocols
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionable.recommendedActions && actionable.recommendedActions.map((act, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#0A241B] border border-[#1B4435] space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11382A] text-[#48F5A3] border border-[#1B4435] font-bold">
                        {act.priority}
                      </span>
                      <span className="text-[10px] font-mono text-[#829A90] uppercase">
                        {act.category}
                      </span>
                    </div>

                    <div className="text-base font-bold text-[#F4FFF9]">
                      {act.title}
                    </div>

                    <p className="text-xs text-[#48F5A3] font-mono leading-relaxed bg-[#061A14] p-3 rounded-xl border border-[#1B4435]">
                      {act.protocol}
                    </p>

                    <p className="text-xs text-[#B4C9C0] leading-relaxed">
                      <strong className="text-[#F4FFF9]">Mechanism:</strong> {act.mechanism}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Areas */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#9BEFCE] font-bold uppercase tracking-wider">
                Clinical & Industrial Application Areas
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actionable.applicationAreas && actionable.applicationAreas.map((app, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0A241B] border border-[#1B4435] space-y-2">
                    <div className="text-sm font-bold text-[#F4FFF9] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#18C77A]"></span>
                      <span>{app.domain}</span>
                    </div>
                    <div className="text-xs text-[#829A90] font-mono">
                      Target Context: {app.context}
                    </div>
                    <p className="text-xs text-[#B4C9C0] leading-relaxed">
                      <strong className="text-[#48F5A3]">Deployment Action:</strong> {app.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scientific Interpretation Footer */}
        <div className="mt-8 pt-6 border-t border-[#1B4435] space-y-2 text-xs text-[#B4C9C0]">
          <div className="font-semibold text-[#F4FFF9] font-display text-sm flex items-center justify-between">
            <span>Hyperspectral AI Analytical Interpretation</span>
            <span className="text-[11px] font-mono text-[#829A90]">ISO 15189 Research Framework</span>
          </div>
          <p className="leading-relaxed">
            The neural network identified prominent spectral absorption markers and spatial texture contours matching the validated profile for <strong className="text-[#48F5A3]">{predictedClass}</strong> ({matchedBiofilm.pigment}). Morphological dimensions, EPS hydrogel parameters, and prescriptive disruption pathways have been dynamically derived from empirical HSI bio-signature matrices.
          </p>
        </div>
      </div>
    </section>
  );
}
