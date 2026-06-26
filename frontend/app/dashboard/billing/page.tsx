"use client";

import { motion } from "framer-motion";
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const proFeatures = [
  "All 27 agents unlocked",
  "Unlimited monthly runs",
  "Visual workflow builder",
  "API & SDK access",
  "Run analytics & history",
  "Priority support",
];

export default function BillingPage() {
  return (
    <AppShell>
      <BillingContent />
    </AppShell>
  );
}

function BillingContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const isPro = user?.plan === "pro";

  async function upgrade() {
    setLoading(true);
    setNote(null);
    try {
      const { checkout_url } = await api.createCheckout();
      window.location.href = checkout_url;
    } catch (e) {
      // Backend returns 503 until Stripe keys are configured — surface clearly.
      setNote(
        e instanceof Error
          ? e.message
          : "Billing isn't configured yet. Add Stripe keys to the backend .env."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-1.5 text-white/45">Manage your plan and payment.</p>

      {/* Current plan */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.04] text-violet-300">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-white">
                {isPro ? "Pro" : "Starter"} plan
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isPro ? "bg-mint-500/10 text-mint-400" : "bg-white/[0.06] text-white/50"
                }`}
              >
                {isPro ? "Active" : "Free"}
              </span>
            </div>
            <p className="text-sm text-white/45">
              {isPro
                ? "Unlimited runs and all agents."
                : "5 agents · 100 runs / month."}
            </p>
          </div>
        </div>
        {!isPro && (
          <Button onClick={upgrade} disabled={loading} size="lg">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Upgrade to Pro
          </Button>
        )}
      </div>

      {note && (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {note}
        </div>
      )}

      {/* Pro card */}
      {!isPro && (
        <div className="glow-border mt-5 rounded-3xl">
          <div className="relative overflow-hidden rounded-3xl bg-surface/60 p-7 backdrop-blur-xl">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-xl font-medium text-white">Pro</h2>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight">$23</span>
                  <span className="mb-1 text-sm text-white/40">/ month, billed yearly</span>
                </div>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <Check className="h-4 w-4 shrink-0 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={upgrade} disabled={loading} size="lg">
                {loading ? "Redirecting…" : "Upgrade now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
