"use client";

import { motion } from "framer-motion";

const lines: { tokens: { t: string; c?: string }[] }[] = [
  { tokens: [{ t: "import", c: "text-violet-400" }, { t: " { AgentHub } " }, { t: "from", c: "text-violet-400" }, { t: " ", }, { t: "'@agenthub/sdk'", c: "text-mint-400" }] },
  { tokens: [] },
  { tokens: [{ t: "const", c: "text-violet-400" }, { t: " hub " }, { t: "=", c: "text-white/50" }, { t: " " }, { t: "new", c: "text-violet-400" }, { t: " AgentHub", c: "text-sky-400" }, { t: "(", c: "text-white/50" }, { t: "process", c: "text-sky-400" }, { t: ".env.KEY", c: "text-white/70" }, { t: ")", c: "text-white/50" }] },
  { tokens: [] },
  { tokens: [{ t: "// run your morning briefing", c: "text-white/30" }] },
  { tokens: [{ t: "const", c: "text-violet-400" }, { t: " brief " }, { t: "=", c: "text-white/50" }, { t: " " }, { t: "await", c: "text-violet-400" }, { t: " hub.agents", c: "text-white/80" }, { t: ".run", c: "text-sky-400" }, { t: "({", c: "text-white/50" }] },
  { tokens: [{ t: "  agent" }, { t: ":", c: "text-white/50" }, { t: " " }, { t: "'morning-briefing'", c: "text-mint-400" }, { t: "," }] },
  { tokens: [{ t: "  input" }, { t: ":", c: "text-white/50" }, { t: " " }, { t: "{ calendar, priorities, inbox }", c: "text-white/80" }, { t: "," }] },
  { tokens: [{ t: "})", c: "text-white/50" }] },
];

export function CodeWindow() {
  return (
    <div className="glow-border w-full overflow-hidden rounded-3xl shadow-float">
      <div className="rounded-3xl bg-[#0b0b10]/95">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-white/40">briefing.ts</span>
        </div>
        <div className="px-5 py-5 font-mono text-[13px] leading-6">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
              className="flex"
            >
              <span className="mr-4 select-none text-white/20">{i + 1}</span>
              <span className="whitespace-pre">
                {line.tokens.length === 0 ? " " : line.tokens.map((tk, j) => (
                  <span key={j} className={tk.c ?? "text-white/85"}>
                    {tk.t}
                  </span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
