import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { RiskScore } from "@/lib/types";

const settings = {
  Low: { className: "border-leaf/45 bg-leaf/15 text-moss", Icon: ShieldCheck },
  Medium: { className: "border-amber/45 bg-amber/15 text-[#7b570b]", Icon: ShieldQuestion },
  High: { className: "border-coral/45 bg-coral/10 text-coral", Icon: ShieldAlert },
} satisfies Record<RiskScore, { className: string; Icon: typeof ShieldCheck }>;

export function RiskScoreBadge({ risk, showLabel = true }: { risk: RiskScore; showLabel?: boolean }) {
  const { className, Icon } = settings[risk];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${className}`} aria-label={`${risk} risk`}>
      <Icon className="size-3.5" aria-hidden="true" /> {risk}{showLabel ? " risk" : ""}
    </span>
  );
}
