import { NextFunction, Request, Response } from "express";
import { VerificationService } from "../services/verification.service";
import {
    errorResponse,
    successResponse,
} from "../utils/api-response";

type ProjectParams = {
    id: string;
};


export class VerificationController {
    private readonly verificationService =
        new VerificationService();

    verify = (
        req: Request<ProjectParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const report =
                this.verificationService.verifyProject(req.params.id);

            if (!report) {
                return errorResponse(res, "Project not found", 404);
            }

            return successResponse(
                res,
                "AI verification completed successfully",
                report
            );
        } catch (error) {
            return next(error);
        }
    };

    getReport = (
        req: Request<ProjectParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const report =
                this.verificationService.getReport(req.params.id);

            if (!report) {
                return errorResponse(
                    res,
                    "Verification report not found",
                    404
                );
            }

            return successResponse(
                res,
                "Verification report retrieved successfully",
                report
            );
        } catch (error) {
            return next(error);
        }
    };
}