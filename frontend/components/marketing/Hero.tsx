"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "./AuroraBackground";
import { CodeWindow } from "./CodeWindow";
import { DashboardPreview } from "./DashboardPreview";
import { Button } from "@/components/ui/Button";

const easing = [0.16, 1, 0.3, 1] as const;

const floatingNodes = [
  { label: "Briefing", x: "6%", y: "20%", delay: 0 },
  { label: "Triage", x: "84%", y: "14%", delay: 0.6 },
  { label: "Review", x: "90%", y: "62%", delay: 1.1 },
  { label: "Journal", x: "3%", y: "66%", delay: 1.6 },
];

export function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgba(139,92,246,0.12), transparent 60%)`;

  return (
    <section
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative overflow-hidden pb-24 pt-40"
    >
      <AuroraBackground />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />

      {/* Floating workflow nodes */}
      {!reduce &&
        floatingNodes.map((n) => (
          <motion.div
            key={n.label}
            className="absolute hidden lg:block"
            style={{ left: n.x, top: n.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
            transition={{
              opacity: { delay: 0.8 + n.delay, duration: 0.6 },
              scale: { delay: 0.8 + n.delay, duration: 0.6 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: n.delay },
            }}
          >
            <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2 shadow-card">
              <span className="h-2 w-2 rounded-full bg-mint-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]" />
              <span className="text-xs font-medium text-white/70">{n.label}</span>
            </div>
          </motion.div>
        ))}

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing }}
            className="flex justify-center"
          >
            <Link
              href="#features"
              className="glass group inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm text-white/70 transition-colors hover:text-white"
            >
              <span className="rounded-full bg-accent-gradient px-2.5 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              27 productivity agents, one workspace
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: easing, delay: 0.1 }}
            className="mt-7 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="text-gradient">The AI workspace</span>
            <br />
            <span className="text-white/90">that runs your day.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/55"
          >
            Briefings, inbox triage, weekly reviews, decision journals — a hub of
            focused AI agents that handle the rituals, so you stay on the work that
            actually compounds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.35 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/register">
                Start building free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="#solution">
                <Play className="h-4 w-4" />
                See how it works
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            No credit card · Free for your first 100 runs
          </motion.p>
        </div>

        {/* Floating previews */}
        <div className="relative mx-auto mt-20 grid max-w-5xl grid-cols-1 items-end gap-6 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easing, delay: 0.5 }}
            className="md:col-span-3"
          >
            <CodeWindow />
          </motion.div>
          <div className="md:col-span-2">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
