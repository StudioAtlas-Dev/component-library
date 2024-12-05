import Image from 'next/image';
import Link from 'next/link';
import { Button, ButtonHoverEffect } from '@/components/ui/button';

export const metadata = {
  name: 'Photography Hero',
  type: 'Section Component',
  description: 'A hero section designed for photography websites',
  tags: ['layout', 'hero', 'light'],
  dateAdded: '2024-12-05'
};

interface HeroProps {
  tagline?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  hours?: {
    weekdays: string;
    saturday: string;
  };
  hoverEffect?: ButtonHoverEffect;
}

export default function PhotographyHeroComponent({
  tagline = 'CRAFTING STORIES, ONE FRAME AT A TIME',
  title = 'Turn Ordinary Moments into Extraordinary Memories',
  description = 'At PhotoReal, we empower you to preserve life\'s most precious moments. Our expert team offers personalized photography services, workshops, and resources to help you elevate your creative skills. Whether you\'re capturing milestones or creating visual art, we\'re here to guide your journey.',
  buttonText = 'Get Started',
  hours = {
    weekdays: 'MON - FRI: 10AM - 6PM',
    saturday: 'SATURDAY: 10AM - 4PM'
  },
  hoverEffect = 'slide'
}: HeroProps) {
  return (
    <section className="w-full bg-[#f6f7f9] sm:min-h-screen overflow-visible">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-12 gap-16 sm:gap-8 px-4 sm:px-8 pt-8 pb-16">
        {/* Left side images */}
        <div className="col-span-1 sm:col-span-5 relative h-[400px] sm:h-auto order-1 sm:order-none">
          <div className="absolute top-0 left-0 w-[60%] aspect-[3/4] z-10">
            <div className="relative w-full h-full border-white border-[8px] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Image src="/images/vert-placeholder.png" alt="Placeholder" fill />
            </div>
          </div>
          <div className="absolute top-[30%] right-0 w-[60%] aspect-[3/4]">
            <div className="relative w-full h-full border-white border-[8px] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Image src="/images/vert-placeholder.png" alt="Placeholder" fill />
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="col-span-1 sm:col-span-7 sm:pl-8 flex flex-col justify-center mt-4 sm:mt-20 order-2 sm:order-none">
          <span className="text-[#46857f] text-sm font-medium tracking-wider mb-4">
            {tagline}
          </span>
          <h1 className="text-[2.75rem] leading-tight font-bold text-[#1A1A1A] mb-6">
            {title}
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl">
            {description}
          </p>
          <div className="space-y-2 mb-8">
            <p className="text-gray-700 font-medium">{hours.weekdays}</p>
            <p className="text-gray-700 font-medium">{hours.saturday}</p>
          </div>
          <div className="flex">
            <Button 
              size="custom" 
              bgColor="#46857f"
              hoverEffect={hoverEffect}
              className="flex-1 sm:flex-initial"
            >
              <span>{buttonText}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
