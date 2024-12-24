import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ServiceCardProps, cardVariants } from './types';

// Pre-render the icon on the server
function IconWrapper({ icon: Icon, color }: { icon: IconType; color?: string }) {
  return (
    <Icon 
      className="w-full h-full" 
      style={{ color }}
    />
  );
}

// Create a server-rendered version of the card that matches client exactly
function BaseCard({ icon: Icon, title, description, className, popColor, variant = 'grid', children }: ServiceCardProps) {
  const cardId = `card-title-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="relative h-full" role="article">
      <div 
        className={twMerge(cardVariants[variant], className)}
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
        {children && (
          <div className="mt-4">
            {children}
      </div>
        )}
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
  const { icon, title, description, className, popColor, iconAnimation, cardAnimation, variant = 'grid', href, children } = props;
  defaultProps = props;

  // Pre-render the icon component
  const iconComponent = <IconWrapper icon={icon} color={popColor} />;

  // Ensure variant styles are applied
  const mergedClassName = twMerge(cardVariants[variant], className);

  // For client component, omit the icon prop and pass iconComponent instead
  const clientProps = {
    ...props,
    className: mergedClassName,
    iconComponent,
    icon: undefined // Remove icon prop for client component
  };

  const cardWithStyles = (iconAnimation && iconAnimation !== 'none') || (cardAnimation && cardAnimation !== 'none')
    ? <ClientServiceCard {...clientProps} />
    : <BaseCard {...props} className={mergedClassName} />;

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardWithStyles}
      </Link>
    );
  }

  return cardWithStyles;
} 