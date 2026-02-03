import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useProjectModals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLooperModalOpen, setIsLooperModalOpen] = useState(false);
  const [isFormingModalOpen, setIsFormingModalOpen] = useState(false);
  const [isStripEntryModalOpen, setIsStripEntryModalOpen] = useState(false);
  const [isTransferTableLineModalOpen, setIsTransferTableLineModalOpen] = useState(false);
  const [isFinishingLineModalOpen, setIsFinishingLineModalOpen] = useState(false);
  const [isCutOffModalOpen, setIsCutOffModalOpen] = useState(false);
  const [isFurnaceModalOpen, setIsFurnaceModalOpen] = useState(false);
  const [selectedProjectKey, setSelectedProjectKey] = useState<string | undefined>(undefined);
  const hasCheckedUrlParams = useRef(false);

  // 3D Model Viewer Modal state
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [selected3DModel, setSelected3DModel] = useState<{ title: string; key: string } | null>(null);

  // Handle query parameters to open modals 
  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam && !hasCheckedUrlParams.current) {
      const projectMap: { [key: string]: () => void } = {
        'dedimpler-and-facer': () => setIsProjectModalOpen(true),
        'looper-machine': () => setIsLooperModalOpen(true),
        'forming-and-sizing': () => setIsFormingModalOpen(true),
        'shear-welder-machine': () => setIsStripEntryModalOpen(true),
        'finishing-table': () => setIsTransferTableLineModalOpen(true),
        'finishing-line': () => setIsFinishingLineModalOpen(true),
        'milling-cutoff-machine': () => setIsCutOffModalOpen(true),
        'furnace': () => setIsFurnaceModalOpen(true),
      };

      const openModal = projectMap[projectParam];
      if (openModal) {
        openModal();
        hasCheckedUrlParams.current = true;
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  const closeModals = () => {
    setIsProjectModalOpen(false);
    setIsLooperModalOpen(false);
    setIsFormingModalOpen(false);
    setIsStripEntryModalOpen(false);
    setIsTransferTableLineModalOpen(false);
    setIsFinishingLineModalOpen(false);
    setIsCutOffModalOpen(false);
    setIsFurnaceModalOpen(false);
    setSelectedProjectKey(undefined);
    hasCheckedUrlParams.current = false;
    setSearchParams({}, { replace: true });
  };

  const close3DViewer = () => {
    setIs3DViewerOpen(false);
    setSelected3DModel(null);
  };

  return {
    isProjectModalOpen, setIsProjectModalOpen,
    isLooperModalOpen, setIsLooperModalOpen,
    isFormingModalOpen, setIsFormingModalOpen,
    isStripEntryModalOpen, setIsStripEntryModalOpen,
    isTransferTableLineModalOpen, setIsTransferTableLineModalOpen,
    isFinishingLineModalOpen, setIsFinishingLineModalOpen,
    isCutOffModalOpen, setIsCutOffModalOpen,
    isFurnaceModalOpen, setIsFurnaceModalOpen,
    selectedProjectKey, setSelectedProjectKey,
    is3DViewerOpen, setIs3DViewerOpen,
    selected3DModel, setSelected3DModel,
    closeModals,
    close3DViewer,
    setSearchParams // Expose if needed, or handle completely internally
  };
};
