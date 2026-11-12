import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  MapPin,
  Upload,
  Send,
  CheckCircle2,
  Check,
  Copy,
  Trash2,
  RotateCcw,
  FileCheck,
} from 'lucide-react';
import {
  IconRoute,
  IconTruck,
  IconScale,
} from '@tabler/icons-react';
import { RAILCAR_PROFILES } from './constants';
import type { RailcarCategoryKey } from './types';
import { submitInquiry } from '../../services/api';

interface TrackPoint {
  x: number;
  y: number;
}

interface FacilityElement {
  id: string;
  type: 'switch' | 'dock' | 'conveyor';
  x: number;
  y: number;
  label: string;
}

interface LocationPreset {
  name: string;
  address: string;
  lat: number;
  lng: number;
  desc: string;
  defaultTrack: TrackPoint[];
}

const PRESET_LOCATIONS: LocationPreset[] = [
  {
    name: 'RDU Airport Runway Expansion Logistics Corridor',
    address: 'Morrisville, NC (35.8801, -78.7880)',
    lat: 35.8801,
    lng: -78.788,
    desc: 'Airport runway heavy ballast & crushed stone haulage terminal with CSX/NS interchange',
    defaultTrack: [
      { x: 120, y: 380 },
      { x: 260, y: 320 },
      { x: 440, y: 260 },
      { x: 620, y: 200 },
    ],
  },
  {
    name: 'Port of Tampa Bay Industrial Bulk Siding',
    address: '3730 Midtown Drive Area / Port Sutton, Tampa, FL (27.9045, -82.4180)',
    lat: 27.9045,
    lng: -82.418,
    desc: 'Deepwater phosphate, dry aggregate, and consumer packaging rail facility with direct CSX connection',
    defaultTrack: [
      { x: 100, y: 220 },
      { x: 300, y: 220 },
      { x: 520, y: 220 },
      { x: 700, y: 220 },
    ],
  },
  {
    name: 'Gulf Coast Petrochemical & Liquid Transfer Terminal',
    address: 'Houston Ship Channel, TX (29.7340, -95.1220)',
    lat: 29.734,
    lng: -95.122,
    desc: 'Heavy industrial chemical siding with multi-point rack transload and PTRA switching',
    defaultTrack: [
      { x: 140, y: 160 },
      { x: 280, y: 240 },
      { x: 480, y: 320 },
      { x: 640, y: 380 },
    ],
  },
  {
    name: 'Midwest Ag & Grain Processing Distribution Hub',
    address: 'Decatur, IL (39.8403, -88.9548)',
    lat: 39.8403,
    lng: -88.9548,
    desc: 'Covered hopper unit train loop and 60-ft high-cube boxcar staging spur',
    defaultTrack: [
      { x: 150, y: 400 },
      { x: 320, y: 320 },
      { x: 480, y: 240 },
      { x: 680, y: 150 },
    ],
  },
];

export const SatelliteSitePlanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active location and search state
  const [activeLocationIdx, setActiveLocationIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Drawing tool modes
  const [drawTool, setDrawTool] = useState<'track' | 'switch' | 'dock' | 'conveyor'>('track');
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>(
    PRESET_LOCATIONS[0].defaultTrack
  );
  const [facilityElements, setFacilityElements] = useState<FacilityElement[]>([
    { id: '1', type: 'switch', x: 120, y: 380, label: '#10 Turnout Point' },
    { id: '2', type: 'dock', x: 440, y: 260, label: 'Elevated Dock (180 ft)' },
  ]);

  // Operational planning configurations
  const [carType, setCarType] = useState<RailcarCategoryKey>('boxcars');
  const dockLengthFt = 180;
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedSpecs, setCopiedSpecs] = useState<boolean>(false);

  // Dad's Origin-to-Jobsite freight calculator tab
  const [showFreightCalc, setShowFreightCalc] = useState<boolean>(false);
  const [freightCommodity, setFreightCommodity] = useState<string>('Railroad Ballast & Aggregates');
  const [tonsPerLoad, setTonsPerLoad] = useState<number>(105);
  const [dailyLoads, setDailyLoads] = useState<number>(10);
  const [pickupCoords, setPickupCoords] = useState<string>('38.8776, -78.7875 (Quarry Siding)');
  const [deliveryCoords, setDeliveryCoords] = useState<string>('36.218, -78.4119 (RDU Jobsite)');
  const [projectDurationMonths, setProjectDurationMonths] = useState<number>(24);
  const [dieselPricePerGal, setDieselPricePerGal] = useState<number>(4.25);

  const activeProfile = useMemo(() => RAILCAR_PROFILES[carType], [carType]);

  // Calculate pixel to real-world feet scale (~1.5 feet per canvas pixel at standard zoom)
  const PIXEL_TO_FT = 1.35;

  // Calculate track length in linear feet
  const trackLengthFt = useMemo(() => {
    if (trackPoints.length < 2) return 0;
    let totalPixels = 0;
    for (let i = 0; i < trackPoints.length - 1; i++) {
      const dx = trackPoints[i + 1].x - trackPoints[i].x;
      const dy = trackPoints[i + 1].y - trackPoints[i].y;
      totalPixels += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.round(totalPixels * PIXEL_TO_FT);
  }, [trackPoints, PIXEL_TO_FT]);

  // Operational capacity calculations
  const foulingLeadFt = 110; // Standard #10 turnout safety fouling buffer
  const usableTrackFt = Math.max(0, trackLengthFt - foulingLeadFt);
  const carUnitFt = activeProfile.defaultLengthFt + 4; // car length + coupler buffer
  const maxCarsSpotted = Math.max(0, Math.floor(usableTrackFt / carUnitFt));
  const aggregatePayloadTons = Math.round(maxCarsSpotted * activeProfile.avgPayloadTons);
  const highwayTrucksReplaced = Math.round(maxCarsSpotted * activeProfile.trucksOffset);

  // Dad's multimodal corridor economics calculation
  const corridorAnalysis = useMemo(() => {
    const totalTonsDaily = dailyLoads * tonsPerLoad;
    const workingDays = Math.round(projectDurationMonths * 22);
    const totalTonsProject = totalTonsDaily * workingDays;

    // Rail + Transload + Final Mile Truck Drayage:
    // 1 railcar = ~105 tons = ~4.8 dump trucks (at ~22 tons each)
    const dumpTrucksRequired = Math.ceil(totalTonsDaily / 22);
    const railcarsRequiredDaily = Math.ceil(totalTonsDaily / 105);

    // Approximate multimodal cost: $28/ton rail line-haul + $8/ton transload handling + $14/ton short-haul jobsite truck drayage = $50/ton
    // All-Highway long-haul trucking: ~$82/ton (sensitive to diesel: +$4.50/ton per $1 diesel increase above $3.50)
    const dieselSurchargePerTon = Math.max(0, (dieselPricePerGal - 3.5) * 4.5);
    const costPerTonTrucking = 82 + dieselSurchargePerTon;
    const costPerTonMultimodal = 50 + Math.max(0, (dieselPricePerGal - 3.5) * 1.5);

    const totalProjectTruckCost = Math.round(totalTonsProject * costPerTonTrucking);
    const totalProjectRailCost = Math.round(totalTonsProject * costPerTonMultimodal);
    const totalProjectSavings = Math.max(0, totalProjectTruckCost - totalProjectRailCost);

    return {
      totalTonsDaily,
      totalTonsProject,
      dumpTrucksRequired,
      railcarsRequiredDaily,
      costPerTonTrucking,
      costPerTonMultimodal,
      totalProjectTruckCost,
      totalProjectRailCost,
      totalProjectSavings,
    };
  }, [dailyLoads, tonsPerLoad, projectDurationMonths, dieselPricePerGal]);

  // Handle location search or preset change
  const handleSelectPreset = (idx: number) => {
    setActiveLocationIdx(idx);
    setTrackPoints(PRESET_LOCATIONS[idx].defaultTrack);
    setFacilityElements([
      {
        id: '1',
        type: 'switch',
        x: PRESET_LOCATIONS[idx].defaultTrack[0].x,
        y: PRESET_LOCATIONS[idx].defaultTrack[0].y,
        label: '#10 Turnout',
      },
    ]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Center track on newly searched location
      setTrackPoints([
        { x: 150, y: 350 },
        { x: 350, y: 280 },
        { x: 550, y: 220 },
      ]);
    }, 450);
  };

  // Canvas click interaction for placing waypoints / switches / docks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (drawTool === 'track') {
      setTrackPoints((prev) => [...prev, { x, y }]);
    } else if (drawTool === 'switch') {
      const newElem: FacilityElement = {
        id: Date.now().toString(),
        type: 'switch',
        x,
        y,
        label: '#10 Industrial Turnout',
      };
      setFacilityElements((prev) => [...prev, newElem]);
    } else if (drawTool === 'dock') {
      const newElem: FacilityElement = {
        id: Date.now().toString(),
        type: 'dock',
        x,
        y,
        label: `Loading Dock (${dockLengthFt} ft)`,
      };
      setFacilityElements((prev) => [...prev, newElem]);
    } else if (drawTool === 'conveyor') {
      const newElem: FacilityElement = {
        id: Date.now().toString(),
        type: 'conveyor',
        x,
        y,
        label: 'Rapid Bottom Unloader',
      };
      setFacilityElements((prev) => [...prev, newElem]);
    }
  };

  // Canvas render loop: satellite aerial backdrop + real railroad track ties & rails
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw satellite imagery simulation with terrain & industrial ground texture
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, w, h);

    // Satellite terrain grid
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#1E293B');
    bgGradient.addColorStop(0.5, '#162235');
    bgGradient.addColorStop(1, '#0F172A');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Satellite ground parcel features (roads, warehouse rooftops, mainline track)
    ctx.fillStyle = 'rgba(51, 65, 85, 0.45)';
    ctx.fillRect(60, 40, 240, 160); // industrial building
    ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
    ctx.fillRect(480, 50, 280, 140); // adjacent warehouse

    // Building labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px sans-serif';
    ctx.fillText('FACILITY BUILDING A (WAREHOUSE)', 75, 70);
    ctx.fillText('MANUFACTURING PLANT B', 500, 80);

    // Active mainline railroad corridor (double track)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 440);
    ctx.lineTo(w, 440);
    ctx.moveTo(0, 452);
    ctx.lineTo(w, 452);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '10px monospace';
    ctx.fillText('CLASS I ACTIVE FREIGHT MAINLINE — 13-FT TRACK CENTERS', 15, 470);

    // 2. Draw proposed track siding if waypoints exist
    if (trackPoints.length >= 2) {
      // Draw ballast bed (wide gravel strip)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
      for (let i = 1; i < trackPoints.length; i++) {
        ctx.lineTo(trackPoints[i].x, trackPoints[i].y);
      }
      ctx.stroke();

      // Draw railroad crossties (hash marks along vector)
      for (let i = 0; i < trackPoints.length - 1; i++) {
        const p1 = trackPoints[i];
        const p2 = trackPoints[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(dist / 10);
        const perpX = (-dy / dist) * 7;
        const perpY = (dx / dist) * 7;

        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2.5;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const mx = p1.x + dx * t;
          const my = p1.y + dy * t;
          ctx.beginPath();
          ctx.moveTo(mx - perpX, my - perpY);
          ctx.lineTo(mx + perpX, my + perpY);
          ctx.stroke();
        }
      }

      // Draw steel rails (twin silver/red lines)
      ctx.strokeStyle = '#AA2E1F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
      for (let i = 1; i < trackPoints.length; i++) {
        ctx.lineTo(trackPoints[i].x, trackPoints[i].y);
      }
      ctx.stroke();

      // Draw track vertex nodes
      trackPoints.forEach((pt, idx) => {
        ctx.fillStyle = idx === 0 ? '#AA2E1F' : '#FFFFFF';
        ctx.strokeStyle = '#AA2E1F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, idx === 0 ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        if (idx === 0) {
          ctx.fillText('Point of Switch (PS)', pt.x + 8, pt.y - 8);
        } else if (idx === trackPoints.length - 1) {
          ctx.fillText(`Track End (${trackLengthFt} ft)`, pt.x + 8, pt.y - 8);
        }
      });
    }

    // 3. Draw facility elements (switches, docks, conveyors)
    facilityElements.forEach((elem) => {
      if (elem.type === 'switch') {
        // Yellow safety diamond & turnout icon
        ctx.fillStyle = '#EAB308';
        ctx.beginPath();
        ctx.arc(elem.x, elem.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(elem.label, elem.x + 12, elem.y + 4);
      } else if (elem.type === 'dock') {
        // Concrete loading platform block
        ctx.fillStyle = 'rgba(237, 230, 212, 0.85)';
        ctx.strokeStyle = '#AA2E1F';
        ctx.lineWidth = 1.5;
        ctx.fillRect(elem.x - 40, elem.y - 12, 80, 24);
        ctx.strokeRect(elem.x - 40, elem.y - 12, 80, 24);

        ctx.fillStyle = '#0A0A09';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(elem.label, elem.x - 36, elem.y + 4);
      } else if (elem.type === 'conveyor') {
        // Conveyor triangle
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.moveTo(elem.x, elem.y - 10);
        ctx.lineTo(elem.x + 10, elem.y + 10);
        ctx.lineTo(elem.x - 10, elem.y + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(elem.label, elem.x + 14, elem.y + 4);
      }
    });
  }, [trackPoints, facilityElements, trackLengthFt]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Export summary specification
  const handleCopySummary = () => {
    const loc = PRESET_LOCATIONS[activeLocationIdx];
    const text = [
      `COAST ROAD CAPITAL (CRC) — CONCEPTUAL RAIL SIDING SPECIFICATION`,
      `Facility Location: ${searchQuery || loc.name}`,
      `Address / Coordinates: ${loc.address}`,
      `Proposed Siding Trackage: ${trackLengthFt} linear feet`,
      `Fouling Safety Lead Buffer: ${foulingLeadFt} ft (#10 Industrial Turnout)`,
      `Usable Spotting Track: ${usableTrackFt} linear feet`,
      `Design Equipment Profile: ${activeProfile.name} (${activeProfile.defaultLengthFt} ft)`,
      `Spotting Capacity: ${maxCarsSpotted} railcars on spotted siding`,
      `Single-Switch Aggregate Payload: ~${aggregatePayloadTons} Tons`,
      `Highway Semi-Trucks Displaced: ~${highwayTrucksReplaced} truckloads per switch`,
      `Clearance Envelope: AAR Plate C / F Certified (13-ft centerline minimum)`,
      `*Conceptual layout subject to professional civil engineering review & railroad operating approval.`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2500);
  };

  // Submit project to CRC engineering desk
  const handleSubmitProject = async () => {
    setIsSubmitting(true);
    try {
      const loc = PRESET_LOCATIONS[activeLocationIdx];
      const payloadNotes = [
        `[Interactive Site Selection & Track Siding Submission]`,
        `• Location: ${searchQuery || loc.name} (${loc.address})`,
        `• Proposed Total Footage: ${trackLengthFt} ft (Usable: ${usableTrackFt} ft)`,
        `• Target Equipment: ${maxCarsSpotted}x ${activeProfile.name}`,
        `• Aggregate Payload: ~${aggregatePayloadTons} Tons (~${highwayTrucksReplaced} trucks displaced)`,
        `• Facility Elements: ${facilityElements.map((e) => e.label).join(', ')}`,
        `• Attached Site Docs: ${uploadedFiles.length ? uploadedFiles.join(', ') : 'None uploaded'}`,
        `• Project Notes: ${projectNotes || 'None'}`,
      ].join('\n');

      const res = await submitInquiry({
        name: 'Project Planner Inquiry',
        company: searchQuery || loc.name,
        email: 'planner@coastroadcapital.com',
        phone: '919-670-7979',
        category: 'Track Siding Layout Plan',
        message: payloadNotes,
      });

      if (res.success) {
        setSubmittedRef(res.referenceId || res.referenceNumber || 'CRC-SITE-PLAN');
      }
    } catch (e) {
      console.warn('Submission error', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="satellite-site-planner-root">
      {/* =========================================================================
          TOP SEARCH & LOCATION PRESET BAR
          ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px -1px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: '0 0 0.25rem 0' }}>
              Interactive Site Selection &amp; Satellite Track Layout Studio
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B' }}>
              Search any property address or GPS coordinates, draw proposed rail sidings over high-res satellite imagery, and estimate railcar capacity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFreightCalc(!showFreightCalc)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: showFreightCalc ? '#AA2E1F' : '#F8FAFC',
              color: showFreightCalc ? '#FFFFFF' : '#334155',
              border: showFreightCalc ? '1px solid #AA2E1F' : '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '0.5rem 0.85rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 160ms ease',
            }}
          >
            <IconScale size={16} />
            <span>{showFreightCalc ? 'Hide Corridor Economics' : 'Origin-to-Jobsite Economics'}</span>
          </button>
        </div>

        {/* Address / Coordinates Search Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.65rem', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter property address, industrial park name, or GPS coordinates (e.g. 38.8776, -78.7875)..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.35rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.90rem',
                color: '#0A0A09',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isSearching}>
            <MapPin size={15} />
            <span>{isSearching ? 'Locating Property...' : 'Locate Site'}</span>
          </button>
        </form>

        {/* Preset Logistics Corridor Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Corridors:
          </span>
          {PRESET_LOCATIONS.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: activeLocationIdx === idx ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                backgroundColor: activeLocationIdx === idx ? 'rgba(170, 46, 31, 0.08)' : '#F8FAFC',
                color: activeLocationIdx === idx ? '#AA2E1F' : '#334155',
                cursor: 'pointer',
                transition: 'all 140ms ease',
              }}
            >
              {loc.name.split(' ')[0]} {loc.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          DAD'S ORIGIN-TO-JOBSITE CORRIDOR FREIGHT CALCULATOR (Collapsible)
          ========================================================================= */}
      {showFreightCalc && (
        <div
          style={{
            backgroundColor: '#FAF9F7',
            border: '1px solid #EADBCC',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <IconTruck size={20} style={{ color: '#AA2E1F' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A09', margin: 0 }}>
              Origin-to-Jobsite Multimodal Freight Cost Comparison
            </h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
            Compare full-route economics: Rail line-haul + transload facility handling + final-mile truck drayage vs. 100% all-highway trucking.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Origin / Rail Siding GPS
              </label>
              <input
                type="text"
                value={pickupCoords}
                onChange={(e) => setPickupCoords(e.target.value)}
                placeholder="e.g. 38.8776, -78.7875"
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Delivery Destination / Jobsite GPS
              </label>
              <input
                type="text"
                value={deliveryCoords}
                onChange={(e) => setDeliveryCoords(e.target.value)}
                placeholder="e.g. 36.218, -78.4119"
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Commodity
              </label>
              <input
                type="text"
                value={freightCommodity}
                onChange={(e) => setFreightCommodity(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Tons Per Railcar Load
              </label>
              <input
                type="number"
                value={tonsPerLoad}
                onChange={(e) => setTonsPerLoad(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Daily Volume (Cars / Day)
              </label>
              <input
                type="number"
                value={dailyLoads}
                onChange={(e) => setDailyLoads(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Project Duration (Months)
              </label>
              <input
                type="number"
                value={projectDurationMonths}
                onChange={(e) => setProjectDurationMonths(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Diesel Price ($/gal sensitivity)
              </label>
              <input
                type="number"
                step="0.25"
                value={dieselPricePerGal}
                onChange={(e) => setDieselPricePerGal(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Economics Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Daily Highway Truck Equivalent</span>
              <strong style={{ fontSize: '1.25rem', color: '#0A0A09' }}>
                {corridorAnalysis.dumpTrucksRequired} Dump Trucks
              </strong>
              <span style={{ fontSize: '0.74rem', color: '#059669', display: 'block' }}>
                Replaced by {corridorAnalysis.railcarsRequiredDaily} railcars/day
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Estimated All-Highway Truck Cost</span>
              <strong style={{ fontSize: '1.25rem', color: '#DC2626' }}>
                ${(corridorAnalysis.totalProjectTruckCost / 1000000).toFixed(2)}M
              </strong>
              <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>
                ${corridorAnalysis.costPerTonTrucking.toFixed(2)} / ton aggregate
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Rail + Transload + Final Drayage</span>
              <strong style={{ fontSize: '1.25rem', color: '#059669' }}>
                ${(corridorAnalysis.totalProjectRailCost / 1000000).toFixed(2)}M
              </strong>
              <span style={{ fontSize: '0.74rem', color: '#059669', display: 'block' }}>
                ${corridorAnalysis.costPerTonMultimodal.toFixed(2)} / ton total route
              </span>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 700, display: 'block' }}>Projected Logistics Savings</span>
              <strong style={{ fontSize: '1.35rem', color: '#166534' }}>
                ${(corridorAnalysis.totalProjectSavings / 1000000).toFixed(2)}M Saved
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#166534', display: 'block' }}>
                Over {projectDurationMonths} months duration
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN STUDIO: SATELLITE CANVAS + TOOLBAR + CAPACITIES
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }} className="site-planner-grid">
        {/* LEFT COLUMN: INTERACTIVE SATELLITE MAP CANVAS */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Canvas Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: '#1E293B',
              borderBottom: '1px solid #334155',
              flexWrap: 'wrap',
              gap: '0.65rem',
            }}
          >
            {/* Draw Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setDrawTool('track')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: drawTool === 'track' ? '1px solid #AA2E1F' : '1px solid #475569',
                  backgroundColor: drawTool === 'track' ? '#AA2E1F' : '#0F172A',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <IconRoute size={14} />
                <span>Draw Track Spur</span>
              </button>

              <button
                type="button"
                onClick={() => setDrawTool('switch')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: drawTool === 'switch' ? '1px solid #AA2E1F' : '1px solid #475569',
                  backgroundColor: drawTool === 'switch' ? '#AA2E1F' : '#0F172A',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <span>Place Turnout</span>
              </button>

              <button
                type="button"
                onClick={() => setDrawTool('dock')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: drawTool === 'dock' ? '1px solid #AA2E1F' : '1px solid #475569',
                  backgroundColor: drawTool === 'dock' ? '#AA2E1F' : '#0F172A',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <span>Add Dock</span>
              </button>
            </div>

            {/* Clear / Reset Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setTrackPoints((prev) => prev.slice(0, -1))}
                disabled={trackPoints.length <= 1}
                style={{
                  padding: '0.35rem 0.55rem',
                  fontSize: '0.78rem',
                  borderRadius: '4px',
                  border: '1px solid #475569',
                  backgroundColor: '#0F172A',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                }}
                title="Undo last waypoint"
              >
                <RotateCcw size={13} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrackPoints([]);
                  setFacilityElements([]);
                }}
                style={{
                  padding: '0.35rem 0.55rem',
                  fontSize: '0.78rem',
                  borderRadius: '4px',
                  border: '1px solid #475569',
                  backgroundColor: '#0F172A',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                }}
                title="Clear canvas"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div style={{ position: 'relative', width: '100%', height: '480px', overflow: 'hidden' }}>
            <canvas
              ref={canvasRef}
              width={820}
              height={480}
              onClick={handleCanvasClick}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                cursor: drawTool === 'track' ? 'crosshair' : 'pointer',
              }}
            />

            {/* Canvas Instructions Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#E2E8F0',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                border: '1px solid #334155',
                backdropFilter: 'blur(4px)',
              }}
            >
              Mode: <strong>{drawTool.toUpperCase()}</strong> &bull; Click anywhere on the map to add points or facility markers
            </div>

            {/* Scale Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#E2E8F0',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <div style={{ width: '50px', height: '3px', backgroundColor: '#AA2E1F' }} />
              <span>~70 ft scale</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CAPACITY ENGINE & SPEC SHEET */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Spotting Capacity Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1.35rem',
              boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0A0A09', margin: '0 0 1rem 0' }}>
              Railcar Siding Capacity
            </h4>

            {/* Equipment Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Design Equipment Profile
              </label>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value as RailcarCategoryKey)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.65rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  fontSize: '0.86rem',
                  color: '#0A0A09',
                  backgroundColor: '#F8FAFC',
                }}
              >
                {Object.entries(RAILCAR_PROFILES).map(([k, p]) => (
                  <option key={k} value={k}>
                    {p.name} ({p.defaultLengthFt} ft &bull; {p.avgPayloadTons}t)
                  </option>
                ))}
              </select>
            </div>

            {/* Metrics Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Total Drawn Siding:</span>
                <strong style={{ color: '#0A0A09' }}>{trackLengthFt} ft</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Fouling Safety Buffer:</span>
                <span style={{ color: '#EAB308', fontWeight: 600 }}>-{foulingLeadFt} ft (#10 switch)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Usable Storage Track:</span>
                <strong style={{ color: '#0A0A09' }}>{usableTrackFt} ft</strong>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF9F7',
                  border: '1px solid #EADBCC',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  marginTop: '0.45rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.76rem', color: '#AA2E1F', fontWeight: 700, textTransform: 'uppercase' }}>
                    Max Spotted Fleet
                  </span>
                  <strong style={{ fontSize: '1.45rem', color: '#AA2E1F', fontWeight: 800 }}>
                    {maxCarsSpotted} {maxCarsSpotted === 1 ? 'Car' : 'Cars'}
                  </strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                  ~{aggregatePayloadTons} Tons aggregate &bull; Replaces {highwayTrucksReplaced} highway semi-trucks
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleCopySummary}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copiedSpecs ? <Check size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
                <span>{copiedSpecs ? 'Copied!' : 'Copy Specs'}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitProject}
                disabled={isSubmitting || trackLengthFt === 0}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Sending...' : 'Submit to CRC'}</span>
              </button>
            </div>
          </div>

          {/* Document Upload & Project Planning (Section 5D) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1.25rem',
              boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0A0A09', margin: '0 0 0.4rem 0' }}>
              Site Surveys &amp; Documents
            </h4>
            <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.80rem', color: '#64748B' }}>
              Attach civil engineering site plans, property boundaries, or aerial survey files.
            </p>

            {/* Mock Drag & Drop Upload Input */}
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #CBD5E1',
                borderRadius: '6px',
                padding: '1rem',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              <Upload size={18} style={{ color: '#AA2E1F', marginBottom: '0.35rem' }} />
              <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>Click to Upload Documents</span>
              <span style={{ fontSize: '0.70rem', color: '#94A3B8' }}>PDF, DWG, DXF, PNG up to 25MB</span>
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) {
                    const names = Array.from(e.target.files).map((f) => f.name);
                    setUploadedFiles((prev) => [...prev, ...names]);
                  }
                }}
              />
            </label>

            {uploadedFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.85rem' }}>
                {uploadedFiles.map((fn, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', color: '#334155' }}>
                    <FileCheck size={13} style={{ color: '#059669' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fn}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Project Notes Field */}
            <textarea
              rows={2}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              placeholder="Add project notes or specific loading clearance requirements..."
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                fontSize: '0.80rem',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Submission Confirmation Card */}
          {submittedRef && (
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#166534', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={16} />
                <strong style={{ fontSize: '0.90rem' }}>Project Transmitted</strong>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.78rem', color: '#166534' }}>
                Ref: <strong>{submittedRef}</strong> &bull; CRC civil engineers will review your trackage proposal.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .site-planner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
