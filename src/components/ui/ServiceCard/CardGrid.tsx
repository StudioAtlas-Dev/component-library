import { cn } from '@/lib/utils';
import { ServiceCard } from './index';
import { ServiceCardData } from './types';

interface CardGridProps {
  cards: ServiceCardData[];
  popColor?: string;
  className?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'compact';
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
          className, 
          "divide-x border border-neutral-200 dark:border-neutral-800"
        )}>
          {cards.map((card, index) => (
            <ServiceCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              className={cn(
                "bg-white dark:bg-neutral-900 border-0",
                // Add bottom border to cards in first row of multi-row grid
                cards.length > 4 && index < 4 && "border-b border-neutral-200 dark:border-neutral-800"
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