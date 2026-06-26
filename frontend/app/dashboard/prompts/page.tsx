"use client";

import { BookOpen } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ModuleShell } from "@/components/app/ModuleShell";

export default function PromptsPage() {
  return (
    <AppShell>
      <ModuleShell
        icon={BookOpen}
        eyebrow="Prompt Library"
        title="Your best prompts, versioned."
        description="Save, organize and reuse the prompts that power your agents. Fork, A/B test and roll back — with variables and team sharing."
        roadmap={[
          "Reusable prompts with typed variables",
          "Version history and diffing",
          "A/B test variants on real runs",
          "Share across your workspace",
        ]}
        preview={
          <div className="grid grid-cols-2 gap-2.5">
            {[
              "Morning brief",
              "Cold outreach",
              "Meeting recap",
              "Decision memo",
            ].map((name, i) => (
              <div
                key={name}
                className="rounded-2xl border border-white/[0.06] bg-ink/40 p-4"
              >
                <div className="mb-2 h-1.5 w-8 rounded-full bg-accent-gradient" />
                <div className="text-sm text-white/80">{name}</div>
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
                  <div className="h-1.5 w-2/3 rounded-full bg-white/[0.06]" />
                </div>
                <div className="mt-3 text-[11px] text-white/30">v{i + 2} · 3 vars</div>
              </div>
            ))}
          </div>
        }
      />
    </AppShell>
  );
}
