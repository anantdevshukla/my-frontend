import React, { useState, useRef } from 'react';

export const SAMPLE_PRESETS = [
  {
    id: 'ecoli_sample',
    name: 'E. coli Biofilm (Gram -)',
    target: 'Escherichia coli',
    filename: 'hyperspectral_sample_ecoli_b14.tif',
    size: '14.2 MB',
    confidenceEstimate: 0.942,
    description: 'Gram-negative rod-shaped bacterium with prominent extracellular matrix.'
  },
  {
    id: 'saureus_sample',
    name: 'S. aureus Cluster (Gram +)',
    target: 'Staphylococcus aureus',
    filename: 'hyperspectral_sample_saureus_c08.tiff',
    size: '16.8 MB',
    confidenceEstimate: 0.965,
    description: 'Gram-positive golden staphylococcal clustering with staphyloxanthin absorbance.'
  },
  {
    id: 'paeruginosa_sample',
    name: 'P. aeruginosa Mucoid (Gram -)',
    target: 'Pseudomonas aeruginosa',
    filename: 'hyperspectral_sample_paeruginosa_m02.tif',
    size: '15.4 MB',
    confidenceEstimate: 0.928,
    description: 'Aggressive biofilm former exhibiting pyocyanin pigment spectral signature.'
  },
  {
    id: 'calbicans_sample',
    name: 'C. albicans Fungal Biofilm',
    target: 'Candida albicans',
    filename: 'hyperspectral_sample_calbicans_f05.tiff',
    size: '18.1 MB',
    confidenceEstimate: 0.897,
    description: 'Dimorphic opportunistic fungal biofilm with hyphal pseudohyphal network.'
  },
  {
    id: 'kpneumoniae_sample',
    name: 'K. pneumoniae Capsule (Gram -)',
    target: 'Klebsiella pneumoniae',
    filename: 'hyperspectral_sample_kpneumoniae_k04.tif',
    size: '14.9 MB',
    confidenceEstimate: 0.914,
    description: 'Heavily encapsulated rod showing polysaccharide capsule reflectance signature.'
  },
  {
    id: 'efaecalis_sample',
    name: 'E. faecalis Chains (Gram +)',
    target: 'Enterococcus faecalis',
    filename: 'hyperspectral_sample_efaecalis_e01.tiff',
    size: '13.7 MB',
    confidenceEstimate: 0.906,
    description: 'Gram-positive commensal forming robust biofilm pairs/chains in hostile media.'
  }
];

export default function UploadSection({
  onFileSelected,
  onAnalyze,
  isAnalyzing,
  selectedFile,
  currentPreset
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
      setErrorMessage('Invalid file format. Please upload a Hyperspectral TIFF file (.tif or .tiff).');
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
    const mockTiffBlob = new Blob(['MOCK_HYPERSPECTRAL_TIFF_DATA_FOR_' + preset.target], { type: 'image/tiff' });
    const mockFile = new File([mockTiffBlob], preset.filename, { type: 'image/tiff' });
    onFileSelected(mockFile, preset);
  };

  return (
    <div className="scientific-card p-6 sm:p-7 relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-cyan"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
              Sample Acquisition Hub
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-light-textPrimary dark:text-dark-textPrimary mt-1">
            Upload Hyperspectral TIFF
          </h3>
        </div>

        <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-mono bg-light-secondary dark:bg-dark-secondary px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border w-fit">
          Format: <span className="text-brand-blue dark:text-brand-electric font-semibold">.tif / .tiff</span>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-brand-cyan bg-brand-cyan/10 shadow-md'
            : selectedFile
            ? 'border-brand-cyan bg-light-elevated dark:bg-dark-elevated'
            : 'border-brand-blue/50 dark:border-brand-electric/50 bg-light-secondary/40 dark:bg-dark-secondary/50 hover:border-brand-cyan'
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
          <div className="flex flex-col items-center space-y-2.5">
            <div className="h-10 w-10 rounded-lg bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-light-textPrimary dark:text-dark-textPrimary break-all">
                {selectedFile.name}
              </div>
              <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Hyperspectral TIFF
                {currentPreset && (
                  <span className="text-status-successLight dark:text-status-successDark font-semibold ml-2">
                    (Benchmark Loaded)
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] text-brand-blue dark:text-brand-electric underline font-mono">
              Click to replace file
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2.5">
            <div className="h-10 w-10 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center text-brand-blue dark:text-brand-electric shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-light-textPrimary dark:text-dark-textPrimary">
                Drag and drop your Hyperspectral TIFF file here
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5">
                or <span className="text-brand-blue dark:text-brand-electric underline font-medium">browse local files</span> (.tif / .tiff)
              </p>
            </div>
            <div className="text-[11px] text-light-textMuted dark:text-dark-textMuted font-mono">
              The AI pipeline automatically standardizes dimensions to 224 × 224 × 3.
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-lg bg-status-error/10 border border-status-error/40 text-status-error text-xs flex items-center gap-2 font-mono">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Automated Preprocessing Info Banner */}
      <div className="mt-4 p-3 rounded-lg bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border flex items-center justify-between text-xs text-light-textSecondary dark:text-dark-textSecondary">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-cyan shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>
            <strong className="text-light-textPrimary dark:text-dark-textPrimary font-medium">Auto-Pipeline:</strong> Continuous raw spectral cubes are calibrated, PCA-projected, and formatted for CNN inference.
          </span>
        </div>
        <span className="hidden sm:inline text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted bg-light-card dark:bg-dark-card px-2 py-1 rounded border border-light-border dark:border-dark-border">
          Auto 224×224×3
        </span>
      </div>

      {/* Benchmark Presets */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
            Or Test with Curated Hyperspectral Benchmarks:
          </span>
          <span className="text-[11px] text-brand-blue dark:text-brand-electric font-mono">6 Target Classes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = currentPreset && currentPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-lg text-left transition-all border text-xs flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-brand-cyan bg-light-elevated dark:bg-dark-elevated ring-1 ring-brand-cyan/50 shadow-sm'
                    : 'border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card hover:border-brand-cyan/50'
                }`}
              >
                <div className="font-bold text-light-textPrimary dark:text-dark-textPrimary font-mono text-[11px] truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] text-light-textSecondary dark:text-dark-textSecondary font-mono mt-0.5 truncate">
                  {preset.filename}
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-light-textMuted dark:text-dark-textMuted">{preset.size}</span>
                  <span className="text-status-successLight dark:text-status-successDark font-semibold">Ready</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analyze CTA */}
      <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-mono">
          {selectedFile ? (
            <span className="text-status-successLight dark:text-status-successDark flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-status-successLight dark:bg-status-successDark"></span>
              Ready for Hyperspectral AI Profiling
            </span>
          ) : (
            <span>Please select or upload a Hyperspectral TIFF file</span>
          )}
        </div>

        <button
          onClick={onAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className={`w-full sm:w-auto px-7 py-3 rounded-lg font-display font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
            !selectedFile || isAnalyzing
              ? 'bg-light-secondary dark:bg-dark-secondary text-light-textMuted dark:text-dark-textMuted cursor-not-allowed border border-light-border dark:border-dark-border'
              : 'signature-gradient text-white hover:opacity-95 active:scale-[0.99]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running AI Profiling Pipeline...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Analyze Sample</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
