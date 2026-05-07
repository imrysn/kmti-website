import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectCard } from '../Card/Card';
import './ProjectCarousel.css';

interface Project {
  id: number;
  title: string;
  description: string;
  category?: string;
  image: string;
  link?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const { t } = useTranslation();
  const projectsExtended = [];
  for (let i = 0; i < 10; i++) {
    projectsExtended.push(...projects);
  }
  const [currentIndex, setCurrentIndex] = useState(5 * projects.length);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [cardWidth, setCardWidth] = useState(350);
  const [cardHeight, setCardHeight] = useState(480);
  const [spacing, setSpacing] = useState(349);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    const updateCardDimensions = () => {
      const width = window.innerWidth;
      const activeScale = 1.0;
      const adjacentScale = 0.82;
      const fixedGap = 30;
      const avgScale = (activeScale + adjacentScale) / 2;

      if (width <= 480) {
        setCardWidth(260);
        setCardHeight(400);
        setSpacing(260 * avgScale + fixedGap);
      } else if (width <= 768) {
        setCardWidth(280);
        setCardHeight(420);
        setSpacing(280 * avgScale + fixedGap);
      } else if (width <= 1024) {
        setCardWidth(320);
        setCardHeight(450);
        setSpacing(320 * avgScale + fixedGap);
      } else {
        setCardWidth(350);
        setCardHeight(480);
        setSpacing(350 * avgScale + fixedGap);
      }
    };

    updateCardDimensions();
    window.addEventListener('resize', updateCardDimensions);
    return () => window.removeEventListener('resize', updateCardDimensions);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const getCardPosition = (index: number) => {
    const distance = index - currentIndex;
    return {
      distance,
      isActive: distance === 0,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStartX.current;
      const threshold = cardWidth * 0.25;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          setCurrentIndex((prev) => prev - 1);
          isDragging.current = false;
          dragStartX.current = e.clientX;
        } else {
          setCurrentIndex((prev) => prev + 1);
          isDragging.current = false;
          dragStartX.current = e.clientX;
        }
        if (carouselRef.current) {
          carouselRef.current.style.cursor = 'grab';
        }
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      if (carouselRef.current) {
        carouselRef.current.style.cursor = 'grab';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cardWidth]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleNativeTouchMove = (e: TouchEvent) => {
      if (!isSwiping.current) return;
      e.preventDefault();
    };

    carousel.addEventListener('touchmove', handleNativeTouchMove, { passive: false });

    return () => {
      carousel.removeEventListener('touchmove', handleNativeTouchMove);
    };
  }, []);

  useEffect(() => {
    if (currentIndex < 2 * projects.length) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex + 6 * projects.length);
      setTimeout(() => setTransitionEnabled(true), 0);
    } else if (currentIndex >= 8 * projects.length) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex - 6 * projects.length);
      setTimeout(() => setTransitionEnabled(true), 0);
    }
  }, [currentIndex, projects.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.carousel-nav-btn') || target.closest('a') || target.closest('button')) {
      return;
    }
    if (!carouselRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.carousel-nav-btn') || target.closest('a') || target.closest('button')) {
      return;
    }
    if (!carouselRef.current) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = true;
  };

  const handleTouchMove = () => {};

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touchStartX.current - touch.clientX;
    const deltaY = touchStartY.current - touch.clientY;
    const minSwipeDistance = 20;
    const maxVerticalDistance = 100;

    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDistance) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    isSwiping.current = false;
  };

  return (
    <div className="project-carousel-container">
      <div className="project-carousel-wrapper">
        <div
          className="project-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: 'grab' }}
        >
          {projectsExtended.map((project, index) => {
            const { distance, isActive } = getCardPosition(index);
            const absDistance = Math.abs(distance);

            let scale: number;
            if (absDistance === 0) {
              scale = 1.00;
            } else if (absDistance === 1) {
              scale = 0.82;
            } else if (absDistance === 2) {
              scale = 0.72;
            } else {
              scale = 0.65;
            }

            const opacity = isActive ? 1 : Math.max(0.6, 1 - absDistance * 0.15);
            const translateX = distance * spacing;

            return (
              <div
                key={index}
                className={`project-carousel-card ${isActive ? 'active' : ''}`}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  minHeight: `${cardHeight}px`,
                  marginLeft: `-${cardWidth / 2}px`,
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: isActive ? 10 : Math.max(1, 10 - absDistance),
                  pointerEvents: absDistance > 3 ? 'none' : 'auto',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transition: transitionEnabled ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, filter 0.6s ease' : 'none',
                }}
                onClick={() => {
                  if (!isDragging.current && !isSwiping.current && !isActive) {
                    setCurrentIndex(index);
                  }
                }}
              >
                <ProjectCard
                  image={project.image}
                  title={project.title}
                  subtitle={project.description}
                  category={project.category}
                  linkText={t('common.view_project')}
                  linkHref={project.link || "/projects"}
                  isActive={isActive}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="project-carousel-nav">
        <button
          className="carousel-nav-btn carousel-nav-prev"
          onClick={goToPrevious}
          aria-label="Previous project"
        >
          ‹
        </button>
        <button
          className="carousel-nav-btn carousel-nav-next"
          onClick={goToNext}
          aria-label="Next project"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ProjectCarousel;