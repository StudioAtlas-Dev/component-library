"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Style resolution with cn() works right-to-left, meaning later classes override earlier ones.
// For example, if a variant includes "font-bold" and it's passed after the base styles that include "font-semibold",
// the variant's "font-bold" will win. The order in cn() calls below is:
// 1. Base styles (first argument)
// 2. Variant styles (from accordionVariants)
// 3. Custom className prop (last argument)

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",  // Uses base styles from Accordion component
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & 
  VariantProps<typeof accordionVariants>
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles - can be overridden by variant styles or className
      "border rounded-lg divide-y",
      accordionVariants({ variant }),
      className
    )}
    {...props}
  />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles - if a variant or className includes any of these properties (like font-bold instead of font-semibold),
        // the variant/className values will override these base styles
        "flex flex-1 items-center justify-between py-4 font-semibold text-sm transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants
}
