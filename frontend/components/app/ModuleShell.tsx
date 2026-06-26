"use client";

import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

/**
 * Premium "in development" module shell. Renders a real, designed preview of an
 * upcoming workspace module with its roadmap — not a lorem placeholder.
 */
export function ModuleShell({
  icon: Icon,
  eyebrow,
  title,
  description,
  roadmap,
  preview,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  roadmap: string[];
  preview?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center"
    >
      <div>
        <Badge>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          {eyebrow}
        </Badge>
        <Icon className="mb-3 mt-5 h-8 w-8 text-violet-400" />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-white/50">{description}</p>

        <div className="mt-7 space-y-3">
          {roadmap.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-3 text-sm text-white/70"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full border border-violet-500/30 bg-violet-500/10">
                <Check className="h-3 w-3 text-violet-400" />
              </span>
              {item}
            </motion.div>
          ))}
        </div>

        <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/55">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
          </span>
          In active development
        </span>
      </div>

      <div className="glow-border rounded-3xl">
        <div className="relative min-h-[22rem] overflow-hidden rounded-3xl bg-surface/60 p-6 backdrop-blur-xl">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="relative">{preview}</div>
        </div>
      </div>
    </motion.div>
  );
}
