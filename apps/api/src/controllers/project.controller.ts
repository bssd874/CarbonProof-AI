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

    

    getAll = (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const projects = this.projectService.getAllProjects();

            return successResponse(
                res,
                "Projects retrieved successfully",
                projects
            );
        } catch (error) {
            return next(error);
        }
    };

    getById = (
        req: Request<ProjectParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const project = this.projectService.getProjectById(
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

    create = (
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

            const project = this.projectService.createProject(
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