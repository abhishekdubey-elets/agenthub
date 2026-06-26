"use client";

import { Clock, Zap } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ModuleShell } from "@/components/app/ModuleShell";

export default function AutomationsPage() {
  return (
    <AppShell>
      <ModuleShell
        icon={Zap}
        eyebrow="Automations"
        title="Agents that run themselves."
        description="Schedule any agent or workflow to run on a cadence or trigger — your morning brief at 6am, inbox triage hourly, weekly review every Friday."
        roadmap={[
          "Cron-style and natural-language schedules",
          "Event triggers (new email, calendar change)",
          "Delivery to email, Slack or webhook",
          "Pause, retry and run-history per automation",
        ]}
        preview={
          <div className="space-y-2.5">
            {[
              ["Morning Briefing", "Every day · 6:00 AM", "text-mint-400"],
              ["Inbox Triage", "Hourly · 9–6", "text-sky-400"],
              ["Weekly Review", "Fridays · 4:00 PM", "text-violet-400"],
            ].map(([name, when, tone]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-ink/40 p-3.5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04]">
                  <Clock className={`h-4 w-4 ${tone}`} />
                </span>
                <div className="flex-1">
                  <div className="text-sm text-white/85">{name}</div>
                  <div className="text-xs text-white/40">{when}</div>
                </div>
                <span className="h-5 w-9 rounded-full bg-mint-500/20 p-0.5">
                  <span className="ml-auto block h-4 w-4 translate-x-4 rounded-full bg-mint-400" />
                </span>
              </div>
            ))}
          </div>
        }
      />
    </AppShell>
  );
}
