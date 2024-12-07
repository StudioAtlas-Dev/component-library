import Image from 'next/image';
import Link from 'next/link';
import { Button, ButtonHoverEffect } from '@/components/ui/button';

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
  backgroundColor?: string;
  popColor?: string;
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
  hoverEffect = 'slide',
  backgroundColor = '#f6f7f9',
  popColor = '#46857f'
}: HeroProps) {
  return (
    <section className="w-full sm:min-h-screen overflow-visible" style={{ backgroundColor }}>
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
        <div className="col-span-1 sm:col-span-7 flex flex-col justify-center order-2 sm:order-none">
          <h3 className="font-medium tracking-wide mb-4" style={{ color: popColor }}>
            {tagline}
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            {title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <Button 
              size="custom"
              bgColor={popColor}
              hoverEffect={hoverEffect}
            >
              {buttonText}
            </Button>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{hours.weekdays}</span>
              <span className="text-sm font-medium">{hours.saturday}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

