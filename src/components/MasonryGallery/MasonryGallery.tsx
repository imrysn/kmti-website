import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import LazyImage from '../ui/LazyImage/LazyImage';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import './MasonryGallery.css';
import { useTranslation } from 'react-i18next';

interface MasonryGalleryProps {
  images: string[];
  columns?: number;
  gap?: number;
}

interface ImageMetadata {
  src: string;
  aspectRatio: number;
  naturalWidth: number;
  naturalHeight: number;
  sizeVariation: number;
  displayHeight: number;
  sizeCategory: 'portrait' | 'landscape' | 'square' | 'panoramic' | 'ultra-portrait';
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({ 
  images, 
  columns = 4,
  gap = 8
}) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(columns);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [randomizedImages, setRandomizedImages] = useState<ImageMetadata[]>([]);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformWrapperRef = useRef<any>(null);
  const preloadedImages = useRef<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const generateRandomSizeVariation = useCallback((): number => {
    const rand = Math.random();
    if (rand < 0.1) return 0.6;
    if (rand < 0.2) return 1.8;
    if (rand < 0.4) return 0.8;
    if (rand < 0.6) return 1.3;
    return 0.9 + Math.random() * 0.4;
  }, []);

  // Initialize mounted state and viewport width
  useEffect(() => {
    setIsMounted(true);
    setViewportWidth(window.innerWidth);
    
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if we're on a small screen (<= 430px)
  const isSmallScreen = viewportWidth <= 430;

  useEffect(() => {
    const loadImageMetadata = async () => {
      const metadataArray: ImageMetadata[] = [];
      
      const promises = images.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            let sizeCategory: ImageMetadata['sizeCategory'];
            
            if (aspectRatio > 2) sizeCategory = 'panoramic';
            else if (aspectRatio > 1.2) sizeCategory = 'landscape';
            else if (aspectRatio < 0.5) sizeCategory = 'ultra-portrait';
            else if (aspectRatio < 0.8) sizeCategory = 'portrait';
            else sizeCategory = 'square';
            
            const sizeVariation = generateRandomSizeVariation();
            const LANDSCAPE_BASE_HEIGHT = 200;
            let baseHeight = LANDSCAPE_BASE_HEIGHT;
            
            switch (sizeCategory) {
              case 'ultra-portrait':
                baseHeight = LANDSCAPE_BASE_HEIGHT * 2.2;
                break;
              case 'portrait':
                baseHeight = LANDSCAPE_BASE_HEIGHT * 2.0;
                break;
              case 'square':
                baseHeight = LANDSCAPE_BASE_HEIGHT * 1.4;
                break;
              case 'landscape':
                baseHeight = LANDSCAPE_BASE_HEIGHT;
                break;
              case 'panoramic':
                baseHeight = LANDSCAPE_BASE_HEIGHT * 0.8;
                break;
            }
            
            const displayHeight = Math.round(baseHeight * sizeVariation);
            
            metadataArray.push({
              src,
              aspectRatio,
              naturalWidth: img.width,
              naturalHeight: img.height,
              sizeVariation,
              displayHeight,
              sizeCategory
            });
            resolve();
          };
          img.onerror = () => {
            metadataArray.push({
              src,
              aspectRatio: 1,
              naturalWidth: 800,
              naturalHeight: 600,
              sizeVariation: 1,
              displayHeight: 250,
              sizeCategory: 'square'
            });
            resolve();
          };
          img.src = src;
        });
      });

      await Promise.all(promises);
      const shuffled = shuffleArray(metadataArray);
      setRandomizedImages(shuffled);
      setImagesLoaded(true);
    };

    loadImageMetadata();
  }, [images, shuffleArray, generateRandomSizeVariation]);

  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      if (width <= 480) {
        setColumnCount(1);
      } else if (width <= 768) {
        setColumnCount(2);
      } else if (width <= 1024) {
        setColumnCount(3);
      } else {
        setColumnCount(columns);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  const preloadImage = useCallback((src: string): void => {
    if (!preloadedImages.current.has(src)) {
      const img = new Image();
      img.src = src;
      preloadedImages.current.add(src);
    }
  }, []);

  const preloadAdjacentImages = useCallback((currentIndex: number): void => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    preloadImage(images[prevIndex]);
    preloadImage(images[nextIndex]);
  }, [images, preloadImage]);

  useEffect(() => {
    images.forEach(img => preloadImage(img));
  }, [images, preloadImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!selectedImage || isNavigating) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, isNavigating]);

  const openLightbox = useCallback((image: string, index: number): void => {
    setSelectedImage(image);
    // Find the index in the FULL images array, not just filtered
    const fullIndex = images.indexOf(image);
    setSelectedIndex(fullIndex >= 0 ? fullIndex : index);
    setRotation(0);
    preloadAdjacentImages(fullIndex >= 0 ? fullIndex : index);
    
    if (transformWrapperRef.current) {
      transformWrapperRef.current.resetTransform();
    }
  }, [images, preloadAdjacentImages]);

  const navigateImage = useCallback((direction: 'prev' | 'next'): void => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % images.length 
      : (selectedIndex - 1 + images.length) % images.length;
    
    const newImage = images[newIndex];
    preloadAdjacentImages(newIndex);
    
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    setSelectedImage(newImage);
    setSelectedIndex(newIndex);
    setRotation(0);
    
    if (transformWrapperRef.current) {
      transformWrapperRef.current.resetTransform();
    }
    
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  }, [selectedIndex, images, preloadAdjacentImages, isNavigating]);

  const closeLightbox = useCallback((): void => {
    setSelectedImage(null);
    setIsNavigating(false);
    setRotation(0);
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent): void => {
    if (isNavigating) return;
    setTouchStart(e.touches[0].clientX);
  }, [isNavigating]);

  const handleTouchEnd = useCallback((e: React.TouchEvent): void => {
    if (touchStart === null || isNavigating) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateImage('next');
      } else {
        navigateImage('prev');
      }
    }
    
    setTouchStart(null);
  }, [touchStart, navigateImage, isNavigating]);

  const rotateLeft = useCallback((): void => {
    setRotation(prev => prev - 90);
  }, []);

  const rotateRight = useCallback((): void => {
    setRotation(prev => prev + 90);
  }, []);

  // Filter images for small screens - only show landscape and panoramic
  const displayImages = useMemo((): ImageMetadata[] => {
    if (isSmallScreen) {
      return randomizedImages.filter(
        img => img.sizeCategory === 'landscape' || img.sizeCategory === 'panoramic'
      );
    }
    return randomizedImages;
  }, [randomizedImages, isSmallScreen]);

  const columnImages = useMemo((): ImageMetadata[][] => {
    if (!imagesLoaded) {
      return Array.from({ length: columnCount }, () => []);
    }

    const cols: ImageMetadata[][] = Array.from({ length: columnCount }, () => []);
    const columnHeights: number[] = new Array(columnCount).fill(0);
    
    displayImages.forEach((metadata) => {
      const minHeight = Math.min(...columnHeights);
      const targetColumn = columnHeights.indexOf(minHeight);
      
      cols[targetColumn].push(metadata);
      columnHeights[targetColumn] += metadata.displayHeight;
    });
    
    return cols;
  }, [displayImages, columnCount, imagesLoaded]);

  const getSizeClass = useCallback((metadata: ImageMetadata): string => {
    const { sizeCategory, sizeVariation } = metadata;
    
    if (sizeVariation > 1.5) return 'size-large';
    if (sizeVariation < 0.7) return 'size-small';
    
    switch (sizeCategory) {
      case 'ultra-portrait':
        return 'size-tall';
      case 'portrait':
        return 'size-portrait';
      case 'landscape':
        return 'size-landscape';
      case 'panoramic':
        return 'size-panoramic';
      default:
        return 'size-normal';
    }
  }, []);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  if (!imagesLoaded) {
    return (
      <div className="masonry-loading-container">
        <div className="masonry-loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Loading gallery...</p>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={containerRef}
        className={`masonry-gallery randomized-masonry ${isSmallScreen ? 'small-screen-gallery' : ''}`}
        style={{ gap: `${gap}px` }}
      >
        {columnImages.map((column, colIndex) => (
          <div 
            key={colIndex} 
            className="masonry-column"
            style={{ gap: `${gap}px` }}
          >
            {column.map((metadata, imgIndex) => {
              const globalIndex = images.indexOf(metadata.src);
              const sizeClass = getSizeClass(metadata);
              
              return (
                <motion.div 
                  key={`${colIndex}-${imgIndex}-${metadata.src}`}
                  className={`masonry-item ${sizeClass}`}
                  onClick={() => openLightbox(metadata.src, globalIndex)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: (imgIndex * 0.05) % 0.3,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  style={{
                    '--aspect-ratio': metadata.aspectRatio,
                    '--display-height': `${metadata.displayHeight}px`,
                    '--size-variation': metadata.sizeVariation,
                  } as React.CSSProperties}
                >
                  <div className="masonry-image-wrapper">
                    <LazyImage 
                      src={metadata.src} 
                      alt={`Gallery ${globalIndex + 1}`}
                      className="masonry-image"
                      loading="lazy"
                      style={{
                        aspectRatio: metadata.aspectRatio,
                      }}
                    />
                    <div className="masonry-overlay">
                      <motion.div 
                        className="overlay-content"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </motion.div>
                    </div>
                    <div className="click-indicator">
                      <span>{t('common.click_to_view')}</span>
                    </div>
                    
                    <div className="size-indicator">
                      {metadata.sizeCategory === 'portrait' && (
                        <span className="badge portrait-badge">Portrait</span>
                      )}
                      {metadata.sizeCategory === 'landscape' && (
                        <span className="badge landscape-badge">Landscape</span>
                      )}
                      {metadata.sizeCategory === 'panoramic' && (
                        <span className="badge panoramic-badge">Wide</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {isMounted && selectedImage && 
        ReactDOM.createPortal(
          <div 
            className={`masonry-lightbox ${isSmallScreen ? 'small-screen-lightbox' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="lightbox-gradient-bg" />
            
            <button 
              className="masonry-close-btn"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {!isSmallScreen && (
              <div className="masonry-counter">
                <span className="counter-current">{selectedIndex + 1}</span>
                <span className="counter-separator">/</span>
                <span className="counter-total">{images.length}</span>
              </div>
            )}

            <a
              className="masonry-download-btn"
              href={selectedImage}
              download={`gallery-image-${selectedIndex + 1}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>

            {isSmallScreen ? (
              <div className="masonry-lightbox-main small-screen-main">
                <div 
                  className="masonry-image-container small-screen-container"
                  key={selectedImage}
                >
                  <img 
                    src={selectedImage} 
                    alt={`Preview ${selectedIndex + 1}`}
                    className="masonry-lightbox-image small-screen-image"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    draggable={false}
                  />
                </div>
                
                <div className="masonry-zoom-tools small-screen-tools">
                  <button onClick={rotateLeft} title="Rotate Left">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <polyline points="8 12 12 8 16 12" />
                      <line x1="12" y1="16" x2="12" y2="8" />
                    </svg>
                  </button>
                  <button onClick={rotateRight} title="Rotate Right">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 12s-4-8-11-8-11 8-11 8 4 8 11 8 11-8 11-8z" />
                      <polyline points="16 12 12 16 8 12" />
                      <line x1="12" y1="16" x2="12" y2="8" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              // Full TransformWrapper for larger screens
              <div className="masonry-lightbox-main" onClick={(e) => e.stopPropagation()}>
                <TransformWrapper 
                  ref={transformWrapperRef}
                  initialScale={1} 
                  minScale={1} 
                  maxScale={4}
                  centerOnInit
                  wheel={{ step: 0.1 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <TransformComponent 
                        wrapperClass="masonry-zoom-wrapper" 
                        contentClass="masonry-zoom-content"
                      >
                        <div 
                          className="masonry-image-container"
                          key={selectedImage}
                          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
                        >
                          <img 
                            src={selectedImage} 
                            alt={`Preview ${selectedIndex + 1}`}
                            className="masonry-lightbox-image"
                            draggable={false}
                          />
                        </div>
                      </TransformComponent>

                      <div className="masonry-zoom-tools">
                        <button onClick={() => zoomIn()} title="Zoom In">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </button>
                        <button onClick={() => zoomOut()} title="Zoom Out">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </button>
                        <button onClick={() => {
                          resetTransform();
                          setRotation(0);
                        }} title="Reset Zoom & Rotation">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                        </button>
                        <button onClick={rotateLeft} title="Rotate Left">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <polyline points="8 12 12 8 16 12" />
                            <line x1="12" y1="16" x2="12" y2="8" />
                          </svg>
                        </button>
                        <button onClick={rotateRight} title="Rotate Right">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 12s-4-8-11-8-11 8-11 8 4 8 11 8 11-8 11-8z" />
                            <polyline points="16 12 12 16 8 12" />
                            <line x1="12" y1="16" x2="12" y2="8" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </TransformWrapper>
              </div>
            )}

            <button 
              className="masonry-nav-arrow masonry-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              aria-label="Previous image"
              disabled={isNavigating}
              style={{ opacity: isNavigating ? 0.5 : 1 }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            
            <button 
              className="masonry-nav-arrow masonry-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              aria-label="Next image"
              disabled={isNavigating}
              style={{ opacity: isNavigating ? 0.5 : 1 }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div 
              className="masonry-thumbnails-container" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="masonry-thumbnails-list">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`masonry-thumbnail-item ${index === selectedIndex ? 'active' : ''}`}
                    onClick={() => {
                      if (index !== selectedIndex && !isNavigating) {
                        setIsNavigating(true);
                        setSelectedImage(img);
                        setSelectedIndex(index);
                        setRotation(0);
                        preloadAdjacentImages(index);
                        
                        if (transformWrapperRef.current) {
                          transformWrapperRef.current.resetTransform();
                        }
                        
                        setTimeout(() => {
                          setIsNavigating(false);
                        }, 300);
                      }
                    }}
                  >
                    <img src={img} alt={`Thumb ${index + 1}`} loading="lazy" />
                    {index === selectedIndex && (
                      <div className="thumbnail-active-indicator" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isNavigating && (
              <div className="masonry-loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
          </div>,
          document.body
        )
      }
    </>
  );
};

export default MasonryGallery;