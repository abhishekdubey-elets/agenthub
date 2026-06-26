"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 27, suffix: "", label: "Specialized agents" },
  { value: 11.4, suffix: "h", label: "Saved per week", decimals: 1 },
  { value: 148, suffix: "k+", label: "Runs executed" },
  { value: 99.9, suffix: "%", label: "Run reliability", decimals: 1 },
];

function Counter({
  to,
  decimals = 0,
  suffix,
}: {
  to: number;
  decimals?: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.04] md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="bg-ink/80 px-6 py-10 text-center"
          >
            <div className="text-4xl font-semibold tracking-tight text-gradient-accent">
              <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm text-white/45">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
