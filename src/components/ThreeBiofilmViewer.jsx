import React, { useEffect, useRef, useState } from 'react';

// Exact Scientific Spectral Palette:
// #0B3C70, #1261A0, #16C7C7, #35B9E9, #6C63FF, #9B8CFF
const SPECTRAL_PALETTE = [
  0x0B3C70, // Deep Scientific Blue
  0x1261A0, // Scientific Blue (Primary Brand)
  0x16C7C7, // Hyperspectral Cyan
  0x35B9E9, // Electric Blue
  0x6C63FF, // AI Violet
  0x9B8CFF  // Soft Violet
];

export default function ThreeBiofilmViewer({ activeClass, isScanning, isDarkMode = true }) {
  const containerRef = useRef(null);
  const [viewMode, setViewMode] = useState('cube'); // 'cube' | 'biofilm' | 'spectral'
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  const [wavelength, setWavelength] = useState(550); // nm
  const [wireframe, setWireframe] = useState(false);
  const sceneElementsRef = useRef(null);

  // Synchronize autoRotate state into ref so animation loop reads the live value
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 420;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(22, 15, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    let controls;
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxDistance = 55;
      controls.minDistance = 10;
    }

    // Scientific Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.9 : 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x16C7C7, 1.4);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6C63FF, 1.1);
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x35B9E9, 1.2, 40);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Groups for modes
    const cubeGroup = new THREE.Group();
    const biofilmGroup = new THREE.Group();
    const spectralGroup = new THREE.Group();

    // ========================================================
    // 1. HYPERSPECTRAL DATA CUBE (X × Y × λ)
    // ========================================================
    const layersCount = 12;
    const layerMeshes = [];
    const layerSpacing = 1.1;
    const cubeSize = 9.5;

    for (let i = 0; i < layersCount; i++) {
      const geom = new THREE.PlaneGeometry(cubeSize, cubeSize, 8, 8);
      
      const pos = geom.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const u = pos.getX(j);
        const v = pos.getY(j);
        const z = Math.sin(u * 0.4 + i * 0.8) * Math.cos(v * 0.4) * 0.18;
        pos.setZ(j, z);
      }
      geom.computeVertexNormals();

      const color = SPECTRAL_PALETTE[i % SPECTRAL_PALETTE.length];
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: isDarkMode ? 0.38 : 0.42,
        roughness: 0.3,
        metalness: 0.5,
        wireframe: false,
        side: THREE.DoubleSide
      });

      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - layersCount / 2) * layerSpacing;
      cubeGroup.add(plane);
      layerMeshes.push(plane);
    }

    // Outer Bounding Box
    const boxGeom = new THREE.BoxGeometry(cubeSize, layersCount * layerSpacing, cubeSize);
    const boxMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x35B9E9 : 0x1261A0,
      wireframe: true,
      transparent: true,
      opacity: isDarkMode ? 0.25 : 0.35
    });
    const boundingBox = new THREE.Mesh(boxGeom, boxMat);
    cubeGroup.add(boundingBox);

    // Laser Scan plane
    const laserGeom = new THREE.PlaneGeometry(cubeSize * 1.02, cubeSize * 1.02);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x16C7C7,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const laserPlane = new THREE.Mesh(laserGeom, laserMat);
    laserPlane.rotation.x = -Math.PI / 2;
    cubeGroup.add(laserPlane);

    // Corner alignment pins
    const cornerGeom = new THREE.SphereGeometry(0.15, 8, 8);
    const cornerMat = new THREE.MeshBasicMaterial({ color: 0x35B9E9 });
    for (let x of [-cubeSize/2, cubeSize/2]) {
      for (let y of [-layersCount*layerSpacing/2, layersCount*layerSpacing/2]) {
        for (let z of [-cubeSize/2, cubeSize/2]) {
          const m = new THREE.Mesh(cornerGeom, cornerMat);
          m.position.set(x, y, z);
          cubeGroup.add(m);
        }
      }
    }

    // ========================================================
    // 2. 3D BIOFILM MICRO-ENVIRONMENT
    // ========================================================
    const bacteriaMeshes = [];
    const bacteriaCount = 40;

    const baseGeom = new THREE.CylinderGeometry(8, 8.5, 0.6, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x0D1B2A : 0xEEF4F8,
      roughness: 0.7,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const basePlate = new THREE.Mesh(baseGeom, baseMat);
    basePlate.position.y = -3;
    biofilmGroup.add(basePlate);

    const epsGeom = new THREE.SphereGeometry(6, 20, 20);
    const epsMat = new THREE.MeshStandardMaterial({
      color: 0x16C7C7,
      transparent: true,
      opacity: isDarkMode ? 0.16 : 0.14,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: true
    });
    const epsMesh = new THREE.Mesh(epsGeom, epsMat);
    epsMesh.scale.set(1.2, 0.45, 1.2);
    epsMesh.position.y = -1;
    biofilmGroup.add(epsMesh);

    const rodGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.3, 16);
    const sphereGeom = new THREE.SphereGeometry(0.4, 16, 16);

    for (let i = 0; i < bacteriaCount; i++) {
      const isRod = i % 2 === 0;
      const geom = isRod ? rodGeom : sphereGeom;
      let cellColor = SPECTRAL_PALETTE[i % SPECTRAL_PALETTE.length];

      const mat = new THREE.MeshStandardMaterial({
        color: cellColor,
        roughness: 0.4,
        metalness: 0.4,
        emissive: cellColor,
        emissiveIntensity: 0.15
      });

      const mesh = new THREE.Mesh(geom, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 5.2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = -2.2 + Math.random() * 3.2;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      mesh.userData = {
        speedY: (Math.random() - 0.5) * 0.012,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        baseY: mesh.position.y
      };

      biofilmGroup.add(mesh);
      bacteriaMeshes.push(mesh);
    }

    // ========================================================
    // 3. PCA & NEURAL NETWORK NODES
    // ========================================================
    const particleCount = 450;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const clusterCenters = [
      { x: -4.5, y: 2.5, z: -2.5, color: [0.07, 0.38, 0.63] },
      { x: 4.5, y: 2.0, z: -3.5, color: [0.09, 0.78, 0.78] },
      { x: -3.5, y: -2.5, z: 3.5, color: [0.21, 0.73, 0.91] },
      { x: 3.5, y: -2.0, z: 3.5, color: [0.42, 0.39, 1.0] },
      { x: 0, y: 4.5, z: 1.5, color: [0.61, 0.55, 1.0] },
      { x: 0, y: -3.5, z: -2.5, color: [0.04, 0.24, 0.44] }
    ];

    for (let i = 0; i < particleCount; i++) {
      const cluster = clusterCenters[i % clusterCenters.length];
      const spread = 2.0;
      positions[i * 3] = cluster.x + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = cluster.y + (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = cluster.z + (Math.random() - 0.5) * spread;

      colors[i * 3] = cluster.color[0];
      colors[i * 3 + 1] = cluster.color[1];
      colors[i * 3 + 2] = cluster.color[2];
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    spectralGroup.add(particleSystem);

    const axesHelper = new THREE.AxesHelper(7);
    spectralGroup.add(axesHelper);

    scene.add(cubeGroup);
    scene.add(biofilmGroup);
    scene.add(spectralGroup);

    cubeGroup.visible = true;
    biofilmGroup.visible = false;
    spectralGroup.visible = false;

    sceneElementsRef.current = {
      scene,
      camera,
      renderer,
      controls,
      cubeGroup,
      biofilmGroup,
      spectralGroup,
      layerMeshes,
      laserPlane,
      bacteriaMeshes,
      particleSystem
    };

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controls) controls.update();

      // Laser scanning
      if (laserPlane) {
        laserPlane.position.y = Math.sin(elapsedTime * 2.2) * (layersCount * layerSpacing * 0.46);
      }

      // Bacteria gentle float
      bacteriaMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += mesh.userData.rotSpeed;
        mesh.rotation.y += mesh.userData.rotSpeed * 0.7;
        mesh.position.y = mesh.userData.baseY + Math.sin(elapsedTime * 1.8 + idx) * 0.2;
      });

      // Incremental rotation based on live autoRotateRef
      if (autoRotateRef.current) {
        cubeGroup.rotation.y += 0.004;
        biofilmGroup.rotation.y += 0.0035;
        spectralGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [isDarkMode]);

  // Mode switching
  useEffect(() => {
    if (!sceneElementsRef.current) return;
    const { cubeGroup, biofilmGroup, spectralGroup } = sceneElementsRef.current;
    if (cubeGroup && biofilmGroup && spectralGroup) {
      cubeGroup.visible = viewMode === 'cube';
      biofilmGroup.visible = viewMode === 'biofilm';
      spectralGroup.visible = viewMode === 'spectral';
    }
  }, [viewMode]);

  // Wireframe toggle
  useEffect(() => {
    if (!sceneElementsRef.current) return;
    const { layerMeshes } = sceneElementsRef.current;
    if (layerMeshes) {
      layerMeshes.forEach((mesh) => {
        mesh.material.wireframe = wireframe;
      });
    }
  }, [wireframe]);

  const handleWavelengthChange = (val) => {
    setWavelength(val);
    if (!sceneElementsRef.current) return;
    const { layerMeshes, laserPlane } = sceneElementsRef.current;
    const layerIdx = Math.floor(((val - 400) / 600) * (layerMeshes.length - 1));
    layerMeshes.forEach((mesh, idx) => {
      if (idx === layerIdx) {
        mesh.material.opacity = 0.9;
        mesh.material.emissive = new window.THREE.Color(0x16C7C7);
        mesh.material.emissiveIntensity = 0.4;
        if (laserPlane) laserPlane.position.y = mesh.position.y;
      } else {
        mesh.material.opacity = isDarkMode ? 0.35 : 0.4;
        mesh.material.emissive = new window.THREE.Color(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
    });
  };

  return (
    <div className="scientific-card overflow-hidden flex flex-col">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-light-secondary/60 dark:bg-dark-secondary/70 border-b border-light-border dark:border-dark-border gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-brand-cyan"></div>
          <span className="text-xs font-mono tracking-wider uppercase font-semibold text-brand-blue dark:text-brand-electric">
            3D Scientific Profiler
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-light-bg dark:bg-dark-bg p-1 rounded-lg border border-light-border dark:border-dark-border text-xs">
          <button
            onClick={() => setViewMode('cube')}
            className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
              viewMode === 'cube'
                ? 'bg-brand-blue text-white shadow-sm dark:bg-brand-electric dark:text-dark-bg font-semibold'
                : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            Hyperspectral Cube
          </button>
          <button
            onClick={() => setViewMode('biofilm')}
            className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
              viewMode === 'biofilm'
                ? 'bg-brand-blue text-white shadow-sm dark:bg-brand-electric dark:text-dark-bg font-semibold'
                : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            Biofilm Matrix
          </button>
          <button
            onClick={() => setViewMode('spectral')}
            className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
              viewMode === 'spectral'
                ? 'bg-brand-blue text-white shadow-sm dark:bg-brand-electric dark:text-dark-bg font-semibold'
                : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            PCA Cluster (AI)
          </button>
        </div>

        {/* Action buttons with live toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`text-xs px-3 py-1 rounded-md border font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              autoRotate
                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-blue dark:text-brand-cyan font-semibold'
                : 'border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-textSecondary dark:text-dark-textSecondary hover:border-brand-cyan'
            }`}
            title={autoRotate ? 'Pause continuous 3D rotation' : 'Enable continuous 3D rotation'}
          >
            {autoRotate ? '⏸ Pause Spin' : '▶ Spin'}
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`text-xs px-3 py-1 rounded-md border font-mono transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              wireframe
                ? 'border-brand-violet bg-brand-violet/10 text-brand-violet dark:text-brand-darkViolet font-semibold'
                : 'border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-textSecondary dark:text-dark-textSecondary hover:border-brand-cyan'
            }`}
            title="Toggle between solid and wireframe rendering"
          >
            {wireframe ? 'Solid' : 'Wireframe'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[380px] sm:h-[420px] bg-gradient-to-b from-light-secondary/30 via-light-bg to-light-secondary/50 dark:from-dark-bg dark:via-dark-secondary/60 dark:to-dark-bg">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {isScanning && <div className="laser-scanner"></div>}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1.5">
          <div className="text-[11px] font-mono bg-light-card/90 dark:bg-dark-card/90 px-2.5 py-1 rounded border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary shadow-sm w-fit">
            Spatial: 224 × 224 px • Bands: λ₁ ... λₙ
          </div>
          <div className="text-[11px] font-mono bg-light-card/90 dark:bg-dark-card/90 px-2.5 py-1 rounded border border-light-border dark:border-dark-border text-brand-violet dark:text-brand-darkViolet shadow-sm w-fit">
            AI Feature Space: PCA Eigen-projection
          </div>
          {activeClass && (
            <div className="text-[11px] font-mono bg-status-successLight/10 dark:bg-status-successDark/15 px-2.5 py-1 rounded border border-status-successLight/30 dark:border-status-successDark/40 text-status-successLight dark:text-status-successDark font-semibold shadow-sm w-fit">
              Active Signature: {activeClass}
            </div>
          )}
        </div>

        <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] font-mono text-light-textMuted dark:text-dark-textMuted bg-light-card/70 dark:bg-dark-card/70 px-2 py-0.5 rounded border border-light-border dark:border-dark-border">
          🖱 Drag to Orbit • Scroll to Zoom
        </div>
      </div>

      {/* Spectral Band Selector Slider */}
      {viewMode === 'cube' && (
        <div className="px-5 py-3 bg-light-secondary/40 dark:bg-dark-secondary/60 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-brand-blue dark:text-brand-electric font-medium">Spectral Channel:</span>
            <span className="font-mono text-sm font-bold bg-light-card dark:bg-dark-card px-2.5 py-0.5 rounded border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary">
              {wavelength} nm
            </span>
          </div>

          <div className="w-full sm:w-1/2 flex items-center gap-3">
            <span className="text-[11px] font-mono text-light-textMuted dark:text-dark-textMuted">400nm (UV)</span>
            <input
              type="range"
              min="400"
              max="1000"
              step="10"
              value={wavelength}
              onChange={(e) => handleWavelengthChange(Number(e.target.value))}
              className="w-full h-1.5 bg-gradient-to-r from-[#1261A0] via-[#16C7C7] to-[#6C63FF] rounded-lg appearance-none cursor-pointer accent-brand-cyan"
            />
            <span className="text-[11px] font-mono text-light-textMuted dark:text-dark-textMuted">1000nm (NIR)</span>
          </div>
        </div>
      )}
    </div>
  );
}
