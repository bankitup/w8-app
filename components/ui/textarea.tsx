"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[128px] w-full rounded-[20px] border border-border bg-[#fffdfa] px-4 py-3.5 text-base leading-6 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export { Textarea };
