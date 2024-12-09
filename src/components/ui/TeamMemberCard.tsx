'use client'

import Image from 'next/image';
import { IoArrowForward, IoClose } from 'react-icons/io5';
import { useTeam } from '@/app/components/meet-the-team-expandable/TeamContext';
import anime from 'animejs';
import { useEffect, useRef } from 'react';

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
  
  useEffect(() => {
    if (cardRef.current) {
      const animation = anime({
        targets: cardRef.current.querySelector('.expand-icon'),
        scale: [1, 1.2, 1],
        duration: 1500,
        easing: 'easeInOutQuad',
        loop: true,
        autoplay: false
      });

      const handleHover = () => {
        animation.play();
      };

      const handleLeave = () => {
        animation.pause();
        animation.seek(0);
      };

      const element = cardRef.current;
      element.addEventListener('mouseenter', handleHover);
      element.addEventListener('mouseleave', handleLeave);

      return () => {
        animation.pause();
        element.removeEventListener('mouseenter', handleHover);
        element.removeEventListener('mouseleave', handleLeave);
      };
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`
        bg-white border border-gray-100 cursor-pointer relative
        before:absolute before:inset-0 before:border-2 before:border-transparent before:transition-all before:duration-300
        hover:before:border-gray-300
        ${isExpanded ? 
          'col-span-4 row-span-2 z-50 transition-all duration-500 ease-in-out group h-[300px]' : 
          'col-span-1 transition-all duration-250 ease-in-out group h-[150px]'
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
          <div className="p-6">
            <h3 
              className={`text-xl font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-[${popColor}]`}
            >
              {name}
            </h3>
            <p className="text-md text-gray-600 mb-2">{title}</p>
            <p className="text-sm text-gray-500">{specialties}</p>
          </div>
          <div className="absolute top-4 right-4 rotate-[-45deg]">
            <IoArrowForward 
              className={`expand-icon text-gray-400 text-xl transition-colors duration-300 group-hover:text-[${popColor}]`}
              aria-label="Expand details"
            />
          </div>
        </>
      )}

      {isExpanded && (
        <div className="h-full grid grid-cols-3 gap-8 p-6 overflow-hidden">
          <div className="relative h-full">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover rounded-lg"
              sizes="33vw"
            />
          </div>

          <div className="col-span-2 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
                <p className="text-lg text-gray-600 mb-1">{title}</p>
                <p className="text-md text-gray-500">{specialties}</p>
              </div>
              <div className="group">
                <IoClose 
                  className={`text-gray-400 text-2xl transition-colors duration-300 group-hover:text-[${popColor}]`}
                  aria-label="Close details"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Background</h3>
                <p className="text-gray-600">{professionalBackground}</p>
              </div>
              <div className="overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expertise & Approach</h3>
                <p className="text-gray-600">{expertise}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 