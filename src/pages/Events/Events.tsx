import React, { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { getAssetUrl } from '../../utils/assets';
import LazyImage from '../../components/ui/LazyImage/LazyImage';

// Types
interface EventImageSet {
  firedrill: {
    [year: string]: string[];
  };
  meeting: {
    [year: string]: string[];
  };
  xmas_party: {
    [year: string]: string[];
  };
}

interface YearOption {
  year: string;
  label: string;
}

interface Event {
  id: keyof EventImageSet;
  title: string;
  subTitle: string;
  description: string;
  descriptionTitle: string;
  imagesByYear: {
    [year: string]: string[];
  };
  years: YearOption[];
  layout: 'left' | 'right';
}

// Custom hook for image slideshow with year dropdown
const useYearBasedSlideshow = (imagesByYear: { [year: string]: string[] }, initialYear: string) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentImages = imagesByYear[selectedYear] || [];
  const imagesLength = currentImages.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const changeYear = useCallback((year: string) => {
    setSelectedYear(year);
    setCurrentIndex(0);
  }, []);

  const pauseSlideshow = useCallback(() => setIsPaused(true), []);
  const resumeSlideshow = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (isPaused || imagesLength === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
    }, 3000);

    return () => clearInterval(timer);
  }, [imagesLength, isPaused]);

  return { 
    selectedYear,
    currentIndex,
    currentImages,
    goToSlide,
    changeYear,
    pauseSlideshow,
    resumeSlideshow,
    isPaused 
  };
};

// Thumbnail container - NO SCROLL, shows exactly 4 thumbnails
const ThumbnailContainer = memo(({ 
  images, 
  currentIndex, 
  onThumbnailClick,
  onMouseEnter,
  onMouseLeave,
  type = 'default'
}: { 
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  type?: 'default' | 'alt';
}) => {
  const visibleCount = 5;
  
  // Only show the first 4 thumbnails (or fewer if less than 4 images)
  const visibleThumbnails = useMemo(() => {
    return images.slice(0, visibleCount);
  }, [images]);

  const className = type === 'alt' ? 'thumbnail-container-alt' : 'thumbnail-container';

  const handleMouseEnterEvent = useCallback(() => {
    onMouseEnter();
  }, [onMouseEnter]);

  const handleMouseLeaveEvent = useCallback(() => {
    onMouseLeave();
  }, [onMouseLeave]);

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnterEvent}
      onMouseLeave={handleMouseLeaveEvent}
    >
      <div className={type === 'alt' ? 'thumbnails-list-alt' : 'thumbnails-list'}>
        {visibleThumbnails.map((img, index) => (
          <div
            key={index}
            className={`${type === 'alt' ? 'thumbnail-item-alt' : 'thumbnail-item'} ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onThumbnailClick(index)}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onThumbnailClick(index);
              }
            }}
          >
            <LazyImage 
              src={img} 
              alt={`Thumbnail ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
});

ThumbnailContainer.displayName = 'ThumbnailContainer';

// Dot indicator component
const DotIndicator = memo(({ 
  index, 
  isActive, 
  onClick, 
  onMouseEnter, 
  onMouseLeave,
  type = 'default' 
}: { 
  index: number; 
  isActive: boolean; 
  onClick: () => void; 
  onMouseEnter: () => void; 
  onMouseLeave: () => void;
  type?: 'default' | 'alt';
}) => {
  const className = type === 'alt' ? 'dot-alt' : 'dot';
  
  return (
    <span
      className={`${className} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onMouseEnter}
      onTouchEnd={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? 'true' : 'false'}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    />
  );
});

DotIndicator.displayName = 'DotIndicator';

// Year Dropdown Component
const YearDropdown = memo(({ 
  years,
  selectedYear,
  onYearChange,
  type = 'default'
}: { 
  years: YearOption[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  type?: 'default' | 'alt';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = years.find(y => y.year === selectedYear)?.label || selectedYear;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`year-dropdown-container ${type === 'alt' ? 'year-dropdown-right' : 'year-dropdown-left'}`}
      ref={dropdownRef}
    >
      <button
        className={`year-dropdown-button ${type === 'alt' ? 'year-dropdown-button-alt' : 'year-dropdown-button-default'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedLabel}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className={`year-dropdown-menu ${type === 'alt' ? 'year-dropdown-menu-alt' : 'year-dropdown-menu-default'}`}>
          {years.map(({ year, label }) => (
            <button
              key={year}
              className={`year-dropdown-item ${selectedYear === year ? 'active' : ''}`}
              onClick={() => {
                onYearChange(year);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedYear === year}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

YearDropdown.displayName = 'YearDropdown';

// Event component with slideshow and year dropdown
const EventWithSlideshow = memo(({ event }: { event: Event }) => {
  const initialYear = event.years[0]?.year || '';
  const { 
    selectedYear,
    currentIndex,
    currentImages,
    goToSlide,
    changeYear,
    pauseSlideshow,
    resumeSlideshow
  } = useYearBasedSlideshow(event.imagesByYear, initialYear);
  
  const isLeftLayout = event.layout === 'left';
  const currentYearLabel = event.years.find(y => y.year === selectedYear)?.label || selectedYear;

  useEffect(() => {
    if (currentImages.length > 0) {
      const nextIndex = (currentIndex + 1) % currentImages.length;
      const img = new Image();
      img.src = currentImages[nextIndex];
    }
  }, [currentIndex, currentImages]);

  const YearDropdownComponent = useMemo(() => (
    <YearDropdown
      years={event.years}
      selectedYear={selectedYear}
      onYearChange={changeYear}
      type={isLeftLayout ? 'default' : 'alt'}
    />
  ), [event.years, selectedYear, changeYear, isLeftLayout]);

  const Thumbnails = useMemo(() => (
    <ThumbnailContainer
      images={currentImages}
      currentIndex={currentIndex}
      onThumbnailClick={goToSlide}
      onMouseEnter={pauseSlideshow}
      onMouseLeave={resumeSlideshow}
      type={isLeftLayout ? 'default' : 'alt'}
    />
  ), [currentImages, currentIndex, goToSlide, pauseSlideshow, resumeSlideshow, isLeftLayout]);

  const Dots = useMemo(() => (
    <div className={isLeftLayout ? 'slider-controls' : 'slider-controls-alt'}>
      <div className={isLeftLayout ? 'slider-dots' : 'slider-dots-alt'}>
        {currentImages.map((_, index) => (
          <DotIndicator
            key={index}
            index={index}
            isActive={index === currentIndex}
            onClick={() => goToSlide(index)}
            onMouseEnter={pauseSlideshow}
            onMouseLeave={resumeSlideshow}
            type={isLeftLayout ? 'default' : 'alt'}
          />
        ))}
      </div>
    </div>
  ), [currentImages.length, currentIndex, goToSlide, pauseSlideshow, resumeSlideshow, isLeftLayout]);

  if (isLeftLayout) {
    return (
      <section className="event-section event-left" data-aos="fade-up">
        <div className="left-content">
          <div className="title-and-dropdown">
            <h2 className="section-title-left">{event.title}</h2>
            {YearDropdownComponent}
          </div>

          <div 
            className="main-image"
            onMouseEnter={pauseSlideshow}
            onMouseLeave={resumeSlideshow}
            onTouchStart={pauseSlideshow}
            onTouchEnd={resumeSlideshow}
          >
            {currentImages.map((img, index) => (
              <div
                key={index}
                className={`slide-image ${index === currentIndex ? 'active' : ''}`}
                aria-hidden={index !== currentIndex}
              >
                <LazyImage 
                  src={img}
                  alt={`${event.title} ${currentYearLabel} - Image ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {Dots}

          <div className="section-description">
            <h3>{event.descriptionTitle}</h3>
            <p>{event.description}</p>
          </div>
        </div>

        {Thumbnails}
      </section>
    );
  }

  return (
    <section className="event-section event-right" data-aos="fade-up">
      {Thumbnails}

      <div className="left-content-alt">
        <div className="title-and-dropdown-alt">
          <h2 className="section-titles-alt">{event.title}</h2>
          {YearDropdownComponent}
        </div>
       
        <div 
          className="main-image-alt"
          onMouseEnter={pauseSlideshow}
          onMouseLeave={resumeSlideshow}
          onTouchStart={pauseSlideshow}
          onTouchEnd={resumeSlideshow}
        >
          {currentImages.map((img, index) => (
            <div
              key={index}
              className={`slide-image ${index === currentIndex ? 'active' : ''}`}
              aria-hidden={index !== currentIndex}
            >
              <LazyImage 
                src={img}
                alt={`${event.title} ${currentYearLabel} - Image ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {Dots}

        <div className="section-description">
          <h3>{event.descriptionTitle}</h3>
          <p>{event.description}</p>
        </div>
      </div>
    </section>
  );
});

EventWithSlideshow.displayName = 'EventWithSlideshow';

// Main Events component
const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (i18n.language !== 'en') {
      navigate('/', { replace: true });
    }
  }, [i18n.language, navigate]);

  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: true,
      disable: window.innerWidth < 768
    });
    
    return () => {
      AOS.refreshHard();
    };
  }, []);

  const eventImages = useMemo(() => ({
      meeting: {
      '2026': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/meeting/2026/meeting_${i + 1}.jpg`)
      ),
    },
    firedrill: {
      '2022': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/firedrill/2022/firedrill_${i + 1}.JPG`)
      ),
      '2025': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/firedrill/2025/firedrill_${i + 1}.jpg`)
      ),
      '2026': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/firedrill/2026/firedrill_${i + 1}.jpg`)
      ),
    },
    xmas_party: {
      '2016': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/xmas/2016/xmas_party_${i + 1}.JPG`)
      ),
      '2017': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/xmas/2017/xmas_party_${i + 1}.JPG`)
      ),
      '2018': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/xmas/2018/xmas_party_${i + 1}.jpg`)
      ),
      '2024': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/xmas/2024/xmas_party_${i + 1}.jpg`)
      ),
      '2025': Array.from({ length: 5 }, (_, i) => 
        getAssetUrl(`events/xmas/2025/xmas_party_${i + 1}.jpg`)
      ),
    },
  }), []);

  const events = useMemo<Event[]>(() => [
    {
      id: 'meeting',
      title: 'Team Meeting',
      subTitle: 'Sub Title',
      description: t('events.meeting.description'),
      descriptionTitle: t('events.meeting.title'),
      imagesByYear: eventImages.meeting,
      years: [
        { year: '2026', label: '2026' }
          // Add more years as needed
      ],
      layout: 'left'
    },
    {
      id: 'firedrill',
      title: 'Firedrill',
      subTitle: 'Sub Title',
      description: t('events.fire_drill.description'),
      descriptionTitle: t('events.fire_drill.title'),
      imagesByYear: eventImages.firedrill,
      years: [
        { year: '2026', label: '2026' },
        { year: '2025', label: '2025' },
        { year: '2022', label: '2022' },
        
        
      ],
      layout: 'right'
    },
    {
      id: 'xmas_party',
      title: 'Christmas Party',
      subTitle: 'Sub Title',
      description: t('events.xmas_party.description'),
      descriptionTitle: t('events.xmas_party.title'),
      imagesByYear: eventImages.xmas_party,
      years: [
        { year: '2025', label: '2025' },
        { year: '2024', label: '2024' },
        { year: '2018', label: '2018' },
        { year: '2017', label: '2017' },
        { year: '2016', label: '2016' },
        

      ],
      layout: 'left'
    },
  ], [eventImages, t]);

  if (i18n.language !== 'en') return null;

  return (
    <>
      <Helmet>
        <title>{t('events.page_title')}</title>
        <meta name="description" content={t('events.hero.subtitle')} />
      </Helmet>

      <div className="events-page">
        <section className="events-hero">
          <div className="hero-overlay"></div>
          <div className="hero-background" 
               role="img" 
               aria-label="Events hero background">
          </div>

          <div className="events-hero-content">
            <h1>{t('events.hero.title')}</h1>
            <p>{t('events.hero.subtitle')}</p>
          </div>
        </section>

        <main className="events-container">
          {events.map((event) => (
            <EventWithSlideshow key={event.id} event={event} />
          ))}
        </main>
      </div>
    </>
  );
};

export default memo(Events);