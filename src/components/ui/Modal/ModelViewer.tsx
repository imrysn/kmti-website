import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── Issue 1: 3-Tier Device Detection ────────────────────────────────────────
// Replaces the single isMobile boolean so high-end phones get full visuals
// while low/mid phones get a quality budget appropriate to their GPU.
//
// Tier reference:
//   low  → iPhone 7, Redmi 9, Galaxy A13    (≤4 CPU cores, Adreno 5xx / PowerVR)
//   mid  → iPhone 12, Redmi Note 12, A54    (≤6 CPU cores, Adreno 6xx)
//   high → iPhone 15, Galaxy S24, Pixel 8   (>6 CPU cores, Adreno 7xx / Apple GPU)
//          + all tablets and desktops (always high)

type DeviceTier = 'low' | 'mid' | 'high';

const getDeviceTier = (): DeviceTier => {
  if (typeof window === 'undefined') return 'high';
  const isPhone = window.innerWidth <= 480;
  if (!isPhone) return 'high';
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 4) return 'low';
  if (cores <= 6) return 'mid';
  return 'high';
};

interface TierSettings {
  antialias: boolean;
  dpr: number | [number, number];
  castShadow: boolean;
  timeoutMs: number;
  lightCount: 'min' | 'mid' | 'full';
  // On low-tier GPUs, downgrade PBR materials to Phong to avoid shader compile failure
  simpleMaterials: boolean;
  // mediump avoids highp float precision failure on PowerVR (iPhone 7) and Adreno 5xx
  precision: 'lowp' | 'mediump' | 'highp';
}

const TIER_SETTINGS: Record<DeviceTier, TierSettings> = {
  // low: antialias off, native DPR (1×), no shadows, 2 lights, long timeout,
  //      Phong material (not PBR), mediump precision — essential for iPhone 7 / Adreno 5xx
  low: { antialias: false, dpr: 1, castShadow: false, timeoutMs: 40000, lightCount: 'min', simpleMaterials: true, precision: 'mediump' },
  // mid: antialias off, native DPR (1×), no shadows, 3 lights, standard PBR ok
  mid: { antialias: false, dpr: 1, castShadow: false, timeoutMs: 25000, lightCount: 'mid', simpleMaterials: false, precision: 'highp' },
  // high: full visuals — antialias, 1.5× DPR, shadows, all 5 lights, PBR
  high: { antialias: true, dpr: [1, 1.5], castShadow: true, timeoutMs: 15000, lightCount: 'full', simpleMaterials: false, precision: 'highp' },
};

// ─── Model Component ──────────────────────────────────────────────────────────

interface ModelProps {
  modelPath: string;
  modelScale?: number;
  onLoaded?: () => void;
  isInteracting?: boolean;
  cameraPosition?: [number, number, number];
  cameraView?: string;
  /** Downgrade MeshStandardMaterial → MeshPhongMaterial on low-tier GPUs */
  simpleMaterials?: boolean;
}

const Model: React.FC<ModelProps> = ({
  modelPath, modelScale = 3, onLoaded, isInteracting, cameraPosition, cameraView, simpleMaterials
}) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  // Issue 2: invalidate() triggers a frame in demand mode
  const { camera, controls, invalidate } = useThree();
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null);
  const cameraInitializedRef = useRef(false);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);

  useEffect(() => {
    setClonedScene(prev => {
      // Issue 5: dispose old scene's materials + geometries to prevent GPU memory leak
      // on repeated remounts (Canvas key change, context loss, model switch)
      if (prev) {
        prev.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(m => m.dispose());
            child.geometry?.dispose();
          }
        });
      }
      return null;
    });
    cameraInitializedRef.current = false;
  }, [modelPath]);

  useEffect(() => {
    if (scene && !clonedScene) {
      // Issue 4: yield JS thread before clone so the spinner doesn't freeze
      // on low-end phones during geometry copy + buffer traverse
      setTimeout(() => {
        const clone = scene.clone();

        clone.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Issue 4: child.material can be Material | Material[] in multi-material meshes
            const mats = Array.isArray(child.material) ? child.material : [child.material];

            mats.forEach((mat, i) => {
              if (simpleMaterials && mat instanceof THREE.MeshStandardMaterial) {
                // Low-tier: downgrade PBR → Phong (~5× simpler shader)
                const phong = new THREE.MeshPhongMaterial({
                  color: mat.color,
                  map: mat.map,
                  normalMap: mat.normalMap,
                  emissive: mat.emissive,
                  emissiveMap: mat.emissiveMap,
                  emissiveIntensity: mat.emissiveIntensity,
                  shininess: 40,
                  transparent: mat.transparent,
                  opacity: mat.opacity,
                  side: mat.side,
                });
                mat.dispose();
                if (Array.isArray(child.material)) {
                  (child.material as THREE.Material[])[i] = phong;
                } else {
                  child.material = phong;
                }
              } else if (mat instanceof THREE.MeshStandardMaterial) {
                if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
                if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
              }
            });
          }
        });

        const box = new THREE.Box3().setFromObject(clone);
        const size = box.getSize(new THREE.Vector3());
        clone.scale.setScalar(modelScale / Math.max(size.x, size.y, size.z));

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
        invalidate(); // request first frame after model is placed
      }, 0);
    }
  }, [scene, camera, modelScale, onLoaded, clonedScene, invalidate]);

  useEffect(() => {
    if (cameraPosition && camera instanceof THREE.PerspectiveCamera) {
      const newTarget = new THREE.Vector3(...cameraPosition);
      if (!targetPosition.current.equals(newTarget)) {
        targetPosition.current.copy(newTarget);
        isTransitioning.current = true;
        invalidate();
      }
    }
  }, [cameraPosition, camera, invalidate]);

  useEffect(() => {
    if (isInteracting && isTransitioning.current) {
      isTransitioning.current = false;
      if (camera instanceof THREE.PerspectiveCamera) {
        targetPosition.current.copy(camera.position);
      }
    }
  }, [isInteracting, camera]);

  useFrame(() => {
    // Auto-rotate in isometric view — call invalidate() to keep requesting frames
    const shouldRotate =
      modelRef.current && !isInteracting && !isTransitioning.current && cameraView === 'isometric';
    if (shouldRotate) {
      modelRef.current!.rotation.y += 0.003;
      invalidate();
    }

    // Camera lerp transition
    if (camera instanceof THREE.PerspectiveCamera && isTransitioning.current && !isInteracting) {
      currentPosition.current.copy(camera.position);
      const distance = currentPosition.current.distanceTo(targetPosition.current);

      if (distance > 0.01) {
        camera.position.lerp(targetPosition.current, 0.12);
        camera.lookAt(0, 0, 0);
        if (controls && 'target' in controls && 'update' in controls) {
          (controls as { target: THREE.Vector3; update: () => void }).target.set(0, 0, 0);
          (controls as { target: THREE.Vector3; update: () => void }).update();
        }
        invalidate();
      } else {
        camera.position.copy(targetPosition.current);
        camera.lookAt(0, 0, 0);
        isTransitioning.current = false;
        if (controls && 'target' in controls && 'update' in controls) {
          (controls as { target: THREE.Vector3; update: () => void }).target.set(0, 0, 0);
          (controls as { target: THREE.Vector3; update: () => void }).update();
        }
        invalidate();
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


// ─── Error Boundary ───────────────────────────────────────────────────────────

interface ModelViewerProps {
  modelPath: string;
  modelScale?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  cameraView?: string;
}

const MAX_ERROR_RETRIES = 5;

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onRetry?: () => void; isMobile?: boolean },
  { hasError: boolean; retryCount: number; gaveUp: boolean }
> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: { children: React.ReactNode; onRetry?: () => void; isMobile?: boolean }) {
    super(props);
    this.state = { hasError: false, retryCount: 0, gaveUp: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { retryCount } = this.state;
    console.error(`3D Viewer Error (attempt ${retryCount + 1}/${MAX_ERROR_RETRIES}):`, error, errorInfo);

    if (retryCount >= MAX_ERROR_RETRIES) {
      this.setState({ gaveUp: true });
      return;
    }

    // Exponential backoff: 2s → 3s → 4.5s → 6.75s → 10s
    const delay = Math.min(2000 * Math.pow(1.5, retryCount), 10000);
    this.retryTimer = setTimeout(() => {
      this.setState(prev => ({ hasError: false, retryCount: prev.retryCount + 1 }));
      this.props.onRetry?.();
    }, delay);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.gaveUp) {
      return (
        <div className="model-viewer-loading-overlay">
          <div style={{ fontSize: '2rem', lineHeight: 1 }}>⚠️</div>
          <p style={{ margin: '0.5rem 0 0', color: '#fff', textAlign: 'center', fontSize: '0.9rem' }}>
            {this.props.isMobile
              ? 'Your device may not support 3D rendering.'
              : 'Failed to load the 3D viewer.'}
          </p>
          <button
            className="camera-view-btn"
            onClick={() => {
              this.setState({ hasError: false, retryCount: 0, gaveUp: false });
              this.props.onRetry?.();
            }}
            style={{ marginTop: '1rem', width: 'auto', display: 'inline-block' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── ModelViewer ──────────────────────────────────────────────────────────────

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath, modelScale, canvasRef, cameraView }) => {
  // Issue 3: Frozen at mount — safe since ModelViewer remounts each time modal opens.
  // useState prevents re-reading window.innerWidth on every render.
  const [tier] = useState(getDeviceTier);
  const [isPhone] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 480);
  const settings = TIER_SETTINGS[tier];

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Eagerly preload GLB before Canvas + Suspense are ready
  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  // Issue 3: Tier-based load timeout (low: 40s, mid: 25s, high: 15s)
  useEffect(() => {
    if (isLoaded) return;
    setTimedOut(false);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => setTimedOut(true), settings.timeoutMs);
    return () => { if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current); };
  }, [modelPath, remountKey, isLoaded, settings.timeoutMs]);

  useEffect(() => {
    if (isLoaded && loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, [isLoaded]);

  const getCameraPosition = useCallback((): [number, number, number] => {
    const distance = isPhone ? 10 : 8;
    switch (cameraView) {
      case 'front': return [0, 0, distance];
      case 'back': return [0, 0, -distance];
      case 'left': return [-distance, 0, 0];
      case 'right': return [distance, 0, 0];
      case 'top': return [0, distance, 0];
      case 'isometric':
      default: return [isPhone ? 7 : 5, isPhone ? 4 : 3, isPhone ? 7 : 5];
    }
  }, [cameraView, isPhone]);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
  };

  const handleInteractionEnd = () => {
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), 1000);
  };

  useEffect(() => {
    return () => { if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current); };
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    setIsInteracting(false);
    setTimedOut(false);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
  }, [modelPath]);

  // Issue 2: handleContextLost has empty deps — it's always the same function reference.
  // Keeping the ref but removing the now-redundant update effect.
  const handleContextLost = useCallback(() => {
    setIsLoaded(false);
    setTimedOut(false);
    setRemountKey(k => k + 1);
  }, []);
  const handleContextLostRef = useRef(handleContextLost);
  // (no update effect needed — handleContextLost is stable, ref is initialised correctly)

  // User-triggered reload after genuine download timeout — clears cache for a fresh network fetch.
  const handleReload = useCallback(() => {
    useGLTF.clear(modelPath);
    setTimedOut(false);
    setIsLoaded(false);
    setRemountKey(k => k + 1);
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
            onClick={handleReload}
            style={{ marginTop: '0.75rem', width: 'auto', display: 'inline-block' }}
          >
            Reload Model
          </button>
        </div>
      )}

      <ErrorBoundary isMobile={isPhone} onRetry={handleReload}>
        {/* key={remountKey}: CRITICAL — forces React to unmount+remount the Canvas
            on context loss or user reload. Without this, remountKey changes only
            update state; the old Canvas/Model stays alive with clonedScene set,
            so onLoaded() is never re-called and the overlay stays stuck forever. */}
        <Canvas
          key={remountKey}
          ref={activeCanvasRef}
          camera={{ position: isPhone ? [7, 4, 7] : [5, 3, 5], fov: 50 }}
          gl={{
            antialias: settings.antialias,
            alpha: true,
            // mediump on low-tier: highp float precision causes silent shader compile failure
            // on PowerVR GT7600 (iPhone 7) and Adreno 5xx GPUs
            precision: settings.precision,
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.NoToneMapping,
            powerPreference: 'default',
          }}
          style={{ background: 'transparent' }}
          // Issue 2: demand rendering — GPU idles when nothing is animating.
          // Model.useFrame calls invalidate() during rotation + transitions.
          // OrbitControls (makeDefault) calls invalidate() natively on user input.
          frameloop="demand"
          dpr={settings.dpr}
          onCreated={({ gl }) => {
            // Shader warnings suppressed at renderer level (not via global console.warn)
            gl.debug.checkShaderErrors = false;
            // On WebGL context loss (iOS backgrounding, memory pressure):
            // recover by remounting the Canvas — keep the already-downloaded GLB cache.
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setTimeout(() => handleContextLostRef.current(), 300);
            });
          }}
        >
          {/* Issue 6: RendererConfig removed — Canvas gl prop already sets outputColorSpace + toneMapping */}

          {/* ── Lighting — tiered by device capability ──────────────────── */}
          {/* ALL tiers: soft ambient */}
          <ambientLight intensity={0.6} />

          {/* ALL tiers: key directional (shadow only on mid/high as per settings) */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow={settings.castShadow}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.0001}
          />

          {/* MID + HIGH: fill light to soften harsh shadows */}
          {settings.lightCount !== 'min' && (
            <directionalLight position={[-8, 5, -3]} intensity={0.4} />
          )}

          {/* HIGH only: back light + hemisphere sky + point highlight */}
          {settings.lightCount === 'full' && (
            <>
              <directionalLight position={[0, 3, -10]} intensity={0.3} />
              <hemisphereLight color="#ffffff" groundColor="#666666" intensity={0.5} />
              <pointLight position={[0, 8, 0]} intensity={0.3} distance={20} decay={2} />
            </>
          )}

          <Suspense fallback={null}>
            <Model
              modelPath={modelPath}
              modelScale={(modelScale || 3) * (isPhone ? 0.65 : 1)}
              // Issue 1: useCallback stabilises the ref so Model's useEffect
              // doesn't fire on every parent render cycle
              onLoaded={useCallback(() => setIsLoaded(true), [])}
              isInteracting={isInteracting}
              cameraPosition={getCameraPosition()}
              cameraView={cameraView}
              simpleMaterials={settings.simpleMaterials}
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
      </ErrorBoundary>
    </div>
  );
};

export default ModelViewer;
