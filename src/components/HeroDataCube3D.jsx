import React, { useEffect, useRef } from 'react';

export default function HeroDataCube3D({ isDarkMode = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
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
      controls.enableZoom = false; // Keep page scroll smooth
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.minPolarAngle = Math.PI / 3.5;
    }

    // Balanced scientific lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.95 : 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x18C7D1, 1.2);
    dirLight1.position.set(12, 18, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7568F7, 1.0);
    dirLight2.position.set(-12, -10, -12);
    scene.add(dirLight2);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Spectral Palette (400nm -> 1000nm Gradient)
    const spectralColors = [
      0x0B3C70, 0x1261A0, 0x10AFC0, 0x18C7D1, 0x35B9E9, 0x665BE8, 0x7568F7, 0x9B91FF
    ];

    const layersCount = 9;
    const cubeSize = 8.5;
    const layerSpacing = 1.05;

    // Layered semi-transparent spectral slices
    for (let i = 0; i < layersCount; i++) {
      const geom = new THREE.PlaneGeometry(cubeSize, cubeSize, 8, 8);
      const pos = geom.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const u = pos.getX(j);
        const v = pos.getY(j);
        const z = Math.sin(u * 0.35 + i * 0.7) * Math.cos(v * 0.35) * 0.22;
        pos.setZ(j, z);
      }
      geom.computeVertexNormals();

      const color = spectralColors[i % spectralColors.length];
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: isDarkMode ? 0.35 : 0.42,
        roughness: 0.3,
        metalness: 0.35,
        side: THREE.DoubleSide
      });

      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - layersCount / 2) * layerSpacing;
      mainGroup.add(plane);

      // Clean plane perimeter outline
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.5 })
      );
      edge.rotation.x = -Math.PI / 2;
      edge.position.y = plane.position.y;
      mainGroup.add(edge);
    }

    // Clean outer bounding box edges (NO diagonal triangles)
    const boxGeom = new THREE.BoxGeometry(cubeSize, layersCount * layerSpacing, cubeSize);
    const boxEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(boxGeom),
      new THREE.LineBasicMaterial({
        color: isDarkMode ? 0x233B50 : 0xD8E3EA,
        transparent: true,
        opacity: isDarkMode ? 0.65 : 0.85
      })
    );
    mainGroup.add(boxEdges);

    // Laser scan slice
    const scanGeom = new THREE.PlaneGeometry(cubeSize * 1.02, cubeSize * 1.02);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x18C7D1,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const scanPlane = new THREE.Mesh(scanGeom, scanMat);
    scanPlane.rotation.x = -Math.PI / 2;
    mainGroup.add(scanPlane);

    // Flowing Photon Particles
    const particleCount = 100;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * (cubeSize * 1.3);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * (layersCount * layerSpacing * 1.2);
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * (cubeSize * 1.3);

      const isCyan = i % 2 === 0;
      particleColors[i * 3] = isCyan ? 0.09 : 0.46;
      particleColors[i * 3 + 1] = isCyan ? 0.78 : 0.41;
      particleColors[i * 3 + 2] = isCyan ? 0.82 : 0.97;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: isDarkMode ? 0.75 : 0.65
    });

    const particlePoints = new THREE.Points(particleGeom, particleMat);
    mainGroup.add(particlePoints);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.6;
      mouseY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controls) controls.update();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.18 + targetX;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.08 + targetY;
      mainGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.35;

      // Laser sweep through spectral channels
      scanPlane.position.y = Math.sin(elapsedTime * 2.0) * (layersCount * layerSpacing * 0.46);

      // Particle subtle flow
      particlePoints.rotation.y = -elapsedTime * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [isDarkMode]);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-4 sm:left-6 pointer-events-none flex items-center gap-2 text-xs font-mono text-[#71879B] dark:text-[#A9B9C9] bg-white/85 dark:bg-[#0F2032]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D8E3EA] dark:border-[#233B50] shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#18C7D1] animate-pulse"></span>
        <span>Hyperspectral Data Cube (X × Y × λ)</span>
      </div>
    </div>
  );
}
