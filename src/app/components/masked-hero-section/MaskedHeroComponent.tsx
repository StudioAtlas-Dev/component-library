import Image from 'next/image';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionMask from '@/components/ui/SectionMask';

interface MaskedHeroProps {
    tagline?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    backgroundColor?: string;
    popColor?: string;
}

export default function MaskedHeroComponent({
    tagline = 'BEAUTIFUL WEBSITES, MORE LEADS',
    title = 'We Handle It All',
    description = 'No Wordpress headaches. No expensive website builders. Our goal is to create you a website that looks beautiful, performs amazing, and gets you more customers in the door.',
    buttonText = 'Get Started',
    buttonHref = '#',
    backgroundColor = '#0a234a',
    popColor = '#ff5733'
}: MaskedHeroProps) {
    return (
        <section 
            className="w-full min-h-[100vh] relative"
            style={{ backgroundColor }}
            aria-label="Hero section"
            role="region"
        >
            <SectionMask fill="white" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-48 pb-48 lg:pb-64">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Column - Text Content */}
                    <div 
                        className="flex flex-col justify-center items-center lg:items-start"
                        role="presentation"
                    >
                        <SectionTitle
                            tagline={tagline}
                            title={title}
                            dark
                            description={description}
                            taglineClassName="tracking-widest text-sm"
                            titleClassName="text-4xl md:text-5xl lg:text-6xl font-bold uppercase"
                            descriptionClassName="text-lg mt-6"
                            popColor={popColor}
                            alignLeft
                        />
                        <div 
                            className="mt-8 flex justify-center lg:justify-start w-full mb-10 lg:mb-0"
                            role="presentation"
                        >
                            <ProgressiveButton
                                href={buttonHref}
                                variant="default"
                                size="lg"
                                className="rounded-md w-fit"
                                style={{ backgroundColor: popColor }}
                                hoverEffect="reveal-arrow"
                                aria-label={`${buttonText} - Begin your website journey`}
                            >
                                {buttonText}
                            </ProgressiveButton>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div 
                        className="w-full mt-0 lg:mt-[50px]"
                        role="presentation"
                    >
                        <div className="relative w-full aspect-[16/10]">
                            <Image
                                src="/images/hero-image.avif"
                                alt="Laptop displaying a modern website design with responsive mobile view"
                                fill
                                className="object-contain object-center scale-110 lg:scale-125"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}