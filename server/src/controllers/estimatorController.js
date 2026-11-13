import { Estimate } from '../models/Estimate.js';
import { CmsContent } from '../models/CmsContent.js';
import { DEFAULT_CMS_CONTENT } from '../data/cmsDefaultData.js';
import mongoose from 'mongoose';

// Master canonical equipment benchmarks
const ESTIMATOR_BENCHMARKS = {
  boxcars: {
    name: 'Boxcars',
    baseNet: [475, 750],
    baseFull: [650, 980],
    avgPayloadTons: 90,
    truckloadRatio: 3.5,
    sizes: {
      '50-ft Standard': 1.0,
      '50-ft High-Cube': 1.06,
      '60-ft Standard': 1.12,
      '60-ft High-Cube': 1.18,
      'Insulated Boxcar': 1.25,
      'Refrigerated Boxcar (Reefer)': 1.55,
    },
  },
  'covered-hoppers': {
    name: 'Covered Hoppers',
    baseNet: [520, 850],
    baseFull: [710, 1100],
    avgPayloadTons: 100,
    truckloadRatio: 4.0,
    sizes: {
      '3,230–3,281 cu ft (Cement / Sand)': 1.0,
      '4,359 cu ft (Industrial / Minerals)': 1.07,
      '4,650–4,750 cu ft (Mid-Size Agris)': 1.12,
      '5,161–5,400 cu ft (Standard Grain)': 1.18,
      '5,660–5,850 cu ft (Pneumatic Plastics)': 1.28,
      '6,241–6,541 cu ft (Large Volume DDG)': 1.35,
    },
  },
  'open-top-hoppers': {
    name: 'Open-Top Hoppers',
    baseNet: [420, 680],
    baseFull: [590, 890],
    avgPayloadTons: 105,
    truckloadRatio: 4.2,
    sizes: {
      '2,400 cu ft Standard': 1.0,
      '2,480 cu ft Rapid Discharge (Auto-Door)': 1.15,
      '2,900 cu ft Aggregate': 1.08,
      '3,000–4,000 cu ft Bulk Coal / Ore': 1.2,
    },
  },
  gondolas: {
    name: 'Gondolas',
    baseNet: [450, 720],
    baseFull: [620, 940],
    avgPayloadTons: 102,
    truckloadRatio: 4.0,
    sizes: {
      '42-ft Coil Car': 1.15,
      '52-ft Mill Gondola': 1.0,
      '65/66-ft Mill Gondola': 1.12,
      'High-Sided Gondola': 1.18,
      'Rotary Dump Gondola': 1.25,
    },
  },
  'centerbeam-flatcars': {
    name: 'Centerbeam Flatcars',
    baseNet: [490, 780],
    baseFull: [670, 990],
    avgPayloadTons: 98,
    truckloadRatio: 3.8,
    sizes: {
      '65-ft Centerbeam': 1.0,
      '73-ft Centerbeam': 1.09,
      'Riser-Deck Centerbeam': 1.14,
      'Riserless-Deck Centerbeam': 1.12,
    },
  },
  'bulkhead-flatcars': {
    name: 'General-Purpose & Bulkhead Flatcars',
    baseNet: [460, 740],
    baseFull: [630, 950],
    avgPayloadTons: 95,
    truckloadRatio: 3.7,
    sizes: {
      '50-ft Bulkhead': 1.0,
      '60-ft Bulkhead': 1.08,
      '62-ft Bulkhead': 1.12,
      '60-ft General-Purpose': 0.95,
      '89-ft Specialty Flatcar': 1.25,
      'Heavy-Duty Multi-Axle Flatcar': 1.6,
    },
  },
  'tank-cars': {
    name: 'Tank Cars',
    baseNet: [680, 1150],
    baseFull: [950, 1550],
    avgPayloadTons: 105,
    truckloadRatio: 4.0,
    sizes: {
      '13,000–19,000 Gallon Non-Pressure': 1.0,
      '20,000–25,000 Gallon General Purpose': 1.12,
      '25,000–30,000+ Gallon General': 1.22,
      'Insulated / Coiled Tank Car': 1.32,
      'DOT-112/114 Pressure Tank Car (LPG/Ammonia)': 1.5,
    },
  },
};

const TERM_FACTORS = {
  short: { name: '1-Year Short Term', factor: 1.08 },
  medium: { name: '3-Year Standard Commercial', factor: 1.0 },
  long: { name: '5-Year Dedicated Set', factor: 0.94 },
};

const REGION_FACTORS = {
  'gulf-coast': { name: 'Gulf Coast & Texas Petrochemical Corridor', factor: 1.0 },
  midwest: { name: 'Midwest Agricultural & Chicago Gateway', factor: 0.98 },
  'mid-atlantic': { name: 'Mid-Atlantic & Appalachian Corridor', factor: 1.02 },
  southeast: { name: 'Southeast Regional & Coastal Florida', factor: 1.01 },
  'west-coast': { name: 'West Coast / California Rail Terminals', factor: 1.06 },
  'pacific-nw': { name: 'Pacific Northwest Timber & Grain Ports', factor: 1.03 },
};

// In-memory fallback
const memoryEstimates = [];

function getVolumeDiscount(qty) {
  if (qty >= 50) return 0.90; // 10% discount
  if (qty >= 20) return 0.93; // 7% discount
  if (qty >= 10) return 0.96; // 4% discount
  if (qty >= 5) return 0.98;  // 2% discount
  return 1.0;
}

function generateEstimateId() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CRC-EST-${dateStr}-${rand}`;
}

export const calculateEstimate = async (req, res) => {
  try {
    const {
      categorySlug = 'boxcars',
      configurationName = '',
      leaseType = 'full',
      termId = 'medium',
      quantity = 5,
      regionId = 'gulf-coast',
    } = req.body;

    const qty = Math.max(1, Math.min(500, parseInt(quantity, 10) || 5));

    // Fetch dynamic CMS pricing configuration if available
    let cmsData = DEFAULT_CMS_CONTENT;
    if (mongoose.connection.readyState === 1) {
      try {
        const cmsDoc = await CmsContent.findOne({ key: 'main' }).lean();
        if (cmsDoc) {
          cmsData = { ...DEFAULT_CMS_CONTENT, ...cmsDoc };
        }
      } catch (cmsErr) {
        console.warn('[Estimator Calculate] CMS fetch fallback to defaults:', cmsErr?.message);
      }
    }

    const cat = ESTIMATOR_BENCHMARKS[categorySlug] || ESTIMATOR_BENCHMARKS['boxcars'];
    const cmsCat = cmsData.costEstimator?.categoryRates?.find((c) => c.id === categorySlug);

    const baseNet = cmsCat ? [Number(cmsCat.baseNetMin), Number(cmsCat.baseNetMax)] : cat.baseNet;
    const baseFull = cmsCat ? [Number(cmsCat.baseFullMin), Number(cmsCat.baseFullMax)] : cat.baseFull;
    const baseRange = leaseType === 'net' ? baseNet : baseFull;

    // Size multiplier
    let sizeMultiplier = 1.0;
    if (configurationName && cat.sizes[configurationName]) {
      sizeMultiplier = cat.sizes[configurationName];
    } else {
      // Find closest or default to first
      const keys = Object.keys(cat.sizes);
      sizeMultiplier = cat.sizes[keys[0]] || 1.0;
    }

    const cmsTerm = cmsData.costEstimator?.termFactors?.find((t) => t.id === termId);
    const term = cmsTerm ? { name: cmsTerm.name, factor: Number(cmsTerm.factor) } : (TERM_FACTORS[termId] || TERM_FACTORS['medium']);

    const cmsRegion = cmsData.costEstimator?.regionFactors?.find((r) => r.id === regionId);
    const region = cmsRegion ? { name: cmsRegion.name, factor: Number(cmsRegion.factor) } : (REGION_FACTORS[regionId] || REGION_FACTORS['gulf-coast']);

    // Dynamic volume discount calculation
    let volumeMultiplier = 1.0;
    if (cmsData.costEstimator?.volumeTiers && cmsData.costEstimator.volumeTiers.length > 0) {
      const sortedTiers = [...cmsData.costEstimator.volumeTiers].sort((a, b) => b.minQty - a.minQty);
      for (const tier of sortedTiers) {
        if (qty >= tier.minQty) {
          volumeMultiplier = 1 - (Number(tier.discountPercent) / 100);
          break;
        }
      }
    } else {
      volumeMultiplier = getVolumeDiscount(qty);
    }
    const volumeDiscountPct = Math.round((1 - volumeMultiplier) * 100);

    const minMonthlyPerCar = Math.round(baseRange[0] * sizeMultiplier * term.factor * region.factor * volumeMultiplier);
    const maxMonthlyPerCar = Math.round(baseRange[1] * sizeMultiplier * term.factor * region.factor * volumeMultiplier);

    const totalMinMonthly = minMonthlyPerCar * qty;
    const totalMaxMonthly = maxMonthlyPerCar * qty;

    const totalMinAnnual = totalMinMonthly * 12;
    const totalMaxAnnual = totalMaxMonthly * 12;

    const truckloadRatio = cmsCat?.truckloadEquivalent || cat.truckloadRatio;
    const avgPayloadTons = cmsCat?.avgPayloadTons || cat.avgPayloadTons;

    const trucksReplacedMin = Math.round(qty * (truckloadRatio - 0.5));
    const trucksReplacedMax = Math.round(qty * (truckloadRatio + 0.5));
    const totalPayloadTons = Math.round(qty * avgPayloadTons);

    return res.status(200).json({
      success: true,
      data: {
        category: cat.name,
        categorySlug,
        configuration: configurationName || Object.keys(cat.sizes)[0],
        leaseType: leaseType === 'net' ? 'Net Lease (Lessee Maintained)' : 'Full-Service Lease (Maintenance Included)',
        leaseTypeCode: leaseType,
        term: term.name,
        termId,
        region: region.name,
        regionId,
        quantity: qty,
        rates: {
          minMonthlyPerCar,
          maxMonthlyPerCar,
          totalMinMonthly,
          totalMaxMonthly,
          totalMinAnnual,
          totalMaxAnnual,
          volumeDiscountPct,
        },
        metrics: {
          trucksReplacedMin,
          trucksReplacedMax,
          totalPayloadTons,
        },
        calculatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('[Estimator Calculate Error]', err);
    return res.status(500).json({ success: false, error: 'Internal calculation error.' });
  }
};

export const saveEstimate = async (req, res) => {
  try {
    const {
      category,
      categorySlug,
      configuration,
      leaseType = 'full',
      termId = 'medium',
      termName = '3-Year Standard Commercial',
      quantity = 5,
      regionId = 'gulf-coast',
      regionName = 'Gulf Coast & Texas Petrochemical Corridor',
      rates,
      metrics,
      contactInfo = {},
      notes = '',
    } = req.body;

    if (!category || !configuration || !rates) {
      return res.status(400).json({ success: false, error: 'Missing required estimate payload fields.' });
    }

    const estimateReference = generateEstimateId();

    const recordData = {
      estimateReference,
      category,
      categorySlug: categorySlug || '',
      configuration,
      leaseType: ['full', 'net'].includes(leaseType) ? leaseType : 'full',
      termId,
      termName,
      quantity: Math.max(1, parseInt(quantity, 10) || 1),
      regionId,
      regionName,
      rates: {
        minMonthlyPerCar: rates.minMonthlyPerCar || 0,
        maxMonthlyPerCar: rates.maxMonthlyPerCar || 0,
        totalMinMonthly: rates.totalMinMonthly || 0,
        totalMaxMonthly: rates.totalMaxMonthly || 0,
        totalMinAnnual: rates.totalMinAnnual || 0,
        totalMaxAnnual: rates.totalMaxAnnual || 0,
        volumeDiscountPct: rates.volumeDiscountPct || 0,
      },
      metrics: {
        trucksReplacedMin: metrics?.trucksReplacedMin || 0,
        trucksReplacedMax: metrics?.trucksReplacedMax || 0,
        totalPayloadTons: metrics?.totalPayloadTons || 0,
      },
      contactInfo: {
        name: contactInfo.name || '',
        company: contactInfo.company || '',
        email: contactInfo.email ? contactInfo.email.trim().toLowerCase() : '',
        phone: contactInfo.phone || '',
      },
      notes: notes || '',
      status: 'active',
      source: 'web_estimator',
    };

    let saved = null;
    let storageMethod = 'mongodb';

    if (mongoose.connection.readyState === 1) {
      saved = await Estimate.create(recordData);
      console.log(`[CRC Estimator] Saved formal estimate: ${estimateReference} in MongoDB`);
    } else {
      recordData._id = 'mem_' + Date.now();
      recordData.createdAt = new Date();
      memoryEstimates.push(recordData);
      saved = recordData;
      storageMethod = 'memory_fallback';
      console.warn(`[CRC Estimator] MongoDB offline; saved estimate to memory buffer: ${estimateReference}`);
    }

    return res.status(201).json({
      success: true,
      message: 'Estimate saved successfully.',
      estimateReference,
      storageMethod,
      data: saved,
    });
  } catch (err) {
    console.error('[Estimator Save Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to persist estimate.' });
  }
};

export const getEstimateByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(400).json({ success: false, error: 'Reference ID is required.' });
    }

    let estimate = null;
    if (mongoose.connection.readyState === 1) {
      estimate = await Estimate.findOne({ estimateReference: reference });
    } else {
      estimate = memoryEstimates.find((e) => e.estimateReference === reference);
    }

    if (!estimate) {
      return res.status(404).json({ success: false, error: 'Estimate not found.' });
    }

    return res.status(200).json({
      success: true,
      data: estimate,
    });
  } catch (err) {
    console.error('[Estimator Fetch Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve estimate.' });
  }
};
