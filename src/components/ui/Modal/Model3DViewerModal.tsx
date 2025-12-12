/**
 * ============================================
 * 🎯 HOW TO ADD YOUR 3D MODEL (GLB FILE)
 * ============================================
 * 
 * Follow these 3 easy steps when your GLB file is ready:
 * 
 * STEP 1: Place your GLB file
 *    - Put your .glb file in: src/assets/3DMODELS/
 *    - Name it clearly (e.g., dedimpler.glb, forming.glb)
 * 
 * STEP 2: Import the GLB file (see imports section below)
 *    - Add this line with other imports:
 *      import yourModelName from '../../../assets/3DMODELS/yourfile.glb';
 *    - Example: import dedimplerModel from '../../../assets/3DMODELS/dedimpler.glb';
 * 
 * STEP 3: Update the MODEL_MAP (scroll down to MODEL_MAP section)
 *    - Find your machine name
 *    - Change path from null to your imported model
 *    - Example: Change from { path: null, scale: 5 }
 *               To:        { path: dedimplerModel, scale: 5 }
 * 
 * That's it! The 3D viewer will now load your model. 🎉
 * ============================================
 */

import React, { useEffect, useState } from 'react';
import ModelViewer from './ModelViewer';
import './Model3DViewerModal.css';

// ============================================
// 📦 STEP 1: IMPORT YOUR GLB FILES HERE
// ============================================
// When your GLB file is ready:
// 1. Place the .glb file in: src/assets/3DMODELS/
// 2. Import it here following this pattern:
//    import modelName from '../../../assets/3DMODELS/yourfile.glb';
// 
// Example:
//    import dedimplerModel from '../../../assets/3DMODELS/dedimpler.glb';
// ============================================

// Existing models with GLB files
import looperModel from '../../../assets/3DMODELS/looper.glb';
import horizontalLooperModel from '../../../assets/3DMODELS/horizontalLooper.glb';
import shearwelderModel from '../../../assets/3DMODELS/shearwelder.glb';
import uncoilerModel from '../../../assets/3DMODELS/uncoiler.glb';
import levelerModel from '../../../assets/3DMODELS/leveler.glb';
import furnaceModel from '../../../assets/3DMODELS/furnace.glb';
import bindingMachineModel from '../../../assets/3DMODELS/BindingMachine.glb';

// 🔽 ADD NEW MODEL IMPORTS BELOW THIS LINE 🔽
// Example: import dedimplerModel from '../../../assets/3DMODELS/dedimpler.glb';
// Example: import formingModel from '../../../assets/3DMODELS/forming.glb';

// Model mapping based on machine title with optional scale override
interface ModelConfig {
  path: string | null;
  scale?: number; // Custom scale factor (default is 3)
}

// ============================================
// 📝 STEP 2: UPDATE THE MODEL_MAP BELOW
// ============================================
// When your GLB file is ready:
// 1. Find the machine name in the list below
// 2. Change: path: null
//    To:     path: yourImportedModel
// 3. Adjust the scale if needed (5 is default)
//
// Example - BEFORE:
//    'Dedimpler and Facer': { path: null, scale: 5 },
// 
// Example - AFTER:
//    'Dedimpler and Facer': { path: dedimplerModel, scale: 5 },
// ============================================

const MODEL_MAP: { [key: string]: ModelConfig } = {
  // ✅ Models with GLB files available
  'Looper Machine': { path: looperModel, scale: 5 },
  'Horizontal Looper Machine': { path: horizontalLooperModel, scale: 5 },
  'Shear Welder Machine': { path: shearwelderModel, scale: 5 },
  'Uncoiler Machine': { path: uncoilerModel, scale: 5 },
  'Leveler Machine': { path: levelerModel, scale: 5 },
  'Furnace': { path: furnaceModel, scale: 5 },
  'Binding Machine': { path: bindingMachineModel, scale: 5 },

  // ⏳ Models without GLB files yet (will show "3D MODEL NOT AVAILABLE YET" message)
  // 👇 UPDATE THESE WHEN YOUR GLB FILES ARE READY 👇
  'Dedimpler and Facer': { path: null, scale: 5 },          // Change to: path: dedimplerModel
  'Bundling Machine': { path: null, scale: 5 },              // Change to: path: bundlingMachineModel
  'Forming and Sizing Machine': { path: null, scale: 5 },   // Change to: path: formingModel
  'Milling Cutoff Machine': { path: null, scale: 5 },       // Change to: path: millingCutoffModel
  'Transfer Table': { path: null, scale: 5 },               // Change to: path: transferTableModel
  'Bundle Separator': { path: null, scale: 5 },             // Change to: path: bundleSeparatorModel
  'Pipe Drying Section': { path: null, scale: 5 },          // Change to: path: pipeDryingModel
  'Pipe Bundling': { path: null, scale: 5 },                // Change to: path: pipeBundlingModel
  'Product Storage': { path: null, scale: 5 },              // Change to: path: productStorageModel
  'Finishing Line': { path: null, scale: 5 },               // Change to: path: finishingLineModel
  'Air Blow': { path: null, scale: 5 },                     // Change to: path: airBlowModel
  'Transfer Table (Lifter)': { path: null, scale: 5 },      // Change to: path: transferTableLifterModel
  'Dedimpler & Facer': { path: null, scale: 5 },            // Change to: path: dedimplerFacerModel
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



