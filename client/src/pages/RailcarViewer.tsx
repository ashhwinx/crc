import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Compass,
  Eye,
  Box,
  Layers,
  SlidersHorizontal,
  RotateCw,
  Play,
  Pause,
  FastForward,
  Maximize2,
  Minimize2,
  ArrowRight,
  ShieldCheck,
  Scale,
  Truck,
  ChevronDown,
} from 'lucide-react';

// ============================================================================
// DATA & TYPES (CRC AUTHENTIC EQUIPMENT CATALOG)
// ============================================================================

export interface CarType {
  id: string;
  slug: string;
  name: string;
  plural: string;
  mark: string;
  len: number;
  unit: 'tons' | 'gal';
  load: number;
  aarCode: string;
  specs: [string, string][];
}

const TYPES: CarType[] = [
  {
    id: 'boxcar',
    slug: 'boxcars',
    name: '50′ & 60′ Boxcar',
    plural: 'boxcars',
    mark: 'CLCX 1001',
    len: 16.6,
    unit: 'tons',
    load: 80,
    aarCode: 'AAR Class XM / XP',
    specs: [
      ['Interior Lengths', '50′ 6″ & 60′ 9″ Plate F'],
      ['Nominal Payload', '70 – 100 Tons'],
      ['Door Configuration', '10′ – 12′ Plug or Sliding'],
      ['Primary Commodity', 'Paper, pulp, auto parts & dry packaged goods'],
    ],
  },
  {
    id: 'covered-hopper',
    slug: 'covered-hoppers',
    name: 'Covered Hopper',
    plural: 'covered hoppers',
    mark: 'CLCX 2001',
    len: 18.0,
    unit: 'tons',
    load: 110,
    aarCode: 'AAR Class LO',
    specs: [
      ['Volumetric Capacity', '3,230 – 6,541 cu ft'],
      ['Discharge System', 'Gravity slide gates & pneumatic PD'],
      ['Roof Hatches', 'Continuous trough & round seal hatches'],
      ['Primary Commodity', 'Grain, corn, plastic pellets, cement & frac sand'],
    ],
  },
  {
    id: 'open-top-hopper',
    slug: 'open-top-hoppers',
    name: 'Open-Top Hopper',
    plural: 'open-top hoppers',
    mark: 'CLCX 3001',
    len: 16.0,
    unit: 'tons',
    load: 110,
    aarCode: 'AAR Class HT',
    specs: [
      ['Volumetric Capacity', '2,400 – 4,000 cu ft'],
      ['Discharge Gates', 'Manual bottom doors & rapid-discharge pneumatic'],
      ['Body Construction', 'All-welded high-tensile steel ribs'],
      ['Primary Commodity', 'Crushed stone, track ballast, coal & aggregates'],
    ],
  },
  {
    id: 'gondola',
    slug: 'gondolas',
    name: 'Mill Gondola',
    plural: 'gondolas',
    mark: 'CLCX 4001',
    len: 17.0,
    unit: 'tons',
    load: 100,
    aarCode: 'AAR Class GB / GT',
    specs: [
      ['Interior Lengths', '42′ – 66′ Mill Standard'],
      ['Loading Method', 'Overhead crane, grapple & magnetic hoist'],
      ['Coupler Assembly', 'Rotary dump or standard double-shelf'],
      ['Primary Commodity', 'Heavy scrap metal, steel coils, slab & plate'],
    ],
  },
  {
    id: 'centerbeam',
    slug: 'centerbeam-flatcars',
    name: '73′ Centerbeam Flatcar',
    plural: 'centerbeams',
    mark: 'CLCX 5001',
    len: 22.8,
    unit: 'tons',
    load: 90,
    aarCode: 'AAR Class FBC',
    specs: [
      ['Clear Deck Length', '73′ 0″ over strikers'],
      ['Center Partition', 'Full-length steel truss beam'],
      ['Loading Method', 'Simultaneous dual-side yard forklift'],
      ['Primary Commodity', 'Dimensional lumber, plywood & drywall wallboard'],
    ],
  },
  {
    id: 'bulkhead',
    slug: 'bulkhead-flatcars',
    name: 'Bulkhead Flatcar',
    plural: 'bulkhead flats',
    mark: 'CLCX 6001',
    len: 19.0,
    unit: 'tons',
    load: 90,
    aarCode: 'AAR Class FB',
    specs: [
      ['Clear Deck Length', '60′ – 73′ flat floor'],
      ['End Structures', 'Heavy-duty fixed vertical bulkheads'],
      ['Load Securement', 'Side stake pockets & integrated ratchets'],
      ['Primary Commodity', 'Steel pipe, utility poles, rebar & logs'],
    ],
  },
  {
    id: 'tank',
    slug: 'tank-cars',
    name: 'General Service Tank Car',
    plural: 'tank cars',
    mark: 'CLCX 7001',
    len: 18.4,
    unit: 'gal',
    load: 25500,
    aarCode: 'DOT-111 / CPC-1232',
    specs: [
      ['Gross Shell Capacity', '20,000 – 30,000 Gallons'],
      ['Operating Envelope', 'General purpose non-pressure & insulated'],
      ['Valves & Fittings', 'Top pressure manway & bottom unload valve'],
      ['Primary Commodity', 'Vegetable oils, biofuels, tallow & liquid chemicals'],
    ],
  },
];

const FT = 3.28084;
const TRUCK_TONS = 22;
const TRUCK_GAL = 7500;
const BASE_SPEED = 1.6;

// Format numbers with commas
const fmt = (n: number) => Math.round(n).toLocaleString();

// ============================================================================
// THREE.JS MATERIALS & PROCEDURAL BUILDERS (CRC BRAND RED #AA2E1F)
// ============================================================================

const mat = (color: number, rough = 0.6, metal = 0.35) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
    envMapIntensity: 0.25,
  });

const M = {
  steel: mat(0x2d3135, 0.55, 0.6),
  wheel: mat(0x4a4f55, 0.35, 0.85),
  tread: mat(0xa8afb7, 0.25, 0.95),
  rail: mat(0xb0b7be, 0.25, 0.9),
  tie: mat(0x423226, 0.95, 0.0),
  ballast: mat(0x64748b, 0.98, 0.0),
  dark: mat(0x22262a, 0.6, 0.4),
  grab: mat(0xf1eee4, 0.45, 0.4),
  spring: mat(0xc7b045, 0.4, 0.6),
  floor: mat(0x5c4834, 0.9, 0.0),
};

const BODY = {
  // Coast Road Capital Authentic Historic Railroad Red (#AA2E1F)
  boxcar: mat(0xaa2e1f, 0.45, 0.25),
  boxcarDoor: mat(0x8f2417, 0.48, 0.25),
  hopper: mat(0xc8cbcd, 0.38, 0.45),
  hopperTrough: mat(0xb0b4b8, 0.4, 0.45),
  oth: mat(0x35383b, 0.58, 0.45),
  othSlope: mat(0x42464a, 0.68, 0.3),
  gon: mat(0x423832, 0.68, 0.35),
  cbDeck: mat(0x5c6a74, 0.58, 0.45),
  cbBeam: mat(0x687782, 0.52, 0.5),
  bhDeck: mat(0x85755d, 0.72, 0.2),
  bhEnd: mat(0x75654d, 0.58, 0.35),
  bhPlank: mat(0x948469, 0.88, 0.0),
  tank: mat(0x24282c, 0.25, 0.65),
};

const P = {
  yellow: mat(0xdf9a1b, 0.45, 0.25),
  concrete: mat(0xd4d8df, 0.88, 0.0),
  rubber: mat(0x1a1c1e, 0.8, 0.0),
  lumber: mat(0xba854c, 0.85, 0.0),
  ply: mat(0xd4ac72, 0.8, 0.0),
  pallet: mat(0xa8875e, 0.9, 0.0),
  carton: mat(0xc29766, 0.85, 0.0),
  strap: mat(0x282c30, 0.5, 0.4),
  pipe: mat(0xdfa932, 0.4, 0.5),
  rack: mat(0x55636d, 0.52, 0.5),
  blue: mat(0x2563eb, 0.5, 0.2),
  rock: mat(0x57534e, 0.95, 0.0),
  grain: mat(0xd4ab47, 0.88, 0.0),
  rust: mat(0x754127, 0.8, 0.3),
  rust2: mat(0x524239, 0.85, 0.3),
  cab: mat(0x3e5265, 0.45, 0.4),
  alum: mat(0xc5c9ce, 0.32, 0.7),
  log: mat(0x876241, 0.9, 0.0),
  bag: mat(0xe2dfd8, 0.6, 0.0),
  silo: mat(0xc9c6bd, 0.8, 0.05),
  ground: mat(0x3c8a3c, 0.5, 0.3),
};

const shared = new Set([...Object.values(M), ...Object.values(BODY), ...Object.values(P)]);

function box(w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}

function cyl(rt: number, rb: number, h: number, m: THREE.Material, seg = 20) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}

function truck(x: number) {
  const g = new THREE.Group();
  g.position.x = x;
  [-0.89, 0.89].forEach((ax) => {
    const axle = cyl(0.08, 0.08, 1.7, M.steel, 12);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(ax, 0.457, 0);
    g.add(axle);
    [-0.72, 0.72].forEach((z) => {
      const w = cyl(0.457, 0.457, 0.14, M.wheel, 32);
      w.rotation.x = Math.PI / 2;
      w.position.set(ax, 0.457, z);
      g.add(w);
      const fl = cyl(0.49, 0.49, 0.03, M.tread, 32);
      fl.rotation.x = Math.PI / 2;
      fl.position.set(ax, 0.457, z - Math.sign(z) * 0.07);
      g.add(fl);
      const hub = cyl(0.12, 0.12, 0.18, M.dark, 16);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(ax, 0.457, z + Math.sign(z) * 0.14);
      g.add(hub);
    });
  });
  [-0.98, 0.98].forEach((z) => {
    g.add(box(2.5, 0.36, 0.13, M.steel, 0, 0.5, z));
    g.add(box(0.55, 0.22, 0.16, M.steel, 0, 0.8, z));
    [-0.18, 0, 0.18].forEach((dx) => {
      const s = cyl(0.065, 0.065, 0.24, M.spring, 10);
      s.position.set(dx, 0.62, z);
      g.add(s);
    });
  });
  g.add(box(0.42, 0.3, 2.1, M.steel, 0, 0.76, 0));
  return g;
}

function underframe(L: number, W: number, sideSills = true) {
  const g = new THREE.Group();
  g.add(box(L - 0.3, 0.45, 0.55, M.steel, 0, 1.0, 0));
  if (sideSills) {
    [-1, 1].forEach((s) => g.add(box(L - 0.3, 0.22, 0.12, M.steel, 0, 1.12, s * (W / 2 - 0.06))));
  }
  [-1, 1].forEach((s) => {
    g.add(box(0.25, 0.35, W, M.steel, s * (L / 2 - 0.15), 1.05, 0));
    g.add(box(0.55, 0.22, 0.3, M.steel, s * (L / 2 + 0.2), 0.88, 0));
    g.add(box(0.16, 0.34, 0.42, M.steel, s * (L / 2 + 0.5), 0.88, 0.06));
    const hoseObj = cyl(0.03, 0.03, 0.5, M.dark, 8);
    hoseObj.rotation.z = 0.5;
    hoseObj.position.set(s * (L / 2 + 0.25), 0.62, -0.35);
    g.add(hoseObj);
  });
  const res = cyl(0.25, 0.25, 1.2, M.dark, 16);
  res.rotation.z = Math.PI / 2;
  res.position.set(-1.5, 0.82, 0.55);
  g.add(res);
  return g;
}

function ladder(x: number, z: number, y0: number, h: number, facing: number) {
  const g = new THREE.Group();
  [-0.22, 0.22].forEach((dz) => {
    const r = cyl(0.018, 0.018, h, M.grab, 6);
    r.position.set(x, y0 + h / 2, z + dz * facing);
    g.add(r);
  });
  for (let y = y0 + 0.2; y < y0 + h; y += 0.42) {
    const rung = cyl(0.016, 0.016, 0.44, M.grab, 6);
    rung.rotation.x = Math.PI / 2;
    rung.position.set(x, y, z);
    g.add(rung);
  }
  return g;
}

function brakeWheel(x: number, y: number) {
  const t = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 24), M.dark);
  t.position.set(x, y, 0);
  t.rotation.y = Math.PI / 2;
  t.castShadow = true;
  return t;
}

function decal(text: string, w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 135px "Plus Jakarta Sans", "Barlow", Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 24, 130);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
}

function addMarks(g: THREE.Group, text: string, x: number, y: number, zOut: number) {
  const a = decal(text, 3.2, 0.8);
  a.position.set(x, y, zOut);
  g.add(a);
  const b = decal(text, 3.2, 0.8);
  b.position.set(-x, y, -zOut);
  b.rotation.y = Math.PI;
  g.add(b);
}

function hopperBay(x: number, w: number, h: number, yTop: number, m: THREE.Material) {
  const p = new THREE.Mesh(new THREE.ConeGeometry(w / Math.SQRT2, h, 4, 1), m);
  p.rotation.x = Math.PI;
  p.rotation.y = Math.PI / 4;
  p.position.set(x, yTop - h / 2, 0);
  p.castShadow = true;
  return p;
}

function track(len: number) {
  const g = new THREE.Group();
  const bal = box(len, 0.36, 4.0, M.ballast, 0, -0.42, 0);
  bal.castShadow = false;
  g.add(bal);
  const n = Math.ceil(len / 0.5);
  const ties = new THREE.InstancedMesh(new THREE.BoxGeometry(0.23, 0.17, 2.6), M.tie, n);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    m4.makeTranslation(-len / 2 + 0.25 + i * 0.5, -0.17, 0);
    ties.setMatrixAt(i, m4);
  }
  ties.receiveShadow = true;
  g.add(ties);
  [-0.7535, 0.7535].forEach((z) => {
    const r = box(len, 0.16, 0.075, M.rail, 0, -0.005, z);
    r.castShadow = false;
    g.add(r);
  });
  return g;
}

// Procedural 3D builders for all 7 railcars
const BUILD: Record<string, (mark: string) => THREE.Group> = {
  boxcar(mark) {
    const L = 15.6,
      W = 3.2,
      H = 3.45,
      y0 = 1.25,
      body = BODY.boxcar,
      g = new THREE.Group();
    const t = 0.06,
      D0 = 0.25 - 1.6,
      D1 = 0.25 + 1.6,
      DH = H - 0.25,
      zN = W / 2 - t / 2;
    g.add(underframe(L, W));
    g.add(box(L, 0.1, W, M.floor, 0, y0 + 0.05, 0));
    g.add(box(L, t, W, body, 0, y0 + H - t / 2, 0));
    g.add(box(L + 0.06, 0.12, W + 0.06, body, 0, y0 + H + 0.03, 0));
    g.add(box(L, H, t, body, 0, y0 + H / 2, -zN));
    [-1, 1].forEach((s) => g.add(box(t, H, W, body, s * (L / 2 - t / 2), y0 + H / 2, 0)));
    g.add(box(D0 + L / 2, H, t, body, (D0 - L / 2) / 2, y0 + H / 2, zN));
    g.add(box(L / 2 - D1, H, t, body, (D1 + L / 2) / 2, y0 + H / 2, zN));
    g.add(box(D1 - D0, 0.18, t, body, 0.25, y0 + H - 0.09, zN));
    for (let x = -L / 2 + 0.55; x <= L / 2 - 0.5; x += 0.78) {
      if (Math.abs(x) < 1.8) continue;
      [-1, 1].forEach((s) => g.add(box(0.09, H - 0.1, 0.05, body, x, y0 + H / 2, s * (W / 2 + 0.025))));
    }
    [-1, 1].forEach((s) => {
      const dg = new THREE.Group();
      dg.position.set(0.25, 0, s * (W / 2 + 0.06));
      dg.add(box(3.2, DH, 0.07, BODY.boxcarDoor, 0, y0 + H / 2 - 0.05, 0));
      [-0.9, 0.9].forEach((dx) => dg.add(box(0.06, 1.0, 0.06, M.grab, dx, y0 + 1.5, s * 0.05)));
      g.add(dg);
      if (s === 1) {
        g.userData.door = dg;
        g.userData.doorZ = W / 2 + 0.06;
      }
      g.add(box(8.2, 0.08, 0.1, M.steel, -0.35, y0 + H - 0.08, s * (W / 2 + 0.08)));
      g.add(box(8.2, 0.08, 0.1, M.steel, -0.35, y0 + 0.04, s * (W / 2 + 0.08)));
      for (let y = y0 + 0.5; y < y0 + H; y += 0.6)
        g.add(box(0.06, 0.06, W - 0.2, body, s * (L / 2 + 0.03), y, 0));
    });
    g.add(ladder(-L / 2 + 0.35, W / 2 + 0.06, y0 + 0.2, H - 0.3, 1));
    g.add(ladder(L / 2 - 0.35, -W / 2 - 0.06, y0 + 0.2, H - 0.3, -1));
    g.add(brakeWheel(-L / 2 - 0.12, y0 + H - 0.9));
    addMarks(g, mark, -4.6, y0 + H - 0.75, W / 2 + 0.06);
    return g;
  },

  'covered-hopper'(mark) {
    const L = 17.2,
      W = 3.2,
      y0 = 1.6,
      H = 2.3,
      body = BODY.hopper,
      g = new THREE.Group();
    g.add(underframe(L, W, false));
    g.add(box(L, H, W, body, 0, y0 + H / 2, 0));
    const roof = cyl(W / 2, W / 2, L, body, 40);
    roof.rotation.z = Math.PI / 2;
    roof.scale.x = 0.3;
    roof.position.y = y0 + H;
    g.add(roof);
    const hatch = box(L - 2.2, 0.2, 0.75, BODY.hopperTrough, 0, y0 + H + 0.52, 0);
    g.add(hatch);
    g.userData.hatch = hatch;
    g.userData.gates = [];
    [-4.3, 0, 4.3].forEach((x) => {
      g.add(hopperBay(x, W - 0.1, 1.1, y0 + 0.02, body));
      const gt = box(0.7, 0.18, 0.7, M.dark, x, y0 - 1.05, 0);
      g.add(gt);
      g.userData.gates.push(gt);
    });
    for (let x = -L / 2 + 0.6; x <= L / 2 - 0.5; x += 1.15)
      [-1, 1].forEach((s) => g.add(box(0.07, H, 0.05, body, x, y0 + H / 2, s * (W / 2 + 0.025))));
    [-1, 1].forEach((s) => g.add(box(0.3, 0.6, W - 0.6, M.steel, s * (L / 2 - 0.5), y0 - 0.25, 0)));
    g.add(ladder(-L / 2 - 0.05, W / 2 - 0.4, 1.0, H + 0.6, 1));
    g.add(ladder(L / 2 + 0.05, -W / 2 + 0.4, 1.0, H + 0.6, -1));
    addMarks(g, mark, -5.5, y0 + H - 0.55, W / 2 + 0.06);
    return g;
  },

  'open-top-hopper'(mark) {
    const L = 15.0,
      W = 3.2,
      y0 = 1.6,
      H = 2.4,
      t = 0.08,
      body = BODY.oth,
      g = new THREE.Group();
    g.add(underframe(L, W, false));
    [-1, 1].forEach((s) => {
      g.add(box(L, H, t, body, 0, y0 + H / 2, s * (W / 2 - t / 2)));
      g.add(box(t, H, W, body, s * (L / 2 - t / 2), y0 + H / 2, 0));
      g.add(box(L + 0.1, 0.14, 0.2, body, 0, y0 + H, s * (W / 2)));
      for (let x = -L / 2 + 0.4; x <= L / 2 - 0.3; x += 1.1)
        g.add(box(0.12, H, 0.1, body, x, y0 + H / 2, s * (W / 2 + 0.04)));
    });
    g.userData.gates = [];
    [-3.8, 0, 3.8].forEach((x) => {
      g.add(hopperBay(x, W - 0.15, 1.2, y0 + 0.05, body));
      const gt = box(0.8, 0.16, 0.9, M.steel, x, y0 - 1.15, 0);
      g.add(gt);
      g.userData.gates.push(gt);
    });
    [-1, 1].forEach((s) => {
      const p = box(3.2, 0.06, W - 0.2, BODY.othSlope, s * (L / 2 - 1.4), y0 + 0.9, 0);
      p.rotation.z = s * -0.6;
      g.add(p);
    });
    g.add(ladder(-L / 2 - 0.05, W / 2 - 0.4, 1.0, H + 0.4, 1));
    g.add(ladder(L / 2 + 0.05, -W / 2 + 0.4, 1.0, H + 0.4, -1));
    addMarks(g, mark, -3.6, y0 + H - 0.55, W / 2 + 0.1);
    return g;
  },

  gondola(mark) {
    const L = 16.0,
      W = 3.15,
      y0 = 1.25,
      H = 1.45,
      t = 0.07,
      body = BODY.gon,
      g = new THREE.Group();
    g.add(underframe(L, W));
    g.add(box(L, 0.1, W, body, 0, y0 + 0.05, 0));
    [-1, 1].forEach((s) => {
      g.add(box(L, H, t, body, 0, y0 + H / 2, s * (W / 2 - t / 2)));
      g.add(box(t, H, W, body, s * (L / 2 - t / 2), y0 + H / 2, 0));
      g.add(box(L + 0.06, 0.12, 0.16, body, 0, y0 + H, (s * W) / 2));
      for (let x = -L / 2 + 0.4; x <= L / 2 - 0.3; x += 0.95)
        g.add(box(0.1, H - 0.05, 0.08, body, x, y0 + H / 2, s * (W / 2 + 0.03)));
    });
    g.add(brakeWheel(-L / 2 - 0.12, y0 + H - 0.4));
    addMarks(g, mark, -4.2, y0 + H - 0.55, W / 2 + 0.08);
    return g;
  },

  centerbeam(_mark) {
    const L = 22.4,
      W = 2.95,
      y0 = 1.25,
      H = 3.9,
      g = new THREE.Group();
    g.add(underframe(L, W));
    g.add(box(L, 0.2, W, BODY.cbDeck, 0, y0 - 0.06, 0));
    g.add(box(L - 0.8, 0.26, 0.34, BODY.cbBeam, 0, y0 + H, 0));
    for (let x = -L / 2 + 0.6; x <= L / 2 - 0.5; x += 1.55) {
      g.add(box(0.14, H, 0.22, BODY.cbBeam, x, y0 + H / 2, 0));
      g.add(box(0.12, 0.12, W - 0.1, BODY.cbDeck, x + 0.75, y0 + 0.1, 0));
    }
    for (let x = -L / 2 + 0.6; x < L / 2 - 2; x += 1.55) {
      const d = box(0.08, Math.hypot(1.55, H) - 0.2, 0.12, BODY.cbBeam, x + 0.775, y0 + H / 2, 0);
      d.rotation.z = Math.atan2(1.55, H);
      g.add(d);
    }
    [-1, 1].forEach((s) => {
      g.add(box(0.28, H + 0.35, W, BODY.cbBeam, s * (L / 2 - 0.14), y0 + (H + 0.35) / 2, 0));
      for (let y = y0 + 0.5; y < y0 + H; y += 0.55)
        g.add(box(0.06, 0.08, W, BODY.cbDeck, s * (L / 2 + 0.02), y, 0));
    });
    g.add(brakeWheel(-L / 2 - 0.3, y0 + 1.2));
    return g;
  },

  bulkhead(_mark) {
    const L = 18.6,
      W = 2.95,
      y0 = 1.25,
      H = 2.6,
      g = new THREE.Group();
    g.add(underframe(L, W));
    g.add(box(L, 0.22, W, BODY.bhDeck, 0, y0 - 0.05, 0));
    for (let x = -L / 2 + 0.25; x < L / 2; x += 0.3)
      g.add(box(0.26, 0.03, W - 0.04, BODY.bhPlank, x, y0 + 0.07, 0));
    [-1, 1].forEach((s) => {
      g.add(box(0.22, H, W, BODY.bhEnd, s * (L / 2 - 0.12), y0 + H / 2, 0));
      for (let z = -W / 2 + 0.3; z <= W / 2 - 0.3; z += 0.48)
        g.add(box(0.12, H, 0.1, BODY.bhEnd, s * (L / 2 - 0.26), y0 + H / 2, z));
      g.add(box(0.26, 0.16, W + 0.1, BODY.bhEnd, s * (L / 2 - 0.12), y0 + H, 0));
      for (let x = -L / 2 + 1.2; x < L / 2 - 1; x += 1.25)
        g.add(box(0.18, 0.22, 0.12, M.steel, x, y0 - 0.12, s * (W / 2 + 0.06)));
    });
    g.add(brakeWheel(-L / 2 - 0.12, y0 + 1.4));
    return g;
  },

  tank(mark) {
    const L = 17.6,
      R = 1.5,
      yc = 2.85,
      shell = BODY.tank,
      g = new THREE.Group();
    g.add(underframe(L, 2.6, false));
    const tk = cyl(R, R, L - 1.0, shell, 56);
    tk.rotation.z = Math.PI / 2;
    tk.position.y = yc;
    g.add(tk);
    [-1, 1].forEach((s) => {
      const head = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 20), shell);
      head.scale.x = 0.33;
      head.position.set(s * (L / 2 - 0.5), yc, 0);
      head.castShadow = true;
      g.add(head);
      g.add(box(1.0, 0.5, 2.2, M.steel, s * (L / 2 - 2.2), 1.45, 0));
      g.add(box(0.12, 0.12, 2 * R + 0.1, M.grab, s * (L / 2 - 1.2), yc, 0));
      g.add(ladder(s * (L / 2 + 0.15), 0.9 * s, 1.0, 1.9, s));
    });
    const man = cyl(0.42, 0.45, 0.38, shell, 28);
    man.position.set(0, yc + R + 0.12, 0);
    g.add(man);
    const lidG = new THREE.Group();
    lidG.position.set(-0.48, yc + R + 0.34, 0);
    const lid = cyl(0.48, 0.48, 0.06, M.dark, 28);
    lid.position.x = 0.48;
    lidG.add(lid);
    g.add(lidG);
    g.userData.lid = lidG;
    g.add(box(2.2, 0.06, 1.4, M.dark, 0, yc + R + 0.02, 0));
    [-1, 1].forEach((s) =>
      [-1, 1].forEach((z) => {
        const post = cyl(0.02, 0.02, 0.9, M.grab, 6);
        post.position.set(s * 1.05, yc + R + 0.47, z * 0.68);
        g.add(post);
      })
    );
    [-1, 1].forEach((z) => g.add(box(2.1, 0.04, 0.04, M.grab, 0, yc + R + 0.9, z * 0.68)));
    const outlet = cyl(0.18, 0.18, 0.45, M.dark, 16);
    outlet.position.set(0, yc - R - 0.15, 0);
    g.add(outlet);
    addMarks(g, mark, -4.5, yc + 0.55, R + 0.02);
    return g;
  },
};

// ============================================================================
// SIMULATION TIMELINES
// ============================================================================

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));

function timeline(init: any) {
  const steps: any[] = [];
  const cur = JSON.parse(JSON.stringify(init));
  const api = {
    cur,
    steps,
    push(label: any, d: number, f: (s: any, k: number) => void) {
      steps.push({ label, d, f });
      return api;
    },
    to(label: any, d: number, target: any) {
      const from: any = {};
      for (const k in target) from[k] = cur[k];
      Object.assign(cur, target);
      return api.push(label, d, (S: any, k: number) => {
        for (const key in target) S[key] = from[key] + (target[key] - from[key]) * k;
      });
    },
    set(fn: (s: any) => void) {
      return api.push(null, 0.001, fn);
    },
    wait(label: any, d: number) {
      return api.push(label, d, () => {});
    },
    get dur() {
      return steps.reduce((a, s) => a + s.d, 0);
    },
  };
  return api;
}

function runTimeline(sim: any, t: number) {
  const tl = sim.tl,
    rev = sim.reverse,
    tt = rev ? tl.dur - t : t;
  const S = JSON.parse(JSON.stringify(sim.init));
  let acc = 0;
  let lab = tl.steps[0]?.label;
  for (const s of tl.steps) {
    if (tt <= acc) break;
    const k = Math.min(1, (tt - acc) / s.d);
    s.f(S, k * k * (3 - 2 * k));
    if (s.label) lab = s.label;
    acc += s.d;
  }
  const text = typeof lab === 'function' ? lab(S) : Array.isArray(lab) ? lab[rev ? 1 : 0] : lab;
  return { S, label: text };
}

function drive(tl: any, label: any, dist: number, v = 3.8) {
  const c = tl.cur,
    x0 = c.fx,
    z0 = c.fz,
    h = c.fh,
    dx = -Math.sin(h) * dist,
    dz = -Math.cos(h) * dist;
  c.fx = x0 + dx;
  c.fz = z0 + dz;
  return tl.push(label, Math.abs(dist) / v + 0.25, (S: any, k: number) => {
    S.fx = x0 + dx * k;
    S.fz = z0 + dz * k;
    S.fh = h;
  });
}

const driveTo = (tl: any, label: any, z: number, v?: number) => drive(tl, label, tl.cur.fz - z, v);

function turn(tl: any, label: any, dh: number, r: number, fwd: boolean, v = 3.0) {
  const c = tl.cur,
    x0 = c.fx,
    z0 = c.fz,
    h0 = c.fh,
    R = (fwd ? 1 : -1) * Math.sign(dh) * r;
  const Pfunc = (h: number) => [
    x0 + R * (Math.cos(h) - Math.cos(h0)),
    z0 + R * (Math.sin(h0) - Math.sin(h)),
  ];
  const e = Pfunc(h0 + dh);
  c.fx = e[0];
  c.fz = e[1];
  c.fh = h0 + dh;
  return tl.push(label, Math.abs(r * dh) / v + 0.25, (S: any, k: number) => {
    const h = h0 + dh * k,
      p = Pfunc(h);
    S.fx = p[0];
    S.fz = p[1];
    S.fh = h;
  });
}

function shiftX(tl: any, label: any, x1: number, r: number) {
  const dx = x1 - tl.cur.fx;
  if (Math.abs(dx) < 0.01) return;
  const s = Math.sign(dx);
  turn(tl, label, (-s * Math.PI) / 2, r, false);
  drive(tl, label, Math.abs(dx));
  turn(tl, label, (s * Math.PI) / 2, r, true);
}

const pad = (x0: number, x1: number, z0: number, z1: number) =>
  box(x1 - x0, 0.37, z1 - z0, P.concrete, (x0 + x1) / 2, -0.425, (z0 + z1) / 2);

function beam(a: THREE.Vector3, b: THREE.Vector3, w: number, h: number, m: THREE.Material) {
  const d = new THREE.Vector3().subVectors(b, a),
    len = d.length(),
    o = box(len, h, w, m);
  o.position.copy(a).addScaledVector(d, 0.5);
  o.quaternion.setFromUnitVectors(V(1, 0, 0), d.normalize());
  return o;
}

function hose(pts: number[][], r: number, m: THREE.Material) {
  const geo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts.map((p) => V(p[0], p[1], p[2]))),
    48,
    r,
    8,
    false
  );
  const o = new THREE.Mesh(geo, m);
  o.castShadow = true;
  o.userData.n = geo.index?.count || 0;
  return o;
}

function grow(o: THREE.Mesh, k: number) {
  o.visible = k > 0.002;
  const total = o.userData.n || 0;
  o.geometry.setDrawRange(0, Math.floor((total * clamp01(k)) / 6) * 6);
}

function bundle(l: number, h: number, w: number, m: THREE.Material) {
  const b = new THREE.Group();
  b.add(box(l, h, w, m, 0, h / 2, 0));
  [-l * 0.32, l * 0.32].forEach((x) => b.add(box(0.05, h + 0.02, w + 0.02, P.strap, x, h / 2, 0)));
  return b;
}

function safety(g: THREE.Group, ctx: any, chocks = true) {
  g.add(box(0.07, 1.4, 0.07, M.steel, 14.5, 0.45, 0));
  g.add(box(0.05, 0.5, 0.8, P.blue, 14.5, 1.0, 0));
  if (!chocks) return;
  const tx = (ctx.t.len - 1) / 2 - 2;
  [0.52, -0.52].forEach((dx, i) =>
    [-0.7535, 0.7535].forEach((z) => {
      const c = box(0.28, 0.14, 0.15, P.yellow, tx + 0.89 + dx, 0.15, z);
      c.rotation.z = i ? 0.4 : -0.4;
      g.add(c);
    })
  );
}

function forklift({ s = 1, fork = 1.4, clamp = false }: { s?: number; fork?: number; clamp?: boolean } = {}) {
  const g = new THREE.Group(),
    b = new THREE.Group();
  g.add(b);
  b.scale.setScalar(s);
  b.add(box(1.0, 0.7, 1.6, P.yellow, 0, 0.6, 0.95));
  b.add(box(1.02, 0.85, 0.45, M.dark, 0, 0.67, 1.95));
  b.add(box(0.5, 0.18, 0.45, M.dark, 0, 1.03, 1.15));
  b.add(box(0.46, 0.5, 0.08, M.dark, 0, 1.3, 1.38));
  [
    [-0.45, 0.45],
    [0.45, 0.45],
    [-0.45, 1.65],
    [0.45, 1.65],
  ].forEach(([x, z]) => b.add(box(0.06, 1.25, 0.06, M.dark, x, 1.55, z)));
  b.add(box(1.0, 0.06, 1.3, M.dark, 0, 2.18, 1.05));
  [0.36, 1.72].forEach((z) =>
    [-0.42, 0.42].forEach((x) => {
      const w = cyl(0.28, 0.28, 0.24, P.rubber, 20);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.28, z);
      b.add(w);
    })
  );
  [-0.32, 0.32].forEach((x) => b.add(box(0.08, 2.3, 0.12, M.steel, x, 1.2, 0)));
  const inner = new THREE.Group();
  [-0.25, 0.25].forEach((x) => inner.add(box(0.07, 2.1, 0.1, M.steel, x, 1.1, -0.1)));
  b.add(inner);
  const car = new THREE.Group();
  car.add(box(0.95, 0.08, 0.06, M.dark, 0, 0.2, -0.16));
  car.add(box(0.95, 0.08, 0.06, M.dark, 0, 0.95, -0.16));
  [-0.4, -0.13, 0.13, 0.4].forEach((x) => car.add(box(0.05, 0.8, 0.04, M.dark, x, 0.58, -0.16)));
  [-0.3, 0.3].forEach((x) => {
    car.add(box(0.12, 0.05, fork, M.steel, x, 0.05, -(0.15 + fork / 2)));
    car.add(box(0.12, 0.5, 0.05, M.steel, x, 0.27, -0.17));
  });
  let cl: THREE.Group | null = null;
  if (clamp) {
    cl = new THREE.Group();
    cl.position.set(0, 1.0, -0.16);
    cl.add(box(0.9, 0.08, 0.08, M.dark, 0, 0, 0));
    [-0.3, 0.3].forEach((x) => {
      cl!.add(box(0.08, 0.08, 1.5, M.dark, x, 0, -0.75));
      cl!.add(box(0.08, 0.3, 0.08, M.dark, x, -0.15, -1.5));
    });
    car.add(cl);
  }
  b.add(car);
  const fc = s * (0.15 + fork / 2);
  return {
    g,
    fc,
    tip: s * (0.15 + fork),
    top: s * 0.075,
    place(S: any, base: number, mirror?: boolean) {
      g.position.set(S.fx, base, mirror ? -S.fz : S.fz);
      g.rotation.y = mirror ? Math.PI - S.fh : S.fh;
      car.position.y = S.lift / s;
      inner.position.y = Math.max(0, S.lift / s - 1);
      if (cl) cl.rotation.x = 0.85 - 0.91 * (S.clamp || 0);
    },
    held(S: any, mirror?: boolean): [number, number, number] {
      const x = S.fx - Math.sin(S.fh) * fc;
      const z = S.fz - Math.cos(S.fh) * fc;
      return [x, mirror ? -z : z, mirror ? Math.PI - S.fh : S.fh];
    },
  };
}

function semi(kind: 'hopper' | 'tank') {
  const g = new THREE.Group(),
    y0 = -0.24;
  [11.4, 7.6, 6.5, -3.4, -4.6].forEach((x) =>
    [-1.05, 1.05].forEach((z) => {
      const w = cyl(0.52, 0.52, 0.32, P.rubber, 20);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, y0 + 0.52, z);
      g.add(w);
    })
  );
  g.add(box(6.6, 0.3, 1.0, M.steel, 8.7, y0 + 1.0, 0));
  g.add(box(2.0, 2.5, 2.45, P.cab, 9.9, y0 + 2.45, 0));
  g.add(box(1.4, 1.25, 2.2, P.cab, 11.6, y0 + 1.75, 0));
  g.add(box(0.04, 0.9, 2.1, M.dark, 10.92, y0 + 3.05, 0));
  [-1.24, 1.24].forEach((z) => g.add(box(0.9, 0.7, 0.04, M.dark, 10.2, y0 + 3.0, z)));
  const st = cyl(0.09, 0.09, 2.2, M.steel, 10);
  st.position.set(8.75, y0 + 3.3, 1.1);
  g.add(st);
  g.add(box(1.2, 0.2, 1.8, M.dark, 7.0, y0 + 1.25, 0));
  g.add(box(11.6, 0.25, 1.1, M.steel, 0.6, y0 + 1.3, 0));
  let heap: THREE.Mesh | null = null;
  if (kind === 'tank') {
    const tk = cyl(1.05, 1.05, 10.4, P.alum, 36);
    tk.rotation.z = Math.PI / 2;
    tk.position.set(0.6, y0 + 2.5, 0);
    g.add(tk);
    [-1, 1].forEach((s) => {
      const e = new THREE.Mesh(new THREE.SphereGeometry(1.05, 28, 14), P.alum);
      e.scale.x = 0.3;
      e.position.set(0.6 + s * 5.2, y0 + 2.5, 0);
      e.castShadow = true;
      g.add(e);
    });
    g.add(box(0.5, 0.4, 0.3, M.dark, -1.0, y0 + 1.35, -0.95));
  } else {
    [-1, 1].forEach((s) => g.add(box(11.4, 1.6, 0.06, P.alum, 0.6, y0 + 2.9, s * 1.22)));
    [-1, 1].forEach((s) => g.add(box(0.06, 1.6, 2.5, P.alum, 0.6 + s * 5.7, y0 + 2.9, 0)));
    g.add(box(11.4, 0.06, 2.44, P.alum, 0.6, y0 + 2.12, 0));
    [-1.6, 2.8].forEach((x) => {
      const c = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.8, 4), P.alum);
      c.rotation.x = Math.PI;
      c.rotation.y = Math.PI / 4;
      c.position.set(x, y0 + 1.7, 0);
      g.add(c);
    });
    heap = box(11.2, 1, 2.36, P.grain, 0.6, 0, 0);
    g.add(heap);
  }
  return { g, heap };
}

const flowRod = (r: number, m: THREE.Material) => {
  const o = cyl(r, r, 1, m, 12);
  o.castShadow = false;
  return o;
};

function span(o: THREE.Object3D, x: number, y0: number, y1: number, z: number) {
  const len = Math.max(0.01, y0 - y1);
  o.scale.y = len;
  o.position.set(x, y1 + len / 2, z);
}

// All 7 Loading / Unloading Simulation timelines
const SIMS: Record<string, (ctx: any, mode: 'load' | 'unload', getCap: () => number) => any> = {
  boxcar(ctx, mode) {
    const g = new THREE.Group(),
      base = 1.35,
      fl = forklift(),
      r = 1.6,
      SZ = 5.6,
      BACK = SZ + 0.5 + fl.tip + 0.35;
    g.add(box(13, base + 0.61, 9.5, P.concrete, 0.25, (base - 0.61) / 2, 6.75));
    [-1, 1].forEach((s) => g.add(box(0.3, 0.45, 0.18, P.rubber, 0.25 + s * 2.3, base - 0.35, 1.95)));
    g.add(box(3.0, 0.04, 0.62, M.steel, 0.25, base, 1.85));
    g.add(box(13, 0.02, 0.14, P.yellow, 0.25, base + 0.01, 2.08));
    safety(g, ctx);
    g.add(fl.g);
    const LANE = -0.95,
      ZS = LANE + r;
    const jobs = [
      { sx: -4.6, end: true, dh: Math.PI / 2, px: -7.15, pz: LANE, name: 'far end bulkhead' },
      { sx: 4.6, end: true, dh: -Math.PI / 2, px: 7.15, pz: LANE, name: 'near end bulkhead' },
      { sx: -3.4, px: -0.55, pz: -1.0, name: 'doorway quadrant' },
      { sx: 3.4, px: 1.05, pz: -1.0, name: 'doorway center' },
    ];
    const pals = jobs.map(() => {
      const p = new THREE.Group();
      [0, 1.09].forEach((y) => {
        p.add(box(0.9, 0.14, 1.0, P.pallet, 0, y + 0.07, 0));
        p.add(box(0.86, 0.93, 0.96, P.carton, 0, y + 0.61, 0));
        p.add(box(0.88, 0.04, 0.98, P.strap, 0, y + 0.75, 0));
      });
      g.add(p);
      return p;
    });
    const bag = box(1, 2.0, 0.95, P.bag, 0.25, base + 1.05, -1.0);
    g.add(bag);
    const init = {
      fx: jobs[0].sx,
      fz: BACK,
      fh: 0,
      lift: 0,
      doorOut: 0,
      doorSlide: 0,
      bag: 0,
      items: jobs.map(() => 0),
    };
    const tl = timeline(init),
      n = jobs.length;
    tl.wait(['Car spotted at industrial dock · chocked, blue flag set', 'Unloading complete · 4 pallet stages returned to warehouse'], 1.5);
    tl.to(['Opening mechanical sliding door', 'Closing plug door'], 0.6, { doorOut: 1 }).to(['Opening mechanical sliding door', 'Closing plug door'], 1.6, {
      doorSlide: 1,
    });
    jobs.forEach((j, i) => {
      const lab = [`Staging pallet unit ${i + 1} of ${n} · into ${j.name}`, `Extracting pallet unit ${n - i} of ${n} · out of ${j.name}`];
      shiftX(tl, lab, j.sx, r);
      driveTo(tl, lab, SZ + fl.fc);
      tl.set((S: any) => {
        S.items[i] = 1;
      });
      tl.to(lab, 0.4, { lift: 0.15 });
      driveTo(tl, lab, BACK);
      if (j.end) {
        shiftX(tl, lab, 0.25, r);
        driveTo(tl, lab, ZS);
        turn(tl, lab, j.dh, r, true);
        const d = Math.abs(j.px - (tl.cur.fx - Math.sign(j.dh) * fl.fc));
        drive(tl, lab, d);
        tl.to(lab, 0.4, { lift: 0 });
        tl.set((S: any) => {
          S.items[i] = 2;
        });
        drive(tl, lab, -d);
        turn(tl, lab, -j.dh, r, false);
        driveTo(tl, lab, BACK);
      } else {
        shiftX(tl, lab, j.px, r);
        driveTo(tl, lab, j.pz + fl.fc);
        tl.to(lab, 0.4, { lift: 0 });
        tl.set((S: any) => {
          S.items[i] = 2;
        });
        driveTo(tl, lab, BACK);
      }
    });
    tl.to(['Inflatable dunnage airbag deployed in doorway void', 'Deflating center dunnage void bag'], 1.2, { bag: 1 });
    tl.to(['Closing door & locking latch', 'Reopening sliding door'], 1.6, { doorSlide: 0 }).to(['Closing door & locking latch', 'Reopening sliding door'], 0.6, {
      doorOut: 0,
    });
    tl.wait(['Fully loaded · 4 pallet stages secure, door sealed for interchange', 'Car spotted at industrial dock · chocked, blue flag set'], 2.5);
    const door = ctx.root.userData.door,
      dz = ctx.root.userData.doorZ;
    return {
      group: g,
      tl,
      init,
      reverse: mode === 'unload',
      render(S: any) {
        fl.place(S, base);
        door.position.z = dz + 0.14 * S.doorOut;
        door.position.x = 0.25 - 3.35 * S.doorSlide;
        bag.visible = S.bag > 0.01;
        bag.scale.x = 0.05 + 0.61 * S.bag;
        pals.forEach((p, i) => {
          const m = S.items[i],
            j = jobs[i];
          if (m === 0) {
            p.position.set(j.sx, base, SZ);
            p.rotation.y = 0;
          } else if (m === 1) {
            const [x, z, h] = fl.held(S);
            p.position.set(x, base + S.lift, z);
            p.rotation.y = h;
          } else {
            p.position.set(j.px, base, j.pz);
            p.rotation.y = j.end ? j.dh : 0;
          }
        });
      },
    };
  },

  'covered-hopper'(ctx, mode, getCap) {
    const g = new THREE.Group(),
      hatch = ctx.root.userData.hatch,
      hy = hatch.position.y,
      gates = ctx.root.userData.gates,
      gy = gates[0].position.y;
    safety(g, ctx, false);
    if (mode === 'load') {
      g.add(pad(-12, 2, 4, 13));
      const silo = cyl(2.6, 2.6, 15, P.silo, 40);
      silo.position.set(-7, 6.89, 8.5);
      g.add(silo);
      g.add(box(3.2, 2.2, 3.2, P.silo, -7, 15.4, 8.5));
      g.add(beam(V(-6, 15.6, 7.4), V(0, 9.0, 0.6), 1.2, 1.1, P.silo));
      [-1.2, 1.2].forEach((x) =>
        [-2.6, 2.6].forEach((z) => g.add(box(0.25, 9.6, 0.25, M.steel, x, 4.19, z)))
      );
      g.add(box(2.8, 1.3, 5.6, P.silo, 0, 9.0, 0));
      const outer = cyl(0.36, 0.36, 1.2, M.steel, 20);
      outer.position.set(0, 7.8, 0);
      g.add(outer);
      const spout = cyl(0.28, 0.28, 1, M.steel, 20);
      g.add(spout);
      const stream = flowRod(0.14, P.grain);
      g.add(stream);
      const init = { off: 4.3, hatch: 0, spout: 7.2, flow: 0, fill: 0 };
      const tl = timeline(init),
        stops = [4.3, 0, -4.3];
      tl.wait('Car spotted under elevator discharge spout', 1.4).to('Opening continuous roof trough hatch', 1.0, { hatch: 1 });
      stops.forEach((p, i) => {
        if (i) tl.to('Car indexer shifts hopper to compartment #' + (i + 1), 1.6, { off: p });
        tl.to('Lowering telescoping loading chute', 0.8, { spout: 4.7 })
          .set((S: any) => {
            S.flow = 1;
          })
          .to((S: any) => 'Gravity grain feed · ' + fmt(S.fill * getCap()) + ' tons staged', 3.2, { fill: (i + 1) / 3 })
          .set((S: any) => {
            S.flow = 0;
          })
          .to('Retracting discharge chute', 0.6, { spout: 5.8 });
      });
      tl.to('Sealing weather-tight trough hatch', 1.0, { hatch: 0 })
        .to('Chute returned to overhead park position', 0.6, { spout: 7.2 })
        .wait(() => 'Fully loaded · ' + fmt(getCap()) + ' tons grain capacity certified', 2.5);
      return {
        group: g,
        tl,
        init,
        cam: { pos: V(22, 15, 27), target: V(-2, 5, 3) },
        render(S: any) {
          ctx.move(S.off);
          hatch.position.z = 0.6 * S.hatch;
          hatch.position.y = hy - 0.05 * S.hatch;
          span(spout, 0, 7.3, S.spout, 0);
          stream.visible = S.flow > 0;
          span(stream, 0, S.spout, 3.2, 0);
        },
      };
    }
    g.add(pad(-9, 13, 2, 9.5));
    g.add(box(15.3, 0.2, 0.55, M.dark, 2.15, 0.12, 0));
    const a = V(9.8, 0.25, 0),
      b2 = V(2.5, 4.5, 5.6);
    g.add(beam(a, b2, 0.6, 0.25, M.dark));
    g.add(box(0.7, 0.5, 0.7, M.dark, 2.5, 4.5, 5.6));
    const mid = V(0, 0, 0).lerpVectors(a, b2, 0.5);
    g.add(beam(V(mid.x, -0.24, mid.z), V(mid.x, mid.y - 0.1, mid.z), 0.15, 0.15, M.steel));
    const beltG = box(15.3, 0.04, 0.36, P.grain, 2.15, 0.24, 0);
    g.add(beltG);
    const beltI = beam(V(9.8, 0.4, 0), V(2.6, 4.65, 5.6), 0.36, 0.04, P.grain);
    g.add(beltI);
    const drops = [-4.3, 0, 4.3].map((x) => {
      const o = flowRod(0.1, P.grain);
      span(o, x, 0.46, 0.22, 0);
      g.add(o);
      return o;
    });
    const head = flowRod(0.14, P.grain);
    g.add(head);
    const tk = semi('hopper');
    tk.g.position.z = 5.6;
    g.add(tk.g);
    const init = { tx: -34, gate: 0, flow: 0, fill: 0 };
    const tl = timeline(init);
    tl.wait('Car spotted over track discharge conveyor pit', 1.2)
      .to('Hopper-bottom semi truck positions at loadout', 4, { tx: 0 })
      .to('Opening bottom discharge slide gate', 1.0, { gate: 1 })
      .set((S: any) => {
        S.flow = 1;
      })
      .to((S: any) => 'Conveying to highway trailer · ' + fmt(S.fill * TRUCK_TONS) + ' of ' + TRUCK_TONS + ' tons', 7, {
        fill: 1,
      })
      .set((S: any) => {
        S.flow = 0;
      })
      .to('Closing bottom hopper slide gate', 0.8, { gate: 0 })
      .to('Fully loaded highway semi departs transload facility', 4, { tx: 34 })
      .wait(
        () => '1 Highway Semi = ' + TRUCK_TONS + ' tons · 1 Railcar eliminates ≈ ' + Math.ceil(getCap() / TRUCK_TONS) + ' semi truck trips',
        2.5
      );
    return {
      group: g,
      tl,
      init,
      cam: { pos: V(18, 17, 22), target: V(2, 1.8, 2.6) },
      render(S: any) {
        tk.g.position.x = S.tx;
        gates.forEach((o: any) => {
          o.position.y = gy - 0.12 * S.gate;
        });
        const on = S.flow > 0;
        beltG.visible = beltI.visible = head.visible = on;
        drops.forEach((o) => {
          o.visible = on;
        });
        const h = Math.max(0.01, 1.35 * S.fill);
        if (tk.heap) {
          tk.heap.visible = S.fill > 0.005;
          tk.heap.scale.y = h;
          tk.heap.position.y = 1.91 + h / 2;
        }
        span(head, 2.5, 4.25, 1.91 + h, 5.6);
      },
    };
  },

  'open-top-hopper'(ctx, mode, getCap) {
    const g = new THREE.Group(),
      gates = ctx.root.userData.gates,
      gy = gates[0].position.y,
      HM = 2.05,
      Y0 = 2.0;
    safety(g, ctx, false);
    const segs = [0, 1, 2, 3, 4, 5].map((i) => {
      const o = box(2.38, 1, 2.95, P.rock, 0, 0, 0);
      o.userData.cx = -7.2 + 1.2 + 2.4 * i;
      g.add(o);
      return o;
    });
    const drawHeap = (S: any) =>
      segs.forEach((o, i) => {
        const h = Math.max(0.01, S.hs[i]);
        o.visible = S.hs[i] > 0.01;
        o.scale.y = h;
        o.position.set(S.off + o.userData.cx, Y0 + h / 2, 0);
      });
    const stream = flowRod(0.3, P.rock);
    g.add(stream);
    if (mode === 'load') {
      [-1.6, 1.6].forEach((x) =>
        [-2.8, 2.8].forEach((z) => g.add(box(0.3, 10.1, 0.3, M.steel, x, 4.44, z)))
      );
      g.add(box(3.6, 2.6, 6.0, P.silo, 0, 10.8, 0));
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.6, 4), P.silo);
      cone.rotation.x = Math.PI;
      cone.rotation.y = Math.PI / 4;
      cone.position.y = 8.7;
      g.add(cone);
      g.add(box(0.9, 2.2, 0.9, M.steel, 0, 6.9, 0));
      const init = { off: 7.2, flow: 0, hs: segs.map(() => 0) };
      const tl = timeline(init);
      tl.wait('Car aligned on loadout track under quarry chute', 1.2)
        .set((S: any) => {
          S.flow = 1;
        })
        .push(
          (S: any) =>
            'Continuous flood-loading ballast · ' +
            fmt((S.hs.reduce((a: number, b: number) => a + b, 0) / (6 * HM)) * getCap()) +
            ' tons',
          9,
          (S: any, k: number) => {
            S.off = 7.2 - 14.4 * k;
            S.hs = S.hs.map((_: any, i: number) => HM * clamp01((7.2 - S.off) / 2.4 - i));
          }
        )
        .set((S: any) => {
          S.flow = 0;
        })
        .wait(() => 'Fully loaded · ' + fmt(getCap()) + ' tons aggregate verified on track scale', 2.5);
      return {
        group: g,
        tl,
        init,
        cam: { pos: V(20, 13, 25), target: V(0, 4, 1) },
        render(S: any) {
          ctx.move(S.off);
          drawHeap(S);
          const i = Math.max(0, Math.min(5, Math.floor((7.2 - S.off) / 2.4)));
          stream.visible = S.flow > 0;
          span(stream, 0, 5.8, Y0 + S.hs[i], 0);
        },
      };
    }
    g.add(pad(-3, 10, 2, 12.5));
    g.add(box(2.6, 0.03, 1.35, M.dark, 0, -0.06, 0));
    for (let x = -1.2; x <= 1.2; x += 0.3) g.add(box(0.05, 0.05, 1.35, M.steel, x, -0.03, 0));
    g.add(beam(V(0, -0.2, 2.1), V(5.5, 4.6, 9.4), 0.7, 0.3, M.dark));
    g.add(beam(V(2.75, -0.24, 5.75), V(2.75, 2.2, 5.75), 0.2, 0.2, M.steel));
    const pile = new THREE.Mesh(new THREE.ConeGeometry(3.4, 4.2, 28), P.rock);
    pile.castShadow = pile.receiveShadow = true;
    g.add(pile);
    const bays = [-3.8, 0, 3.8];
    const init = { off: 3.8, flow: 0, gates: [0, 0, 0], hs: segs.map(() => HM) };
    const tl = timeline(init);
    tl.wait('Car positioned over track receiving hopper pit', 1.2);
    bays.forEach((bx, j) => {
      if (j) tl.to('Indexing hopper bay #' + (j + 1) + ' over pit', 1.6, { off: -bx });
      tl.push(`Discharging bay ${j + 1} gates`, 0.6, (S: any, k: number) => {
        S.gates[j] = k;
      })
        .set((S: any) => {
          S.flow = 1;
        })
        .push(`Rapid bottom gravity discharge (Bay ${j + 1} of 3)`, 2.6, (S: any, k: number) => {
          S.hs[2 * j] = S.hs[2 * j + 1] = HM * (1 - k);
        })
        .set((S: any) => {
          S.flow = 0;
        })
        .push(`Locking bay ${j + 1} bottom doors`, 0.6, (S: any, k: number) => {
          S.gates[j] = 1 - k;
        });
    });
    tl.wait('Car empty & swept · material conveyed to industrial stockpile', 2.5);
    return {
      group: g,
      tl,
      init,
      render(S: any) {
        ctx.move(S.off);
        drawHeap(S);
        gates.forEach((o: any, i: number) => {
          o.position.y = gy - 0.14 * S.gates[i];
        });
        stream.visible = S.flow > 0;
        span(stream, 0, 0.4, -0.05, 0);
        const f = Math.max(0.001, 1 - S.hs.reduce((a: number, b: number) => a + b, 0) / (6 * HM));
        pile.scale.setScalar(f);
        pile.position.set(6, -0.24 + 2.1 * f, 10);
      },
    };
  },

  gondola(ctx, mode) {
    const g = new THREE.Group(),
      base = -0.24,
      L1 = 6.5,
      L2 = 5.0,
      BZ = 6.3,
      PY = base + 1.15 + 1.6;
    g.add(pad(-7, 7, 2, 14));
    safety(g, ctx);
    const mh = new THREE.Group();
    mh.position.set(0, base, BZ);
    g.add(mh);
    mh.add(box(2.6, 0.7, 3.8, M.dark, 0, 0.8, 0));
    [-1.25, 1.25].forEach((x) =>
      [-1.3, 1.3].forEach((z) => {
        const w = cyl(0.55, 0.55, 0.45, P.rubber, 20);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 0.55, z);
        mh.add(w);
      })
    );
    const up = new THREE.Group();
    up.position.y = 1.15;
    mh.add(up);
    up.add(box(2.4, 1.2, 3.2, P.yellow, 0, 0.6, 0.4));
    up.add(box(2.4, 0.9, 0.8, M.dark, 0, 0.55, 2.1));
    up.add(box(0.2, 2.0, 0.2, M.dark, 0.8, 2.2, -0.3));
    up.add(box(1.0, 1.2, 1.2, P.yellow, 0.8, 3.6, -0.4));
    up.add(box(1.02, 0.6, 1.0, M.dark, 0.8, 3.75, -0.45));
    const boom = new THREE.Group();
    boom.position.set(-0.2, 1.6, -0.9);
    up.add(boom);
    boom.add(box(0.45, 0.55, L1, P.yellow, 0, 0, -L1 / 2));
    const stick = new THREE.Group();
    stick.position.z = -L1;
    boom.add(stick);
    stick.add(box(0.35, 0.4, L2, P.yellow, 0, 0, -L2 / 2));
    const grap = new THREE.Group();
    grap.position.z = -L2;
    stick.add(grap);
    const link = cyl(0.08, 0.08, 0.6, M.dark, 8);
    link.position.y = -0.3;
    grap.add(link);
    const hub = cyl(0.4, 0.4, 0.4, M.dark, 14);
    hub.position.y = -0.8;
    grap.add(hub);
    const tines = [0, 1, 2, 3].map((q) => {
      const a = (q * Math.PI) / 2 + Math.PI / 4,
        tg = new THREE.Group();
      tg.position.set(Math.cos(a) * 0.35, -1.0, Math.sin(a) * 0.35);
      tg.rotation.y = -a;
      const pv = new THREE.Group();
      tg.add(pv);
      pv.add(box(0.12, 0.9, 0.1, M.dark, 0, -0.45, 0));
      grap.add(tg);
      return pv;
    });
    const rng = (() => {
      let s = 7;
      return () => (s = (s * 16807) % 2147483647) / 2147483647;
    })();
    const chunk = () => {
      const c = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const o = box(
          0.3 + rng() * 0.7,
          0.15 + rng() * 0.3,
          0.2 + rng() * 0.6,
          rng() > 0.5 ? P.rust : P.rust2,
          (rng() - 0.5) * 0.9,
          0.12 + rng() * 0.3,
          (rng() - 0.5) * 0.9
        );
        o.rotation.set(rng(), rng() * 3, rng());
        c.add(o);
      }
      g.add(c);
      return c;
    };
    const pileC = new THREE.Mesh(new THREE.ConeGeometry(3.0, 2.0, 24), P.rust2);
    pileC.position.set(-1.2, base + 1.0, 11);
    pileC.receiveShadow = true;
    g.add(pileC);
    const src = [
      [-1.2, 1.35, 11],
      [-0.4, 0.95, 10.3],
      [-2.0, 0.95, 11.5],
      [-0.5, 0.75, 11.8],
      [-1.9, 0.7, 10.2],
    ];
    const dst = [-5.2, -2.6, 0, 2.6, 5.2].map((x) => [x, 1.35, 0]);
    const chunks = src.map(chunk);
    const ik = (x: number, tipY: number, z: number) => {
      const dx = x,
        dz = z - BZ,
        sl = Math.atan2(-dx, -dz),
        R = Math.hypot(dx, dz) - 0.9,
        Y = tipY - PY;
      const c2 = Math.max(-1, Math.min(1, (R * R + Y * Y - L1 * L1 - L2 * L2) / (2 * L1 * L2))),
        a2 = -Math.acos(c2);
      return {
        sl,
        a1: Math.atan2(Y, R) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2)),
        a2,
      };
    };
    const p0 = ik(src[0][0], src[0][1] + 4.8, src[0][2]);
    const init = { sl: p0.sl, a1: p0.a1, a2: p0.a2, grip: 0, items: src.map(() => 0) };
    const tl = timeline(init);
    const poseTo = (lab: any, d: number, p: any, extra?: any) => {
      let sl = p.sl;
      while (sl - tl.cur.sl > Math.PI) sl -= 2 * Math.PI;
      while (sl - tl.cur.sl < -Math.PI) sl += 2 * Math.PI;
      tl.to(lab, d, Object.assign({ sl, a1: p.a1, a2: p.a2 }, extra || {}));
    };
    tl.wait(['Gondola spotted on scrap track · chocked, blue flag set', 'Unload complete · material handler returned to staging'], 1.4);
    src.forEach((s, i) => {
      const d = dst[i],
        lab = [`Crane grapple bite ${i + 1} of 5 · scrap yard to car`, `Crane grapple bite ${5 - i} of 5 · car to scrap yard`];
      poseTo(lab, 1.4, ik(s[0], s[1] + 4.8, s[2]));
      poseTo(lab, 0.9, ik(s[0], s[1] + 2.35, s[2]));
      tl.to(lab, 0.5, { grip: 1 }).set((S: any) => {
        S.items[i] = 1;
      });
      poseTo(lab, 0.9, ik(s[0], s[1] + 4.8, s[2]));
      poseTo(lab, 1.8, ik(d[0], 6.0, d[2]));
      poseTo(lab, 0.9, ik(d[0], d[1] + 2.35, d[2]));
      tl.to(lab, 0.5, { grip: 0 }).set((S: any) => {
        S.items[i] = 2;
      });
      poseTo(lab, 0.7, ik(d[0], 6.0, d[2]));
    });
    tl.wait(['Fully loaded · 100 tons industrial scrap settled below top chords', 'Gondola spotted on scrap track · chocked, blue flag set'], 2.5);
    const v = V(0, 0, 0);
    return {
      group: g,
      tl,
      init,
      reverse: mode === 'unload',
      cam: { pos: V(17, 15, 26), target: V(0, 2, 5) },
      render(S: any) {
        up.rotation.y = S.sl;
        boom.rotation.x = S.a1;
        stick.rotation.x = S.a2;
        grap.rotation.x = -(S.a1 + S.a2);
        tines.forEach((t) => {
          t.rotation.z = 0.8 - 0.7 * S.grip;
        });
        g.updateMatrixWorld(true);
        grap.getWorldPosition(v);
        g.worldToLocal(v);
        chunks.forEach((c, i) => {
          const m = S.items[i];
          if (m === 0) {
            c.position.set(src[i][0], src[i][1], src[i][2]);
            c.rotation.y = 0;
          } else if (m === 1) {
            c.position.set(v.x, v.y - 2.35, v.z);
            c.rotation.y = S.sl;
          } else {
            c.position.set(dst[i][0], dst[i][1], dst[i][2]);
            c.rotation.y = 0;
          }
        });
      },
    };
  },

  centerbeam(ctx, mode) {
    const g = new THREE.Group(),
      base = -0.24,
      deck = 1.29,
      BL = 2.44,
      BH = 0.6,
      BW = 1.22,
      SZ = 5.6,
      TZ = 0.78,
      r = 2.4,
      STAGE = 3.5;
    const fl = forklift({ s: 1.4, fork: 1.6 }),
      fl2 = forklift({ s: 1.4, fork: 1.6 }),
      BACK = SZ + BW / 2 + fl.tip + 0.25;
    g.add(pad(-7, 7, 2, 13));
    g.add(pad(-7, 7, -13, -2));
    safety(g, ctx);
    g.add(fl.g, fl2.g);
    const liftFor = (y: number) => y - base - fl.top,
      jobs: any[] = [];
    [-3, 0, 3].forEach((x) => {
      [-1, 1].forEach((s) =>
        [-0.8, 0.8].forEach((dx) => g.add(box(0.12, 0.1, BW, P.lumber, x + dx, base + 0.05, s * SZ)))
      );
      jobs.push({ x, sy: base + 0.1 + BH + 0.06, ty: deck }, { x, sy: base + 0.1, ty: deck + BH + 0.04 });
    });
    const bundles = jobs.map(() => [1, -1].map(() => {
      const b = bundle(BL, BH, BW, P.ply);
      g.add(b);
      return b;
    }));
    const straps = new THREE.Group();
    g.add(straps);
    [-3, 0, 3].forEach((x) =>
      [-0.6, 0.6].forEach((dx) =>
        [1, -1].forEach((s) => {
          straps.add(beam(V(x + dx, 5.05, s * 0.17), V(x + dx, deck + 2 * BH + 0.06, s * 1.42), 0.08, 0.02, P.strap));
          straps.add(beam(V(x + dx, deck + 2 * BH + 0.06, s * 1.42), V(x + dx, 1.12, s * 1.46), 0.08, 0.02, P.strap));
        })
      )
    );
    [-3, 0, 3].forEach((x) =>
      [-1, 1].forEach((s) =>
        [-0.6, 0.6].forEach((dx) => g.add(box(0.2, 0.14, 0.14, M.dark, x + dx, 1.05, s * 1.48)))
      )
    );
    const init = { fx: jobs[0].x, fz: BACK, fh: 0, lift: 0, strap: 0, items: jobs.map(() => 0) };
    const tl = timeline(init),
      n = jobs.length;
    tl.wait(['Centerbeam spotted with dual-side aisle clearance', 'Unloading complete · lumber packs restocked in yard'], 1.4);
    jobs.forEach((j, i) => {
      const lab = [`Simultaneous dual forklift loading: Unit ${i + 1} of ${n}`, `Simultaneous dual forklift unloading: Unit ${n - i} of ${n}`];
      shiftX(tl, lab, j.x, r);
      tl.to(lab, 0.6, { lift: liftFor(j.sy) });
      driveTo(tl, lab, SZ + fl.fc);
      tl.set((S: any) => {
        S.items[i] = 1;
      });
      tl.to(lab, 0.4, { lift: liftFor(j.sy) + 0.1 });
      driveTo(tl, lab, STAGE);
      tl.to(lab, 0.8, { lift: liftFor(j.ty) + 0.12 });
      driveTo(tl, lab, TZ + fl.fc);
      tl.to(lab, 0.5, { lift: liftFor(j.ty) });
      tl.set((S: any) => {
        S.items[i] = 2;
      });
      driveTo(tl, lab, BACK);
    });
    tl.to(['High-tensile polyester tie-down straps winched tight', 'Releasing tie-down winch tension'], 1.6, { strap: 1 });
    tl.wait(['Fully loaded · 12 wrapped plywood packs secured to center partition', 'Centerbeam spotted with dual-side aisle clearance'], 2.5);
    return {
      group: g,
      tl,
      init,
      reverse: mode === 'unload',
      cam: { pos: V(22, 15, 22), target: V(0, 2, 0) },
      render(S: any) {
        fl.place(S, base);
        fl2.place(S, base, true);
        straps.visible = S.strap > 0.5;
        bundles.forEach((pair, i) =>
          pair.forEach((b, k) => {
            const m = S.items[i],
              j = jobs[i],
              s = k ? -1 : 1;
            if (m === 0) b.position.set(j.x, j.sy, s * SZ);
            else if (m === 1) {
              const [x, z] = fl.held(S, k === 1);
              b.position.set(x, base + S.lift + fl.top, z);
            } else b.position.set(j.x, j.ty, s * TZ);
          })
        );
      },
    };
  },

  bulkhead(ctx, mode) {
    const g = new THREE.Group(),
      base = -0.24,
      deck = 1.34,
      LL = 5.4,
      LD = 2.4,
      LH = 0.88,
      SZ = 5.4,
      r = 2.0,
      STAGE = 3.7;
    const fl = forklift({ s: 1.5, fork: 1.7, clamp: true }),
      BACK = SZ + LD / 2 + fl.tip + 0.25;
    g.add(pad(-9, 9, 2, 14));
    safety(g, ctx);
    g.add(fl.g);
    const logs = () => {
      const b = new THREE.Group();
      for (let k = 0; k < 5; k++) {
        const o = cyl(0.23 + (k % 2) * 0.02, 0.23 + (k % 2) * 0.02, LL, P.log, 14);
        o.rotation.z = Math.PI / 2;
        o.position.set((k % 3 - 1) * 0.08, 0.24, -0.96 + 0.48 * k);
        b.add(o);
      }
      for (let k = 0; k < 4; k++) {
        const o = cyl(0.22, 0.22, LL - 0.2, P.log, 14);
        o.rotation.z = Math.PI / 2;
        o.position.set((k % 2) * 0.1, 0.66, -0.72 + 0.48 * k);
        b.add(o);
      }
      g.add(b);
      return b;
    };
    const liftFor = (y: number) => y - base - fl.top,
      jobs: any[] = [];
    [-6, 0, 6].forEach((x) => {
      [-1.8, 1.8].forEach((dx) => g.add(box(0.25, 0.15, LD + 0.2, P.lumber, x + dx, base + 0.075, SZ)));
      jobs.push({ x, sy: base + 0.15 + LH, ty: deck }, { x, sy: base + 0.15, ty: deck + LH - 0.02 });
    });
    const bundles = jobs.map(logs);
    const chains = new THREE.Group();
    g.add(chains);
    const topY = deck + 2 * LH;
    [-6, 0, 6].forEach((x) =>
      [-1.6, 1.6].forEach((dx) => {
        chains.add(box(0.05, 0.05, LD + 0.1, P.strap, x + dx, topY, 0));
        [-1, 1].forEach((s) =>
          chains.add(box(0.05, topY - deck, 0.05, P.strap, x + dx, (topY + deck) / 2, s * (LD / 2 + 0.05)))
        );
      })
    );
    const init = { fx: jobs[0].x, fz: BACK, fh: 0, lift: 0, clamp: 0, chain: 0, items: jobs.map(() => 0) };
    const tl = timeline(init),
      n = jobs.length;
    tl.wait(['Bulkhead flatcar spotted on timber track siding', 'Unloading complete · timber bundles restocked'], 1.4);
    jobs.forEach((j, i) => {
      const lab = [`Hydraulic clamp positioning log tier ${i + 1} of ${n}`, `Discharging log tier ${n - i} of ${n} from bulkhead deck`];
      shiftX(tl, lab, j.x, r);
      tl.to(lab, 0.6, { lift: liftFor(j.sy) });
      driveTo(tl, lab, SZ + fl.fc);
      tl.set((S: any) => {
        S.items[i] = 1;
      });
      tl.to(lab, 0.6, { clamp: 1, lift: liftFor(j.sy) + 0.12 });
      driveTo(tl, lab, STAGE);
      tl.to(lab, 0.9, { lift: liftFor(j.ty) + 0.15 });
      driveTo(tl, lab, fl.fc);
      tl.to(lab, 0.5, { lift: liftFor(j.ty) });
      tl.to(lab, 0.5, { clamp: 0 });
      tl.set((S: any) => {
        S.items[i] = 2;
      });
      driveTo(tl, lab, BACK);
    });
    tl.to(['Grade-70 transport chain binders tensioned across bulkheads', 'Releasing transport chain binders'], 1.6, { chain: 1 });
    tl.wait(['Fully loaded · 6 timber bundles secured against vertical bulkheads', 'Bulkhead flatcar spotted on timber track siding'], 2.5);
    return {
      group: g,
      tl,
      init,
      reverse: mode === 'unload',
      cam: { pos: V(22, 14, 26), target: V(0, 2, 4) },
      render(S: any) {
        fl.place(S, base);
        chains.visible = S.chain > 0.5;
        bundles.forEach((b, i) => {
          const m = S.items[i],
            j = jobs[i];
          if (m === 0) b.position.set(j.x, j.sy, SZ);
          else if (m === 1) {
            const [x, z] = fl.held(S);
            b.position.set(x, base + S.lift + fl.top, z);
          } else b.position.set(j.x, j.ty, 0);
        });
      },
    };
  },

  tank(ctx, mode, getCap) {
    const g = new THREE.Group();
    safety(g, ctx);
    const gc = hose(
      mode === 'load'
        ? [
            [-2.4, 1.0, 2.45],
            [-2.4, 0.35, 1.95],
            [-2.4, 1.2, 1.4],
            [-2.4, 1.75, 1.15],
          ]
        : [
            [-2.7, 0.3, 3.0],
            [-2.6, 0.0, 2.2],
            [-2.4, 1.0, 1.4],
            [-2.4, 1.75, 1.15],
          ],
      0.02,
      P.ground
    );
    g.add(gc);
    if (mode === 'load') {
      const PY = 4.95,
        Z0 = 2.4,
        Z1 = 4.6,
        X0 = -2.4,
        X1 = 2.4,
        ROOF = 7.4,
        AY = 6.4,
        AL = Z0 + 0.3;
      g.add(pad(-9, 9, 2, 10.2));
      [X0, X1].forEach((x) =>
        [Z0 + 0.1, Z1].forEach((z) => g.add(box(0.22, ROOF + 0.24, 0.22, P.rack, x, (ROOF - 0.24) / 2, z)))
      );
      g.add(box(X1 - X0 + 0.4, 0.12, Z1 - Z0 + 0.3, P.rack, 0, PY - 0.06, (Z0 + Z1) / 2));
      g.add(box(X1 - X0 + 1.4, 0.14, Z1 - Z0 + 1.8, P.rack, 0, ROOF, (Z0 + Z1) / 2 - 0.3));
      [0.5, 1.0].forEach((h) => {
        g.add(box(X1 - X0, 0.05, 0.05, P.yellow, 0, PY + h, Z1));
        [X0, X1].forEach((x) => g.add(box(0.05, 0.05, Z1 - Z0, P.yellow, x, PY + h, (Z0 + Z1) / 2)));
      });
      const run = 5.2,
        rise = PY + 0.24,
        ang = Math.atan2(rise, run);
      const stair = box(Math.hypot(run, rise), 0.12, 0.9, P.rack, X1 + run / 2 + 0.2, (PY - 0.24) / 2, Z1 - 0.6);
      stair.rotation.z = -ang;
      g.add(stair);
      for (let i = 1; i < 12; i++) {
        const f = i / 12;
        g.add(box(0.28, 0.04, 0.9, P.yellow, X1 + 0.2 + run * f, PY - rise * f + 0.08, Z1 - 0.6));
      }
      const riser = cyl(0.1, 0.1, 7.0 - PY, P.pipe, 14);
      riser.position.set(0, (7.0 + PY) / 2, AL);
      g.add(riser);
      const hdr = cyl(0.12, 0.12, X1 - X0, P.pipe, 14);
      hdr.rotation.z = Math.PI / 2;
      hdr.position.set(0, 7.0, AL);
      g.add(hdr);
      const arm = new THREE.Group();
      arm.position.set(0, AY, AL);
      g.add(arm);
      const bm = cyl(0.09, 0.09, AL, P.pipe, 14);
      bm.rotation.x = Math.PI / 2;
      bm.position.z = -AL / 2;
      arm.add(bm);
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), P.pipe);
      elbow.position.z = -AL;
      arm.add(elbow);
      arm.add(cyl(0.17, 0.17, 0.3, M.dark, 16));
      const tube = cyl(0.11, 0.11, 1, M.steel, 16);
      arm.add(tube);
      const hood = cyl(0.13, 0.3, 0.22, M.dark, 20);
      arm.add(hood);
      const gw = new THREE.Group();
      gw.position.set(-1.5, PY, Z0);
      g.add(gw);
      gw.add(box(1.0, 0.06, 2.0, P.rack, 0, 0, -1.0));
      [-0.5, 0.5].forEach((x) => {
        gw.add(box(0.04, 0.04, 2.0, P.yellow, x, 0.9, -1.0));
        [-0.1, -1.0, -1.9].forEach((z) => gw.add(box(0.04, 0.9, 0.04, P.yellow, x, 0.45, z)));
      });
      const init = { gw: Math.PI / 2, lid: 0, arm: -Math.PI / 2, drop: 5.7, fill: 0, ground: 0 };
      const tl = timeline(init);
      tl.wait('Tank car spotted at loading rack · blue flag safety set', 1.2)
        .to('OSHA grounding bonding cable clamped to frame', 0.8, { ground: 1 })
        .to('Lowering counterbalanced safety gangway', 1.6, { gw: -0.38 })
        .to('Opening top pressure dome manway cover', 0.8, { lid: 1.9 })
        .to('Swinging articulated loading arm over dome', 1.4, { arm: 0 })
        .to('Submerged fill drop tube lowered to tank floor', 1.0, { drop: 4.45 })
        .to((S: any) => 'Liquid metering · ' + Math.round(S.fill * 100) + '% · ' + fmt(S.fill * getCap()) + ' gal', 7, { fill: 1 })
        .to('Retracting top fill tube to platform', 1.0, { drop: 5.7 })
        .to('Stowing loading arm in safety lock', 1.2, { arm: -Math.PI / 2 })
        .to('Torquing manway eyebolts & seal test', 0.6, { lid: 0 })
        .to('Retracting gangway to upright lock', 1.4, { gw: Math.PI / 2 })
        .to('Disconnecting static ground cable', 0.6, { ground: 0 })
        .wait(() => 'Fully loaded · ' + fmt(getCap()) + ' gal verified by Coriolis mass meter', 2.5);
      const lidG = ctx.root.userData.lid;
      return {
        group: g,
        tl,
        init,
        render(S: any) {
          gw.rotation.x = S.gw;
          lidG.rotation.z = S.lid;
          arm.rotation.y = S.arm;
          grow(gc, S.ground);
          const len = AY - S.drop;
          tube.scale.y = len;
          tube.position.set(0, -len / 2, -AL);
          hood.position.set(0, S.drop - AY + 0.35, -AL);
        },
      };
    }
    g.add(pad(-9, 13, 2, 9.5));
    const skid = new THREE.Group();
    skid.position.set(-2.2, -0.24, 3.3);
    g.add(skid);
    skid.add(box(1.5, 0.2, 1.0, M.steel, 0, 0.1, 0));
    skid.add(box(0.6, 0.45, 0.5, P.yellow, -0.3, 0.42, 0));
    const mo = cyl(0.22, 0.22, 0.7, P.blue, 16);
    mo.rotation.z = Math.PI / 2;
    mo.position.set(0.4, 0.45, 0);
    skid.add(mo);
    const h1 = hose(
      [
        [0, 0.95, 0],
        [0, 0.55, 0.6],
        [-1.0, 0.2, 1.9],
        [-1.8, 0.35, 3.0],
        [-2.0, 0.45, 3.2],
      ],
      0.07,
      M.dark
    );
    const h2 = hose(
      [
        [-1.6, 0.45, 3.6],
        [-1.4, 0.2, 4.0],
        [-1.0, 0.7, 4.35],
        [-1.0, 1.1, 4.5],
      ],
      0.07,
      M.dark
    );
    g.add(h1, h2);
    const tk = semi('tank');
    tk.g.position.z = 5.6;
    g.add(tk.g);
    const init = { tx: -34, h1: 0, h2: 0, ground: 0, fill: 0 };
    const tl = timeline(init);
    tl.wait('Car spotted at liquid transload manifold siding', 1.2)
      .to('DOT chemical tank transport semi positions for pump-off', 4, { tx: 0 })
      .to('Attaching static grounding & bonding cable', 0.8, { ground: 1 })
      .to('Coupling camlock hose to car 4″ bottom outlet', 1.2, { h1: 1 })
      .to('Connecting suction line to transport truck intake', 1.0, { h2: 1 })
      .to((S: any) => 'Positive displacement pumping · ' + fmt(S.fill * TRUCK_GAL) + ' of ' + fmt(TRUCK_GAL) + ' gal', 7, {
        fill: 1,
      })
      .to('Disconnecting transload transfer hoses', 1.2, { h1: 0, h2: 0 })
      .to('Grounding cable stowed on skid', 0.6, { ground: 0 })
      .to('Loaded transport semi departs transload pad', 4, { tx: 34 })
      .wait(
        () => '1 Tank Transport Semi = ' + fmt(TRUCK_GAL) + ' gal · 1 Railcar eliminates ≈ ' + Math.ceil(getCap() / TRUCK_GAL) + ' highway tanker runs',
        2.5
      );
    return {
      group: g,
      tl,
      init,
      cam: { pos: V(5, 19, 19), target: V(-1, 0.6, 2.4) },
      render(S: any) {
        tk.g.position.x = S.tx;
        grow(h1, S.h1);
        grow(h2, S.h2);
        grow(gc, S.ground);
      },
    };
  },
};

// Safe memory release helper
function disposeHierarchy(obj: THREE.Object3D) {
  obj.traverse((o: any) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material && !shared.has(o.material)) {
      if (Array.isArray(o.material)) {
        o.material.forEach((m: any) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      } else {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
      }
    }
  });
}

// ============================================================================
// REACT COMPONENT (LIGHT SHOWROOM STUDIO MATCHING WEBSITE VIBE)
// ============================================================================

export const RailcarViewer: React.FC = () => {
  const navigate = useNavigate();

  // Selected car state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const currentCar = TYPES[currentIdx];

  // Camera & turntable view state
  const [activeView, setActiveView] = useState<string>('three');
  const [isTurntableOn, setIsTurntableOn] = useState<boolean>(true);

  // Simulation state
  const [simActive, setSimActive] = useState<boolean>(false);
  const [simMode, setSimMode] = useState<'load' | 'unload'>('load');
  const [simPaused, setSimPaused] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simLabel, setSimLabel] = useState<string>('');
  const [simProgress, setSimProgress] = useState<number>(0);

  // Calculator state
  const [weeklyTons, setWeeklyTons] = useState<number>(500);
  const [weeklyGal, setWeeklyGal] = useState<number>(100000);
  const [loadPerCar, setLoadPerCar] = useState<number>(TYPES[0].load);
  const [tripDays, setTripDays] = useState<number>(14);
  const [handoffVisible, setHandoffVisible] = useState<boolean>(false);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // DOM and Three.js Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const ctxRef = useRef<any>(null);
  const simRef = useRef<any>(null);
  const animRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(performance.now());
  const simTRef = useRef<number>(0);

  // State mirror refs for animation loop
  const simStateRef = useRef({
    simActive: false,
    simMode: 'load' as 'load' | 'unload',
    simPaused: false,
    simSpeed: 1,
  });
  simStateRef.current = { simActive, simMode, simPaused, simSpeed };

  const loadPerCarRef = useRef<number>(loadPerCar);
  loadPerCarRef.current = loadPerCar;

  // Active weekly product based on unit
  const activeVol = currentCar.unit === 'gal' ? weeklyGal : weeklyTons;

  // Live calculated capacity metrics
  const calcMetrics = useMemo(() => {
    const vol = Math.max(0, activeVol || 0);
    const cap = Math.max(1, loadPerCar || currentCar.load);
    const trip = Math.max(1, tripDays || 14);
    const perWeek = vol > 0 ? Math.ceil(vol / cap) : 0;
    const fleet = perWeek > 0 ? Math.ceil((perWeek * trip) / 7) : 0;
    const truckCap = currentCar.unit === 'gal' ? TRUCK_GAL : TRUCK_TONS;
    const trucks = vol > 0 ? Math.ceil(vol / truckCap) : 0;
    const mathText = `${fmt(vol)} ${currentCar.unit} ÷ ${fmt(cap)} ${currentCar.unit}/car = ${fmt(
      perWeek
    )} cars/wk · × ${trip}-day cycle ÷ 7 = ${fmt(fleet)} total cars · replaces ${fmt(trucks)} highway truckloads/wk`;

    return { perWeek, fleet, trucks, truckCap, mathText };
  }, [activeVol, loadPerCar, tripDays, currentCar]);

  // Compute camera pose
  const getCameraPose = useCallback(
    (viewName: string) => {
      const L = currentCar.len;
      const t = new THREE.Vector3(0, 1.9, 0);
      const poses: Record<string, THREE.Vector3> = {
        three: new THREE.Vector3(L * 0.95, L * 0.3 + 2.2, L * 1.1),
        side: new THREE.Vector3(0, 2.4, L * 1.6),
        end: new THREE.Vector3(L * 0.5 + 6.5, 2.6, 2.2),
        top: new THREE.Vector3(0.001, L * 1.8, 0.6),
        under: new THREE.Vector3(-L * 0.32, 0.9, 5.2),
        load: new THREE.Vector3(L * 0.8, L * 0.45 + 6, L * 1.25 + 9),
      };
      const p = poses[viewName] || poses.three;
      if (viewName === 'under') t.set(-L * 0.28, 0.6, 0);
      if (viewName === 'load') {
        if (simRef.current && simRef.current.cam) {
          return { pos: simRef.current.cam.pos.clone(), target: simRef.current.cam.target.clone() };
        }
        t.set(0, 2.6, 4);
      }
      return { pos: p.clone(), target: t.clone() };
    },
    [currentCar]
  );

  // Transition camera
  const setCameraView = useCallback(
    (name: string, instant = false) => {
      setActiveView(name);
      if (!cameraRef.current || !controlsRef.current) return;
      const { pos, target } = getCameraPose(name);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (instant || reduceMotion) {
        cameraRef.current.position.copy(pos);
        controlsRef.current.target.copy(target);
        controlsRef.current.update();
        animRef.current = null;
        return;
      }
      animRef.current = {
        t0: performance.now(),
        dur: 800,
        p0: cameraRef.current.position.clone(),
        p1: pos,
        q0: controlsRef.current.target.clone(),
        q1: target,
      };
    },
    [getCameraPose]
  );

  // Build the current 3D railcar model onto the turntable
  const buildCurrentCar = useCallback(
    (car: CarType) => {
      if (!sceneRef.current) return;
      if (carGroupRef.current) {
        sceneRef.current.remove(carGroupRef.current);
        disposeHierarchy(carGroupRef.current);
      }
      const carGroup = new THREE.Group();
      const carRoot = BUILD[car.id](car.mark);
      carGroup.add(carRoot);
      const L = car.len - 1.0;
      const trs = [truck(-(L / 2 - 2.0)), truck(L / 2 - 2.0)];
      trs.forEach((o) => carGroup.add(o));
      carGroup.add(track(26));
      sceneRef.current.add(carGroup);
      carGroupRef.current = carGroup;

      const bx = trs.map((o) => o.position.x);
      ctxRef.current = {
        root: carRoot,
        t: car,
        move(x: number) {
          carRoot.position.x = x;
          trs.forEach((o, i) => {
            o.position.x = bx[i] + x;
          });
        },
      };
    },
    []
  );

  // Stop active demo
  const stopSimulation = useCallback(() => {
    setSimActive(false);
    simRef.current = null;
    buildCurrentCar(currentCar);
    setSimLabel('');
    setSimProgress(0);
  }, [buildCurrentCar, currentCar]);

  // Start demo for the current car
  const startSimulation = useCallback(
    (mode: 'load' | 'unload') => {
      setSimMode(mode);
      buildCurrentCar(currentCar);
      if (!SIMS[currentCar.id] || !carGroupRef.current) return;

      const simInstance = SIMS[currentCar.id](ctxRef.current, mode, () => loadPerCarRef.current);
      simInstance.reverse = !!simInstance.reverse;
      [-1, 1].forEach((s) => {
        const tr = track(10);
        tr.position.x = s * 18;
        simInstance.group.add(tr);
      });
      carGroupRef.current.add(simInstance.group);
      simRef.current = simInstance;

      setSimActive(true);
      simTRef.current = 0;
      setSimPaused(false);

      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
        setIsTurntableOn(false);
      }
      setCameraView('load');
    },
    [buildCurrentCar, currentCar, setCameraView]
  );

  // Switch car type
  const handleSelectCar = (idx: number) => {
    setCurrentIdx(idx);
    const newCar = TYPES[idx];
    setLoadPerCar(newCar.load);
    setHandoffVisible(false);
    if (simActive) {
      setSimMode('load');
      stopSimulation();
      setCameraView('three', true);
    }
  };

  // Toggle turntable rotation
  const handleToggleTurntable = () => {
    if (!controlsRef.current) return;
    const next = !isTurntableOn;
    controlsRef.current.autoRotate = next;
    setIsTurntableOn(next);
  };

  // Toggle fullscreen studio view
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Three.js Scene Initialization (Clean Light Studio Showroom)
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    // WebGL capability check
    try {
      const testCanvas = document.createElement('canvas');
      const hasGl = !!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'));
      if (!hasGl) {
        setWebGlAvailable(false);
        return;
      }
    } catch {
      setWebGlAvailable(false);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Renderer (Light Studio Background #F1F5F9)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf1f5f9, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'none';

    stageEl.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene & Environment
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;

    // Camera
    const camera = new THREE.PerspectiveCamera(32, stageEl.clientWidth / stageEl.clientHeight, 0.1, 300);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    Object.assign(controls, {
      enableDamping: true,
      dampingFactor: 0.08,
      minDistance: 4,
      maxDistance: 80,
      maxPolarAngle: Math.PI * 0.52,
      autoRotate: !reduceMotion,
      autoRotateSpeed: 0.7,
    });
    controls.addEventListener('start', () => {
      if (controls.autoRotate) {
        controls.autoRotate = false;
        setIsTurntableOn(false);
      }
      animRef.current = null;
    });
    controlsRef.current = controls;

    // Bright daylight architectural lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.95));

    // Directional Key Light with soft realistic shadow
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(14, 24, 16);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    Object.assign(key.shadow.camera, { left: -22, right: 22, top: 18, bottom: -18, near: 1, far: 90 });
    scene.add(key);

    // Warm ambient rim light
    const rim = new THREE.DirectionalLight(0xfdf5ee, 0.65);
    rim.position.set(-16, 12, -14);
    scene.add(rim);

    // Turntable stage: Clean light machined disc (#DFE4EA) with CRC Brand Red accent ring (#AA2E1F)
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(17, 17, 0.12, 96),
      new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 0.65, metalness: 0.25, envMapIntensity: 0.2 })
    );
    disc.position.y = -0.67;
    disc.receiveShadow = true;
    scene.add(disc);

    // Accent ring: Coast Road Capital Brand Red #AA2E1F
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(17.02, 0.045, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0xaa2e1f })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.6;
    scene.add(ring);

    // Clean light architectural showroom floor (#EEF2F6)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0xeef2f6, roughness: 0.95, metalness: 0.05, envMapIntensity: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.73;
    floor.receiveShadow = true;
    scene.add(floor);

    // Build the initial 50' boxcar
    buildCurrentCar(TYPES[0]);
    setCameraView('three', true);

    // Resize handling
    const handleResize = () => {
      if (!stageEl || !renderer || !camera) return;
      const w = stageEl.clientWidth;
      const h = stageEl.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(stageEl);
    handleResize();

    // Render loop
    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - lastTRef.current) / 1000);
      lastTRef.current = now;

      // Handle active simulation
      if (simStateRef.current.simActive && simRef.current) {
        if (!simStateRef.current.simPaused) {
          simTRef.current += dt * BASE_SPEED * simStateRef.current.simSpeed;
          if (simTRef.current > simRef.current.tl.dur) {
            simTRef.current = 0;
          }
        }
        const r = runTimeline(simRef.current, simTRef.current);
        simRef.current.render(r.S);
        setSimLabel(r.label);
        setSimProgress(100 * Math.min(1, simTRef.current / simRef.current.tl.dur));
      }

      // Smooth camera interpolation
      if (animRef.current) {
        const anim = animRef.current;
        const k = Math.min(1, (now - anim.t0) / anim.dur);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        camera.position.lerpVectors(anim.p0, anim.p1, e);
        controls.target.lerpVectors(anim.q0, anim.q1, e);
        if (k >= 1) animRef.current = null;
      }

      controls.update();
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Fullscreen change listener
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(handleResize, 100);
    };
    document.addEventListener('fullscreenchange', onFsChange);

    // Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      resizeObserver.disconnect();
      document.removeEventListener('fullscreenchange', onFsChange);
      if (carGroupRef.current) {
        disposeHierarchy(carGroupRef.current);
      }
      pm.dispose();
      renderer.dispose();
      if (stageEl.contains(renderer.domElement)) {
        stageEl.removeChild(renderer.domElement);
      }
    };
  }, [buildCurrentCar, setCameraView]);

  // When car selection changes, update 3D model
  useEffect(() => {
    buildCurrentCar(currentCar);
    setCameraView(activeView === 'load' ? 'three' : activeView, true);
  }, [currentIdx, buildCurrentCar, currentCar, activeView, setCameraView]);

  const engineeringFaqs = [
    {
      q: 'How accurate are the 3D dimensions and clearance profiles?',
      a: 'All equipment profiles are rendered according to AAR Plate C and Plate F clearance envelopes. Lengths over coupler pulling faces, truck center spacing, and volumetric limits strictly mirror North American Master Car Builder standards.',
    },
    {
      q: 'Can Coast Road Capital source customized mechanical configurations?',
      a: 'Yes. Beyond standard catalog series, we arrange custom lining installations, ceramic tank coatings, high-capacity 286,000-lb GRL trucks, rotary dump couplers, and automated pneumatic discharge systems with certified railcar builders.',
    },
    {
      q: 'How does the weekly capacity calculator estimate fleet requirements?',
      a: 'Fleet sizing utilizes the Class I railroad cycle formula: (Weekly Lading Volume ÷ Per-Car Capacity) × (Turnaround Cycle Days ÷ 7). Turnaround times factor loading dwell, Class I linehaul interchange transit, and destination unloading release.',
    },
  ];

  return (
    <div ref={containerRef} className="railcar-studio-page">
      {/* =========================================================================
          HERO BANNER (Authentic Coast Road Capital Header with Track Backdrop)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0A09',
          color: '#EDE6D4',
          padding: '4.5rem 0 3.75rem',
          borderBottom: '3px solid #AA2E1F',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <picture>
            <source srcSet="/images/hero/DSC_0004.webp" type="image/webp" />
            <img
              src="/images/hero/DSC_0004.jpg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 38%',
                opacity: 0.28,
              }}
            />
          </picture>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,9,0.72) 0%, rgba(10,10,9,0.96) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '880px' }}>
            <span className="eyebrow eyebrow-dark">
              Equipment Engineering &bull; 3D Interactive Fleet Studio
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4.6vw, 3.6rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.15rem',
              }}
            >
              Interactive 3D Railcar Equipment Studio
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Inspect detailed mechanical dimensions, 360° turntable geometry, and interactive operational loading &amp;
              unloading simulations across Coast Road Capital’s seven primary freight equipment classes.
            </p>

            {/* Highlights */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.75rem',
                alignItems: 'center',
                paddingTop: '1.35rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>
                  AAR Plate C &amp; F Mechanical Geometry
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>
                  7 Interchange-Approved Freight Classes
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#AA2E1F', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 500 }}>
                  Live Facility Fleet &amp; Logistics Calculator
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN INTERACTIVE WORKSPACE (Light Architectural Studio Canvas + Cards)
          ========================================================================= */}
      <section style={{ backgroundColor: '#F8FAFC', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 390px',
              gap: '1.75rem',
              alignItems: 'start',
            }}
            className="railcar-studio-grid"
          >
            {/* -------------------------------------------------------------------
                LEFT: 3D INTERACTIVE CANVAS & TOOLBAR (LIGHT ARCHITECTURAL FRAME)
                ------------------------------------------------------------------- */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                position: 'relative',
              }}
            >
              {/* Canvas Header Controls Toolbar (Light Clean Style) */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.15rem',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  gap: '0.75rem',
                }}
              >
                {/* Camera View Angle Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 700,
                      marginRight: '0.2rem',
                    }}
                  >
                    View:
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (controlsRef.current) controlsRef.current.autoRotate = false;
                      setIsTurntableOn(false);
                      setCameraView('three');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: activeView === 'three' ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                      backgroundColor: activeView === 'three' ? '#AA2E1F' : '#FFFFFF',
                      color: activeView === 'three' ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      boxShadow: activeView === 'three' ? '0 1px 3px rgba(170, 46, 31, 0.25)' : 'none',
                    }}
                  >
                    <Compass size={13} />
                    <span>3/4 Orbit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (controlsRef.current) controlsRef.current.autoRotate = false;
                      setIsTurntableOn(false);
                      setCameraView('side');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: activeView === 'side' ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                      backgroundColor: activeView === 'side' ? '#AA2E1F' : '#FFFFFF',
                      color: activeView === 'side' ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      boxShadow: activeView === 'side' ? '0 1px 3px rgba(170, 46, 31, 0.25)' : 'none',
                    }}
                  >
                    <Eye size={13} />
                    <span>Side</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (controlsRef.current) controlsRef.current.autoRotate = false;
                      setIsTurntableOn(false);
                      setCameraView('end');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: activeView === 'end' ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                      backgroundColor: activeView === 'end' ? '#AA2E1F' : '#FFFFFF',
                      color: activeView === 'end' ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      boxShadow: activeView === 'end' ? '0 1px 3px rgba(170, 46, 31, 0.25)' : 'none',
                    }}
                  >
                    <Box size={13} />
                    <span>End</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (controlsRef.current) controlsRef.current.autoRotate = false;
                      setIsTurntableOn(false);
                      setCameraView('top');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: activeView === 'top' ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                      backgroundColor: activeView === 'top' ? '#AA2E1F' : '#FFFFFF',
                      color: activeView === 'top' ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      boxShadow: activeView === 'top' ? '0 1px 3px rgba(170, 46, 31, 0.25)' : 'none',
                    }}
                  >
                    <Layers size={13} />
                    <span>Top</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (controlsRef.current) controlsRef.current.autoRotate = false;
                      setIsTurntableOn(false);
                      setCameraView('under');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: activeView === 'under' ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                      backgroundColor: activeView === 'under' ? '#AA2E1F' : '#FFFFFF',
                      color: activeView === 'under' ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      boxShadow: activeView === 'under' ? '0 1px 3px rgba(170, 46, 31, 0.25)' : 'none',
                    }}
                  >
                    <SlidersHorizontal size={13} />
                    <span>Trucks</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleTurntable}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: isTurntableOn ? '1px solid #AA2E1F' : '1px solid #E2E8F0',
                      backgroundColor: isTurntableOn ? 'rgba(170, 46, 31, 0.08)' : '#FFFFFF',
                      color: isTurntableOn ? '#AA2E1F' : '#64748B',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                  >
                    <RotateCw size={13} />
                    <span>Turntable</span>
                  </button>
                </div>

                {/* Right: Fullscreen Action */}
                <div>
                  <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.38rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                  </button>
                </div>
              </div>

              {/* 3D WebGL Canvas Stage (Light Studio Background) */}
              <div
                ref={stageRef}
                style={{
                  height: '660px',
                  width: '100%',
                  position: 'relative',
                  touchAction: 'none',
                  background: 'radial-gradient(110% 85% at 50% 30%, #FFFFFF 0%, #F1F5F9 55%, #E2E8F0 100%)',
                }}
              >
                {!webGlAvailable && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'grid',
                      placeItems: 'center',
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#64748B',
                    }}
                  >
                    This browser could not initialize hardware-accelerated WebGL. The fleet capacity calculator remains
                    fully functional.
                  </div>
                )}

                {/* Floating HUD: Equipment Profile Badge (Light Clean Frosted Glass) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.15rem',
                    left: '1.25rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.75rem 1.15rem',
                    color: '#0A0A09',
                    pointerEvents: 'none',
                    maxWidth: '340px',
                    zIndex: 10,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#AA2E1F',
                      fontWeight: 700,
                    }}
                  >
                    {currentCar.aarCode}
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0A0A09',
                      lineHeight: 1.2,
                      margin: '2px 0 4px',
                    }}
                  >
                    {currentCar.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: '#64748B' }}>
                    <span>Reporting Mark: <strong style={{ color: '#0A0A09', fontFamily: 'monospace' }}>{currentCar.mark}</strong></span>
                    <span>&bull;</span>
                    <span>Couplers: <strong style={{ color: '#0A0A09' }}>≈ {Math.round(currentCar.len * FT)} ft</strong></span>
                  </div>
                </div>

                {/* Bottom Canvas Controls: Loading Demo Launcher */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (simActive) {
                        stopSimulation();
                      } else {
                        startSimulation(simMode);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: simActive ? '1.5px solid #AA2E1F' : '1.5px solid #AA2E1F',
                      backgroundColor: simActive ? '#AA2E1F' : '#FFFFFF',
                      color: simActive ? '#FFFFFF' : '#AA2E1F',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(170, 46, 31, 0.18)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {simActive ? <Pause size={15} /> : <Play size={15} />}
                    <span>{simActive ? 'Close Loading Simulation' : 'Launch Loading Demo'}</span>
                  </button>
                </div>

                {/* Interactive Loading / Unloading Simulation Floating Control Panel (Clean Frosted Glass) */}
                {simActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.15rem',
                      right: '1.25rem',
                      width: 'min(360px, 90%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.9rem 1.15rem',
                      color: '#0A0A09',
                      zIndex: 15,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {/* Mode and Speed Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {/* Load / Unload Segmented */}
                      <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '2px', border: '1px solid #E2E8F0' }}>
                        <button
                          type="button"
                          onClick={() => startSimulation('load')}
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: simMode === 'load' ? '#AA2E1F' : 'transparent',
                            color: simMode === 'load' ? '#FFFFFF' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => startSimulation('unload')}
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: simMode === 'unload' ? '#AA2E1F' : 'transparent',
                            color: simMode === 'unload' ? '#FFFFFF' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          Unload
                        </button>
                      </div>

                      {/* Play/Pause & Speed */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setSimPaused((p) => !p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                        >
                          {simPaused ? <Play size={12} /> : <Pause size={12} />}
                          <span>{simPaused ? 'Play' : 'Pause'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSimSpeed((s) => (s > 1 ? 1 : 2))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '0.35rem 0.55rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: simSpeed > 1 ? '1px solid #AA2E1F' : '1px solid #CBD5E1',
                            backgroundColor: simSpeed > 1 ? 'rgba(170, 46, 31, 0.08)' : '#FFFFFF',
                            color: simSpeed > 1 ? '#AA2E1F' : '#64748B',
                            cursor: 'pointer',
                          }}
                        >
                          <FastForward size={12} />
                          <span>{simSpeed}×</span>
                        </button>
                      </div>
                    </div>

                    {/* Step Description Label */}
                    <div
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: '#0A0A09',
                        minHeight: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1.35,
                      }}
                    >
                      {simLabel}
                    </div>

                    {/* Interactive Progress Bar Scrubber */}
                    <div
                      style={{
                        height: '5px',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        marginTop: '6px',
                      }}
                      onClick={(e) => {
                        if (simRef.current) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                          simTRef.current = frac * simRef.current.tl.dur;
                        }
                      }}
                      title="Click anywhere to scrub timeline"
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${simProgress}%`,
                          backgroundColor: '#AA2E1F',
                          transition: 'width 0.08s linear',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Gesture Navigation Hint */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1.15rem',
                  backgroundColor: '#F8FAFC',
                  borderTop: '1px solid #E2E8F0',
                  fontSize: '0.78rem',
                  color: '#64748B',
                }}
              >
                <span>Drag to spin turntable &bull; Pinch or wheel to zoom &bull; Right-drag to pan camera</span>
                <span style={{ color: '#AA2E1F', fontWeight: 600 }}>Standard Gauge 4′ 8½″</span>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT: SPECIFICATIONS & CAPACITY CALCULATOR (CRC WHITE CARDS)
                ------------------------------------------------------------------- */}
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {/* CARD 1: Equipment Class Selector & Dimensions */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '1rem 1.25rem 0.85rem',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#64748B',
                        fontWeight: 700,
                      }}
                    >
                      Equipment Classification
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: '2px 0 0' }}>
                      Select Railcar Model
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(170, 46, 31, 0.08)',
                      color: '#AA2E1F',
                      border: '1px solid rgba(170, 46, 31, 0.2)',
                    }}
                  >
                    7 Classes
                  </span>
                </div>

                {/* 2-Column Car Type Buttons */}
                <div style={{ padding: '0.9rem 1.15rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {TYPES.map((t, idx) => {
                    const isSelected = idx === currentIdx;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectCar(idx)}
                        style={{
                          textAlign: 'left',
                          padding: '0.65rem 0.75rem',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid #AA2E1F' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#AA2E1F' : '#F8FAFC',
                          color: isSelected ? '#FFFFFF' : '#1E293B',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span>{t.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: isSelected ? 'rgba(255, 255, 255, 0.82)' : '#64748B',
                          }}
                        >
                          {t.aarCode.split(' ')[0]} {t.aarCode.split(' ')[1] || ''}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Technical Specs Table */}
                <div style={{ borderTop: '1px solid #E2E8F0' }}>
                  <div
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: '#F8FAFC',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 700 }}>
                      Engineering Specs
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>
                      ≈ {Math.round(currentCar.len * FT)} ft over couplers
                    </span>
                  </div>

                  <dl style={{ margin: 0 }}>
                    {currentCar.specs.map(([k, v], i) => (
                      <div
                        key={k}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          padding: '0.65rem 1.25rem',
                          borderTop: i > 0 ? '1px solid #F1F5F9' : 'none',
                        }}
                      >
                        <dt style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {k}
                        </dt>
                        <dd style={{ fontSize: '0.88rem', color: '#0A0A09', fontWeight: 600, textAlign: 'right', margin: 0, maxWidth: '65%' }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* CARD 2: Fleet Sizing & Weekly Capacity Calculator */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '1rem 1.25rem 0.85rem',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#64748B',
                      fontWeight: 700,
                    }}
                  >
                    Logistics Sizing Model
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', margin: '2px 0 0' }}>
                    How Many Railcars Do You Need?
                  </h3>
                </div>

                <div style={{ padding: '1rem 1.25rem', display: 'grid', gap: '0.9rem' }}>
                  {/* Field: Volume per Week */}
                  <div>
                    <label
                      htmlFor="vol"
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '4px',
                      }}
                    >
                      Product Moved Per Week
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <input
                        id="vol"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        value={activeVol}
                        onChange={(e) => {
                          const val = Math.max(0, +e.target.value || 0);
                          if (currentCar.unit === 'gal') {
                            setWeeklyGal(val);
                          } else {
                            setWeeklyTons(val);
                          }
                          setHandoffVisible(false);
                        }}
                        style={{
                          flex: 1,
                          border: 'none',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: '#0A0A09',
                          outline: 'none',
                          fontFamily: 'monospace',
                        }}
                      />
                      <span
                        style={{
                          padding: '0 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#64748B',
                          backgroundColor: '#F1F5F9',
                          alignSelf: 'stretch',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {currentCar.unit}
                      </span>
                    </div>
                  </div>

                  {/* 2-Columns: Load Per Car & Round Trip Days */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label
                        htmlFor="cap"
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '4px',
                        }}
                      >
                        Load Per Car
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <input
                          id="cap"
                          type="number"
                          inputMode="decimal"
                          min="1"
                          step="any"
                          value={loadPerCar}
                          onChange={(e) => {
                            setLoadPerCar(Math.max(1, +e.target.value || currentCar.load));
                            setHandoffVisible(false);
                          }}
                          style={{
                            width: '100%',
                            minWidth: 0,
                            border: 'none',
                            padding: '0.55rem 0.65rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#0A0A09',
                            outline: 'none',
                            fontFamily: 'monospace',
                          }}
                        />
                        <span
                          style={{
                            padding: '0 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#64748B',
                            backgroundColor: '#F1F5F9',
                            alignSelf: 'stretch',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {currentCar.unit}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="trip"
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '4px',
                        }}
                      >
                        Cycle Time
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <input
                          id="trip"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          step="1"
                          value={tripDays}
                          onChange={(e) => {
                            setTripDays(Math.max(1, +e.target.value || 14));
                            setHandoffVisible(false);
                          }}
                          style={{
                            width: '100%',
                            minWidth: 0,
                            border: 'none',
                            padding: '0.55rem 0.65rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#0A0A09',
                            outline: 'none',
                            fontFamily: 'monospace',
                          }}
                        />
                        <span
                          style={{
                            padding: '0 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#64748B',
                            backgroundColor: '#F1F5F9',
                            alignSelf: 'stretch',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Results Box */}
                  <div
                    style={{
                      marginTop: '0.35rem',
                      padding: '1.1rem',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      display: 'grid',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.4rem',
                          fontWeight: 800,
                          color: '#AA2E1F',
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: 1,
                        }}
                      >
                        {fmt(calcMetrics.perWeek)}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        {calcMetrics.perWeek === 1 ? currentCar.name.toLowerCase() : currentCar.plural} loaded / week
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        borderTop: '1px solid #E2E8F0',
                        paddingTop: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
                          Active Fleet Needed
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', marginTop: '2px' }}>
                          {fmt(calcMetrics.fleet)} {calcMetrics.fleet === 1 ? 'Car' : 'Cars'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
                          Trucks Replaced
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A0A09', marginTop: '2px' }}>
                          {fmt(calcMetrics.trucks)} loads / wk
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.45, fontFamily: 'monospace' }}>
                      {calcMetrics.mathText}
                    </div>
                  </div>

                  {/* Primary CTA: Transfer to Cost Estimator */}
                  <button
                    type="button"
                    onClick={() => {
                      setHandoffVisible(true);
                      setTimeout(() => {
                        navigate(`/cost-estimator?category=${currentCar.slug}&qty=${calcMetrics.fleet}`);
                      }, 350);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem',
                      backgroundColor: '#AA2E1F',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 150ms ease',
                      boxShadow: '0 2px 6px rgba(170, 46, 31, 0.25)',
                    }}
                  >
                    <span>Price This Fleet in Cost Estimator</span>
                    <ArrowRight size={16} />
                  </button>

                  {handoffVisible && (
                    <div
                      style={{
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.75rem',
                        color: '#475569',
                      }}
                    >
                      Configuring quote parameters in Coast Road Capital Estimator:
                      <br />
                      <strong style={{ color: '#0A0A09' }}>
                        {`/cost-estimator?category=${currentCar.slug}&qty=${calcMetrics.fleet}`}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ENGINEERING STANDARDS & FLEET COMPLIANCE BANNER
          ========================================================================= */}
      <section style={{ backgroundColor: '#0A0A09', color: '#EDE6D4', padding: '4rem 0', borderTop: '1px solid #2B2B28' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span className="eyebrow eyebrow-dark">
              AAR Plate &amp; FRA Part 215 Mechanical Compliance
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.2,
                marginTop: '0.4rem',
              }}
            >
              Certified for Unrestricted North American Interchange
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.65, marginTop: '0.75rem' }}>
              Coast Road Capital fleet assets conform to strict mechanical interchange rules across all Class I railroads,
              shortline connectors, and industrial shippers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#141413',
                padding: '1.75rem',
                borderRadius: '10px',
                border: '1px solid #2B2B28',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(170, 46, 31, 0.15)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#AA2E1F',
                  marginBottom: '1.15rem',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                FRA &amp; AAR Plate Geometry
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Every car class is profiled against standard Plate C / Plate F dimensional envelopes, ensuring zero clearance
                obstructions across mainline tunnels, bridges, and industrial turnouts.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#141413',
                padding: '1.75rem',
                borderRadius: '10px',
                border: '1px solid #2B2B28',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(170, 46, 31, 0.15)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#AA2E1F',
                  marginBottom: '1.15rem',
                }}
              >
                <Scale size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                286,000-lb Heavy Axle Loadings
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                Modern running gear engineered with premium 36-inch wheels, heavy-duty side frames, and variable-rate spring
                groups certified for maximum gross rail load (GRL) revenue service.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#141413',
                padding: '1.75rem',
                borderRadius: '10px',
                border: '1px solid #2B2B28',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(170, 46, 31, 0.15)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#AA2E1F',
                  marginBottom: '1.15rem',
                }}
              >
                <Truck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                Highway Truckload Conversion
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                One railcar carries the equivalent cargo volume of 3 to 4 highway semi-trucks, slashing diesel emissions,
                driver shortages, and linehaul shipping expense by up to 60%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
          ========================================================================= */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '4rem 0 5rem' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="eyebrow">Technical Advisory</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#0A0A09' }}>
                Frequently Asked Engineering Questions
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {engineeringFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      style={{
                        width: '100%',
                        padding: '1.15rem 1.35rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#0A0A09',
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
                          padding: '0 1.35rem 1.25rem',
                          color: '#475569',
                          fontSize: '0.92rem',
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

      {/* Scoped Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .railcar-studio-grid {
            grid-template-columns: 1fr !important;
          }
          .railcar-studio-grid > div:first-child > div:nth-child(2) {
            height: 52vh !important;
            min-height: 350px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RailcarViewer;
