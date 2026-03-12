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




// ─── Model Component ──────────────────────────────────────────────────────────

interface ModelProps {
  modelPath: string;
  modelScale?: number;
  onLoaded?: () => void;
  isInteracting?: boolean;
  cameraPosition?: [number, number, number];
  cameraView?: string;
}

const Model: React.FC<ModelProps> = ({
  modelPath, modelScale = 3, onLoaded, isInteracting, cameraPosition, cameraView
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
  { hasError: boolean; retryCount: number; gaveUp: boolean; lastError: string }
> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: { children: React.ReactNode; onRetry?: () => void; isMobile?: boolean }) {
    super(props);
    this.state = { hasError: false, retryCount: 0, gaveUp: false, lastError: '' };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { retryCount } = this.state;
    console.error(`3D Viewer Error (attempt ${retryCount + 1}/${MAX_ERROR_RETRIES}):`, error, errorInfo);

    // Store the error string for on-screen debugging on physical devices
    this.setState({ lastError: error.message || String(error) });

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
              this.setState({ hasError: false, retryCount: 0, gaveUp: false, lastError: '' });
              this.props.onRetry?.();
            }}
            style={{ marginTop: '1rem', width: 'auto', display: 'inline-block' }}
          >
            Try Again
          </button>
          {this.state.lastError && (
            <p style={{ marginTop: '1rem', color: '#ffaaaa', fontSize: '0.75rem', maxWidth: '300px', wordWrap: 'break-word', textAlign: 'center' }}>
              Debug: {this.state.lastError}
            </p>
          )}
        </div>
      );
    }
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── ModelViewer ──────────────────────────────────────────────────────────────

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath, modelScale, canvasRef, cameraView }) => {
  // Detect mobile-class devices (phones and small tablets up to 768px CSS width).
  // This drives GPU optimizations: low-power mode, no antialias, DPR=1, no shadows.
  const [isPhone] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // ─── Interaction Hint Toast ───────────────────────────────────────────────────
  // Show a brief hint after model loads. Mouse hints on desktop, touch on mobile.
  // Dismissed on first pointer interaction or after 2.5s.
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoaded) {
      setShowHint(true);
      hintTimerRef.current = setTimeout(() => setShowHint(false), 2500);
    }
    return () => { if (hintTimerRef.current) clearTimeout(hintTimerRef.current); };
  }, [isLoaded]);

  const dismissHint = useCallback(() => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setShowHint(false);
  }, []);
  const [remountKey, setRemountKey] = useState<number | null>(0);
  const contextLossCountRef = useRef(0);
  const [gaveUpOnContext, setGaveUpOnContext] = useState(false);

  // Fake progress bar that crawls to 99% over 60 seconds
  const [downloadProgress, setDownloadProgress] = useState(0);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_CONTEXT_LOSSES = 3;

  const activeCanvasRef = canvasRef || internalCanvasRef;

  useEffect(() => {
    // Draco decoder hosted locally in public/draco/ — more reliable than CDN on mobile networks.
    // Files copied from: node_modules/three/examples/jsm/libs/draco/gltf/
    useGLTF.setDecoderPath('/draco/');
    useGLTF.preload(modelPath);
  }, [modelPath]);

  // ─── Dynamic 60s Progress Bar ───────────────────────────────────────────────
  // Crawls non-linearly to 99% over 60 seconds to simulate natural loading speeds:
  // bursts quickly, stalls on fake "heavy assets", bursts again, and rests at 99%.
  // NOTE: remountKey intentionally excluded from deps — canvas remounts (context loss)
  // should NOT reset the progress bar, only a model path change or load completion should.
  useEffect(() => {
    let active = true;

    // Start at 1% so it doesn't look dead on quick cache reloads
    if (active) setDownloadProgress(1);

    if (isLoaded) {
      if (active) setDownloadProgress(100);
      return;
    }

    // [Time Elapsed %] -> [Progress %]
    const keyframes = [
      { t: 0.00, p: 1 },
      { t: 0.05, p: 99 },   // 0-3s: Bursts to 99%
      { t: 1.00, p: 99 },   // 3-60s: Waits at 99%
    ];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelPath, isLoaded]); // remountKey intentionally omitted — canvas remounts must not reset progress

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
    setDownloadProgress(1);
    contextLossCountRef.current = 0;
    setGaveUpOnContext(false);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
  }, [modelPath]);

  // Context loss: completely unmount Canvas, then remount after a recovery delay.
  // Capped at MAX_CONTEXT_LOSSES to avoid an infinite loop on mobile devices
  // with limited GPU memory where every mount attempt loses the context.
  const handleContextLost = useCallback(() => {
    setRemountKey(currentKey => {
      // If we already set it to null (manual reload/unmount), do not recover!
      // React Three Fiber calls forceContextLoss() on unmount which triggers this.
      if (currentKey === null) return currentKey;

      contextLossCountRef.current += 1;
      if (contextLossCountRef.current >= MAX_CONTEXT_LOSSES) {
        // Too many context losses — give up and show error message
        setGaveUpOnContext(true);
        return null;
      }

      setIsLoaded(false);
      // Longer delay (800ms) to give the mobile GPU time to recover memory
      setTimeout(() => {
        setRemountKey(k => (k === null ? 1 : k + 1));
      }, 800);
      return null;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleContextLostRef = useRef(handleContextLost);

  // User reload: wipe Canvas, evict caches, restart process after delay
  const handleReload = useCallback(() => {
    setIsLoaded(false);
    setDownloadProgress(1);
    contextLossCountRef.current = 0;
    setGaveUpOnContext(false);

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
    <div className="model-viewer-container" onPointerDown={dismissHint}>
      {/* Give-up overlay: shown when WebGL context is lost too many times */}
      {gaveUpOnContext && (
        <div className="model-viewer-loading-overlay">
          <div style={{ fontSize: '2rem', lineHeight: 1 }}>⚠️</div>
          <p style={{ margin: '0.5rem 0 0', color: '#fff', textAlign: 'center', fontSize: '0.9rem' }}>
            {isPhone
              ? 'Your device may not support 3D rendering.'
              : 'Failed to initialize 3D renderer.'}
          </p>
          <button
            className="camera-view-btn"
            onClick={handleReload}
            style={{ marginTop: '1rem', width: 'auto', display: 'inline-block' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Show overlay when not loaded, but use a fade-out class if we just loaded it */}
      {!gaveUpOnContext && (
        <div
          className={`model-viewer-loading-overlay ${isLoaded ? 'fade-out' : ''}`}
          style={{
            opacity: isLoaded ? 0 : 1,
            pointerEvents: isLoaded ? 'none' : 'auto',
            transition: 'opacity 0.4s ease-in-out',
            visibility: isLoaded ? 'hidden' : 'visible', // hide fully after fade but keep layout
            transitionDelay: isLoaded ? '0s' : '0.2s', // slight delay on show to prevent fast-cache flicker
          }}
        >
          <>
            <LoadingSpinner />
            <p>Loading 3D Model...</p>
            <LoadingProgress pct={downloadProgress} />
          </>
        </div>
      )}

      {/* Interaction hint toast — shown once when model loads, responsive to device type */}
      {showHint && (
        <div className="mv-hint" aria-hidden="true">
          {isPhone ? (
            <>
              <span>👆 Drag to rotate</span>
              <span className="mv-hint-divider">·</span>
              <span>🤏 Pinch to zoom</span>
            </>
          ) : (
            <>
              <span>🖱 Drag to rotate</span>
              <span className="mv-hint-divider">·</span>
              <span>Scroll to zoom</span>
              <span className="mv-hint-divider">·</span>
              <span>Right-click to pan</span>
            </>
          )}
        </div>
      )}

      <ErrorBoundary isMobile={isPhone} onRetry={handleReload}>
        {remountKey !== null && (
          <Canvas
            key={remountKey}
            ref={activeCanvasRef}
            camera={{ position: isPhone ? [7, 4, 7] : [5, 3, 5], fov: 50 }}
            gl={{
              // Mobile: disable antialias (cuts VRAM ~50%), use low-power GPU (integrated
              // GPU on iOS/Android is far more stable than discrete, avoids context loss).
              // Desktop: keep full quality settings.
              antialias: !isPhone,
              alpha: true,
              outputColorSpace: THREE.SRGBColorSpace,
              toneMapping: THREE.NoToneMapping,
              powerPreference: isPhone ? 'low-power' : 'default',
              precision: isPhone ? 'mediump' : 'highp',
            }}
            style={{ background: 'transparent' }}
            frameloop="demand"
            // Mobile: render at exactly 1× DPR — no supersampling, saves VRAM + fill rate
            // Desktop: allow up to 1.5× for sharper rendering on HiDPI screens
            dpr={isPhone ? 1 : [1, 1.5]}
            onCreated={({ gl }) => {
              gl.debug.checkShaderErrors = false;
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                setTimeout(() => handleContextLostRef.current(), 300);
              });
            }}
          >
            {/* ── Lighting ─────────────────────────────────────────────────────────── */}
            {/* Mobile: 2-light setup — boosted ambient + 1 directional, NO shadow maps  */}
            {/* Desktop: full 5-light setup with shadow map                              */}
            <ambientLight intensity={isPhone ? 1.4 : 0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={isPhone ? 1.6 : 1.2}
              castShadow={!isPhone}
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
              shadow-bias={-0.0001}
            />
            {!isPhone && <directionalLight position={[-8, 5, -3]} intensity={0.4} />}
            {!isPhone && <directionalLight position={[0, 3, -10]} intensity={0.3} />}
            {!isPhone && <hemisphereLight color="#ffffff" groundColor="#666666" intensity={0.5} />}
            {!isPhone && <pointLight position={[0, 8, 0]} intensity={0.3} distance={20} decay={2} />}

            <Suspense key={modelPath} fallback={null}>
              <Model
                modelPath={modelPath}
                modelScale={(modelScale || 3) * (isPhone ? 0.65 : 1)}
                onLoaded={handleModelLoaded}
                isInteracting={isInteracting}
                cameraPosition={getCameraPosition()}
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
        )}
      </ErrorBoundary>
    </div>
  );
};

export default ModelViewer;
