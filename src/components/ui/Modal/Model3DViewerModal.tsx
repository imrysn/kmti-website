import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Added for translation
import ModelViewer from './ModelViewer';
import './Model3DViewerModal.css';

import dedimplerFacerModel from '../../../assets/glb/Dedimpler&Facer.glb';
import bundlingMachineModel from '../../../assets/glb/BundlingMachine.glb';
import productStorageModel from '../../../assets/glb/ProductStorage.glb';
import transferTableModel from '../../../assets/glb/TransferTable.glb';
import formingSizingModel from '../../../assets/glb/Forming&Sizing.glb';
import airBlowModel from '../../../assets/glb/AirBlow.glb';
import bundleSeparatorModel from '../../../assets/glb/BundleSeparator.glb';
import pipeDryingSectionModel from '../../../assets/glb/PipeDryingSection.glb';
import bindingMachineModel from '../../../assets/glb/BindingMachine.glb';
import looperModel from '../../../assets/glb/looper.glb';
import horizontalLooperModel from '../../../assets/glb/horizontalLooper.glb';
import shearWelderModel from '../../../assets/glb/shearwelder.glb';
import uncoilerModel from '../../../assets/glb/uncoiler.glb';
import levelerModel from '../../../assets/glb/leveler.glb';
import furnaceModel from '../../../assets/glb/furnace.glb';

interface ModelConfig {
  path: string | null;
  scale?: number;
}

// Keep the internal MODEL_MAP as is since these keys map to technical data
const MODEL_MAP: { [key: string]: ModelConfig } = {
  'Dedimpler and Facer': { path: dedimplerFacerModel, scale: 5 },
  'Dedimpler & Facer': { path: dedimplerFacerModel, scale: 5 },
  'DEDIMPLER & FACER': { path: dedimplerFacerModel, scale: 5 },
  'Bundling Machine': { path: bundlingMachineModel, scale: 5 },
  'BUNDLING MACHINE': { path: bundlingMachineModel, scale: 5 },
  'Product Storage': { path: productStorageModel, scale: 5 },
  'Pipe Bundling': { path: null, scale: 5 },
  'Transfer Table (Lifter)': { path: transferTableModel, scale: 5 },
  'Transfer Table': { path: null, scale: 5 },
  'FINISHING TABLE': { path: null, scale: 5 },
  'Looper Machine': { path: looperModel, scale: 5 },
  'LOOPER MACHINE': { path: looperModel, scale: 5 },
  'Horizontal Looper Machine': { path: horizontalLooperModel, scale: 5 },
  'HORIZONTAL LOOPER MACHINE': { path: horizontalLooperModel, scale: 5 },
  'Shear Welder Machine': { path: shearWelderModel, scale: 5 },
  'SHEAR WELDER MACHINE': { path: shearWelderModel, scale: 5 },
  'Uncoiler Machine': { path: uncoilerModel, scale: 5 },
  'UNCOILER MACHINE': { path: uncoilerModel, scale: 5 },
  'Leveler Machine': { path: levelerModel, scale: 5 },
  'LEVELER MACHINE': { path: levelerModel, scale: 5 },
  'Furnace': { path: furnaceModel, scale: 5 },
  'FURNACE': { path: furnaceModel, scale: 5 },
  'Binding Machine': { path: bindingMachineModel, scale: 5 },
  'BINDING MACHINE': { path: bindingMachineModel, scale: 5 },
  'Forming and Sizing Machine': { path: formingSizingModel, scale: 5 },
  'FORMING AND SIZING MACHINE': { path: formingSizingModel, scale: 5 },
  'Milling Cutoff Machine': { path: null, scale: 5 },
  'MILLING CUTOFF MACHINE': { path: null, scale: 5 },
  'Bundle Separator': { path: bundleSeparatorModel, scale: 5 },
  'Pipe Drying Section': { path: pipeDryingSectionModel, scale: 5 },
  'Finishing Line': { path: null, scale: 5 },
  'FINISHING LINE': { path: null, scale: 5 },
  'Air Blow': { path: airBlowModel, scale: 5 },
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
  const { t } = useTranslation(); // Initialize translation hook
  const [cameraView, setCameraView] = useState<CameraView>('isometric');

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
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

  // Use modelKey if available, otherwise fallback to modelTitle (backward compatibility/English default)
  const lookupKey = modelKey || modelTitle;
  const modelConfig = MODEL_MAP[lookupKey];

  if (!modelConfig) {
    return null;
  }

  const hasModel = modelConfig.path !== null;

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
          {hasModel ? (
            <>
              <ModelViewer
                modelPath={modelConfig.path!}
                modelScale={modelConfig.scale}
                cameraView={cameraView}
              />

              <div className="camera-view-buttons">
                {(['isometric', 'front', 'back', 'left', 'right', 'top'] as CameraView[]).map((view) => (
                  <button
                    key={view}
                    className={`camera-view-btn ${cameraView === view ? 'active' : ''}`}
                    onClick={() => setCameraView(view)}
                    title={t(`projects.viewer.camera.${view}_title`)}
                  >
                    {t(`projects.viewer.camera.${view}`)}
                  </button>
                ))}
              </div>

              <div className="model-3d-controls-overlay">
                <div className="model-3d-controls-info">
                  <div className="model-3d-control-hint">
                    <span className="model-3d-control-icon">🖱️</span>
                    <span>{t('projects.viewer.controls.rotate')}</span>
                  </div>
                  <div className="model-3d-control-hint">
                    <span className="model-3d-control-icon">🔍</span>
                    <span>{t('projects.viewer.controls.zoom')}</span>
                  </div>
                  <div className="model-3d-control-hint">
                    <span className="model-3d-control-icon">⌨️</span>
                    <span>{t('projects.viewer.controls.pan')}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="model-3d-placeholder">
              <div className="model-3d-placeholder-content">
                <div className="model-3d-placeholder-icon">📦</div>
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