'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface FeatureCard {
  image: string;
  title: string;
  description: string;
}

interface GymHeroProps {
  tagline?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  backgroundColor?: string;
  popColor?: string;
  cards?: FeatureCard[];
}

export default function GymHeroComponent({
  tagline = 'BEST GYM OF THE CITY FOR FITNESS',
  title = 'YOU CAN BOOST YOUR STRENGTH',
  description = 'Develop confidence, composure under pressure and the discipline needed to live a review. This is the style you\'ve been looking for.',
  buttonText = 'Learn More',
  backgroundColor = '#f5f5f5',
  popColor = '#ff0000',
  cards = [
    {
      image: '/images/gym-join.jpg',
      title: 'Get GYM Membership',
      description: 'We provide some of the finest quality, most innovative fitness equipment and services in the market.'
    },
    {
      image: '/images/gym-instructor.jpg',
      title: 'Be a GYM Instructor',
      description: 'We are here to help you with nutritional perfection, motivation for a positive path healthy diet and regular.'
    }
  ]
}: GymHeroProps) {
  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* Background Image - positioned absolutely */}
      <div className="absolute top-0 left-0 w-full h-[100vh] md:h-[80vh]">
        <Image
          src="/images/gym-hero.jpg"
          alt="Gym Hero Background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content - fixed height */}
      <div className="relative h-[80vh] w-full">
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full pb-32">
            <p className="text-sm font-bold tracking-wider mb-4" style={{ color: popColor }}>
              {tagline}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-2xl">
              {title}
            </h1>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl">
              {description}
            </p>
            <Button 
              size="lg"
              className="w-fit overflow-hidden"
              style={{ backgroundColor: popColor }}
              hoverEffect="reveal-arrow"
            >
              <span className="relative z-10">
                {buttonText}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Cards - same position regardless of background */}
      <div className="relative -mt-32 mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-row md:flex-row"
                style={{ backgroundColor: backgroundColor }}
              >
                {/* Image container - make it smaller on mobile */}
                <div className="relative h-32 md:h-auto w-1/3 md:w-2/5 md:min-h-[240px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                </div>
                {/* Content container - more compact on mobile */}
                <div className="p-4 md:p-8 w-2/3 md:w-3/5 flex flex-col">
                  <div className="flex-grow md:flex md:flex-col md:justify-between">
                    <div className="text-left">
                      <h3 className="text-lg md:text-xl font-semibold">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm md:text-base hidden md:block">{card.description}</p>
                    </div>
                    <div className="mt-2 md:mt-4">
                      <span 
                        className="text-sm md:text-base font-medium cursor-pointer hover:underline"
                        style={{ color: popColor }}
                      >
                        Join Today
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 