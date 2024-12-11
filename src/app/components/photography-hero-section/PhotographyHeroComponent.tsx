import Image from 'next/image';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import SectionTitle from '@/components/ui/SectionTitle';

interface HeroProps {
  tagline?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  hours?: {
    weekdays: string;
    saturday: string;
  };
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
  backgroundColor = '#f6f7f9',
  popColor = '#46857f'
}: HeroProps) {
  return (
    <section className="w-full md:min-h-screen overflow-visible" style={{ backgroundColor }}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 px-4 md:px-8 pt-8 pb-16">
        {/* Left side images */}
        <div className="col-span-1 md:col-span-5 relative h-[350px] md:h-auto order-1 md:order-none">
          <div className="absolute left-[10%] sm:top-0 sm:left-[5%] lg:left-0 sm:w-[300px] w-[250px] md:w-[60%] min-w-[200px] aspect-[3/4] z-10">
            <div className="relative w-full h-full border-white border-[8px] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Image 
                src="/images/vert-placeholder.png" 
                alt="Featured photography work showcasing our artistic style" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
          <div className="absolute top-[70%] right-[10%] sm:top-[30%] sm:right-[5%] md:right-0 sm:w-[300px] w-[250px] min-w-[200px] md:w-[60%] aspect-[3/4]">
            <div className="relative w-full h-full border-white border-[8px] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Image 
                src="/images/vert-placeholder.png" 
                alt="Additional photography work highlighting our portfolio" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center text-center sm:text-left items-center sm:items-start order-2 md:order-none mt-[250px] md:mt-0 lg:mt-16">
          <SectionTitle
            tagline={tagline}
            title={title}
            titleClassName="text-3xl lg:text-5xl md:text-3xl "
            description={description}
            popColor={popColor}
            alignLeft
            className="mb-8"
          />
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <ProgressiveButton
              href="#"
              variant="default"
              size="lg"
              className="rounded-md"
              style={{ backgroundColor: popColor }}
              hoverEffect="slide"
            >
              {buttonText}
            </ProgressiveButton>
            <div className="flex flex-col gap-1" role="complementary" aria-label="Business Hours">
              <span className="text-sm font-medium">{hours.weekdays}</span>
              <span className="text-sm font-medium">{hours.saturday}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

