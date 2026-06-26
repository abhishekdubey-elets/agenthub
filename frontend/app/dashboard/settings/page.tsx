"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.full_name || "");
  const [dark, setDark] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl"
    >
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1.5 text-white/45">Manage your profile and preferences.</p>

      {/* Profile */}
      <section className="mt-8 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white/80">Profile</h2>
        <div className="mt-5 flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-xl font-semibold text-white">
            {(name || user?.email || "U").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="text-white/90">{name || "Your name"}</div>
            <div className="text-sm text-white/40">{user?.email}</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/70">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-ink/60 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-violet-500/50"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/70">Email</span>
            <input
              value={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-ink/40 px-3.5 py-2.5 text-sm text-white/40 outline-none"
            />
          </label>
        </div>
        <Button className="mt-5" size="sm">
          Save changes
        </Button>
      </section>

      {/* Appearance */}
      <section className="mt-5 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h2 className="text-sm font-medium text-white/80">Appearance</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setDark(true)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
              dark
                ? "border-violet-500/40 bg-violet-500/10"
                : "border-white/[0.08] bg-ink/40 hover:border-white/15"
            }`}
          >
            <Moon className="h-5 w-5 text-violet-300" />
            <div>
              <div className="text-sm text-white/85">Dark</div>
              <div className="text-xs text-white/40">Default</div>
            </div>
          </button>
          <button
            onClick={() => setDark(false)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
              !dark
                ? "border-violet-500/40 bg-violet-500/10"
                : "border-white/[0.08] bg-ink/40 hover:border-white/15"
            }`}
          >
            <Sun className="h-5 w-5 text-amber-300" />
            <div>
              <div className="text-sm text-white/85">Light</div>
              <div className="text-xs text-white/40">Coming soon</div>
            </div>
          </button>
        </div>
      </section>
    </motion.div>
  );
}
