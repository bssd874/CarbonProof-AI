import { VerificationReportPanel } from "@/components/verification-report-panel";
import type { VerificationReport } from "@/lib/types";

export function VerificationPanel({ report }: { report: VerificationReport }) {
  return <VerificationReportPanel report={report} sticky />;
}
