import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: string; direction: "up" | "down"; label?: string };
  accent?: "teal" | "green" | "amber" | "cyan";
  className?: string;
}

const accentStyles = {
  teal: "border-l-teal",
  green: "border-l-leaf",
  amber: "border-l-amber",
  cyan: "border-l-cyan",
};

export function MetricCard({ label, value, description, icon: Icon, trend, accent = "teal", className = "" }: MetricCardProps) {
  const TrendIcon = trend?.direction === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <article className={`border-l-4 bg-paper px-5 py-5 shadow-panel ${accentStyles[accent]} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold text-muted">{label}</p>
        {Icon ? <Icon className="size-[18px] text-teal" aria-hidden="true" /> : null}
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <p className="font-display text-3xl font-bold text-ink">{value}</p>
        {trend ? (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trend.direction === "up" ? "text-moss" : "text-coral"}`}>
            <TrendIcon className="size-3.5" /> {trend.value}<span className="sr-only"> {trend.label}</span>
          </span>
        ) : null}
      </div>
      {description ? <p className="mt-2 text-xs leading-5 text-muted">{description}</p> : null}
    </article>
  );
}
