export interface CarSizeOption {
  name: string;
  capacity: string;
  multiplier: number;
  description: string;
  commonCargo: string;
}

export interface EquipmentEstimatorItem {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
  baseMonthlyNet: [number, number];      // [min, max] per car per month for Net Lease
  baseMonthlyFull: [number, number];     // [min, max] per car per month for Full-Service Lease
  avgPayloadTons: number;                // average payload tons per car
  truckloadEquivalent: number;           // ~3 to 4 trucks per car
  sizesAndCapacities: CarSizeOption[];
  industriesServed: {
    title: string;
    description: string;
    sectors: string[];
  };
  dischargeAndLoading: string;
  mechanicalProfile: string;
}

export const ESTIMATOR_EQUIPMENT_DATA: EquipmentEstimatorItem[] = [
  {
    id: 'boxcars',
    slug: 'boxcars',
    name: 'Boxcars',
    eyebrow: 'General Freight & Temperature-Controlled',
    image: '/images/category-boxcars.jpg',
    imageAlt: 'Standard and high-cube boxcar on railroad tracks',
    baseMonthlyNet: [475, 750],
    baseMonthlyFull: [650, 980],
    avgPayloadTons: 90,
    truckloadEquivalent: 3.5,
    sizesAndCapacities: [
      {
        name: '50-ft Standard',
        capacity: '5,200–5,300 cu ft | ~100-ton GRL',
        multiplier: 1.0,
        description: 'Standard cubic profile for packaged palletized goods, manufactured items, and warehouse transfers.',
        commonCargo: 'Canned food, packaged goods, paper cartons, consumer hardware',
      },
      {
        name: '50-ft High-Cube',
        capacity: '5,500–5,700 cu ft | Plate F clearance',
        multiplier: 1.06,
        description: 'Extra vertical height (approx 13 ft interior) allowing 2-tier pallet stacking and maximized volume.',
        commonCargo: 'Lightweight packaging, paper rolls, dry grocery items',
      },
      {
        name: '60-ft Standard',
        capacity: '6,200–6,400 cu ft | 286k GRL',
        multiplier: 1.12,
        description: 'Extended wheelbase for higher-density pallets, auto assemblies, and heavy roll paper.',
        commonCargo: 'Heavy kraft paper rolls, automotive stamping parts, machinery',
      },
      {
        name: '60-ft High-Cube',
        capacity: '7,300–7,500 cu ft | Maximum enclosed volume',
        multiplier: 1.18,
        description: 'Maximum enclosed capacity car built to Plate F/G dimensions for high-cube shippers.',
        commonCargo: 'Large-diameter roll paper, appliance distribution, auto parts',
      },
      {
        name: 'Insulated Boxcar',
        capacity: '4,800–5,600 cu ft | Thermal foam/fiber lining',
        multiplier: 1.25,
        description: 'Heavy insulation preventing internal temperature swings without active refrigeration motors.',
        commonCargo: 'Wine, beer, canned beverages, adhesives, candy, pharmaceuticals',
      },
      {
        name: 'Refrigerated Boxcar (Reefer)',
        capacity: '5,000–6,500 cu ft | Mechanical cryogenic/diesel unit',
        multiplier: 1.55,
        description: 'Equipped with active mechanical climate unit for sub-zero frozen and chilled food distributions.',
        commonCargo: 'Frozen meat & poultry, dairy products, fresh produce, frozen concentrates',
      },
    ],
    industriesServed: {
      title: 'Pulp & Paper, Consumer Packaging, Automotive & Food Processing',
      description: 'Boxcars serve manufacturing plants that ship weather-sensitive products on standard pallets or slip-sheets. Their enclosed steel structure safeguards lading against moisture, dirt, and road grime.',
      sectors: [
        'Forest Products & Kraft Paper Mills',
        'Food & Beverage Bottlers and Canners',
        'Automotive Assembly & Tier-1 Suppliers',
        'Consumer Packaged Goods (CPG)',
        'Building Insulation & Drywall Supplies',
      ],
    },
    dischargeAndLoading: 'Forklift-accessible side plug doors or sliding doors (10-ft to 16-ft wide openings); floor wood/steel decking with lading anchor tracks.',
    mechanicalProfile: 'AAR Plate C to Plate F clearance; cushioned underframes (10-inch to 15-inch end-of-car cushioning) to prevent cargo shifting.',
  },
  {
    id: 'covered-hoppers',
    slug: 'covered-hoppers',
    name: 'Covered Hoppers',
    eyebrow: 'Dry Bulk, Cement, Grain & Chemicals',
    image: '/images/category-covered-hoppers.jpg',
    imageAlt: 'Covered hopper railcars lined up at an industrial grain terminal',
    baseMonthlyNet: [520, 850],
    baseMonthlyFull: [700, 1150],
    avgPayloadTons: 105,
    truckloadEquivalent: 4.0,
    sizesAndCapacities: [
      {
        name: '3,230 cu ft Pressure Differential (PD)',
        capacity: '3,230 cu ft | High-pressure pneumatic discharge (14.7 psi)',
        multiplier: 1.35,
        description: 'Sealed tanks designed for fluidized pneumatic conveyance of ultra-fine, dense food-grade powders.',
        commonCargo: 'Bakery flour, corn starch, refined sugar, lime, titanium dioxide',
      },
      {
        name: '3,281 cu ft Cement / Mineral',
        capacity: '3,281 cu ft | 2-bay gravity/pneumatic | 286k GRL',
        multiplier: 1.05,
        description: 'High-density short-wheelbase hopper engineered specifically for heavy minerals with low cubic volume.',
        commonCargo: 'Portland cement, fly ash, heavy industrial sand, roofing granules',
      },
      {
        name: '4,359 cu ft Industrial',
        capacity: '4,359 cu ft | 3-bay gravity slide gates',
        multiplier: 1.0,
        description: 'Intermediate volume hopper designed for medium-density bulk minerals and agricultural dry inputs.',
        commonCargo: 'Frac sand, bentonite clay, soda ash, borax, specialty minerals',
      },
      {
        name: '4,650–4,750 cu ft',
        capacity: '4,650–4,750 cu ft | 3-bay curved or ribbed side',
        multiplier: 1.08,
        description: 'Versatile general bulk workhorse balanced for fertilizer and grain trade movements.',
        commonCargo: 'Dry potash, urea fertilizer, phosphate, feed ingredients',
      },
      {
        name: '5,161–5,400 cu ft Grain',
        capacity: '5,161–5,400 cu ft | High-capacity jumbo hopper | 286k GRL',
        multiplier: 1.15,
        description: 'The standard North American shuttle train car for cash grain merchants and river elevators.',
        commonCargo: 'Yellow corn, soybeans, hard red wheat, barley, sorghum',
      },
      {
        name: '5,660–5,850 cu ft Pneumatic Plastic Pellet',
        capacity: '5,660–5,850 cu ft | 4-bay stainless / epoxy-lined with sampling valves',
        multiplier: 1.3,
        description: 'Ultra-clean lined hopper with specialized stainless pneumatic vacuum outlets for zero-contamination polymer delivery.',
        commonCargo: 'Polyethylene (PE) pellets, polypropylene (PP), PET resin, PVC resin',
      },
      {
        name: '6,241–6,541 cu ft Large-Capacity',
        capacity: '6,241–6,541 cu ft | Lightweight bulk volume',
        multiplier: 1.28,
        description: 'Maximum cubic capacity covered hopper built for lightweight low-density agricultural byproducts.',
        commonCargo: 'Distillers dried grains with solubles (DDGS), corn gluten feed, malt',
      },
    ],
    industriesServed: {
      title: 'Agriculture, Concrete & Building Aggregates, Petrochemical Plastics & Mining',
      description: 'Covered hoppers safeguard free-flowing granular and powdered commodities against rain and atmospheric humidity, facilitating continuous pipeline or under-track pit discharge.',
      sectors: [
        'Commercial Grain Elevators & Feed Mills',
        'Plastics & Petrochemical Pellet Manufacturers',
        'Cement & Ready-Mix Building Contractors',
        'Chemical Fertilizer & Potash Distributors',
        'Industrial Mineral & Foundry Sand Processors',
      ],
    },
    dischargeAndLoading: 'Top circular hatches or full-length trough loading hatches; bottom rack-and-pinion gravity slide gates, pneumatic nozzle boxes, or differential pressure manifolds.',
    mechanicalProfile: '286,000 lbs Gross Rail Load capacity; epoxy internal linings or food-grade stainless contact surfaces available.',
  },
  {
    id: 'open-top-hoppers',
    slug: 'open-top-hoppers',
    name: 'Open-Top Hoppers',
    eyebrow: 'Aggregates, Coal & Rapid Discharge',
    image: '/images/category-open-top-hoppers.jpg',
    imageAlt: 'Open top hopper railcar carrying heavy stone aggregates',
    baseMonthlyNet: [450, 720],
    baseMonthlyFull: [620, 920],
    avgPayloadTons: 110,
    truckloadEquivalent: 4.2,
    sizesAndCapacities: [
      {
        name: '2,400 cu ft Compact Quarry',
        capacity: '2,400 cu ft | High-strength steel sides | 286k GRL',
        multiplier: 1.0,
        description: 'Built for the heaviest stone, dense ores, and ballast where weight limit is reached well before volume.',
        commonCargo: 'Granite ballast, iron ore pellets, crushed quartzite',
      },
      {
        name: '2,480 cu ft Rapid Discharge',
        capacity: '2,480 cu ft | Pneumatic longitudinal bottom doors',
        multiplier: 1.2,
        description: 'Equipped with automated bottom gates triggered by trackside sensors for continuous unlading while train rolls.',
        commonCargo: 'Railroad maintenance-of-way ballast, heavy limestone aggregate',
      },
      {
        name: '2,900 cu ft Aggregate',
        capacity: '2,900 cu ft | 3-pocket or 4-pocket manual gate',
        multiplier: 1.05,
        description: 'Standard North American construction aggregate and sand hopper for highway contractors.',
        commonCargo: 'Gravel, sand, crushed limestone, slag, building aggregates',
      },
      {
        name: '3,000–4,000 cu ft Bulk Coal / Coke',
        capacity: '3,000–4,000 cu ft | High-side aluminum or steel body',
        multiplier: 1.12,
        description: 'High-volume open hopper designed for medium-density carbon fuels and industrial minerals.',
        commonCargo: 'Thermal coal, metallurgical coal, petroleum coke, lignite',
      },
    ],
    industriesServed: {
      title: 'Quarrying & Mining, Railroad Infrastructure, Steelmaking & Utility Power',
      description: 'Open-top hoppers transport rugged, non-weather-sensitive bulk materials that can be quickly loaded from overhead bins or front-end loaders and dumped from the bottom.',
      sectors: [
        'Construction Quarries & Aggregate Producers',
        'Class I & Regional Railroad Maintenance-of-Way (MOW)',
        'Steel Mills & Coke Chemical Plants',
        'Electric Utilities & Industrial Boilers',
        'Mining Operations & Heavy Smelters',
      ],
    },
    dischargeAndLoading: 'Top open gravity loading; transverse manual slide gates or automated pneumatic rapid-dump doors for trestle/pit discharge.',
    mechanicalProfile: 'Heavy-gauge weathering steel or lightweight aluminum bodies; reinforced side stakes for extreme loading impacts.',
  },
  {
    id: 'gondolas',
    slug: 'gondolas',
    name: 'Gondolas',
    eyebrow: 'Steel Coils, Mill Products & Scrap',
    image: '/images/category-gondolas.jpg',
    imageAlt: 'Mill gondola car for steel and heavy industrial scrap',
    baseMonthlyNet: [480, 780],
    baseMonthlyFull: [660, 990],
    avgPayloadTons: 100,
    truckloadEquivalent: 3.8,
    sizesAndCapacities: [
      {
        name: '42-ft Coil Car',
        capacity: '42-ft length | Wood-lined cradles & locking hood covers',
        multiplier: 1.25,
        description: 'Equipped with transverse troughs and removable weather hoods for secure, damage-free transport of master steel coils.',
        commonCargo: 'Automotive sheet steel coils, galvanized rolls, tinplate coils',
      },
      {
        name: '52-ft Mill Gondola',
        capacity: '52-ft interior | Fixed sides (4 ft to 5 ft height)',
        multiplier: 1.0,
        description: 'The standard heavy mill car found in steel processing centers and scrap yards throughout the continent.',
        commonCargo: 'Structural beams, plate steel, cut rebar, heavy machinery parts, scrap',
      },
      {
        name: '65/66-ft Mill Gondola',
        capacity: '65/66-ft extended deck | Plate C clearance',
        multiplier: 1.15,
        description: 'Extended interior length built specifically for extra-long structural steel, drill casing, and continuous welded track rails.',
        commonCargo: 'Extra-long beams, oilfield pipe, rail track sections, long rebar bundles',
      },
      {
        name: 'High-Sided Scrap Gondola',
        capacity: '2,700–4,000 cu ft | 8-ft to 9-ft reinforced corrugated walls',
        multiplier: 1.1,
        description: 'Maximum volumetric capacity car designed for bulky, loose recyclables and lighter scrap metal.',
        commonCargo: 'Shredded automotive scrap, demolition debris, municipal solid waste, metal turnings',
      },
      {
        name: 'Rotary Dump Gondola',
        capacity: '2,400–3,800 cu ft | Rotary couplers on one/both ends',
        multiplier: 1.18,
        description: 'Equipped with rotating couplers allowing the entire car to be inverted inside rotary dumpers without uncoupling.',
        commonCargo: 'Unit-train scrap, coal, copper ore concentrates, heavy minerals',
      },
    ],
    industriesServed: {
      title: 'Steel Mills, Metal Recycling, Heavy Construction & Pipeline Fabrication',
      description: 'Gondolas provide an open flat-floor box for dense commodities that require top loading by overhead gantry cranes, electro-magnets, or grapple claws.',
      sectors: [
        'Electric Arc Furnace (EAF) Steel Producers',
        'Scrap Metal Recyclers & Shredder Operators',
        'Pipe Mills & Energy Tubular Goods Distributors',
        'Demolition Contractors & Waste Management',
        'Heavy Machinery & Heavy Casting Foundries',
      ],
    },
    dischargeAndLoading: 'Top loaded and unloaded via overhead magnet crane, excavator grapple, or inverted rotary car dumper.',
    mechanicalProfile: 'Solid steel floor decking (3/8-inch to 1/2-inch plate); reinforced top chord rails to withstand magnet and grapple impacts.',
  },
  {
    id: 'centerbeam-flatcars',
    slug: 'centerbeam-flatcars',
    name: 'Centerbeam Flatcars',
    eyebrow: 'Lumber & Engineered Wood Truss Cars',
    image: '/images/category-centerbeam.jpg',
    imageAlt: '73-ft centerbeam flatcar carrying dimensional wrapped lumber bundles',
    baseMonthlyNet: [560, 890],
    baseMonthlyFull: [740, 1120],
    avgPayloadTons: 100,
    truckloadEquivalent: 4.0,
    sizesAndCapacities: [
      {
        name: '65-ft Centerbeam',
        capacity: '65-ft deck length | ~100-ton capacity',
        multiplier: 0.95,
        description: 'Shorter wheelbase centerbeam ideal for secondary shortline curves and restricted facility sidings.',
        commonCargo: 'Plywood packs, OSB panels, short framing lumber',
      },
      {
        name: '73-ft Standard Centerbeam',
        capacity: '73-ft deck length | 286k GRL modern standard',
        multiplier: 1.0,
        description: 'The dominant North American car for moving dimensional building products from Pacific Northwest / Canadian mills.',
        commonCargo: '2x4, 2x6 framing lumber, OSB, structural panels, fencing packs',
      },
      {
        name: 'Riser-Deck Centerbeam',
        capacity: 'Inward-sloping floor bunks with integrated cable winches',
        multiplier: 1.04,
        description: 'Floor deck incorporates angled risers that lean bundled lumber inward toward the center I-beam truss for enhanced stability.',
        commonCargo: 'Finished wrapped dimensional lumber, studs, timber beams',
      },
      {
        name: 'Riserless-Deck Centerbeam',
        capacity: 'Completely flat flush deck floor',
        multiplier: 1.06,
        description: 'Flat deck configuration permitting flat-bottom cargo such as pallets of gypsum wallboard and long engineered joists.',
        commonCargo: 'Gypsum wallboard, drywall sheets, laminated veneer lumber (LVL), I-joists',
      },
    ],
    industriesServed: {
      title: 'Forest Products, Sawmills, Building Material Distributors & Drywall Plants',
      description: 'Centerbeams allow ground forklifts to unload both sides of the car simultaneously, reducing car turnaround times from hours to under 30 minutes at lumber distribution yards.',
      sectors: [
        'Pacific Northwest & Canadian Sawmills',
        'Wholesale Building Material Supply Centers',
        'Engineered Wood & Truss Fabricators',
        'Gypsum Board & Drywall Manufacturers',
        'Large-Format Home Improvement Distribution Hubs',
      ],
    },
    dischargeAndLoading: 'Simultaneous forklift loading and unloading from ground on both sides; integrated cable winches with tension ratchets.',
    mechanicalProfile: 'Heavy center partition steel truss; AAR Plate C/Plate F clearances; tie-down strap channels embedded along car sill.',
  },
  {
    id: 'bulkhead-flatcars',
    slug: 'bulkhead-flatcars',
    name: 'General-Purpose & Bulkhead Flatcars',
    eyebrow: 'Structural Steel, Pipe & Heavy Machinery',
    image: '/images/category-bulkhead.jpg',
    imageAlt: '60ft bulkhead flatcar with structural steel beams',
    baseMonthlyNet: [540, 880],
    baseMonthlyFull: [720, 1140],
    avgPayloadTons: 100,
    truckloadEquivalent: 3.8,
    sizesAndCapacities: [
      {
        name: '50-ft Bulkhead',
        capacity: '50-ft deck | Reinforced vertical end walls',
        multiplier: 0.95,
        description: 'Compact bulkhead flatcar suited for dense structural products and regional short-distance transfers.',
        commonCargo: 'Cut structural steel, highway crash barriers, treated utility poles',
      },
      {
        name: '60-ft Bulkhead',
        capacity: '60-ft deck length | ~100-ton capacity',
        multiplier: 1.0,
        description: 'Industry-standard general bulkhead flatcar for structural plate, steel beams, and railroad ties.',
        commonCargo: 'Steel plate, structural beams, railroad crossties, rebar',
      },
      {
        name: '62-ft Bulkhead',
        capacity: '62-ft deck length | High bulkheads (8 ft to 10 ft)',
        multiplier: 1.04,
        description: 'Optimized length for bundled pipe lengths, building supplies, and utility wood poles.',
        commonCargo: 'Steel line pipe, oilfield tubing, electrical utility poles, drywall',
      },
      {
        name: '60-ft General-Purpose Flat',
        capacity: '60-ft open flush wood or steel deck (no end bulkheads)',
        multiplier: 0.98,
        description: 'Open flatcar without vertical ends, enabling end-ramp roll-on/roll-off loading or side crane lifting.',
        commonCargo: 'Heavy farm machinery, excavators, tracked construction vehicles, steel plate',
      },
      {
        name: '89-ft Specialty Flatcar',
        capacity: '89-ft extra-long deck | High-load capacity',
        multiplier: 1.25,
        description: 'Extra-long flush deck flatcar built for long oversized steel beams, military convoys, and aerospace equipment.',
        commonCargo: 'Oversized bridge girders, military Humvees & armor, wind turbine blades',
      },
      {
        name: 'Heavy-Duty Flatcar (Depressed Center / Multi-Axle)',
        capacity: '125-ton to 250+ ton capacity | 4-axle to 8-axle trucks',
        multiplier: 1.75,
        description: 'Heavy specialized car with low center deck to transport super-heavy electrical transformers and industrial turbines.',
        commonCargo: 'Electrical substation transformers, turbine rotors, reactor vessels',
      },
    ],
    industriesServed: {
      title: 'Heavy Construction, Power Infrastructure, Energy Pipelines & Military Defense',
      description: 'Flatcars carry bulky, dimensional, or extra-heavy loads that exceed the physical dimensional envelope of standard enclosed boxcars or gondola walls.',
      sectors: [
        'Oil & Gas Linepipe & Tubular Sourcing',
        'Electric Utility Grid & Power Transformer Plants',
        'Highway Bridge & Structural Steel Erectors',
        'Heavy Equipment & Crane Manufacturers',
        'Department of Defense (DOD) Logistics',
      ],
    },
    dischargeAndLoading: 'Overhead crane rigging, heavy container forklift, or drive-on/drive-off ramps; chain tie-down channels and stake pockets.',
    mechanicalProfile: 'Heavy-duty steel center sills; composite or steel decking; vertical bulkheads designed to withstand 50,000 lbs shifting lading forces.',
  },
  {
    id: 'tank-cars',
    slug: 'tank-cars',
    name: 'Tank Cars',
    eyebrow: 'Liquids, Compressed Gases & Biofuels',
    image: '/images/category-tank-cars.jpg',
    imageAlt: 'Modern DOT-117 steel tank car at a chemical storage terminal',
    baseMonthlyNet: [680, 1150],
    baseMonthlyFull: [880, 1480],
    avgPayloadTons: 110,
    truckloadEquivalent: 3.5,
    sizesAndCapacities: [
      {
        name: '13,000–19,000 Gallon Short Barrel',
        capacity: '13,000–19,000 gallons | High-density liquid car',
        multiplier: 1.05,
        description: 'Short heavy-gauge barrel designed for very dense liquids where weight limit is reached before tank volume.',
        commonCargo: 'Sulfuric acid, hydrochloric acid, molten sulfur, caustic soda, clay slurry',
      },
      {
        name: '20,000–25,000 Gallon Mid-Capacity',
        capacity: '20,000–25,000 gallons | General chemical & fertilizer service',
        multiplier: 1.0,
        description: 'Versatile liquid transport car utilized widely across chemical plants and agricultural fertilizer distribution hubs.',
        commonCargo: 'Liquid fertilizer (UAN), industrial solvents, asphalt, lubricating oils',
      },
      {
        name: '25,000–30,000+ Gallon Jumbo Barrel',
        capacity: '25,000–31,800 gallons | DOT-117 modern safety specification',
        multiplier: 1.15,
        description: 'Large-volume cylindrical tank engineered for light-density flammable fuels, ethanol, and food-grade liquids.',
        commonCargo: 'Renewable ethanol, biodiesel, crude distillates, soybean oil, corn syrup',
      },
      {
        name: 'Insulated Configurations',
        capacity: 'Thermal jacket + exterior steam heating coils',
        multiplier: 1.18,
        description: 'Encased in mineral wool or fiberglass insulation with steam coils to heat and liquefy thick viscous commodities at receiving points.',
        commonCargo: 'Asphalt binder, heavy fuel oil, molten pitch, edible tallow, chocolate liquor',
      },
      {
        name: 'Non-Insulated Configurations',
        capacity: 'Standard bare carbon steel or stainless shell',
        multiplier: 0.95,
        description: 'Single-wall uninsulated shell for liquids that remain fluid at standard ambient temperatures.',
        commonCargo: 'Fuel ethanol, diesel, agricultural fertilizer, water chemicals',
      },
      {
        name: 'Pressure Configurations (DOT-105 / 112 / 114)',
        capacity: '300–500 psig test pressure | Full head shields & thermal protection',
        multiplier: 1.45,
        description: 'Thick high-pressure steel vessels with specialized top valves inside protective housings for liquefied pressurized gases.',
        commonCargo: 'Propane / LPG, anhydrous ammonia, chlorine, compressed refrigerants',
      },
      {
        name: 'Non-Pressure General Service (DOT-111 / 117)',
        capacity: '60–100 psig test pressure | Standard liquid service',
        multiplier: 1.0,
        description: 'The standard North American fleet specification for non-hazardous and low-pressure hazardous liquid commodities.',
        commonCargo: 'Biofuels, vegetable oils, base oils, chemical intermediates',
      },
    ],
    industriesServed: {
      title: 'Petrochemicals, Biofuels, Agricultural Fertilizers, Industrial Chemicals & Edible Oils',
      description: 'Tank cars provide safe bulk liquid transportation, replacing between 3 and 4 highway liquid tanker trucks per single rail movement.',
      sectors: [
        'Ethanol & Renewable Fuel Distilleries',
        'Liquid Nitrogen & Potash Fertilizer Terminals',
        'Gulf Coast Petrochemical & Solvent Producers',
        'Food Processing (Edible Oils, Corn Syrup, Tallow)',
        'Refined Petroleum & Lubricant Blenders',
      ],
    },
    dischargeAndLoading: 'Top hinged manway loading with safety platforms; bottom outlet valves (where commodity permits) or top eduction siphon pipe discharge; exterior steam heating coils.',
    mechanicalProfile: 'DOT-117 compliance (9/16-inch steel tank shell, full-height 1/2-inch head shields, thermal protection jacket, and top fittings protection).',
  },
];

export const LEASE_TERM_OPTIONS = [
  { id: 'short', name: 'Short-Term / Surge (3–12 Mos)', factor: 1.12, note: 'Higher monthly rate for seasonal peaks or bridge capacity' },
  { id: 'medium', name: 'Medium-Term (1–3 Years)', factor: 1.0, note: 'Standard commercial leasing market baseline' },
  { id: 'long', name: 'Long-Term (3–5+ Years)', factor: 0.9, note: 'Discounted monthly rate for multi-year capital commitment' },
];

export const INTERCHANGE_REGIONS = [
  { id: 'gulf-coast', name: 'Gulf Coast / Houston Rail Hub (Class I Trunklines)', factor: 1.0 },
  { id: 'midwest', name: 'Midwest / Chicago Gateway', factor: 1.02 },
  { id: 'southeast', name: 'Southeast / Atlanta & Jacksonville Corridors', factor: 1.03 },
  { id: 'southwest-west', name: 'Southwest / Western Siding', factor: 1.05 },
  { id: 'pnw', name: 'Pacific Northwest Corridors', factor: 1.06 },
  { id: 'canada-border', name: 'Canada / Cross-Border Transits', factor: 1.08 },
];
