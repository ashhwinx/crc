import * as THREE from 'three';
import type { RailcarCategoryKey } from './types';
import { RAILCAR_PROFILES } from './constants';

// Shared materials cache for performance
const materialsCache = new Map<string, THREE.Material>();

function getMaterial(color: string, roughness = 0.6, metalness = 0.3): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}`;
  if (!materialsCache.has(key)) {
    materialsCache.set(
      key,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness,
      })
    );
  }
  return materialsCache.get(key) as THREE.MeshStandardMaterial;
}

const steelDarkMat = getMaterial('#27272A', 0.5, 0.6); // Wheelsets & underframe
const steelCouplerMat = getMaterial('#3F3F46', 0.4, 0.7);
const wheelSteelMat = getMaterial('#71717A', 0.3, 0.8);

/**
 * Creates a standard AAR 2-axle roller-bearing truck (bogie)
 */
function createTruckMesh(): THREE.Group {
  const truck = new THREE.Group();

  // Side frames (left and right)
  const sideFrameGeo = new THREE.BoxGeometry(0.3, 0.35, 2.2);
  const leftFrame = new THREE.Mesh(sideFrameGeo, steelDarkMat);
  leftFrame.position.set(-0.85, 0.25, 0);
  leftFrame.castShadow = true;
  truck.add(leftFrame);

  const rightFrame = leftFrame.clone();
  rightFrame.position.x = 0.85;
  truck.add(rightFrame);

  // Center bolster
  const bolsterGeo = new THREE.BoxGeometry(1.8, 0.25, 0.5);
  const bolster = new THREE.Mesh(bolsterGeo, steelDarkMat);
  bolster.position.set(0, 0.3, 0);
  bolster.castShadow = true;
  truck.add(bolster);

  // Axles and wheels (2 axles per truck)
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const axleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.65, 12);
  axleGeo.rotateZ(Math.PI / 2);

  [-0.75, 0.75].forEach((zPos) => {
    // Axle
    const axle = new THREE.Mesh(axleGeo, steelDarkMat);
    axle.position.set(0, 0.25, zPos);
    truck.add(axle);

    // Left wheel
    const leftWheel = new THREE.Mesh(wheelGeo, wheelSteelMat);
    leftWheel.position.set(-0.73, 0.25, zPos);
    leftWheel.castShadow = true;
    truck.add(leftWheel);

    // Right wheel
    const rightWheel = new THREE.Mesh(wheelGeo, wheelSteelMat);
    rightWheel.position.set(0.73, 0.25, zPos);
    rightWheel.castShadow = true;
    truck.add(rightWheel);
  });

  return truck;
}

/**
 * Create knuckle coupler with draft gear pocket
 */
function createCouplerMesh(direction: 1 | -1): THREE.Group {
  const couplerGroup = new THREE.Group();

  const shankGeo = new THREE.BoxGeometry(0.3, 0.25, 0.8);
  const shank = new THREE.Mesh(shankGeo, steelCouplerMat);
  shank.position.set(0, 0.45, direction * 0.4);
  couplerGroup.add(shank);

  const headGeo = new THREE.BoxGeometry(0.45, 0.35, 0.35);
  const head = new THREE.Mesh(headGeo, steelDarkMat);
  head.position.set(0, 0.45, direction * 0.8);
  head.castShadow = true;
  couplerGroup.add(head);

  return couplerGroup;
}

/**
 * Builds procedural 3D railcar model by category
 */
export function createRailcar3DModel(category: RailcarCategoryKey): THREE.Group {
  const carGroup = new THREE.Group();
  const profile = RAILCAR_PROFILES[category];
  const primaryMat = getMaterial(profile.primaryColor, 0.65, 0.2);
  const accentMat = getMaterial(profile.accentColor, 0.5, 0.3);

  // Car standard dimensions (Scale: 1 unit ~ 1 meter)
  // 60ft car is approx 18.2m long, 3.2m wide, 4.4m tall
  const lengthMeters = (profile.defaultLengthFt * 0.3048);
  const widthMeters = 3.1;

  // Center sill (heavy underframe backbone)
  const sillGeo = new THREE.BoxGeometry(0.6, 0.45, lengthMeters - 1.2);
  const centerSill = new THREE.Mesh(sillGeo, steelDarkMat);
  centerSill.position.set(0, 0.45, 0);
  centerSill.castShadow = true;
  carGroup.add(centerSill);

  // Crossbearers / underframe cross members
  const crossGeo = new THREE.BoxGeometry(widthMeters - 0.2, 0.2, 0.3);
  for (let z = -lengthMeters / 2 + 3; z <= lengthMeters / 2 - 3; z += 2.4) {
    const cross = new THREE.Mesh(crossGeo, steelDarkMat);
    cross.position.set(0, 0.42, z);
    carGroup.add(cross);
  }

  // Add 2 trucks (front and rear)
  const truckOffset = (lengthMeters / 2) - 2.2;
  const frontTruck = createTruckMesh();
  frontTruck.position.set(0, 0, truckOffset);
  carGroup.add(frontTruck);

  const rearTruck = createTruckMesh();
  rearTruck.position.set(0, 0, -truckOffset);
  carGroup.add(rearTruck);

  // Add couplers
  const frontCoupler = createCouplerMesh(1);
  frontCoupler.position.set(0, 0, lengthMeters / 2);
  carGroup.add(frontCoupler);

  const rearCoupler = createCouplerMesh(-1);
  rearCoupler.position.set(0, 0, -lengthMeters / 2);
  carGroup.add(rearCoupler);

  // Body construction based on specific railcar category
  switch (category) {
    case 'boxcars': {
      // Main boxcar body
      const height = 3.6;
      const bodyGeo = new THREE.BoxGeometry(widthMeters, height, lengthMeters - 0.6);
      const body = new THREE.Mesh(bodyGeo, primaryMat);
      body.position.set(0, 0.55 + height / 2, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      carGroup.add(body);

      // Roof ribs / walk
      const roofWalkGeo = new THREE.BoxGeometry(0.7, 0.08, lengthMeters - 0.5);
      const roofWalk = new THREE.Mesh(roofWalkGeo, accentMat);
      roofWalk.position.set(0, 0.55 + height + 0.04, 0);
      carGroup.add(roofWalk);

      // Double plug doors on each side
      const doorGeo = new THREE.BoxGeometry(0.08, height * 0.85, 3.4);
      [-1, 1].forEach((side) => {
        const door = new THREE.Mesh(doorGeo, getMaterial('#881337', 0.5, 0.4));
        door.position.set(side * (widthMeters / 2 + 0.04), 0.55 + height / 2, 0);
        carGroup.add(door);
      });

      // End Ladders & brake wheel
      const ladderGeo = new THREE.BoxGeometry(0.4, height * 0.8, 0.06);
      const ladder = new THREE.Mesh(ladderGeo, accentMat);
      ladder.position.set(1.1, 0.55 + height / 2, lengthMeters / 2 - 0.28);
      carGroup.add(ladder);

      const brakeWheelGeo = new THREE.TorusGeometry(0.25, 0.04, 8, 16);
      const brakeWheel = new THREE.Mesh(brakeWheelGeo, accentMat);
      brakeWheel.position.set(0.6, 0.55 + height * 0.8, lengthMeters / 2 - 0.25);
      carGroup.add(brakeWheel);
      break;
    }

    case 'covered-hoppers': {
      // Trough hopper body with sloped ends
      const height = 3.4;
      const hopperBodyGeo = new THREE.BoxGeometry(widthMeters, height * 0.85, lengthMeters - 1.2);
      const hopperBody = new THREE.Mesh(hopperBodyGeo, primaryMat);
      hopperBody.position.set(0, 0.75 + height / 2, 0);
      hopperBody.castShadow = true;
      carGroup.add(hopperBody);

      // Sloped ends
      [-1, 1].forEach((dir) => {
        const slopeGeo = new THREE.ConeGeometry(widthMeters / 2, 1.8, 4);
        slopeGeo.rotateY(Math.PI / 4);
        slopeGeo.rotateZ(Math.PI);
        const slope = new THREE.Mesh(slopeGeo, primaryMat);
        slope.position.set(0, 1.2, dir * (lengthMeters / 2 - 1.2));
        carGroup.add(slope);
      });

      // Bottom discharge chutes (3 discharge gates)
      const chuteGeo = new THREE.BoxGeometry(1.4, 0.6, 1.0);
      [-3.5, 0, 3.5].forEach((zPos) => {
        const chute = new THREE.Mesh(chuteGeo, steelDarkMat);
        chute.position.set(0, 0.55, zPos);
        carGroup.add(chute);
      });

      // Top continuous hatch / catwalk
      const hatchGeo = new THREE.BoxGeometry(0.8, 0.12, lengthMeters - 2.0);
      const hatch = new THREE.Mesh(hatchGeo, accentMat);
      hatch.position.set(0, 0.75 + height * 0.85 + 0.06, 0);
      carGroup.add(hatch);
      break;
    }

    case 'open-top-hoppers': {
      // Hollow ribbed open-top hopper
      const height = 2.9;
      // Outer walls
      const wallThick = 0.15;
      const sideWallGeo = new THREE.BoxGeometry(wallThick, height, lengthMeters - 1.0);

      const leftWall = new THREE.Mesh(sideWallGeo, primaryMat);
      leftWall.position.set(-widthMeters / 2 + wallThick / 2, 0.65 + height / 2, 0);
      leftWall.castShadow = true;
      carGroup.add(leftWall);

      const rightWall = leftWall.clone();
      rightWall.position.x = widthMeters / 2 - wallThick / 2;
      carGroup.add(rightWall);

      // End walls
      const endWallGeo = new THREE.BoxGeometry(widthMeters, height, wallThick);
      const frontWall = new THREE.Mesh(endWallGeo, primaryMat);
      frontWall.position.set(0, 0.65 + height / 2, lengthMeters / 2 - 0.5);
      carGroup.add(frontWall);

      const backWall = frontWall.clone();
      backWall.position.z = -lengthMeters / 2 + 0.5;
      carGroup.add(backWall);

      // Sloped hopper floor
      const floorGeo = new THREE.BoxGeometry(widthMeters - 0.3, 0.2, lengthMeters - 1.4);
      const floor = new THREE.Mesh(floorGeo, steelDarkMat);
      floor.position.set(0, 1.1, 0);
      carGroup.add(floor);

      // Coal / Aggregate cargo load inside
      const cargoGeo = new THREE.BoxGeometry(widthMeters - 0.4, 0.9, lengthMeters - 1.8);
      const cargo = new THREE.Mesh(cargoGeo, getMaterial('#18181B', 0.9, 0.1));
      cargo.position.set(0, 1.45, 0);
      carGroup.add(cargo);
      break;
    }

    case 'gondolas': {
      // Low-sided sturdy steel gondola
      const height = 1.7;
      const wallThick = 0.18;

      // Floor deck
      const deckGeo = new THREE.BoxGeometry(widthMeters, 0.25, lengthMeters - 0.8);
      const deck = new THREE.Mesh(deckGeo, steelDarkMat);
      deck.position.set(0, 0.65, 0);
      carGroup.add(deck);

      // Left and right walls
      const sideGeo = new THREE.BoxGeometry(wallThick, height, lengthMeters - 0.8);
      const leftSide = new THREE.Mesh(sideGeo, primaryMat);
      leftSide.position.set(-widthMeters / 2 + wallThick / 2, 0.75 + height / 2, 0);
      leftSide.castShadow = true;
      carGroup.add(leftSide);

      const rightSide = leftSide.clone();
      rightSide.position.x = widthMeters / 2 - wallThick / 2;
      carGroup.add(rightSide);

      // End walls
      const endGeo = new THREE.BoxGeometry(widthMeters, height, wallThick);
      const frontEnd = new THREE.Mesh(endGeo, primaryMat);
      frontEnd.position.set(0, 0.75 + height / 2, lengthMeters / 2 - 0.4);
      carGroup.add(frontEnd);

      const backEnd = frontEnd.clone();
      backEnd.position.z = -lengthMeters / 2 + 0.4;
      carGroup.add(backEnd);

      // Steel scrap / coil load inside
      const coilGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 16);
      coilGeo.rotateX(Math.PI / 2);
      [-3.0, 0, 3.0].forEach((zPos) => {
        const coil = new THREE.Mesh(coilGeo, getMaterial('#4B5563', 0.4, 0.8));
        coil.position.set(0, 1.3, zPos);
        coil.castShadow = true;
        carGroup.add(coil);
      });
      break;
    }

    case 'centerbeam-flatcars': {
      // Flat deck
      const deckGeo = new THREE.BoxGeometry(widthMeters, 0.35, lengthMeters - 0.6);
      const deck = new THREE.Mesh(deckGeo, primaryMat);
      deck.position.set(0, 0.68, 0);
      deck.castShadow = true;
      carGroup.add(deck);

      // Tall end bulkheads
      const bulkheadHeight = 3.6;
      const bulkheadGeo = new THREE.BoxGeometry(widthMeters, bulkheadHeight, 0.45);
      [-1, 1].forEach((dir) => {
        const bulkhead = new THREE.Mesh(bulkheadGeo, primaryMat);
        bulkhead.position.set(0, 0.68 + bulkheadHeight / 2, dir * (lengthMeters / 2 - 0.5));
        bulkhead.castShadow = true;
        carGroup.add(bulkhead);
      });

      // Center A-frame truss partition
      const trussGeo = new THREE.BoxGeometry(0.35, bulkheadHeight, lengthMeters - 1.2);
      const truss = new THREE.Mesh(trussGeo, primaryMat);
      truss.position.set(0, 0.68 + bulkheadHeight / 2, 0);
      carGroup.add(truss);

      // Packaged lumber bundles on both sides
      const bundleGeo = new THREE.BoxGeometry(1.1, 2.2, (lengthMeters - 1.8) / 3 - 0.4);
      const lumberMat = getMaterial('#FDE68A', 0.8, 0.1);

      [-0.85, 0.85].forEach((xSide) => {
        [-4.5, 0, 4.5].forEach((zPos) => {
          const bundle = new THREE.Mesh(bundleGeo, lumberMat);
          bundle.position.set(xSide, 0.68 + 1.1, zPos);
          bundle.castShadow = true;
          carGroup.add(bundle);
        });
      });
      break;
    }

    case 'bulkhead-flatcars': {
      // Heavy flatcar deck
      const deckGeo = new THREE.BoxGeometry(widthMeters, 0.38, lengthMeters - 0.6);
      const deck = new THREE.Mesh(deckGeo, primaryMat);
      deck.position.set(0, 0.68, 0);
      deck.castShadow = true;
      carGroup.add(deck);

      // Tall vertical end bulkheads
      const bulkheadHeight = 3.2;
      const bulkheadGeo = new THREE.BoxGeometry(widthMeters, bulkheadHeight, 0.5);
      [-1, 1].forEach((dir) => {
        const bulkhead = new THREE.Mesh(bulkheadGeo, primaryMat);
        bulkhead.position.set(0, 0.68 + bulkheadHeight / 2, dir * (lengthMeters / 2 - 0.5));
        bulkhead.castShadow = true;
        carGroup.add(bulkhead);
      });

      // Structural steel pipe load
      const pipeGeo = new THREE.CylinderGeometry(0.32, 0.32, lengthMeters - 1.8, 16);
      pipeGeo.rotateX(Math.PI / 2);
      const pipeMat = getMaterial('#475569', 0.3, 0.7);

      [-0.8, 0, 0.8].forEach((xPos) => {
        [1.2, 1.8, 2.4].forEach((yPos) => {
          const pipe = new THREE.Mesh(pipeGeo, pipeMat);
          pipe.position.set(xPos, yPos, 0);
          pipe.castShadow = true;
          carGroup.add(pipe);
        });
      });
      break;
    }

    case 'tank-cars': {
      // Cylindrical pressure vessel
      const tankRadius = 1.45;
      const tankLength = lengthMeters - 3.2;

      const tankGeo = new THREE.CylinderGeometry(tankRadius, tankRadius, tankLength, 24);
      tankGeo.rotateX(Math.PI / 2);
      const tank = new THREE.Mesh(tankGeo, primaryMat);
      tank.position.set(0, 0.7 + tankRadius, 0);
      tank.castShadow = true;
      carGroup.add(tank);

      // Hemispherical tank ends (dished heads)
      const headGeo = new THREE.SphereGeometry(tankRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      [-1, 1].forEach((dir) => {
        const head = new THREE.Mesh(headGeo, primaryMat);
        head.rotation.x = dir * (Math.PI / 2);
        head.position.set(0, 0.7 + tankRadius, dir * (tankLength / 2));
        head.castShadow = true;
        carGroup.add(head);
      });

      // Top expansion dome & manway
      const domeGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.6, 16);
      const dome = new THREE.Mesh(domeGeo, accentMat);
      dome.position.set(0, 0.7 + tankRadius * 2 + 0.25, 0);
      carGroup.add(dome);

      // Top safety platform & walkway
      const platformGeo = new THREE.BoxGeometry(2.0, 0.08, 4.5);
      const platform = new THREE.Mesh(platformGeo, steelDarkMat);
      platform.position.set(0, 0.7 + tankRadius * 2 + 0.04, 0);
      carGroup.add(platform);

      // Orange hazardous placard squares
      const placardGeo = new THREE.BoxGeometry(0.04, 0.45, 0.45);
      const placardMat = getMaterial('#EA580C', 0.5, 0.2);
      [-1, 1].forEach((side) => {
        const placard = new THREE.Mesh(placardGeo, placardMat);
        placard.position.set(side * (tankRadius + 0.02), 0.7 + tankRadius, 2.5);
        placard.rotation.y = Math.PI / 4;
        carGroup.add(placard);
      });
      break;
    }
  }

  return carGroup;
}
