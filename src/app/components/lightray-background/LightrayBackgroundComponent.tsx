'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface LightrayBackgroundProps {
    children: ReactNode;
    className?: string;
    showRadialGradient?: boolean;
}

export default function LightrayBackgroundComponent({
    children,
    className,
    showRadialGradient = true
}: LightrayBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const raysRef = useRef<HTMLDivElement[]>([]);
    const timelineRef = useRef<anime.AnimeTimelineInstance | null>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout>();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    // Separate initialization function
    const initializeRays = () => {
        if (!containerRef.current || !hydrated) return;

        const rayCount = window.innerWidth < 768 ? 6 : 8; // Fewer rays on mobile
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const aspectRatio = viewportWidth / viewportHeight;

        // Base width as percentage of viewport width
        const baseWidthVw = aspectRatio < 1 ? 15 : 8; // Wider rays on mobile
        const angle = aspectRatio < 1 ? 25 : 15; // Steeper angle on mobile
        
        // Each ray needs its width plus movement space
        const spacing = 100 / (rayCount - 1); // Distribute across 100% with proper gaps
        
        // Clear existing rays
        raysRef.current = [];
        containerRef.current.innerHTML = '';

        // Create rays with varied positions and widths
        const fragment = document.createDocumentFragment();

        // Pre-calculate ray positions to ensure no overlap
        const positions = Array.from({ length: rayCount }, (_, i) => {
            const basePosition = spacing * i; // Evenly space rays
            const maxOffset = spacing * 0.15; // Small random offset for natural look
            return basePosition + (Math.random() - 0.5) * maxOffset;
        }).sort((a, b) => a - b); // Sort to maintain left-to-right order

        positions.forEach((position, i) => {
            const ray = document.createElement('div');
            const rayWidthVw = baseWidthVw * (1 + Math.random()); // Width in vw units
            const blurAmount = rayWidthVw * 0.15; // Blur relative to width
            const heightPercent = aspectRatio < 1 ? 
                180 + Math.random() * 80 : // Taller on mobile
                140 + Math.random() * 80;  // Standard height on desktop
            
            ray.style.cssText = `
                position: absolute;
                top: -30%;
                left: ${position}%;
                width: ${rayWidthVw}vw;
                height: 0%;
                transform: rotate(${angle}deg);
                background: linear-gradient(90deg,
                    transparent,
                    rgba(255, 255, 255, 0.1) 20%,
                    rgba(255, 255, 255, 0.2) 30%,
                    rgba(255, 255, 255, 0.4) 40%,
                    rgba(255, 255, 255, 0.4) 60%,
                    rgba(255, 255, 255, 0.2) 70%,
                    rgba(255, 255, 255, 0.1) 80%,
                    transparent
                );
                filter: blur(${blurAmount}vw);
                mix-blend-mode: plus-lighter;
                opacity: 0.7;
                will-change: transform, opacity, height;
                pointer-events: none;
                --final-height: ${heightPercent}%;
            `;

            if (showRadialGradient) {
                ray.style.maskImage = 'linear-gradient(to bottom, black 30%, transparent)';
            }

            fragment.appendChild(ray);
            raysRef.current.push(ray);
        });

        containerRef.current.appendChild(fragment);

        // Initial height animation
        anime({
            targets: raysRef.current,
            height: (el: HTMLElement) => el.style.getPropertyValue('--final-height'),
            duration: 4000,
            easing: 'easeOutExpo'
        });

        // Movement animation
        timelineRef.current = anime.timeline({
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });

        // Calculate safe movement ranges based on spacing
        const maxMove = spacing * 0.2; // Limit movement to 20% of spacing
        const minMove = maxMove * 0.4; // Minimum movement is 40% of max movement

        raysRef.current.forEach((ray, index) => {
            // Ensure minimum movement by adding minMove to a smaller random range
            const moveAmount = minMove + (Math.random() * (maxMove - minMove));
            // Randomly choose direction
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            timelineRef.current?.add({
                targets: ray,
                translateX: direction * moveAmount + 'vw',
                opacity: [0.5, 0.7],
                duration: anime.random(3000, 4000),
                delay: index * 100,
            }, 0);
        });
    };

    useEffect(() => {
        // Initial setup
        initializeRays();

        // Handle resize with debounce
        const handleResize = () => {
            // Clear existing timeout
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            // Set new timeout
            resizeTimeoutRef.current = setTimeout(() => {
                // Clean up existing animations
                if (timelineRef.current) {
                    timelineRef.current.pause();
                }
                // Reinitialize rays
                initializeRays();
            }, 250); // Debounce time
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            if (timelineRef.current) {
                timelineRef.current.pause();
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            raysRef.current = [];
        };
    }, [hydrated, showRadialGradient]);

    const baseClasses = "relative flex flex-col h-full items-center justify-center bg-gray-900";

    return (
        <main className="relative w-full h-screen overflow-hidden">
            <div className={cn(baseClasses, className)}>
                {hydrated && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div 
                            ref={containerRef}
                            className="absolute inset-0"
                        />
                    </div>
                )}
                <div className="relative z-20">
                    {children}
                </div>
            </div>
        </main>
    );
} 