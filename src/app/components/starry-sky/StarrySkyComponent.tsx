'use client';
import { useEffect, useRef } from 'react';
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

export default function StarrySkyComponent({
  angleVariance = 45,
  starCount = 100,
  shootingStarDuration = 4000,
  shootingStarDelay = 2000,
  starColor = '#FFFFFF',
  starSize = 2,
  shootingStarSize = 3,
  showShootingStars = true,
  twinkleProbability = 0.7,
  backgroundClassName = '',
  starClassName = '',
}: StarrySkyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // This ref ensures we only animate one star at a time.
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear the container
    containerRef.current.innerHTML = '';

    // Create SVG for the shooting star
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full');
    containerRef.current.appendChild(svg);
    svgRef.current = svg;

    // Create defs for gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Create background stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = `absolute rounded-full ${starClassName}`;
      star.style.width = `${starSize}px`;
      star.style.height = `${starSize}px`;
      star.style.backgroundColor = starColor;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      containerRef.current.appendChild(star);

      // All stars twinkle, but with varying intensities based on probability
      const intensity = 0.3 + (Math.random() * 0.7 * twinkleProbability); // minimum 0.3 opacity variation
      anime({
        targets: star,
        opacity: [
          { value: intensity, duration: 800, easing: 'easeInOutQuad' },
          { value: 1, duration: 800, easing: 'easeInOutQuad' }
        ],
        scale: [
          { value: 0.8 + (intensity * 0.2), duration: 800, easing: 'easeInOutQuad' },
          { value: 1, duration: 800, easing: 'easeInOutQuad' }
        ],
        loop: true,
        delay: Math.random() * 1000
      });
    }

    // If user doesn't want shooting stars, exit
    if (!showShootingStars) return;

    // Kick off the first star after 1 second
    const initialTimeout = setTimeout(() => launchShootingStar(), 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      if (svgRef.current) {
        anime.remove(svgRef.current.children);
      }
    };
  }, [
    angleVariance,
    starCount,
    shootingStarDuration,
    shootingStarDelay,
    starColor,
    starSize,
    shootingStarSize,
    showShootingStars,
    twinkleProbability,
    starClassName
  ]);

  // Launch one star (if not already animating),
  // then when it finishes, schedule the next star.
  function launchShootingStar() {
    if (!svgRef.current) return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Our base angle is "straight down" = 90 degrees.
    // We randomly add or subtract up to angleVariance, but avoid the 15° dead zone
    const deadZone = 15; // degrees to avoid on either side of straight down
    const availableRange = angleVariance - deadZone;
    
    // Generate random angle in the allowed range (either -angleVariance..-deadZone or deadZone..angleVariance)
    const rand = (Math.random() > 0.5)
        ? Math.random() * availableRange + deadZone // positive side
        : -(Math.random() * availableRange + deadZone); // negative side
    
    const finalAngle = 90 + rand; // e.g. between 45..75 or 105..135 for angleVariance=45
    const radians = (finalAngle * Math.PI) / 180;

    // Create a linearGradient
    const gradientId = 'shooting-star-gradient';
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = gradientId;
    // By default, gradientUnits="objectBoundingBox", so it's left→right in local coords
    gradient.setAttribute('x1', '100%');  // Start at right
    gradient.setAttribute('y1', '50%');
    gradient.setAttribute('x2', '0%');    // End at left
    gradient.setAttribute('y2', '50%');

    // Color stops
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
    svgRef.current.querySelector('defs')?.appendChild(gradient);

    // Start near top
    const startX = Math.random() * window.innerWidth;
    const startY = -50; // slightly above the viewport

    // End far off screen
    const travelDistance = Math.max(window.innerWidth, window.innerHeight) * 2;
    const endX = startX + Math.cos(radians) * travelDistance;
    const endY = startY + Math.sin(radians) * travelDistance;

    // Create the rect
    // It's wide horizontally in local coords. Rotating it will angle the tail.
    const starRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    starRect.setAttribute('width', String(shootingStarSize * 40));
    starRect.setAttribute('height', String(shootingStarSize));
    starRect.setAttribute('fill', `url(#${gradientId})`);
    starRect.style.opacity = '0';

    // Position it at (startX, startY), and rotate about that corner
    starRect.setAttribute(
      'transform',
      `translate(${startX}, ${startY})
       rotate(${finalAngle}, 0, 0)`
    );

    svgRef.current.appendChild(starRect);

    // Animate
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
        const progress = anim.progress / 100; // 0..1
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        // lengthen the tail from 40 up to 160
        const newWidth = shootingStarSize * (40 + 120 * progress);
        starRect.setAttribute('width', String(newWidth));

        // Reapply transform with updated translation:
        starRect.setAttribute(
          'transform',
          `translate(${currentX}, ${currentY})
           rotate(${finalAngle}, 0, 0)`
        );
      },
      complete: () => {
        // Remove from DOM
        starRect.remove();
        svgRef.current?.querySelector(`#${gradientId}`)?.remove();

        // Done animating, allow next star
        isAnimatingRef.current = false;

        // Spawn next star after a delay
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
