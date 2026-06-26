"use client";

import { motion } from "framer-motion";
import { Activity, Inbox, Sparkles, Sun } from "lucide-react";

const rows = [
  { icon: Sun, name: "Morning Briefing", status: "Completed", tone: "text-mint-400", bar: "92%" },
  { icon: Inbox, name: "Inbox Triage", status: "Running", tone: "text-sky-400", bar: "61%" },
  { icon: Activity, name: "Weekly Review", status: "Queued", tone: "text-white/40", bar: "24%" },
];

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong w-full overflow-hidden rounded-3xl p-4 shadow-float"
    >
      <div className="flex items-center justify-between px-2 pb-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-gradient text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium">Agent runs</span>
        </div>
        <span className="rounded-full bg-mint-500/10 px-2.5 py-1 text-xs font-medium text-mint-400">
          Live
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] text-white/70">
              <r.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm text-white/90">{r.name}</span>
                <span className={`text-xs ${r.tone}`}>{r.status}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: r.bar }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-accent-gradient"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Agents", "27"],
          ["Runs today", "148"],
          ["Hours saved", "11.4"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
            <div className="text-lg font-semibold text-white">{value}</div>
            <div className="text-[11px] text-white/40">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
