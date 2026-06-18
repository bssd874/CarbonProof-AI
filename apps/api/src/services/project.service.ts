import { EvidenceRepository } from "../repositories/evidence.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { VerificationRepository } from "../repositories/verification.repository";
import { CreateProjectRequest } from "../types/project.types";

export class ProjectService {
    private readonly projectRepository =
        new ProjectRepository();

    private readonly evidenceRepository =
        new EvidenceRepository();

    private readonly verificationRepository =
        new VerificationRepository();

    async getAllProjects() {
        return this.projectRepository.findAll();
    }

    async getProjectById(projectId: string) {
        const project =
            await this.projectRepository.findById(projectId);

        if (!project) {
            return null;
        }

        const [evidences, verificationReport] =
            await Promise.all([
                this.evidenceRepository.findByProjectId(
                    projectId
                ),

                this.verificationRepository.findByProjectId(
                    projectId
                ),
            ]);

        return {
            ...project,
            evidences,
            verificationReport:
                verificationReport ?? null,
        };
    }

    async createProject(
        payload: CreateProjectRequest
    ) {
        return this.projectRepository.create(payload);
    }
}