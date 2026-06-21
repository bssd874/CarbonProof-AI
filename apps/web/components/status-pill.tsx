import type { CarbonProjectStatus, RiskScore } from "@/lib/types";
import { ProjectStatusBadge } from "@/components/project-status-badge";
import { RiskScoreBadge } from "@/components/risk-score-badge";

export function ProjectStatusPill({ status }: { status: CarbonProjectStatus }) {
  return <ProjectStatusBadge status={status} />;
}

export function RiskPill({ risk }: { risk: RiskScore }) {
  return <RiskScoreBadge risk={risk} />;
}
