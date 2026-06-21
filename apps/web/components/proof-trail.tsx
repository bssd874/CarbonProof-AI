import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface ProofTrailItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status?: "complete" | "current" | "pending" | "error";
  icon?: LucideIcon;
  details?: ReactNode;
}

export function ProofTrail({ items, orientation = "vertical", className = "" }: { items: ProofTrailItem[]; orientation?: "vertical" | "horizontal"; className?: string }) {
  if (orientation === "horizontal") {
    return (
      <ol className={`grid gap-0 overflow-x-auto sm:grid-flow-col sm:auto-cols-fr ${className}`}>
        {items.map((item, index) => <HorizontalItem key={item.id} item={item} last={index === items.length - 1} />)}
      </ol>
    );
  }
  return (
    <ol className={`relative space-y-0 ${className}`}>
      {items.map((item, index) => <VerticalItem key={item.id} item={item} last={index === items.length - 1} />)}
    </ol>
  );
}

function Marker({ item }: { item: ProofTrailItem }) {
  const Icon = item.icon || (item.status === "complete" ? CheckCircle2 : item.status === "current" ? Clock3 : Circle);
  const style = item.status === "error" ? "bg-coral text-white" : item.status === "complete" ? "bg-teal text-white" : item.status === "current" ? "bg-amber text-navy" : "border border-line bg-paper text-muted";
  return <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ${style}`}><Icon className="size-4" aria-hidden="true" /></span>;
}

function VerticalItem({ item, last }: { item: ProofTrailItem; last: boolean }) {
  return (
    <li className="relative grid grid-cols-[36px_minmax(0,1fr)] gap-4 pb-7 last:pb-0">
      {!last ? <span className="absolute bottom-0 left-[17px] top-9 w-px bg-line" /> : null}
      <Marker item={item} />
      <div className="min-w-0 pt-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
          {item.timestamp ? <time className="font-mono text-[10px] text-muted">{item.timestamp}</time> : null}
        </div>
        {item.description ? <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p> : null}
        {item.details ? <div className="mt-3">{item.details}</div> : null}
      </div>
    </li>
  );
}

function HorizontalItem({ item, last }: { item: ProofTrailItem; last: boolean }) {
  return (
    <li className="relative min-w-[190px] px-3 pb-4 text-center">
      {!last ? <span className="absolute left-1/2 right-[-50%] top-[18px] h-px bg-line" /> : null}
      <span className="flex justify-center"><Marker item={item} /></span>
      <h3 className="mt-3 text-xs font-semibold text-ink">{item.title}</h3>
      {item.description ? <p className="mt-1 text-[11px] leading-4 text-muted">{item.description}</p> : null}
    </li>
  );
}
