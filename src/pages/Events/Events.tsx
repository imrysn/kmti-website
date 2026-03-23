import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
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
  exercise: string[];
  firedrill: string[];
  meeting: string[];
  xmas_party: string[];
}

interface Event {
  id: keyof EventImageSet;
  title: string;
  subTitle: string;
  description: string;
  descriptionTitle: string;
  images: string[];
  layout: 'left' | 'right';
}

// Custom hook for image slideshow with performance optimizations
const useImageSlideshow = (images: string[], interval = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const imagesLength = images.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const pauseSlideshow = useCallback(() => setIsPaused(true), []);
  const resumeSlideshow = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    if (isPaused || imagesLength === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
    }, interval);

    return () => clearInterval(timer);
  }, [imagesLength, interval, isPaused]);

  return { 
    currentIndex, 
    goToSlide,
    pauseSlideshow,
    resumeSlideshow,
    isPaused 
  };
};

// Thumbnail container with up/down navigation
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
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;
  const totalImages = images.length;

  const handleUp = useCallback(() => {
    setStartIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? Math.max(0, totalImages - visibleCount) : newIndex;
    });
  }, [totalImages]);

  const handleDown = useCallback(() => {
    setStartIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex > totalImages - visibleCount ? 0 : newIndex;
    });
  }, [totalImages]);

  const visibleThumbnails = useMemo(() => {
    const endIndex = Math.min(startIndex + visibleCount, totalImages);
    return images.slice(startIndex, endIndex);
  }, [images, startIndex, totalImages]);

  const className = type === 'alt' ? 'thumbnail-container-alt' : 'thumbnail-container';
  const buttonClassName = type === 'alt' ? 'nav-button-alt' : 'nav-button';

  const showNavigation = totalImages > visibleCount;

  return (
    <div 
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showNavigation && (
        <button 
          className={buttonClassName}
          onClick={handleUp}
          aria-label="Previous thumbnails"
        >
          ↑
        </button>
      )}
      
      <div className={type === 'alt' ? 'thumbnails-list-alt' : 'thumbnails-list'}>
        {visibleThumbnails.map((img, idx) => {
          const actualIndex = startIndex + idx;
          return (
            <div
              key={actualIndex}
              className={`${type === 'alt' ? 'thumbnail-item-alt' : 'thumbnail-item'} ${actualIndex === currentIndex ? 'active' : ''}`}
              onClick={() => onThumbnailClick(actualIndex)}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onTouchStart={onMouseEnter}
              onTouchEnd={onMouseLeave}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${actualIndex + 1}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onThumbnailClick(actualIndex);
                }
              }}
            >
              <LazyImage 
                src={img} 
                alt={`Thumbnail ${actualIndex + 1}`}
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
      
      {showNavigation && (
        <button 
          className={buttonClassName}
          onClick={handleDown}
          aria-label="Next thumbnails"
        >
          ↓
        </button>
      )}
    </div>
  );
});

ThumbnailContainer.displayName = 'ThumbnailContainer';

// Memoized dot component
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

// Memoized event component
const EventWithSlideshow = memo(({ event }: { event: Event }) => {
  const { currentIndex, goToSlide, pauseSlideshow, resumeSlideshow } = useImageSlideshow(event.images);
  const isLeftLayout = event.layout === 'left';

  useEffect(() => {
    const nextIndex = (currentIndex + 1) % event.images.length;
    const img = new Image();
    img.src = event.images[nextIndex];
  }, [currentIndex, event.images]);

  const Thumbnails = useMemo(() => (
    <ThumbnailContainer
      images={event.images}
      currentIndex={currentIndex}
      onThumbnailClick={goToSlide}
      onMouseEnter={pauseSlideshow}
      onMouseLeave={resumeSlideshow}
      type={isLeftLayout ? 'default' : 'alt'}
    />
  ), [event.images, currentIndex, goToSlide, pauseSlideshow, resumeSlideshow, isLeftLayout]);

  const Dots = useMemo(() => (
    <div className={isLeftLayout ? 'slider-controls' : 'slider-controls-alt'}>
      <div className={isLeftLayout ? 'slider-dots' : 'slider-dots-alt'}>
        {event.images.map((_, index) => (
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
  ), [event.images.length, currentIndex, goToSlide, pauseSlideshow, resumeSlideshow, isLeftLayout]);

  if (isLeftLayout) {
    return (
      <section className="event-section event-left" data-aos="fade-up">
        <div className="left-content">
          <h2 className="section-title-left">{event.title}</h2>
          
          <div 
            className="main-image"
            onMouseEnter={pauseSlideshow}
            onMouseLeave={resumeSlideshow}
            onTouchStart={pauseSlideshow}
            onTouchEnd={resumeSlideshow}
          >
            {event.images.map((img, index) => (
              <div
                key={index}
                className={`slide-image ${index === currentIndex ? 'active' : ''}`}
                aria-hidden={index !== currentIndex}
              >
                <LazyImage 
                  src={img}
                  alt={`${event.title} - Image ${index + 1}`}
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
        <h2 className="section-titles-alt">{event.title}</h2>
       
        <div 
          className="main-image-alt"
          onMouseEnter={pauseSlideshow}
          onMouseLeave={resumeSlideshow}
          onTouchStart={pauseSlideshow}
          onTouchEnd={resumeSlideshow}
        >
          {event.images.map((img, index) => (
            <div
              key={index}
              className={`slide-image ${index === currentIndex ? 'active' : ''}`}
              aria-hidden={index !== currentIndex}
            >
              <LazyImage 
                src={img}
                alt={`${event.title} - Image ${index + 1}`}
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

// Main component
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

  const eventImages = useMemo<EventImageSet>(() => ({
    exercise: Array.from({ length: 4 }, (_, i) => 
      getAssetUrl(`events/exercise_${i + 1}.webp`)
    ),
    firedrill: Array.from({ length: 12 }, (_, i) => 
      getAssetUrl(`events/firedrill/firedrill_${i + 1}.webp`)
    ),
    meeting: Array.from({ length: 8 }, (_, i) => 
      getAssetUrl(`events/meeting/meeting_${i + 1}.jpg`)
    ),
    xmas_party: Array.from({ length: 12 }, (_, i) => 
      getAssetUrl(`events/xmas/xmas_party_${i + 1}.webp`)
    ),
  }), []);

  const events = useMemo<Event[]>(() => [
    {
      id: 'exercise',
      title: 'Exercise',
      subTitle: 'Sub Title',
      description: t('events.exercise.description'),
      descriptionTitle: t('events.exercise.title'),
      images: eventImages.exercise,
      layout: 'left'
    },
    {
      id: 'firedrill',
      title: 'Firedrill',
      subTitle: 'Sub Title',
      description: t('events.fire_drill.description'),
      descriptionTitle: t('events.fire_drill.title'),
      images: eventImages.firedrill,
      layout: 'right'
    },
    {
      id: 'meeting',
      title: 'Team Meeting',
      subTitle: 'Sub Title',
      description: t('events.meeting.description'),
      descriptionTitle: t('events.meeting.title'),
      images: eventImages.meeting,
      layout: 'left'
    },
    {
      id: 'xmas_party',
      title: 'Christmas Party',
      subTitle: 'Sub Title',
      description: t('events.xmas_party.description'),
      descriptionTitle: t('events.xmas_party.title'),
      images: eventImages.xmas_party,
      layout: 'right'
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