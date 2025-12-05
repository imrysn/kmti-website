import React, { useRef, useEffect, CSSProperties } from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
  children?: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  style?: CSSProperties;
  className?: string;
  isOverlay?: boolean;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#51A2FF',
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style = {},
  className = '',
  isOverlay = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    // For overlay mode, use parent element; for wrapper mode, use container
    const container = isOverlay 
      ? canvasRef.current?.parentElement 
      : containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    // Initial resize with slight delay to ensure layout is complete
    resizeCanvas();
    // Also resize on next frame to catch any layout changes
    requestAnimationFrame(() => {
      resizeCanvas();
    });
    
    // Use ResizeObserver for better size detection
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);
    
    window.addEventListener('resize', resizeCanvas);
    
    // Also listen for images loading which can change card dimensions
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', resizeCanvas);
      }
    });

    let time = 0;
    const borderRadius = parseFloat(String(style.borderRadius)) || 0;

    const drawElectricBorder = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const segments = 100;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw electric border around the rectangle with rounded corners
      ctx.beginPath();
      
      const getOffset = (i: number, total: number) => {
        const chaosAmount = chaos * 3;
        return Math.sin(time * speed * 5 + i * 0.5) * chaosAmount + 
               Math.sin(time * speed * 7 + i * 0.3) * chaosAmount * 0.5;
      };

      // Top edge
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = borderRadius + progress * (width - 2 * borderRadius);
        const y = thickness / 2 + getOffset(i, segments);
        if (i === 0) ctx.moveTo(x, Math.max(y, thickness / 2));
        else ctx.lineTo(x, Math.max(y, thickness / 2));
      }

      // Top-right corner
      const cornerSegments = 10;
      for (let i = 0; i <= cornerSegments; i++) {
        const angle = -Math.PI / 2 + (Math.PI / 2) * (i / cornerSegments);
        const x = width - borderRadius + Math.cos(angle) * (borderRadius - thickness / 2) + getOffset(segments + i, cornerSegments) * 0.3;
        const y = borderRadius + Math.sin(angle) * (borderRadius - thickness / 2) + getOffset(segments + i, cornerSegments) * 0.3;
        ctx.lineTo(x, y);
      }

      // Right edge
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = width - thickness / 2 + getOffset(segments * 2 + i, segments);
        const y = borderRadius + progress * (height - 2 * borderRadius);
        ctx.lineTo(Math.min(x, width - thickness / 2), y);
      }

      // Bottom-right corner
      for (let i = 0; i <= cornerSegments; i++) {
        const angle = 0 + (Math.PI / 2) * (i / cornerSegments);
        const x = width - borderRadius + Math.cos(angle) * (borderRadius - thickness / 2) + getOffset(segments * 3 + i, cornerSegments) * 0.3;
        const y = height - borderRadius + Math.sin(angle) * (borderRadius - thickness / 2) + getOffset(segments * 3 + i, cornerSegments) * 0.3;
        ctx.lineTo(x, y);
      }

      // Bottom edge
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = width - borderRadius - progress * (width - 2 * borderRadius);
        const y = height - thickness / 2 + getOffset(segments * 4 + i, segments);
        ctx.lineTo(x, Math.min(y, height - thickness / 2));
      }

      // Bottom-left corner
      for (let i = 0; i <= cornerSegments; i++) {
        const angle = Math.PI / 2 + (Math.PI / 2) * (i / cornerSegments);
        const x = borderRadius + Math.cos(angle) * (borderRadius - thickness / 2) + getOffset(segments * 5 + i, cornerSegments) * 0.3;
        const y = height - borderRadius + Math.sin(angle) * (borderRadius - thickness / 2) + getOffset(segments * 5 + i, cornerSegments) * 0.3;
        ctx.lineTo(x, y);
      }

      // Left edge
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = thickness / 2 + getOffset(segments * 6 + i, segments);
        const y = height - borderRadius - progress * (height - 2 * borderRadius);
        ctx.lineTo(Math.max(x, thickness / 2), y);
      }

      // Top-left corner
      for (let i = 0; i <= cornerSegments; i++) {
        const angle = Math.PI + (Math.PI / 2) * (i / cornerSegments);
        const x = borderRadius + Math.cos(angle) * (borderRadius - thickness / 2) + getOffset(segments * 7 + i, cornerSegments) * 0.3;
        const y = borderRadius + Math.sin(angle) * (borderRadius - thickness / 2) + getOffset(segments * 7 + i, cornerSegments) * 0.3;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();

      // Add occasional sparks
      if (Math.random() < 0.1 * chaos) {
        const sparkX = Math.random() * width;
        const sparkY = Math.random() < 0.5 ? 
          (Math.random() < 0.5 ? thickness : height - thickness) : 
          Math.random() * height;
        const sparkLength = 5 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + (Math.random() - 0.5) * sparkLength, sparkY + (Math.random() - 0.5) * sparkLength);
        ctx.stroke();
      }

      time += 0.016;
      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    drawElectricBorder();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
      images.forEach(img => {
        img.removeEventListener('load', resizeCanvas);
      });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, speed, chaos, thickness, style.borderRadius, isOverlay]);

  // Overlay mode: render just the canvas as an absolutely positioned overlay
  if (isOverlay) {
    return (
      <canvas 
        ref={canvasRef} 
        className={`electric-border-overlay ${className}`}
      />
    );
  }

  // Wrapper mode: render container with canvas and children
  return (
    <div 
      ref={containerRef}
      className={`electric-border-container ${className}`}
      style={style}
    >
      <canvas 
        ref={canvasRef} 
        className="electric-border-canvas"
      />
      <div className="electric-border-content" style={{ borderRadius: style.borderRadius }}>
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;

