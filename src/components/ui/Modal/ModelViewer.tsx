import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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

const RendererConfig: React.FC = () => {
  const { gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.NoToneMapping;
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
  cameraView?: string;
}

const Model: React.FC<ModelProps> = ({ modelPath, modelScale = 3, onLoaded, isInteracting, cameraPosition, onInteractionStart, cameraView }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const { camera, controls } = useThree();
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);
  const cameraInitializedRef = useRef(false);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);

  useEffect(() => {
    setClonedScene(null);
    cameraInitializedRef.current = false;
  }, [modelPath]);

  useEffect(() => {
    if (scene && !clonedScene) {
      const clone = scene.clone();

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

      const box = new THREE.Box3().setFromObject(clone);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = modelScale / maxDim;
      clone.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(clone);
      const center = scaledBox.getCenter(new THREE.Vector3());
      clone.position.set(-center.x, -center.y, -center.z);

      setClonedScene(clone);

      if (camera instanceof THREE.PerspectiveCamera && !cameraInitializedRef.current) {
        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        cameraInitializedRef.current = true;
      }

      onLoaded?.();
    }
  }, [scene, camera, modelScale, onLoaded, clonedScene]);

  useEffect(() => {
    if (cameraPosition && camera instanceof THREE.PerspectiveCamera) {
      const newTarget = new THREE.Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
      if (!targetPosition.current.equals(newTarget)) {
        targetPosition.current.copy(newTarget);
        isTransitioning.current = true;
      }
    }
  }, [cameraPosition, camera]);

  useEffect(() => {
    if (isInteracting && isTransitioning.current) {
      isTransitioning.current = false;
      if (camera instanceof THREE.PerspectiveCamera) {
        targetPosition.current.copy(camera.position);
      }
      onInteractionStart?.();
    }
  }, [isInteracting, camera, onInteractionStart]);

  useFrame(() => {
    if (modelRef.current && !isInteracting && !isTransitioning.current && cameraView === 'isometric') {
      modelRef.current.rotation.y += 0.003;
    }

    if (camera instanceof THREE.PerspectiveCamera && isTransitioning.current && !isInteracting) {
      currentPosition.current.copy(camera.position);
      const distance = currentPosition.current.distanceTo(targetPosition.current);

      if (distance > 0.01) {
        const lerpFactor = 0.12;
        camera.position.lerp(targetPosition.current, lerpFactor);
        camera.lookAt(0, 0, 0);

        if (controls && 'target' in controls && 'update' in controls) {
          (controls as { target: THREE.Vector3; update: () => void }).target.set(0, 0, 0);
          (controls as { target: THREE.Vector3; update: () => void }).update();
        }
      } else {
        camera.position.copy(targetPosition.current);
        camera.lookAt(0, 0, 0);
        isTransitioning.current = false;

        if (controls && 'target' in controls && 'update' in controls) {
          (controls as { target: THREE.Vector3; update: () => void }).target.set(0, 0, 0);
          (controls as { target: THREE.Vector3; update: () => void }).update();
        }
      }
    } else if (controls && 'enableDamping' in controls && 'update' in controls) {
      (controls as { update: () => void }).update();
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

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D Viewer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="model-viewer-placeholder">
          <div className="model-viewer-placeholder-content">
            <div className="model-viewer-placeholder-icon">⚠️</div>
            <h3 className="model-viewer-placeholder-title">3D Error</h3>
            <p className="model-viewer-placeholder-text">Your phone can't render the 3D model.</p>
            <button
              className="camera-view-btn"
              onClick={() => this.setState({ hasError: false })}
              style={{ marginTop: '1rem', width: 'auto', display: 'inline-block' }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LOAD_TIMEOUT_MS = 60000; // 60 seconds — show retry if model hasn't loaded

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath, modelScale, canvasRef, cameraView }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Start the load timeout whenever modelPath changes or remountKey changes
  useEffect(() => {
    setTimedOut(false);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      setTimedOut(true);
    }, LOAD_TIMEOUT_MS);
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [modelPath, remountKey]);

  // Clear the timeout once the model loads
  useEffect(() => {
    if (isLoaded && loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, [isLoaded]);

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

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleTransitionCancel = () => { };

  const handleInteractionEnd = () => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    setIsInteracting(false);
    setTimedOut(false);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  }, [modelPath]);

  return (
    <div className="model-viewer-container">
      {!isLoaded && !timedOut && (
        <div className="model-viewer-loading-overlay">
          <div className="model-viewer-spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      )}

      {timedOut && !isLoaded && (
        <div className="model-viewer-loading-overlay">
          <div className="model-viewer-spinner"></div>
          <p style={{ marginTop: '0.5rem', color: '#fff', textAlign: 'center', fontSize: '0.9rem' }}>
            Taking too long?<br />Check your internet connection.
          </p>
          <button
            className="camera-view-btn"
            onClick={() => { setTimedOut(false); setIsLoaded(false); setRemountKey(k => k + 1); }}
            style={{ marginTop: '0.75rem', width: 'auto', display: 'inline-block' }}
          >
            Reload Model
          </button>
        </div>
      )}

      {!timedOut && <ErrorBoundary>
        <Canvas
          ref={activeCanvasRef}
          camera={{ position: [5, 3, 5], fov: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.NoToneMapping,
            powerPreference: 'low-power', // Aggressive optimization
          }}
          style={{ background: 'transparent' }}
          frameloop="always"
          dpr={1} // Strict 1x scale for maximum stability
        >
          <RendererConfig />

          {/* Enhanced Natural Lighting Setup */}
          {/* Ambient light - soft overall illumination */}
          <ambientLight intensity={0.6} />

          {/* Key light - main directional light from top-right */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={512} // Minimum acceptable shadow quality
            shadow-mapSize-height={512}
            shadow-bias={-0.0001}
          />

          {/* Fill light - softer light from opposite side to reduce harsh shadows */}
          <directionalLight position={[-8, 5, -3]} intensity={0.4} />

          {/* Back light - adds depth and rim lighting */}
          <directionalLight position={[0, 3, -10]} intensity={0.3} />

          {/* Hemisphere light - simulates natural sky/ground lighting */}
          <hemisphereLight
            color="#ffffff"
            groundColor="#666666"
            intensity={0.5}
          />

          {/* Subtle point light for highlights */}
          <pointLight position={[0, 8, 0]} intensity={0.3} distance={20} decay={2} />


          <Suspense fallback={null}>
            <Model
              modelPath={modelPath}
              modelScale={modelScale}
              onLoaded={() => setIsLoaded(true)}
              isInteracting={isInteracting}
              cameraPosition={getCameraPosition()}
              onInteractionStart={handleTransitionCancel}
              cameraView={cameraView}
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
            dampingFactor={0.15}
            rotateSpeed={1.0}
            zoomSpeed={1.2}
            panSpeed={1.0}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN
            }}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
        </Canvas>
      </ErrorBoundary>}
    </div>
  );
};

export default ModelViewer;
