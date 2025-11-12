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
  // Start at index 2 (FORMING AND SIZING MACHINE) to show 5 cards by default
  // This matches the design with the center card active and 2 cards on each side
  const [currentIndex, setCurrentIndex] = useState(2);
  const [cardWidth, setCardWidth] = useState(350);
  const [cardHeight, setCardHeight] = useState(480);
  // Initial spacing: 350 * 0.91 + 30 = 348.5 (will be updated by useEffect)
  const [spacing, setSpacing] = useState(349);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

  useEffect(() => {
    const updateCardDimensions = () => {
      const width = window.innerWidth;
      // Calculate spacing to maintain consistent visual gaps
      // Active card (distance 0): scale = 1.0
      // Adjacent card (distance 1): scale = 0.82
      // Spacing = (cardWidth/2 * scale1) + gap + (cardWidth/2 * scale2)
      // Simplified: cardWidth * (scale1 + scale2)/2 + gap
      const activeScale = 1.0;
      const adjacentScale = 0.82; // Fixed scale for distance 1 cards (matches scale calculation)
      const fixedGap = 30; // Target visual gap between card edges
      const avgScale = (activeScale + adjacentScale) / 2; // 0.91

      if (width <= 480) {
        setCardWidth(260);
        setCardHeight(400);
        setSpacing(260 * avgScale + fixedGap); // ~269px
      } else if (width <= 768) {
        setCardWidth(280);
        setCardHeight(420);
        setSpacing(280 * avgScale + fixedGap); // ~289px
      } else if (width <= 1024) {
        setCardWidth(320);
        setCardHeight(450);
        setSpacing(320 * avgScale + fixedGap); // ~330px
      } else {
        setCardWidth(350);
        setCardHeight(480);
        setSpacing(350 * avgScale + fixedGap); // ~361px
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
    // Simple linear distance calculation - no circular wrapping to prevent jumps
    const distance = index - currentIndex;

    return {
      distance: distance,
      isActive: distance === 0,
    };
  };

  // Drag navigation handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStartX.current;
      const threshold = cardWidth * 0.25; // 25% of card width to trigger navigation

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // Dragged right - go to previous
          setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
          isDragging.current = false;
          dragStartX.current = e.clientX;
        } else {
          // Dragged left - go to next
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
    // Don't start drag on button clicks or card links
    const target = e.target as HTMLElement;
    if (target.closest('.carousel-nav-btn') || target.closest('a') || target.closest('button')) {
      return;
    }
    if (!carouselRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
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

            // Consistent scale calculation - all cards at same distance have EXACT same scale
            // Very pronounced scaling for clear visual distinction
            // Using fixed values to ensure 100% consistency
            let scale: number;
            if (absDistance === 0) {
              scale = 1.00; // Active card - full size
            } else if (absDistance === 1) {
              scale = 0.82; // Adjacent cards - clearly smaller
            } else if (absDistance === 2) {
              scale = 0.72; // Second level - even smaller  
            } else {
              scale = 0.65; // All other cards (distance 3+) - smallest and CONSISTENT
            }

            // Ensure scale is exactly the same for all cards at same distance
            // No rounding needed since we're using fixed values

            const opacity = isActive ? 1 : Math.max(0.6, 1 - absDistance * 0.15);
            // Use fixed spacing for consistent gaps between all cards
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
                  // Force hardware acceleration and ensure transform is applied
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

