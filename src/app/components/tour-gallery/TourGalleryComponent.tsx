"use client";

import { useState, useEffect, useCallback, useRef, MouseEvent } from "react";
import Image from "next/image";

interface Location {
    location: string;
    images: string[];
}

interface TourGalleryComponentProps {
    locations: Location[];
    menuColor: string;
    logo: string;
}

const TourGalleryComponent = ({
    locations,
    menuColor,
    logo,
}: TourGalleryComponentProps) => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sidebarRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (locations.length > 0) {
            setSelectedLocation(locations[0]);
        }
    }, [locations]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | globalThis.MouseEvent) => {
            if (
                isMenuOpen &&
                containerRef.current &&
                !sidebarRef.current?.contains(e.target as Node) &&
                !toggleButtonRef.current?.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const handleNextImage = useCallback(() => {
        if (selectedLocation) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedLocation.images.length);
        }
    }, [selectedLocation]);

    const handlePrevImage = useCallback(() => {
        if (selectedLocation) {
            setCurrentImageIndex((prev) =>
                (prev - 1 + selectedLocation.images.length) % selectedLocation.images.length
            );
        }
    }, [selectedLocation]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "ArrowRight") handleNextImage();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handlePrevImage, handleNextImage]);

    useEffect(() => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;

        let animationPlayed = sessionStorage.getItem("scrollAnimationPlayed");

        if (!animationPlayed) {
            const scrollDistance = container.scrollWidth - container.clientWidth;

            const animateScroll = async () => {
                container.scrollTo({ left: scrollDistance, behavior: "smooth" });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                container.scrollTo({ left: 0, behavior: "smooth" });
            };

            animateScroll();
            sessionStorage.setItem("scrollAnimationPlayed", "true");
        }
    }, []);

    if (!locations || locations.length === 0) {
        return (
            <div className="p-8 text-center">
                <p>No locations available</p>
            </div>
        );
    }

    if (!selectedLocation) return null;

    const hasImages = selectedLocation.images.length > 0;
    const showNavigation = selectedLocation.images.length > 1;

    const handleLocationClick = (location: Location) => {
        setSelectedLocation(location);
        setCurrentImageIndex(0);
        if (window.innerWidth < 768) {
            setIsMenuOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full items-center justify-center max-w-5xl bg-white overflow-hidden min-h-[600px] md:min-h-auto">
            <button
                ref={toggleButtonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen((prev) => !prev);
                }}
                aria-label="Toggle menu"
                className={`absolute z-30 top-4 transition-all duration-300
                        right-5 md:right-auto
                        ${isMenuOpen ? "md:left-[155px]" : "md:left-[5px]"}
                        bg-black text-white px-3 py-2 rounded-md focus:outline-none`}
            >
                {isMenuOpen ? "✕" : "☰"}
            </button>

            <div className="relative">
                <div className="hidden rounded-xl md:block relative w-full aspect-video bg-black overflow-hidden">
                    {hasImages ? (
                        <>
                            {showNavigation && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrevImage();
                                        }}
                                        aria-label="Previous image"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full focus:outline-none"
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextImage();
                                        }}
                                        aria-label="Next image"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full focus:outline-none"
                                    >
                                        &gt;
                                    </button>
                                </>
                            )}
                            <Image
                                src={selectedLocation.images[currentImageIndex]}
                                alt={`${selectedLocation.location} - Image ${currentImageIndex + 1}`}
                                layout="fill"
                                objectFit="contain"
                                objectPosition="center"
                                priority
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-xl">
                            No images available for this location
                        </div>
                    )}
                </div>

                <div ref={scrollContainerRef} className="block md:hidden relative h-[400px] overflow-x-auto">
                    {hasImages ? (
                        <div className="relative h-full w-[150vw]">
                            <Image
                                src={selectedLocation.images[currentImageIndex]}
                                alt={`${selectedLocation.location} - Image ${currentImageIndex + 1}`}
                                layout="fill"
                                objectFit="cover"
                                objectPosition="center"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-xl">
                            No images available for this location
                        </div>
                    )}
                </div>

                <aside
                    ref={sidebarRef}
                    className={`absolute top-0 bottom-0 left-0 transition-transform duration-300 overflow-hidden z-20 rounded-l-xl
                            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} w-full md:w-[200px]`}
                    style={{ backgroundColor: menuColor }}
                >
                    <div className="p-3 border-b border-white/30">
                        <Image src={logo} alt="Gallery logo" width={75} height={40} objectFit="contain" />
                    </div>
                    <nav className="p-2" aria-label="Tour locations">
                        {locations.map((location) => (
                            <button
                                key={location.location}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLocationClick(location);
                                }}
                                aria-current={location.location === selectedLocation.location}
                                className={`block w-full text-left rounded transition-colors focus:outline-none
                                        ${location.location === selectedLocation.location
                                        ? "bg-white/30 text-white"
                                        : "hover:bg-white/20 text-white"} 
                                        md:text-base text-sm py-1 px-2 mb-1`}
                            >
                                {location.location}
                            </button>
                        ))}
                    </nav>
                </aside>
            </div>
        </div>
    );
};

export default TourGalleryComponent;
