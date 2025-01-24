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
      const { width: componentWidth } = component.getBoundingClientRect();
      
      // Set canvas dimensions based on variant
      const width = componentWidth;
      const height = selectedVariant === 'oval' ? width * 2 : width;
      
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

        // Draw the masked image with object-cover logic first
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

        // Now apply the clipping mask
        if (selectedVariant === 'oval') {
          // Create a temporary canvas for constructing the mask
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d')!;

          // Draw the oval shape in white
          tempCtx.fillStyle = 'white';
          tempCtx.beginPath();
          const radiusX = width / 2;
          const radiusY = radiusX;
          const c = radiusX * 0.552284749831;
          const centerX = width / 2;
          
          // Top center
          tempCtx.moveTo(centerX, 0);
          // Top right curve
          tempCtx.bezierCurveTo(
            centerX + c, 0,
            width, radiusY - c,
            width, radiusY
          );
          // Right line
          tempCtx.lineTo(width, height - radiusY);
          // Bottom right curve
          tempCtx.bezierCurveTo(
            width, height - radiusY + c,
            centerX + c, height,
            centerX, height
          );
          // Bottom left curve
          tempCtx.bezierCurveTo(
            centerX - c, height,
            0, height - radiusY + c,
            0, height - radiusY
          );
          // Left line
          tempCtx.lineTo(0, radiusY);
          // Top left curve
          tempCtx.bezierCurveTo(
            0, radiusY - c,
            centerX - c, 0,
            centerX, 0
          );
          tempCtx.closePath();
          tempCtx.fill();

          // Add corner fills if any are selected
          if (selectedCorners.length > 0) {
            // Map rounded size to pixel values
            const roundedSizeMap = {
              'none': 0,
              'sm': 2,
              'md': 4,
              'lg': 8,
              'xl': 12,
              '2xl': 16,
              '3xl': 24,
              'full': Math.min(width, height) / 2
            };
            
            const cornerRadius = roundedSizeMap[selectedRounded];
            
            // Draw corner rectangles with rounded corners
            selectedCorners.forEach(corner => {
              tempCtx.beginPath();
              const quadrantWidth = width / 2;
              const quadrantHeight = height / 2;
              
              switch (corner) {
                case 'top-left':
                  if (cornerRadius > 0) {
                    tempCtx.moveTo(0, cornerRadius);
                    tempCtx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
                    tempCtx.lineTo(quadrantWidth, 0);
                    tempCtx.lineTo(quadrantWidth, quadrantHeight);
                    tempCtx.lineTo(0, quadrantHeight);
                  } else {
                    tempCtx.rect(0, 0, quadrantWidth, quadrantHeight);
                  }
                  break;
                case 'top-right':
                  if (cornerRadius > 0) {
                    tempCtx.moveTo(width - cornerRadius, 0);
                    tempCtx.arcTo(width, 0, width, cornerRadius, cornerRadius);
                    tempCtx.lineTo(width, quadrantHeight);
                    tempCtx.lineTo(quadrantWidth, quadrantHeight);
                    tempCtx.lineTo(quadrantWidth, 0);
                  } else {
                    tempCtx.rect(quadrantWidth, 0, quadrantWidth, quadrantHeight);
                  }
                  break;
                case 'bottom-left':
                  if (cornerRadius > 0) {
                    tempCtx.moveTo(0, height - cornerRadius);
                    tempCtx.arcTo(0, height, cornerRadius, height, cornerRadius);
                    tempCtx.lineTo(quadrantWidth, height);
                    tempCtx.lineTo(quadrantWidth, quadrantHeight);
                    tempCtx.lineTo(0, quadrantHeight);
                  } else {
                    tempCtx.rect(0, quadrantHeight, quadrantWidth, quadrantHeight);
                  }
                  break;
                case 'bottom-right':
                  if (cornerRadius > 0) {
                    tempCtx.moveTo(width - cornerRadius, height);
                    tempCtx.arcTo(width, height, width, height - cornerRadius, cornerRadius);
                    tempCtx.lineTo(width, quadrantHeight);
                    tempCtx.lineTo(quadrantWidth, quadrantHeight);
                    tempCtx.lineTo(quadrantWidth, height);
                  } else {
                    tempCtx.rect(quadrantWidth, quadrantHeight, quadrantWidth, quadrantHeight);
                  }
                  break;
              }
              tempCtx.closePath();
              tempCtx.fill();
            });
          }

          // Apply the final mask to the main canvas
          ctx.globalCompositeOperation = 'destination-in';
          ctx.drawImage(tempCanvas, 0, 0);
        } else {
          // Use existing path for circle and other variants
          const maskElement = document.querySelector(maskUrl) as SVGMaskElement;
          const maskPaths = maskElement?.querySelectorAll('path');
          
          if (maskPaths && maskPaths.length > 0) {
            // Create a temporary canvas for the mask
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d')!;

            // Draw all mask paths in white
            tempCtx.fillStyle = 'white';
            maskPaths.forEach((path) => {
              const pathData = path.getAttribute('d');
              if (pathData) {
                const currentPath = new Path2D(pathData);
                tempCtx.fill(currentPath);
              }
            });

            // Add corner fills with rounding if any are selected
            if (selectedCorners.length > 0) {
              // Map rounded size to pixel values
              const roundedSizeMap = {
                'none': 0,
                'sm': 2,
                'md': 4,
                'lg': 8,
                'xl': 12,
                '2xl': 16,
                '3xl': 24,
                'full': Math.min(width, height) / 2
              };
              
              const cornerRadius = roundedSizeMap[selectedRounded];
              
              // Draw corner rectangles with rounded corners
              selectedCorners.forEach(corner => {
                tempCtx.beginPath();
                const quadrantWidth = width / 2;
                const quadrantHeight = height / 2;
                
                switch (corner) {
                  case 'top-left':
                    if (cornerRadius > 0) {
                      tempCtx.moveTo(0, cornerRadius);
                      tempCtx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
                      tempCtx.lineTo(quadrantWidth, 0);
                      tempCtx.lineTo(quadrantWidth, quadrantHeight);
                      tempCtx.lineTo(0, quadrantHeight);
                    } else {
                      tempCtx.rect(0, 0, quadrantWidth, quadrantHeight);
                    }
                    break;
                  case 'top-right':
                    if (cornerRadius > 0) {
                      tempCtx.moveTo(width - cornerRadius, 0);
                      tempCtx.arcTo(width, 0, width, cornerRadius, cornerRadius);
                      tempCtx.lineTo(width, quadrantHeight);
                      tempCtx.lineTo(quadrantWidth, quadrantHeight);
                      tempCtx.lineTo(quadrantWidth, 0);
                    } else {
                      tempCtx.rect(quadrantWidth, 0, quadrantWidth, quadrantHeight);
                    }
                    break;
                  case 'bottom-left':
                    if (cornerRadius > 0) {
                      tempCtx.moveTo(0, height - cornerRadius);
                      tempCtx.arcTo(0, height, cornerRadius, height, cornerRadius);
                      tempCtx.lineTo(quadrantWidth, height);
                      tempCtx.lineTo(quadrantWidth, quadrantHeight);
                      tempCtx.lineTo(0, quadrantHeight);
                    } else {
                      tempCtx.rect(0, quadrantHeight, quadrantWidth, quadrantHeight);
                    }
                    break;
                  case 'bottom-right':
                    if (cornerRadius > 0) {
                      tempCtx.moveTo(width - cornerRadius, height);
                      tempCtx.arcTo(width, height, width, height - cornerRadius, cornerRadius);
                      tempCtx.lineTo(width, quadrantHeight);
                      tempCtx.lineTo(quadrantWidth, quadrantHeight);
                      tempCtx.lineTo(quadrantWidth, height);
                    } else {
                      tempCtx.rect(quadrantWidth, quadrantHeight, quadrantWidth, quadrantHeight);
                    }
                    break;
                }
                tempCtx.closePath();
                tempCtx.fill();
              });
            }

            // Apply the mask to the main canvas
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }
        
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
              width={600}
              rounded={selectedRounded}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
