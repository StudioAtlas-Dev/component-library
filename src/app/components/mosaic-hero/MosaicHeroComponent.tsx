import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import SectionTitle from '@/components/ui/SectionTitle';
import Image from 'next/image';

interface MosaicHeroProps {
  tagline?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  backgroundColor?: string;
  popColor?: string;
}

export default function MosaicHeroComponent({
  tagline = 'INNOVATIVE DESIGN',
  title = 'CREATE STUNNING VISUAL EXPERIENCES',
  description = 'Transform your digital presence with our cutting-edge mosaic layouts. Combine aesthetics with functionality for maximum impact.',
  primaryButtonText = 'Get Started',
  primaryButtonHref = '#',
  secondaryButtonText = 'Learn More',
  secondaryButtonHref = '#',
  backgroundColor = '#ffffff',
  popColor = '#3b82f6',
}: MosaicHeroProps) {
  return (
    <section 
      className="relative w-full min-h-[80vh] flex items-center bg-white pb-10"
      style={{ backgroundColor }}
      role="region"
      aria-label="Mosaic hero section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center pt-12">
          {/* Left Column - Content */}
          <div className="flex flex-col space-y-8 order-2 lg:order-1">
            <SectionTitle
              tagline={tagline}
              title={title}
              description={description}
              taglineClassName="tracking-widest text-xs lg:text-sm"
              titleClassName="text-2xl lg:text-4xl"
              descriptionClassName="text-lg"
              alignLeft
              popColor={popColor}
            />
            
            <div className="flex flex-row justify-center lg:justify-start gap-4 mt-4">
              <ProgressiveButton
                href={primaryButtonHref}
                variant="default"
                size="lg"
                className="rounded-md w-fit"
                style={{ backgroundColor: popColor }}
                hoverEffect="reveal-arrow"
              >
                {primaryButtonText}
              </ProgressiveButton>

              <ProgressiveButton
                href={secondaryButtonHref}
                variant="outline"
                size="lg"
                className="rounded-md w-fit"
                hoverEffect="reveal-arrow"
              >
                {secondaryButtonText}
              </ProgressiveButton>
            </div>
          </div>

          {/* Right Column - Mosaic Grid */}
          <div className="relative w-full grid grid-cols-[1.2fr,1fr] gap-6 max-w-[400px] lg:max-w-none mx-auto order-1 lg:order-2">
            {/* Vertical Image */}
            <div className="relative w-full rounded-2xl overflow-hidden">
              <Image
                src="/images/team-member-3.jpg"
                alt="Team member portrait"
                width={200}
                height={400}
                className="object-cover object-top w-full h-full"
                priority
              />
            </div>

            {/* Square Images Column */}
            <div className="flex flex-col gap-6">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/team-member-4.jpg"
                  alt="Team member portrait"
                  width={300}
                  height={300}
                  className="object-cover object-top w-full h-full"
                  priority
                />
              </div>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/team-member-5.jpg"
                  alt="Team member portrait"
                  width={300}
                  height={300}
                  className="object-cover object-top w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 