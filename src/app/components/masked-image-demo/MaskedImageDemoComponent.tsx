'use client';

import { useState, useRef } from 'react';
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
  const [uploadedImage, setUploadedImage] = useState<string>('/images/dog1.png');
  const componentRef = useRef<HTMLDivElement>(null);

  const handleCornerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value as SingleCornerDirection
    );
    setSelectedCorners(selectedOptions);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadMaskedImage = async () => {
    if (!componentRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const component = componentRef.current;
      const { width, height } = component.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;

      // Get the SVG and the mask container
      const svg = component.querySelector('svg')!;
      const maskDiv = component.querySelector('div[style*="mask"]') as HTMLElement;

      // Create a new image for the uploaded image
      const maskedImg = new Image();
      maskedImg.src = uploadedImage;

      // Wait for the user's image to load
      await new Promise<void>((resolve) => {
        maskedImg.onload = () => resolve();
      });

      const ctx = canvas.getContext('2d')!;

      // Draw the colored SVG background
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const svgImg = new Image();
      await new Promise<void>((resolve) => {
        svgImg.onload = () => {
          ctx.drawImage(svgImg, 0, 0, width, height);
          resolve();
        };
        svgImg.src = svgUrl;
      });

      // Now draw the masked image on top
      const maskStyle = maskDiv.style.mask || maskDiv.style.webkitMask;
      const maskUrl = maskStyle.match(/url\((.*?)\)/)?.[1].replace(/['"]/g, '');

      if (maskUrl) {
        ctx.save();

        // Get the actual <mask> element in the DOM
        const maskElement = document.querySelector(maskUrl) as SVGMaskElement;
        const maskPaths = maskElement?.querySelectorAll('path');

        if (maskPaths && maskPaths.length > 0) {
          // Create a combined path from all paths
          const combinedPath = new Path2D();
          maskPaths.forEach((path) => {
            const pathData = path.getAttribute('d');
            if (pathData) {
              const currentPath = new Path2D(pathData);
              combinedPath.addPath(currentPath);
            }
          });

          // Clip by the combined path
          ctx.clip(combinedPath);
        }

        // Draw the masked image with object-cover logic
        const imgAspectRatio = maskedImg.width / maskedImg.height;
        const containerAspectRatio = width / height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (containerAspectRatio > imgAspectRatio) {
          drawWidth = width;
          drawHeight = width / imgAspectRatio;
          offsetY = (height - drawHeight) / 2;
        } else {
          drawHeight = height;
          drawWidth = height * imgAspectRatio;
          offsetX = (width - drawWidth) / 2;
        }

        ctx.drawImage(maskedImg, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
      }

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'masked-image.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <section className="w-full py-12 space-y-12">
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">Masked Image Component</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100
                dark:file:bg-violet-900 dark:file:text-violet-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Variant
            </label>
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
                  {corner
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Corner Rounding
            </label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
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

          <button
            onClick={downloadMaskedImage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download Masked Image
          </button>
        </div>

        <div className="flex justify-center p-4">
          <div ref={componentRef}>
            <MaskedImage
              variant={selectedVariant}
              cornerDirection={selectedCorners.join(' ') as CornerDirection}
              color={selectedColor}
              src={uploadedImage}
              alt="Masked image"
              width={300}
              rounded={selectedRounded}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
