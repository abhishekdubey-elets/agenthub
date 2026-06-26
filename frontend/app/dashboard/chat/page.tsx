"use client";

import { MessageSquare } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ModuleShell } from "@/components/app/ModuleShell";

export default function ChatPage() {
  return (
    <AppShell>
      <ModuleShell
        icon={MessageSquare}
        eyebrow="AI Chat"
        title="Talk to your agents."
        description="A streaming, ChatGPT-quality chat surface wired to every agent and your knowledge base — with markdown, code, file and voice input."
        roadmap={[
          "Token-by-token streaming responses",
          "Markdown & syntax-highlighted code blocks",
          "File, image and voice input",
          "Drop into any agent's context mid-conversation",
        ]}
        preview={
          <div className="space-y-3">
            <ChatBubble role="user">Summarize today and flag anything urgent.</ChatBubble>
            <ChatBubble role="assistant">
              You have 3 priorities today. ⚠️ Acme legal needs the cap table by noon —
              I've drafted a reply. Your 2pm with Priya is blocked on design…
            </ChatBubble>
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-ink/60 px-4 py-3 text-sm text-white/30">
              Message your workspace…
              <span className="ml-auto h-4 w-px animate-pulse bg-violet-400" />
            </div>
          </div>
        }
      />
    </AppShell>
  );
}

function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl rounded-br-sm bg-accent-gradient px-4 py-2.5 text-sm text-white"
            : "max-w-[85%] rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white/75"
        }
      >
        {children}
      </div>
    </div>
  );
}
