import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ServiceCardProps, cardVariants } from './types';
import { cn } from '@/lib/utils';

// Pre-render the icon on the server
function IconWrapper({ icon: Icon, color, variant }: { icon: IconType; color?: string; variant?: string }) {
  if (variant === 'floating') {
    // Calculate a darker version of the provided hex color
    // Example: #007acc -> #00589c (20% darker)
    const darkerColor = color?.startsWith('#') 
      ? color.replace(/^#/, '')          // Remove # prefix
          .match(/.{2}/g)                // Split into array of 2-char hex values [00, 7a, cc]
          ?.map(c => {
            const rgbValue = parseInt(c, 16);          // Convert hex to decimal (0-255)
            const darkerValue = Math.max(              // Reduce by x% (multiply by 1 - x)
              0,                                       // Ensure we don't go below 0
              Math.floor(rgbValue * 0.6)              // x% darker value
            );
            return darkerValue
              .toString(16)                           // Convert back to hex
              .padStart(2, '0');                      // Ensure 2 digits (e.g., '0c' instead of 'c')
          })
          .join('')                      // Rejoin hex values
      : color;
      
    return (
      <div 
        className="absolute -top-8 left-8 p-4 rounded-lg z-10"
        style={{ backgroundColor: darkerColor ? `#${darkerColor}` : '#1a4294' }}
      >
        <Icon 
          className="w-8 h-8 text-white" 
        />
      </div>
    );
  }

  return (
    <Icon 
      className="w-full h-full" 
      style={{ color }}
    />
  );
}

// Shared card structure that both server and client components use
export function renderCard({
  title,
  description,
  className,
  variant = 'grid',
  children,
  iconContent,
  refs = {},
  cardAnimation = 'none'
}: {
  title: string;
  description: string;
  className?: string;
  variant?: ServiceCardProps['variant'];
  children?: React.ReactNode;
  iconContent: React.ReactNode;
  refs?: {
    cardRef?: React.RefObject<HTMLDivElement>;
    iconRef?: React.RefObject<HTMLDivElement>;
    borderRef?: React.RefObject<HTMLDivElement>;
  };
  cardAnimation?: string;
}) {
  const cardId = `card-title-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="relative h-full" role="article">
      {/* Floating variant icon is outside the overflow hidden container */}
      {variant === 'floating' && (
        <div ref={refs.iconRef}>
          {iconContent}
        </div>
      )}
      {/* Main card content with overflow hidden */}
      <div className="relative h-full overflow-hidden">
        <div 
          ref={refs.cardRef}
          className={className}
          aria-labelledby={cardId}
        >
          {variant !== 'floating' && (
            <div 
              ref={refs.iconRef}
              className="w-8 h-8 mb-4"
              aria-hidden="true"
            >
              {iconContent}
            </div>
          )}
          <div className={variant === 'floating' ? 'mt-4' : undefined}>
            <h3 
              id={cardId}
              className={cn(
                "font-semibold mb-3",
                variant === 'floating' 
                  ? "text-xl uppercase tracking-wide text-neutral-900 dark:text-neutral-100" 
                  : "text-lg sm:text-xl text-neutral-900 dark:text-neutral-100"
              )}
            >
              {title}
            </h3>
            <p className={cn(
              "text-neutral-600 dark:text-neutral-400",
              variant === 'floating' 
                ? "text-base leading-relaxed"
                : "text-sm sm:text-base leading-relaxed"
            )}>
              {description}
            </p>
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}
          </div>
        </div>
        {/* Animation border overlay */}
        {cardAnimation !== 'none' && (
          <div 
            ref={refs.borderRef}
            className="absolute inset-0 pointer-events-none"
            style={{ borderStyle: 'solid', borderWidth: 0, borderColor: 'transparent' }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

// Create a server-rendered version of the card that matches client exactly
function BaseCard({ icon: Icon, title, description, className, popColor, variant = 'grid', children }: ServiceCardProps) {
  return renderCard({
    title,
    description,
    className: twMerge(cardVariants[variant], className),
    variant,
    children,
    iconContent: <IconWrapper icon={Icon} color={popColor} variant={variant} />,
    cardAnimation: 'none'
  });
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
  const { icon, title, description, className, popColor, iconAnimation, cardAnimation = 'none', variant = 'grid', href, children } = props;
  defaultProps = props;

  // Pre-render the icon component
  const iconComponent = <IconWrapper icon={icon} color={popColor} variant={variant} />;

  // Ensure variant styles are applied and remove duplicate service-card class
  const mergedClassName = twMerge(
    cardVariants[variant].replace(/\bservice-card\b/, ''), 
    className
  );

  // For client component, omit the icon prop and pass iconComponent instead
  const clientProps = {
    ...props,
    className: mergedClassName,
    iconComponent,
    icon: undefined, // Remove icon prop for client component
    cardAnimation
  };

  const cardWithStyles = cardAnimation !== 'none'
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