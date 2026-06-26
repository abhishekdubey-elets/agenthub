"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "text-white shadow-[0_8px_30px_-8px_rgba(124,58,237,0.7)] bg-[linear-gradient(120deg,#8b5cf6,#6366f1_55%,#0ea5e9)] bg-[length:160%_160%] hover:bg-[position:100%_50%] hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.85)]",
        secondary:
          "glass text-white/90 hover:bg-white/[0.08] hover:border-white/15",
        ghost: "text-white/70 hover:text-white hover:bg-white/[0.06]",
        outline:
          "border border-white/12 text-white/85 hover:border-white/25 hover:bg-white/[0.04]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "px-7 py-3.5 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
