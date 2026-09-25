import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Medicine } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSymptomName(name: string): string {
  if (!name) return '';
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Cleans up raw CSV generic name prefixes like "Generic Name Adapalene..."
 */
export function cleanGenericName(raw: string | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/^Generic\s*Name\s*:?\s*/i, '')
    .replace(/^Salt\s*Composition\s*:?\s*/i, '')
    .trim();
}

/**
 * Robust check if a medicine requires prescription (Schedule H / Rx)
 * Handles "Rx required", "Yes", "Prescription Required", "Schedule H", "true" etc.
 */
export function isPrescriptionRequired(val: string | undefined | null): boolean {
  if (!val) return false;
  const s = val.toLowerCase().trim();
  if (s === 'no' || s === 'otc' || s === 'false' || s === 'general') return false;
  return s.includes('rx') || s.includes('yes') || s.includes('require') || s.includes('schedule') || s.includes('mandat') || s === 'true';
}

/**
 * Standardizes medicine price so every medicine displays as "MRP ₹<amount>"
 * Examples:
 *   "₹449.00" -> "MRP ₹449.00"
 *   "MRP ₹126.00" -> "MRP ₹126.00"
 *   "45.00" -> "MRP ₹45.00"
 *   "" -> "MRP Regulated"
 */
export function formatMedicinePrice(price: string | undefined | null): string {
  if (!price) return 'MRP Regulated';
  let p = price.trim();
  
  // Strip any existing "MRP", "Rs.", "₹", "INR" prefixes
  p = p.replace(/^MRP\s*:?\s*/i, '').replace(/^Rs\.?\s*/i, '').replace(/^INR\s*/i, '').replace(/^₹\s*/, '').trim();
  
  if (!p) return 'MRP Regulated';
  return `MRP ₹${p}`;
}

export interface DrugClinicalSummary {
  classification: string;
  keyHighlights: string[];
  indications: string[];
  compositionPoints: string[];
  mechanismSteps: string[];
  safetyAdvisories: string[];
}

/**
 * Derives structured, high-yield, bulleted clinical points from drug salt and category.
 * Includes exactly 5-6 core composition & pharmacological points for the composition tab.
 */
export function getDrugClinicalSummary(med: Medicine): DrugClinicalSummary {
  const generic = cleanGenericName(med.generic_name).toLowerCase();
  const category = (med.category_or_disease || '').toLowerCase();
  const name = (med.name || '').toLowerCase();
  const rawCleanGeneric = cleanGenericName(med.generic_name) || 'Standard API Formulation';

  // 1. DERMATOLOGICAL & ACNE GELS (e.g. Adapalene, Benzoyl Peroxide, Clindamycin)
  if (
    generic.includes('adapalene') ||
    generic.includes('benzoyl') ||
    generic.includes('tretinoin') ||
    name.includes('gel') ||
    category.includes('acne')
  ) {
    return {
      classification: 'Topical Retinoid & Antimicrobial Dermatological Agent',
      keyHighlights: [
        'Unclogs pores and prevents microcomedone formation under the skin surface.',
        'Reduces inflammatory acne breakouts and targets bacterial colonization.',
        'Apply a thin layer once daily at night on clean, completely dry skin.',
      ],
      indications: [
        'Treatment of Acne Vulgaris (papules, pustules, and comedones)',
        'Cellular turnover modulation and reduction of skin sebum congestion',
        'Prevention of new inflammatory acne lesions and post-acne blemishes',
      ],
      compositionPoints: [
        `Active Molecule (API): ${rawCleanGeneric}`,
        'Chemical Class: Synthetic Naphthoic Acid Retinoid + Organic Peroxide Oxidant',
        'Target Receptor: Selective Nuclear Retinoic Acid Receptors (RAR-β, RAR-γ) in skin keratinocytes',
        'Absorption Profile: Local epidermal retention with negligible systemic absorption (<0.02%)',
        'Metabolism & Clearance: Benzoyl peroxide is rapidly converted to non-toxic benzoic acid and cleared renally',
        'Excipient Matrix: Hydrophilic aqueous vehicle with disodium edetate and poloxamer stabilizers',
      ],
      mechanismSteps: [
        'Step 1: Normalizes follicular epithelial desquamation to prevent pore clogging.',
        'Step 2: Releases active oxygen free radicals that eliminate Cutibacterium acnes bacteria.',
        'Step 3: Exerts potent anti-inflammatory action on the superficial skin mantle.',
      ],
      safetyAdvisories: [
        'Use sunscreen during daytime as topical retinoids increase photosensitivity.',
        'Avoid contact with eyes, lips, mucous membranes, and broken skin.',
        'Mild peeling, dryness, or erythema may occur during initial weeks of use.',
      ],
    };
  }

  // 2. ANTIBIOTICS (e.g. Amoxicillin, Azithromycin, Ciprofloxacin, Doxycycline)
  if (
    generic.includes('amoxicillin') ||
    generic.includes('azithromycin') ||
    generic.includes('ciprofloxacin') ||
    generic.includes('cefixime') ||
    generic.includes('doxycycline') ||
    category.includes('antibiotic') ||
    category.includes('bacterial')
  ) {
    return {
      classification: 'Broad-Spectrum Antibacterial Agent',
      keyHighlights: [
        'Eradicates bacterial infections; completely ineffective against viral colds or flu.',
        'Must be taken for the full prescribed duration to prevent antimicrobial resistance.',
        'Available in oral tablets, capsules, and dry syrup suspensions.',
      ],
      indications: [
        'Upper & lower respiratory tract infections (Sinusitis, Bronchitis, Pneumonia)',
        'Ear, nose, and throat bacterial infections (Streptococcal Pharyngitis, Otitis Media)',
        'Skin, soft tissue, and urinary tract infections (UTIs)',
      ],
      compositionPoints: [
        `Active Molecule (API): ${rawCleanGeneric}`,
        'Pharmacological Class: Beta-Lactam / Macrolide / Fluoroquinolone Antimicrobial Class',
        'Target Receptor: Penicillin-Binding Proteins (PBPs) and bacterial 50S/30S ribosomal subunits',
        'Bioavailability: Rapid GI absorption reaching peak plasma concentration (Cmax) in 1 to 2 hours',
        'Metabolism & Excretion: Primarily cleared via active glomerular filtration and renal elimination',
        'Formulation Standard: Microcrystalline cellulose core with moisture-barrier film coating',
      ],
      mechanismSteps: [
        'Step 1: Binds selectively to penicillin-binding proteins (PBPs) or bacterial ribosomes.',
        'Step 2: Inhibits cell wall synthesis or disrupts vital bacterial protein formation.',
        'Step 3: Results in cell lysis and complete bacterial death without harming human cells.',
      ],
      safetyAdvisories: [
        'Complete the full course even if symptoms improve within 48 hours.',
        'May cause mild digestive upset; take with food or plenty of water.',
        'Report sudden skin rashes, wheezing, or facial swelling immediately.',
      ],
    };
  }

  // 3. ANALGESICS & ANTIPYRETICS (e.g. Paracetamol, Ibuprofen, Diclofenac)
  if (
    generic.includes('paracetamol') ||
    generic.includes('acetaminophen') ||
    generic.includes('ibuprofen') ||
    generic.includes('diclofenac') ||
    category.includes('fever') ||
    category.includes('pain')
  ) {
    return {
      classification: 'Analgesic & Antipyretic (Pain & Fever Modulator)',
      keyHighlights: [
        'Rapid symptomatic relief from mild-to-moderate body pain and acute fever.',
        'Acts directly on the heat-regulating center in the hypothalamus.',
        'Safe first-line therapy when taken strictly within standard recommended limits.',
      ],
      indications: [
        'Acute fever management across viral, flu, and post-vaccination episodes',
        'Headaches, migraines, toothaches, and post-procedure dental pain',
        'Muscle aches, joint stiffness, and menstrual cramps',
      ],
      compositionPoints: [
        `Active Molecule (API): ${rawCleanGeneric}`,
        'Chemical Class: Para-Aminophenol Derivative / Non-Steroidal Anti-Inflammatory (NSAID)',
        'Target Enzyme: Cyclooxygenase (COX-1, COX-2, COX-3) central peroxidase active sites',
        'Pharmacokinetics: High oral bioavailability (~88%) with rapid onset of analgesia within 30 minutes',
        'Metabolism & Elimination: Extensive hepatic glucuronidation (90%) and urinary excretion',
        'Excipients: Sodium starch glycolate disintegrant with magnesium stearate lubricant',
      ],
      mechanismSteps: [
        'Step 1: Inhibits cyclooxygenase (COX) enzyme synthesis in the central nervous system.',
        'Step 2: Blocks the production of pain-signaling chemical messengers (prostaglandins).',
        'Step 3: Resets the hypothalamic thermostat, inducing vasodilation & sweating to lower fever.',
      ],
      safetyAdvisories: [
        'Do not exceed 4,000 mg in 24 hours to prevent liver or renal toxicity.',
        'Avoid concurrent intake of multiple combination cold/cough products containing acetaminophen.',
        'Refrain from alcohol consumption while taking analgesics.',
      ],
    };
  }

  // 4. ANTIVIRALS (e.g. Oseltamivir, Acyclovir)
  if (
    generic.includes('oseltamivir') ||
    generic.includes('acyclovir') ||
    generic.includes('antiflu') ||
    category.includes('viral') ||
    category.includes('influenza')
  ) {
    return {
      classification: 'Targeted Antiviral Enzyme Inhibitor',
      keyHighlights: [
        'Shortens viral illness duration and reduces risk of severe secondary complications.',
        'Most efficacious when initiated within 24 to 48 hours of first symptom onset.',
        'Active against Influenza A and B viral strains.',
      ],
      indications: [
        'Treatment of uncomplicated acute influenza in patients symptomatic for ≤ 2 days',
        'Post-exposure antiviral prophylaxis following close contact with confirmed flu cases',
        'Reduction of severe viral pneumonia risk in vulnerable patient populations',
      ],
      compositionPoints: [
        `Active Molecule (API): ${rawCleanGeneric}`,
        'Chemical Class: Ethyl Ester Prodrug of Oseltamivir Carboxylate (Neuraminidase Inhibitor)',
        'Target Structure: Conserved catalytic active site of Influenza A & B viral neuraminidase',
        'Bioavailability: Readily absorbed from GI tract with ≥75% converted to active carboxylate metabolite',
        'Elimination Half-Life: 6 to 10 hours in adults with predominantly renal excretion (>99%)',
        'Formulation: Hard gelatin capsule shell with croscarmellose sodium and povidone binder',
      ],
      mechanismSteps: [
        'Step 1: Acts as a potent competitive inhibitor of the viral neuraminidase enzyme.',
        'Step 2: Prevents cleavage of sialic acid residues on host cell surfaces.',
        'Step 3: Traps newly formed viral particles inside infected cells, halting viral spread.',
      ],
      safetyAdvisories: [
        'Take with meals to significantly minimize potential nausea or stomach discomfort.',
        'Not a substitute for annual clinical flu vaccinations.',
        'Continue full 5-day therapy unless advised otherwise by your doctor.',
      ],
    };
  }

  // 5. GASTROINTESTINAL & ANTACIDS (e.g. Pantoprazole, Omeprazole, Rabeprazole)
  if (
    generic.includes('prazole') ||
    generic.includes('pantoprazole') ||
    generic.includes('omeprazole') ||
    category.includes('acidity') ||
    category.includes('gerd') ||
    category.includes('ulcer')
  ) {
    return {
      classification: 'Proton Pump Inhibitor (Gastric Acid Reducer)',
      keyHighlights: [
        'Provides potent, long-lasting suppression of basal and stimulated gastric acid.',
        'Facilitates rapid mucosal healing in erosive esophagitis and peptic ulcers.',
        'Best taken on an empty stomach 30–60 minutes prior to the first meal of the day.',
      ],
      indications: [
        'Gastroesophageal Reflux Disease (GERD) and chronic heartburn relief',
        'Healing and prevention of gastric, duodenal, and NSAID-induced peptic ulcers',
        'Adjunct therapy in Helicobacter pylori eradication regimens',
      ],
      compositionPoints: [
        `Active Molecule (API): ${rawCleanGeneric}`,
        'Chemical Class: Substituted Benzimidazole Proton Pump Inhibitor (PPI)',
        'Target Enzyme: H+/K+ ATPase Enzyme system on gastric parietal cell apical membranes',
        'Bioavailability: 77% oral bioavailability with enteric coating protecting against acid degradation',
        'Hepatic Metabolism: Extensively biotransformed via Cytochrome P450 (CYP2C19 and CYP3A4)',
        'Dosage Formulation: Enteric-coated tablet matrix preventing premature degradation in gastric juice',
      ],
      mechanismSteps: [
        'Step 1: Concentrates in the highly acidic canaliculi of gastric parietal cells.',
        'Step 2: Irreversibly binds and inhibits the H+/K+ ATPase enzyme (proton pump).',
        'Step 3: Blocks the final step of acid secretion, significantly elevating gastric pH.',
      ],
      safetyAdvisories: [
        'Swallow tablets whole; do not crush, split, or chew enteric-coated formulations.',
        'Long-term continuous use may require periodic monitoring of Vitamin B12 and Magnesium.',
        'Discuss duration of therapy with your physician; avoid unnecessary long-term dependency.',
      ],
    };
  }

  // 6. ANTIHISTAMINES (e.g. Cetirizine, Levocetirizine, Fexofenadine)
  if (
    generic.includes('cetirizine') ||
    generic.includes('fexofenadine') ||
    generic.includes('loratadine') ||
    category.includes('allergy') ||
    category.includes('rhinitis')
  ) {
    return {
      classification: 'Second-Generation Selective H1-Receptor Antagonist',
      keyHighlights: [
        'Rapid 24-hour relief from seasonal allergies, itching, sneezing, and watery eyes.',
        'Significantly lower sedative effects compared to older first-generation antihistamines.',
        'Non-drowsy formulation suitable for daytime use.',
      ],
      indications: [
        'Allergic rhinitis, seasonal hay fever, and dust mite hypersensitivity',
        'Chronic idiopathic urticaria (hives) and localized skin allergic reactions',
        'Relief of ocular allergic conjunctivitis (red, itchy, watery eyes)',
      ],
      compositionPoints: [
        `Active Molecule (API): ${rawCleanGeneric}`,
        'Chemical Class: Piperazine / Carboxylic Acid Derivative (Second-Generation H1 Blocker)',
        'Target Receptor: High-affinity competitive antagonist at peripheral histamine H1 receptors',
        'Pharmacokinetics: Rapid peak plasma concentration (Tmax: 1.0 hour) with negligible CNS penetration',
        'Elimination Profile: 70% eliminated unchanged via renal filtration with a 8.3-hour half-life',
        'Core Matrix: Lactose monohydrate, colloidal anhydrous silica, and hypromellose film coating',
      ],
      mechanismSteps: [
        'Step 1: Selectively blocks peripheral histamine H1 receptors on effector cells.',
        'Step 2: Prevents histamine from triggering vascular permeability and smooth muscle spasm.',
        'Step 3: Rapidly suppresses inflammation, mucus hypersecretion, and pruritus (itching).',
      ],
      safetyAdvisories: [
        'May cause mild drowsiness in sensitive individuals; exercise caution when driving.',
        'Avoid combining with sedatives, tranquilizers, or heavy alcohol.',
        'Take once daily with or without food as prescribed.',
      ],
    };
  }

  // 7. DEFAULT CLEAN PHARMACEUTICAL SUMMARY (5-6 points)
  return {
    classification: 'Verified Pharmaceutical Preparation',
    keyHighlights: [
      `Formulated with active salt: ${rawCleanGeneric}.`,
      `Indicated for therapeutic management of ${med.category_or_disease || 'targeted clinical conditions'}.`,
      'Subject to standard pharmacopeia quality assurance and licensed pharmacy dispensing.',
    ],
    indications: [
      `Symptomatic management of ${med.category_or_disease || 'prescribed indications'}`,
      'Maintenance and therapeutic stabilization as evaluated by a medical practitioner',
      'Targeted biochemical receptor modulation for optimized patient recovery',
    ],
    compositionPoints: [
      `Active Pharmaceutical Ingredient (API): ${rawCleanGeneric}`,
      'Pharmacological Classification: Regulated therapeutic chemical salt formulation',
      'Primary Target: Specific human cellular receptors, enzymes, or microbial target pathways',
      'Pharmacokinetic Absorption: Formulated for consistent gastrointestinal or topical bioavailability',
      'Metabolic Pathway: Standard physiological clearance via hepatic enzymes or renal excretion',
      'Manufacturing Standard: Formulated with certified pharmaceutical-grade excipients and stabilizers',
    ],
    mechanismSteps: [
      'Step 1: Active molecular salt is absorbed through standard pharmacokinetic pathways.',
      'Step 2: Binds specifically to cellular receptors or physiological targets.',
      'Step 3: Modulates biochemical signaling pathways to alleviate symptoms and restore homeostasis.',
    ],
    safetyAdvisories: [
      'Follow the exact dosing schedule provided by your licensed healthcare provider.',
      'Store in a cool, dry place away from direct sunlight and moisture.',
      'Inform your doctor of all concurrent medications to avoid drug-drug interactions.',
    ],
  };
}
