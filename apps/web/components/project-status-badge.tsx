import { projectStatusLabels } from "@/lib/format";
import type { CarbonProjectStatus } from "@/lib/types";

const styles: Record<CarbonProjectStatus, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-600",
  pending_evidence: "border-amber/35 bg-amber/15 text-[#7b570b]",
  ai_reviewed: "border-teal/30 bg-teal/10 text-teal",
  verified: "border-leaf/40 bg-leaf/15 text-moss",
  credit_issued: "border-cyan/45 bg-cyan/15 text-forest",
};

export function ProjectStatusBadge({ status, label }: { status: CarbonProjectStatus; label?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>{label || projectStatusLabels[status]}</span>;
}
