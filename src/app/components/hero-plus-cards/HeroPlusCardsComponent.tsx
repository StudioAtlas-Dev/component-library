import { IconType } from 'react-icons';
import { ServiceCard } from '@/components/ui/ServiceCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ServiceCardData {
  icon: IconType;
  title: string;
  description: string;
}

interface HeroPlusCardsProps {
  tagline?: string;
  title?: string;
  buttonText?: string;
  buttonHref?: string;
  heroImage?: string;
  cards: ServiceCardData[];
  backgroundColor?: string;
  popColor?: string;
}

export default function HeroPlusCardsComponent({
  tagline = 'ELEVATE YOUR BUSINESS',
  title = 'Transform Your Performance With Our Solutions',
  buttonText = 'Get Started',
  buttonHref = '#',
  heroImage = '/images/design-hero.jpg',
  cards,
  backgroundColor = '#ffffff',
  popColor = '#007acc'
}: HeroPlusCardsProps) {
  // Validate cards length
  if (cards.length < 2 || cards.length > 8) {
    throw new Error('Cards array must contain between 2 and 8 items');
  }

  return (
    <section 
      className="w-full min-h-screen relative overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-[70vh] flex items-center justify-center"
        role="banner"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Hero section background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Darkening Overlay - 50% black */}
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-16">
          <SectionTitle
            tagline={tagline}
            title={title}
            className="md:pt-0 pt-0"
            titleClassName="text-4xl md:text-5xl lg:text-6xl text-white"
            taglineClassName="tracking-widest text-white"
            description=""
            popColor={popColor}
            titleId="hero-title"
          />
          <div className="mt-8">
            <ProgressiveButton
              href={buttonHref}
              variant="default"
              size="lg"
              className="rounded-md"
              style={{ backgroundColor: popColor }}
              hoverEffect="reveal-arrow"
              aria-label={buttonText}
            >
              {buttonText}
            </ProgressiveButton>
          </div>
        </div>

        {/* Bottom Border using popColor */}
        <div 
          className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-neutral-200"
          aria-hidden="true"
        />
      </div>

      {/* Cards Section */}
      <div 
        className="w-full bg-white dark:bg-neutral-900"
        role="region"
        aria-label="Services"
      >
        <div className="max-w-9xl mx-auto">
          <div 
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2",
              cards.length <= 4 
                ? `lg:grid-cols-${cards.length}` 
                : "lg:grid-cols-4"
            )}
          >
            {cards.map((card, index) => (
              <ServiceCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                className="bg-white dark:bg-neutral-900"
                popColor={popColor}
                iconAnimation="icon-360"
                cardAnimation="thicken-border"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
