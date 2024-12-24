import { cn } from '@/lib/utils';

interface SectionTitleProps {
  tagline?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  taglineClassName?: string;
  descriptionClassName?: string;
  popColor?: string;
  titleId?: string;
  dark?: boolean;
  alignLeft?: boolean;
}

export default function SectionTitle({
  tagline,
  title,
  description,
  className = '',
  titleClassName = '',
  taglineClassName = '',
  descriptionClassName = '',
  popColor = '#007acc',
  titleId,
  dark = false,
  alignLeft = false
}: SectionTitleProps) {
  return (
    <div className={cn(
      'text-center',
      alignLeft && 'lg:text-left',
      className
    )}>
      {tagline && (
        <span
          className={cn(
            'inline-block text-sm font-semibold tracking-wider uppercase mb-4',
            alignLeft && 'lg:mx-0',
            taglineClassName
          )}
          style={{ color: popColor }}
        >
          {tagline}
        </span>
      )}
      <h2
        id={titleId}
        className={cn(
          'text-3xl sm:text-4xl font-bold tracking-tight',
          dark ? 'text-white' : 'text-neutral-900 dark:text-neutral-100',
          alignLeft && 'lg:mx-0',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg',
            dark ? 'text-[#E6E6E6]' : 'text-neutral-600 dark:text-neutral-400',
            alignLeft && 'lg:mx-0',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
} 