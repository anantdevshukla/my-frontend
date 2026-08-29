import React, { useState, useEffect, useRef } from 'react';

export default function InteractiveWorkflow3D({ isDarkMode }) {
  const containerRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const sceneRef = useRef(null);

  const stages = [
    {
      id: 0,
      title: 'Hyperspectral Data Cube',
      code: 'TIFF Input (X × Y × λ)',
      desc: 'Raw continuous optical matrix capturing contiguous wavelength channels (λ₁...λₙ) across the biofilm micro-environment.',
      spec: 'Continuous multi-band imaging'
    },
    {
      id: 1,
      title: 'Preprocessing & Calibration',
      code: 'R = (I-D)/(W-D)',
      desc: 'Automated dark/white reference standardization and noise filtering. Prepares calibrated spatial reflectance.',
      spec: 'Automated radiometric correction'
    },
    {
      id: 2,
      title: 'PCA Eigen-Projection',
      code: 'Eigenvector Space (PC₁, PC₂, PC₃)',
      desc: 'Principal Component Analysis decomposes spectral covariance into orthogonal eigenvectors, projecting high-dimensional data onto the principal variance hyperplane.',
      spec: 'Preserves 99%+ spectral variance'
    },
    {
      id: 3,
      title: 'CNN Feature Extraction',
      code: 'Tensor [224, 224, 3] → Conv → Pool → Dense',
      desc: 'Deep Convolutional Neural Network with hierarchical feature map stacks, receptive field filters, pooling, and dense representation.',
      spec: 'Conv32 → Conv64 → Conv128 → FC256'
    },
    {
      id: 4,
      title: 'Pathogen Classification',
      code: '6-Class Softmax Output',
      desc: 'Final softmax dense layer calculates posterior probability distribution across the six target pathogen species.',
      spec: '85.3% reported validation accuracy'
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(15, 11, 20);

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
      controls.maxDistance = 45;
      controls.minDistance = 8;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.9 : 1.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x18C7D1, 1.4);
    dirLight1.position.set(12, 18, 14);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7568F7, 1.2);
    dirLight2.position.set(-12, -10, -12);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x35B9E9, 1.3, 40);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Groups for 5 workflow stages
    const stageGroup0 = new THREE.Group(); // Data Cube
    const stageGroup1 = new THREE.Group(); // Preprocessing
    const stageGroup2 = new THREE.Group(); // Real 3D PCA Eigen-Space & Scatter Projection
    const stageGroup3 = new THREE.Group(); // Real CNN Architecture
    const stageGroup4 = new THREE.Group(); // Softmax Classification Network

    // ========================================================
    // STAGE 0: Hyperspectral Data Cube
    // ========================================================
    const cubeSize = 7.5;
    for (let i = 0; i < 8; i++) {
      const geom = new THREE.PlaneGeometry(cubeSize, cubeSize);
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x1261A0 : 0x18C7D1,
        transparent: true,
        opacity: isDarkMode ? 0.35 : 0.45,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - 4) * 0.9;
      stageGroup0.add(plane);
    }
    const boxGeom = new THREE.BoxGeometry(cubeSize, 7.2, cubeSize);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x233B50, wireframe: true });
    stageGroup0.add(new THREE.Mesh(boxGeom, boxMat));

    // ========================================================
    // STAGE 1: Preprocessing & Laser Calibration
    // ========================================================
    for (let i = 0; i < 6; i++) {
      const geom = new THREE.PlaneGeometry(cubeSize, cubeSize);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x18C7D1,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - 3) * 1.1;
      stageGroup1.add(plane);
    }

    // ========================================================
    // STAGE 2: AUTHENTIC 3D PRINCIPAL COMPONENT ANALYSIS (PCA)
    // Eigenvector Axes (PC1, PC2, PC3) + Projection Plane + Data Scatter Cloud + Orthogonal Droplines
    // ========================================================
    const pcaGroup = stageGroup2;

    // 1. Eigenvector 3D Coordinate Arrows
    // Helper function to create an arrow with label cone
    const createEigenVector = (direction, length, color, headLength = 0.8, headWidth = 0.4) => {
      const dir = direction.clone().normalize();
      const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, headLength, headWidth);
      arrow.line.material.linewidth = 2.5;
      return arrow;
    };

    // PC1: Primary Variance Axis (Direction of max dispersion along x-y diagonal, Cyan #18C7D1)
    const pc1Dir = new THREE.Vector3(1.2, 0.7, 0.4).normalize();
    const pc1Arrow = createEigenVector(pc1Dir, 7.5, 0x18C7D1, 1.0, 0.45);
    pcaGroup.add(pc1Arrow);

    // PC1 negative direction extension
    const pc1NegArrow = createEigenVector(pc1Dir.clone().negate(), 6.5, 0x18C7D1, 0.7, 0.35);
    pcaGroup.add(pc1NegArrow);

    // PC2: Secondary Variance Axis (Orthogonal to PC1, Electric Blue #35B9E9)
    const pc2Dir = new THREE.Vector3(-0.5, 1.1, 0.3).normalize();
    const pc2Arrow = createEigenVector(pc2Dir, 5.5, 0x35B9E9, 0.8, 0.35);
    pcaGroup.add(pc2Arrow);

    const pc2NegArrow = createEigenVector(pc2Dir.clone().negate(), 4.5, 0x35B9E9, 0.6, 0.3);
    pcaGroup.add(pc2NegArrow);

    // PC3: Tertiary Variance Axis (Orthogonal Normal, AI Violet #7568F7)
    const pc3Dir = new THREE.Vector3().crossVectors(pc1Dir, pc2Dir).normalize();
    const pc3Arrow = createEigenVector(pc3Dir, 4.0, 0x7568F7, 0.6, 0.28);
    pcaGroup.add(pc3Arrow);

    const pc3NegArrow = createEigenVector(pc3Dir.clone().negate(), 3.5, 0x7568F7, 0.5, 0.25);
    pcaGroup.add(pc3NegArrow);

    // Origin Node
    const originGeom = new THREE.SphereGeometry(0.22, 16, 16);
    const originMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    pcaGroup.add(new THREE.Mesh(originGeom, originMat));

    // 2. PC1 - PC2 Principal Hyperplane (Translucent 2D Projection Disc/Plane)
    const pcaPlaneGeom = new THREE.PlaneGeometry(12, 9, 12, 12);
    const pcaPlaneMat = new THREE.MeshStandardMaterial({
      color: 0x1261A0,
      transparent: true,
      opacity: isDarkMode ? 0.22 : 0.28,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const pcaPlane = new THREE.Mesh(pcaPlaneGeom, pcaPlaneMat);
    // Align plane with PC1 & PC2 directions
    pcaPlane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pc3Dir);
    pcaGroup.add(pcaPlane);

    // Grid outline on PC1-PC2 plane
    const planeWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(pcaPlaneGeom),
      new THREE.LineBasicMaterial({ color: 0x18C7D1, transparent: true, opacity: 0.2 })
    );
    planeWire.quaternion.copy(pcaPlane.quaternion);
    pcaGroup.add(planeWire);

    // 3. High-Dimensional Spectral Data Points (Scatter Cloud) & Projected Shadow Points
    const pointCount = 140;
    const scatterGroup = new THREE.Group();
    const dropLinesGroup = new THREE.Group();

    const pointGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const projPointGeom = new THREE.SphereGeometry(0.08, 8, 8);

    const pointMatCyan = new THREE.MeshStandardMaterial({ color: 0x18C7D1, emissive: 0x18C7D1, emissiveIntensity: 0.4 });
    const pointMatBlue = new THREE.MeshStandardMaterial({ color: 0x35B9E9, emissive: 0x35B9E9, emissiveIntensity: 0.4 });
    const pointMatViolet = new THREE.MeshStandardMaterial({ color: 0x7568F7, emissive: 0x7568F7, emissiveIntensity: 0.4 });
    const projPointMat = new THREE.MeshBasicMaterial({ color: 0x233B50, transparent: true, opacity: 0.7 });

    const dropLineMat = new THREE.LineBasicMaterial({ color: 0x18C7D1, transparent: true, opacity: 0.25 });

    for (let i = 0; i < pointCount; i++) {
      // Create elongated Gaussian distribution along PC1, moderate on PC2, thin on PC3
      const u1 = (Math.random() - 0.5 + (Math.random() - 0.5)) * 4.8; // Long along PC1
      const u2 = (Math.random() - 0.5 + (Math.random() - 0.5)) * 2.8; // Moderate along PC2
      const u3 = (Math.random() - 0.5 + (Math.random() - 0.5)) * 1.4; // Small residual along PC3

      // Calculate 3D position: p = u1*PC1 + u2*PC2 + u3*PC3
      const p3D = new THREE.Vector3()
        .addScaledVector(pc1Dir, u1)
        .addScaledVector(pc2Dir, u2)
        .addScaledVector(pc3Dir, u3);

      // Projected position onto PC1-PC2 plane: pProj = u1*PC1 + u2*PC2
      const pProj = new THREE.Vector3()
        .addScaledVector(pc1Dir, u1)
        .addScaledVector(pc2Dir, u2);

      // 3D Point Mesh
      const mat = i % 3 === 0 ? pointMatCyan : i % 3 === 1 ? pointMatBlue : pointMatViolet;
      const pointMesh = new THREE.Mesh(pointGeom, mat);
      pointMesh.position.copy(p3D);
      scatterGroup.add(pointMesh);

      // Projected Shadow Point Mesh
      const projMesh = new THREE.Mesh(projPointGeom, projPointMat);
      projMesh.position.copy(pProj);
      scatterGroup.add(projMesh);

      // Orthogonal Projection Dropline connecting 3D point to its 2D projected plane position
      if (i % 2 === 0) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([p3D, pProj]);
        const dropLine = new THREE.Line(lineGeom, dropLineMat);
        dropLinesGroup.add(dropLine);
      }
    }

    pcaGroup.add(scatterGroup);
    pcaGroup.add(dropLinesGroup);

    // Covariance Dispersion Ellipsoid Wireframe
    const ellipsoidGeom = new THREE.SphereGeometry(1, 16, 12);
    const ellipsoidMat = new THREE.MeshBasicMaterial({
      color: 0x35B9E9,
      wireframe: true,
      transparent: true,
      opacity: isDarkMode ? 0.18 : 0.24
    });
    const ellipsoid = new THREE.Mesh(ellipsoidGeom, ellipsoidMat);
    ellipsoid.scale.set(5.5, 3.4, 1.8);
    ellipsoid.quaternion.copy(pcaPlane.quaternion);
    pcaGroup.add(ellipsoid);

    // ========================================================
    // STAGE 3: REAL 3D CONVOLUTIONAL NEURAL NETWORK (CNN)
    // Input Tensor -> Conv Block 1 -> Conv Block 2 -> Conv Block 3 -> Dense -> Softmax
    // ========================================================
    const cnnGroup = stageGroup3;

    // 1. Input Volume (224x224x3 Tensor Slab at x = -7)
    const inputSize = 5.2;
    for (let c = 0; c < 3; c++) {
      const inputGeom = new THREE.PlaneGeometry(inputSize, inputSize);
      const inputMat = new THREE.MeshStandardMaterial({
        color: c === 0 ? 0x1261A0 : c === 1 ? 0x18C7D1 : 0x35B9E9,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const inputMesh = new THREE.Mesh(inputGeom, inputMat);
      inputMesh.position.set(-7, 0, (c - 1) * 0.45);
      cnnGroup.add(inputMesh);

      // Grid lines on input layer
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(inputGeom),
        new THREE.LineBasicMaterial({ color: 0x35B9E9, transparent: true, opacity: 0.3 })
      );
      wire.position.copy(inputMesh.position);
      cnnGroup.add(wire);
    }

    // Scanning Kernel Box on Input (3x3 receptive field)
    const kernelGeom = new THREE.PlaneGeometry(1.2, 1.2);
    const kernelMat = new THREE.MeshBasicMaterial({
      color: 0x18C7D1,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const kernelMesh = new THREE.Mesh(kernelGeom, kernelMat);
    kernelMesh.position.set(-6.98, 1.2, 0.46);
    cnnGroup.add(kernelMesh);

    // 2. Conv Block 1 (Conv32 + Pool Feature Map Stack at x = -3.5)
    const conv1Size = 4.0;
    const conv1Count = 5;
    const conv1Meshes = [];
    for (let i = 0; i < conv1Count; i++) {
      const geom = new THREE.PlaneGeometry(conv1Size, conv1Size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x18C7D1,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(-3.5, 0, (i - conv1Count / 2) * 0.55);
      cnnGroup.add(mesh);
      conv1Meshes.push(mesh);

      // Border outline on feature map
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x18C7D1, opacity: 0.7, transparent: true })
      );
      edges.position.copy(mesh.position);
      cnnGroup.add(edges);
    }

    // 3. Pyramidal Projection Frustum Lines (Input Kernel -> Conv1 Map)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x18C7D1,
      transparent: true,
      opacity: 0.65
    });

    const frustumGeom = new THREE.BufferGeometry();
    const frustumPoints = [
      -6.98, 1.8, 0.46,   -3.5, 1.0, -0.8,
      -6.98, 0.6, 0.46,   -3.5, 1.0, -0.8,
      -6.98, 1.8, -0.14,  -3.5, 1.0, -0.8,
      -6.98, 0.6, -0.14,  -3.5, 1.0, -0.8
    ];
    frustumGeom.setAttribute('position', new THREE.Float32BufferAttribute(frustumPoints, 3));
    const frustumLines = new THREE.LineSegments(frustumGeom, lineMat);
    cnnGroup.add(frustumLines);

    // 4. Conv Block 2 (Conv64 + Pool Feature Map Stack at x = 0.2)
    const conv2Size = 2.8;
    const conv2Count = 6;
    for (let i = 0; i < conv2Count; i++) {
      const geom = new THREE.PlaneGeometry(conv2Size, conv2Size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x35B9E9,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0.2, 0, (i - conv2Count / 2) * 0.45);
      cnnGroup.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x35B9E9, opacity: 0.75, transparent: true })
      );
      edges.position.copy(mesh.position);
      cnnGroup.add(edges);
    }

    // 5. Conv Block 3 (Conv128 High-Level Feature Volume at x = 3.6)
    const conv3Size = 1.8;
    const conv3Count = 6;
    for (let i = 0; i < conv3Count; i++) {
      const geom = new THREE.PlaneGeometry(conv3Size, conv3Size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x7568F7,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(3.6, 0, (i - conv3Count / 2) * 0.35);
      cnnGroup.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x7568F7, opacity: 0.8, transparent: true })
      );
      edges.position.copy(mesh.position);
      cnnGroup.add(edges);
    }

    // 6. Flattened Dense Layer (FC256 Column at x = 6.4)
    const denseNodeCount = 10;
    const denseNodes = [];
    const denseNodeGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const denseNodeMat = new THREE.MeshStandardMaterial({
      color: 0x7568F7,
      emissive: 0x7568F7,
      emissiveIntensity: 0.4
    });

    for (let i = 0; i < denseNodeCount; i++) {
      const node = new THREE.Mesh(denseNodeGeom, denseNodeMat);
      const yPos = (i - (denseNodeCount - 1) / 2) * 0.65;
      node.position.set(6.4, yPos, 0);
      cnnGroup.add(node);
      denseNodes.push(node);
    }

    // 7. Output Softmax Units (6 Pathogen Nodes at x = 8.6)
    const outputCount = 6;
    const outputNodes = [];
    const outputGeom = new THREE.SphereGeometry(0.25, 16, 16);
    const outputMat = new THREE.MeshStandardMaterial({
      color: 0x18C7D1,
      emissive: 0x18C7D1,
      emissiveIntensity: 0.6
    });

    for (let i = 0; i < outputCount; i++) {
      const node = new THREE.Mesh(outputGeom, outputMat);
      const yPos = (i - (outputCount - 1) / 2) * 0.9;
      node.position.set(8.6, yPos, 0);
      cnnGroup.add(node);
      outputNodes.push(node);
    }

    // 8. Synaptic Connection Lines between Dense -> Softmax Output
    const synapseGeom = new THREE.BufferGeometry();
    const synapsePoints = [];
    denseNodes.forEach((dn) => {
      outputNodes.forEach((on) => {
        synapsePoints.push(dn.position.x, dn.position.y, dn.position.z);
        synapsePoints.push(on.position.x, on.position.y, on.position.z);
      });
    });
    synapseGeom.setAttribute('position', new THREE.Float32BufferAttribute(synapsePoints, 3));
    const synapseLines = new THREE.LineSegments(
      synapseGeom,
      new THREE.LineBasicMaterial({ color: 0x7568F7, transparent: true, opacity: 0.18 })
    );
    cnnGroup.add(synapseLines);

    // ========================================================
    // STAGE 4: Softmax Classification Activation Network (6 Pathogen Nodes)
    // ========================================================
    const pathogenNames = [
      'E. coli',
      'E. faecalis',
      'S. aureus',
      'K. pneumoniae',
      'P. aeruginosa',
      'C. albicans'
    ];
    const classColors = [0x1261A0, 0x18C7D1, 0x35B9E9, 0x7568F7, 0x9B91FF, 0x29C98A];
    const classHexColors = ['#1261A0', '#18C7D1', '#35B9E9', '#7568F7', '#9B91FF', '#29C98A'];

    // Helper to generate crisp 3D text badge sprites
    const createPathogenTextSprite = (name, accentColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 280;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');

      // Rounded pill background
      ctx.fillStyle = isDarkMode ? 'rgba(15, 32, 50, 0.88)' : 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;

      const r = 18;
      const x = 6, y = 6, w = 268, h = 68;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pathogen text
      ctx.font = 'bold 28px "Space Grotesk", Inter, sans-serif';
      ctx.fillStyle = isDarkMode ? '#F4F8FC' : '#102A43';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, 140, 40);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.2, 0.9, 1);
      return sprite;
    };

    const classSpheres = [];
    const spherePositions = [];

    // Create 6 Pathogen Spheres with Text Badges
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radiusX = 6.2;
      const radiusY = 4.8;
      const xPos = Math.cos(angle) * radiusX;
      const yPos = Math.sin(angle) * radiusY;
      const zPos = Math.sin(angle * 2) * 0.8;

      const sphereGeom = new THREE.SphereGeometry(0.85, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: classColors[i],
        emissive: classColors[i],
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(xPos, yPos, zPos);
      stageGroup4.add(sphere);
      classSpheres.push(sphere);
      spherePositions.push(sphere.position);

      // Pathogen Name Text Sprite Badge
      const sprite = createPathogenTextSprite(pathogenNames[i], classHexColors[i]);
      sprite.position.set(xPos, yPos + 1.35, zPos);
      stageGroup4.add(sprite);
    }

    // Inter-node Network Connections among the 6 Pathogen Spheres
    const networkGeom = new THREE.BufferGeometry();
    const networkPoints = [];
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      // Outer ring connection
      networkPoints.push(spherePositions[i].x, spherePositions[i].y, spherePositions[i].z);
      networkPoints.push(spherePositions[next].x, spherePositions[next].y, spherePositions[next].z);

      // Diagonal cross connections
      const opposite = (i + 3) % 6;
      if (i < 3) {
        networkPoints.push(spherePositions[i].x, spherePositions[i].y, spherePositions[i].z);
        networkPoints.push(spherePositions[opposite].x, spherePositions[opposite].y, spherePositions[opposite].z);
      }
    }
    networkGeom.setAttribute('position', new THREE.Float32BufferAttribute(networkPoints, 3));
    const networkLines = new THREE.LineSegments(
      networkGeom,
      new THREE.LineBasicMaterial({
        color: 0x18C7D1,
        transparent: true,
        opacity: isDarkMode ? 0.35 : 0.45
      })
    );
    stageGroup4.add(networkLines);

    // Add all stage groups to scene
    scene.add(stageGroup0);
    scene.add(stageGroup1);
    scene.add(stageGroup2);
    scene.add(stageGroup3);
    scene.add(stageGroup4);

    const allGroups = [stageGroup0, stageGroup1, stageGroup2, stageGroup3, stageGroup4];

    sceneRef.current = { scene, camera, renderer, controls, allGroups };

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controls) controls.update();

      // Show only active stage group
      allGroups.forEach((g, idx) => {
        g.visible = idx === activeStage;
      });

      // Smooth active animations
      if (allGroups[activeStage]) {
        if (activeStage === 2) {
          // Slow orbital rotation for PCA eigen-space to reveal 3D projection plane and orthogonal droplines
          stageGroup2.rotation.y = elapsedTime * 0.22;
          stageGroup2.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
        } else if (activeStage === 3) {
          stageGroup3.rotation.y = Math.sin(elapsedTime * 0.4) * 0.25 - 0.15;
          stageGroup3.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
          kernelMesh.position.y = Math.sin(elapsedTime * 1.5) * 1.5;
          kernelMesh.position.z = Math.cos(elapsedTime * 1.5) * 0.3 + 0.15;
        } else if (activeStage === 4) {
          stageGroup4.rotation.y = elapsedTime * 0.18;
          stageGroup4.rotation.x = Math.sin(elapsedTime * 0.3) * 0.06;
        } else {
          allGroups[activeStage].rotation.y = elapsedTime * 0.2;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 400;
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
  }, [isDarkMode, activeStage]);

  return (
    <section id="workflow" className="py-12 sm:py-16">
      <div className="sci-surface p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-brand-electric">
              Interactive Visualization
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-light-textPrimary dark:text-dark-textPrimary mt-1">
              End-to-End Pipeline Transformation
            </h2>
          </div>

          {/* Stage Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border text-xs">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                  activeStage === stage.id
                    ? 'bg-brand-blue text-white shadow-sm dark:bg-brand-electric dark:text-dark-bg font-semibold'
                    : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
                }`}
              >
                0{stage.id + 1} {stage.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Split 3D Canvas & Stage Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Visualizer Stage Canvas */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[400px] bg-light-secondary/40 dark:bg-dark-secondary/50 rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            
            {/* Live 3D HUD Stage Badge */}
            <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2 text-[11px] font-mono text-light-textPrimary dark:text-dark-textPrimary bg-light-card/85 dark:bg-dark-surface/85 backdrop-blur-md px-2.5 py-1 rounded border border-light-border dark:border-dark-border shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
              <span>{stages[activeStage].code}</span>
            </div>

            <div className="absolute bottom-3 right-4 pointer-events-none text-[11px] font-mono text-light-textMuted dark:text-dark-textMuted bg-light-card/80 dark:bg-dark-surface/80 px-2 py-0.5 rounded border border-light-border dark:border-dark-border">
              🖱 Drag to Rotate • Scroll to Zoom
            </div>
          </div>

          {/* Stage Info Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-brand-blue dark:bg-brand-electric text-white dark:text-dark-bg font-mono text-xs font-bold flex items-center justify-center">
                0{activeStage + 1}
              </span>
              <span className="text-xs font-mono font-semibold text-brand-blue dark:text-brand-electric">
                STAGE {activeStage + 1} OF 5
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-light-textPrimary dark:text-dark-textPrimary">
              {stages[activeStage].title}
            </h3>

            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
              {stages[activeStage].desc}
            </p>


            {/* Architecture Details callout for CNN */}
            {activeStage === 3 && (
              <div className="p-3.5 rounded-lg bg-light-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs space-y-1.5">
                <div className="font-semibold text-brand-blue dark:text-brand-electric font-mono">
                  3D Deep Architecture Layers:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-light-textSecondary dark:text-dark-textSecondary font-mono">
                  <div>• Input: 224×224×3 Tensor</div>
                  <div>• Conv1: 32 Feature Maps</div>
                  <div>• Conv2: 64 Feature Maps</div>
                  <div>• Conv3: 128 Feature Maps</div>
                  <div>• Dense: 256 Units (Drop 0.3)</div>
                  <div>• Output: 6 Softmax Classes</div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-light-border dark:border-dark-border flex items-center justify-between text-xs font-mono text-light-textMuted dark:text-dark-textMuted">
              <span>Standardization:</span>
              <span className="text-brand-cyan font-semibold">{stages[activeStage].spec}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
