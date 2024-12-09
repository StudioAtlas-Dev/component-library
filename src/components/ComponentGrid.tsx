import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ComponentType {
  name: string;
  path: string;
  type: string;
  tags?: string[];
}

interface ComponentGridProps {
  components: ComponentType[];
}

export default function ComponentGrid({ components }: ComponentGridProps) {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      role="grid"
      aria-label="Component Gallery"
    >
      {components.map((component) => (
        <Link 
          key={component.path} 
          href={`/components/${component.path}`}
          className="group relative hover:none block overflow-hidden rounded-lg border border-gray-200"
          role="gridcell"
          aria-label={`View ${component.name} component`}
        >
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={`/previews/${component.path}.png`}
              alt={`Preview of ${component.name} component`}
              fill
              className="object-contain bg-gray-50"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
              priority={true}
            />
            {/* Overlay with button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="grid" 
                  bgColor="#2563eb"
                  hoverEffect="fill-in"
                  aria-label={`View live preview of ${component.name}`}
                >
                  <span>View Live</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <h3 className="text-lg font-semibold">{component.name}</h3>
            <p className="text-sm text-gray-600 mt-1" role="text">{component.type}</p>
            <div className="mt-2 flex gap-2" role="list" aria-label="Component tags">
              {component.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
