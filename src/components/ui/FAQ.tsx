"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
  accordionVariants
} from "@/components/ui/accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define variants for tabs similar to accordion
const tabsVariants = cva("", {
  variants: {
    variant: {
      default: "",  // Uses base styles
      bordered: "border rounded-xl overflow-hidden",
      minimal: "bg-transparent",
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

// Define FAQ variants that control both tabs and accordion
const faqVariants = cva("", {
  variants: {
    variant: {
      default: "",  // Both use their default variants
      bordered: "", // Both use bordered variants
      minimal: "",  // Both use minimal variants
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

export type FaqVariant = NonNullable<VariantProps<typeof faqVariants>["variant"]>;

// FAQ data type definitions
interface FaqQuestion {
  question: string;
  answer: string;
}

interface FaqCategory {
  label: string;
  questions: FaqQuestion[];
}

interface FaqData {
  [key: string]: FaqCategory;
}

interface FaqProps {
  data: FaqData;
  variant?: FaqVariant;
  className?: string;
}

export function FAQ({ data, variant = "default", className }: FaqProps) {
  // Map FAQ variant to component variants
  const componentVariant = variant;

  return (
    <Tabs defaultValue={Object.keys(data)[0]} className={cn("w-full", className)}>
      <TabsList 
        className={cn(
          "w-full justify-start mb-4 bg-transparent p-0 gap-2",
          tabsVariants({ variant: componentVariant })
        )}
      >
        {Object.entries(data).map(([key, { label }]) => (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(data).map(([key, { questions }]) => (
        <TabsContent key={key} value={key}>
          <Accordion
            type="multiple"
            variant={componentVariant}
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

export { type FaqData, type FaqQuestion, type FaqCategory } 