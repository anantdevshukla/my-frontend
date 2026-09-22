import React, { useEffect, useRef } from 'react';
import { getBiofilmByQuery, mainBiofilmImg } from '../utils/biofilmAssets';

export default function HyperspectralCubeViewer({ isScanning = false, sampleName = null, target = null }) {
  const containerRef = useRef(null);

  const matchedBiofilm = target || sampleName ? getBiofilmByQuery(target || sampleName) : null;
  const activeImage = matchedBiofilm ? matchedBiofilm.image : mainBiofilmImg;

  useEffect(() => {
    if (!containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(16, 12, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    let controls;
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.maxDistance = 35;
      controls.minDistance = 8;
    }

    // Studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x48F5A3, 1.5);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x18C77A, 1.0);
    dirLight2.position.set(-15, -12, -15);
    scene.add(dirLight2);

    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Texture Loader for real Biofilm image
    const textureLoader = new THREE.TextureLoader();
    const biofilmTexture = textureLoader.load(activeImage);
    biofilmTexture.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;

    // Cube Configuration
    const cubeWidth = 7.5;
    const cubeDepth = 7.5;
    const cubeHeight = 8.0;
    const layersCount = 9;
    const layerSpacing = cubeHeight / (layersCount - 1);

    // 1. Clean Bounding Box Edges
    const boxGeom = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
    const edgesGeom = new THREE.EdgesGeometry(boxGeom);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x1B4435,
      transparent: true,
      opacity: 0.75,
      linewidth: 1.5
    });
    const boxEdges = new THREE.LineSegments(edgesGeom, edgesMat);
    cubeGroup.add(boxEdges);

    // 2. Continuous Spectral Wavelength Planes
    const spectralColors = [
      0x061A14, // 400nm Deep Green
      0x0A241B, // 480nm
      0x0D2B20, // 540nm
      0x11382A, // 600nm
      0x18C77A, // 660nm Emerald
      0x20E08B, // 720nm Bright Emerald
      0x48F5A3, // 800nm Luminous
      0x9BEFCE, // 900nm Mint
      0x18C77A  // 1000nm NIR
    ];

    for (let i = 0; i < layersCount; i++) {
      const isTopLayer = i === layersCount - 1;
      const planeGeom = new THREE.PlaneGeometry(cubeWidth * 0.98, cubeDepth * 0.98, 12, 12);

      const pos = planeGeom.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const u = pos.getX(j);
        const v = pos.getY(j);
        const z = Math.sin(u * 0.35 + i * 0.6) * Math.cos(v * 0.35) * 0.18;
        pos.setZ(j, z);
      }
      planeGeom.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: isTopLayer ? 0xffffff : spectralColors[i],
        map: isTopLayer ? biofilmTexture : null,
        transparent: true,
        opacity: isTopLayer ? 0.95 : 0.35,
        roughness: 0.35,
        metalness: 0.2,
        side: THREE.DoubleSide
      });

      const plane = new THREE.Mesh(planeGeom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - (layersCount - 1) / 2) * layerSpacing;
      cubeGroup.add(plane);

      // Edge line for each plane
      const planeEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(planeGeom),
        new THREE.LineBasicMaterial({
          color: isTopLayer ? 0x48F5A3 : 0x18C77A,
          transparent: true,
          opacity: isTopLayer ? 0.85 : 0.45
        })
      );
      planeEdge.rotation.x = -Math.PI / 2;
      planeEdge.position.y = plane.position.y;
      cubeGroup.add(planeEdge);
    }

    // 3. Precision Laser Sweep Plane
    const laserGeom = new THREE.PlaneGeometry(cubeWidth * 1.05, cubeDepth * 1.05);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x48F5A3,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const laserPlane = new THREE.Mesh(laserGeom, laserMat);
    laserPlane.rotation.x = -Math.PI / 2;
    cubeGroup.add(laserPlane);

    // Laser outer rim
    const laserRing = new THREE.LineSegments(
      new THREE.EdgesGeometry(laserGeom),
      new THREE.LineBasicMaterial({ color: 0x48F5A3, linewidth: 2 })
    );
    laserRing.rotation.x = -Math.PI / 2;
    laserPlane.add(laserRing);

    // 4. Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (controls) controls.update();

      const elapsedTime = clock.getElapsedTime();
      cubeGroup.rotation.y = elapsedTime * (isScanning ? 0.35 : 0.15);

      // Sweep laser vertically through the cube
      const sweepSpeed = isScanning ? 2.8 : 1.2;
      const progress = (Math.sin(elapsedTime * sweepSpeed) + 1) / 2;
      laserPlane.position.y = (progress - 0.5) * cubeHeight;

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
  }, [sampleName, target, isScanning]);

  return (
    <div className="relative w-full h-[380px] sm:h-[430px] rounded-2xl bg-[#0A241B]/70 border border-[#1B4435] overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Specimen Tag Overlay */}
      <div className="absolute top-3 left-4 flex items-center gap-2.5 text-xs font-mono text-[#F4FFF9] bg-[#0D2B20]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#1B4435] shadow-sm pointer-events-none">
        <img
          src={activeImage}
          alt={matchedBiofilm ? matchedBiofilm.name : 'Biofilm Reference'}
          className="w-4 h-4 rounded-full object-cover border border-[#48F5A3]"
        />
        <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-pulse"></span>
        <span>{matchedBiofilm ? `${matchedBiofilm.short} HSI Tensor` : 'Biofilm Reference Cube'}</span>
      </div>

      <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] font-mono text-[#829A90] bg-[#061A14]/80 px-2 py-0.5 rounded border border-[#1B4435]">
        🖱 Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
}
