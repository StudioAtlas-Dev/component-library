'use client';

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getComponents } from '@/store/components';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ComponentPage({ params }: Props) {
  const components = await getComponents();
  const component = components.find(c => c.path === params.slug);

  if (!component) {
    notFound();
  }

  // Dynamically import the component based on the path
  const DynamicComponent = dynamic(() => import(`@/app/components/${params.slug}/PhotographyHeroComponent`), {
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <p>Loading component...</p>
      </div>
    ),
  });

  return (
    <div className="min-h-screen">
      <DynamicComponent />
    </div>
  );
}
