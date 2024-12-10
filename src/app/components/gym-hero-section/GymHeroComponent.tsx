import Image from 'next/image';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import SectionTitle from '@/components/ui/SectionTitle';

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
  buttonHref?: string;
  backgroundColor?: string;
  popColor?: string;
  cards?: FeatureCard[];
}

export default function GymHeroComponent({
  tagline = 'PREMIER FITNESS DESTINATION',
  title = 'TRANSFORM YOUR POTENTIAL',
  description = 'Unlock your true strength, build lasting confidence, and achieve the results you\'ve always wanted. Experience fitness redefined with our state-of-the-art facilities and expert guidance.',
  buttonText = 'Start Your Journey',
  buttonHref = '#',
  backgroundColor = '#f5f5f5',
  popColor = '#ff0000',
  cards = [
    {
      image: '/images/gym-join.jpg',
      title: 'Join Our Community',
      description: 'Access premium equipment, personalized training programs, and a motivating atmosphere designed to help you reach your fitness goals.'
    },
    {
      image: '/images/gym-instructor.jpg',
      title: 'Join Our Team',
      description: 'Looking for passionate fitness professionals to inspire and guide our members. Turn your fitness passion into a rewarding career.'
    }
  ]
}: GymHeroProps) {
  return (
    <section 
      className="relative w-full bg-white min-h-[100vh] overflow-hidden"
      role="region"
      aria-label="Gym hero section"
    >
      {/* Background Image - positioned absolutely */}
      <div className="absolute top-0 left-0 w-full h-[100vh] md:h-[80vh]">
        <Image
          src="/images/gym-hero.jpg"
          alt="Fitness enthusiasts working out in our modern gym facility"
          fill
          className="object-cover brightness-50"
          sizes="100vw"
          priority
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content - fixed height */}
      <div className="relative h-[80vh] w-full">
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:text-left text-center">
          <div className="flex flex-col justify-center h-full pb-32">
            <SectionTitle
              tagline={tagline}
              title={title}
              taglineClassName="tracking-widest"
              titleClassName="text-4xl md:text-6xl max-w-2xl"
              alignLeft
              dark
              description={description}
              popColor={popColor}
              className="mb-8"
            />
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <ProgressiveButton  
                href={buttonHref}
                variant="default"
                size="lg"
                className="rounded-md"
                style={{ backgroundColor: popColor }}
                hoverEffect="reveal-arrow"
              >
                {buttonText}
              </ProgressiveButton>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative -mt-32 mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            role="list"
            aria-label="Membership options"
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-row md:flex-row"
                style={{ backgroundColor: backgroundColor }}
                role="listitem"
              >
                <div className="relative h-32 md:h-auto w-1/3 md:w-2/5 md:min-h-[240px]">
                  <Image
                    src={card.image}
                    alt={`${card.title} - ${card.description}`}
                    fill
                    className="object-cover rounded-l-lg"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 md:p-8 w-2/3 md:w-3/5 flex flex-col">
                  <div className="flex-grow md:flex md:flex-col md:justify-between">
                    <div className="text-left">
                      <h3 
                        className="text-lg md:text-xl font-semibold"
                        role="heading"
                        aria-level={3}
                      >
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm md:text-base hidden md:block">
                        {card.description}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-4">
                      <span 
                        className="text-sm md:text-base font-medium cursor-pointer hover:underline"
                        style={{ color: popColor }}
                        role="button"
                        aria-label={`Join ${card.title.toLowerCase()}`}
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
    </section>
  );
} 