"use client";

import { HelpCircle } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    q: "How is this different from Zapier or Make?",
    a: "Those tools move data between apps with rigid rules. AgentHub runs AI agents that reason over your actual context — reading your calendar and inbox to produce finished work like a briefing or a triaged inbox, not just routing fields.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. Every agent works out of the box from plain-language input, and the visual builder lets you chain them with drag-and-drop. If you do want to automate from your own stack, there's a typed SDK and REST API.",
  },
  {
    q: "Which model powers the agents?",
    a: "Agents run on OpenAI's latest models by default, with the model configurable per workspace. Your inputs are never used to train public models.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Data is encrypted in transit and at rest, API keys are scoped, and you get full run history and audit logs. We're built to SOC 2 controls.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Plans are month-to-month (or annual for the discount), and you can downgrade to the free Starter tier whenever you like — your run history stays intact.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeading
        eyebrow="FAQ"
        icon={<HelpCircle className="h-3.5 w-3.5 text-violet-400" />}
        title="Questions, answered"
      />
      <Reveal className="mt-12">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
