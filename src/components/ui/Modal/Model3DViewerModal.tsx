import React, { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
// React.lazy — Three.js (~994 kB) only loads when user opens a 3D viewer
const ModelViewer = lazy(() => import('./ModelViewer'));
import './Model3DViewerModal.css';
import { pauseImageQueue, resumeImageQueue } from '../../../utils/imageQueue';
import { getAssetUrl } from '../../../utils/assets';

// TEST: Using compressed_glb/ folder — Draco-compressed models (~97% smaller than originals)
// TODO: Once confirmed working, replace originals in glb/ with these and revert paths back to glb/
const dedimplerFacerModel = getAssetUrl('compressed_glb/Dedimpler&Facer.glb');
const bundlingMachineModel = getAssetUrl('compressed_glb/BundlingMachine.glb');
const productStorageModel = getAssetUrl('compressed_glb/ProductStorage.glb');
const transferTableModel = getAssetUrl('compressed_glb/TransferTable.glb');
const formingSizingModel = getAssetUrl('compressed_glb/Forming&Sizing.glb');
const airBlowModel = getAssetUrl('compressed_glb/AirBlow.glb');
const bundleSeparatorModel = getAssetUrl('compressed_glb/BundleSeparator.glb');
const pipeDryingSectionModel = getAssetUrl('compressed_glb/PipeDryingSection.glb');
const bindingMachineModel = getAssetUrl('compressed_glb/BindingMachine.glb');
const looperModel = getAssetUrl('compressed_glb/looper.glb');
const horizontalLooperModel = getAssetUrl('compressed_glb/horizontalLooper.glb');
const shearWelderModel = getAssetUrl('compressed_glb/shearwelder.glb');
const uncoilerModel = getAssetUrl('compressed_glb/uncoiler.glb');
const levelerModel = getAssetUrl('compressed_glb/leveler.glb');
const furnaceModel = getAssetUrl('compressed_glb/furnace.glb');

// --- SVG ICONS ---
const ModalBoxIcon: React.FC = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 7L12 12L20 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 7V17L12 22V12L4 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M20 7V17L12 22V12L20 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 7L12 12L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// Chevron toggle — only renders when camera panel is hidden, so it's always pointing right
const ChevronIcon: React.FC = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ModelConfig {
  path: string | null;
  scale?: number;
}

// Issue 1 Fix: Single canonical lowercase key per model — no more duplicates.
// Lookup is normalized to lowercase+trim at call site.
const MODEL_MAP: { [key: string]: ModelConfig } = {
  'dedimpler and facer': { path: dedimplerFacerModel, scale: 5 },
  'dedimpler & facer': { path: dedimplerFacerModel, scale: 5 },
  'bundling machine': { path: bundlingMachineModel, scale: 5 },
  'product storage': { path: productStorageModel, scale: 5 },
  'pipe bundling': { path: null, scale: 5 },
  'transfer table (lifter)': { path: transferTableModel, scale: 5 },
  'transfer table': { path: null, scale: 5 },
  'finishing table': { path: null, scale: 5 },
  'looper machine': { path: looperModel, scale: 5 },
  'horizontal looper machine': { path: horizontalLooperModel, scale: 5 },
  'shear welder machine': { path: shearWelderModel, scale: 5 },
  'uncoiler machine': { path: uncoilerModel, scale: 5 },
  'leveler machine': { path: levelerModel, scale: 5 },
  'furnace': { path: furnaceModel, scale: 5 },
  'binding machine': { path: bindingMachineModel, scale: 5 },
  'forming and sizing machine': { path: formingSizingModel, scale: 5 },
  'milling cutoff machine': { path: null, scale: 5 },
  'bundle separator': { path: bundleSeparatorModel, scale: 5 },
  'pipe drying section': { path: pipeDryingSectionModel, scale: 5 },
  'finishing line': { path: null, scale: 5 },
  'air blow': { path: airBlowModel, scale: 5 },
  'vertical looper': { path: null, scale: 5 },
};

export type CameraView = 'isometric' | 'front' | 'back' | 'left' | 'right' | 'top';

interface Model3DViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelTitle: string;
  modelKey?: string; // stable identifier for map lookup
}

const Model3DViewerModal: React.FC<Model3DViewerModalProps> = ({
  isOpen,
  onClose,
  modelTitle,
  modelKey
}) => {
  const { t } = useTranslation();
  const [cameraView, setCameraView] = useState<CameraView>('isometric');

  // Computed at render time — always accurate since component remounts each open (early return null above).
  // No useState needed; a frozen value from a desktop-width mount would break auto-hide.
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  // Auto-hide camera panel on mobile: starts hidden, shows on open/interaction, hides after 10s
  const [isCameraPanelVisible, setIsCameraPanelVisible] = useState(true);
  const cameraHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Issue 6: useCallback so this can be safely listed as a dep in useEffect below
  const startCameraHideTimer = useCallback(() => {
    if (cameraHideTimerRef.current) clearTimeout(cameraHideTimerRef.current);
    cameraHideTimerRef.current = setTimeout(() => setIsCameraPanelVisible(false), 10000);
  }, []);

  const handleCameraToggle = () => {
    setIsCameraPanelVisible(prev => {
      if (!prev) {
        // Opening: start auto-hide timer
        startCameraHideTimer();
      } else {
        // Manually closing: cancel any pending timer
        if (cameraHideTimerRef.current) clearTimeout(cameraHideTimerRef.current);
      }
      return !prev;
    });
  };

  const handleCameraViewSelect = (view: CameraView) => {
    setCameraView(view);
    // Reset auto-hide timer every time user picks a view
    startCameraHideTimer();
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (cameraHideTimerRef.current) clearTimeout(cameraHideTimerRef.current);
    };
  }, []);

  // Issue 4 Fix: Reset camera to isometric and re-show panel whenever a different model is opened
  useEffect(() => {
    if (isOpen) {
      setCameraView('isometric');
      setIsCameraPanelVisible(true);
      startCameraHideTimer();
    } else {
      if (cameraHideTimerRef.current) clearTimeout(cameraHideTimerRef.current);
    }
  }, [isOpen, modelKey, startCameraHideTimer]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      // Pause image queue so the GLB fetch gets full bandwidth on mobile
      pauseImageQueue();
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Hide chatbot widget — it has z-index 9996/9997 which sits above the modal on mobile
      document.body.classList.add('modal-3d-open');
      return () => {
        resumeImageQueue();
        document.body.style.overflow = originalOverflow || '';
        document.body.classList.remove('modal-3d-open');
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Issue 1 Fix: Normalize lookup key to lowercase+trim — covers all casing variants with one map entry
  const lookupKey = (modelKey || modelTitle).toLowerCase().trim();
  const modelConfig = MODEL_MAP[lookupKey];

  // Issue 2 Fix: Unknown model shows "unavailable" placeholder instead of a blank modal
  const hasModel = modelConfig ? modelConfig.path !== null : false;

  return (
    <div className="model-3d-modal-overlay" onClick={handleClose}>
      <div className="model-3d-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="model-3d-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="model-3d-modal-header">
          {/* We use modelTitle directly here as it is often a proper product name,
              but we translate the subtitle and placeholder text */}
          <h2 className="model-3d-modal-title">{modelTitle}</h2>
          <p className="model-3d-modal-subtitle">
            {hasModel ? t('projects.viewer.subtitle_interactive') : t('projects.viewer.subtitle_standard')}
          </p>
        </div>

        <div className="model-3d-viewer-wrapper">
          {hasModel && modelConfig ? (
            <>
              <Suspense key={modelConfig.path} fallback={
                <div className="model-viewer-loading-overlay">
                  <div className="model-viewer-spinner"></div>
                  <p>Loading 3D Viewer...</p>
                </div>
              }>
                <ModelViewer
                  modelPath={modelConfig.path!}
                  modelScale={modelConfig.scale}
                  cameraView={cameraView}
                />
              </Suspense>

              <div
                className={`camera-view-buttons${isMobile ? (isCameraPanelVisible ? ' cam-panel-visible' : ' cam-panel-hidden') : ''
                  }`}
              >
                {(['isometric', 'front', 'back', 'left', 'right', 'top'] as CameraView[]).map((view) => (
                  <button
                    key={view}
                    className={`camera-view-btn ${cameraView === view ? 'active' : ''}`}
                    onClick={() => handleCameraViewSelect(view)}
                    title={t(`projects.viewer.camera.${view}_title`)}
                  >
                    {t(`projects.viewer.camera.${view}`)}
                  </button>
                ))}
              </div>

              {/* Mobile-only chevron — only shown when panel is hidden */}
              {isMobile && !isCameraPanelVisible && (
                <button
                  className="camera-panel-toggle"
                  onClick={handleCameraToggle}
                  aria-label="Show camera views"
                >
                  <ChevronIcon />
                </button>
              )}
            </>
          ) : (
            // Issue 2 Fix: Renders for both null-path models AND unrecognized model keys
            <div className="model-3d-placeholder">
              <div className="model-3d-placeholder-content">
                <div className="model-3d-placeholder-icon">
                  <ModalBoxIcon />
                </div>
                <h3 className="model-3d-placeholder-title">{t('projects.viewer.unavailable_title')}</h3>
                <p className="model-3d-placeholder-text">{t('projects.viewer.unavailable_text')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model3DViewerModal;