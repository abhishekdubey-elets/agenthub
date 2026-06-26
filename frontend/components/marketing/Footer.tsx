import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: ["Features", "Workflow builder", "Pricing", "Changelog", "API"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Customers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "Community", "Status", "Security"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#6366f1_50%,#0ea5e9)]">
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
              <span className="text-[15px] font-semibold tracking-tight">AgentHub</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              The AI workspace that runs your daily rituals, so you can stay on the work
              that compounds.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] text-white/50 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-white/80">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/45 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} AgentHub, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/35">
            <a href="#" className="hover:text-white/70">Privacy</a>
            <a href="#" className="hover:text-white/70">Terms</a>
            <a href="#" className="hover:text-white/70">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
