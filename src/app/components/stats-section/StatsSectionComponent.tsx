import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface StatItem {
  number: number;
  suffix?: string;
  description: string;
}

interface StatsSectionProps {
  backgroundColor?: string;
  textColor?: string;
  stats?: StatItem[];
  className?: string;
}

const defaultStats: StatItem[] = [
  { number: 476, suffix: 'K', description: 'Assets packed with power beyond your imagination.' },
  { number: 1.44, suffix: 'K', description: 'Assets packed with power beyond your imagination.' },
  { number: 1.5, suffix: 'M+', description: 'Assets packed with power beyond your imagination.' },
  { number: 192, suffix: 'K', description: 'Assets packed with power beyond your imagination.' }
];

export default function StatsSectionComponent({
  backgroundColor = 'white',
  textColor = 'black',
  stats = defaultStats,
}: StatsSectionProps) {
  return (
    <section 
      className="w-full py-16 px-8"
      style={{ backgroundColor }}
      aria-label="Key statistics"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative" role="list">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center"
              role="listitem"
            >
              <h3 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
                <AnimatedCounter 
                  endNumber={stat.number} 
                  suffix={stat.suffix}
                />
              </h3>
              <p className="text-gray-600 max-w-xs">
                {stat.description}
              </p>
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 h-16 border-r border-dotted border-gray-600" style={{ left: `${(index + 1) * (100 / 4)}%` }} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 