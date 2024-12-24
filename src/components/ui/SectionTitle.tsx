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
  titleId
}: SectionTitleProps) {
  return (
    <div className={cn('text-center', className)}>
      {tagline && (
        <span
          className={cn(
            'inline-block text-sm font-semibold tracking-wider uppercase mb-4',
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
          'text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg text-neutral-600 dark:text-neutral-400',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
} 