import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Suppress WebGL shader precision warnings (harmless GPU compiler warnings)
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === 'string' &&
    (message.includes('THREE.WebGLProgram: Program Info Log') ||
      message.includes('X4122') ||
      message.includes('X4008'))) {
    return;
  }
  originalWarn.apply(console, args);
};

// Component to configure renderer for accurate color reproduction
const RendererConfig: React.FC = () => {
  const { gl } = useThree();

  useEffect(() => {
    // Set up renderer for accurate color reproduction
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.NoToneMapping; // Disable tone mapping to preserve original colors
    gl.toneMappingExposure = 1;
  }, [gl]);

  return null;
};

interface ModelProps {
  modelPath: string;
  modelScale?: number;
  onLoaded?: () => void;
}

const Model: React.FC<ModelProps> = ({ modelPath, modelScale = 3, onLoaded }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid modifying the cached original
      const clone = scene.clone();

      // Ensure all textures use sRGB color space for accurate colors
      clone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.map) {
            material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (material.emissiveMap) {
            material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
          }
        }
      });

      // Calculate bounding box to center and scale the model
      const box = new THREE.Box3().setFromObject(clone);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Scale model to fit nicely in view
      const scale = modelScale / maxDim;
      clone.scale.setScalar(scale);

      // Recalculate bounding box after scaling and center the model at origin
      const scaledBox = new THREE.Box3().setFromObject(clone);
      const center = scaledBox.getCenter(new THREE.Vector3());
      clone.position.set(-center.x, -center.y, -center.z);

      setClonedScene(clone);

      // Adjust camera position
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      }

      onLoaded?.();
    }
  }, [scene, camera, modelScale, onLoaded]);

  // Auto-rotate the model slowly
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={modelRef}>
      <primitive object={clonedScene} />
    </group>
  );
};


interface ModelViewerProps {
  modelPath: string;
  modelScale?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath, modelScale, canvasRef }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);

  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Reset loading state when model path changes
  useEffect(() => {
    setIsLoaded(false);
  }, [modelPath]);

  return (
    <div className="model-viewer-container">
      {/* Single loading overlay - shown until model is fully loaded */}
      {!isLoaded && (
        <div className="model-viewer-loading-overlay">
          <div className="model-viewer-spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      )}

      <Canvas
        ref={activeCanvasRef}
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.NoToneMapping,
        }}
        style={{ background: 'transparent' }}
      >
        {/* Configure renderer for accurate color reproduction */}
        <RendererConfig />

        {/* Neutral lighting setup - minimal to preserve original colors */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />

        {/* Suspense with null fallback - we use our own loading overlay above */}
        <Suspense fallback={null}>
          <Model modelPath={modelPath} modelScale={modelScale} onLoaded={() => setIsLoaded(true)} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
          target={[0, 0, 0]}
          autoRotate={false}
          makeDefault
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;



