import { EvidenceRepository } from "../repositories/evidence.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { AddEvidenceRequest } from "../types/evidence.types";

export class EvidenceService {
    private readonly projectRepository = new ProjectRepository();
    private readonly evidenceRepository = new EvidenceRepository();

    addEvidence(
        projectId: string,
        payload: AddEvidenceRequest
    ) {
        const project = this.projectRepository.findById(projectId);

        if (!project) {
            return null;
        }

        return this.evidenceRepository.create(projectId, payload);
    }
}