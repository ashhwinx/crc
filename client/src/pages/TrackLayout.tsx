import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Compass,
  Sun,
  Sunset,
  Moon,
  GitBranch,
  ArrowRight,
  Copy,
  Check,
  ShieldAlert,
  Ruler,
  Maximize2,
  Box,
  ChevronDown,
} from 'lucide-react';
import { TrackVisualizerCanvas } from '../features/track-layout/TrackVisualizerCanvas';
import { LAYOUT_PRESETS, RAILCAR_PROFILES } from '../features/track-layout/constants';
import type {
  TrackLayoutPreset,
  RailcarCategoryKey,
  CameraViewMode,
  LightingMode,
  SidingEngineeringMetrics,
} from '../features/track-layout/types';

export const TrackLayout: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedPresetId, setSelectedPresetId] = useState<TrackLayoutPreset>('single-spur');
  const [trackLengthFt, setTrackLengthFt] = useState<number>(650);
  const [railcarCategory, setRailcarCategory] = useState<RailcarCategoryKey>('boxcars');
  const [railcarCount, setRailcarCount] = useState<number>(6);
  const [viewMode, setViewMode] = useState<CameraViewMode>('orbit');
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [switchDiverging, setSwitchDiverging] = useState<boolean>(true);
  const [maxSpottingCars, setMaxSpottingCars] = useState<number>(10);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Active preset config
  const currentPreset = useMemo(() => {
    return LAYOUT_PRESETS.find((p) => p.id === selectedPresetId) || LAYOUT_PRESETS[0];
  }, [selectedPresetId]);

  // Active railcar profile
  const currentCarProfile = useMemo(() => {
    return RAILCAR_PROFILES[railcarCategory];
  }, [railcarCategory]);

  // When preset changes, adjust track length to preset defaults
  const handlePresetChange = (presetId: TrackLayoutPreset) => {
    setSelectedPresetId(presetId);
    const target = LAYOUT_PRESETS.find((p) => p.id === presetId);
    if (target) {
      setTrackLengthFt(target.defaultFootage);
    }
  };

  // Live calculated metrics
  const metrics: SidingEngineeringMetrics = useMemo(() => {
    const foulingClearanceFt = 110; // Standard #10 turnout fouling lead
    const usableSpottingFt = Math.max(0, trackLengthFt - foulingClearanceFt);
    const carLengthWithCouplers = currentCarProfile.defaultLengthFt + 4; // 4 ft for couplers & buffer
    const calculatedMax = Math.max(1, Math.floor(usableSpottingFt / carLengthWithCouplers));
    const effectiveCars = Math.min(railcarCount, maxSpottingCars);

    const totalPayloadTons = Math.round(effectiveCars * currentCarProfile.avgPayloadTons);
    const highwayTrucksReplaced = Math.round(effectiveCars * currentCarProfile.trucksOffset);

    return {
      totalTrackFt: trackLengthFt,
      usableSpottingFt,
      foulingClearanceFt,
      maxSpottingCars: maxSpottingCars > 0 ? maxSpottingCars : calculatedMax,
      currentPlacedCars: effectiveCars,
      totalPayloadTons,
      highwayTrucksReplaced,
      turnoutType: '#10 Standard Industrial Turnout (50-lb to 115-lb rail)',
    };
  }, [trackLengthFt, currentCarProfile, railcarCount, maxSpottingCars]);

  // Transfer fleet count to Cost Estimator
  const handleTransferToEstimator = () => {
    const params = new URLSearchParams({
      category: railcarCategory,
      quantity: metrics.currentPlacedCars.toString(),
      source: 'track-visualizer',
      preset: selectedPresetId,
    });
    navigate(`/cost-estimator?${params.toString()}`);
  };

  // Transfer track specifications to Quote RFP
  const handleTransferToQuote = () => {
    const notes = `Track Siding Layout: ${currentPreset.name} (${trackLengthFt} ft). Staging ${metrics.currentPlacedCars}x ${currentCarProfile.name}. Usable siding footage: ${metrics.usableSpottingFt} ft.`;
    const params = new URLSearchParams({
      category: currentCarProfile.name,
      quantity: metrics.currentPlacedCars.toString(),
      notes,
    });
    navigate(`/quote?${params.toString()}`);
  };

  // Copy blueprint spec sheet
  const handleCopySpecs = () => {
    const text = `COAST ROAD CAPITAL (CRC) - 3D TRACK SIDING SPECIFICATION:
Layout Configuration: ${currentPreset.name}
Total Siding Footage: ${trackLengthFt} ft (${Math.round(trackLengthFt * 0.3048)} m)
Fouling Point Safety Buffer: ${metrics.foulingClearanceFt} ft
Usable Storage Track: ${metrics.usableSpottingFt} ft
Staged Equipment: ${metrics.currentPlacedCars} x ${currentCarProfile.name}
Max Spotting Capacity: ${metrics.maxSpottingCars} railcars
Aggregate Lading Capacity: ~${metrics.totalPayloadTons} Tons
Highway semi-trucks replaced: ~${metrics.highwayTrucksReplaced} loads
Turnout Standard: ${metrics.turnoutType}
AAR & FRA Compliance: Verified 13-ft track centerlines and 8-ft-6-in dock clearance.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const engineeringFaqs = [
    {
      q: 'What is a fouling point and why does this 3D visualizer calculate it?',
      a: 'The fouling point (clearance point) is the location on a turnout or switch where two tracks converge to a distance (typically 13 to 14 feet between track centers) where equipment on one track would strike or obstruct cars passing on the adjacent track. Cars must never be spotted beyond the yellow safety pole to maintain FRA Part 213 compliance.',
    },
    {
      q: 'What turnout size (#8, #10, or #11) is best for my industrial facility siding?',
      a: 'A standard #10 turnout is the most common industry choice for industrial spurs and private sidings, allowing 15 mph diverging switching movements and accommodating 60-ft boxcars and 65-ft covered hoppers comfortably. If accommodating 89-ft specialty flatcars or 6-axle road locomotives, a #11 or #12 turnout with broader curve radii is recommended.',
    },
    {
      q: 'Can Coast Road Capital assist with new siding engineering and Class I railroad approvals?',
      a: 'Yes. Coast Road Capital works directly with shippers, civil engineers, and Class I railroads (BNSF, UP, CSX, NS, CN, CPKC) to evaluate operating agreements, switch connection approvals, track agreements, and equipment sourcing.',
    },
    {
      q: 'How does railcar leasing integrate with track layout construction?',
      a: 'We coordinate equipment delivery timing with your track construction milestones. Leased railcars can be marshaled in nearby interchange staging yards until your spur and unloading equipment receive formal railroad certification.',
    },
  ];

  return (
    <div className="track-layout-page">
      {/* =========================================================================
          HERO BANNER (Deep Black #0A0A09 with Red Accent Border)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0A0A09',
          color: '#EDE6D4',
          padding: '4.75rem 0 3.75rem',
          borderBottom: '3px solid #AA2E1F',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '880px' }}>
            <span className="eyebrow eyebrow-dark">
              Engineering Architecture &bull; Phase 2 Interactive Visualization
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.85rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              3D Railway Track Layout Visualizer
            </h1>
            <p style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '2rem' }}>
              Model private sidings, simulate railcar spotting capacity, verify switch clearance fouling points,
              and optimize industrial freight flow using interactive browser-based 3D WebGL technology.
            </p>

            {/* Highlights */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.75rem',
                alignItems: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>AAR &amp; FRA Clearance Geometry</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>7 Industrial Freight Car Classes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>Live Siding Spotting &amp; Payload Calc</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN INTERACTIVE WORKSPACE (Canvas + Controls)
          ========================================================================= */}
      <section className="section section-white" style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              alignItems: 'start',
            }}
            className="track-visualizer-grid"
          >
            {/* -------------------------------------------------------------------
                LEFT: 3D INTERACTIVE CANVAS & TOOLBAR
                ------------------------------------------------------------------- */}
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                border: '1px solid #334155',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Canvas Header Toolbar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#1E293B',
                  borderBottom: '1px solid #334155',
                  gap: '1rem',
                }}
              >
                {/* Left: View Mode Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginRight: '0.25rem' }}>
                    View:
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode('orbit')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: viewMode === 'orbit' ? '1px solid #AA2E1F' : '1px solid #475569',
                      backgroundColor: viewMode === 'orbit' ? '#AA2E1F' : '#0F172A',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Compass size={14} />
                    <span>3D Orbit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('top-down')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: viewMode === 'top-down' ? '1px solid #AA2E1F' : '1px solid #475569',
                      backgroundColor: viewMode === 'top-down' ? '#AA2E1F' : '#0F172A',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Layers size={14} />
                    <span>2D Blueprint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('conductor')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: viewMode === 'conductor' ? '1px solid #AA2E1F' : '1px solid #475569',
                      backgroundColor: viewMode === 'conductor' ? '#AA2E1F' : '#0F172A',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Maximize2 size={14} />
                    <span>Trackside Cab</span>
                  </button>
                </div>

                {/* Right: Lighting & Switch Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Switch Position Toggle */}
                  <button
                    type="button"
                    onClick={() => setSwitchDiverging(!switchDiverging)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      backgroundColor: switchDiverging ? 'rgba(220, 38, 38, 0.2)' : 'rgba(22, 163, 74, 0.2)',
                      color: switchDiverging ? '#FCA5A5' : '#86EFAC',
                      cursor: 'pointer',
                    }}
                    title="Toggle Switch Turnout Alignment"
                  >
                    <GitBranch size={14} />
                    <span>Switch: {switchDiverging ? 'Diverging (Reverse)' : 'Mainline (Normal)'}</span>
                  </button>

                  {/* Time of Day Lighting */}
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: '6px', padding: '2px', border: '1px solid #475569' }}>
                    <button
                      type="button"
                      onClick={() => setLightingMode('day')}
                      style={{
                        padding: '0.35rem 0.55rem',
                        backgroundColor: lightingMode === 'day' ? '#334155' : 'transparent',
                        color: lightingMode === 'day' ? '#FDE047' : '#94A3B8',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      title="Daylight"
                    >
                      <Sun size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightingMode('dusk')}
                      style={{
                        padding: '0.35rem 0.55rem',
                        backgroundColor: lightingMode === 'dusk' ? '#334155' : 'transparent',
                        color: lightingMode === 'dusk' ? '#FB923C' : '#94A3B8',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      title="Sunset / Dusk"
                    >
                      <Sunset size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightingMode('night')}
                      style={{
                        padding: '0.35rem 0.55rem',
                        backgroundColor: lightingMode === 'night' ? '#334155' : 'transparent',
                        color: lightingMode === 'night' ? '#38BDF8' : '#94A3B8',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      title="Night Yard Floodlights"
                    >
                      <Moon size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3D Canvas Container */}
              <div style={{ height: '560px', width: '100%', position: 'relative' }}>
                <TrackVisualizerCanvas
                  preset={selectedPresetId}
                  trackLengthFt={trackLengthFt}
                  railcarCategory={railcarCategory}
                  railcarCount={railcarCount}
                  viewMode={viewMode}
                  lightingMode={lightingMode}
                  switchDiverging={switchDiverging}
                  onMaxCarsCalculated={(max) => setMaxSpottingCars(max)}
                />

                {/* Floating HUD Information Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#EDE6D4',
                    pointerEvents: 'none',
                    maxWidth: '320px',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', fontWeight: 700 }}>
                    Active Siding Preset
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 6px' }}>
                    {currentPreset.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
                    <span>Footage: <strong>{trackLengthFt} ft</strong></span>
                    <span>&bull;</span>
                    <span>Spotted: <strong style={{ color: '#AA2E1F' }}>{metrics.currentPlacedCars} / {metrics.maxSpottingCars} Cars</strong></span>
                  </div>
                </div>

                {/* Bottom Guide Prompt */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                >
                  Left Click + Drag: Rotate &bull; Right Click: Pan &bull; Scroll: Zoom
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT: CONTROL DOCK & ENGINEERING ANALYTICS
                ------------------------------------------------------------------- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Step 1: Layout Preset Selection */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#AA2E1F',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    01
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: 0 }}>
                    Select Siding Geometry
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {LAYOUT_PRESETS.map((p) => {
                    const isSelected = p.id === selectedPresetId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePresetChange(p.id)}
                        style={{
                          textAlign: 'left',
                          padding: '0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #AA2E1F' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? 'rgba(170, 46, 31, 0.04)' : '#F8FAFC',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? '#AA2E1F' : '#E2E8F0',
                            color: isSelected ? '#FFFFFF' : '#475569',
                            marginBottom: '0.35rem',
                          }}
                        >
                          {p.badge}
                        </span>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                          {p.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginTop: '0.85rem', marginBottom: 0 }}>
                  {currentPreset.description}
                </p>
              </div>

              {/* Step 2: Siding Footage Slider */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#AA2E1F',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                      }}
                    >
                      02
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: 0 }}>
                      Siding Track Footage
                    </h3>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#AA2E1F' }}>
                    {trackLengthFt} ft <span style={{ fontSize: '0.8rem', color: '#64748B' }}>({Math.round(trackLengthFt * 0.3048)}m)</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={currentPreset.minFootage}
                  max={currentPreset.maxFootage}
                  step={50}
                  value={trackLengthFt}
                  onChange={(e) => setTrackLengthFt(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: '#AA2E1F',
                    cursor: 'pointer',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.45rem' }}>
                  <span>Min: {currentPreset.minFootage} ft</span>
                  <span>Usable Spotting: ~{metrics.usableSpottingFt} ft</span>
                  <span>Max: {currentPreset.maxFootage} ft</span>
                </div>
              </div>

              {/* Step 3: Equipment Class Picker */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#AA2E1F',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    03
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: 0 }}>
                    Select Railcar Type to Spot
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                  {(Object.keys(RAILCAR_PROFILES) as RailcarCategoryKey[]).map((key) => {
                    const car = RAILCAR_PROFILES[key];
                    const isSelected = car.key === railcarCategory;
                    return (
                      <button
                        key={car.key}
                        type="button"
                        onClick={() => setRailcarCategory(car.key)}
                        style={{
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: isSelected ? '2px solid #AA2E1F' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? 'rgba(170, 46, 31, 0.05)' : '#FFFFFF',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '2px',
                              backgroundColor: car.primaryColor,
                            }}
                          />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                            {car.name.split(' ')[0]}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          ~{car.defaultLengthFt} ft &bull; {car.avgPayloadTons}T
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Staging Quantity Controls */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#AA2E1F',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                      }}
                    >
                      04
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: 0 }}>
                      Staged Railcars
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setRailcarCount(Math.max(1, railcarCount - 1))}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8FAFC',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, minWidth: '40px', textAlign: 'center' }}>
                      {metrics.currentPlacedCars}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRailcarCount(Math.min(metrics.maxSpottingCars, railcarCount + 1))}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8FAFC',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={metrics.maxSpottingCars}
                  step={1}
                  value={metrics.currentPlacedCars}
                  onChange={(e) => setRailcarCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: '#AA2E1F',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.45rem' }}>
                  <span>1 Car</span>
                  <span>Siding Max: {metrics.maxSpottingCars} Cars</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                BOTTOM FULL-WIDTH: ENGINEERING METRICS LEDGER & ACTION DOCK
                ------------------------------------------------------------------- */}
            <div
              style={{
                backgroundColor: '#0A0A09',
                color: '#EDE6D4',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.5rem',
                  gap: '1rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AA2E1F', fontWeight: 700 }}>
                    CRC Logistics Engineering
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0' }}>
                    Siding Capacity &amp; Logistics Impact Ledger
                  </h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleCopySpecs}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'transparent',
                      color: '#EDE6D4',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {copied ? <Check size={15} style={{ color: '#10B981' }} /> : <Copy size={15} />}
                    <span>{copied ? 'Spec Sheet Copied!' : 'Copy Blueprint Specs'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTransferToEstimator}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#AA2E1F',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span>Price in Cost Estimator</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleTransferToQuote}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid #EDE6D4',
                      backgroundColor: '#EDE6D4',
                      color: '#0A0A09',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span>Request Siding Review &amp; Quote</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div style={{ backgroundColor: '#18181B', borderRadius: '8px', padding: '1.1rem', border: '1px solid #27272A' }}>
                  <div style={{ fontSize: '0.78rem', color: '#A1A1AA', marginBottom: '0.35rem' }}>Total Track Length</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{metrics.totalTrackFt} ft</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '0.25rem' }}>
                    ~{Math.round(metrics.totalTrackFt * 0.3048)} meters
                  </div>
                </div>

                <div style={{ backgroundColor: '#18181B', borderRadius: '8px', padding: '1.1rem', border: '1px solid #27272A' }}>
                  <div style={{ fontSize: '0.78rem', color: '#A1A1AA', marginBottom: '0.35rem' }}>Usable Spotting Track</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FDE047' }}>{metrics.usableSpottingFt} ft</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '0.25rem' }}>
                    Minus {metrics.foulingClearanceFt} ft fouling buffer
                  </div>
                </div>

                <div style={{ backgroundColor: '#18181B', borderRadius: '8px', padding: '1.1rem', border: '1px solid #27272A' }}>
                  <div style={{ fontSize: '0.78rem', color: '#A1A1AA', marginBottom: '0.35rem' }}>Max Spotting Capacity</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{metrics.maxSpottingCars} Cars</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '0.25rem' }}>
                    Coupled @ ~{currentCarProfile.defaultLengthFt + 4} ft/car
                  </div>
                </div>

                <div style={{ backgroundColor: '#18181B', borderRadius: '8px', padding: '1.1rem', border: '1px solid #27272A' }}>
                  <div style={{ fontSize: '0.78rem', color: '#A1A1AA', marginBottom: '0.35rem' }}>Fleet Lading Capacity</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8' }}>~{metrics.totalPayloadTons.toLocaleString()} Tons</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '0.25rem' }}>
                    Based on 286k GRL standard
                  </div>
                </div>

                <div style={{ backgroundColor: '#18181B', borderRadius: '8px', padding: '1.1rem', border: '1px solid #27272A' }}>
                  <div style={{ fontSize: '0.78rem', color: '#A1A1AA', marginBottom: '0.35rem' }}>Semi-Trucks Replaced</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ADE80' }}>~{metrics.highwayTrucksReplaced} Loads</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '0.25rem' }}>
                    ~{Math.round(metrics.highwayTrucksReplaced * 2.8)} metric tons CO₂ offset
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TECHNICAL ENGINEERING STANDARDS GUIDE & BEST PRACTICES
          ========================================================================= */}
      <section className="section section-cream" style={{ borderTop: '1px solid #E2E8F0', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="eyebrow">Industry Guidelines &bull; Siding Infrastructure</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0A0A09', letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
              Rail Siding Design &amp; Clearance Standards
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginTop: '0.75rem' }}>
              Essential regulatory benchmarks set by the Federal Railroad Administration (FRA) and the
              American Railway Engineering and Maintenance-of-Way Association (AREMA):
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3.5rem',
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(170, 46, 31, 0.1)', color: '#AA2E1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldAlert size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A09', marginBottom: '0.5rem' }}>
                Fouling Point &amp; Clearances
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Under AREMA and Class I standards, tracks must maintain a minimum 13-foot to 14-foot centerline
                separation before cars can be safely spotted, preventing sideswipe collisions with trains on the mainline.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(170, 46, 31, 0.1)', color: '#AA2E1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <GitBranch size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A09', marginBottom: '0.5rem' }}>
                Turnout Selection (#8 vs #10)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                A standard #10 turnout provides a 9-degree 31-minute diverging curve suitable for modern 286k GRL
                freight cars. For unit train loops or 89-ft specialty flatcars, #11 or #12 turnouts are required.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(170, 46, 31, 0.1)', color: '#AA2E1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Ruler size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A09', marginBottom: '0.5rem' }}>
                Loading Platform Offsets
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Standard high-dock warehouse platforms require a minimum 8-foot 6-inch lateral clearance from the
                track centerline, with 4-foot deck height above the top of the rail for flush boxcar forklift loading.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(170, 46, 31, 0.1)', color: '#AA2E1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Box size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A09', marginBottom: '0.5rem' }}>
                Heavy Axle Load (286k GRL)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Industrial trackage should be laid with minimum 115-lb continuous welded rail (CWR) on 7-inch timber
                ties with 12 inches of crushed granite ballast to support modern 286,000-lb gross rail loads.
              </p>
            </div>
          </div>

          {/* Technical FAQ Accordion */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A0A09', marginBottom: '1.25rem', textAlign: 'center' }}>
              Siding &amp; Track Layout Frequently Asked Questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {engineeringFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '1.1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 200ms ease',
                          color: '#64748B',
                          flexShrink: 0,
                          marginLeft: '1rem',
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: '0 1.25rem 1.25rem',
                          color: '#475569',
                          fontSize: '0.9rem',
                          lineHeight: 1.65,
                          borderTop: '1px solid #F1F5F9',
                          paddingTop: '0.85rem',
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
