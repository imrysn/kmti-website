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
  isInteracting?: boolean;
  cameraPosition?: [number, number, number];
  onInteractionStart?: () => void;
}

const Model: React.FC<ModelProps> = ({ modelPath, modelScale = 3, onLoaded, isInteracting, cameraPosition, onInteractionStart }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);
  const cameraInitializedRef = useRef(false);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);

  // Reset cloned scene when model path changes
  useEffect(() => {
    setClonedScene(null);
    cameraInitializedRef.current = false;
  }, [modelPath]);

  useEffect(() => {
    if (scene && !clonedScene) {
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

      // Adjust camera position only on initial load
      if (camera instanceof THREE.PerspectiveCamera && !cameraInitializedRef.current) {
        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        cameraInitializedRef.current = true;
      }

      onLoaded?.();
    }
  }, [scene, camera, modelScale, onLoaded, clonedScene]);

  // Handle camera position changes with smooth animation
  useEffect(() => {
    if (cameraPosition && camera instanceof THREE.PerspectiveCamera) {
      const newTarget = new THREE.Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
      
      // Only update if position actually changed
      if (!targetPosition.current.equals(newTarget)) {
        targetPosition.current.copy(newTarget);
        isTransitioning.current = true;
      }
    }
  }, [cameraPosition, camera]);

  // Cancel transition when user starts interacting
  useEffect(() => {
    if (isInteracting && isTransitioning.current) {
      isTransitioning.current = false;
      // Update target position to current position to prevent snapping back
      if (camera instanceof THREE.PerspectiveCamera) {
        targetPosition.current.copy(camera.position);
      }
      onInteractionStart?.();
    }
  }, [isInteracting, camera, onInteractionStart]);

  // Auto-rotate the model slowly, but only when not being interacted with
  // Also handle smooth camera transitions
  useFrame(() => {
    if (modelRef.current && !isInteracting && !isTransitioning.current) {
      modelRef.current.rotation.y += 0.001; // Slightly slower for smoother feel
    }

    // Smooth camera transition with easing - ONLY when not interacting
    if (camera instanceof THREE.PerspectiveCamera && isTransitioning.current && !isInteracting) {
      currentPosition.current.copy(camera.position);
      const distance = currentPosition.current.distanceTo(targetPosition.current);
      
      // Use easing for smoother transition
      if (distance > 0.01) {
        // Ease-out cubic for smooth deceleration
        const lerpFactor = 0.08;
        camera.position.lerp(targetPosition.current, lerpFactor);
        camera.lookAt(0, 0, 0);
        
        // Update orbit controls target if available
        if (controls) {
          (controls as any).target.set(0, 0, 0);
          (controls as any).update();
        }
      } else {
        // Snap to final position and end transition
        camera.position.copy(targetPosition.current);
        camera.lookAt(0, 0, 0);
        isTransitioning.current = false;
        
        if (controls) {
          (controls as any).target.set(0, 0, 0);
          (controls as any).update();
        }
      }
    } else if (controls && (controls as any).enableDamping) {
      // Update controls for damping to work properly when NOT transitioning
      (controls as any).update();
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
  cameraView?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath, modelScale, canvasRef, cameraView }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Camera positions for different views
  const getCameraPosition = (): [number, number, number] => {
    const distance = 8;
    switch (cameraView) {
      case 'front': return [0, 0, distance];
      case 'back': return [0, 0, -distance];
      case 'left': return [-distance, 0, 0];
      case 'right': return [distance, 0, 0];
      case 'top': return [0, distance, 0];
      case 'isometric':
      default: return [5, 3, 5];
    }
  };

  // Handle interaction start
  const handleInteractionStart = () => {
    setIsInteracting(true);
    // Clear any pending timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  // Callback when user starts interacting during camera transition
  const handleTransitionCancel = () => {
    // Additional cleanup if needed
  };

  // Handle interaction end - resume auto-rotation after a short delay
  const handleInteractionEnd = () => {
    // Clear any existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    // Resume auto-rotation after 1 second of inactivity
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Reset loading state and camera initialization when model path changes
  useEffect(() => {
    setIsLoaded(false);
    setIsInteracting(false);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
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
          <Model 
            modelPath={modelPath} 
            modelScale={modelScale} 
            onLoaded={() => setIsLoaded(true)} 
            isInteracting={isInteracting}
            cameraPosition={getCameraPosition()}
            onInteractionStart={handleTransitionCancel}
          />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={0.1}
          maxDistance={50}
          target={[0, 0, 0]}
          autoRotate={false}
          makeDefault
          onStart={handleInteractionStart}
          onEnd={handleInteractionEnd}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          panSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;



