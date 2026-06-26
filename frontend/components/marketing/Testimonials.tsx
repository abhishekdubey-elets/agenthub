"use client";

import { Star } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const testimonials = [
  {
    quote:
      "AgentHub replaced my 6am scramble through three apps. The morning briefing is now the first and only thing I open — it already knows what matters.",
    name: "Sarah Chen",
    role: "Founder & CEO, Northwind",
    initials: "SC",
    grad: "from-violet-500 to-iris-500",
  },
  {
    quote:
      "I tried building this in Zapier for a week. AgentHub did it in an afternoon and actually understands context. It's not automation, it's delegation.",
    name: "Marcus Webb",
    role: "Operating Partner, Cobalt",
    initials: "MW",
    grad: "from-sky-500 to-iris-500",
  },
  {
    quote:
      "The weekly review agent pulls our numbers together better than my old analyst deck. I get the 'so what' in ninety seconds.",
    name: "Priya Raman",
    role: "COO, Lumen Labs",
    initials: "PR",
    grad: "from-mint-500 to-sky-500",
  },
  {
    quote:
      "Delegation tracker alone paid for the whole year. Nothing slips anymore — and I stopped being the bottleneck on my own team.",
    name: "David Okafor",
    role: "Managing Director, Vertex",
    initials: "DO",
    grad: "from-violet-500 to-sky-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Customers"
        icon={<Star className="h-3.5 w-3.5 text-violet-400" />}
        title="Loved by operators who value their time"
        description="From solo founders to operating partners, AgentHub gives back the hours that disappear into busywork."
      />

      <StaggerGroup className="mt-16 grid gap-5 md:grid-cols-2">
        {testimonials.map((t) => (
          <StaggerItem key={t.name}>
            <figure className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 transition-all duration-500 hover:border-white/12 hover:bg-white/[0.04]">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-600/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-violet-400 text-violet-400" />
                  ))}
                </div>
                <blockquote className="text-[15px] leading-relaxed text-white/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.grad} text-sm font-semibold text-white`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-white/45">{t.role}</div>
                  </div>
                </figcaption>
              </div>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
