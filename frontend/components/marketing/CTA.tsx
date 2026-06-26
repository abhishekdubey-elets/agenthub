"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="glow-border relative overflow-hidden rounded-4xl">
          <div className="relative overflow-hidden rounded-4xl bg-surface/70 px-6 py-20 text-center backdrop-blur-xl">
            <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/25 blur-[100px]" />
            <div className="absolute inset-0 bg-dotgrid opacity-20" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Give your day back to
                <span className="text-gradient"> the work that matters.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-balance text-lg text-white/55">
                Spin up your first agent in under two minutes. Free to start, no card
                required.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">
                    Start building free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
