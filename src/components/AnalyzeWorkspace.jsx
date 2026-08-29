import React, { useState, useRef } from 'react';
import HyperspectralCubeViewer from './HyperspectralCubeViewer';

// Benchmark presets for immediate verification without a local 50MB TIFF file
export const BENCHMARK_SAMPLES = [
  {
    id: 'ecoli_b14',
    name: 'E. coli Biofilm Sample',
    target: 'Escherichia coli',
    filename: 'hyperspectral_sample_ecoli_b14.tif',
    sizeBytes: 14889728
  },
  {
    id: 'saureus_c08',
    name: 'S. aureus Cluster Sample',
    target: 'Staphylococcus aureus',
    filename: 'hyperspectral_sample_saureus_c08.tiff',
    sizeBytes: 17616076
  },
  {
    id: 'paeruginosa_m02',
    name: 'P. aeruginosa Mucoid Sample',
    target: 'Pseudomonas aeruginosa',
    filename: 'hyperspectral_sample_paeruginosa_m02.tif',
    sizeBytes: 16148070
  },
  {
    id: 'calbicans_f05',
    name: 'C. albicans Yeast Sample',
    target: 'Candida albicans',
    filename: 'hyperspectral_sample_calbicans_f05.tiff',
    sizeBytes: 18979225
  },
  {
    id: 'kpneumoniae_k04',
    name: 'K. pneumoniae Capsule Sample',
    target: 'Klebsiella pneumoniae',
    filename: 'hyperspectral_sample_kpneumoniae_k04.tif',
    sizeBytes: 15623782
  },
  {
    id: 'efaecalis_e01',
    name: 'E. faecalis Chain Sample',
    target: 'Enterococcus faecalis',
    filename: 'hyperspectral_sample_efaecalis_e01.tiff',
    sizeBytes: 14365491
  }
];

export default function AnalyzeWorkspace({
  onFileSelected,
  onAnalyze,
  isAnalyzing,
  selectedFile,
  currentPreset,
  isDarkMode
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

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
    <section id="analyze-workspace" className="py-12 sm:py-16">
      <div className="sci-surface p-6 sm:p-8">
        {/* Workspace Header */}
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
            Analysis Workspace
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary mt-1">
            Analyze Hyperspectral Data
          </h2>
          <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary mt-2">
            Upload a hyperspectral TIFF file (.tif / .tiff) to run the deployed AI classification pipeline. Preprocessing and tensor formatting are handled automatically.
          </p>
        </div>

        {/* Split Workspace Layout: Upload on Left, 3D Data Cube on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload Dropzone & Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Upload Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={`p-8 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
                isDragOver
                  ? 'bg-brand-cyan/10 border-brand-cyan shadow-sm'
                  : selectedFile
                  ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan/70'
                  : 'bg-light-secondary/50 dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-brand-cyan/50'
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
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold font-mono text-light-textPrimary dark:text-dark-textPrimary break-all">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-mono mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Hyperspectral TIFF
                    </div>
                  </div>
                  <span className="text-xs text-brand-blue dark:text-brand-electric underline font-medium">
                    Click to replace file
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-light-card dark:bg-dark-secondary border border-light-border dark:border-dark-border flex items-center justify-center text-brand-blue dark:text-brand-electric mx-auto shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-light-textPrimary dark:text-dark-textPrimary">
                      Upload hyperspectral data
                    </h4>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5 font-normal">
                      TIFF files (.tif, .tiff)
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-light-card dark:bg-dark-secondary hover:bg-light-secondary dark:hover:bg-dark-highest border border-light-border dark:border-dark-border text-xs font-semibold text-light-textPrimary dark:text-dark-textPrimary transition shadow-sm cursor-pointer"
                    >
                      Choose File
                    </button>
                    <span className="text-xs text-light-textMuted dark:text-dark-textMuted ml-3">
                      or drag and drop
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-status-errorLight/10 dark:bg-status-errorDark/10 border border-status-errorLight/30 dark:border-status-errorDark/30 text-status-errorLight dark:text-status-errorDark text-xs font-mono flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Benchmark Samples Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-light-textSecondary dark:text-dark-textSecondary">
                <span className="font-medium">Or select a curated benchmark sample:</span>
                <span className="text-[11px] font-mono text-light-textMuted dark:text-dark-textMuted">6 Classes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BENCHMARK_SAMPLES.map((preset) => {
                  const isSelected = currentPreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2.5 rounded-xl text-left transition border text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-light-elevated dark:bg-dark-elevated border-brand-cyan shadow-sm'
                          : 'bg-light-card dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-brand-cyan/40'
                      }`}
                    >
                      <div className="font-semibold text-light-textPrimary dark:text-dark-textPrimary text-[11px] truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted truncate mt-0.5">
                        {preset.filename}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Analysis Action Button */}
            <div className="pt-2">
              <button
                onClick={onAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className={`w-full py-3.5 rounded-xl font-display font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                  !selectedFile || isAnalyzing
                    ? 'bg-light-secondary dark:bg-dark-secondary text-light-textMuted dark:text-dark-textMuted cursor-not-allowed border border-light-border dark:border-dark-border'
                    : 'signature-gradient text-white hover:opacity-95 active:scale-[0.99]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing hyperspectral data...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>

              {/* Calm Indeterminate Processing Status */}
              {isAnalyzing && (
                <div className="mt-3 p-3 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border space-y-1 text-xs text-light-textSecondary dark:text-dark-textSecondary animate-fadeIn">
                  <div className="flex items-center gap-2 font-medium text-brand-blue dark:text-brand-electric">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                    <span>AI Classification Pipeline In Progress</span>
                  </div>
                  <div className="text-[11px] text-light-textMuted dark:text-dark-textMuted pl-3.5">
                    Preparing spectral information • Extracting deep spatial embeddings • Evaluating 6-class softmax
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive 3D Hyperspectral Data Cube Visualizer (5 cols) */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[430px] bg-light-secondary/30 dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border overflow-hidden flex items-center justify-center">
            <HyperspectralCubeViewer
              isDarkMode={isDarkMode}
              isScanning={isAnalyzing}
              sampleName={selectedFile?.name}
            />
            <div className="absolute top-3 left-4 pointer-events-none text-[11px] font-mono text-light-textPrimary dark:text-dark-textPrimary bg-white/90 dark:bg-[#0F2032]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#D8E3EA] dark:border-[#233B50] shadow-sm flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${isAnalyzing ? 'bg-brand-violet animate-ping' : 'bg-brand-cyan animate-pulse'}`}></span>
              <span>
                {selectedFile
                  ? `DATA CUBE • ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                  : 'DATA CUBE • Ready for Input'}
              </span>
            </div>

            <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted bg-white/80 dark:bg-[#0F2032]/80 px-2 py-0.5 rounded border border-[#D8E3EA] dark:border-[#233B50]">
              Optical Matrix (X × Y × λ)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
