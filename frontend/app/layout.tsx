import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentHub — The AI workspace for business owners",
  description:
    "Run a hub of AI agents that handle your daily rituals — briefings, triage, reviews, and more. Built for founders who'd rather think than tab-switch.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-ink text-white/90">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
