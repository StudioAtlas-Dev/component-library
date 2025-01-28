'use client';
import { useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';

interface StarrySkyProps {
  /** Maximum angle variance from downward direction (in degrees) */
  angleVariance?: number;
  /** Number of background stars */
  starCount?: number;
  /** Duration of shooting star animation in milliseconds */
  shootingStarDuration?: number;
  /** Delay (ms) between shooting stars */
  shootingStarDelay?: number;
  /** Color of the stars */
  starColor?: string;
  /** Size of background stars in pixels */
  starSize?: number;
  /** Thickness of the shooting star in pixels */
  shootingStarSize?: number;
  /** Whether to show shooting stars */
  showShootingStars?: boolean;
  /** Probability of a star twinkling (0–1) */
  twinkleProbability?: number;
  /** Additional className for the background container */
  backgroundClassName?: string;
  /** Additional className for individual stars */
  starClassName?: string;
}

interface Star {
  x: number;
  y: number;
  brightness: number;
  twinkleSpeed: number;
  phase: number;
  shouldTwinkle: boolean;
}

export default function StarrySkyComponent({
  angleVariance = 60,
  starCount = 100,
  shootingStarDuration = 4000,
  shootingStarDelay = 2000,
  starSize = 2,
  shootingStarSize = 3,
  showShootingStars = true,
  twinkleProbability = 0.9,
  backgroundClassName = '',
}: StarrySkyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  // Initialize stars
  const initStars = useCallback(() => {
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      brightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 1.0 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
      shouldTwinkle: Math.random() < twinkleProbability
    }));
  }, [starCount, twinkleProbability]);

  // Render stars on canvas
  const renderStars = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    starsRef.current.forEach((star) => {
      const time = performance.now() / 1000;
      const twinkle = star.shouldTwinkle ? Math.sin(star.phase + time * star.twinkleSpeed) : 1;
      const opacity = star.brightness * (0.5 + 0.5 * twinkle);

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(renderStars);
  }, [starSize]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (canvasRef.current && containerRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      initStars();
    }
  }, [initStars]);

  // Initialize shooting stars
  const initShootingStars = useCallback(() => {
    if (!svgRef.current || !showShootingStars) return;
    
    // Clear any existing defs
    const existingDefs = svgRef.current.querySelector('defs');
    if (existingDefs) {
      existingDefs.remove();
    }

    // Create fresh defs element
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgRef.current.appendChild(defs);

    // Start the shooting star animation
    if (!isAnimatingRef.current) {
      setTimeout(() => launchShootingStar(), 1000);
    }
  }, [showShootingStars]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full';
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    // Setup SVG for shooting stars
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none');
    containerRef.current.appendChild(svg);
    svgRef.current = svg;

    handleResize();
    window.addEventListener('resize', handleResize);
    renderStars();
    initShootingStars();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (svgRef.current) {
        anime.remove(svgRef.current.children);
      }
    };
  }, [handleResize, renderStars, initShootingStars]);

  // Launch one star (if not already animating),
  // then when it finishes, schedule the next star.
  function launchShootingStar() {
    if (!svgRef.current) return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const deadZone = 15;
    const availableRange = angleVariance - deadZone;
    
    const rand = (Math.random() > 0.5)
        ? Math.random() * availableRange + deadZone
        : -(Math.random() * availableRange + deadZone);
    
    const finalAngle = 90 + rand;
    const radians = (finalAngle * Math.PI) / 180;

    // Create a unique gradient ID for each shooting star
    const gradientId = `shooting-star-gradient-${Date.now()}`;
    
    // Create gradient element
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = gradientId;
    gradient.setAttribute('x1', '100%');
    gradient.setAttribute('y1', '50%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '50%');

    const stops = [
      { offset: '0%', color: '#9E00FF', opacity: 1 },
      { offset: '20%', color: '#9E00FF', opacity: 0.8 },
      { offset: '60%', color: '#2EB9DF', opacity: 0.5 },
      { offset: '100%', color: '#2EB9DF', opacity: 0 }
    ];

    stops.forEach(({ offset, color, opacity }) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('style', `stop-color: ${color}; stop-opacity: ${opacity}`);
      gradient.appendChild(stop);
    });

    // Get or create defs element
    let defs = svgRef.current.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgRef.current.appendChild(defs);
    }
    defs.appendChild(gradient);

    // Calculate start and end positions
    const startX = Math.random() * window.innerWidth;
    const startY = -50;
    const travelDistance = Math.max(window.innerWidth, window.innerHeight) * 2;
    const endX = startX + Math.cos(radians) * travelDistance;
    const endY = startY + Math.sin(radians) * travelDistance;

    // Create and configure the shooting star rectangle
    const starRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    starRect.setAttribute('width', String(shootingStarSize * 40));
    starRect.setAttribute('height', String(shootingStarSize));
    starRect.setAttribute('fill', `url(#${gradientId})`);
    starRect.style.opacity = '0';
    starRect.setAttribute(
      'transform',
      `translate(${startX}, ${startY}) rotate(${finalAngle}, 0, 0)`
    );

    svgRef.current.appendChild(starRect);

    // Animate the shooting star
    anime({
      targets: starRect,
      easing: 'linear',
      duration: shootingStarDuration,
      opacity: [
        { value: 0, duration: 0 },
        { value: 1, duration: shootingStarDuration * 0.1 },
        { value: 1, duration: shootingStarDuration * 0.8 },
        { value: 0, duration: shootingStarDuration * 0.1 }
      ],
      update: anim => {
        const progress = anim.progress / 100;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        const newWidth = shootingStarSize * (40 + 120 * progress);
        starRect.setAttribute('width', String(newWidth));
        starRect.setAttribute(
          'transform',
          `translate(${currentX}, ${currentY}) rotate(${finalAngle}, 0, 0)`
        );
      },
      complete: () => {
        starRect.remove();
        gradient.remove();
        isAnimatingRef.current = false;
        setTimeout(() => launchShootingStar(), shootingStarDelay);
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden bg-[#141414] ${backgroundClassName}`}
    />
  );
}
