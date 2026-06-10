import { EvidenceRepository } from "../repositories/evidence.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { VerificationRepository } from "../repositories/verification.repository";
import { CreateProjectRequest } from "../types/project.types";

export class ProjectService {
    private readonly projectRepository = new ProjectRepository();
    private readonly evidenceRepository = new EvidenceRepository();
    private readonly verificationRepository =
        new VerificationRepository();

    getAllProjects() {
        return this.projectRepository.findAll();
    }

    getProjectById(projectId: string) {
        const project = this.projectRepository.findById(projectId);

        if (!project) {
            return null;
        }

        return {
            ...project,
            evidences:
                this.evidenceRepository.findByProjectId(projectId),
            verificationReport:
                this.verificationRepository.findByProjectId(projectId) ??
                null,
        };
    }

    createProject(payload: CreateProjectRequest) {
        return this.projectRepository.create(payload);
    }
}