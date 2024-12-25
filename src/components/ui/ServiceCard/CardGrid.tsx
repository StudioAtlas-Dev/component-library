import { cn } from '@/lib/utils';
import { ServiceCard } from './index';
import { ServiceCardData, ServiceCardProps } from './types';

interface CardGridProps {
  cards: ServiceCardData[];
  popColor?: string;
  darkColor?: string;
  className?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: ServiceCardProps['variant'];
  centerWithinRow?: boolean;
  animationImage?: string;
}

// Define max cards per row for each variant
const variantMaxRowSize: Record<NonNullable<ServiceCardProps['variant']>, number> = {
  grid: 4,
  compact: 4,
  floating: 3
};

export function CardGrid({
  cards,
  popColor,
  darkColor,
  className,
  iconAnimation = 'icon-360',
  cardAnimation = 'thicken-border',
  variant = 'grid',
  centerWithinRow = false,
  animationImage
}: CardGridProps) {
  // Validate cards length
  if (cards.length < 2 || cards.length > 8) {
    throw new Error('Cards array must contain between 2 and 8 items');
  }

  const maxRowSize = variantMaxRowSize[variant];

  // Calculate grid classes based on variant and number of cards
  const gridClasses = cn(
    "grid grid-cols-1 md:grid-cols-2",
    // For lg breakpoint and up
    variant === 'floating'
      ? "lg:grid-cols-3" // Floating variant always shows 3 per row at lg
      : {
          'lg:grid-cols-2': cards.length === 2,
          'lg:grid-cols-3': cards.length === 3,
          'lg:grid-cols-4': cards.length >= 4
        }
  );

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-neutral-900",
        className
      )}
      role="region"
      aria-label="Services"
    >
      <div className="max-w-9xl mx-auto">
        <div className={cn(
          gridClasses,
          variant === 'floating' 
            ? "gap-8 gap-y-16 px-4 sm:px-8 mt-20" 
            : "border-t border-l border-neutral-200 dark:border-neutral-800"
        )}>
          {cards.map((card, index) => (
            <ServiceCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              className={cn(
                "bg-white dark:bg-neutral-900",
                variant === 'floating' 
                  ? "bg-slate-50 dark:bg-neutral-800" 
                  : [
                      // Base borders
                      "border-b border-r border-neutral-200 dark:border-neutral-800",
                      // Handle right borders at breakpoints
                      "md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r",
                      // Handle borders based on max row size
                      {
                        'lg:[&:nth-child(4n)]:border-r-0': maxRowSize === 4,
                        'lg:[&:nth-child(3n)]:border-r-0': maxRowSize === 3,
                        'lg:[&:nth-child(2n)]:border-r-0': maxRowSize === 2
                      },
                      // Handle bottom borders
                      {
                        'lg:[&:nth-child(n+5)]:border-b-0': cards.length <= 4,
                        'lg:[&:nth-child(n+7)]:border-b-0': cards.length <= 6,
                        'lg:[&:nth-child(n+9)]:border-b-0': cards.length <= 8
                      }
                    ]
              )}
              popColor={popColor}
              darkColor={darkColor}
              iconAnimation={iconAnimation}
              cardAnimation={cardAnimation}
              variant={variant}
              animationImage={animationImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 