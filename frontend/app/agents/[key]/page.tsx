"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  CalendarPlus,
  Check,
  Download,
  Hash,
  Loader2,
  Mail,
  Pencil,
  Play,
  Send,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Client-only to keep react-markdown's ESM deps out of the dev render worker.
const Markdown = dynamic(() => import("@/components/ui/Markdown"), { ssr: false });
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { Agent, AgentRun, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AgentPage() {
  return (
    <AppShell>
      <AgentRunner />
    </AppShell>
  );
}

function AgentRunner() {
  const params = useParams<{ key: string }>();
  const key = params.key;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AgentRun | null>(null);
  const [history, setHistory] = useState<AgentRun[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState<string | null>(null);
  const [sourceNotice, setSourceNotice] = useState<string | null>(null);

  // Human checkpoint: edit / approve / send the output.
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendSubject, setSendSubject] = useState("");
  const [asPdf, setAsPdf] = useState(true);
  const [sending, setSending] = useState(false);
  const [reportNote, setReportNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function startEdit() {
    if (!result) return;
    setDraft(result.output_text);
    setEditing(true);
    setReportNote(null);
  }

  async function saveEdit() {
    if (!result) return;
    setSaving(true);
    try {
      const updated = await api.updateRun(result.id, draft);
      setResult(updated);
      setHistory((h) => h.map((r) => (r.id === updated.id ? updated : r)));
      setEditing(false);
      setReportNote({ kind: "ok", text: "Changes saved." });
    } catch (e) {
      setReportNote({ kind: "err", text: e instanceof Error ? e.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  function openSend() {
    if (!result) return;
    setSendTo(user?.email ?? "");
    setSendSubject(`${agent?.title ?? "AgentHub report"} — ${new Date().toLocaleDateString()}`);
    setShowSend(true);
    setReportNote(null);
  }

  async function doSend() {
    if (!result) return;
    setSending(true);
    setReportNote(null);
    try {
      await api.sendReport(result.id, { to: sendTo, subject: sendSubject, as_pdf: asPdf });
      setReportNote({ kind: "ok", text: `Report sent to ${sendTo}.` });
      setShowSend(false);
    } catch (e) {
      setReportNote({ kind: "err", text: e instanceof Error ? e.message : "Send failed." });
    } finally {
      setSending(false);
    }
  }

  async function downloadPdf() {
    if (!result) return;
    setReportNote(null);
    try {
      await api.downloadRunPdf(result.id, `${result.agent_key}-${result.id}.pdf`);
    } catch (e) {
      setReportNote({ kind: "err", text: e instanceof Error ? e.message : "Download failed." });
    }
  }

  // Reset the checkpoint UI whenever a different run is shown.
  useEffect(() => {
    setEditing(false);
    setShowSend(false);
    setReportNote(null);
  }, [result?.id]);

  // Data sources an agent can pull real context from.
  const allSources = {
    calendar: {
      id: "calendar",
      label: "Pull from Google Calendar",
      icon: CalendarPlus,
      fetch: api.googleCalendarToday,
      hint: "Connect Google Calendar first (Integrations → Google Calendar).",
    },
    gmail: {
      id: "gmail",
      label: "Pull from Gmail",
      icon: Mail,
      fetch: api.gmailRecent,
      hint: "Connect Gmail first (Integrations → Gmail).",
    },
    slack: {
      id: "slack",
      label: "Pull from Slack",
      icon: Hash,
      fetch: api.slackRecent,
      hint: "Connect Slack first (Integrations → Slack).",
    },
  } as const;

  const sourcesByAgent: Record<string, (keyof typeof allSources)[]> = {
    "morning-briefing": ["calendar"],
    "focus-block-planner": ["calendar"],
    "meeting-agenda": ["calendar"],
    "no-meeting-day-protector": ["calendar"],
    "calendar-audit": ["calendar"],
    "inbox-triage": ["gmail", "slack"],
    "email-batch-drafting": ["gmail"],
    "eod-shutdown": ["calendar", "slack"],
  };

  const agentSources =
    (agent ? sourcesByAgent[agent.key] : undefined)?.map((k) => allSources[k]) ?? [];

  async function pullSource(src: (typeof allSources)[keyof typeof allSources]) {
    setPulling(src.id);
    setSourceNotice(null);
    try {
      const { text } = await src.fetch();
      setInput((prev) => (prev ? `${text}\n\n${prev}` : text));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Couldn't load data.";
      setSourceNotice(
        /not connected|not granted|not configured/i.test(msg) ? src.hint : msg
      );
    } finally {
      setPulling(null);
    }
  }

  useEffect(() => {
    if (!key) return;
    Promise.all([api.getAgent(key), api.runHistory(key)])
      .then(([a, h]) => {
        setAgent(a);
        setHistory(h);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [key]);

  async function run() {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.runAgent(key, input);
      setResult(res);
      setHistory((h) => [res, ...h]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center gap-3 text-white/40">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading agent…
      </div>
    );

  if (!agent)
    return (
      <div>
        <p className="text-white/50">Agent not found.</p>
        <Link href="/dashboard" className="text-violet-400 hover:underline">
          ← Back to agents
        </Link>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All agents
      </Link>

      <div className="mt-5 flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300">
          <Bot className="h-6 w-6" />
        </span>
        <div>
          <span className="text-xs font-medium text-white/35">{agent.code}</span>
          <h1 className="text-2xl font-semibold tracking-tight">{agent.title}</h1>
          <p className="mt-1 max-w-2xl text-white/50">{agent.description}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-white/80">{agent.input_label}</label>
            <div className="flex flex-wrap items-center gap-2">
              {agentSources.map((src) => (
                <button
                  key={src.id}
                  onClick={() => pullSource(src)}
                  disabled={pulling !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-sky-300 transition-colors hover:border-sky-500/30 hover:bg-white/[0.06] disabled:opacity-60"
                >
                  {pulling === src.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <src.icon className="h-3.5 w-3.5" />
                  )}
                  {src.label}
                </button>
              ))}
              {agent.sample_inputs.length > 0 && (
                <button
                  onClick={() => setInput(agent.sample_inputs[0])}
                  className="inline-flex items-center gap-1.5 text-xs text-violet-400 transition-colors hover:text-violet-300"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Load sample
                </button>
              )}
            </div>
          </div>
          {sourceNotice && (
            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
              <span>{sourceNotice}</span>
              <Link
                href="/dashboard/integrations"
                className="shrink-0 font-medium text-amber-100 underline-offset-2 hover:underline"
              >
                Integrations
              </Link>
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={agent.input_placeholder}
            rows={13}
            className="w-full resize-y rounded-2xl border border-white/[0.08] bg-ink/60 p-4 text-sm leading-relaxed outline-none transition-colors placeholder:text-white/25 focus:border-violet-500/40"
          />
          <Button onClick={run} disabled={running} size="lg" className="mt-4 w-full">
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running…
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Run agent
              </>
            )}
          </Button>
        </div>

        {/* Output */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-surface/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-medium text-white/80">Output</h2>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {running && (
            <div className="space-y-3 pt-2">
              {[90, 75, 85, 60, 70].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-3 rounded-full bg-white/[0.06]"
                  style={{ width: `${w}%` }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}

          {!running && !error && !result && (
            <div className="grid h-64 place-items-center text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <Sparkles className="h-5 w-5 text-white/30" />
                </span>
                <p className="mt-3 text-sm text-white/40">
                  Run the agent to see its output here.
                </p>
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Human checkpoint toolbar */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Save changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-white/60 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startEdit}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 hover:border-white/15 hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={downloadPdf}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 hover:border-white/15 hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                    <button
                      onClick={openSend}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-500/15"
                    >
                      <Send className="h-3.5 w-3.5" /> Approve &amp; send
                    </button>
                  </>
                )}
              </div>

              {reportNote && (
                <div
                  className={`mb-3 rounded-xl border px-3 py-2 text-xs ${
                    reportNote.kind === "ok"
                      ? "border-mint-500/20 bg-mint-500/5 text-mint-300"
                      : "border-amber-500/20 bg-amber-500/5 text-amber-200"
                  }`}
                >
                  {reportNote.text}
                </div>
              )}

              {/* Send panel */}
              {showSend && (
                <div className="mb-4 space-y-2.5 rounded-2xl border border-white/[0.08] bg-ink/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Mail className="h-4 w-4 text-violet-400" /> Send report
                  </div>
                  <input
                    type="email"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="recipient@email.com"
                    className="w-full rounded-lg border border-white/[0.08] bg-ink/60 px-3 py-2 text-sm outline-none focus:border-violet-500/40"
                  />
                  <input
                    value={sendSubject}
                    onChange={(e) => setSendSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full rounded-lg border border-white/[0.08] bg-ink/60 px-3 py-2 text-sm outline-none focus:border-violet-500/40"
                  />
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
                    <input
                      type="checkbox"
                      checked={asPdf}
                      onChange={(e) => setAsPdf(e.target.checked)}
                      className="accent-violet-500"
                    />
                    Attach as PDF
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={doSend}
                      disabled={sending || !sendTo}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
                    >
                      {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Send
                    </button>
                    <button
                      onClick={() => setShowSend(false)}
                      className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Output: editable textarea or rendered markdown */}
              {editing ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={16}
                  className="w-full resize-y rounded-2xl border border-violet-500/30 bg-ink/60 p-4 font-mono text-xs leading-relaxed outline-none focus:border-violet-500/50"
                />
              ) : (
                <article className="prose-agent max-h-[28rem] overflow-y-auto pr-2 text-sm">
                  <Markdown>{result.output_text}</Markdown>
                </article>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-medium text-white/70">Recent runs</h2>
          <div className="space-y-2">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => setResult(h)}
                className="block w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left text-sm transition-colors hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/70">
                    {new Date(h.created_at).toLocaleString()}
                  </span>
                  <span
                    className={
                      h.status === "completed"
                        ? "rounded-full bg-mint-500/10 px-2 py-0.5 text-xs text-mint-400"
                        : "rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400"
                    }
                  >
                    {h.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-white/35">{h.input_text || "(no input)"}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
