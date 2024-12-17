'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import anime from 'animejs';

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
    const [sliderPosition, setSliderPosition] = useState(initPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [mouseY, setMouseY] = useState<number | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const autoplayAnimationRef = useRef<anime.AnimeInstance | null>(null);
    const handlebarRef = useRef<HTMLDivElement>(null);
    const lightAnimationRef = useRef<anime.AnimeInstance | null>(null);

    const startAutoplay = useCallback(() => {
        if (!autoplay || !containerRef.current) return;

        const target = { value: initPosition };
        const tl = anime.timeline({
            loop: true,
            duration: autoplayDuration,
            easing: 'linear',
            update: () => {
                setSliderPosition(target.value);
            }
        });

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
            <div
                ref={containerRef}
                className="relative overflow-hidden rounded-xl"
                style={{
                    width: width,
                    height: height,
                    cursor: isDragging ? 'grabbing' : hover ? 'col-resize' : 'default'
                }}
            >
                {/* Second Image (Background) */}
                <div className="absolute inset-0 select-none">
                    <Image
                        src={image2}
                        alt="After comparison"
                        fill
                        draggable={false}
                        className={`object-cover pointer-events-none ${imageClassName}`}
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
                        className={`object-cover pointer-events-none ${imageClassName}`}
                    />
                </div>

                {/* Slider Line */}
                <div 
                    ref={handlebarRef}
                    className={`absolute top-0 bottom-0 z-30 slider-handle ${
                        handlebarStyle === 'glass' 
                            ? 'w-[2px] bg-white/10 backdrop-blur-sm' 
                            : 'w-0.5 bg-white shadow-lg'
                    }`}
                    style={{
                        left: `${sliderPosition}%`,
                        transform: 'translateX(-50%)',
                        cursor: hover ? 'col-resize' : 'grab'
                    }}
                    role="slider"
                    aria-label="Comparison slider"
                    aria-valuenow={sliderPosition}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    {showHandlebar && handlebarStyle === 'default' && (
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center slider-handle"
                            style={{
                                cursor: hover ? 'col-resize' : isDragging ? 'grabbing' : 'grab'
                            }}
                        >
                            <div className="w-4 h-4 border-r-2 border-l-2 border-gray-400" />
                        </div>
                    )}
                    {showHandlebar && handlebarStyle === 'glass' && (
                        <>
                            {/* Glass handle */}
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-8 rounded-full slider-handle"
                                style={{
                                    cursor: hover ? 'col-resize' : isDragging ? 'grabbing' : 'grab',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    zIndex: 1
                                }}
                            />
                            {/* Enhanced glow effect that follows cursor */}
                            {mouseY !== null && (
                                <>
                                    {/* Outer glow */}
                                    <div 
                                        className="absolute left-1/2 pointer-events-none"
                                        style={{
                                            top: `${mouseY}%`,
                                            width: '20px',
                                            height: '480px',
                                            transform: 'translate(-50%, -50%)',
                                            background: `
                                                radial-gradient(
                                                    50% 50% at center,
                                                    rgba(255,255,255,0.12) 0%,
                                                    rgba(255,255,255,0.08) 40%,
                                                    rgba(255,255,255,0.04) 70%,
                                                    transparent 100%
                                                )
                                            `,
                                            filter: 'blur(3px)',
                                            opacity: 0.7
                                        }}
                                    />
                                    {/* Middle glow */}
                                    <div 
                                        className="absolute left-1/2 pointer-events-none"
                                        style={{
                                            top: `${mouseY}%`,
                                            width: '14px',
                                            height: '400px',
                                            transform: 'translate(-50%, -50%)',
                                            background: `
                                                radial-gradient(
                                                    40% 40% at center,
                                                    rgba(255,255,255,0.25) 0%,
                                                    rgba(255,255,255,0.15) 50%,
                                                    rgba(255,255,255,0.05) 80%,
                                                    transparent 100%
                                                )
                                            `,
                                            filter: 'blur(2px)',
                                            opacity: 0.8
                                        }}
                                    />
                                    {/* Core glow */}
                                    <div 
                                        className="absolute left-1/2 pointer-events-none"
                                        style={{
                                            top: `${mouseY}%`,
                                            width: '8px',
                                            height: '320px',
                                            transform: 'translate(-50%, -50%)',
                                            background: `
                                                radial-gradient(
                                                    30% 30% at center,
                                                    rgba(255,255,255,1) 0%,
                                                    rgba(255,255,255,0.7) 30%,
                                                    rgba(255,255,255,0.3) 70%,
                                                    transparent 100%
                                                )
                                            `,
                                            filter: 'blur(0.5px)',
                                            opacity: 1
                                        }}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
