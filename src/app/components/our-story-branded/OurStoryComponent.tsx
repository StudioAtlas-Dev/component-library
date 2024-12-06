import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const metadata = {
  name: 'Our Story Branded',
  type: 'Section Component',
  description: 'A branded "Our Story" section with image and text layout',
  tags: ['layout', 'light', 'branded'],
  dateAdded: '2024-01-17'
};

interface OurStoryProps {
  tagline?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  backgroundColor?: string;
  popColor?: string;
}

export default function OurStoryComponent({
  tagline = 'OUR STORY',
  title = 'Who We Are',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  buttonText = 'Reserve Your Table',
  backgroundColor = '#f6f7f9',
  popColor = '#ff5733'
}: OurStoryProps) {
  return (
    <section className="w-full min-h-screen lg:h-screen" style={{ backgroundColor }}>
      <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-8 py-16">
        {/* Content */}
        <div className="flex flex-col lg:mt-[10vh] order-2 lg:order-1">
          <h3 className="font-medium tracking-wide mb-4" style={{ color: popColor }}>
            {tagline}
          </h3>
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            {title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-xl">
            {description}
          </p>
          <div>
            <Button 
              size="lg"
              bgColor={popColor}
              hoverEffect="slide"
            >
              {buttonText}
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative flex items-start justify-center order-1 lg:order-2 lg:mt-[10vh]">
          <div className="relative w-[70%] md:w-[90%] aspect-square md:aspect-auto md:h-[400px]">
            {/* Main Image */}
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Image
                src="/images/square-placeholder.png"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Branded Circle Overlay */}
            <div className="absolute right-[10%] top-[100%] -translate-y-1/2 md:-left-[15%] md:top-1/2 md:-translate-y-1/2 aspect-square w-[35%] md:w-[30%] rounded-full border-8 border-white overflow-hidden shadow-lg">
              <Image
                src="/images/branded-placeholder.png"
                alt="Brand Mark"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
