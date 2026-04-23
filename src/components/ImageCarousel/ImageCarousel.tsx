import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2));
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const autoRotateTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  // Auto-rotate carousel every 5 seconds when not hovering images
  useEffect(() => {
    if (isHoveringImage || isAnimating || lightboxOpen) {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
        autoRotateTimeoutRef.current = null;
      }
      return;
    }
    
    const rotate = () => {
      if (!isHoveringImage && !isAnimating && !lightboxOpen) {
        nextSlide();
      }
    };
    
    autoRotateTimeoutRef.current = window.setTimeout(rotate, 5000);
    
    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
        autoRotateTimeoutRef.current = null;
      }
    };
  }, [isHoveringImage, isAnimating, activeIndex, lightboxOpen]);

  const clearAnimationTimeout = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    clearAnimationTimeout();
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
      autoRotateTimeoutRef.current = null;
    }
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      animationTimeoutRef.current = null;
    }, 400);
  }, [images.length, isAnimating]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    clearAnimationTimeout();
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
      autoRotateTimeoutRef.current = null;
    }
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      animationTimeoutRef.current = null;
    }, 400);
  }, [images.length, isAnimating]);

  // Lightbox functions
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setZoomLevel(1);
    setRotation(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(1);
    setRotation(0);
    document.body.style.overflow = '';
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomLevel(1);
    setRotation(0);
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
    setRotation(0);
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const rotateLeft = () => setRotation(prev => prev - 90);
  const rotateRight = () => setRotation(prev => prev + 90);
  const resetTransform = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Get visible images (up to 7)
  const getVisibleImages = () => {
    const visibleIndices = [];
    for (let i = -3; i <= 3; i++) {
      let index = activeIndex + i;
      if (index < 0) index = images.length + index;
      if (index >= images.length) index = index - images.length;
      visibleIndices.push(index);
    }
    return visibleIndices;
  };

  return (
    <>
      <div className="carousel-container">
        <button className="nav-btn left" onClick={prevSlide} aria-label="Previous image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="carousel-track">
          {getVisibleImages().map((imgIndex, position) => {
            const diff = position - 3;
            let positionClass = "";
            if (diff === 0) positionClass = "active";
            else if (diff === -1) positionClass = "left-1";
            else if (diff === 1) positionClass = "right-1";
            else if (diff === -2) positionClass = "left-2";
            else if (diff === 2) positionClass = "right-2";
            else if (diff === -3) positionClass = "left-3";
            else if (diff === 3) positionClass = "right-3";
            
            return (
              <div
                key={imgIndex}
                className={`carousel-item ${positionClass}`}
                onMouseEnter={() => setIsHoveringImage(true)}
                onMouseLeave={() => setIsHoveringImage(false)}
                onClick={() => { openLightbox(imgIndex); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    openLightbox(imgIndex);
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.stopPropagation();
                    if (e.key === 'ArrowLeft') prevSlide();
                    if (e.key === 'ArrowRight') nextSlide();
                  }
                }}
              >
                <div className="carousel-item-inner">
                  <img src={images[imgIndex]} alt={`Gallery ${imgIndex + 1}`} loading="lazy" />
                  <div className="carousel-item-overlay">
                    <div className="view-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"></path>
                      </svg>
                      <span>Click to view</span>
                    </div>
                  </div>
                </div>
                <span className="image-counter">{imgIndex + 1} / {images.length}</span>
              </div>
            );
          })}
        </div>

        <button className="nav-btn right" onClick={nextSlide} aria-label="Next image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            
            <div className="lightbox-controls-top">
              <button className="lightbox-control-btn" onClick={zoomIn} title="Zoom In">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button className="lightbox-control-btn" onClick={zoomOut} title="Zoom Out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button className="lightbox-control-btn" onClick={rotateLeft} title="Rotate Left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 2.5L7 7M2.5 7L7 2.5M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                  <polyline points="12 8 12 12 15 15"></polyline>
                </svg>
              </button>
              <button className="lightbox-control-btn" onClick={rotateRight} title="Rotate Right">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2.5L17 7M21.5 7L17 2.5M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z"></path>
                  <polyline points="12 16 12 12 9 9"></polyline>
                </svg>
              </button>
              <button className="lightbox-control-btn" onClick={resetTransform} title="Reset">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 21h5v-5"></path>
                </svg>
              </button>
            </div>

            <button className="lightbox-nav prev" onClick={lightboxPrev}>
              ❮
            </button>
            
            <div className="lightbox-image-container">
              <img 
                src={images[lightboxIndex]} 
                alt={`Lightbox ${lightboxIndex + 1}`}
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
              />
            </div>
            
            <button className="lightbox-nav next" onClick={lightboxNext}>
              ❯
            </button>

            <div className="lightbox-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`lightbox-thumbnail ${index === lightboxIndex ? 'active' : ''}`}
                  onClick={() => {
                    setLightboxIndex(index);
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="lightbox-counter">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;