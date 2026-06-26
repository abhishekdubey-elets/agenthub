"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { useAuth } from "@/lib/auth";

/** Premium authenticated app frame: sidebar + topbar + auth guard. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink">
        <div className="flex items-center gap-3 text-white/40">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
          Loading workspace…
        </div>
      </div>
    );
  }

  const initials =
    (user.full_name || user.email)
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-ink">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-ink/80 px-4 py-5 backdrop-blur-xl lg:block">
        <AppSidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.06] bg-ink px-4 py-5 lg:hidden"
            >
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-white/60 hover:text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative hidden max-w-sm flex-1 sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Search agents, runs, docs…"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-white/80 outline-none transition-colors placeholder:text-white/30 focus:border-violet-500/40 focus:bg-white/[0.05]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-white/45 sm:inline">{user.email}</span>
              <div className="group relative">
                <button className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-sm font-semibold text-white">
                  {initials}
                </button>
                <div className="invisible absolute right-0 top-11 z-30 w-44 translate-y-1 rounded-2xl border border-white/[0.08] bg-surface/95 p-1.5 opacity-0 shadow-card backdrop-blur-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="px-3 py-2 text-xs text-white/40">
                    {user.plan === "pro" ? "Pro plan" : "Free plan"}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      router.replace("/login");
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
