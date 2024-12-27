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
      default: "bg-transparent p-0",  // Override default shadcn styles
      bordered: "bg-muted p-1 rounded-xl",
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

// Available variants for the FAQ component
// Add new variants here and they'll automatically be available in the demo
export const FAQ_VARIANTS = ["default", "bordered"] as const;
export type FaqVariant = typeof FAQ_VARIANTS[number];

/*
  Example FAQ Data
  const faqData: FaqData = {
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
  }
*/
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
  /** Color to use for active states and accents. Defaults to current text color. */
  color?: string;
}

export function FAQ({ data, variant = "default", className, color }: FaqProps) {
  return (
    <Tabs defaultValue={Object.keys(data)[0]} className={cn("w-full", className)}>
      <div className="flex justify-center mb-4">
        <TabsList 
          className={cn(
            "inline-flex items-center justify-center bg-transparent",
            tabsVariants({ variant })
          )}
        >
          {Object.entries(data).map(([key, { label }]) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                variant === "default" && "rounded-md"
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {Object.entries(data).map(([key, { questions }]) => (
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

export { type FaqData, type FaqQuestion, type FaqCategory } 