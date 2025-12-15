import React, { useEffect, useState } from 'react';
import ModelViewer from './ModelViewer';
import './Model3DViewerModal.css';

import dedimplerFacerModel from '../../../assets/3DMODELS/Dedimpler&Facer.glb';
import bundlingMachineModel from '../../../assets/3DMODELS/BundlingMachine.glb';
import productStorageModel from '../../../assets/3DMODELS/ProductStorage.glb';
import transferTableModel from '../../../assets/3DMODELS/TransferTable.glb';

interface ModelConfig {
  path: string | null;
  scale?: number;
}

const MODEL_MAP: { [key: string]: ModelConfig } = {
  'Dedimpler and Facer': { path: dedimplerFacerModel, scale: 5 },
  'Dedimpler & Facer': { path: dedimplerFacerModel, scale: 5 },
  'Bundling Machine': { path: bundlingMachineModel, scale: 5 },
  'Product Storage': { path: productStorageModel, scale: 5 },
  'Pipe Bundling': { path: productStorageModel, scale: 5 },
  'Transfer Table (Lifter)': { path: transferTableModel, scale: 5 },
  'Transfer Table': { path: transferTableModel, scale: 5 },
  'Looper Machine': { path: null, scale: 5 },
  'Horizontal Looper Machine': { path: null, scale: 5 },
  'Shear Welder Machine': { path: null, scale: 5 },
  'Uncoiler Machine': { path: null, scale: 5 },
  'Leveler Machine': { path: null, scale: 5 },
  'Furnace': { path: null, scale: 5 },
  'Binding Machine': { path: null, scale: 5 },
  'Forming and Sizing Machine': { path: null, scale: 5 },
  'Milling Cutoff Machine': { path: null, scale: 5 },
  'Bundle Separator': { path: null, scale: 5 },
  'Pipe Drying Section': { path: null, scale: 5 },
  'Finishing Line': { path: null, scale: 5 },
  'Air Blow': { path: null, scale: 5 },
};

export type CameraView = 'isometric' | 'front' | 'back' | 'left' | 'right' | 'top';

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

  useEffect(() => {
    if (isOpen) {
      setCameraView('isometric');
    }
  }, [isOpen]);

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

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  if (!isOpen) return null;

  const modelConfig = MODEL_MAP[modelTitle];

  if (!modelConfig) {
    console.error(`No 3D model configuration found for: ${modelTitle}`);
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
          <h2 className="model-3d-modal-title">{modelTitle}</h2>
          <p className="model-3d-modal-subtitle">
            {hasModel ? 'Interactive 3D Model Viewer' : '3D Model Viewer'}
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
            </>
          ) : (
            <div className="model-3d-placeholder">
              <div className="model-3d-placeholder-content">
                <div className="model-3d-placeholder-icon">📦</div>
                <h3 className="model-3d-placeholder-title">3D MODEL NOT AVAILABLE YET</h3>
                <p className="model-3d-placeholder-text">
                  The 3D model for this machine is currently being prepared.
                  Please check back soon!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Model3DViewerModal;
