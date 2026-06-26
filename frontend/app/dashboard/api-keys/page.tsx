"use client";

import { KeyRound } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ModuleShell } from "@/components/app/ModuleShell";

export default function ApiKeysPage() {
  return (
    <AppShell>
      <ModuleShell
        icon={KeyRound}
        eyebrow="API Keys"
        title="Run agents from your stack."
        description="Generate scoped API keys and call any agent from your own code with a typed SDK and clean REST endpoints."
        roadmap={[
          "Scoped, revocable API keys",
          "Typed TypeScript & Python SDKs",
          "Per-key usage and rate limits",
          "Webhook signing secrets",
        ]}
        preview={
          <div className="space-y-3">
            {[
              ["Production", "ah_live_••••••••4f2a", "text-mint-400"],
              ["Development", "ah_test_••••••••9c01", "text-sky-400"],
            ].map(([env, key, tone]) => (
              <div
                key={env}
                className="rounded-2xl border border-white/[0.06] bg-ink/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{env}</span>
                  <span className={`text-xs ${tone}`}>Active</span>
                </div>
                <code className="mt-2 block rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-xs text-white/55">
                  {key}
                </code>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-ink/20 p-4 text-center text-sm text-white/40">
              + Create new key
            </div>
          </div>
        }
      />
    </AppShell>
  );
}
