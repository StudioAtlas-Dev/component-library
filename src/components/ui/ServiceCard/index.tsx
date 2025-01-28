import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ServiceCardProps, cardVariants } from './types';
import { cn } from '@/lib/utils';

// Pre-render the icon on the server
function calculateDarkerColor(color?: string) {
  if (!color) return undefined;

  // Handle HSL format
  if (color.toLowerCase().startsWith('hsl')) {
    const matches = color.match(/\d+(\.\d+)?/g);
    if (matches) {
      const [h, s, l] = matches.map(Number);
      // Reduce lightness by 50%
      return `hsl(${h}, ${s}%, ${Math.max(0, l * 0.5)}%)`;
    }
    return color;
  }

  // Handle hex format
  if (color.startsWith('#')) {
    return '#' + color.replace(/^#/, '')          // Remove # prefix
        .match(/.{2}/g)                // Split into array of 2-char hex values [00, 7a, cc]
        ?.map(c => {
          const rgbValue = parseInt(c, 16);          // Convert hex to decimal (0-255)
          const darkerValue = Math.max(              // Reduce by x% (multiply by 1 - x)
            0,                                       // Ensure we don't go below 0
            Math.floor(rgbValue * 0.5)              // x% darker value
          );
          return darkerValue
            .toString(16)                           // Convert back to hex
            .padStart(2, '0');                      // Ensure 2 digits (e.g., '0c' instead of 'c')
        })
      .join('');                      // Rejoin hex values
  }

  return color;
}

function IconWrapper({ 
  icon: Icon, 
  color, 
  variant, 
  activeDarkColor 
}: { 
  icon: IconType; 
  color?: string; 
  variant?: string; 
  activeDarkColor: string;
}) {
  if (variant === 'floating') {
    return (
      <div 
        className="absolute -top-8 left-8 p-4 rounded-lg z-10 service-card-icon-container"
        style={{ backgroundColor: activeDarkColor }}
        data-color={color}
        data-active-dark-color={activeDarkColor}
      >
        <Icon 
          className="w-8 h-8 text-white service-card-icon" 
          data-color={color}
          data-active-dark-color={activeDarkColor}
        />
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8">
      <div 
        className="absolute -inset-2 rounded-full service-card-icon-container z-[1]"
        style={{ backgroundColor: '#ffffff' }}
      />
      <Icon 
        className="w-full h-full service-card-icon relative z-[2]" 
        style={{ color }}
        data-color={color}
        data-active-dark-color={activeDarkColor}
      />
    </div>
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
  cardAnimation = 'none',
  activeDarkColor,
  animationImage
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
  activeDarkColor?: string;
  animationImage?: string;
}) {
  const cardId = `card-title-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <>
      {/* Preload animation image */}
      {animationImage && cardAnimation?.includes('raise-background-image') && (
        <link 
          rel="preload" 
          href={animationImage} 
          as="image" 
          type="image/avif"
        />
      )}
      <div className="relative h-full" role="article">
        {/* Floating variant icon is outside the overflow hidden container */}
        {variant === 'floating' && (
          <div ref={refs.iconRef}>
            {iconContent}
          </div>
        )}
        {/* Main card content with overflow hidden */}
        <div 
          ref={refs.cardRef}
          className={cn("service-card relative h-full overflow-hidden", className)}
          aria-labelledby={cardId}
          data-active-dark-color={activeDarkColor}
          data-animation-image={animationImage}
        >
          <div>
            {variant !== 'floating' && (
              <div 
                ref={refs.iconRef}
                className="w-8 h-8 mb-4 relative z-1"
                aria-hidden="true"
              >
                {iconContent}
              </div>
            )}
            <div className={cn(
              "service-card-content relative z-1",
              variant === 'floating' ? "mt-4" : undefined
            )}>
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
    </>
  );
}

// Create a server-rendered version of the card that matches client exactly
function BaseCard({ 
  icon: Icon, 
  title, 
  description, 
  className, 
  popColor, 
  variant = 'grid', 
  children,
  activeDarkColor,
  animationImage
}: ServiceCardProps & { activeDarkColor: string, animationImage?: string }) {
  return renderCard({
    title,
    description,
    className: twMerge(cardVariants[variant], className),
    variant,
    children,
    iconContent: <IconWrapper icon={Icon} color={popColor} variant={variant} activeDarkColor={activeDarkColor} />,
    cardAnimation: 'none',
    activeDarkColor,
    animationImage
  });
}

// Dynamically import the client version
const ClientServiceCard = dynamic(
  () => import('./ClientServiceCard'),
  { 
    ssr: true,
    loading: ({ error }) => {
      if (error) return <div>Error loading card</div>;
      // Calculate activeDarkColor for loading state
      const activeDarkColor = defaultProps.darkColor || 
        calculateDarkerColor(defaultProps.popColor) || 
        '#1a4294';
      return <BaseCard {...defaultProps} activeDarkColor={activeDarkColor} />;
    }
  }
);

let defaultProps: ServiceCardProps;

export function ServiceCard(props: ServiceCardProps) {
  const { 
    icon, 
    title, 
    description, 
    className, 
    popColor, 
    darkColor, 
    iconAnimation, 
    cardAnimation = 'none', 
    variant = 'grid', 
    href, 
    children,
    animationImage 
  } = props;

  // Determine the active dark color once, with fallback
  const activeDarkColor = darkColor || calculateDarkerColor(popColor) || '#1a4294';

  // Set defaultProps without activeDarkColor (it's calculated in the loading component)
  defaultProps = props;

  // Pre-render the icon component
  const iconComponent = <IconWrapper 
    icon={icon} 
    color={popColor} 
    variant={variant} 
    activeDarkColor={activeDarkColor} 
  />;

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
    cardAnimation,
    activeDarkColor, // Pass the active dark color to client component
    animationImage
  };

  const cardWithStyles = cardAnimation !== 'none'
    ? <ClientServiceCard {...clientProps} />
    : <BaseCard {...props} className={mergedClassName} activeDarkColor={activeDarkColor} animationImage={animationImage} />;

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardWithStyles}
      </Link>
    );
  }

  return cardWithStyles;
} 