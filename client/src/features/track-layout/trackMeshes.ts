import * as THREE from 'three';
import type { TrackLayoutPreset } from './types';

// Cached materials
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x27272a, // Dark industrial yard ground
  roughness: 0.9,
  metalness: 0.1,
});

const ballastMat = new THREE.MeshStandardMaterial({
  color: 0x52525b, // Crushed granite ballast
  roughness: 0.95,
  metalness: 0.05,
});

const railSteelMat = new THREE.MeshStandardMaterial({
  color: 0xd4d4d8, // Shiny polished steel railhead
  roughness: 0.25,
  metalness: 0.85,
});

const woodTieMat = new THREE.MeshStandardMaterial({
  color: 0x3f2e21, // Creosote-soaked timber cross-tie
  roughness: 0.85,
  metalness: 0.05,
});

const concreteMat = new THREE.MeshStandardMaterial({
  color: 0xa1a1aa,
  roughness: 0.8,
  metalness: 0.1,
});

const yellowSafetyMat = new THREE.MeshStandardMaterial({
  color: 0xeab308, // FRA safety yellow
  roughness: 0.4,
  metalness: 0.2,
});

const redSafetyMat = new THREE.MeshStandardMaterial({
  color: 0xdc2626, // Switch reverse / buffer red
  roughness: 0.4,
  metalness: 0.2,
});

const greenSafetyMat = new THREE.MeshStandardMaterial({
  color: 0x16a34a, // Switch normal green
  roughness: 0.4,
  metalness: 0.2,
});

const siloSteelMat = new THREE.MeshStandardMaterial({
  color: 0xe4e4e7,
  roughness: 0.35,
  metalness: 0.7,
});

export interface TrackSceneObjects {
  rootGroup: THREE.Group;
  switchTargetMesh?: THREE.Mesh;
  bumpingPostMesh?: THREE.Group;
  trackLengthMeters: number;
  sidingPositions: { x: number; z: number; rotationY: number }[];
}

/**
 * Creates a straight section of track with ballast, ties, and steel rails
 */
function createStraightTrackSection(
  lengthMeters: number,
  centerX = 0,
  startZ = -lengthMeters / 2,
  includeBallast = true
): THREE.Group {
  const group = new THREE.Group();
  group.position.x = centerX;

  // Ballast roadbed (trapezoidal berm)
  if (includeBallast) {
    const ballastGeo = new THREE.BoxGeometry(3.8, 0.22, lengthMeters);
    const ballast = new THREE.Mesh(ballastGeo, ballastMat);
    ballast.position.set(0, 0.1, startZ + lengthMeters / 2);
    ballast.receiveShadow = true;
    group.add(ballast);
  }

  // Cross ties (spaced ~0.55m = ~22 inches apart)
  const tieGeo = new THREE.BoxGeometry(2.6, 0.18, 0.22);
  const tieSpacing = 0.55;
  const numTies = Math.floor(lengthMeters / tieSpacing);

  for (let i = 0; i <= numTies; i++) {
    const z = startZ + i * tieSpacing;
    const tie = new THREE.Mesh(tieGeo, woodTieMat);
    tie.position.set(0, 0.2, z);
    tie.receiveShadow = true;
    group.add(tie);
  }

  // Steel rails (standard gauge = 1.435m apart -> +/- 0.717m from center)
  const railGeo = new THREE.BoxGeometry(0.08, 0.16, lengthMeters);
  [-0.718, 0.718].forEach((xSide) => {
    const rail = new THREE.Mesh(railGeo, railSteelMat);
    rail.position.set(xSide, 0.32, startZ + lengthMeters / 2);
    rail.castShadow = true;
    group.add(rail);
  });

  return group;
}

/**
 * Creates end-of-track bumping post
 */
function createBumpingPost(): THREE.Group {
  const post = new THREE.Group();

  // Steel A-frame bumper
  const frameGeo = new THREE.BoxGeometry(2.2, 1.2, 0.8);
  const frame = new THREE.Mesh(frameGeo, redSafetyMat);
  frame.position.set(0, 0.7, 0);
  frame.castShadow = true;
  post.add(frame);

  // Hard rubber striker pad
  const padGeo = new THREE.BoxGeometry(1.6, 0.45, 0.2);
  const pad = new THREE.Mesh(padGeo, groundMat);
  pad.position.set(0, 0.7, 0.45);
  post.add(pad);

  // Red reflective disk
  const diskGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
  diskGeo.rotateX(Math.PI / 2);
  const disk = new THREE.Mesh(diskGeo, redSafetyMat);
  disk.position.set(0, 0.7, 0.56);
  post.add(disk);

  return post;
}

/**
 * Creates turnout / switch stand with rotatable green/red target
 */
function createSwitchStand(): { group: THREE.Group; targetMesh: THREE.Mesh } {
  const group = new THREE.Group();

  // Base mast
  const mastGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 12);
  const mast = new THREE.Mesh(mastGeo, groundMat);
  mast.position.set(0, 1.0, 0);
  group.add(mast);

  // Target lantern (Green for straight, Red for reverse/diverging)
  const targetGeo = new THREE.BoxGeometry(0.4, 0.4, 0.08);
  const targetMesh = new THREE.Mesh(targetGeo, greenSafetyMat);
  targetMesh.position.set(0, 1.9, 0);
  group.add(targetMesh);

  return { group, targetMesh };
}

/**
 * Creates warehouse loading platform alongside track
 */
function createWarehousePlatform(lengthMeters: number, trackX: number): THREE.Group {
  const dock = new THREE.Group();
  const dockWidth = 7.0;
  const dockHeight = 1.25; // Floor height matches boxcar door height!
  const dockX = trackX + 1.435 / 2 + dockWidth / 2 + 0.95; // Exact FRA 8ft 6in clearance!

  // Concrete deck
  const deckGeo = new THREE.BoxGeometry(dockWidth, dockHeight, lengthMeters);
  const deck = new THREE.Mesh(deckGeo, concreteMat);
  deck.position.set(dockX, dockHeight / 2, 0);
  deck.receiveShadow = true;
  deck.castShadow = true;
  dock.add(deck);

  // Safety yellow edge strip
  const edgeGeo = new THREE.BoxGeometry(0.25, 0.05, lengthMeters);
  const edge = new THREE.Mesh(edgeGeo, yellowSafetyMat);
  edge.position.set(dockX - dockWidth / 2 + 0.125, dockHeight + 0.025, 0);
  dock.add(edge);

  // Overhead weather canopy
  const canopyHeight = 4.8;
  const canopyGeo = new THREE.BoxGeometry(dockWidth + 1.5, 0.2, lengthMeters);
  const canopy = new THREE.Mesh(canopyGeo, groundMat);
  canopy.position.set(dockX - 0.75, canopyHeight, 0);
  canopy.castShadow = true;
  dock.add(canopy);

  // Support columns
  const colGeo = new THREE.BoxGeometry(0.35, canopyHeight, 0.35);
  for (let z = -lengthMeters / 2 + 4; z <= lengthMeters / 2 - 4; z += 12) {
    const col = new THREE.Mesh(colGeo, steelDarkMat);
    col.position.set(dockX + dockWidth / 2 - 0.4, canopyHeight / 2, z);
    dock.add(col);
  }

  // Roll-up industrial cargo doors
  const doorGeo = new THREE.BoxGeometry(0.1, 2.8, 3.2);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.5 });
  for (let z = -lengthMeters / 2 + 8; z <= lengthMeters / 2 - 8; z += 14) {
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(dockX + dockWidth / 2 - 0.05, 1.25 + 1.4, z);
    dock.add(door);
  }

  return dock;
}

const steelDarkMat = new THREE.MeshStandardMaterial({
  color: 0x27272a,
  roughness: 0.5,
  metalness: 0.6,
});

/**
 * Creates vertical grain / mineral silos
 */
function createGrainSilos(trackX: number): THREE.Group {
  const siloGroup = new THREE.Group();
  const radius = 3.6;
  const height = 14.0;
  const siloX = trackX - 7.5;

  [-8, 0, 8].forEach((zPos) => {
    // Silo cylinder
    const cylGeo = new THREE.CylinderGeometry(radius, radius, height, 24);
    const silo = new THREE.Mesh(cylGeo, siloSteelMat);
    silo.position.set(siloX, height / 2, zPos);
    silo.castShadow = true;
    silo.receiveShadow = true;
    siloGroup.add(silo);

    // Conical roof
    const coneGeo = new THREE.ConeGeometry(radius, 2.2, 24);
    const cone = new THREE.Mesh(coneGeo, siloSteelMat);
    cone.position.set(siloX, height + 1.1, zPos);
    siloGroup.add(cone);
  });

  // Top overhead conveyor gantry connecting silos
  const gantryGeo = new THREE.BoxGeometry(1.2, 1.2, 22.0);
  const gantry = new THREE.Mesh(gantryGeo, steelDarkMat);
  gantry.position.set(siloX, height + 2.0, 0);
  siloGroup.add(gantry);

  // Discharge spouts pointing toward siding track
  [-8, 0, 8].forEach((zPos) => {
    const spoutGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.2, 12);
    spoutGeo.rotateZ(-Math.PI / 3);
    const spout = new THREE.Mesh(spoutGeo, steelDarkMat);
    spout.position.set(siloX + 2.4, 5.5, zPos);
    siloGroup.add(spout);
  });

  return siloGroup;
}

/**
 * Creates yard floodlight tower
 */
function createFloodlightTower(x: number, z: number): THREE.Group {
  const tower = new THREE.Group();
  tower.position.set(x, 0, z);

  const poleHeight = 16.0;
  const poleGeo = new THREE.CylinderGeometry(0.25, 0.45, poleHeight, 12);
  const pole = new THREE.Mesh(poleGeo, steelDarkMat);
  pole.position.y = poleHeight / 2;
  tower.add(pole);

  // Light rack
  const rackGeo = new THREE.BoxGeometry(2.4, 0.6, 0.8);
  const rack = new THREE.Mesh(rackGeo, steelDarkMat);
  rack.position.set(0, poleHeight, 0);
  tower.add(rack);

  // Spot light fixture
  const spotGeo = new THREE.BoxGeometry(0.5, 0.4, 0.3);
  const spotMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.8,
  });
  [-0.7, 0, 0.7].forEach((xOffset) => {
    const lamp = new THREE.Mesh(spotGeo, spotMat);
    lamp.position.set(xOffset, poleHeight - 0.3, 0.4);
    tower.add(lamp);
  });

  return tower;
}

/**
 * Master track scene builder based on preset configuration
 */
export function buildTrackScene(
  preset: TrackLayoutPreset,
  trackLengthFt: number
): TrackSceneObjects {
  const rootGroup = new THREE.Group();
  const trackLengthMeters = trackLengthFt * 0.3048;

  // Ground plane (industrial gravel yard)
  const groundGeo = new THREE.PlaneGeometry(trackLengthMeters + 80, 80);
  groundGeo.rotateX(-Math.PI / 2);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  rootGroup.add(ground);

  // Mainline track (always runs parallel on X = -5.0)
  const mainlineX = -5.0;
  const mainline = createStraightTrackSection(trackLengthMeters + 40, mainlineX, -(trackLengthMeters + 40) / 2);
  rootGroup.add(mainline);

  // Switch stand near turnout origin (Z = -trackLengthMeters / 2 + 10)
  const switchZ = -trackLengthMeters / 2 + 12;
  const { group: switchStand, targetMesh } = createSwitchStand();
  switchStand.position.set(mainlineX + 2.2, 0, switchZ);
  rootGroup.add(switchStand);

  // Fouling / Clearance point marker (Where track spacing is 13 ft = 3.96m)
  const foulingZ = switchZ + 22;
  const foulingPoleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12);
  const foulingPole = new THREE.Mesh(foulingPoleGeo, yellowSafetyMat);
  foulingPole.position.set(mainlineX + 3.2, 0.9, foulingZ);
  rootGroup.add(foulingPole);

  const sidingPositions: { x: number; z: number; rotationY: number }[] = [];
  let bumpingPostMesh: THREE.Group | undefined;

  switch (preset) {
    case 'single-spur': {
      // Siding track parallel at X = 2.0, starts after turnout and ends with bumping post
      const sidingX = 2.0;
      const sidingStart = switchZ + 18;
      const sidingLength = trackLengthMeters - (sidingStart - (-trackLengthMeters / 2)) - 5;

      // Connecting lead curve / tangent from turnout to siding
      const leadTrack = createStraightTrackSection(18, (mainlineX + sidingX) / 2, switchZ);
      leadTrack.rotation.y = 0.28; // ~16 deg diverging angle
      rootGroup.add(leadTrack);

      const sidingTrack = createStraightTrackSection(sidingLength, sidingX, sidingStart);
      rootGroup.add(sidingTrack);

      // Bumping post at end of spur
      bumpingPostMesh = createBumpingPost();
      bumpingPostMesh.position.set(sidingX, 0, sidingStart + sidingLength);
      rootGroup.add(bumpingPostMesh);

      // Precompute car placement slots on siding
      const carSlotSpacing = 19.5; // ~64 ft per car with couplers
      const maxCars = Math.floor((sidingLength - 8) / carSlotSpacing);
      for (let i = 0; i < maxCars; i++) {
        sidingPositions.push({
          x: sidingX,
          z: sidingStart + 12 + i * carSlotSpacing,
          rotationY: 0,
        });
      }

      // Floodlights
      rootGroup.add(createFloodlightTower(sidingX + 6, sidingStart + sidingLength * 0.3));
      rootGroup.add(createFloodlightTower(sidingX + 6, sidingStart + sidingLength * 0.7));
      break;
    }

    case 'double-ended': {
      // Siding track parallel at X = 3.0, connected at BOTH ends
      const sidingX = 3.0;
      const sidingStart = switchZ + 16;
      const sidingEnd = trackLengthMeters / 2 - 20;
      const sidingLength = sidingEnd - sidingStart;

      // South turnout lead
      const southLead = createStraightTrackSection(18, (mainlineX + sidingX) / 2, switchZ);
      southLead.rotation.y = 0.32;
      rootGroup.add(southLead);

      // Tangent siding track
      const sidingTrack = createStraightTrackSection(sidingLength, sidingX, sidingStart);
      rootGroup.add(sidingTrack);

      // North turnout lead
      const northLead = createStraightTrackSection(18, (mainlineX + sidingX) / 2, sidingEnd);
      northLead.rotation.y = -0.32;
      rootGroup.add(northLead);

      // Second switch stand at north end
      const northSwitch = createSwitchStand();
      northSwitch.group.position.set(mainlineX + 2.2, 0, sidingEnd + 14);
      rootGroup.add(northSwitch.group);

      // Car positions
      const carSlotSpacing = 19.5;
      const maxCars = Math.floor((sidingLength - 12) / carSlotSpacing);
      for (let i = 0; i < maxCars; i++) {
        sidingPositions.push({
          x: sidingX,
          z: sidingStart + 10 + i * carSlotSpacing,
          rotationY: 0,
        });
      }

      // Floodlights
      rootGroup.add(createFloodlightTower(sidingX + 6, sidingStart + sidingLength * 0.25));
      rootGroup.add(createFloodlightTower(sidingX + 6, sidingStart + sidingLength * 0.75));
      break;
    }

    case 'multi-transload': {
      // 3 parallel tracks: Track 1 at X = 1.5, Track 2 at X = 7.0, Track 3 at X = 12.5
      const trackSpacing = 5.2;
      const sidingStart = switchZ + 20;
      const sidingLength = trackLengthMeters - 35;

      [1, 2, 3].forEach((trkNum) => {
        const xPos = 1.0 + (trkNum - 1) * trackSpacing;
        const lead = createStraightTrackSection(22, (mainlineX + xPos) / 2, switchZ);
        lead.rotation.y = 0.22 * trkNum;
        rootGroup.add(lead);

        const trk = createStraightTrackSection(sidingLength, xPos, sidingStart);
        rootGroup.add(trk);

        const bumper = createBumpingPost();
        bumper.position.set(xPos, 0, sidingStart + sidingLength);
        rootGroup.add(bumper);

        // Concrete transload apron between tracks
        const apronGeo = new THREE.BoxGeometry(trackSpacing - 2.8, 0.15, sidingLength * 0.75);
        const apron = new THREE.Mesh(apronGeo, concreteMat);
        apron.position.set(xPos + trackSpacing / 2, 0.08, sidingStart + sidingLength * 0.4);
        rootGroup.add(apron);
      });

      // Car positions alternate on track 1 and 2
      const carSlotSpacing = 19.5;
      const carsPerTrack = Math.floor((sidingLength - 10) / carSlotSpacing);
      for (let i = 0; i < carsPerTrack; i++) {
        sidingPositions.push({
          x: 1.0,
          z: sidingStart + 10 + i * carSlotSpacing,
          rotationY: 0,
        });
        if (sidingPositions.length < 35) {
          sidingPositions.push({
            x: 1.0 + trackSpacing,
            z: sidingStart + 10 + i * carSlotSpacing,
            rotationY: 0,
          });
        }
      }

      // Floodlight towers
      rootGroup.add(createFloodlightTower(16, sidingStart + sidingLength * 0.3));
      rootGroup.add(createFloodlightTower(16, sidingStart + sidingLength * 0.7));
      break;
    }

    case 'warehouse-dock': {
      const sidingX = 2.0;
      const sidingStart = switchZ + 18;
      const sidingLength = trackLengthMeters - (sidingStart - (-trackLengthMeters / 2)) - 5;

      const lead = createStraightTrackSection(18, (mainlineX + sidingX) / 2, switchZ);
      lead.rotation.y = 0.28;
      rootGroup.add(lead);

      const sidingTrack = createStraightTrackSection(sidingLength, sidingX, sidingStart);
      rootGroup.add(sidingTrack);

      // Loading dock on right side of siding
      const dock = createWarehousePlatform(sidingLength * 0.85, sidingX);
      dock.position.z = sidingStart + (sidingLength * 0.85) / 2 + 5;
      rootGroup.add(dock);

      // Agri silos on left side of mainline
      const silos = createGrainSilos(mainlineX);
      silos.position.z = switchZ + 45;
      rootGroup.add(silos);

      // Bumping post
      bumpingPostMesh = createBumpingPost();
      bumpingPostMesh.position.set(sidingX, 0, sidingStart + sidingLength);
      rootGroup.add(bumpingPostMesh);

      // Car positions
      const carSlotSpacing = 19.5;
      const maxCars = Math.floor((sidingLength - 8) / carSlotSpacing);
      for (let i = 0; i < maxCars; i++) {
        sidingPositions.push({
          x: sidingX,
          z: sidingStart + 12 + i * carSlotSpacing,
          rotationY: 0,
        });
      }

      rootGroup.add(createFloodlightTower(sidingX + 10, sidingStart + sidingLength * 0.5));
      break;
    }
  }

  return {
    rootGroup,
    switchTargetMesh: targetMesh,
    bumpingPostMesh,
    trackLengthMeters,
    sidingPositions,
  };
}
