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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {components.map((component) => (
        <Link 
          key={component.path} 
          href={`/components/${component.path}`}
          className="group relative hover:none"
        >
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={`/previews/${component.path}.png`}
              alt={component.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={50}
              priority={true}
            />
            {/* Overlay with button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="grid" 
                  bgColor="#2563eb"
                  hoverEffect="fill-in">
                  <span>View Live</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold">{component.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{component.type}</p>
            <div className="mt-2 flex gap-2">
              {component.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
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
