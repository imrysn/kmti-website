import React, { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import "./ImageCarousel.css";
import { t } from "i18next";
import { motion, useInView } from "framer-motion";

interface ImageCarouselProps {
  images: string[];
  title?: string;
  duplicateForVisibility?: boolean;
}

const ImageCarousel = forwardRef<HTMLDivElement, ImageCarouselProps>(({ 
  images, 
  title, 
  duplicateForVisibility = false 
}, ref) => {
  const finalTitle = title || t('services.items.inspection.title');
  const processedImages = duplicateForVisibility && images.length > 0 && images.length <= 7
    ? [...images, ...images]
    : images;
  
  const [activeIndex, setActiveIndex] = useState(Math.floor(processedImages.length / 2));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const combinedRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
  const isInView = useInView(combinedRef, { once: true, amount: 0.2 });

  const totalImages = processedImages.length;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const getCardStyle = useCallback((idx: number): React.CSSProperties => {
    const total = totalImages;
    if (total === 0) {
      return { 
        opacity: 0, 
        pointerEvents: 'none' as const,
        transform: 'translate3d(0, 0, -800px) scale(0.5)',
        zIndex: 0,
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      };
    }

    let offset = idx - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const isVisible = absOffset <= 3;

    let scale = 1;
    if (absOffset === 0) scale = 1;
    else if (absOffset === 1) scale = 0.85;
    else if (absOffset === 2) scale = 0.7;
    else if (absOffset === 3) scale = 0.55;
    else scale = 0.5;
    
    let spacing = 0;
    if (absOffset === 0) spacing = 0;
    else if (absOffset === 1) spacing = 280;
    else if (absOffset === 2) spacing = 520;
    else if (absOffset === 3) spacing = 720;
    else spacing = absOffset * 280;
    
    const translateX = offset < 0 ? -spacing : spacing;
    const depthStep = 8;
    const rotationAngle = 25;
    const translateZ = -absOffset * depthStep;
    const rotateY = offset === 0 ? 0 : (offset < 0 ? rotationAngle : -rotationAngle);
    const opacity = 1;
    const brightness = 1;
    const saturate = 1;
    
    let overlayOpacity = 0;
    if (absOffset === 1) {
      overlayOpacity = 0.3;
    } else if (absOffset === 2) {
      overlayOpacity = 0.6;
    } else if (absOffset === 3) {
      overlayOpacity = 0.8;
    }

    if (!isVisible) {
      return {
        opacity: 0,
        pointerEvents: 'none' as const,
        transform: `translate3d(${translateX}px, 0, -800px) scale(0.5)`,
        zIndex: 0,
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      };
    }

    return {
      transform: `translate3d(${translateX}px, 0, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex: 20 - absOffset,
      opacity: opacity,
      filter: `brightness(${brightness}) saturate(${saturate})`,
      pointerEvents: 'auto' as const,
      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      willChange: 'transform, opacity, filter',
      ['--overlay-opacity' as any]: overlayOpacity,
    };
  }, [activeIndex, totalImages]);

  const goToPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalImages === 0) return;
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalImages === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev();
        if (e.key === 'ArrowRight') lightboxNext();
      } else {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev(e as any);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext(e as any);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    const originalIndex = duplicateForVisibility ? index % images.length : index;
    setLightboxIndex(originalIndex);
    setLightboxOpen(true);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    document.body.style.overflow = '';
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 4);
    
    if (newZoom !== zoomLevel) {
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
      setZoomLevel(newZoom);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1 && containerRef.current && imageRef.current) {
      e.preventDefault();
      
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
      const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);
      
      newX = Math.min(Math.max(newX, -maxX), maxX);
      newY = Math.min(Math.max(newY, -maxY), maxY);
      
      setImagePosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getImageTransform = () => {
    if (zoomLevel === 1) {
      return 'scale(1)';
    }
    return `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`;
  };

  // Memoize the lightbox content to prevent remounting
  const lightboxContent = useCallback(() => {
    if (!lightboxOpen) return null;
    
    return (
      <div className="lightbox-overlay">
        <div className="lightbox-content">
          <button className="lightbox-close" onClick={closeLightbox}>
            <svg width="20" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="title-text">{t('services.modal.back_to_services_details')}</span>
          </button>
          
          <div className="lightbox-title">
            {finalTitle}
          </div>

          <button className="lightbox-nav prev" onClick={lightboxPrev}>❮</button>
          
          <div 
            ref={containerRef}
            className="lightbox-image-container"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            <img 
              key={lightboxIndex}
              ref={imageRef}
              src={images[lightboxIndex]} 
              alt={`Lightbox ${lightboxIndex + 1}`}
              style={{
                transform: getImageTransform(),
                transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>
          
          <button className="lightbox-nav next" onClick={lightboxNext}>❯</button>

          <div className="lightbox-thumbnails">
            {images.map((img, index) => (
              <button
                key={index}
                className={`lightbox-thumbnail ${index === lightboxIndex ? 'active' : ''}`}
                onClick={() => {
                  setLightboxIndex(index);
                  setZoomLevel(1);
                  setImagePosition({ x: 0, y: 0 });
                }}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {images.length}
          </div>

          {zoomLevel === 1 && (
            <div className="lightbox-zoom-instruction">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>{t('services.modal.services_details_zoom_instruction')}</span>
            </div>
          )}
        </div>
      </div>
    );
  }, [lightboxOpen, lightboxIndex, zoomLevel, imagePosition, isDragging, images, finalTitle]);

  return (
    <motion.div
      ref={combinedRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ width: '100%' }}
    >
      <div className="carousel-container">
        <button className="carousel-nav left" onClick={goToPrev} aria-label="Previous slide">
          ‹
        </button>

        <div className="carousel-wrapper">
          <div className="carousel-track">
            {processedImages.map((img, idx) => (
              <div
                key={idx}
                className={`carousel-card ${idx === activeIndex ? 'active' : ''}`}
                style={getCardStyle(idx)}
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Slide ${idx + 1}`}
              >
                <img src={img} alt={`Gallery ${idx + 1}`} loading="lazy" />
                <div className="carousel-card-overlay">
                  <div className="view-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"></path>
                    </svg>
                    <span>{t('common.click_to_view')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-nav right" onClick={goToNext} aria-label="Next slide">
          ›
        </button>
      </div>

      {mounted && lightboxOpen && createPortal(lightboxContent(), document.body)}
    </motion.div>
  );
});

ImageCarousel.displayName = 'ImageCarousel';

export default ImageCarousel;