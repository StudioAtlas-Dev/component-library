import Image from 'next/image';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';

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
  description = 'At Brewed, we\’re more than just coffee — we\’re a commitment to sustainability, community, and quality. From ethically sourced beans to eco-friendly practices, every cup we serve supports our mission to care for the planet and the people who call it home. We believe that great coffee brings people together, and we\’re proud to create a space where connection, purpose, and flavor meet.',
  buttonText = 'Reserve Your Table',
  backgroundColor = '#f6f7f9',
  popColor = '#ff5733'
}: OurStoryProps) {
  return (
    <section className="w-full min-h-screen lg:h-screen" style={{ backgroundColor }}>
      <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-8 py-16">
        {/* Content */}
        <div className="flex flex-col lg:mt-[10vh] order-2 lg:order-1">
          <h3 
            className="font-medium tracking-wide mb-4" 
            role="heading" 
            aria-level={1}
            aria-label="Company story section"
            style={{ color: popColor }}
          >
            {tagline}
          </h3>
          <h2 
            className="text-5xl sm:text-6xl font-bold mb-6"
            role="heading"
            aria-level={2}
          >
            {title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-xl">
            {description}
          </p>
          <div>
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
          </div>
        </div>

        {/* Image Container */}
        <div className="relative flex items-start justify-center order-1 lg:order-2 lg:mt-[10vh]">
          <div className="relative w-[70%] md:w-[90%] aspect-square md:aspect-auto md:h-[400px]">
            {/* Main Image */}
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Image
                src="/images/square-placeholder.png"
                alt="Team members working together in our workspace"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            
            {/* Branded Circle Overlay */}
            <div className="absolute right-[10%] top-[100%] -translate-y-1/2 md:-left-[15%] md:top-1/2 md:-translate-y-1/2 aspect-square w-[35%] md:w-[30%] rounded-full border-8 border-white overflow-hidden shadow-lg">
              <Image
                src="/images/branded-placeholder.png"
                alt="Company brand mark highlighting our identity"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 30vw, 15vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
