"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { shorten } from "@/lib/format";

export interface CopyableValueProps {
  label: string;
  value?: string | null;
  displayValue?: string;
  truncate?: boolean;
  tone?: "light" | "dark";
  className?: string;
}

export function CopyableValue({ label, value, displayValue, truncate = true, tone = "light", className = "" }: CopyableValueProps) {
  const [copied, setCopied] = useState(false);
  const dark = tone === "dark";
  const available = Boolean(value);

  async function copyValue() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const visibleValue = displayValue || (truncate ? shorten(value) : value) || "Not available";

  return (
    <div className={`min-w-0 rounded-md border p-3 ${dark ? "border-white/10 bg-white/[0.06]" : "border-line bg-canvas"} ${className}`}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase ${dark ? "text-white/50" : "text-muted"}`}>{label}</p>
          <p className={`mt-1 font-mono text-[11px] ${truncate ? "truncate" : "break-all"} ${available ? (dark ? "text-cyan" : "text-forest") : "text-muted"}`} title={value || undefined}>
            {visibleValue}
          </p>
        </div>
        <button
          type="button"
          onClick={copyValue}
          disabled={!available}
          className="grid size-8 shrink-0 place-items-center rounded text-teal transition hover:bg-teal/10 disabled:cursor-not-allowed disabled:text-muted/40"
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">{copied ? `${label} copied to clipboard` : ""}</span>
    </div>
  );
}
