"use client";

import { useState, useEffect, useCallback, useRef, MouseEvent } from "react";
import Image from "next/image";

interface Location {
    location: string;
    images: string[];
}

interface TourGalleryComponentProps {
    locations: Location[];
    menuColor: string; // used for the sidebar background
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

    // Refs for handling outside clicks
    const sidebarRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    // Initialize the selected location
    useEffect(() => {
        if (locations.length > 0) {
            setSelectedLocation(locations[0]);
        }
    }, [locations]);

    // Close the menu if clicking outside the sidebar and toggle button.
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    // Keyboard navigation for images
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

    // When a location is clicked:
    // - On mobile (viewport width < 768px) close the menu,
    // - On desktop leave the menu open.
    const handleLocationClick = (location: Location) => {
        setSelectedLocation(location);
        setCurrentImageIndex(0);
        if (window.innerWidth < 768) {
            setIsMenuOpen(false);
        }
    };

    return (
        // Outer container fills the viewport and centers the gallery container.
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* Gallery container – min-height forces enough room on mobile */}
            <div
                ref={containerRef}
                className="relative w-full max-w-5xl bg-white shadow-lg overflow-hidden min-h-screen md:min-h-auto"
            >
                {/* Toggle button placed outside the sidebar.
            On mobile: always anchored 5px from the right (right-5).
            On desktop: when open, left-[155px] (sidebar 150px + 5px); when closed, left-[5px]. */}
                <button
                    ref={toggleButtonRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen((prev) => !prev);
                    }}
                    aria-label="Toggle menu"
                    className={`absolute z-30 top-4 
            right-5 md:right-auto 
            ${isMenuOpen ? "md:left-[155px]" : "md:left-[5px]"}
            bg-black text-white px-3 py-2 rounded-md focus:outline-none`}
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                {/* Main content: image container with fixed (landscape) aspect ratio */}
                <div className="relative">
                    <div className="relative w-full aspect-video bg-black overflow-hidden">
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

                    {/* Sidebar / Navigation menu */}
                    <aside
                        ref={sidebarRef}
                        // Mobile: full width; Desktop: fixed width of ~150px.
                        className={`absolute top-0 bottom-0 left-0 transition-transform duration-300 z-20 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                            } w-full md:w-[150px]`}
                        style={{ backgroundColor: menuColor }}
                    >
                        {/* Smaller logo in the sidebar */}
                        <div className="p-3 border-b border-white/30">
                            <Image
                                src={logo}
                                alt="Gallery logo"
                                width={75}
                                height={40}
                                objectFit="contain"
                            />
                        </div>
                        {/* Location buttons */}
                        <nav className="p-3" aria-label="Tour locations">
                            {locations.map((location) => (
                                <button
                                    key={location.location}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLocationClick(location);
                                    }}
                                    aria-current={location.location === selectedLocation.location}
                                    className={`block w-full text-left py-2 px-3 mb-2 rounded transition-colors focus:outline-none ${location.location === selectedLocation.location
                                            ? "bg-white/30 text-white"
                                            : "hover:bg-white/20 text-white"
                                        }`}
                                >
                                    {location.location}
                                </button>
                            ))}
                        </nav>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TourGalleryComponent;
