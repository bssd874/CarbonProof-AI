import { randomUUID } from "node:crypto";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { memoryStore } from "../config/memory-store";
import {
    CarbonProjectStatus,
    CreateProjectRequest,
} from "../types/project.types";

import {
    fromPrismaProjectStatus,
    toPrismaProjectStatus,
} from "../utils/prisma-mapper";

export class ProjectRepository {
    async findAll() {
        if (env.dataStore === "memory") {
            return Array.from(memoryStore.projects.values())
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        }

        const projects =
            await prisma.carbonProject.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });

        return projects.map((project) => ({
            ...project,
            status: fromPrismaProjectStatus(
                project.status
            ),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        }));
    }

    async findById(id: string) {
        if (env.dataStore === "memory") {
            return memoryStore.projects.get(id);
        }

        const project =
            await prisma.carbonProject.findUnique({
                where: {
                    id,
                },
            });

        if (!project) {
            return undefined;
        }

        return {
            ...project,
            status: fromPrismaProjectStatus(
                project.status
            ),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }

    async create(payload: CreateProjectRequest) {
        if (env.dataStore === "memory") {
            const now = new Date().toISOString();
            const project = {
                id: randomUUID(),
                name: payload.name,
                location: payload.location,
                claim: payload.claim,
                description: payload.description,
                status: "pending_evidence" as const,
                ownerWallet: payload.ownerWallet ?? null,
                createdAt: now,
                updatedAt: now,
            };

            memoryStore.projects.set(project.id, project);
            return project;
        }

        const project =
            await prisma.carbonProject.create({
                data: {
                    name: payload.name,
                    location: payload.location,
                    claim: payload.claim,
                    description: payload.description,
                    ownerWallet: payload.ownerWallet,
                },
            });

        return {
            ...project,
            status: fromPrismaProjectStatus(
                project.status
            ),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }

    async updateStatus(
        projectId: string,
        status: CarbonProjectStatus
    ) {
        if (env.dataStore === "memory") {
            const project = memoryStore.projects.get(projectId);

            if (!project) {
                return undefined;
            }

            const updatedProject = {
                ...project,
                status,
                updatedAt: new Date().toISOString(),
            };

            memoryStore.projects.set(projectId, updatedProject);
            return updatedProject;
        }

        const existingProject =
            await prisma.carbonProject.findUnique({
                where: {
                    id: projectId,
                },
            });

        if (!existingProject) {
            return undefined;
        }

        const project =
            await prisma.carbonProject.update({
                where: {
                    id: projectId,
                },

                data: {
                    status: toPrismaProjectStatus(status),
                },
            });

        return {
            ...project,
            status: fromPrismaProjectStatus(
                project.status
            ),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }
}
