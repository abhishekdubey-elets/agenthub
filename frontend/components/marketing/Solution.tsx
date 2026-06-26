"use client";

import { motion } from "framer-motion";
import {
  Brain,
  CalendarDays,
  FileOutput,
  Inbox,
  MessageSquare,
  Workflow,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const sources = [
  { icon: CalendarDays, label: "Calendar" },
  { icon: Inbox, label: "Inbox & Slack" },
  { icon: MessageSquare, label: "Notes" },
];

const steps = [
  {
    n: "01",
    title: "Connect your context",
    body: "Calendar, inbox, notes and docs flow in. Agents read what's actually happening — no rules to maintain.",
  },
  {
    n: "02",
    title: "Agents reason, not just route",
    body: "Each agent runs a focused prompt over your real inputs: weighing priorities, summarizing, drafting, deciding.",
  },
  {
    n: "03",
    title: "You get a finished output",
    body: "A morning brief, a triaged inbox, a decision log — review-ready in seconds, delivered where you work.",
  },
];

export function Solution() {
  return (
    <section id="solution" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="How it works"
        icon={<Workflow className="h-3.5 w-3.5 text-sky-400" />}
        title={
          <>
            Context in. <span className="text-gradient-accent">Finished work</span> out.
          </>
        }
        description="A clean pipeline behind every agent — your data, an intelligent reasoning step, and a polished result you simply approve."
      />

      {/* Animated flow diagram */}
      <Reveal>
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-12">
          <div className="absolute inset-0 bg-dotgrid opacity-30" />
          <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {/* Sources */}
            <div className="space-y-3">
              {sources.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
                >
                  <s.icon className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/75">{s.label}</span>
                </motion.div>
              ))}
            </div>

            <Connector />

            {/* Agent core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto"
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-violet-600/30 blur-2xl" />
              <div className="glow-border relative grid h-28 w-28 place-items-center rounded-3xl">
                <div className="grid h-full w-full place-items-center rounded-3xl bg-surface/90">
                  <Brain className="h-9 w-9 text-violet-400" />
                </div>
              </div>
              <span className="mt-3 block text-center text-xs font-medium text-white/50">
                Agent engine
              </span>
            </motion.div>

            <Connector />

            {/* Output */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-strong rounded-2xl p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <FileOutput className="h-4 w-4 text-mint-400" />
                <span className="text-sm font-medium text-white/85">Morning Brief</span>
              </div>
              <div className="space-y-1.5">
                {[90, 70, 80, 55].map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: `${w}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                    className="h-1.5 rounded-full bg-white/10"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Reveal>

      {/* Timeline steps */}
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.1}>
            <div className="group relative h-full rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-white/12">
              <span className="text-sm font-semibold text-violet-400/80">{step.n}</span>
              <h3 className="mt-3 text-lg font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Animated dashed SVG connector with a travelling pulse. */
function Connector() {
  return (
    <div className="relative hidden h-px w-full min-w-[60px] md:block">
      <svg className="absolute inset-0 h-6 w-full -translate-y-1/2" preserveAspectRatio="none">
        <motion.line
          x1="0"
          y1="12"
          x2="100%"
          y2="12"
          stroke="url(#flowgrad)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <defs>
          <linearGradient id="flowgrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139,92,246,0.2)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.9)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.2)" />
          </linearGradient>
        </defs>
      </svg>
      <motion.span
        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_12px_3px_rgba(56,189,248,0.7)]"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
