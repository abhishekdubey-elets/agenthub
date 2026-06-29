"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Client-only markdown renderer. Isolated into its own module so it can be
 * dynamically imported with { ssr: false } — react-markdown + remark-gfm pull in
 * ESM (mdast/micromark) that destabilizes Next's dev render worker on the server.
 */
export default function Markdown({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}
