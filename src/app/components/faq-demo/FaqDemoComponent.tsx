/**
 * FAQ Component Demo
 * 
 * This file provides an interactive demo of the FAQ component
 * with the ability to switch between different style variants.
 */

"use client";

import { FAQ, type FaqData, type FaqVariant, FAQ_VARIANTS } from "@/components/ui/FAQ";
import { useState } from "react";

// FAQ Categories and their questions
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

export default function FaqDemoComponent() {
  const [variant, setVariant] = useState<FaqVariant>("default");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Style Variant:</span>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as FaqVariant)}
            className="border rounded px-2 py-1 text-sm"
          >
            {FAQ_VARIANTS.map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FAQ data={faqData} variant={variant} />
    </div>
  );
}
