import React, { useEffect, useState } from 'react';
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

// Define camera view types
export type CameraView = 'isometric' | 'front' | 'back' | 'left' | 'right' | 'top';

// Camera positions for different views
export const CAMERA_POSITIONS: Record<CameraView, [number, number, number]> = {
  isometric: [5, 3, 5],
  front: [0, 0, 8],
  back: [0, 0, -8],
  left: [-8, 0, 0],
  right: [8, 0, 0],
  top: [0, 8, 0],
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
  const [cameraView, setCameraView] = useState<CameraView>('isometric');
  // Reset camera view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCameraView('isometric');
    }
  }, [isOpen]);

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
          <ModelViewer 
            modelPath={modelConfig.path} 
            modelScale={modelConfig.scale}
            cameraView={cameraView}
          />

          {/* Camera View Buttons */}
          <div className="camera-view-buttons">
            <button
              className={`camera-view-btn ${cameraView === 'isometric' ? 'active' : ''}`}
              onClick={() => setCameraView('isometric')}
              title="Isometric View"
            >
              Isometric
            </button>
            <button
              className={`camera-view-btn ${cameraView === 'front' ? 'active' : ''}`}
              onClick={() => setCameraView('front')}
              title="Front View"
            >
              Front
            </button>
            <button
              className={`camera-view-btn ${cameraView === 'back' ? 'active' : ''}`}
              onClick={() => setCameraView('back')}
              title="Back View"
            >
              Back
            </button>
            <button
              className={`camera-view-btn ${cameraView === 'left' ? 'active' : ''}`}
              onClick={() => setCameraView('left')}
              title="Left View"
            >
              Left
            </button>
            <button
              className={`camera-view-btn ${cameraView === 'right' ? 'active' : ''}`}
              onClick={() => setCameraView('right')}
              title="Right View"
            >
              Right
            </button>
            <button
              className={`camera-view-btn ${cameraView === 'top' ? 'active' : ''}`}
              onClick={() => setCameraView('top')}
              title="Top View"
            >
              Top
            </button>
          </div>

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



