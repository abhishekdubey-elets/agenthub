"use client";

import {
  BarChart3,
  Blocks,
  BookOpen,
  Bot,
  CreditCard,
  KeyRound,
  LayoutGrid,
  MessageSquare,
  Plug,
  Settings,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Agents", href: "/dashboard", icon: Bot },
      { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
      { label: "Workflow Builder", href: "/dashboard/workflows", icon: Workflow },
      { label: "Automations", href: "/dashboard/automations", icon: Zap },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Prompt Library", href: "/dashboard/prompts", icon: BookOpen },
      { label: "Knowledge Base", href: "/dashboard/knowledge", icon: Blocks },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-3 py-1"
        onClick={onNavigate}
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#6366f1_50%,#0ea5e9)] shadow-[0_4px_16px_-4px_rgba(124,58,237,0.8)]">
          <LayoutGrid className="h-4 w-4 text-white" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">AgentHub</span>
      </Link>

      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-white/30">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/[0.06] text-white"
                        : "text-white/55 hover:bg-white/[0.04] hover:text-white/90"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-gradient" />
                    )}
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        active ? "text-violet-400" : "text-white/40 group-hover:text-white/70"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="glow-border mt-4 rounded-2xl">
        <div className="rounded-2xl bg-surface/80 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-white">Upgrade to Pro</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-white/45">
            Unlock all 27 agents, the workflow builder and unlimited runs.
          </p>
          <Link
            href="/dashboard/billing"
            className="mt-3 block rounded-xl bg-accent-gradient py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Upgrade now
          </Link>
        </div>
      </div>
    </div>
  );
}
