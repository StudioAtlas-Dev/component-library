import { cn } from '@/lib/utils';
import { ServiceCard } from './index';
import { ServiceCardData, ServiceCardProps } from './types';

interface CardGridProps {
  cards: ServiceCardData[];
  popColor?: string;
  className?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: ServiceCardProps['variant'];
}

export function CardGrid({
  cards,
  popColor,
  className,
  iconAnimation = 'icon-360',
  cardAnimation = 'thicken-border',
  variant = 'grid'
}: CardGridProps) {
  // Validate cards length
  if (cards.length < 2 || cards.length > 8) {
    throw new Error('Cards array must contain between 2 and 8 items');
  }

  // Default grid classes based on number of cards
  const defaultGridClasses = cn(
    "grid grid-cols-1 sm:grid-cols-2",
    cards.length <= 4
      ? `lg:grid-cols-${cards.length}` // Dynamically set the number of columns based on the number of cards
      : "lg:grid-cols-4" // For 4-8 cards, show 4 per row creating 2 rows
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
          defaultGridClasses,
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
                      "sm:[&:nth-child(2n)]:border-r-0",
                      cards.length <= 4
                        ? `lg:[&:nth-child(${cards.length}n)]:border-r-0 lg:[&:nth-child(-n+${cards.length})]:border-b-0`
                        : "lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(n+5)]:border-b-0"
                    ]
              )}
              popColor={popColor}
              iconAnimation={iconAnimation}
              cardAnimation={cardAnimation}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 