import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type {
  TrackLayoutPreset,
  RailcarCategoryKey,
  CameraViewMode,
  LightingMode,
} from './types';
import { buildTrackScene, type TrackSceneObjects } from './trackMeshes';
import { createRailcar3DModel } from './railcarMeshes';

interface TrackVisualizerCanvasProps {
  preset: TrackLayoutPreset;
  trackLengthFt: number;
  railcarCategory: RailcarCategoryKey;
  railcarCount: number;
  viewMode: CameraViewMode;
  lightingMode: LightingMode;
  switchDiverging: boolean;
  onMaxCarsCalculated: (max: number) => void;
}

export const TrackVisualizerCanvas: React.FC<TrackVisualizerCanvasProps> = ({
  preset,
  trackLengthFt,
  railcarCategory,
  railcarCount,
  viewMode,
  lightingMode,
  switchDiverging,
  onMaxCarsCalculated,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const trackSceneRef = useRef<TrackSceneObjects | null>(null);
  const carsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Lighting references
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const floodlightsGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.007);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 800);
    camera.position.set(24, 26, 42);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't dip below ground
    controls.minDistance = 6;
    controls.maxDistance = 320;
    controls.target.set(0, 2, 10);
    controlsRef.current = controls;

    // 5. Environmental Lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1c1917, 0.85);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 250;
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Group for industrial yard floodlights
    const floodlightsGroup = new THREE.Group();
    scene.add(floodlightsGroup);
    floodlightsGroupRef.current = floodlightsGroup;

    // Railcars Group
    const carsGroup = new THREE.Group();
    scene.add(carsGroup);
    carsGroupRef.current = carsGroup;

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update lighting mode (Day / Dusk / Night)
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current) return;
    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const hemi = hemiLightRef.current;

    switch (lightingMode) {
      case 'day':
        scene.background = new THREE.Color(0x93c5fd); // Clear blue daytime sky
        scene.fog = new THREE.FogExp2(0x93c5fd, 0.004);
        dir.color.setHex(0xfffbeb);
        dir.intensity = 1.45;
        dir.position.set(40, 60, 30);
        hemi.color.setHex(0xdbeafe);
        hemi.groundColor.setHex(0x1c1917);
        hemi.intensity = 0.85;
        break;

      case 'dusk':
        scene.background = new THREE.Color(0x431407); // Sunset amber/dusk
        scene.fog = new THREE.FogExp2(0x431407, 0.006);
        dir.color.setHex(0xf97316);
        dir.intensity = 1.85;
        dir.position.set(60, 20, 40); // Low rim light
        hemi.color.setHex(0xfed7aa);
        hemi.groundColor.setHex(0x292524);
        hemi.intensity = 0.6;
        break;

      case 'night':
        scene.background = new THREE.Color(0x09090b); // Midnight yard
        scene.fog = new THREE.FogExp2(0x09090b, 0.009);
        dir.color.setHex(0x38bdf8);
        dir.intensity = 0.35; // Moonlight
        dir.position.set(20, 50, -20);
        hemi.color.setHex(0x1e293b);
        hemi.groundColor.setHex(0x020617);
        hemi.intensity = 0.3;
        break;
    }
  }, [lightingMode]);

  // Rebuild track layout whenever preset or track length changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove previous track objects
    if (trackSceneRef.current) {
      scene.remove(trackSceneRef.current.rootGroup);
    }

    const newTrackScene = buildTrackScene(preset, trackLengthFt);
    scene.add(newTrackScene.rootGroup);
    trackSceneRef.current = newTrackScene;

    onMaxCarsCalculated(newTrackScene.sidingPositions.length);
  }, [preset, trackLengthFt, onMaxCarsCalculated]);

  // Update switch target orientation
  useEffect(() => {
    if (!trackSceneRef.current?.switchTargetMesh) return;
    const target = trackSceneRef.current.switchTargetMesh;
    // Green (0 deg) for straight mainline, Red (90 deg) for diverging
    target.rotation.y = switchDiverging ? Math.PI / 2 : 0;
    (target.material as THREE.MeshStandardMaterial).color.setHex(
      switchDiverging ? 0xdc2626 : 0x16a34a
    );
  }, [switchDiverging]);

  // Place railcars on track siding
  useEffect(() => {
    if (!carsGroupRef.current || !trackSceneRef.current) return;
    const carsGroup = carsGroupRef.current;

    // Clear existing railcars
    while (carsGroup.children.length > 0) {
      const child = carsGroup.children[0];
      carsGroup.remove(child);
    }

    const availableSlots = trackSceneRef.current.sidingPositions;
    const numToPlace = Math.min(railcarCount, availableSlots.length);

    for (let i = 0; i < numToPlace; i++) {
      const slot = availableSlots[i];
      const car = createRailcar3DModel(railcarCategory);
      car.position.set(slot.x, 0, slot.z);
      car.rotation.y = slot.rotationY;
      carsGroup.add(car);
    }
  }, [railcarCategory, railcarCount, preset, trackLengthFt]);

  // Camera View Mode change handler
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (viewMode) {
      case 'orbit':
        camera.position.set(24, 26, 42);
        controls.target.set(0, 2, 10);
        break;

      case 'top-down':
        camera.position.set(0, 95, 12);
        controls.target.set(0, 0, 12);
        break;

      case 'conductor':
        camera.position.set(-1.8, 2.2, -18);
        controls.target.set(2.0, 1.8, 30);
        break;
    }
    controls.update();
  }, [viewMode]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'grab',
      }}
    />
  );
};
