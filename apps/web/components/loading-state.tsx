import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading content", rows = 4, compact = false, className = "" }: { label?: string; rows?: number; compact?: boolean; className?: string }) {
  return (
    <section className={`panel p-6 ${className}`} aria-busy="true" aria-label={label}>
      <div className="mb-5 flex items-center gap-3 text-sm font-semibold text-forest"><LoaderCircle className="size-4 animate-spin text-teal" /><span>{label}</span></div>
      <div className="space-y-4">{Array.from({ length: rows }).map((_, index) => <div key={index} className="flex items-center gap-4"><div className={`skeleton rounded-full ${compact ? "size-8" : "size-10"}`} /><div className="flex-1 space-y-2"><div className="skeleton h-4 w-1/3 rounded" /><div className="skeleton h-3 w-2/3 rounded" /></div></div>)}</div>
    </section>
  );
}
