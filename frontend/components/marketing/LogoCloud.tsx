"use client";

const logos = [
  "Northwind",
  "Lumen",
  "Acme Labs",
  "Frame",
  "Cobalt",
  "Vertex",
  "Monarch",
  "Helio",
];

export function LogoCloud() {
  return (
    <section className="relative border-y border-white/[0.06] py-12">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/35">
        Trusted by operators at fast-moving teams
      </p>
      <div className="relative mx-auto max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 pr-16">
          {[...logos, ...logos].map((name, i) => (
            <span
              key={i}
              className="select-none whitespace-nowrap text-xl font-semibold tracking-tight text-white/35 transition-colors hover:text-white/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
