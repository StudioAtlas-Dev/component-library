'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import anime from 'animejs';
import { cn } from '@/lib/utils';

// Props for the image comparison component
interface ImageComparisonProps {
    image1: string;
    image2: string;
    imageClassName?: string;
    hover?: boolean;
    autoplay?: boolean;
    autoplayDuration?: number;
    initPosition?: number;
    width?: number;
    height?: number;
    slideMode?: 'hover' | 'drag';
    showHandlebar?: boolean;
    handlebarStyle?: 'default' | 'glass';
}

export default function ImageComparisonComponent({ 
    image1,
    image2,
    imageClassName = '',
    hover = true,
    autoplay = false,
    autoplayDuration = 5000,
    initPosition = 50,
    width = 400,
    height = 400,
    slideMode = 'hover',
    showHandlebar = true,
    handlebarStyle = 'default'
}: ImageComparisonProps) {
    // Track slider position and interaction states
    const [sliderPosition, setSliderPosition] = useState(initPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [mouseY, setMouseY] = useState<number | null>(null);
    
    // Refs for DOM elements and animations
    const containerRef = useRef<HTMLDivElement>(null);
    const autoplayAnimationRef = useRef<anime.AnimeInstance | null>(null);
    const handlebarRef = useRef<HTMLDivElement>(null);

    // Compute cursor style based on interaction state
    const getCursorStyle = useCallback(() => 
        isDragging ? 'grabbing' : hover ? 'col-resize' : 'grab'
    , [isDragging, hover]);

    // Start autoplay animation sequence
    const startAutoplay = useCallback(() => {
        if (!autoplay || !containerRef.current) return;

        // Create timeline for smooth transitions between positions
        const target = { value: initPosition };
        const tl = anime.timeline({
            loop: true,
            duration: autoplayDuration,
            easing: 'linear',
            update: () => {
                setSliderPosition(target.value);
            }
        });

        // Add animation sequence: init position -> right -> left -> init position
        tl.add({
            targets: target,
            value: 100,
            duration: autoplayDuration / 3
        })
        .add({
            targets: target,
            value: 0,
            duration: autoplayDuration / 3
        })
        .add({
            targets: target,
            value: initPosition,
            duration: autoplayDuration / 3
        });

        autoplayAnimationRef.current = tl;
        tl.play();
    }, [autoplay, autoplayDuration, initPosition]);

    // Initialize and cleanup autoplay animation
    useEffect(() => {
        if (autoplay) {
            startAutoplay();
        }
        return () => {
            if (autoplayAnimationRef.current) {
                autoplayAnimationRef.current.pause();
            }
        };
    }, [autoplay, startAutoplay]);

    // Animate slider to target position
    const animateSlider = useCallback((targetPosition: number) => {
        anime({
            targets: { value: sliderPosition },
            value: targetPosition,
            duration: 150,
            easing: 'easeOutQuad',
            update: (anim) => {
                const value = anim.animations[0].currentValue;
                setSliderPosition(typeof value === 'number' ? value : parseFloat(value));
            }
        });
    }, [sliderPosition]);

    // Handle slider movement based on cursor position
    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        
        if ((hover && slideMode === 'hover') || (!hover && isDragging)) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            if (hover && slideMode === 'hover') {
                animateSlider(percent);
            } else {
                setSliderPosition(percent);
            }
        }
    }, [hover, isDragging, animateSlider]);

    // Event handlers for mouse/touch interactions
    const handleMouseEnter = useCallback(() => {
        if (autoplay && autoplayAnimationRef.current) {
            autoplayAnimationRef.current.pause();
        }
    }, [autoplay]);

    const handleMouseLeave = useCallback(() => {
        if (slideMode === 'hover') {
            animateSlider(initPosition);
        }
        if (!hover) {
            setIsDragging(false);
        }
        if (autoplay && autoplayAnimationRef.current) {
            autoplayAnimationRef.current.restart();
        }
        setMouseY(null);
    }, [slideMode, initPosition, hover, autoplay, animateSlider]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        handleMove(e.clientX);
        if (handlebarStyle === 'glass' && handlebarRef.current) {
            const rect = handlebarRef.current.getBoundingClientRect();
            const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
            setMouseY(relativeY);
        }
    }, [handleMove, handlebarStyle]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const handlebar = handlebarRef.current;
        const target = e.target as HTMLElement;
        
        if (!hover && (handlebar?.contains(target) || target.closest('.slider-handle'))) {
            setIsDragging(true);
            handleMove(e.clientX);
        }
    }, [hover, handleMove]);

    const handleMouseUp = useCallback(() => {
        if (!hover) {
            setIsDragging(false);
        }
    }, [hover]);

    // Touch event handlers for mobile support
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const handlebar = handlebarRef.current;
        const target = e.target as HTMLElement;
        
        if (!hover && !autoplay && (handlebar?.contains(target) || target.closest('.slider-handle'))) {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
        }
    }, [hover, autoplay, handleMove]);

    const handleTouchEnd = useCallback(() => {
        if (!hover && !autoplay) {
            setIsDragging(false);
        }
    }, [hover, autoplay]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!hover && !autoplay && isDragging) {
            handleMove(e.touches[0].clientX);
        }
    }, [hover, autoplay, isDragging, handleMove]);

    return (
        // Main container with event handlers
        <div 
            className="p-8 bg-gray-100/50 dark:bg-gray-800/20 rounded-[2rem]"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            role="region"
            aria-label="Image comparison slider"
        >
            {/* Image container */}
            <div
                ref={containerRef}
                className="relative overflow-hidden rounded-xl"
                style={{
                    width,
                    height,
                    cursor: getCursorStyle()
                }}
            >
                {/* Second Image (Background) */}
                <div className="absolute inset-0 select-none">
                    <Image
                        src={image2}
                        alt="After comparison"
                        fill
                        draggable={false}
                        className={cn("object-cover pointer-events-none", imageClassName)}
                    />
                </div>

                {/* First Image (Clipped) */}
                <div 
                    className="absolute inset-0 select-none"
                    style={{
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                    }}
                >
                    <Image
                        src={image1}
                        alt="Before comparison"
                        fill
                        draggable={false}
                        className={cn("object-cover pointer-events-none", imageClassName)}
                    />
                </div>

                {/* Slider Line with Handlebar */}
                <div 
                    ref={handlebarRef}
                    className={cn(
                        "absolute top-0 bottom-0 z-30 slider-handle",
                        handlebarStyle === 'glass' 
                            ? 'w-[2px] bg-white/10 backdrop-blur-sm' 
                            : 'w-0.5 bg-white shadow-lg'
                    )}
                    style={{
                        left: `${sliderPosition}%`,
                        transform: 'translateX(-50%)',
                        cursor: getCursorStyle()
                    }}
                    role="slider"
                    aria-label="Comparison slider"
                    aria-valuenow={sliderPosition}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    {/* Default handlebar style */}
                    {showHandlebar && handlebarStyle === 'default' && (
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center slider-handle"
                            style={{ cursor: getCursorStyle() }}
                        >
                            <div className="w-4 h-4 border-r-2 border-l-2 border-gray-400" />
                        </div>
                    )}

                    {/* Glass handlebar style with glow effect */}
                    {showHandlebar && handlebarStyle === 'glass' && (
                        <>
                            {/* Glass handle */}
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-8 rounded-full slider-handle"
                                style={{
                                    cursor: getCursorStyle(),
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    zIndex: 1
                                }}
                            />
                            {mouseY !== null && (
                                <>
                                    {/* Glow effect layers */}
                                    {[
                                        {
                                            width: '20px',
                                            height: '480px',
                                            gradient: '50% 50%',
                                            colors: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)'],
                                            stops: [0, 40, 70],
                                            blur: '3px',
                                            opacity: 0.7
                                        },
                                        {
                                            width: '14px',
                                            height: '400px',
                                            gradient: '40% 40%',
                                            colors: ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'],
                                            stops: [0, 50, 80],
                                            blur: '2px',
                                            opacity: 0.8
                                        },
                                        {
                                            width: '8px',
                                            height: '320px',
                                            gradient: '30% 30%',
                                            colors: ['rgba(255,255,255,1)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)'],
                                            stops: [0, 30, 70],
                                            blur: '0.5px',
                                            opacity: 1
                                        }
                                    ].map((layer, index) => (
                                        <div 
                                            key={index}
                                            className="absolute left-1/2 pointer-events-none"
                                            style={{
                                                top: `${mouseY}%`,
                                                width: layer.width,
                                                height: layer.height,
                                                transform: 'translate(-50%, -50%)',
                                                background: `
                                                    radial-gradient(
                                                        ${layer.gradient} at center,
                                                        ${layer.colors[0]} ${layer.stops[0]}%,
                                                        ${layer.colors[1]} ${layer.stops[1]}%,
                                                        ${layer.colors[2]} ${layer.stops[2]}%,
                                                        transparent 100%
                                                    )
                                                `,
                                                filter: `blur(${layer.blur})`,
                                                opacity: layer.opacity
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
