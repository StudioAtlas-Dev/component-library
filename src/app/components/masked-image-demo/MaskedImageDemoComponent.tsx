'use client';

import { useState } from 'react';
import { MaskedImage } from '@/components/ui/MaskedImage';
import { CornerDirection, MaskedImageVariant, SingleCornerDirection, RoundedSize } from '@/components/ui/MaskedImage/types';

const colors = [
  { label: 'Teal', value: '#0D4F4F' },
  { label: 'Lime Green', value: '#84cc16' },
  { label: 'Coral', value: '#FF6B6B' },
  { label: 'Sky Blue', value: '#0EA5E9' },
];

const variants: { label: string; value: MaskedImageVariant }[] = [
  { label: 'Circle', value: 'circle' },
  { label: 'Oval', value: 'oval' },
  { label: 'Porthole (Left)', value: 'porthole-left' },
  { label: 'Porthole (Right)', value: 'porthole-right' },
];

const roundedSizes: { label: string; value: RoundedSize }[] = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
  { label: 'Full', value: 'full' },
];

const corners: SingleCornerDirection[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export function MaskedImageDemoComponent() {
  const [selectedVariant, setSelectedVariant] = useState<MaskedImageVariant>('circle');
  const [selectedCorners, setSelectedCorners] = useState<SingleCornerDirection[]>([]);
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [selectedRounded, setSelectedRounded] = useState<RoundedSize>('none');

  const handleCornerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value as SingleCornerDirection);
    setSelectedCorners(selectedOptions);
  };

  return (
    <section className="w-full py-12 space-y-12">
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">Masked Image Component</h2>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variant</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as MaskedImageVariant)}
            >
              {variants.map((variant) => (
                <option key={variant.value} value={variant.value}>
                  {variant.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Corner Fill (Non-Porthole Variants Only)
            </label>
            <select
              value={selectedCorners}
              onChange={handleCornerChange}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Corner Rounding</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={selectedRounded}
              onChange={(e) => setSelectedRounded(e.target.value as RoundedSize)}
            >
              {roundedSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
              rounded={selectedRounded}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 