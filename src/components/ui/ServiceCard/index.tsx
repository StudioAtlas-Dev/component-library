import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';

interface ServiceCardProps {
  icon: IconType;
  title: string;
  description: string;
  className?: string;
  popColor?: string;
  iconAnimation?: string;
  cardAnimation?: string;
}

// Pre-render the icon on the server
function IconWrapper({ icon: Icon, color }: { icon: IconType; color?: string }) {
  return (
    <Icon 
      className="w-full h-full" 
      style={{ color }}
    />
  );
}

// Base styles that will be used by both server and client components
const baseCardStyles = "relative flex flex-col h-full px-6 sm:px-8 xl:px-12 py-8 border border-neutral-200 dark:border-neutral-800 service-card";

// Create a server-rendered version of the card that matches client exactly
function BaseCard({ icon: Icon, title, description, className, popColor }: ServiceCardProps) {
  const cardId = `card-title-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="relative h-full" role="article">
      <div 
        className={twMerge(baseCardStyles, className)}
        aria-labelledby={cardId}
      >
        <div className="w-8 h-8 mb-4" aria-hidden="true">
          <IconWrapper icon={Icon} color={popColor} />
        </div>
        <h3 
          id={cardId}
          className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3"
        >
          {title}
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>
      {/* Static border overlay - matches client structure */}
      <div 
        className="absolute inset-0 pointer-events-none border-0 border-current"
        style={{ borderStyle: 'solid' }}
        aria-hidden="true"
      />
    </div>
  );
}

// Dynamically import the client version
const ClientServiceCard = dynamic(
  () => import('./ClientServiceCard'),
  { 
    ssr: true,
    loading: ({ error }) => {
      if (error) return <div>Error loading card</div>;
      return <BaseCard {...defaultProps} />;
    }
  }
);

let defaultProps: ServiceCardProps;

export function ServiceCard(props: ServiceCardProps) {
  const { icon, title, description, className, popColor, iconAnimation, cardAnimation } = props;
  defaultProps = props;

  // Pre-render the icon component
  const iconComponent = <IconWrapper icon={icon} color={popColor} />;

  // Only use client component if any animations are requested
  if ((iconAnimation && iconAnimation !== 'none') || (cardAnimation && cardAnimation !== 'none')) {
    return (
      <ClientServiceCard
        title={title}
        description={description}
        className={twMerge(baseCardStyles, className)}
        iconComponent={iconComponent}
        iconAnimation={iconAnimation}
        cardAnimation={cardAnimation}
      />
    );
  }

  return <BaseCard {...props} />;
} 