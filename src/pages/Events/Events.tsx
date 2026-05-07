import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { getAssetUrl } from '../../utils/assets';
import LazyImage from '../../components/ui/LazyImage/LazyImage';

interface YearOption {
  year: string;
  label: string;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  imagesByYear: {
    [year: string]: string[];
  };
  years: YearOption[];
}

// Individual Event Carousel Component
interface EventCarouselProps {
  event: EventData;
  index: number;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ event, index }) => {
  const [selectedYear, setSelectedYear] = useState<string>(event.years[0]?.year || '2026');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  const currentImages = useMemo(() => event.imagesByYear[selectedYear] || [], [event.imagesByYear, selectedYear]);
  const totalImages = currentImages.length;

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset active index when year changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedYear]);

  // Cover Flow style with optimized transitions
  const getCardStyle = useCallback((idx: number) => {
    const total = totalImages;
    if (total === 0) return { opacity: 0, pointerEvents: 'none' as const };

    let offset = idx - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const isVisible = absOffset <= 3;

    const spacing = 210;
    const depthStep = 8;
    const rotationAngle = 35;

    const translateX = offset * spacing;
    const translateZ = -absOffset * depthStep;
    const rotateY = offset === 0 ? 0 : (offset > 0 ? -rotationAngle : rotationAngle);
    const scale = idx === activeIndex ? 1 : 0.92 - (absOffset * 0.03);
    const brightness = idx === activeIndex ? 1 : Math.max(0.4, 1 - (absOffset * 0.2));
    const saturate = idx === activeIndex ? 1 : Math.max(0.6, 1 - (absOffset * 0.1));

    if (!isVisible) {
      return {
        opacity: 0,
        pointerEvents: 'none' as const,
        transform: `translate3d(${translateX}px, 0, -800px) scale(0.6)`,
        zIndex: 0,
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      };
    }

    return {
      transform: `translate3d(${translateX}px, 0, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex: 20 - Math.floor(absOffset),
      filter: `brightness(${brightness}) saturate(${saturate})`,
      pointerEvents: absOffset === 0 ? ('auto' as const) : ('none' as const),
      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      willChange: 'transform, filter',
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

  const handleYearChange = useCallback((year: string) => {
    if (year === selectedYear) {
      setIsYearDropdownOpen(false);
      return;
    }
    setIsYearDropdownOpen(false);
    setSelectedYear(year);
  }, [selectedYear]);

  const currentYearLabel = event.years.find(y => y.year === selectedYear)?.label || selectedYear;

  return (
    <section className="event-carousel-section">
      <div className="carousel-header">
        {/* TEXT - Uses fade-up */}
        <h2 
          className="carousel-title"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay={index * 100}
          data-aos-offset="100"
          data-aos-once="true"
        >
          {event.title}
        </h2>
        
        {/* TEXT - Uses fade-up */}
        <p 
          className="carousel-description"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay={index * 100 + 150}
          data-aos-offset="100"
          data-aos-once="true"
        >
          {event.description}
        </p>
        
        {/* DROPDOWN - Uses fade-up */}
        {event.years.length > 1 && (
          <div 
            className="dropdown-wrapper"
            ref={yearDropdownRef}
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay={index * 100 + 300}
            data-aos-offset="100"
            data-aos-once="true"
          >
            <button
              className="dropdown-trigger year-trigger"
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              aria-expanded={isYearDropdownOpen}
            >
              <span className="dropdown-label">Year:</span>
              <span className="dropdown-value">{currentYearLabel}</span>
              <svg 
                className={`dropdown-arrow ${isYearDropdownOpen ? 'open' : ''}`}
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {isYearDropdownOpen && (
              <div className="dropdown-menu year-menu">
                {event.years.map(({ year, label }) => (
                  <button
                    key={year}
                    className={`dropdown-item ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => handleYearChange(year)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {totalImages > 0 ? (
        /* CAROUSEL CARDS - Now uses fade-up instead of alternating animations */
        <div 
          className="carousel-wrapper"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay={index * 100 + 450}
          data-aos-offset="100"
          data-aos-once="true"
        >
          <button className="carousel-nav left" onClick={goToPrev} aria-label="Previous slide">
            ‹
          </button>

          <div className="carousel-container">
            <div className="carousel-track">
              {currentImages.map((img, idx) => (
                <div
                  key={`${selectedYear}-${idx}`}
                  className={`carousel-card ${idx === activeIndex ? 'active' : ''}`}
                  style={getCardStyle(idx)}
                  onClick={() => setActiveIndex(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${event.title} slide ${idx + 1}`}
                >
                  <LazyImage src={img} alt={`${event.title} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-nav right" onClick={goToNext} aria-label="Next slide">
            ›
          </button>
        </div>
      ) : (
        <div className="no-images-message">
          <p>No images available for this selection.</p>
        </div>
      )}
    </section>
  );
};

// Main Carousel Component
const EventsCarousel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Sliding animation states
  const animationRef = useRef<number | null>(null);
  const userInteractionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [shouldSlide, setShouldSlide] = useState(true);
  
  // For infinite scroll
  const [infiniteImages, setInfiniteImages] = useState<Array<{src: string, alt: string, originalIndex: number}>>([]);
  const [initialScrollSet, setInitialScrollSet] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const galleryObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (i18n.language !== 'en') {
      navigate('/', { replace: true });
    }
  }, [i18n.language, navigate]);

  // ========== GLOBAL SCROLL TRIGGER SPEED ADJUSTMENT ==========
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true,
      mirror: false,
      throttleDelay: 99,
      debounceDelay: 50,
      easing: 'ease-out-quad',
    });

    const refreshTimeout = setTimeout(() => {
      AOS.refresh();
    }, 300);

    const handleResize = () => {
      AOS.refresh();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Intersection Observer for Gallery - Pause sliding when out of view
  useEffect(() => {
    if (galleryRef.current) {
      galleryObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setGalleryVisible(entry.isIntersecting);
          });
        },
        { threshold: 0.3 }
      );
      
      galleryObserverRef.current.observe(galleryRef.current);
    }
    
    return () => {
      if (galleryObserverRef.current) {
        galleryObserverRef.current.disconnect();
      }
    };
  }, []);

  // Original gallery images
  const originalGalleryImages = useMemo(() => [
    { src: getAssetUrl('events/gallery/1.webp'), alt: 'Gallery Image 1' },
    { src: getAssetUrl('events/gallery/2.webp'), alt: 'Gallery Image 2' },
    { src: getAssetUrl('events/gallery/3.webp'), alt: 'Gallery Image 3' },
    { src: getAssetUrl('events/gallery/4.webp'), alt: 'Gallery Image 4' },
    { src: getAssetUrl('events/gallery/5.webp'), alt: 'Gallery Image 5' },
    { src: getAssetUrl('events/gallery/6.webp'), alt: 'Gallery Image 6' },
    { src: getAssetUrl('events/gallery/7.webp'), alt: 'Gallery Image 7' },
    { src: getAssetUrl('events/gallery/8.webp'), alt: 'Gallery Image 8' },
    { src: getAssetUrl('events/gallery/9.webp'), alt: 'Gallery Image 9' },
    { src: getAssetUrl('events/gallery/10.webp'), alt: 'Gallery Image 10' },
  ], []);

  // Initialize infinite images with multiple copies for seamless scrolling
  useEffect(() => {
    const copies = [
      ...originalGalleryImages, 
      ...originalGalleryImages, 
      ...originalGalleryImages,
      ...originalGalleryImages,
      ...originalGalleryImages,
      ...originalGalleryImages,
      ...originalGalleryImages,
      ...originalGalleryImages,
      ...originalGalleryImages,
      ...originalGalleryImages
    ];
    const imagesWithIndex = copies.map((img, idx) => ({
      ...img,
      originalIndex: idx % originalGalleryImages.length
    }));
    setInfiniteImages(imagesWithIndex);
    setInitialScrollSet(false);
  }, [originalGalleryImages]);

  // Set initial scroll position to the middle
  useEffect(() => {
    if (galleryRef.current && infiniteImages.length > 0 && !initialScrollSet) {
      const cardWidth = 470;
      const gap = 30;
      const oneSetWidth = (cardWidth + gap) * originalGalleryImages.length;
      const targetScroll = oneSetWidth * 4;
      galleryRef.current.scrollLeft = targetScroll;
      setInitialScrollSet(true);
    }
  }, [infiniteImages, originalGalleryImages.length, initialScrollSet]);

  // SLIDING ANIMATION FUNCTION - Smooth continuous sliding to the LEFT
  const startSlidingAnimation = useCallback(() => {
    if (animationRef.current) return;
    
    let lastTime = performance.now();
    const slideSpeed = 0.04; // Adjust this value to make it faster or slower (pixels per ms)

    const step = (currentTime: number) => {
      if (!galleryRef.current) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        return;
      }
      
      if (!galleryVisible || isUserInteracting || !shouldSlide) {
        animationRef.current = requestAnimationFrame(step);
        lastTime = currentTime;
        return;
      }
      
      const deltaTime = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;

      const gallery = galleryRef.current;
      const cardWidth = 470;
      const gap = 30;
      const oneSetWidth = (cardWidth + gap) * originalGalleryImages.length;
      const middlePosition = oneSetWidth * 4;
      
      // SLIDE TO THE LEFT - INCREASE scrollLeft (content moves left)
      let newScrollLeft = gallery.scrollLeft + (slideSpeed * deltaTime);
      
      // When reaching the end, jump back to middle position for infinite loop
      if (newScrollLeft >= gallery.scrollWidth - gallery.clientWidth - 200) {
        gallery.scrollLeft = middlePosition;
        newScrollLeft = middlePosition;
      } 
      else if (newScrollLeft <= 200) {
        gallery.scrollLeft = middlePosition;
        newScrollLeft = middlePosition;
      }

      gallery.scrollLeft = newScrollLeft;
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [originalGalleryImages.length, isUserInteracting, galleryVisible, shouldSlide]);

  const stopSlidingAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const clearUserInteractionTimeout = useCallback(() => {
    if (userInteractionTimeout.current) {
      clearTimeout(userInteractionTimeout.current);
      userInteractionTimeout.current = null;
    }
  }, []);

  const handleUserInteractionStart = useCallback(() => {
    clearUserInteractionTimeout();
    setIsUserInteracting(true);
    setShouldSlide(false);
  }, [clearUserInteractionTimeout]);

  const handleUserInteractionEnd = useCallback(() => {
    clearUserInteractionTimeout();
    userInteractionTimeout.current = setTimeout(() => {
      setIsUserInteracting(false);
      setShouldSlide(true);
    }, 2000);
  }, [clearUserInteractionTimeout]);

  // Drag to scroll handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleUserInteractionStart();
    setIsDragging(true);
    setStartX(e.pageX - (galleryRef.current?.offsetLeft || 0));
    setScrollLeft(galleryRef.current?.scrollLeft || 0);
  }, [handleUserInteractionStart]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      handleUserInteractionEnd();
    }
  }, [isDragging, handleUserInteractionEnd]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      handleUserInteractionEnd();
    }
  }, [isDragging, handleUserInteractionEnd]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (galleryRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (galleryRef.current) {
      galleryRef.current.scrollLeft = scrollLeft - walk;
    }
  }, [isDragging, startX, scrollLeft]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleUserInteractionStart();
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (galleryRef.current?.offsetLeft || 0));
    setScrollLeft(galleryRef.current?.scrollLeft || 0);
  }, [handleUserInteractionStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (galleryRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (galleryRef.current) {
      galleryRef.current.scrollLeft = scrollLeft - walk;
    }
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    handleUserInteractionEnd();
  }, [handleUserInteractionEnd]);

  const handleScroll = useCallback(() => {
    if (!galleryRef.current) return;
    
    const gallery = galleryRef.current;
    const cardWidth = 470;
    const gap = 30;
    const oneSetWidth = (cardWidth + gap) * originalGalleryImages.length;
    const middlePosition = oneSetWidth * 4;
    
    if (gallery.scrollLeft >= gallery.scrollWidth - oneSetWidth * 2) {
      gallery.scrollLeft = middlePosition;
    }
    else if (gallery.scrollLeft <= oneSetWidth) {
      gallery.scrollLeft = middlePosition;
    }
  }, [originalGalleryImages.length]);

  // Start/stop sliding animation based on visibility
  useEffect(() => {
    if (initialScrollSet && infiniteImages.length > 0 && galleryVisible && !isUserInteracting && shouldSlide) {
      startSlidingAnimation();
    } else {
      stopSlidingAnimation();
    }
    
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      stopSlidingAnimation();
      clearUserInteractionTimeout();
      if (gallery) {
        gallery.removeEventListener('scroll', handleScroll);
      }
    };
  }, [initialScrollSet, infiniteImages.length, startSlidingAnimation, stopSlidingAnimation, clearUserInteractionTimeout, handleScroll, galleryVisible, isUserInteracting, shouldSlide]);

  const eventImages = useMemo(() => ({
    meeting: {
      '2026': Array.from({ length: 11 }, (_, i) => 
        getAssetUrl(`events/meeting/2026/${i + 1}.webp`)
      ),
    },
    firedrill: {
      '2022': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/firedrill/2022/${i + 1}.webp`)
      ),
      '2025': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/firedrill/2025/${i + 1}.webp`)
      ),
      '2026': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/firedrill/2026/${i + 1}.webp`)
      ),
    },
    xmas_party: {
      '2016': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/xmas/2016/${i + 1}.webp`)
      ),
      '2017': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/xmas/2017/${i + 1}.webp`)
      ),
      '2018': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/xmas/2018/${i + 1}.webp`)
      ),
      '2024': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/xmas/2024/${i + 1}.webp`)
      ),
      '2025': Array.from({ length: 8 }, (_, i) => 
        getAssetUrl(`events/xmas/2025/${i + 1}.webp`)
      ),
    },
    outing: {
      '2015': Array.from({ length: 9 }, (_, i) => 
        getAssetUrl(`events/outing/2015/${i + 1}.webp`)
      ),
    },
  }), []);

  const eventsData: EventData[] = useMemo(() => [
    {
      id: 'firedrill',
      title: 'FIRE DRILL',
      description: t('events.fire_drill.description'),
      imagesByYear: eventImages.firedrill,
      years: [
        { year: '2026', label: '2026' },
        { year: '2025', label: '2025' },
        { year: '2022', label: '2022' },
      ],
    },
    {
      id: 'meeting',
      title: 'TEAM MEETING',
      description: t('events.meeting.description'),
      imagesByYear: eventImages.meeting,
      years: [
        { year: '2026', label: '2026' }
      ],
    },
    {
      id: 'xmas_party',
      title: 'CHRISTMAS PARTY',
      description: t('events.xmas_party.description'),
      imagesByYear: eventImages.xmas_party,
      years: [
        { year: '2025', label: '2025' },
        { year: '2024', label: '2024' },
        { year: '2018', label: '2018' },
        { year: '2017', label: '2017' },
        { year: '2016', label: '2016' },
      ],
    },
    {
      id: 'outing',
      title: 'TEAM OUTING',
      description: t('events.outing.description'),
      imagesByYear: eventImages.outing,
      years: [
        { year: '2015', label: '2015' }
      ],
    },
  ], [t, eventImages]);

  if (i18n.language !== 'en') return null;

  return (
    <>
      <Helmet>
        <title>{t('events.page_title')}</title>
        <meta name="description" content={t('events.hero.subtitle')} />
      </Helmet>

      <div className="events-page">
        {/* HERO SECTION - NO scroll trigger on hero content */}
        <section className="events-hero">
          <div className="hero-overlay"></div>
          <div className="hero-background" role="img" aria-label="Events hero background"></div>

          <div className="events-hero-content">
            <h1>
              {t('events.hero.title')}
            </h1>
            <p>
              {t('events.hero.subtitle')}
            </p>
            <button 
              className="btn btn-event"
              onClick={() => { 
                const section = document.getElementById('event-intro-section'); 
                if (section) { 
                  const targetPosition = section.getBoundingClientRect().top + window.pageYOffset;
                  const startPosition = window.pageYOffset;
                  const distance = targetPosition - startPosition;
                  const duration = 1200;
                  let startTime: number | null = null;
                  
                  const easeInOutQuad = (t: number) => {
                    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                  };
                  
                  const animation = (currentTime: number) => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const easeProgress = easeInOutQuad(progress);
                    
                    window.scrollTo(0, startPosition + distance * easeProgress);
                    
                    if (timeElapsed < duration) {
                      requestAnimationFrame(animation);
                    }
                  };
                  
                  requestAnimationFrame(animation);
                }
              }}
            >
              View More
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5L12 19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

        {/* INTRO SECTION - Text and Gallery Wrapper use fade-up */}
        <section id="event-intro-section" className="events-intro-section">
          <div className="container">
            <h2 
              className="intro-title"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-offset="100"
              data-aos-once="true"
            >
              EVENTS AND CELEBRATIONS
            </h2>
            <p 
              className="intro-text"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
              data-aos-offset="100"
              data-aos-once="true"
            >
              Building A Strong, Safe, And Collaborative Team Culture Through Meaningful Experiences, 
              Shared Moments, And Professional Growth Opportunities That Bring Our Community Closer Together.
            </p>

            {/* Gallery Wrapper - WITH FADE-UP ANIMATION */}
            <div 
              className="gallery-wrapper"
              data-aos="fade-up"
              data-aos-duration="900"
              data-aos-delay="100"
              data-aos-offset="100"
              data-aos-once="true"
            >
              <div 
                className="intro-gallery infinite-gallery"
                ref={galleryRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {infiniteImages.map((image, index) => (
                  <div key={`${image.originalIndex}-${index}`} className="intro-gallery-card">
                    <img src={image.src} alt={image.alt} draggable={false} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll hint text - Uses fade-up */}
            <div 
              className="gallery-scroll-hint"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="300"
              data-aos-offset="100"
              data-aos-once="true"
            >
              <span>← Drag to explore →</span>
            </div>
          </div>
        </section>

        {/* ALL EVENTS CAROUSELS - All elements now use fade-up animations */}
        <main className="all-carousels-container">
          {eventsData.map((event, idx) => (
            <EventCarousel 
              key={event.id} 
              event={event} 
              index={idx}
            />
          ))}
        </main>
      </div>
    </>
  );
};

export default EventsCarousel;