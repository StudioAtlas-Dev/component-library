import { InputSection } from './InputSection';
import Image from 'next/image';
import SectionTitle from '@/components/ui/SectionTitle';

interface SubscribeComponentProps {
  // Optional custom color for the component's interactive elements
  popColor?: string;
  // Optional custom text for the subscribe button
  buttonText?: string;
  // Optional custom background image URL
  backgroundImage?: string;
  // Optional custom heading text
  heading?: string;
  // Optional custom description text
  description?: string;
}

/**
 * Newsletter subscription component that combines visual elements with subscription functionality
 * 
 * Usage in another project:
 * 1. Copy both SubscribeComponent.tsx and InputSection.tsx
 * 2. Ensure dependencies are installed (anime.js, react-icons)
 * 3. Import and use like:
 *    <SubscribeComponent 
 *      popColor="#4CAF50"
 *      buttonText="Join Now"
 *      backgroundImage="/images/your-bg.jpg"
 *      heading="Custom Newsletter Heading"
 *      description="Custom newsletter description text"
 *    />
 * 
 * To implement actual subscription functionality:
 * 1. Create an API route in your project (e.g., app/api/subscribe/route.ts)
 * 2. Implement the subscription logic there
 * 3. Pass a custom onSubscribe function to InputSection like:
 * 
 * const handleSubscribe = async (email: string) => {
 *   try {
 *     const response = await fetch('/api/subscribe', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ email })
 *     });
 *     const data = await response.json();
 *     
 *     if (!response.ok) throw new Error(data.message);
 *     
 *     return {
 *       success: true,
 *       message: 'Thanks for subscribing!'
 *     };
 *   } catch (error) {
 *     return {
 *       success: false,
 *       message: error instanceof Error ? error.message : 'Subscription failed'
 *     };
 *   }
 * };
 */

export const SubscribeComponent = ({
  popColor = '#4CAF50',
  buttonText = 'Subscribe Now',
  backgroundImage = '/images/banner-background.jpg',
  heading = 'Subscribe for Newsletter',
  description = 'Subscribe to our newsletter and stay up-to-date with the latest news, exclusive offers, and exciting updates.'
}: SubscribeComponentProps) => {
  return (
    <section className="relative h-[500px]">
      <Image 
        src={backgroundImage}
        alt="Background Image of Newsletter"
        fill
        className="object-cover object-top brightness-[0.5]"
        loading="lazy"
      />
      
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="w-full max-w-3xl mx-auto text-center space-y-4">
          <SectionTitle
            tagline="Newsletter"
            title={heading}
            description={description}
            popColor={popColor}
            descriptionClassName="pb-6"
            dark
            className="w-full max-w-3xl mx-auto space-y-4"
          />
          {/* Input section with subscription functionality */}
          <InputSection 
            buttonText={buttonText}
            popColor={popColor}
            // Implement and pass your custom onSubscribe function here
            // onSubscribe={handleSubscribe}
          />
        </div>
      </div>
    </section>
  );
}; 