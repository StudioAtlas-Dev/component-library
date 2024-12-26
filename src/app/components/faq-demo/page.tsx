import FaqDemoComponent from './FaqDemoComponent';

export default function FaqDemoPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            FAQ Demo Options
          </h1>
        </div>
        <FaqDemoComponent />
      </div>
    </main>
  );
} 