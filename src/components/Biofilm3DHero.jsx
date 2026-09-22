import React, { useEffect, useRef, useState } from 'react';
import { mainBiofilmImg } from '../utils/biofilmAssets';

export default function Biofilm3DHero() {
  const containerRef = useRef(null);
  const [activeChannel, setActiveChannel] = useState(540); // 540nm green/emerald peak
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(18, 14, 22);

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
      controls.enableZoom = false; // smooth page scroll
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.minPolarAngle = Math.PI / 3.8;
    }

    // 2. Studio Laboratory Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const emeraldKeyLight = new THREE.DirectionalLight(0x48F5A3, 1.6);
    emeraldKeyLight.position.set(14, 20, 14);
    scene.add(emeraldKeyLight);

    const mintFillLight = new THREE.DirectionalLight(0x9BEFCE, 0.9);
    mintFillLight.position.set(-14, -10, -14);
    scene.add(mintFillLight);

    const deepGreenRimLight = new THREE.PointLight(0x18C77A, 1.5, 45);
    deepGreenRimLight.position.set(0, 3, 0);
    scene.add(deepGreenRimLight);

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Texture Loader for reference biofilm.png on the main cube
    const textureLoader = new THREE.TextureLoader();
    const biofilmTexture = textureLoader.load(mainBiofilmImg);
    biofilmTexture.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;

    // 3. Hyperspectral Data Cube Matrix (9 Continuous Slices)
    const cubeWidth = 8.5;
    const cubeHeight = 8.8;
    const layersCount = 9;
    const layerSpacing = cubeHeight / (layersCount - 1);

    const spectralEmeraldColors = [
      0x061A14, // 400nm UV
      0x0A241B, // 480nm Deep Green
      0x0D2B20, // 520nm Card Green
      0x11382A, // 560nm Elevated
      0x18C77A, // 620nm Primary Emerald
      0x20E08B, // 680nm Vibrant Emerald
      0x48F5A3, // 750nm Luminous
      0x9BEFCE, // 850nm Soft Mint
      0x18C77A  // 1000nm NIR
    ];

    const planeMeshes = [];

    for (let i = 0; i < layersCount; i++) {
      const isTop = i === layersCount - 1;
      const geom = new THREE.PlaneGeometry(cubeWidth, cubeWidth, 16, 16);

      // Biological wave curvature across spatial dimensions
      const pos = geom.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const u = pos.getX(j);
        const v = pos.getY(j);
        const z = Math.sin(u * 0.35 + i * 0.7) * Math.cos(v * 0.35) * 0.22;
        pos.setZ(j, z);
      }
      geom.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: isTop ? 0xffffff : spectralEmeraldColors[i],
        map: isTop ? biofilmTexture : null,
        transparent: true,
        opacity: isTop ? 0.98 : 0.38,
        roughness: 0.3,
        metalness: 0.15,
        side: THREE.DoubleSide
      });

      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - (layersCount - 1) / 2) * layerSpacing;
      masterGroup.add(plane);
      planeMeshes.push(plane);

      // Clean neon edges around each spectral slice
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({
          color: isTop ? 0x48F5A3 : 0x18C77A,
          transparent: true,
          opacity: isTop ? 0.9 : 0.45
        })
      );
      edge.rotation.x = -Math.PI / 2;
      edge.position.y = plane.position.y;
      masterGroup.add(edge);
    }

    // 4. Outer Bounding Wireframe Box
    const boxGeom = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeWidth);
    const boxEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(boxGeom),
      new THREE.LineBasicMaterial({ color: 0x1B4435, transparent: true, opacity: 0.75 })
    );
    masterGroup.add(boxEdges);

    // 5. Active Laser Scanning Plane
    const laserPlaneGeom = new THREE.PlaneGeometry(cubeWidth * 1.04, cubeWidth * 1.04);
    const laserPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x48F5A3,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const laserPlane = new THREE.Mesh(laserPlaneGeom, laserPlaneMat);
    laserPlane.rotation.x = -Math.PI / 2;
    masterGroup.add(laserPlane);

    // Glowing Laser Perimeter Ring
    const laserRing = new THREE.LineSegments(
      new THREE.EdgesGeometry(laserPlaneGeom),
      new THREE.LineBasicMaterial({ color: 0x48F5A3, linewidth: 2 })
    );
    laserRing.rotation.x = -Math.PI / 2;
    laserPlane.add(laserRing);

    // 6. Volumetric Ambient Optical Particles
    const particleCount = 100;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x48F5A3,
      size: 0.14,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    masterGroup.add(particleSystem);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (controls) controls.update();

      const elapsedTime = clock.getElapsedTime();

      if (!isPausedRef.current) {
        masterGroup.rotation.y = elapsedTime * 0.16;
        masterGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.05;
      }

      // Smooth Laser Sweep
      const laserProgress = (Math.sin(elapsedTime * 1.6) + 1) / 2;
      const laserY = (laserProgress - 0.5) * cubeHeight;
      laserPlane.position.y = laserY;

      // Update Channel HUD
      const channel = Math.round(400 + laserProgress * 600);
      setActiveChannel(channel);

      // Pulse Slices near the laser
      planeMeshes.forEach((mesh) => {
        const dist = Math.abs(mesh.position.y - laserY);
        if (dist < 0.8) {
          mesh.material.opacity = Math.min(0.95, mesh.material.opacity + 0.05);
        } else if (mesh !== planeMeshes[layersCount - 1]) {
          mesh.material.opacity = 0.38;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 480;
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
  }, []);

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] flex items-center justify-center">
      {/* Three.js Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Reference Specimen Badge (Top Left) */}
      <div className="absolute top-3 left-3 bg-[#0D2B20]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#18C77A]/40 shadow-xl flex items-center gap-3">
        <img
          src={mainBiofilmImg}
          alt="Biofilm Reference Sample"
          className="w-8 h-8 rounded-lg object-cover border border-[#48F5A3] shadow-md"
        />
        <div>
          <div className="text-xs font-bold text-[#F4FFF9] font-display flex items-center gap-1.5">
            <span>Biofilm Micro-Structure</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#18C77A]/20 text-[#48F5A3]">
              REFERENCE
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#829A90]">
            Continuous Optical Matrix (X × Y × λ)
          </div>
        </div>
      </div>

      {/* Floating Channel HUD Overlay (Top Right) */}
      <div className="absolute top-3 right-3 bg-[#0D2B20]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#1B4435] text-xs font-mono shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-ping"></span>
          <span className="text-[#829A90]">LASER PROBE:</span>
        </div>
        <span className="font-bold text-[#48F5A3] text-sm">
          {activeChannel} nm
        </span>
      </div>

      {/* Control Bar (Bottom Center) */}
      <div className="absolute bottom-3 left-3 right-3 bg-[#061A14]/85 backdrop-blur-md px-3 py-2 rounded-xl border border-[#1B4435] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[11px] text-[#B4C9C0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
          <span>Hyperspectral Cube Tensor (400 - 1000 nm)</span>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-2.5 py-1 rounded-lg bg-[#0D2B20] hover:bg-[#11382A] text-[10px] font-mono text-[#B4C9C0] border border-[#1B4435] cursor-pointer"
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
    </div>
  );
}
