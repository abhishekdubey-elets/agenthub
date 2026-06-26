"use client";

import { motion } from "framer-motion";
import { Activity, Clock, TrendingUp, Zap } from "lucide-react";
import AppShell from "@/components/AppShell";

const kpis = [
  { label: "Total runs", value: "1,482", delta: "+18%", icon: Activity },
  { label: "Hours saved", value: "47.5", delta: "+12%", icon: Clock },
  { label: "Active agents", value: "14", delta: "+3", icon: Zap },
  { label: "Success rate", value: "99.4%", delta: "+0.6%", icon: TrendingUp },
];

const weekly = [42, 58, 49, 71, 63, 88, 76];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const leaderboard = [
  { name: "Morning Briefing", runs: 312, pct: 100 },
  { name: "Inbox Triage", runs: 284, pct: 91 },
  { name: "Weekly Review", runs: 156, pct: 50 },
  { name: "Decision Journal", runs: 98, pct: 31 },
  { name: "Delegation Tracker", runs: 64, pct: 20 },
];

export default function AnalyticsPage() {
  const max = Math.max(...weekly);
  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1.5 text-white/45">Your workspace performance over the last 7 days.</p>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] text-violet-300">
                  <kpi.icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-mint-400">{kpi.delta}</span>
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight">{kpi.value}</div>
              <div className="text-xs text-white/40">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Bar chart */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-white/80">Runs this week</h2>
            <div className="mt-8 flex h-52 items-end justify-between gap-3">
              {weekly.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex w-full flex-1 items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(v / max) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full rounded-t-lg bg-accent-gradient"
                    />
                  </div>
                  <span className="text-xs text-white/35">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
            <h2 className="text-sm font-medium text-white/80">Top agents</h2>
            <div className="mt-5 space-y-4">
              {leaderboard.map((a, i) => (
                <div key={a.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-white/75">{a.name}</span>
                    <span className="text-white/40">{a.runs}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.9 }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
