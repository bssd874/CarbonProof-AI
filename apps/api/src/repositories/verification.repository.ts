import { verificationReports } from "../data/seed";
import { VerificationReport } from "../types/verification.types";

export class VerificationRepository {
    findByProjectId(
        projectId: string
    ): VerificationReport | undefined {
        return verificationReports.find(
            (report) => report.projectId === projectId
        );
    }

    save(report: VerificationReport): VerificationReport {
        const existingIndex = verificationReports.findIndex(
            (item) => item.projectId === report.projectId
        );

        if (existingIndex >= 0) {
            verificationReports[existingIndex] = report;
            return report;
        }

        verificationReports.push(report);

        return report;
    }
}