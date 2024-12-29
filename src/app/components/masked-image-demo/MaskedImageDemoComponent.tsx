'use client';

import { useState } from 'react';
import { MaskedImage } from '@/components/ui/MaskedImage';
import { CornerDirection, MaskedImageVariant, SingleCornerDirection } from '@/components/ui/MaskedImage/types';

const colors = [
  { label: 'Teal', value: '#0D4F4F' },
  { label: 'Lime Green', value: '#84cc16' },
  { label: 'Coral', value: '#FF6B6B' },
  { label: 'Sky Blue', value: '#0EA5E9' },
];

const variants: { label: string; value: MaskedImageVariant }[] = [
  { label: 'Circle', value: 'circle' },
  { label: 'Oval', value: 'oval' },
  { label: 'Porthole', value: 'porthole' },
];

const corners: SingleCornerDirection[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export function MaskedImageDemoComponent() {
  const [selectedVariant, setSelectedVariant] = useState<MaskedImageVariant>('circle');
  const [selectedCorners, setSelectedCorners] = useState<SingleCornerDirection[]>([]);
  const [selectedColor, setSelectedColor] = useState(colors[0].value);

  const handleCornerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value as SingleCornerDirection);
    setSelectedCorners(selectedOptions);
  };

  return (
    <section className="w-full py-12 space-y-12">
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">Masked Image Component</h2>
        
        <div className="flex flex-wrap gap-4">
          <select
            className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value as MaskedImageVariant)}
          >
            {variants.map((variant) => (
              <option key={variant.value} value={variant.value}>
                {variant.label}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
            value={selectedCorners}
            onChange={handleCornerChange}
            multiple
            size={5}
          >
            <option value="">None</option>
            {corners.map((corner) => (
              <option key={corner} value={corner}>
                {corner.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {colors.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center justify-center p-4">
            <MaskedImage
              variant={selectedVariant}
              cornerDirection={selectedCorners.join(' ') as CornerDirection}
              color={selectedColor}
              src="/images/dog1.png"
              alt="Dog being held"
              width={300}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 