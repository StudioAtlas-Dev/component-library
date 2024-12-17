import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import dynamic from 'next/dynamic';

// Dynamically import the client-side background component
const ClientLightrayBackground = dynamic(
  () => import('./LightrayBackgroundComponent'),
  { ssr: false }
);

interface LightrayHeroProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
}

export default function LightrayHeroComponent({
    title = "I love lightrays",
    subtitle = "They are so cool",
    buttonText = "See the Light",
    buttonHref = "#"
}: LightrayHeroProps) {
    // Base hero content that's always rendered
    const heroContent = (
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
                {subtitle}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <ProgressiveButton
                    href={buttonHref}
                    variant="default"
                    size="lg"
                    className="bg-white text-black"
                    hoverEffect="fill-in"
                    hoverColor="hsl(210, 100%, 80%)"
                >
                    {buttonText}
                </ProgressiveButton>
            </div>
        </div>
    );

    return (
        <ClientLightrayBackground>
            {heroContent}
        </ClientLightrayBackground>
    );
} 