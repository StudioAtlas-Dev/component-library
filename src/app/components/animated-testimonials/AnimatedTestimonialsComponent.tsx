import TestimonialCarousel from '@/components/ui/TestimonialCarousel';

interface TestimonialData {
  quote: string;
  author: {
    name: string;
    title: string;
    image: string;
  };
}

const testimonials: TestimonialData[] = [
  {
    quote: "The attention to detail and user experience in this component library is exceptional. It's saved us countless hours of development time while maintaining a premium feel across our entire application.",
    author: {
      name: "Sarah Chen",
      title: "Head of Product, TechFlow",
      image: "/testimonials/person1.jpg"
    }
  },
  {
    quote: "What sets this library apart is how seamlessly the components adapt to our brand. The customization options are powerful yet intuitive - exactly what our design team needed.",
    author: {
      name: "Marcus Rodriguez",
      title: "Design Director, InnovateLab",
      image: "/testimonials/person2.jpg"
    }
  },
  {
    quote: "I've worked with many component libraries, but this one strikes the perfect balance between flexibility and consistency. The documentation is clear, and the components just work as expected.",
    author: {
      name: "Emily Parker",
      title: "Senior Frontend Engineer, BuildScale",
      image: "/testimonials/person3.jpg"
    }
  }
];

interface AnimatedTestimonialsProps {
  backgroundColor?: string;
  popColor?: string;
}

export default function AnimatedTestimonialsComponent({
  backgroundColor = '#f6f7f9',
  popColor = '#2563eb'
}: AnimatedTestimonialsProps) {
  return (
    <section 
      className="w-full py-16 min-h-screen" 
      style={{ backgroundColor }}
      role="region"
      aria-label="Client testimonials"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 
            className="text-sm font-semibold uppercase tracking-wider mb-3" 
            role="heading" 
            aria-level={1}
            aria-label="Client testimonials section"
            style={{ color: popColor }}
          >
            Testimonials
          </h3>
          <h2 
            className="text-4xl font-bold mb-4"
            role="heading"
            aria-level={2}
          >
            Built by developers, refined by experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our components are battle-tested in production by teams who value quality, performance, and developer experience.
          </p>
        </div>

        <div 
          className="relative w-full overflow-hidden"
          role="region"
          aria-label="Client testimonials carousel"
        >
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
