'use client';

import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    title: string;
    image: string;
  };
  isActive: boolean;
  willBeActive: boolean;
  isMoving: boolean;
}

export default function TestimonialCard({
  quote,
  author,
  isActive,
  willBeActive,
  isMoving,
}: TestimonialCardProps) {
  const isOrWillBeActive = isActive || willBeActive;
  const shouldBeInactive = isMoving && !willBeActive;
  
  return (
    <div
      className={`
        relative w-[300px] sm:w-[500px] lg:w-[600px] bg-white rounded-lg p-6 sm:p-8 shadow-lg
        flex flex-col gap-4 sm:gap-6 max-h-[400px] sm:max-h-none aspect-[4/3] sm:aspect-[2/1]
        transform transition-[transform,opacity] duration-1000
        ${isOrWillBeActive && !shouldBeInactive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}
      `}
    >
      <div className="flex-1 relative">
        <p className="text-lg sm:text-2xl font-bold leading-relaxed text-gray-900">{quote}</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 relative">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
          <Image
            src={author.image}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm sm:text-base">{author.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-xs sm:text-sm">{author.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
