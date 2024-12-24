import ServiceCardTypesComponent from './ServiceCardTypesComponent';

export default function ServiceCardTypesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            Service Card Types
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Explore different variants and animations of the ServiceCard component
          </p>
        </div>
        <ServiceCardTypesComponent />
      </div>
    </main>
  );
} 