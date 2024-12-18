import { SvgTraceBackgroundComponent } from './SvgTraceBackgroundComponent';
import Image from 'next/image';

const placeholderSections = [
  {
    title: "Introduction to Design Systems",
    content: `A design system is a complete set of standards intended to manage design at scale using reusable components and patterns. When properly implemented, a design system can streamline the design and development process, ensure consistency across products, and improve the overall user experience.
    
    Design systems have become increasingly important as organizations scale their digital products and services. They serve as a single source of truth for designers and developers, providing guidelines, components, and patterns that can be reused across different projects.`,
        image: "/images/placeholder-wide.svg"
  },
  {
    title: "Core Principles of System Design",
    content: `The foundation of any successful design system rests on several core principles that guide its development and implementation. These principles ensure that the system remains useful, maintainable, and scalable over time.
    
    Consistency is perhaps the most crucial principle. A design system should provide a unified experience across all touchpoints, making products feel cohesive and familiar to users. This consistency extends to visual elements, interaction patterns, and even the tone of voice used in the interface.
    
    Reusability is another key principle. Components and patterns within the system should be designed to be reusable across different contexts and scenarios. This not only improves efficiency but also helps maintain consistency.`,
      image: "/images/placeholder-wide.svg"
  },
  {
    title: "Implementation Strategies",
    content: `Successfully implementing a design system requires careful planning and coordination between different teams. The implementation strategy should consider the organization's specific needs, resources, and constraints.
    
    One common approach is to start small and gradually expand the system. This might involve beginning with basic components and patterns, then adding more complex elements as the system matures. This incremental approach allows teams to learn and adjust as they go.
    
    Documentation plays a crucial role in implementation. Comprehensive documentation should cover not only how to use the system but also the reasoning behind design decisions. This helps ensure that teams understand both the how and why of the system.`,
      image: "/images/placeholder-wide.svg"
  },
  {
    title: "Maintaining and Evolving the System",
    content: `A design system is never truly finished. It needs to evolve alongside the products it supports and the organization's needs. Regular maintenance and updates are essential to keep the system relevant and effective.
    
    This involves not only fixing issues as they arise but also proactively improving the system based on user feedback and changing requirements. Teams should establish clear processes for reviewing and updating the system.
    
    Version control and change management are critical aspects of maintenance. Changes to the system should be carefully tracked and communicated to all stakeholders. This helps teams understand what has changed and why.
    
    Regular audits can help ensure that the system remains aligned with its original goals and principles. These audits might look at consistency, performance, accessibility, and other key metrics.`,
    image: "/images/placeholder-wide.svg"
  }
];

export default function Page() {
  return (
    <div className="min-h-[100vh] w-full dark:bg-black dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="max-w-7xl mx-auto pt-20">
        <SvgTraceBackgroundComponent>
          <div className="space-y-24">
            {placeholderSections.map((section, i) => (
              <div key={i} className="bg-white dark:bg-black p-8 rounded-lg border border-gray-600">
                <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {section.content.split('\n\n').map((paragraph, j) => (
                    <p key={j} className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SvgTraceBackgroundComponent>
      </div>
    </div>
  );
} 