"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { api, Agent } from "@/lib/api";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listAgents()
      .then(setAgents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      agents.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.code.toLowerCase().includes(query.toLowerCase())
      ),
    [agents, query]
  );

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Agents</h1>
            <p className="mt-1.5 text-white/45">
              {agents.length} productivity agents ready to run.
            </p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-violet-500/40 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => (
            <StaggerItem key={agent.key}>
              <Link href={`/agents/${agent.key}`} className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04] hover:shadow-glow">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-600/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300 transition-colors group-hover:border-violet-500/30">
                      <Bot className="h-5 w-5" />
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-white/30">
                      {agent.code}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </div>
                  <h3 className="relative mt-4 font-medium text-white">{agent.title}</h3>
                  <p className="relative mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/45">
                    {agent.description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}

      {!loading && filtered.length === 0 && (
        <div className="grid place-items-center rounded-3xl border border-white/[0.06] bg-white/[0.02] py-20 text-center">
          <Sparkles className="h-6 w-6 text-white/30" />
          <p className="mt-3 text-sm text-white/45">No agents match “{query}”.</p>
        </div>
      )}
    </div>
  );
}
