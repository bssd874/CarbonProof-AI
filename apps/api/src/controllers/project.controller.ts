import { NextFunction, Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import {
    errorResponse,
    successResponse,
} from "../utils/api-response";
import { createProjectSchema } from "../validators/project.validator";


type ProjectParams = {
  id: string;
};

export class ProjectController {
    private readonly projectService = new ProjectService();

    

    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const projects = await this.projectService.getAllProjects();

            return successResponse(
                res,
                "Projects retrieved successfully",
                projects
            );
        } catch (error) {
            return next(error);
        }
    };

    getById = async (
        req: Request<ProjectParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const project = await this.projectService.getProjectById(
                req.params.id
            );

            if (!project) {
                return errorResponse(res, "Project not found", 404);
            }

            return successResponse(
                res,
                "Project detail retrieved successfully",
                project
            );
        } catch (error) {
            return next(error);
        }
    };

    create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const validation = createProjectSchema.safeParse(req.body);

            if (!validation.success) {
                return errorResponse(
                    res,
                    "Invalid project data",
                    400,
                    validation.error.flatten()
                );
            }

            const project = await this.projectService.createProject(
                validation.data
            );

            return successResponse(
                res,
                "Project created successfully",
                project,
                201
            );
        } catch (error) {
            return next(error);
        }
    };
}