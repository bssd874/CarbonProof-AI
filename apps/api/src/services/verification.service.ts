import { EvidenceRepository } from "../repositories/evidence.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { VerificationRepository } from "../repositories/verification.repository";
import { AiVerifierService } from "./ai-verifier.service";

export class VerificationService {
    private readonly projectRepository = new ProjectRepository();
    private readonly evidenceRepository = new EvidenceRepository();
    private readonly verificationRepository =
        new VerificationRepository();
    private readonly aiVerifierService = new AiVerifierService();

    verifyProject(projectId: string) {
        const project = this.projectRepository.findById(projectId);

        if (!project) {
            return null;
        }

        const evidences =
            this.evidenceRepository.findByProjectId(projectId);

        const report = this.aiVerifierService.verify(
            project,
            evidences
        );

        this.verificationRepository.save(report);

        this.projectRepository.updateStatus(
            projectId,
            "ai_reviewed"
        );

        return report;
    }

    getReport(projectId: string) {
        return (
            this.verificationRepository.findByProjectId(projectId) ??
            null
        );
    }
}