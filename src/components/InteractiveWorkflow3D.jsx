import React, { useState, useEffect, useRef } from 'react';
import { BIOFILM_SPECIES, getBiofilmByQuery, getBiofilmImage } from '../utils/biofilmAssets';

export default function InteractiveWorkflow3D() {
  const containerRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [selectedBiofilmId, setSelectedBiofilmId] = useState('ecoli');
  const sceneRef = useRef(null);

  const selectedBiofilm = getBiofilmByQuery(selectedBiofilmId);

  const stages = [
    {
      id: 0,
      title: 'Hyperspectral Data Cube',
      code: 'TIFF Input (X × Y × λ)',
      desc: 'Raw continuous optical matrix capturing 236 contiguous wavelength channels (400 - 1000 nm) across the biofilm micro-environment.',
      spec: '236 Narrow Spectral Bands'
    },
    {
      id: 1,
      title: 'Preprocessing & Calibration',
      code: 'R = (I-D)/(W-D)',
      desc: 'Automated dark current and white reference radiometric standardization with spatial Gaussian noise filtering.',
      spec: 'Radiometric Calibration'
    },
    {
      id: 2,
      title: 'PCA Eigen-Projection',
      code: 'Eigenvector Space (PC₁, PC₂, PC₃)',
      desc: 'Principal Component Analysis decomposes spectral covariance into orthogonal eigenvectors, projecting high-dimensional multi-band data onto the principal variance hyperplane.',
      spec: 'Preserves 99%+ Spectral Variance'
    },
    {
      id: 3,
      title: 'Deep CNN Architecture',
      code: 'Tensor [224, 224, 3] → Conv → Pool → Dense',
      desc: 'Deep Convolutional Neural Network with hierarchical 2D feature maps, scanning receptive field kernels, max pooling, and dense dropout representation.',
      spec: 'Conv32 → Conv64 → Conv128 → FC256'
    },
    {
      id: 4,
      title: '6-Class Softmax Classification',
      code: 'Softmax Posterior Vector',
      desc: 'Final dense softmax layer evaluates posterior probability distribution across the six target pathogen species isolates.',
      spec: '85.3% Reported Validation Accuracy'
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(16, 12, 22);

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

    // Studio Laboratory Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x48F5A3, 1.5);
    dirLight1.position.set(14, 18, 14);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x18C77A, 1.1);
    dirLight2.position.set(-14, -10, -14);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x9BEFCE, 1.3, 40);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Texture Loader for real Biofilm images
    const textureLoader = new THREE.TextureLoader();
    const currentBiofilmTexture = textureLoader.load(selectedBiofilm.image);
    currentBiofilmTexture.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;

    // Load textures for all 6 species for Stage 4
    const allBiofilmTextures = BIOFILM_SPECIES.map((spec) => {
      const tex = textureLoader.load(spec.image);
      tex.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
      return { ...spec, texture: tex };
    });

    // Groups for 5 workflow stages
    const stageGroup0 = new THREE.Group(); // Data Cube
    const stageGroup1 = new THREE.Group(); // Preprocessing
    const stageGroup2 = new THREE.Group(); // 3D PCA Eigen-Space & Scatter Projection
    const stageGroup3 = new THREE.Group(); // 3D CNN Architecture
    const stageGroup4 = new THREE.Group(); // Softmax Classification Network

    // ========================================================
    // STAGE 0: Hyperspectral Data Cube with REAL Biofilm Texture
    // ========================================================
    const cubeSize = 7.6;
    const spectralEmeralds = [0x061A14, 0x0A241B, 0x0D2B20, 0x11382A, 0x18C77A, 0x20E08B, 0x48F5A3, 0x9BEFCE];
    
    // Bottom layered spectral planes
    for (let i = 0; i < 7; i++) {
      const geom = new THREE.PlaneGeometry(cubeSize, cubeSize);
      const mat = new THREE.MeshStandardMaterial({
        color: spectralEmeralds[i % spectralEmeralds.length],
        transparent: true,
        opacity: 0.38 + i * 0.05,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - 4) * 0.85;
      stageGroup0.add(plane);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x18C77A, transparent: true, opacity: 0.5 })
      );
      edge.rotation.x = -Math.PI / 2;
      edge.position.y = plane.position.y;
      stageGroup0.add(edge);
    }

    // Top Slice: Real High-Resolution Biofilm Image Plane
    const topGeom = new THREE.PlaneGeometry(cubeSize, cubeSize, 16, 16);
    // Biological micro-wave elevation
    const pos = topGeom.attributes.position;
    for (let j = 0; j < pos.count; j++) {
      const u = pos.getX(j);
      const v = pos.getY(j);
      const z = Math.sin(u * 0.4) * Math.cos(v * 0.4) * 0.18;
      pos.setZ(j, z);
    }
    topGeom.computeVertexNormals();

    const topMat = new THREE.MeshStandardMaterial({
      map: currentBiofilmTexture,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const topPlane = new THREE.Mesh(topGeom, topMat);
    topPlane.rotation.x = -Math.PI / 2;
    topPlane.position.y = 3 * 0.85;
    stageGroup0.add(topPlane);

    // Glowing border frame for the top real biofilm plane
    const topFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(topGeom),
      new THREE.LineBasicMaterial({ color: 0x48F5A3, linewidth: 2 })
    );
    topFrame.rotation.x = -Math.PI / 2;
    topFrame.position.y = topPlane.position.y;
    stageGroup0.add(topFrame);

    const boxGeom = new THREE.BoxGeometry(cubeSize, 6.8, cubeSize);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x1B4435, wireframe: true, transparent: true, opacity: 0.7 });
    stageGroup0.add(new THREE.Mesh(boxGeom, boxMat));

    // Laser scan sweep bar across the biofilm top slice
    const laserBarGeom = new THREE.BoxGeometry(cubeSize * 1.05, 0.08, 0.15);
    const laserBarMat = new THREE.MeshBasicMaterial({ color: 0x48F5A3 });
    const laserBar = new THREE.Mesh(laserBarGeom, laserBarMat);
    laserBar.position.set(0, topPlane.position.y + 0.08, 0);
    stageGroup0.add(laserBar);

    // ========================================================
    // STAGE 1: Preprocessing & Laser Calibration
    // ========================================================
    const calibTableGeom = new THREE.BoxGeometry(cubeSize * 1.15, 0.4, cubeSize * 1.15);
    const calibTableMat = new THREE.MeshStandardMaterial({ color: 0x0A241B, roughness: 0.4 });
    const calibTable = new THREE.Mesh(calibTableGeom, calibTableMat);
    calibTable.position.y = -2.5;
    stageGroup1.add(calibTable);

    // Target Biofilm Sample on Calibration Stage
    const calibSampleGeom = new THREE.PlaneGeometry(cubeSize * 0.9, cubeSize * 0.9);
    const calibSampleMat = new THREE.MeshStandardMaterial({
      map: currentBiofilmTexture,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const calibSample = new THREE.Mesh(calibSampleGeom, calibSampleMat);
    calibSample.rotation.x = -Math.PI / 2;
    calibSample.position.y = -2.25;
    stageGroup1.add(calibSample);

    // Calibration grid overlay
    for (let i = 0; i < 4; i++) {
      const geom = new THREE.PlaneGeometry(cubeSize * 0.9, cubeSize * 0.9);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x18C77A,
        transparent: true,
        opacity: 0.25 + i * 0.1,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geom, mat);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = (i - 1) * 1.2;
      stageGroup1.add(plane);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x48F5A3, transparent: true, opacity: 0.6 })
      );
      edge.rotation.x = -Math.PI / 2;
      edge.position.y = plane.position.y;
      stageGroup1.add(edge);
    }

    // ========================================================
    // STAGE 2: AUTHENTIC 3D PRINCIPAL COMPONENT ANALYSIS (PCA)
    // ========================================================
    const pcaGroup = stageGroup2;

    const createEigenVector = (direction, length, color, headLength = 0.8, headWidth = 0.4) => {
      const dir = direction.clone().normalize();
      const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, headLength, headWidth);
      arrow.line.material.linewidth = 2.5;
      return arrow;
    };

    // PC1: Primary Variance Axis
    const pc1Dir = new THREE.Vector3(1.2, 0.7, 0.4).normalize();
    const pc1Arrow = createEigenVector(pc1Dir, 7.5, 0x48F5A3, 1.0, 0.45);
    pcaGroup.add(pc1Arrow);

    const pc1NegArrow = createEigenVector(pc1Dir.clone().negate(), 6.5, 0x48F5A3, 0.7, 0.35);
    pcaGroup.add(pc1NegArrow);

    // PC2: Secondary Variance Axis
    const pc2Dir = new THREE.Vector3(-0.5, 1.1, 0.3).normalize();
    const pc2Arrow = createEigenVector(pc2Dir, 5.5, 0x9BEFCE, 0.8, 0.35);
    pcaGroup.add(pc2Arrow);

    const pc2NegArrow = createEigenVector(pc2Dir.clone().negate(), 4.5, 0x9BEFCE, 0.6, 0.3);
    pcaGroup.add(pc2NegArrow);

    // PC3: Tertiary Variance Axis
    const pc3Dir = new THREE.Vector3().crossVectors(pc1Dir, pc2Dir).normalize();
    const pc3Arrow = createEigenVector(pc3Dir, 4.0, 0x18C77A, 0.6, 0.28);
    pcaGroup.add(pc3Arrow);

    const pc3NegArrow = createEigenVector(pc3Dir.clone().negate(), 3.5, 0x18C77A, 0.5, 0.25);
    pcaGroup.add(pc3NegArrow);

    // PC1 - PC2 Principal Hyperplane with Biofilm Texture in center
    const pcaPlaneGeom = new THREE.PlaneGeometry(12, 9, 12, 12);
    const pcaPlaneMat = new THREE.MeshStandardMaterial({
      map: currentBiofilmTexture,
      transparent: true,
      opacity: 0.65,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const pcaPlane = new THREE.Mesh(pcaPlaneGeom, pcaPlaneMat);
    pcaPlane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pc3Dir);
    pcaGroup.add(pcaPlane);

    const planeWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(pcaPlaneGeom),
      new THREE.LineBasicMaterial({ color: 0x18C77A, transparent: true, opacity: 0.4 })
    );
    planeWire.quaternion.copy(pcaPlane.quaternion);
    pcaGroup.add(planeWire);

    // Scatter Cloud & Projected Droplines
    const pointCount = 120;
    const scatterGroup = new THREE.Group();
    const dropLinesGroup = new THREE.Group();

    const pointGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const projPointGeom = new THREE.SphereGeometry(0.08, 8, 8);

    const pointMatBright = new THREE.MeshStandardMaterial({ color: 0x48F5A3, emissive: 0x48F5A3, emissiveIntensity: 0.5 });
    const pointMatEmerald = new THREE.MeshStandardMaterial({ color: 0x18C77A, emissive: 0x18C77A, emissiveIntensity: 0.4 });
    const pointMatMint = new THREE.MeshStandardMaterial({ color: 0x9BEFCE, emissive: 0x9BEFCE, emissiveIntensity: 0.4 });
    const projPointMat = new THREE.MeshBasicMaterial({ color: 0x1B4435, transparent: true, opacity: 0.7 });

    const dropLineMat = new THREE.LineBasicMaterial({ color: 0x18C77A, transparent: true, opacity: 0.3 });

    for (let i = 0; i < pointCount; i++) {
      const u1 = (Math.random() - 0.5 + (Math.random() - 0.5)) * 4.8;
      const u2 = (Math.random() - 0.5 + (Math.random() - 0.5)) * 2.8;
      const u3 = (Math.random() - 0.5 + (Math.random() - 0.5)) * 1.4;

      const p3D = new THREE.Vector3()
        .addScaledVector(pc1Dir, u1)
        .addScaledVector(pc2Dir, u2)
        .addScaledVector(pc3Dir, u3);

      const pProj = new THREE.Vector3()
        .addScaledVector(pc1Dir, u1)
        .addScaledVector(pc2Dir, u2);

      const mat = i % 3 === 0 ? pointMatBright : i % 3 === 1 ? pointMatEmerald : pointMatMint;
      const pointMesh = new THREE.Mesh(pointGeom, mat);
      pointMesh.position.copy(p3D);
      scatterGroup.add(pointMesh);

      const projMesh = new THREE.Mesh(projPointGeom, projPointMat);
      projMesh.position.copy(pProj);
      scatterGroup.add(projMesh);

      if (i % 2 === 0) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([p3D, pProj]);
        const dropLine = new THREE.Line(lineGeom, dropLineMat);
        dropLinesGroup.add(dropLine);
      }
    }

    pcaGroup.add(scatterGroup);
    pcaGroup.add(dropLinesGroup);

    // ========================================================
    // STAGE 3: REAL 3D CONVOLUTIONAL NEURAL NETWORK (CNN) WITH BIOFILM IMAGE INPUT
    // ========================================================
    const cnnGroup = stageGroup3;

    // 1. Input Biofilm Tensor Image (224x224x3 Tensor Slab at x = -7)
    const inputSize = 5.4;
    const inputGeom = new THREE.PlaneGeometry(inputSize, inputSize);
    const inputMat = new THREE.MeshStandardMaterial({
      map: currentBiofilmTexture,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const inputMesh = new THREE.Mesh(inputGeom, inputMat);
    inputMesh.position.set(-7, 0, 0);
    cnnGroup.add(inputMesh);

    const inputWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(inputGeom),
      new THREE.LineBasicMaterial({ color: 0x48F5A3, linewidth: 2 })
    );
    inputWire.position.copy(inputMesh.position);
    cnnGroup.add(inputWire);

    // Scanning Kernel Box on Input (3x3 receptive field)
    const kernelGeom = new THREE.PlaneGeometry(1.2, 1.2);
    const kernelMat = new THREE.MeshBasicMaterial({
      color: 0x48F5A3,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const kernelMesh = new THREE.Mesh(kernelGeom, kernelMat);
    kernelMesh.position.set(-6.98, 1.2, 0.05);
    cnnGroup.add(kernelMesh);

    // 2. Conv Block 1 (Conv32)
    const conv1Size = 4.0;
    const conv1Count = 5;
    for (let i = 0; i < conv1Count; i++) {
      const geom = new THREE.PlaneGeometry(conv1Size, conv1Size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x18C77A,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(-3.5, 0, (i - conv1Count / 2) * 0.55);
      cnnGroup.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x48F5A3, opacity: 0.7, transparent: true })
      );
      edges.position.copy(mesh.position);
      cnnGroup.add(edges);
    }

    // 3. Pyramidal Projection Frustum Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x48F5A3,
      transparent: true,
      opacity: 0.65
    });
    const frustumGeom = new THREE.BufferGeometry();
    const frustumPoints = [
      -6.98, 1.8, 0.05,   -3.5, 1.0, -0.8,
      -6.98, 0.6, 0.05,   -3.5, 1.0, -0.8,
      -6.98, 1.8, -0.55,  -3.5, 1.0, -0.8,
      -6.98, 0.6, -0.55,  -3.5, 1.0, -0.8
    ];
    frustumGeom.setAttribute('position', new THREE.Float32BufferAttribute(frustumPoints, 3));
    const frustumLines = new THREE.LineSegments(frustumGeom, lineMat);
    cnnGroup.add(frustumLines);

    // 4. Conv Block 2 (Conv64)
    const conv2Size = 2.8;
    const conv2Count = 6;
    for (let i = 0; i < conv2Count; i++) {
      const geom = new THREE.PlaneGeometry(conv2Size, conv2Size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x20E08B,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0.2, 0, (i - conv2Count / 2) * 0.45);
      cnnGroup.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x20E08B, opacity: 0.75, transparent: true })
      );
      edges.position.copy(mesh.position);
      cnnGroup.add(edges);
    }

    // 5. Conv Block 3 (Conv128)
    const conv3Size = 1.8;
    const conv3Count = 6;
    for (let i = 0; i < conv3Count; i++) {
      const geom = new THREE.PlaneGeometry(conv3Size, conv3Size);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x48F5A3,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(3.6, 0, (i - conv3Count / 2) * 0.35);
      cnnGroup.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: 0x9BEFCE, opacity: 0.8, transparent: true })
      );
      edges.position.copy(mesh.position);
      cnnGroup.add(edges);
    }

    // 6. Flattened Dense Layer (FC256 Column)
    const denseNodeCount = 10;
    const denseNodes = [];
    const denseNodeGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const denseNodeMat = new THREE.MeshStandardMaterial({
      color: 0x18C77A,
      emissive: 0x18C77A,
      emissiveIntensity: 0.5
    });

    for (let i = 0; i < denseNodeCount; i++) {
      const node = new THREE.Mesh(denseNodeGeom, denseNodeMat);
      const yPos = (i - (denseNodeCount - 1) / 2) * 0.65;
      node.position.set(6.4, yPos, 0);
      cnnGroup.add(node);
      denseNodes.push(node);
    }

    // 7. Output Softmax Units (6 Pathogen Nodes)
    const outputCount = 6;
    const outputNodes = [];
    const outputGeom = new THREE.SphereGeometry(0.25, 16, 16);
    const outputMat = new THREE.MeshStandardMaterial({
      color: 0x48F5A3,
      emissive: 0x48F5A3,
      emissiveIntensity: 0.6
    });

    for (let i = 0; i < outputCount; i++) {
      const node = new THREE.Mesh(outputGeom, outputMat);
      const yPos = (i - (outputCount - 1) / 2) * 0.9;
      node.position.set(8.6, yPos, 0);
      cnnGroup.add(node);
      outputNodes.push(node);
    }

    // 8. Synaptic Connections
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
      new THREE.LineBasicMaterial({ color: 0x18C77A, transparent: true, opacity: 0.25 })
    );
    cnnGroup.add(synapseLines);

    // ========================================================
    // STAGE 4: Softmax Classification Activation Network WITH ALL 6 REAL BIOFILM IMAGES
    // ========================================================
    const createPathogenTextSprite = (name, accentColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 280;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgba(13, 43, 32, 0.92)';
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

      ctx.font = 'bold 26px "Space Grotesk", Inter, sans-serif';
      ctx.fillStyle = '#F4FFF9';
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

    const spherePositions = [];
    const discMeshes = [];

    for (let i = 0; i < 6; i++) {
      const spec = allBiofilmTextures[i];
      const angle = (i / 6) * Math.PI * 2;
      const radiusX = 6.4;
      const radiusY = 5.0;
      const xPos = Math.cos(angle) * radiusX;
      const yPos = Math.sin(angle) * radiusY;
      const zPos = Math.sin(angle * 2) * 0.8;

      // Circular textured Biofilm lens disc
      const discGeom = new THREE.CircleGeometry(1.2, 32);
      const discMat = new THREE.MeshStandardMaterial({
        map: spec.texture,
        side: THREE.DoubleSide,
        roughness: 0.3
      });
      const disc = new THREE.Mesh(discGeom, discMat);
      disc.position.set(xPos, yPos, zPos);
      disc.lookAt(camera.position);
      stageGroup4.add(disc);
      discMeshes.push(disc);

      // Outer Glowing Ring
      const ringGeom = new THREE.RingGeometry(1.2, 1.35, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spec.colorThree,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(xPos, yPos, zPos + 0.02);
      stageGroup4.add(ring);

      spherePositions.push(disc.position);

      const sprite = createPathogenTextSprite(spec.short, spec.colorHex);
      sprite.position.set(xPos, yPos + 1.8, zPos);
      stageGroup4.add(sprite);
    }

    const networkGeom = new THREE.BufferGeometry();
    const networkPoints = [];
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      networkPoints.push(spherePositions[i].x, spherePositions[i].y, spherePositions[i].z);
      networkPoints.push(spherePositions[next].x, spherePositions[next].y, spherePositions[next].z);

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
        color: 0x48F5A3,
        transparent: true,
        opacity: 0.45
      })
    );
    stageGroup4.add(networkLines);

    scene.add(stageGroup0);
    scene.add(stageGroup1);
    scene.add(stageGroup2);
    scene.add(stageGroup3);
    scene.add(stageGroup4);

    const allGroups = [stageGroup0, stageGroup1, stageGroup2, stageGroup3, stageGroup4];
    sceneRef.current = { scene, camera, renderer, controls, allGroups };

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controls) controls.update();

      allGroups.forEach((g, idx) => {
        g.visible = idx === activeStage;
      });

      if (allGroups[activeStage]) {
        if (activeStage === 0) {
          allGroups[0].rotation.y = elapsedTime * 0.18;
          laserBar.position.z = Math.sin(elapsedTime * 2) * (cubeSize * 0.45);
        } else if (activeStage === 1) {
          allGroups[1].rotation.y = elapsedTime * 0.2;
        } else if (activeStage === 2) {
          stageGroup2.rotation.y = elapsedTime * 0.22;
          stageGroup2.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
        } else if (activeStage === 3) {
          stageGroup3.rotation.y = Math.sin(elapsedTime * 0.4) * 0.25 - 0.15;
          stageGroup3.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
          kernelMesh.position.y = Math.sin(elapsedTime * 1.5) * 1.5;
          kernelMesh.position.x = -6.98 + Math.cos(elapsedTime * 1.2) * 1.2;
        } else if (activeStage === 4) {
          stageGroup4.rotation.y = elapsedTime * 0.18;
          stageGroup4.rotation.x = Math.sin(elapsedTime * 0.3) * 0.06;
          // Keep biofilm discs oriented towards camera
          discMeshes.forEach((disc) => {
            disc.quaternion.copy(camera.quaternion);
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
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
  }, [activeStage, selectedBiofilmId]);

  return (
    <section id="pipeline-3d" className="py-16 sm:py-24 relative">
      <div className="lab-surface p-6 sm:p-10 relative overflow-hidden">
        {/* Header with Stage & Specimen Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8 pb-6 border-b border-[#1B4435]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A241B] border border-[#18C77A]/40 text-xs font-mono text-[#48F5A3] mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3]"></span>
              <span>02 // 3D PIPELINE MODELS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[#F4FFF9]">
              Interactive 3D Pipeline Transformation
            </h2>
            <p className="text-xs sm:text-sm text-[#B4C9C0] mt-1.5">
              Inspect how high-dimensional hyperspectral biofilm tensors are calibrated, projected, and classified through 3D neural topologies.
            </p>
          </div>

          {/* Stage Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#0A241B] border border-[#1B4435] text-xs font-mono self-start lg:self-auto">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                  activeStage === stage.id
                    ? 'bg-[#18C77A] text-[#061A14] font-bold shadow-[0_0_12px_rgba(24,199,122,0.5)]'
                    : 'text-[#B4C9C0] hover:text-[#F4FFF9]'
                }`}
              >
                0{stage.id + 1} {stage.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Biofilm Specimen Selection Bar for 3D Visualizer */}
        <div className="mb-6 p-3 rounded-2xl bg-[#0D2B20]/80 border border-[#1B4435] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#48F5A3]">
            <span className="h-2 w-2 rounded-full bg-[#48F5A3] animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              3D Biofilm Texture Sample:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {BIOFILM_SPECIES.map((spec) => {
              const isSelected = selectedBiofilmId === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedBiofilmId(spec.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#18C77A]/25 border-[#48F5A3] text-[#F4FFF9] shadow-[0_0_15px_rgba(72,245,163,0.3)] ring-1 ring-[#48F5A3]'
                      : 'bg-[#0A241B] border-[#1B4435] text-[#829A90] hover:text-[#F4FFF9] hover:border-[#18C77A]/50'
                  }`}
                >
                  <img
                    src={spec.image}
                    alt={spec.short}
                    className="w-5 h-5 rounded-full object-cover border border-[#18C77A]/50"
                  />
                  <span>{spec.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Split 3D Canvas & Stage Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Visualizer Stage Canvas */}
          <div className="lg:col-span-7 relative h-[400px] sm:h-[460px] bg-[#0A241B]/70 rounded-2xl border border-[#1B4435] overflow-hidden">
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Live 3D HUD Stage Badge */}
            <div className="absolute top-3.5 left-4 pointer-events-none flex items-center gap-2 text-[11px] font-mono text-[#F4FFF9] bg-[#0D2B20]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#1B4435] shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#48F5A3] animate-pulse"></span>
              <span className="font-semibold">{stages[activeStage].code}</span>
              <span className="text-[#829A90]">• {selectedBiofilm.short}</span>
            </div>

            {/* Floating Specimen Holographic Badge */}
            <div className="absolute top-3.5 right-4 pointer-events-none flex items-center gap-2 bg-[#061A14]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#1B4435] text-[10px] font-mono text-[#B4C9C0]">
              <img
                src={selectedBiofilm.image}
                alt={selectedBiofilm.name}
                className="w-4 h-4 rounded-full object-cover border border-[#48F5A3]"
              />
              <span>{selectedBiofilm.name}</span>
            </div>

            <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] font-mono text-[#829A90] bg-[#061A14]/80 px-2.5 py-1 rounded border border-[#1B4435]">
              🖱 Drag to Orbit • Scroll to Zoom
            </div>
          </div>

          {/* Stage Info Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-[#18C77A] text-[#061A14] font-mono text-xs font-bold flex items-center justify-center">
                0{activeStage + 1}
              </span>
              <span className="text-xs font-mono font-semibold text-[#48F5A3]">
                STAGE {activeStage + 1} OF 5
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#F4FFF9]">
              {stages[activeStage].title}
            </h3>

            <p className="text-sm text-[#B4C9C0] leading-relaxed">
              {stages[activeStage].desc}
            </p>

            {/* Stage-Specific Biofilm Card */}
            <div className="p-4 rounded-xl bg-[#0D2B20] border border-[#1B4435] flex items-center gap-4">
              <img
                src={selectedBiofilm.image}
                alt={selectedBiofilm.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#48F5A3]/50 shadow-md flex-shrink-0"
              />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#F4FFF9] font-display">
                  {selectedBiofilm.name}
                </div>
                <div className="text-[11px] font-mono text-[#48F5A3]">
                  {selectedBiofilm.gram} • {selectedBiofilm.morphology}
                </div>
                <div className="text-[10px] text-[#829A90] font-mono">
                  Spectral Peak: <strong className="text-[#9BEFCE]">{selectedBiofilm.peak}</strong>
                </div>
              </div>
            </div>

            {activeStage === 3 && (
              <div className="p-3.5 rounded-xl bg-[#0A241B] border border-[#1B4435] text-xs space-y-1.5">
                <div className="font-semibold text-[#48F5A3] font-mono">
                  3D Deep CNN Architecture:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#B4C9C0] font-mono">
                  <div>• Input: 224×224×3 Tensor</div>
                  <div>• Conv1: 32 Feature Maps</div>
                  <div>• Conv2: 64 Feature Maps</div>
                  <div>• Conv3: 128 Feature Maps</div>
                  <div>• Dense: 256 Units (Drop 0.3)</div>
                  <div>• Output: 6 Softmax Classes</div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#1B4435] flex items-center justify-between text-xs font-mono text-[#829A90]">
              <span>Standardization:</span>
              <span className="text-[#48F5A3] font-semibold">{stages[activeStage].spec}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
