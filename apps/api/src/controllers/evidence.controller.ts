import { NextFunction, Request, Response } from "express";
import { EvidenceService } from "../services/evidence.service";
import {
    errorResponse,
    successResponse,
} from "../utils/api-response";
import { addEvidenceSchema } from "../validators/evidence.validator";

type ProjectParams = {
    id: string;
};

export class EvidenceController {
    private readonly evidenceService = new EvidenceService();

    create = (
        req: Request<ProjectParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const validation = addEvidenceSchema.safeParse(req.body);

            if (!validation.success) {
                return errorResponse(
                    res,
                    "Invalid evidence data",
                    400,
                    validation.error.flatten()
                );
            }

            const evidence = this.evidenceService.addEvidence(
                req.params.id,
                validation.data
            );

            if (!evidence) {
                return errorResponse(res, "Project not found", 404);
            }

            return successResponse(
                res,
                "Evidence added successfully",
                evidence,
                201
            );
        } catch (error) {
            return next(error);
        }
    };
}