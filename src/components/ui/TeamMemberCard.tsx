'use client'

import Image from 'next/image';
import { IoArrowForward, IoClose } from 'react-icons/io5';
import { useTeam } from '@/app/components/meet-the-team-expandable/TeamContext';
import anime from 'animejs';
import { useEffect, useRef, useState } from 'react';

interface TeamMemberCardProps {
  id: string;
  name: string;
  title: string;
  specialties: string;
  imageUrl: string;
  alt: string;
  professionalBackground: string;
  expertise: string;
  popColor: string;
}

export const TeamMemberCard = ({
  id,
  name,
  title,
  specialties,
  imageUrl,
  alt,
  professionalBackground,
  expertise,
  popColor,
}: TeamMemberCardProps) => {
  const { expandedId, setExpandedId, isAnyExpanded } = useTeam();
  const isExpanded = expandedId === id;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (cardRef.current) {
      const iconElement = cardRef.current.querySelector('.expand-icon');
      
      if (iconElement instanceof HTMLElement) {
        iconElement.style.willChange = 'transform';
      }

      const animation = anime({
        targets: iconElement,
        scale: [1, 1.2, 1],
        translateX: [0, 5, 0],
        duration: 1200,
        easing: 'easeInOutQuad',
        loop: true,
        autoplay: false,
        direction: 'alternate'
      });

      // Initialize the state
      anime.set(iconElement, {
        scale: 1,
        translateX: 0
      });

      const handleHover = () => {
        if (window.innerWidth >= 1024) {
          animation.play();
          setIsHovering(true);
        }
      };

      const handleLeave = () => {
        animation.pause();
        animation.seek(0);
        setIsHovering(false);
      };

      const element = cardRef.current;
      element.addEventListener('mouseenter', handleHover);
      element.addEventListener('mouseleave', handleLeave);

      return () => {
        animation.pause();
        if (iconElement instanceof HTMLElement) {
          iconElement.style.willChange = 'auto';
        }
        element.removeEventListener('mouseenter', handleHover);
        element.removeEventListener('mouseleave', handleLeave);
      };
    }
  }, []);

  return (
    <>
      {isHovering && !isExpanded && (
        <div className="hidden">
          <Image
            src={imageUrl}
            alt=""
            width={240}
            height={320}
            priority
          />
        </div>
      )}
      
      <div 
        ref={cardRef}
        className={`
          bg-white border border-gray-100 cursor-pointer relative
          before:absolute before:inset-0 before:border-2 before:border-transparent before:transition-all before:duration-300
          hover:before:border-gray-300
          ${isExpanded ? 
            'col-span-2 row-span-4 lg:row-span-2 lg:col-span-4 z-50 transition-all duration-500 ease-in-out group rounded-lg lg:rounded-none lg:overflow-hidden' : 
            'col-span-1 transition-all duration-250 ease-in-out group'
          }
          ${!isExpanded && isAnyExpanded ? 'hidden' : ''}
        `}
        role="article"
        aria-label={`Team member ${name}`}
        aria-expanded={isExpanded}
        onClick={() => setExpandedId(isExpanded ? null : id)}
      >
        {!isExpanded && (
          <>
            <div className="p-4 sm:p-6">
            <h3 className={`text-base sm:text-lg  xl:text-xl font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-[${popColor}]`}>
                {name}
              </h3>
              <p className="text-sm sm:text-md text-gray-600 mb-2">{title}</p>
              <p className="text-xs sm:text-sm text-gray-500">{specialties}</p>
            </div>
            <div className="absolute top-[5px] right-[5px] rotate-[-45deg]">
              <IoArrowForward 
                className={`expand-icon text-gray-400 text-lg sm:text-xl transition-colors duration-300 group-hover:text-[${popColor}]`}
                aria-label="Expand details"
              />
            </div>
          </>
        )}

        {isExpanded && (
          <div className="h-full grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <div className="flex justify-center items-start mt-2 ml-5 lg:m-0">
              <div className="relative aspect-[3/4] w-full max-w-[240px]">
                <Image
                  src={imageUrl}
                  alt={`${name}, ${title} - ${specialties}`}
                  fill
                  className="object-cover object-center rounded-lg lg:rounded-none drop-shadow-xl lg:drop-shadow-none"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  quality={95}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center lg:justify-start h-full p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1 lg:space-y-2">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-800">{name}</h2>
                  <p className="text-sm lg:text-lg text-gray-600">{title}</p>
                  <p className="text-xs lg:text-md text-gray-500">{specialties}</p>
                </div>
              </div>
            </div>

            <div className="pl-6 pr-3 mt-2 ml-5 lg:m-0 space-y-2 lg:space-y-4 lg:pt-6 max-h-full">
              <h3 className="text-md lg:text-lg font-bold text-gray-800">Professional Background</h3>
              <div className="overflow-y-auto h-[calc(100%-2rem)]">
                <p className="text-sm lg:text-base text-gray-600">{professionalBackground}</p>
              </div>
            </div>

            <div className="pl-3 pr-6 mt-2 lg:m-0 space-y-2 lg:space-y-4 lg:pt-6 max-h-full">
              <h3 className="text-md lg:text-lg font-bold text-gray-800">Expertise & Approach</h3>
              <div className="overflow-y-auto h-[calc(100%-2rem)]">
                <p className="text-sm lg:text-base text-gray-600">{expertise}</p>
              </div>
            </div>

            <div className="absolute top-6 right-6">
              <IoClose 
                className={`text-gray-400 text-xl lg:text-2xl transition-colors duration-300 group-hover:text-[${popColor}]`}
                aria-label="Close details"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 