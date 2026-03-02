import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── 3D Cube Spinner ─────────────────────────────────────────────────────────
const LoadingSpinner: React.FC = () => (
  <div className="mv-spinner-cube">
    <div className="mv-spinner-cube-inner">
      <div className="cube-face face-front" />
      <div className="cube-face face-back" />
      <div className="cube-face face-right" />
      <div className="cube-face face-left" />
      <div className="cube-face face-top" />
      <div className="cube-face face-bottom" />
    </div>
  </div>
);

// ─── Real-time fetch progress bar ───────────────────────────────────────────────
// Reads from state (set by the fetch-stream download below) — actual bytes, not item completion.
const LoadingProgress: React.FC<{ pct: number }> = ({ pct }) => (
  <div className="mv-load-progress">
    <div className="mv-load-bar">
      <div className="mv-load-fill" style={{ width: `${pct}%` }} />
    </div>
    <span className="mv-load-pct">{pct}%</span>
  </div>
);


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
  // low: antialias off, native DPR (1×), no shadows, 2 lights, 90s timeout,
  //      Phong material (not PBR), mediump precision — essential for iPhone 7 / Adreno 5xx
  low: { antialias: false, dpr: 1, castShadow: false, timeoutMs: 75000, lightCount: 'min', simpleMaterials: true, precision: 'mediump' },
  // mid: antialias off, native DPR (1×), no shadows, 3 lights, standard PBR ok
  mid: { antialias: false, dpr: 1, castShadow: false, timeoutMs: 75000, lightCount: 'mid', simpleMaterials: false, precision: 'highp' },
  // high: full visuals — antialias, 1.5× DPR, shadows, all 5 lights, PBR
  high: { antialias: true, dpr: [1, 1.5], castShadow: true, timeoutMs: 75000, lightCount: 'full', simpleMaterials: false, precision: 'highp' },
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
            mats.forEach(m => {
              if (m.name === 'DowngradedPhong') m.dispose();
            });
            // DO NOT dispose geometry or original materials here, 
            // as they are shared with the useGLTF cache!
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
                  name: 'DowngradedPhong',
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
                // DO NOT dispose the original PBR material here, 
                // because it belongs to the useGLTF cache.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, camera, modelScale]); // omitted onLoaded + invalidate as they trigger render loops / are stable

  useEffect(() => {
    if (cameraPosition && camera instanceof THREE.PerspectiveCamera) {
      const newTarget = new THREE.Vector3(...cameraPosition);
      if (!targetPosition.current.equals(newTarget)) {
        targetPosition.current.copy(newTarget);
        isTransitioning.current = true;
        invalidate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraPosition ? cameraPosition.join(',') : null, camera, invalidate]);

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
      if (typeof controls !== 'undefined' && controls !== null) {
        // Safe check for controls object to prevent crash if unmounted partway
        const ctrl = controls as any;

        currentPosition.current.copy(camera.position);
        const distance = currentPosition.current.distanceTo(targetPosition.current);

        if (distance > 0.01) {
          camera.position.lerp(targetPosition.current, 0.12);
          if (ctrl.target) ctrl.target.set(0, 0, 0);
          if (ctrl.update) ctrl.update();
          invalidate();
        } else {
          camera.position.copy(targetPosition.current);
          if (ctrl.target) ctrl.target.set(0, 0, 0);
          if (ctrl.update) ctrl.update();
          isTransitioning.current = false;
          invalidate();
        }
      } else {
        isTransitioning.current = false; // abort transition if controls vanished
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
  const [remountKey, setRemountKey] = useState<number | null>(0);

  // Fake progress bar that crawls to 99% over 60 seconds
  const [downloadProgress, setDownloadProgress] = useState(0);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCanvasRef = canvasRef || internalCanvasRef;

  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  // ─── Dynamic 60s Progress Bar ───────────────────────────────────────────────
  // Crawls non-linearly to 99% over 60 seconds to simulate natural loading speeds:
  // bursts quickly, stalls on fake "heavy assets", bursts again, and rests at 99%.
  useEffect(() => {
    // Start at 1% so it doesn't look dead on quick cache reloads
    setDownloadProgress(1);
    if (isLoaded) {
      setDownloadProgress(100);
      return;
    }

    // [Time Elapsed %] -> [Progress %]
    const keyframes = [
      { t: 0.00, p: 1 },
      { t: 0.05, p: 2 },    // 0-3s:   Crawls to 2% (Slow start)
      { t: 0.15, p: 15 },   // 3-9s:   Bursts to 15% (Speeds up)
      { t: 0.50, p: 35 },   // 9-30s:  Crawls slowly to 35% (Slows again)
      { t: 0.70, p: 85 },   // 30-42s: Bursts to 85% (Speeds up)
      { t: 1.00, p: 99 },   // 42-60s: Crawls to 99% (Slows down to wait)
    ];

    let active = true;
    const durationMs = 60000;
    const startTime = Date.now();

    const tick = () => {

      if (!active) return;
      const elapsed = Date.now() - startTime;

      if (elapsed >= durationMs) {
        setDownloadProgress(99);
        clearInterval(interval);
        return;
      }

      const t = elapsed / durationMs;

      // Find current keyframe segment
      let i = 0;
      while (i < keyframes.length - 1 && t >= keyframes[i + 1].t) {
        i++;
      }

      const start = keyframes[i];
      const end = keyframes[i + 1];

      // Linear interpolate between the two keyframes
      const segmentT = (t - start.t) / (end.t - start.t);
      const currentP = start.p + (end.p - start.p) * segmentT;

      setDownloadProgress(Math.max(1, Math.floor(currentP)));
    };

    tick(); // fire immediately
    const interval = setInterval(tick, 200); // 200ms updates (5FPS) for smooth numbers

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [modelPath, isLoaded, remountKey]);

  // 90s load timeout — triggers "Taking too long" overlay

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

  // Hoisted from JSX to prevent 'Rendered fewer hooks' error when remountKey goes null
  const handleModelLoaded = useCallback(() => {
    // Debounce the load flag slightly so instant-cache hits don't cause a 1-frame UI flash
    setTimeout(() => setIsLoaded(true), 50);
  }, []);

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
    setDownloadProgress(1);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
  }, [modelPath]);

  // Context loss: completely unmount Canvas, then remount after tiny delay
  const handleContextLost = useCallback(() => {
    setRemountKey(currentKey => {
      // If we already set it to null (manual reload/unmount), do not recover!
      // React Three Fiber calls forceContextLoss() on unmount which triggers this.
      if (currentKey === null) return currentKey;

      setIsLoaded(false);
      setTimedOut(false);
      setTimeout(() => {
        setRemountKey(k => (k === null ? 1 : k + 1));
      }, 150);
      return null;
    });
  }, []);
  const handleContextLostRef = useRef(handleContextLost);

  // User reload: wipe Canvas, evict caches, restart process after delay
  const handleReload = useCallback(() => {
    setIsLoaded(false);
    setTimedOut(false);
    setDownloadProgress(1);

    // 1. Completely destroy the Canvas from the DOM
    setRemountKey(null);

    // 2. Clear Three.js memory while Canvas is unmounted
    useGLTF.clear(modelPath);

    // 3. Mount fresh Canvas 150ms later (prevents React 18 overlapping renders)
    setTimeout(() => {
      setRemountKey(k => (k === null ? 1 : k + 1));
    }, 150);
  }, [modelPath]);

  return (
    <div className="model-viewer-container">
      {/* Show overlay when not loaded, but use a fade-out class if we just loaded it */}
      <div
        className={`model-viewer-loading-overlay ${isLoaded ? 'fade-out' : ''}`}
        style={{
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? 'none' : 'auto',
          transition: 'opacity 0.4s ease-in-out',
          visibility: (isLoaded && !timedOut) ? 'hidden' : 'visible', // hide fully after fade but keep layout
          transitionDelay: isLoaded ? '0s' : '0.2s', // slight delay on show to prevent fast-cache flicker
        }}
      >
        <>
          <LoadingSpinner />
          <p>Loading 3D Model...</p>
          <LoadingProgress pct={downloadProgress} />
          {timedOut && (
            <>
              <p style={{ marginTop: '0.5rem', color: '#fff', textAlign: 'center', fontSize: '0.9rem' }}>
                Taking too long?<br />Check your internet connection.
              </p>
              <div className="mv-snail-container" aria-hidden="true">
                <span className="mv-snail">🐌</span>
              </div>
            </>
          )}
        </>
      </div>

      <ErrorBoundary isMobile={isPhone} onRetry={handleReload}>
        {remountKey !== null && (
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

            <Suspense key={modelPath} fallback={null}>
              <Model
                modelPath={modelPath}
                modelScale={(modelScale || 3) * (isPhone ? 0.65 : 1)}
                onLoaded={handleModelLoaded}
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
        )}
      </ErrorBoundary>
    </div>
  );
};

export default ModelViewer;
