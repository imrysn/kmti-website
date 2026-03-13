import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // make scrolling smooth
  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    let animationFrame: number;
    let startTime: number | null = null;
    const startPosition = window.scrollY;
    const duration = 500; // Animation duration in ms
    
    const animateScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newPosition = startPosition * (1 - easeOutCubic);
      
      window.scrollTo(0, newPosition);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateScroll);
      }
    };
    
    animationFrame = requestAnimationFrame(animateScroll);
    
    // Clean up on user scroll
    const cancelAnimation = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('wheel', cancelAnimation);
      window.removeEventListener('touchstart', cancelAnimation);
    };
    
    window.addEventListener('wheel', cancelAnimation, { once: true });
    window.addEventListener('touchstart', cancelAnimation, { once: true });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
      <button
        type="button"
        onClick={scrollToTop}
        className="scroll-btn"
        aria-label="Scroll to top"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 19V5M12 5L5 12M12 5L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
