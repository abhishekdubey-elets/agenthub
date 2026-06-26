"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Check,
  Hash,
  Loader2,
  Mail,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { api, GoogleStatus, SlackStatus } from "@/lib/api";

export default function IntegrationsPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <IntegrationsContent />
      </Suspense>
    </AppShell>
  );
}

function IntegrationsContent() {
  const params = useSearchParams();
  const [google, setGoogle] = useState<GoogleStatus | null>(null);
  const [slack, setSlack] = useState<SlackStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );

  const load = useCallback(() => {
    return Promise.all([
      api.googleStatus().catch(() => null),
      api.slackStatus().catch(() => null),
    ]).then(([g, s]) => {
      setGoogle(g);
      setSlack(s);
    });
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  // Surface OAuth callback results from the URL (?google=… / ?slack=…).
  useEffect(() => {
    const messages: Record<string, { kind: "ok" | "err"; text: string }> = {
      "google:connected": { kind: "ok", text: "Google account connected." },
      "slack:connected": { kind: "ok", text: "Slack workspace connected." },
    };
    for (const provider of ["google", "slack"] as const) {
      const v = params.get(provider);
      if (!v) continue;
      setBanner(
        messages[`${provider}:${v}`] ?? {
          kind: "err",
          text: `Couldn't connect ${provider === "google" ? "Google" : "Slack"}. Please try again.`,
        }
      );
    }
  }, [params]);

  async function redirectTo(getUrl: () => Promise<{ auth_url: string }>, key: string) {
    setBusy(key);
    setBanner(null);
    try {
      const { auth_url } = await getUrl();
      window.location.href = auth_url;
    } catch (e) {
      setBanner({
        kind: "err",
        text: e instanceof Error ? e.message : "This integration isn't configured yet.",
      });
      setBusy(null);
    }
  }

  async function disconnect(fn: () => Promise<unknown>, key: string, label: string) {
    setBusy(key);
    try {
      await fn();
      await load();
      setBanner({ kind: "ok", text: `${label} disconnected.` });
    } finally {
      setBusy(null);
    }
  }

  const gmailNeedsReconnect = !!google?.connected && !google?.gmail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="text-3xl font-semibold tracking-tight">Integrations</h1>
      <p className="mt-1.5 text-white/45">
        Connect your tools so agents work from real data, not pasted text.
      </p>

      {banner && (
        <div
          className={`mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
            banner.kind === "ok"
              ? "border-mint-500/20 bg-mint-500/5 text-mint-300"
              : "border-amber-500/20 bg-amber-500/5 text-amber-200"
          }`}
        >
          {banner.kind === "ok" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {banner.text}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {/* Google Calendar */}
        <IntegrationCard
          icon={Calendar}
          accent="text-sky-400"
          glow="bg-sky-500/15"
          name="Google Calendar"
          desc="Pull today's events into the Morning Briefing agent."
          poweredBy="Powered by your Google account"
          loading={loading}
          configured={google?.configured}
          connected={!!google?.connected && !!google?.calendar}
          meta={google?.email ? `Linked: ${google.email}` : null}
          busy={busy === "google"}
          onConnect={() => redirectTo(api.googleConnectUrl, "google")}
          onDisconnect={() =>
            disconnect(api.googleDisconnect, "google", "Google account")
          }
          envHint="GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
        />

        {/* Gmail (Google-backed) */}
        <IntegrationCard
          icon={Mail}
          accent="text-violet-400"
          glow="bg-violet-500/15"
          name="Gmail"
          desc="Let the Inbox Triage agent read your recent inbox."
          poweredBy="Shares your Google account connection"
          loading={loading}
          configured={google?.configured}
          connected={!!google?.connected && !!google?.gmail}
          meta={google?.email ? `Linked: ${google.email}` : null}
          busy={busy === "google"}
          connectLabel={gmailNeedsReconnect ? "Reconnect to enable" : "Connect"}
          onConnect={() => redirectTo(api.googleConnectUrl, "google")}
          onDisconnect={() =>
            disconnect(api.googleDisconnect, "google", "Google account")
          }
          envHint="GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
        />

        {/* Slack */}
        <IntegrationCard
          icon={Hash}
          accent="text-mint-400"
          glow="bg-mint-500/15"
          name="Slack"
          desc="Bring recent Slack messages into the Inbox Triage agent."
          poweredBy={slack?.team ? `Workspace: ${slack.team}` : "Your Slack workspace"}
          loading={loading}
          configured={slack?.configured}
          connected={!!slack?.connected}
          meta={slack?.team ? `Workspace: ${slack.team}` : null}
          busy={busy === "slack"}
          onConnect={() => redirectTo(api.slackConnectUrl, "slack")}
          onDisconnect={() => disconnect(api.slackDisconnect, "slack", "Slack")}
          envHint="SLACK_CLIENT_ID and SLACK_CLIENT_SECRET"
        />
      </div>
    </motion.div>
  );
}

function IntegrationCard({
  icon: Icon,
  accent,
  glow,
  name,
  desc,
  poweredBy,
  loading,
  configured,
  connected,
  meta,
  busy,
  connectLabel = "Connect",
  onConnect,
  onDisconnect,
  envHint,
}: {
  icon: LucideIcon;
  accent: string;
  glow: string;
  name: string;
  desc: string;
  poweredBy: string;
  loading: boolean;
  configured?: boolean;
  connected: boolean;
  meta: string | null;
  busy: boolean;
  connectLabel?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  envHint: string;
}) {
  return (
    <div className={connected ? "glow-border rounded-3xl" : ""}>
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-surface/50 p-6 backdrop-blur-xl">
        <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full ${glow} blur-3xl`} />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Icon className={`h-6 w-6 ${accent}`} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-white">{name}</h3>
                {connected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint-500/10 px-2.5 py-0.5 text-xs font-medium text-mint-400">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-md text-sm text-white/50">{desc}</p>
              <p className="mt-2 text-xs text-white/35">{connected && meta ? meta : poweredBy}</p>
            </div>
          </div>

          <div className="shrink-0">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white/40" />
            ) : connected ? (
              <Button variant="outline" size="md" onClick={onDisconnect} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}
                Disconnect
              </Button>
            ) : (
              <Button size="md" onClick={onConnect} disabled={busy || !configured}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                {connectLabel}
              </Button>
            )}
          </div>
        </div>

        {!loading && !configured && (
          <div className="relative mt-5 flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Setup required: add{" "}
              {envHint.split(" and ").map((k, i, arr) => (
                <span key={k}>
                  <code className="rounded bg-white/10 px-1">{k}</code>
                  {i < arr.length - 1 ? " and " : ""}
                </span>
              ))}{" "}
              to <code className="rounded bg-white/10 px-1">backend/.env</code>, then restart the backend.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
