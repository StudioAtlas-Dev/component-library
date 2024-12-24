import { cn } from '@/lib/utils';
import { ServiceCard } from './index';
import { ServiceCardData } from './types';

interface CardGridProps {
  cards: ServiceCardData[];
  popColor?: string;
  className?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'list' | 'compact';
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
        <div 
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2",
            cards.length <= 4 
              ? `lg:grid-cols-${cards.length}` 
              : "lg:grid-cols-4"
          )}
        >
          {cards.map((card, index) => (
            <ServiceCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              className="bg-white dark:bg-neutral-900"
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