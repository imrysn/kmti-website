import React, { useEffect, useRef, useState } from 'react';
import './LazyVideo.css';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'none'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsInView(true);
            setIsLoaded(true);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observer.observe(videoElement);

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [isLoaded]);

  return (
    <div className={`lazy-video-wrapper ${className}`}>
      <video
        ref={videoRef}
        className="lazy-video"
        autoPlay={autoPlay && isInView}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        poster={poster}
      >
        {isLoaded && <source src={src} type="video/mp4" />}
      </video>
      {!isLoaded && (
        <div className="lazy-video-placeholder">
          {poster && <img src={poster} alt="Video placeholder" />}
        </div>
      )}
    </div>
  );
};

export default LazyVideo;
