import { randomUUID } from "crypto";
import { projects } from "../data/seed";
import {
    CarbonProject,
    CarbonProjectStatus,
    CreateProjectRequest,
} from "../types/project.types";

export class ProjectRepository {
    findAll(): CarbonProject[] {
        return projects;
    }

    findById(id: string): CarbonProject | undefined {
        return projects.find((project) => project.id === id);
    }

    create(payload: CreateProjectRequest): CarbonProject {
        const now = new Date().toISOString();

        const project: CarbonProject = {
            id: randomUUID(),
            name: payload.name,
            location: payload.location,
            claim: payload.claim,
            description: payload.description,
            ownerWallet: payload.ownerWallet,
            status: "pending_evidence",
            createdAt: now,
            updatedAt: now,
        };

        projects.push(project);

        return project;
    }

    updateStatus(
        projectId: string,
        status: CarbonProjectStatus
    ): CarbonProject | undefined {
        const project = this.findById(projectId);

        if (!project) {
            return undefined;
        }

        project.status = status;
        project.updatedAt = new Date().toISOString();

        return project;
    }
}