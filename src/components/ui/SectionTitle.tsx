import { cn } from '@/lib/utils';

interface SectionTitleProps {
  tagline: string;
  title: string;
  description: string;
  popColor?: string;
  dark?: boolean;
  alignLeft?: boolean;
  className?: string;
  taglineClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function SectionTitle({
  tagline,
  title,
  description,
  popColor = '#2563eb',
  dark = false,
  alignLeft = false,
  className,
  taglineClassName,
  titleClassName,
  descriptionClassName
}: SectionTitleProps) {
  return (
    <div 
      className={cn(
        'text-center md:text-center',
        alignLeft && 'lg:text-left',
        className
      )}
      role="region"
      aria-label={title}
    >
      <h3 
        className={cn(
          'text-sm font-semibold uppercase tracking-wider mb-3',
          alignLeft && 'lg:mx-0',
          taglineClassName
        )}
        style={{ color: popColor }}
      >
        {tagline}
      </h3>
      <h2 
        className={cn(
          'text-4xl font-bold mb-4',
          dark ? 'text-white' : 'text-gray-900',
          alignLeft && 'lg:mx-0',
          titleClassName
        )}
      >
        {title}
      </h2>
      <p 
        className={cn(
          'max-w-2xl mx-auto font-normal',
          dark ? 'text-[#E6E6E6]' : 'text-gray-600',
          alignLeft && 'lg:mx-0',
          descriptionClassName
        )}
      >
        {description}
      </p>
    </div>
  );
} 