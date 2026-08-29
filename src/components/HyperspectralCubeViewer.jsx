import React, { useEffect, useRef } from 'react';

export default function HyperspectralCubeViewer({ isDarkMode = true, isScanning = false, sampleName = null }) {
  const containerRef = useRef(null);

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

    // Soft uniform studio lighting (No harsh central blown-out point lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.95 : 1.25);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x18C7D1, 1.2);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7568F7, 0.9);
    dirLight2.position.set(-15, -12, -15);
    scene.add(dirLight2);

    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Cube Configuration
    const cubeWidth = 7.5;
    const cubeDepth = 7.5;
    const cubeHeight = 8.0;
    const layersCount = 9;
    const layerSpacing = cubeHeight / (layersCount - 1);

    // 1. Clean Bounding Box Edges (NO diagonal wireframe triangles)
    const boxGeom = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
    const edgesGeom = new THREE.EdgesGeometry(boxGeom);
    const edgesMat = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x233B50 : 0xD8E3EA,
      transparent: true,
      opacity: isDarkMode ? 0.65 : 0.9,
      linewidth: 1.5
    });
    const boxEdges = new THREE.LineSegments(edgesGeom, edgesMat);
    cubeGroup.add(boxEdges);

    // 2. Continuous Spectral Wavelength Planes (400nm -> 1000nm Gradient)
    const spectralColors = [
      0x0B3C70, // 400nm Deep UV
      0x1261A0, // 480nm Blue
      0x10AFC0, // 540nm Cyan
      0x18C7D1, // 600nm Hyperspectral Cyan
      0x29C98A, // 660nm Biofilm Green
      0x35B9E9, // 720nm Electric Blue
      0x665BE8, // 800nm NIR Violet
      0x7568F7, // 900nm Deep Violet
      0x9B91FF  // 1000nm IR
    ];

    const planeMeshes = [];

    // Generate procedural biological heatmap texture for the top spatial slice
    const createBiofilmTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Base background
      ctx.fillStyle = '#0B1726';
      ctx.fillRect(0, 0, 256, 256);

      // Radial biofilm colony patches
      const colonies = [
        { x: 100, y: 110, r: 65, color: 'rgba(24, 199, 209, 0.7)' },
        { x: 170, y: 150, r: 50, color: 'rgba(117, 104, 247, 0.65)' },
        { x: 80, y: 180, r: 40, color: 'rgba(53, 185, 233, 0.6)' },
        { x: 180, y: 80, r: 45, color: 'rgba(18, 97, 160, 0.75)' }
      ];

      colonies.forEach((c) => {
        const grad = ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, c.r);
        grad.addColorStop(0, c.color);
        grad.addColorStop(0.7, c.color.replace(/[\d\.]+\)$/, '0.25)'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const topTexture = createBiofilmTexture();

    for (let i = 0; i < layersCount; i++) {
      const isTopLayer = i === layersCount - 1;
      const planeGeom = new THREE.PlaneGeometry(cubeWidth * 0.98, cubeDepth * 0.98);

      const mat = new THREE.MeshStandardMaterial({
        color: isTopLayer ? 0xffffff : spectralColors[i],
        map: isTopLayer ? topTexture : null,
        transparent: true,
        opacity: isTopLayer ? 0.85 : isDarkMode ? 0.32 : 0.42,
        roughness: 0.35,
        metalness: 0.2,
        side: THREE.DoubleSide
      });

      const plane = new THREE.Mesh(planeGeom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - (layersCount - 1) / 2) * layerSpacing;
      cubeGroup.add(plane);
      planeMeshes.push(plane);

      // Subtle edge line for each spectral plane
      const planeEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(planeGeom),
        new THREE.LineBasicMaterial({
          color: spectralColors[i],
          transparent: true,
          opacity: 0.5
        })
      );
      planeEdge.rotation.x = -Math.PI / 2;
      planeEdge.position.y = plane.position.y;
      cubeGroup.add(planeEdge);
    }

    // 3. Precision Laser Sweep Plane
    const scanGeom = new THREE.PlaneGeometry(cubeWidth * 1.02, cubeDepth * 1.02);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x18C7D1,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const scanPlane = new THREE.Mesh(scanGeom, scanMat);
    scanPlane.rotation.x = -Math.PI / 2;
    cubeGroup.add(scanPlane);

    // Laser border line
    const scanEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(scanGeom),
      new THREE.LineBasicMaterial({ color: 0x18C7D1, transparent: true, opacity: 0.95 })
    );
    scanEdge.rotation.x = -Math.PI / 2;
    scanPlane.add(scanEdge);

    // 4. Subtle Photon / Optical Particles
    const particleCount = 80;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * (cubeWidth * 1.2);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * (cubeHeight * 1.1);
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * (cubeDepth * 1.2);

      const isCyan = i % 2 === 0;
      particleColors[i * 3] = isCyan ? 0.09 : 0.46;
      particleColors[i * 3 + 1] = isCyan ? 0.78 : 0.41;
      particleColors[i * 3 + 2] = isCyan ? 0.82 : 0.97;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: isDarkMode ? 0.7 : 0.6
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    cubeGroup.add(particles);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controls) controls.update();

      // Gentle continuous rotation
      cubeGroup.rotation.y = elapsedTime * 0.16;
      cubeGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.06;

      // Laser scan sweep
      const scanSpeed = isScanning ? 4.5 : 1.8;
      scanPlane.position.y = Math.sin(elapsedTime * scanSpeed) * (cubeHeight * 0.46);

      // Particle subtle motion
      particles.rotation.y = -elapsedTime * 0.05;

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
  }, [isDarkMode, isScanning, sampleName]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
