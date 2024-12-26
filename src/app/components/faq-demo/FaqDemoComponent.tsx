/**
 * FAQ Component Demo
 * 
 * This file exports two components:
 * 
 * 1. FAQ - A server component that can be imported and used directly:
 *    ```tsx
 *    import { FAQ } from "@/app/components/faq-demo/FaqDemoComponent";
 *    
 *    // Use with a specific variant
 *    <FAQ variant="default" />
 *    ```
 * 
 * 2. FaqDemoComponent - A client component that provides an interactive demo
 *    with style switching capabilities. This is the default export.
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
  accordionVariants 
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VariantProps } from "class-variance-authority";

// FAQ Categories and their questions
const faqData = {
  general: {
    label: "General Questions",
    questions: [
      {
        question: "What services do you provide?",
        answer: "We offer a comprehensive range of digital solutions including web development, UI/UX design, and software consulting. Our team specializes in creating modern, scalable applications tailored to your business needs."
      },
      {
        question: "How long does a typical project take?",
        answer: "Project timelines vary depending on complexity and scope. A simple website might take 4-6 weeks, while a complex application could take 3-6 months. We'll provide a detailed timeline during our initial consultation."
      }
    ]
  },
  technical: {
    label: "Technical Support",
    questions: [
      {
        question: "What technologies do you use?",
        answer: "We use cutting-edge technologies including React, Next.js, TypeScript, and Node.js. Our tech stack is carefully chosen to ensure optimal performance, scalability, and maintainability."
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes, we offer comprehensive maintenance and support packages. This includes regular updates, security patches, and technical assistance to keep your application running smoothly."
      }
    ]
  },
  pricing: {
    label: "Pricing & Plans",
    questions: [
      {
        question: "How do you structure your pricing?",
        answer: "Our pricing is project-based and transparent. We provide detailed quotes based on your specific requirements, timeline, and desired features. We also offer flexible payment plans to accommodate different budgets."
      },
      {
        question: "Do you offer custom packages?",
        answer: "Absolutely! We understand that every project is unique. We'll work with you to create a custom package that meets your specific needs and budget while ensuring the highest quality of service."
      }
    ]
  }
};

type AccordionVariant = NonNullable<VariantProps<typeof accordionVariants>["variant"]>;


// Server Component for the actual FAQ
export function FAQ({ variant = "default" as AccordionVariant }) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="w-full justify-start mb-4 bg-transparent p-0 gap-2">
        {Object.entries(faqData).map(([key, { label }]) => (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(faqData).map(([key, { questions }]) => (
        <TabsContent key={key} value={key}>
          <Accordion
            type="multiple"
            variant={variant}
            className="space-y-2"
          >
            {questions.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`${key}-${index}`}
                className="px-4"
              >
                <AccordionTrigger>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/**
 * FAQ Demo Component
 * 
 * A client component that provides an interactive demo of the FAQ component
 * with the ability to switch between different style variants.
 * 
 * @example
 * ```tsx
 * import FaqDemoComponent from "@/app/components/faq-demo/FaqDemoComponent";
 * 
 * // In your component:
 * <FaqDemoComponent />
 * ```
 */

const VARIANTS = ["default", "bordered", "minimal"] as const;

export default function FaqDemoComponent() {
  const [variant, setVariant] = useState<AccordionVariant>("default");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Style Variant:</span>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as AccordionVariant)}
            className="border rounded px-2 py-1 text-sm"
          >
            {VARIANTS.map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FAQ variant={variant} />
    </div>
  );
}
