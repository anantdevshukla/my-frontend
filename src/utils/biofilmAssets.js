import candidaImg from '../assets/biofilm/Candida albicans.png';
import faecalisImg from '../assets/biofilm/Enterococcus faecalis.png';
import ecoliImg from '../assets/biofilm/Escherichia coli.png';
import klebsiellaImg from '../assets/biofilm/Klebsiella pneumoniae.png';
import pseudomonasImg from '../assets/biofilm/Pseudomonas aeruginosa.png';
import staphImg from '../assets/biofilm/Staphylococcus aureus.png';
import mainBiofilmImg from '../assets/biofilm/biofilm.png';

export { mainBiofilmImg };

export const BIOFILM_SPECIES = [
  {
    id: 'ecoli',
    name: 'Escherichia coli',
    short: 'E. coli',
    image: ecoliImg,
    gram: 'Gram-negative',
    morphology: 'Bacillus rod (0.5 × 2.0 µm)',
    peak: '520 - 580 nm',
    peakWl: 545,
    pigment: 'Curli Fiber & Cellulose Matrix',
    clinicalRisk: 'Severe (Urinary Tract & Catheter Biofilms)',
    modelAccuracy: '94.2% Class Precision',
    colorHex: '#18C77A',
    colorThree: 0x18C77A,
    desc: 'Forms robust curli fiber and cellulose-rich biofilm structures that shield embedded bacterial colonies from antibiotic penetration and immune clearance.',
    spectralProfile: 'Broad optical reflectance resonance across 520 - 580 nm corresponding to curli amyloid fibers and dense extracellular matrix polymers.',
    benchmarkFilename: 'hyperspectral_sample_ecoli_b14.tif',
    points: [
      { wl: 400, r: 0.28 },
      { wl: 450, r: 0.38 },
      { wl: 500, r: 0.62 },
      { wl: 545, r: 0.94 }, // Peak
      { wl: 600, r: 0.72 },
      { wl: 650, r: 0.52 },
      { wl: 700, r: 0.45 },
      { wl: 750, r: 0.42 },
      { wl: 800, r: 0.38 },
      { wl: 900, r: 0.34 },
      { wl: 1000, r: 0.31 }
    ]
  },
  {
    id: 'saureus',
    name: 'Staphylococcus aureus',
    short: 'S. aureus',
    image: staphImg,
    gram: 'Gram-positive',
    morphology: 'Cocci clusters (0.8 - 1.0 µm)',
    peak: '450 - 510 nm',
    peakWl: 480,
    pigment: 'Staphyloxanthin Carotenoid',
    clinicalRisk: 'Critical (MRSA & Prosthetic Joint Infections)',
    modelAccuracy: '96.5% Class Precision',
    colorHex: '#48F5A3',
    colorThree: 0x48F5A3,
    desc: 'Produces golden staphyloxanthin carotenoid pigments acting as antioxidants, combined with polysaccharide intercellular adhesin (PIA) biofilm architecture.',
    spectralProfile: 'Sharp carotenoid absorbance double-peak between 450 nm and 510 nm providing an unmistakable optical bio-signature for deep learning extraction.',
    benchmarkFilename: 'hyperspectral_sample_saureus_c08.tiff',
    points: [
      { wl: 400, r: 0.42 },
      { wl: 450, r: 0.78 },
      { wl: 480, r: 0.96 }, // Peak
      { wl: 520, r: 0.68 },
      { wl: 580, r: 0.46 },
      { wl: 650, r: 0.38 },
      { wl: 720, r: 0.35 },
      { wl: 800, r: 0.32 },
      { wl: 900, r: 0.30 },
      { wl: 1000, r: 0.28 }
    ]
  },
  {
    id: 'paeruginosa',
    name: 'Pseudomonas aeruginosa',
    short: 'P. aeruginosa',
    image: pseudomonasImg,
    gram: 'Gram-negative',
    morphology: 'Flagellated rod (0.6 × 1.5 µm)',
    peak: '690 - 740 nm',
    peakWl: 715,
    pigment: 'Pyocyanin & Alginate Slime',
    clinicalRisk: 'Extreme (Cystic Fibrosis & Chronic Wounds)',
    modelAccuracy: '92.8% Class Precision',
    colorHex: '#20E08B',
    colorThree: 0x20E08B,
    desc: 'Secretes potent redox-active pyocyanin virulence pigments and thick alginate extracellular slime, forming impermeable biofilm barriers.',
    spectralProfile: 'Distinct optical absorbance band in the far-red spectrum (690 - 740 nm) produced by pyocyanin pigment optical transitions.',
    benchmarkFilename: 'hyperspectral_sample_paeruginosa_m02.tif',
    points: [
      { wl: 400, r: 0.32 },
      { wl: 480, r: 0.41 },
      { wl: 550, r: 0.48 },
      { wl: 620, r: 0.64 },
      { wl: 680, r: 0.88 },
      { wl: 715, r: 0.95 }, // Peak
      { wl: 780, r: 0.62 },
      { wl: 850, r: 0.44 },
      { wl: 920, r: 0.39 },
      { wl: 1000, r: 0.36 }
    ]
  },
  {
    id: 'kpneumoniae',
    name: 'Klebsiella pneumoniae',
    short: 'K. pneumoniae',
    image: klebsiellaImg,
    gram: 'Gram-negative',
    morphology: 'Encapsulated rod (0.5 × 1.2 µm)',
    peak: '560 - 620 nm',
    peakWl: 590,
    pigment: 'Capsular Polysaccharide Layer',
    clinicalRisk: 'Critical (Ventilator-Associated Pneumonia)',
    modelAccuracy: '91.4% Class Precision',
    colorHex: '#9BEFCE',
    colorThree: 0x9BEFCE,
    desc: 'Possesses a hypervirulent, thick polysaccharide capsule that impedes macrophage phagocytosis and generates specific multi-band reflectance dispersion.',
    spectralProfile: 'Complex spectral scatter across 560 - 620 nm with characteristic carbohydrate optical extinction peaks.',
    benchmarkFilename: 'hyperspectral_sample_kpneumoniae_k04.tif',
    points: [
      { wl: 400, r: 0.25 },
      { wl: 480, r: 0.45 },
      { wl: 540, r: 0.74 },
      { wl: 590, r: 0.92 }, // Peak
      { wl: 650, r: 0.68 },
      { wl: 720, r: 0.51 },
      { wl: 800, r: 0.42 },
      { wl: 900, r: 0.36 },
      { wl: 1000, r: 0.33 }
    ]
  },
  {
    id: 'efaecalis',
    name: 'Enterococcus faecalis',
    short: 'E. faecalis',
    image: faecalisImg,
    gram: 'Gram-positive',
    morphology: 'Cocci pairs & chains (0.6 - 1.2 µm)',
    peak: '490 - 540 nm',
    peakWl: 515,
    pigment: 'Enterococcal Matrix Polysaccharide',
    clinicalRisk: 'Severe (Endodontic & Nosocomial Sepsis)',
    modelAccuracy: '90.6% Class Precision',
    colorHex: '#18C77A',
    colorThree: 0x18C77A,
    desc: 'Forms persistent calcified biofilm matrices within dental root canals, heart valves, and surgical prosthetics, highly recalcitrant to disinfectants.',
    spectralProfile: 'Narrow-band absorbance peak at 490 - 540 nm reflecting high extracellular calcium binding and peptide matrix bonds.',
    benchmarkFilename: 'hyperspectral_sample_efaecalis_e01.tiff',
    points: [
      { wl: 400, r: 0.30 },
      { wl: 460, r: 0.55 },
      { wl: 515, r: 0.91 }, // Peak
      { wl: 560, r: 0.70 },
      { wl: 620, r: 0.52 },
      { wl: 700, r: 0.43 },
      { wl: 780, r: 0.37 },
      { wl: 860, r: 0.33 },
      { wl: 1000, r: 0.29 }
    ]
  },
  {
    id: 'calbicans',
    name: 'Candida albicans',
    short: 'C. albicans',
    image: candidaImg,
    gram: 'Fungal yeast',
    morphology: 'Dimorphic yeast & hyphae (4.0 - 6.0 µm)',
    peak: '600 - 660 nm',
    peakWl: 630,
    pigment: 'Mannan-Glucan Hyphal Mesh',
    clinicalRisk: 'High (Polymicrobial Device Biofilms)',
    modelAccuracy: '89.7% Class Precision',
    colorHex: '#48F5A3',
    colorThree: 0x48F5A3,
    desc: 'Dimorphic opportunistic fungal organism capable of transitioning between budding yeast and invasive hyphal meshworks within polymicrobial biofilms.',
    spectralProfile: 'Prominent fungal cell wall (beta-glucan / chitin) optical signature across 600 - 660 nm clearly separated from bacterial spectra.',
    benchmarkFilename: 'hyperspectral_sample_calbicans_f05.tiff',
    points: [
      { wl: 400, r: 0.22 },
      { wl: 470, r: 0.36 },
      { wl: 540, r: 0.58 },
      { wl: 600, r: 0.82 },
      { wl: 630, r: 0.93 }, // Peak
      { wl: 680, r: 0.77 },
      { wl: 750, r: 0.55 },
      { wl: 840, r: 0.44 },
      { wl: 920, r: 0.38 },
      { wl: 1000, r: 0.35 }
    ]
  }
];

export const BIOFILM_IMAGE_MAP = {
  'Candida albicans': candidaImg,
  'Enterococcus faecalis': faecalisImg,
  'Escherichia coli': ecoliImg,
  'Klebsiella pneumoniae': klebsiellaImg,
  'Pseudomonas aeruginosa': pseudomonasImg,
  'Staphylococcus aureus': staphImg,
  'C. albicans': candidaImg,
  'E. faecalis': faecalisImg,
  'E. coli': ecoliImg,
  'K. pneumoniae': klebsiellaImg,
  'P. aeruginosa': pseudomonasImg,
  'S. aureus': staphImg,
  calbicans: candidaImg,
  efaecalis: faecalisImg,
  ecoli: ecoliImg,
  kpneumoniae: klebsiellaImg,
  paeruginosa: pseudomonasImg,
  saureus: staphImg
};

export const getBiofilmByQuery = (query) => {
  if (!query) return BIOFILM_SPECIES[0];
  const q = String(query).toLowerCase().trim();
  const match = BIOFILM_SPECIES.find(
    (s) =>
      s.id === q ||
      s.name.toLowerCase().includes(q) ||
      s.short.toLowerCase().includes(q) ||
      q.includes(s.id) ||
      q.includes(s.short.toLowerCase())
  );
  return match || BIOFILM_SPECIES[0];
};

export const getBiofilmImage = (query) => {
  if (!query) return ecoliImg;
  if (BIOFILM_IMAGE_MAP[query]) return BIOFILM_IMAGE_MAP[query];
  const found = getBiofilmByQuery(query);
  return found ? found.image : ecoliImg;
};
