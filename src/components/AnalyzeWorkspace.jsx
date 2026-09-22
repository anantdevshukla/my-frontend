import React, { useState, useRef } from 'react';
import ProcessingState from './ProcessingState';
import HyperspectralCubeViewer from './HyperspectralCubeViewer';
import { BIOFILM_SPECIES, getBiofilmByQuery, getBiofilmImage } from '../utils/biofilmAssets';

export const BENCHMARK_SAMPLES = BIOFILM_SPECIES.map((spec) => ({
  id: spec.id,
  name: `${spec.short} Biofilm Sample`,
  target: spec.name,
  short: spec.short,
  filename: spec.benchmarkFilename,
  sizeBytes: 15889728,
  gram: spec.gram,
  image: spec.image,
  peak: spec.peak
}));

export default function AnalyzeWorkspace({
  onFileSelected,
  onAnalyze,
  isAnalyzing,
  selectedFile,
  currentPreset
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const matchedBiofilm = getBiofilmByQuery(currentPreset?.target || selectedFile?.name || 'ecoli');

  const validateAndSelectFile = (file) => {
    setErrorMessage(null);
    if (!file) return;

    const name = file.name.toLowerCase();
    const isTiff = name.endsWith('.tif') || name.endsWith('.tiff');

    if (!isTiff) {
      setErrorMessage('Invalid file format. Please select a Hyperspectral TIFF file (.tif or .tiff).');
      return;
    }

    onFileSelected(file, null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset) => {
    setErrorMessage(null);
    const mockTiffBlob = new Blob(['MOCK_HYPERSPECTRAL_TIFF_' + preset.target], { type: 'image/tiff' });
    const mockFile = new File([mockTiffBlob], preset.filename, { type: 'image/tiff' });
    onFileSelected(mockFile, preset);
  };

  return (
    <section id="analyze-workspace" className="py-16 sm:py-24 relative">
      <div className="lab-surface p-6 sm:p-10 relative overflow-hidden">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1B4435]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A241B] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
              <span>06 // SCIENTIFIC INSTRUMENT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#F4FFF9]">
              BIOFILM ANALYZER
            </h2>
            <p className="text-xs sm:text-sm text-[#B4C9C0] mt-1.5">
              Upload a hyperspectral TIFF file (.tif / .tiff) or test a benchmark strain to run the AI neural classification pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-[#0A241B] border border-[#1B4435] text-[#829A90]">
              Tensor Target: <strong className="text-[#48F5A3]">224 × 224 × 3</strong>
            </span>
          </div>
        </div>

        {/* Split Console: Left Controls / Right 3D Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Dropzone, Presets, CTA (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden ${
                isDragOver
                  ? 'bg-[#18C77A]/15 border-[#48F5A3] shadow-[0_0_30px_rgba(72,245,163,0.3)]'
                  : selectedFile
                  ? 'bg-[#11382A] border-[#18C77A]'
                  : 'bg-[#0A241B]/70 border-[#1B4435] hover:border-[#18C77A]/60 hover:bg-[#0D2B20]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    validateAndSelectFile(e.target.files[0]);
                  }
                }}
                accept=".tif,.tiff"
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-left w-full">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#48F5A3] shadow-md flex-shrink-0 bg-[#061A14]">
                    <img
                      src={matchedBiofilm.image}
                      alt={matchedBiofilm.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061A14] via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-1 right-1 text-[8px] font-mono px-1 rounded bg-[#061A14]/90 text-[#48F5A3]">
                      RAW
                    </span>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-pulse"></span>
                      <span className="text-xs font-mono font-bold text-[#48F5A3] uppercase">
                        Specimen Tensor Mounted
                      </span>
                    </div>
                    <div className="text-sm font-bold font-mono text-[#F4FFF9] truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-[#829A90] font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {matchedBiofilm.name}
                    </div>
                    <span className="text-[11px] text-[#9BEFCE] hover:underline font-mono inline-block">
                      Click to upload different TIFF file
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-3">
                  <div className="h-12 w-12 rounded-xl bg-[#0D2B20] border border-[#1B4435] flex items-center justify-center text-[#48F5A3] mx-auto shadow-md">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-[#F4FFF9]">
                      DROP HYPERSPECTRAL SAMPLE HERE
                    </h4>
                    <p className="text-xs text-[#829A90] mt-0.5">
                      Upload raw multi-band TIFF (.tif / .tiff)
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-[#0D2B20] hover:bg-[#11382A] border border-[#1B4435] text-xs font-semibold text-[#F4FFF9] transition shadow-sm cursor-pointer"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error State */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#FF5C6C]/10 border border-[#FF5C6C]/30 text-[#FF5C6C] text-xs font-mono flex items-center gap-2.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Benchmark Samples Selector with Biofilm Thumbnail Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#B4C9C0]">
                <span className="font-medium font-mono">Or select curated benchmark specimen:</span>
                <span className="text-[11px] font-mono text-[#829A90]">6 Clinical Isolates</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BENCHMARK_SAMPLES.map((preset) => {
                  const isSelected = currentPreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#11382A] border-[#48F5A3] shadow-[0_0_15px_rgba(72,245,163,0.25)] ring-1 ring-[#48F5A3]'
                          : 'bg-[#0A241B] border-[#1B4435] hover:border-[#18C77A]/50 hover:bg-[#0D2B20]'
                      }`}
                    >
                      <img
                        src={preset.image}
                        alt={preset.short}
                        className="w-9 h-9 rounded-lg object-cover border border-[#18C77A]/40 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[#F4FFF9] text-[11px] truncate">
                          {preset.short}
                        </div>
                        <div className="text-[9px] font-mono text-[#829A90] truncate">
                          {preset.gram.split(' ')[0]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={onAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className={`w-full py-4 rounded-xl font-display font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl cursor-pointer ${
                  !selectedFile || isAnalyzing
                    ? 'bg-[#0A241B] text-[#829A90] cursor-not-allowed border border-[#1B4435]'
                    : 'emerald-gradient-btn'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-[#061A14]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>SPECTRAL ANALYSIS IN PROGRESS...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Analyze Sample →</span>
                  </>
                )}
              </button>

              {/* Multi-step processing progression */}
              {isAnalyzing && (
                <div className="mt-4">
                  <ProcessingState />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 3D Data Cube Visualizer with Biofilm mapping (5 cols) */}
          <div className="lg:col-span-5 relative">
            <HyperspectralCubeViewer
              isScanning={isAnalyzing}
              sampleName={selectedFile?.name}
              target={currentPreset?.target || (selectedFile ? selectedFile.name : null)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
