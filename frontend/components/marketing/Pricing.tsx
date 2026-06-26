"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    tagline: "For trying the workspace",
    features: [
      "5 core agents",
      "100 runs / month",
      "1 workspace",
      "Community support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 29,
    yearly: 23,
    tagline: "For operators running daily",
    features: [
      "All 27 agents",
      "Unlimited runs",
      "Visual workflow builder",
      "API & SDK access",
      "Run analytics",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Scale",
    monthly: 99,
    yearly: 79,
    tagline: "For teams & power users",
    features: [
      "Everything in Pro",
      "5 team seats",
      "Shared knowledge base",
      "SSO & audit log",
      "Dedicated success manager",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Pricing"
        icon={<Sparkles className="h-3.5 w-3.5 text-violet-400" />}
        title="Simple pricing that scales with you"
        description="Start free. Upgrade when your agents are saving you hours — which won't take long."
      />

      <div className="mt-8 flex items-center justify-center gap-3">
        <span className={cn("text-sm", !yearly ? "text-white" : "text-white/40")}>
          Monthly
        </span>
        <button
          onClick={() => setYearly((v) => !v)}
          className="relative h-7 w-12 rounded-full border border-white/10 bg-white/[0.04] p-0.5"
          aria-label="Toggle billing period"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="block h-5 w-5 rounded-full bg-accent-gradient"
            style={{ marginLeft: yearly ? "1.25rem" : 0 }}
          />
        </button>
        <span className={cn("text-sm", yearly ? "text-white" : "text-white/40")}>
          Yearly
          <span className="ml-1.5 rounded-full bg-mint-500/10 px-2 py-0.5 text-xs text-mint-400">
            −20%
          </span>
        </span>
      </div>

      <StaggerGroup className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          return (
            <StaggerItem key={plan.name} className="h-full">
              <div
                className={cn(
                  "relative h-full",
                  plan.highlight && "glow-border md:-mt-4 md:mb-4"
                )}
              >
                <div
                  className={cn(
                    "flex h-full flex-col rounded-3xl p-7",
                    plan.highlight
                      ? "bg-surface/80 backdrop-blur-xl"
                      : "border border-white/[0.07] bg-white/[0.02]"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute right-6 top-7 rounded-full bg-accent-gradient px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-white/45">{plan.tagline}</p>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-5xl font-semibold tracking-tight text-white">
                      ${price}
                    </span>
                    <span className="mb-1.5 text-sm text-white/40">/ month</span>
                  </div>
                  {yearly && plan.monthly > 0 && (
                    <p className="mt-1 text-xs text-white/35">
                      billed annually · ${price * 12}/yr
                    </p>
                  )}

                  <Button
                    asChild
                    variant={plan.highlight ? "primary" : "secondary"}
                    className="mt-6 w-full"
                  >
                    <Link href="/register">{plan.cta}</Link>
                  </Button>

                  <ul className="mt-7 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                        <Check
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            plan.highlight ? "text-violet-400" : "text-mint-400"
                          )}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
