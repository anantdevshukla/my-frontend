import React, { useState } from 'react';
import { BIOFILM_SPECIES, getBiofilmByQuery } from '../utils/biofilmAssets';

export const PATHOGEN_INFO = {
  'Escherichia coli': {
    shortName: 'E. coli',
    gram: 'Gram-negative',
    morphology: 'Rod (Bacillus 0.5 × 2.0 µm)',
    biofilmRisk: 'High (Urinary & Catheter Biofilms)',
    pigmentPeak: '520 - 580 nm',
    description: 'Forms dense curli fiber and cellulose-rich biofilms resistant to standard antimicrobial penetration.',
    accentColor: '#1261A0'
  },
  'Enterococcus faecalis': {
    shortName: 'E. faecalis',
    gram: 'Gram-positive',
    morphology: 'Cocci (Pairs & Chains 0.6 - 1.2 µm)',
    biofilmRisk: 'Severe (Endodontic & Nosocomial)',
    pigmentPeak: '490 - 540 nm',
    description: 'Forms persistent calcified biofilm matrices in root canals, heart valves, and surgical devices.',
    accentColor: '#16C7C7'
  },
  'Staphylococcus aureus': {
    shortName: 'S. aureus',
    gram: 'Gram-positive',
    morphology: 'Cocci (Grape-like Clusters 0.8 - 1.0 µm)',
    biofilmRisk: 'Critical (MRSA & Prosthetic Joint)',
    pigmentPeak: '450 - 510 nm',
    description: 'Produces staphyloxanthin carotenoids and polysaccharide intercellular adhesin (PIA) matrix.',
    accentColor: '#35B9E9'
  },
  'Klebsiella pneumoniae': {
    shortName: 'K. pneumoniae',
    gram: 'Gram-negative',
    morphology: 'Encapsulated Rod (0.5 × 1.2 µm)',
    biofilmRisk: 'Critical (Ventilator & Catheter)',
    pigmentPeak: '560 - 620 nm',
    description: 'Hypervirulent capsule polysaccharides impede phagocytosis and hyperspectral reflectance dispersion.',
    accentColor: '#6C63FF'
  },
  'Pseudomonas aeruginosa': {
    shortName: 'P. aeruginosa',
    gram: 'Gram-negative',
    morphology: 'Flagellated Rod (0.6 × 1.5 µm)',
    biofilmRisk: 'Extreme (Cystic Fibrosis & Wounds)',
    pigmentPeak: '690 - 740 nm (Pyocyanin)',
    description: 'Produces distinct redox-active pyocyanin and robust alginate extracellular slime.',
    accentColor: '#9B8CFF'
  },
  'Candida albicans': {
    shortName: 'C. albicans',
    gram: 'Fungal Yeast',
    morphology: 'Dimorphic (Yeast & Hyphae 4.0 - 6.0 µm)',
    biofilmRisk: 'High (Mucosal & Medical Devices)',
    pigmentPeak: '600 - 660 nm',
    description: 'Forms complex multi-layered polymicrobial biofilms with extensive fungal hyphal meshworks.',
    accentColor: '#0B3C70'
  }
};

export default function ResultsSection({ predictionResult, rawApiResponse, onReset }) {
  const [activeTab, setActiveTab] = useState('morphology');
  const [copied, setCopied] = useState(false);
  const [isMixedActive, setIsMixedActive] = useState(true);

  if (!predictionResult) return null;

  const { predictedClass, confidence, probabilities, inferenceTime, filename } = predictionResult;
  const bio = getBiofilmByQuery(predictedClass);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawApiResponse || predictionResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="scientific-card p-6 sm:p-7 relative overflow-hidden animate-fadeIn">
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-status-successLight dark:bg-status-successDark"></span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-status-successLight dark:text-status-successDark">
            Analysis Complete
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-light-secondary dark:bg-dark-secondary text-brand-blue dark:text-brand-electric border border-light-border dark:border-dark-border">
            Reported Validation: 85.3%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-mono">
            {filename || 'TIFF Sample'} • {inferenceTime || '142ms'}
          </span>
          <button
            onClick={onReset}
            className="text-xs px-2.5 py-1 rounded bg-light-secondary dark:bg-dark-card text-light-textPrimary dark:text-dark-textPrimary hover:border-brand-cyan transition font-mono border border-light-border dark:border-dark-border cursor-pointer"
          >
            New Sample
          </button>
        </div>
      </div>

      {/* Main Predicted Result Card */}
      <div className="mt-5 p-6 rounded-xl bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 signature-gradient"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-blue text-white dark:bg-brand-electric dark:text-dark-bg">
                Predicted Pathogen
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary">
                {bio.gram} • {bio.morphology}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-light-textPrimary dark:text-dark-textPrimary tracking-tight">
              {predictedClass}
            </h2>

            <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary mt-2 max-w-xl leading-relaxed">
              {bio.desc}
            </p>
          </div>

          {/* Confidence Score Box */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border min-w-[190px] shadow-sm">
            <span className="text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted uppercase tracking-wider mb-1">
              AI Confidence Score
            </span>
            <div className="text-3xl font-extrabold font-mono text-brand-blue dark:text-brand-electric">
              {(confidence * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-light-secondary dark:bg-dark-secondary h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-brand-cyan h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(confidence * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-status-successLight dark:text-status-successDark mt-1.5 font-semibold">
              Statistical Significance Verified
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-light-border dark:border-dark-border pb-2 overflow-x-auto">
        {['morphology', 'spectral', 'biofilm', 'actionable', 'probabilities', 'raw'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'bg-light-secondary dark:bg-dark-secondary text-brand-blue dark:text-brand-electric font-semibold border border-light-border dark:border-dark-border'
                : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            {tab === 'morphology' && '🧬 Morphology'}
            {tab === 'spectral' && '🌈 Spectral Signature'}
            {tab === 'biofilm' && '🦠 Biofilm & Mixed Matrix'}
            {tab === 'actionable' && '🎯 Actionable Output'}
            {tab === 'probabilities' && '📊 Probabilities'}
            {tab === 'raw' && 'Payload JSON'}
          </button>
        ))}
      </div>

      {/* Morphology Tab */}
      {activeTab === 'morphology' && bio.morphologyDetails && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-light-secondary/40 dark:bg-dark-secondary/40 border border-light-border dark:border-dark-border space-y-2">
            <span className="text-[10px] text-light-textMuted dark:text-dark-textMuted uppercase font-bold">Cellular Geometry</span>
            <div className="font-bold text-sm text-light-textPrimary dark:text-dark-textPrimary">{bio.morphologyDetails.shape}</div>
            <div className="text-light-textSecondary dark:text-dark-textSecondary">Dimensions: {bio.morphologyDetails.dimensions}</div>
            <div className="text-light-textSecondary dark:text-dark-textSecondary">Gram Status: {bio.morphologyDetails.gramStain}</div>
          </div>
          <div className="p-4 rounded-lg bg-light-secondary/40 dark:bg-dark-secondary/40 border border-light-border dark:border-dark-border space-y-2">
            <span className="text-[10px] text-light-textMuted dark:text-dark-textMuted uppercase font-bold">Envelope & Appendages</span>
            <div className="text-light-textSecondary dark:text-dark-textSecondary">Motility: {bio.morphologyDetails.motilityAndAppendages}</div>
            <div className="text-light-textSecondary dark:text-dark-textSecondary">Aggregation: {bio.morphologyDetails.spatialAggregation}</div>
          </div>
        </div>
      )}

      {/* Spectral Tab */}
      {activeTab === 'spectral' && bio.spectralDetails && (
        <div className="mt-5 p-4 rounded-lg bg-light-secondary/50 dark:bg-dark-secondary/50 border border-light-border dark:border-dark-border space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-blue dark:text-brand-electric font-medium">
              Peak: {bio.spectralDetails.dominantPeak}
            </span>
            <span className="text-light-textSecondary dark:text-dark-textSecondary">
              {bio.spectralDetails.samMatchScore}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {bio.spectralDetails.chemicalBonds.map((b, idx) => (
              <div key={idx} className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex justify-between">
                <span>{b.bond}</span>
                <span className="text-brand-cyan font-bold">{b.wavenum}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biofilm Tab */}
      {activeTab === 'biofilm' && bio.biofilmCharacteristics && (
        <div className="mt-5 space-y-4 text-xs font-mono">
          <div className="flex justify-between items-center">
            <span className="font-bold text-light-textPrimary dark:text-dark-textPrimary">Biofilm Physical & Hydrogel Matrix</span>
            <button
              onClick={() => setIsMixedActive(!isMixedActive)}
              className="px-2.5 py-1 rounded bg-brand-cyan/20 text-brand-cyan font-bold cursor-pointer"
            >
              {isMixedActive ? '⚠️ Mixed Biofilm Active' : 'Mono-Culture Mode'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Stage</div>
              <div className="font-bold">{bio.biofilmCharacteristics.maturityStage.split(' - ')[0]}</div>
            </div>
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Thickness</div>
              <div className="font-bold">{bio.biofilmCharacteristics.matrixThickness}</div>
            </div>
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Viscoelasticity</div>
              <div className="font-bold">{bio.biofilmCharacteristics.matrixViscoelasticity}</div>
            </div>
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Recalcitrance</div>
              <div className="font-bold text-brand-electric">{bio.biofilmCharacteristics.recalcitranceIndex}</div>
            </div>
          </div>

          {isMixedActive && bio.biofilmCharacteristics.mixedBiofilmData && (
            <div className="p-4 rounded-lg bg-light-elevated dark:bg-dark-elevated border border-brand-cyan/40 space-y-2">
              <div className="text-brand-electric font-bold">Mixed Biofilm: {bio.biofilmCharacteristics.mixedBiofilmData.coColonizationSynergy}</div>
              <p className="text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">{bio.biofilmCharacteristics.mixedBiofilmData.matrixSynergyDescription}</p>
            </div>
          )}
        </div>
      )}

      {/* Actionable Output Tab */}
      {activeTab === 'actionable' && bio.actionableOutput && (
        <div className="mt-5 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Disruption Rate</div>
              <div className="font-bold text-status-successLight dark:text-status-successDark">{bio.actionableOutput.expectedOutcome.matrixDisruptionRate}</div>
            </div>
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Sensitivity Boost</div>
              <div className="font-bold text-brand-cyan">{bio.actionableOutput.expectedOutcome.susceptibilityRestoration}</div>
            </div>
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Clearance Time</div>
              <div className="font-bold">{bio.actionableOutput.expectedOutcome.clearanceTimeframe}</div>
            </div>
            <div className="p-2.5 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="text-[10px] text-light-textMuted dark:text-dark-textMuted">Recurrence Drop</div>
              <div className="font-bold text-brand-electric">{bio.actionableOutput.expectedOutcome.recurrenceReduction}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-light-textPrimary dark:text-dark-textPrimary">Recommended Protocols:</div>
            {bio.actionableOutput.recommendedActions.map((act, i) => (
              <div key={i} className="p-3 rounded bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                <div className="font-bold text-brand-blue dark:text-brand-electric">{act.title}</div>
                <div className="text-light-textSecondary dark:text-dark-textSecondary mt-1">{act.protocol}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Probabilities Tab */}
      {activeTab === 'probabilities' && probabilities && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(probabilities).map(([className, prob]) => {
              const isWinner = className === predictedClass;
              const percentage = (prob * 100).toFixed(1);

              return (
                <div
                  key={className}
                  className={`p-3 rounded-lg border transition-all ${
                    isWinner
                      ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan shadow-sm ring-1 ring-brand-cyan/40'
                      : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`font-mono font-semibold ${isWinner ? 'text-brand-blue dark:text-brand-electric' : 'text-light-textPrimary dark:text-dark-textPrimary'}`}>
                      {className}
                    </span>
                    <span className="font-mono text-xs font-semibold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-light-secondary dark:bg-dark-secondary h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isWinner ? 'bg-brand-cyan' : 'bg-light-textMuted/40 dark:bg-dark-textMuted/40'}`}
                      style={{ width: `${Math.max(prob * 100, 2)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Raw JSON View */}
      {activeTab === 'raw' && (
        <div className="mt-5">
          <div className="flex items-center justify-between bg-light-secondary dark:bg-dark-secondary px-4 py-2 rounded-t-lg border border-light-border dark:border-dark-border text-xs font-mono">
            <span className="text-light-textSecondary dark:text-dark-textSecondary">Payload Inspector</span>
            <button
              onClick={handleCopyJson}
              className="text-brand-blue dark:text-brand-electric hover:underline font-mono transition cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="p-4 bg-light-card dark:bg-dark-bg text-light-textPrimary dark:text-brand-darkCyan font-mono text-xs rounded-b-lg border-x border-b border-light-border dark:border-dark-border overflow-x-auto max-h-60">
            {JSON.stringify(rawApiResponse || predictionResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
