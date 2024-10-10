import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button relative w-full flex items-center justify-center gap-x-1 text-white rounded-3xl leading-6 font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none",
  {
    variants: {
      variant: {
        default: "bg-orange-background hover:bg-orange-hover",
        black: "bg-black",
      },
      size: {
        default: "h-11 py-2",
        icon: "h-11 min-w-11 max-w-11 rounded-full",
      },
      width: {
        default: "w-full",
      },
      rounded: {
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, width, rounded, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, width, rounded, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
