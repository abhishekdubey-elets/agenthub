"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Lock,
  Sparkles,
  Workflow,
} from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: Bot,
    title: "27 specialized agents",
    body: "From morning briefings to decision journals — each agent is tuned for one job and does it exceptionally well.",
    tone: "from-violet-500/20",
  },
  {
    icon: Workflow,
    title: "Visual workflow builder",
    body: "Chain agents on an infinite canvas with animated connections. No code, full control.",
    tone: "from-iris-500/20",
  },
  {
    icon: BrainCircuit,
    title: "Context-aware reasoning",
    body: "Agents read your real calendar, inbox and notes — and reason over them, not just template fields.",
    tone: "from-sky-500/20",
  },
  {
    icon: LayoutDashboard,
    title: "Unified command center",
    body: "Every run, output and insight in one elegant dashboard. Finally, a single place to think.",
    tone: "from-mint-500/20",
  },
  {
    icon: LineChart,
    title: "Run analytics",
    body: "See hours saved, run reliability and where your agents create the most leverage.",
    tone: "from-violet-500/20",
  },
  {
    icon: KeyRound,
    title: "API & SDK",
    body: "Trigger any agent from your own stack with a typed SDK and clean REST endpoints.",
    tone: "from-iris-500/20",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Platform"
        icon={<Sparkles className="h-3.5 w-3.5 text-violet-400" />}
        title={
          <>
            Everything you need to put
            <br className="hidden sm:block" /> your routines on autopilot.
          </>
        }
        description="A complete AI workspace — agents, a builder, analytics and an API — designed to feel effortless."
      />

      <StaggerGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <SpotlightCard className="h-full">
              <motion.div
                whileHover={{ rotateX: -12, rotateY: 12, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                style={{ transformStyle: "preserve-3d" }}
                className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br ${f.tone} to-transparent`}
              >
                <f.icon className="h-5 w-5 text-white" />
              </motion.div>
              <h3 className="text-lg font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{f.body}</p>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Wide feature: security */}
      <StaggerGroup className="mt-5">
        <StaggerItem>
          <div className="glass relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl p-8 md:flex-row md:items-center">
            <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-mint-500/10 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Lock className="h-5 w-5 text-mint-400" />
              </span>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Enterprise-grade by default
                </h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/50">
                  Encrypted at rest and in transit, scoped API keys, and full run history.
                  Your context never trains a public model.
                </p>
              </div>
            </div>
            <div className="relative flex flex-wrap gap-2">
              {["SOC 2 ready", "Encrypted", "Scoped keys", "Audit log"].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
