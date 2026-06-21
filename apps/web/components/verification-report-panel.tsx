import { AlertCircle, CheckCircle2, ScanSearch, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RiskScoreBadge } from "@/components/risk-score-badge";
import type { VerificationReport } from "@/lib/types";

export function VerificationReportPanel({ report, sticky = false, className = "" }: { report: VerificationReport; sticky?: boolean; className?: string }) {
  return (
    <aside className={`rounded-lg border border-white/10 bg-navy p-6 text-white shadow-deep ${sticky ? "lg:sticky lg:top-24" : ""} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div><p className="eyebrow text-cyan">AI verification report</p><h2 className="mt-3 font-display text-2xl font-bold">Evidence risk analysis</h2></div>
        <RiskScoreBadge risk={report.riskScore} />
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
        <div className="mx-auto grid aspect-square w-[140px] place-items-center rounded-full border border-cyan/25 bg-[#123344] shadow-inner">
          <div className="grid size-24 place-items-center rounded-full border border-cyan/25 bg-navy text-center">
            <span className="font-display text-2xl font-bold text-amber">{report.riskScore}</span><span className="-mt-5 text-[10px] text-white/55">Risk score</span>
          </div>
        </div>
        <div className="border-l-4 border-teal bg-paper p-4 text-ink">
          <p className="text-xs font-semibold text-muted">Confidence</p><p className="mt-1 font-display text-4xl font-bold">{report.confidenceScore}</p><p className="mt-1 text-xs text-muted">percent evidence match</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-6 text-white/70">{report.summary}</p>
      <div className="mt-7 space-y-6">
        <ReportList title="Verified evidence" icon={CheckCircle2} items={report.verifiedEvidence} tone="success" empty="No evidence has been verified yet." />
        <ReportList title="Missing evidence" icon={AlertCircle} items={report.missingEvidence} tone="warning" empty="No required evidence is missing." />
        <ReportList title="Inconsistencies" icon={TriangleAlert} items={report.inconsistencies} tone="danger" empty="No cross-evidence inconsistencies detected." />
      </div>
      <div className="mt-7 border-t border-white/10 pt-6"><p className="flex items-center gap-2 text-sm font-semibold text-cyan"><ScanSearch className="size-4" /> Recommendation</p><p className="mt-3 text-sm leading-6 text-white/75">{report.recommendation}</p></div>
    </aside>
  );
}

function ReportList({ title, icon: Icon, items, tone, empty }: { title: string; icon: LucideIcon; items: string[]; tone: "success" | "warning" | "danger"; empty: string }) {
  const colors = { success: "text-leaf", warning: "text-amber", danger: "text-coral" };
  const visible = items.slice(0, 4);
  return <div><p className="mb-3 text-sm font-semibold text-white">{title}</p><ul className="space-y-2 text-sm text-white/70">{(visible.length ? visible : [empty]).map((item) => <li key={item} className="flex items-start gap-2"><Icon className={`mt-0.5 size-4 shrink-0 ${colors[tone]}`} /><span className="break-words">{item}</span></li>)}</ul></div>;
}
