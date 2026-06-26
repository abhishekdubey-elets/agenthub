"use client";

import { Workflow } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ModuleShell } from "@/components/app/ModuleShell";

export default function WorkflowsPage() {
  return (
    <AppShell>
      <ModuleShell
        icon={Workflow}
        eyebrow="Workflow Builder"
        title="Chain agents on a canvas."
        description="A visual node editor — like n8n or Langflow — where you connect agents with animated paths, branch on conditions, and ship multi-step automations without code."
        roadmap={[
          "Infinite pan & zoom canvas with minimap",
          "Drag-to-connect animated SVG edges",
          "Searchable node palette by category",
          "Run, debug and schedule whole flows",
        ]}
        preview={
          <div className="relative h-72 rounded-2xl border border-white/[0.06] bg-ink/40 bg-dotgrid">
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <path d="M120 70 C 180 70, 180 150, 240 150" stroke="url(#edge)" strokeWidth="2" fill="none" strokeDasharray="6 6">
                <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />
              </path>
              <path d="M120 220 C 180 220, 180 150, 240 150" stroke="url(#edge)" strokeWidth="2" fill="none" strokeDasharray="6 6">
                <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />
              </path>
            </svg>
            <Node className="left-4 top-10" label="Calendar" />
            <Node className="left-4 top-48" label="Inbox" />
            <Node className="left-[220px] top-[120px]" label="Briefing" accent />
          </div>
        }
      />
    </AppShell>
  );
}

function Node({
  className,
  label,
  accent,
}: {
  className?: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
        accent
          ? "border-violet-500/40 bg-violet-500/10 text-white"
          : "border-white/10 bg-surface/80 text-white/70"
      } ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${accent ? "bg-violet-400" : "bg-mint-400"}`} />
      {label}
    </div>
  );
}
