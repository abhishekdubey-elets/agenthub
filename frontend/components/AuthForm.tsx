"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) await register(email, password, fullName);
      else await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-dotgrid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-500/15 blur-[110px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glow-border relative w-full max-w-md"
      >
        <div className="rounded-3xl bg-surface/70 p-8 backdrop-blur-2xl">
          <Link href="/" className="mb-7 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#6366f1_50%,#0ea5e9)] shadow-[0_4px_16px_-4px_rgba(124,58,237,0.8)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none">
                <path
                  d="M12 2v6m0 8v6m10-10h-6M8 12H2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight">AgentHub</span>
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">
            {isRegister ? "Create your workspace" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-white/45">
            {isRegister
              ? "Start running your productivity agents in minutes."
              : "Sign in to your AI workspace."}
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {isRegister && (
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                type="text"
                placeholder="Jane Founder"
              />
            )}
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@company.com"
              required
            />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder={isRegister ? "At least 8 characters" : "••••••••"}
              required
            />

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Please wait…
                </>
              ) : (
                <>
                  {isRegister ? "Create account" : "Sign in"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/45">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to AgentHub?{" "}
                <Link href="/register" className="font-medium text-violet-400 hover:text-violet-300">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/[0.08] bg-ink/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15"
      />
    </label>
  );
}
