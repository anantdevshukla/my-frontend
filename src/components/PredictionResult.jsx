import React from 'react';
import ModelAttentionMap from './ModelAttentionMap';
import { getBiofilmByQuery, getBiofilmImage, BIOFILM_SPECIES } from '../utils/biofilmAssets';

export default function PredictionResult({ predictionResult, onReset }) {
  if (!predictionResult) return null;

  const { predictedClass, confidence, probabilities, inferenceTime, filename } = predictionResult;
  const matchedBiofilm = getBiofilmByQuery(predictedClass);

  return (
    <section id="results" className="py-10 animate-fadeIn">
      <div className="lab-surface p-6 sm:p-10 relative overflow-hidden border-2 border-[#18C77A]/50 shadow-[0_0_40px_rgba(24,199,122,0.15)]">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#18C77A] via-[#48F5A3] to-[#9BEFCE]"></div>

        {/* Top Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#1B4435]">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#48F5A3] animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#48F5A3]">
              AI IDENTIFICATION COMPLETE
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#829A90] font-mono">
            <span className="text-[#F4FFF9] font-medium">{filename || 'Sample TIFF'}</span>
            {inferenceTime && <span>• Latency: {inferenceTime}</span>}
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-xl bg-[#0A241B] hover:bg-[#11382A] text-[#F4FFF9] transition border border-[#1B4435] hover:border-[#18C77A] cursor-pointer font-sans text-xs font-semibold shadow-sm"
            >
              Analyze Another Sample
            </button>
          </div>
        </div>

        {/* Main Discovery Banner with High-Res Biofilm Specimen Micrograph */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Info */}
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A241B] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3]">
              <span>PRIMARY MICROBIAL IDENTIFICATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#F4FFF9]">
              {predictedClass}
            </h2>

            {typeof confidence === 'number' && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-[#829A90]">MODEL CONFIDENCE:</span>
                <span className="font-bold text-3xl font-mono text-[#48F5A3]">
                  {(confidence * 100).toFixed(1)}%
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#11382A] text-[#48F5A3] border border-[#1B4435] font-bold">
                  HIGH CONFIDENCE (p &lt; 0.001)
                </span>
              </div>
            )}

            <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90]">TAXONOMY:</div>
                <div className="font-bold text-[#F4FFF9]">{matchedBiofilm.gram}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435]">
                <div className="text-[10px] text-[#829A90]">MORPHOLOGY:</div>
                <div className="font-bold text-[#F4FFF9]">{matchedBiofilm.morphology.split(' ')[0]}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A241B] border border-[#1B4435] col-span-2 sm:col-span-1">
                <div className="text-[10px] text-[#829A90]">SPECTRAL PEAK:</div>
                <div className="font-bold text-[#9BEFCE]">{matchedBiofilm.peak}</div>
              </div>
            </div>
          </div>

          {/* Right Biofilm Holographic Specimen Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-[#48F5A3] shadow-[0_0_30px_rgba(72,245,163,0.3)] bg-[#061A14]">
              <img
                src={matchedBiofilm.image}
                alt={matchedBiofilm.name}
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061A14] via-transparent to-transparent opacity-60" />
              
              {/* Lens Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-24 h-24 rounded-full border border-dashed border-[#48F5A3]" />
              </div>

              <div className="absolute bottom-2 left-2 right-2 text-center bg-[#061A14]/85 backdrop-blur-md py-1 rounded-lg border border-[#1B4435] text-[10px] font-mono text-[#48F5A3] font-bold">
                ✓ Validated Biofilm Matrix
              </div>
            </div>
          </div>
        </div>

        {/* Probability Distribution with Biofilm Specimen Avatars */}
        {probabilities && Object.keys(probabilities).length > 0 && (
          <div className="pt-4 pb-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#829A90]">
              <span className="font-semibold uppercase tracking-wider text-[#48F5A3]">
                Six-Class Posterior Probabilities
              </span>
              <span>Softmax Distribution</span>
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

        {/* Model Attention / Explainability Heatmap Component */}
        <div className="mt-4">
          <ModelAttentionMap predictedClass={predictedClass} />
        </div>

        {/* Scientific Interpretation & Disclaimer */}
        <div className="mt-6 pt-6 border-t border-[#1B4435] space-y-2 text-xs text-[#B4C9C0]">
          <div className="font-semibold text-[#F4FFF9] font-display text-sm">
            AI-Assisted Interpretation
          </div>
          <p className="leading-relaxed">
            The neural network identified prominent spectral absorption markers and spatial texture contours matching the validated profile for <strong className="text-[#48F5A3]">{predictedClass}</strong> ({matchedBiofilm.pigment}).
          </p>
          <p className="text-[11px] text-[#829A90] leading-relaxed">
            Research prototype notice — this hyperspectral profiling pipeline is designed for scientific discovery and laboratory research decision support.
          </p>
        </div>
      </div>
    </section>
  );
}
