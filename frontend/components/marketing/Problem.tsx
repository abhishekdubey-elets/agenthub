"use client";

import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const oldWay = [
  "Brittle if-this-then-that chains that break silently",
  "A new disconnected tool for every tiny task",
  "Hours lost stitching triggers, zaps and webhooks",
  "Zero understanding of context or nuance",
  "You're still the one doing the thinking",
];

const newWay = [
  "Agents that reason over your real context",
  "One workspace for every daily ritual",
  "Set up in minutes, in plain language",
  "Understands priorities, tone and intent",
  "You review the output, not do the work",
];

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="The problem"
        icon={<Zap className="h-3.5 w-3.5 text-violet-400" />}
        title={
          <>
            Automation tools were built for
            <span className="text-white/40"> tasks, not thinking.</span>
          </>
        }
        description="Zapier, Make and a dozen point tools can move data around. They can't run your morning, weigh a decision, or know what actually matters today."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {/* Old way */}
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-500/10 text-red-400">
                <X className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">Yesterday</p>
                <p className="font-medium text-white/80">Traditional automation</p>
              </div>
            </div>
            <ul className="space-y-3.5">
              {oldWay.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-sm text-white/45"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400/70" />
                  <span className="line-through decoration-white/15">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* New way */}
        <Reveal delay={0.1}>
          <div className="glow-border relative h-full overflow-hidden rounded-3xl">
            <div className="relative h-full rounded-3xl bg-surface/70 p-8 backdrop-blur-xl">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="relative mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-white">
                  <Zap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/35">With AgentHub</p>
                  <p className="font-medium text-white">An AI workspace</p>
                </div>
              </div>
              <ul className="relative space-y-3.5">
                {newWay.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 text-sm text-white/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
