import React, { useEffect } from 'react';
import ModelViewer from './ModelViewer';
import './Model3DViewerModal.css';

// Import all 3D model files
import looperModel from '../../../assets/3DMODELS/looper.glb';
import horizontalLooperModel from '../../../assets/3DMODELS/horizontalLooper.glb';
import shearwelderModel from '../../../assets/3DMODELS/shearwelder.glb';
import uncoilerModel from '../../../assets/3DMODELS/uncoiler.glb';
import levelerModel from '../../../assets/3DMODELS/leveler.glb';
import furnaceModel from '../../../assets/3DMODELS/furnace.glb';
import bindingMachineModel from '../../../assets/3DMODELS/BindingMachine.glb';

// Model mapping based on machine title with optional scale override
interface ModelConfig {
  path: string;
  scale?: number; // Custom scale factor (default is 3)
}

const MODEL_MAP: { [key: string]: ModelConfig } = {
  'Looper Machine': { path: looperModel, scale: 5 },
  'Horizontal Looper Machine': { path: horizontalLooperModel, scale: 5 },
  'Shear Welder Machine': { path: shearwelderModel, scale: 5 },
  'Uncoiler Machine': { path: uncoilerModel, scale: 5 },
  'Leveler Machine': { path: levelerModel, scale: 5 },
  'Furnace': { path: furnaceModel, scale: 5 },
  'Binding Machine': { path: bindingMachineModel, scale: 5 },
};

interface Model3DViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelTitle: string;
}

const Model3DViewerModal: React.FC<Model3DViewerModalProps> = ({
  isOpen,
  onClose,
  modelTitle
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  if (!isOpen) return null;

  const modelConfig = MODEL_MAP[modelTitle];

  if (!modelConfig) {
    console.error(`No 3D model found for: ${modelTitle}`);
    return null;
  }

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
          <h2 className="model-3d-modal-title">{modelTitle}</h2>
          <p className="model-3d-modal-subtitle">Interactive 3D Model Viewer</p>
        </div>

        <div className="model-3d-viewer-wrapper">
          <ModelViewer modelPath={modelConfig.path} modelScale={modelConfig.scale} />

          <div className="model-3d-controls-overlay">
            <div className="model-3d-controls-info">
              <div className="model-3d-control-hint">
                <span className="model-3d-control-icon">🖱️</span>
                <span>Drag to rotate</span>
              </div>
              <div className="model-3d-control-hint">
                <span className="model-3d-control-icon">🔍</span>
                <span>Scroll to zoom</span>
              </div>
              <div className="model-3d-control-hint">
                <span className="model-3d-control-icon">⌨️</span>
                <span>Right-click to pan</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Model3DViewerModal;



