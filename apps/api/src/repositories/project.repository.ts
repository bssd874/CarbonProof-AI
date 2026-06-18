import { prisma } from "../config/database";
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