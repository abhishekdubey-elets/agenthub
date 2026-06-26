"use client";

import { Blocks, FileText } from "lucide-react";
import AppShell from "@/components/AppShell";
import { ModuleShell } from "@/components/app/ModuleShell";

export default function KnowledgePage() {
  return (
    <AppShell>
      <ModuleShell
        icon={Blocks}
        eyebrow="Knowledge Base"
        title="Give agents your context."
        description="Upload docs, notes and links into a searchable knowledge base. Agents ground their answers in your company's real information."
        roadmap={[
          "Upload PDFs, docs, notes and URLs",
          "Automatic chunking and embeddings",
          "Retrieval grounding for every agent",
          "Source citations on every answer",
        ]}
        preview={
          <div className="space-y-2.5">
            {[
              ["Company handbook.pdf", "248 KB · indexed"],
              ["Q3 board deck.pptx", "1.2 MB · indexed"],
              ["Pricing strategy.md", "14 KB · indexed"],
              ["Brand voice guide.docx", "62 KB · indexing…"],
            ].map(([name, meta], i) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-ink/40 p-3.5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] text-violet-300">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="text-sm text-white/85">{name}</div>
                  <div className="text-xs text-white/40">{meta}</div>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    i === 3 ? "animate-pulse bg-sky-400" : "bg-mint-400"
                  }`}
                />
              </div>
            ))}
          </div>
        }
      />
    </AppShell>
  );
}
