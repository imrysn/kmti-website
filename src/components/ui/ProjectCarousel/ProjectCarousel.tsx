import React, { useState, useEffect, useRef } from 'react';
import { ProjectCard } from '../Card/Card';
import './ProjectCarousel.css';

interface Project {
  id: number;
  title: string;
  description: string;
  category?: string;
  image: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [cardWidth, setCardWidth] = useState(350);
  const [cardHeight, setCardHeight] = useState(480);
  const [spacing, setSpacing] = useState(349);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

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
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
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
          setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
          isDragging.current = false;
          dragStartX.current = e.clientX;
        } else {
          setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
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
  }, [cardWidth, projects.length]);

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

  return (
    <div className="project-carousel-container">
      <div className="project-carousel-wrapper">
        <div
          className="project-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab' }}
        >
          {projects.map((project, index) => {
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
                key={project.id}
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
                }}
                onClick={() => {
                  if (!isDragging.current && !isActive) {
                    setCurrentIndex(index);
                  }
                }}
              >
                <ProjectCard
                  image={project.image}
                  title={project.title}
                  subtitle={project.description}
                  category={project.category}
                  linkText="VIEW PROJECT"
                  linkHref="/projects"
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
