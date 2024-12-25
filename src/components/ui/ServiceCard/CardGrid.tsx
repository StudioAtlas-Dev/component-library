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
      : cards.length <= maxRowSize
        ? `lg:grid-cols-${cards.length}`
        : `lg:grid-cols-${maxRowSize}`
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
                      "md:[&:nth-child(2n)]:border-r-0",
                      // Handle borders based on max row size
                      `lg:[&:nth-child(${maxRowSize}n)]:border-r-0`,
                      // Handle bottom borders for complete rows
                      cards.length <= maxRowSize
                        ? `lg:[&:nth-child(-n+${cards.length})]:border-b-0`
                        : `lg:[&:nth-child(n+${cards.length - (cards.length % maxRowSize || maxRowSize) + 1})]:border-b-0`
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