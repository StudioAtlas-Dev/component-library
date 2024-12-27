'use client';

import { useState } from 'react';
import { MaskedImage } from '@/components/ui/MaskedImage';
import { CornerDirection, MaskedImageVariant } from '@/components/ui/MaskedImage/types';

const colors = [
  { label: 'Teal', value: '#0D4F4F' },
  { label: 'Lime Green', value: '#84cc16' },
  { label: 'Coral', value: '#FF6B6B' },
  { label: 'Sky Blue', value: '#0EA5E9' },
];

export function MaskedImageDemoComponent() {
  const [selectedVariant, setSelectedVariant] = useState<MaskedImageVariant>('circle');
  const [selectedCorner, setSelectedCorner] = useState<CornerDirection>('top-left');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);

  return (
    <section className="w-full py-12 space-y-12">
      <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4">
          <select
            className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value as MaskedImageVariant)}
          >
            <option value="circle">Circle</option>
            <option value="oval">Oval</option>
          </select>

          <select
            className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
            value={selectedCorner}
            onChange={(e) => setSelectedCorner(e.target.value as CornerDirection)}
          >
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
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
              cornerDirection={selectedCorner}
              color={selectedColor}
              src="/images/dog1.png"
              alt="Dog being held"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 