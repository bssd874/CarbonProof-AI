import {
    NextFunction,
    Request,
    Response,
} from "express";

import { EvidenceService } from "../services/evidence.service";
import {
    errorResponse,
    successResponse,
} from "../utils/api-response";
import { addEvidenceSchema } from "../validators/evidence.validator";
import { syncEvidenceProofSchema } from "../validators/evidence.validator";

type ProjectParams = {
    id: string;
};

type EvidenceParams = ProjectParams & {
    evidenceId: string;
};

export class EvidenceController {
    private readonly evidenceService =
        new EvidenceService();

    create = async (
        req: Request<ProjectParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    "Evidence file is required",
                    400
                );
            }

            const validation =
                addEvidenceSchema.safeParse(req.body);

            if (!validation.success) {
                return errorResponse(
                    res,
                    "Invalid evidence metadata",
                    400,
                    validation.error.flatten()
                );
            }

            const evidence =
                await this.evidenceService.addEvidence(
                    req.params.id,
                    {
                        ...validation.data,
                        file: req.file,
                    }
                );

            if (!evidence) {
                return errorResponse(
                    res,
                    "Project not found",
                    404
                );
            }

            return successResponse(
                res,
                "Evidence uploaded successfully",
                evidence,
                201
            );
        } catch (error) {
            return next(error);
        }
    };

    syncProof = async (
        req: Request<EvidenceParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const validation =
                syncEvidenceProofSchema.safeParse(
                    req.body
                );

            if (!validation.success) {
                return errorResponse(
                    res,
                    "Invalid proof metadata",
                    400,
                    validation.error.flatten()
                );
            }

            const evidence =
                await this.evidenceService
                    .syncProofMetadata(
                        req.params.id,
                        req.params.evidenceId,
                        validation.data
                    );

            if (!evidence) {
                return errorResponse(
                    res,
                    "Evidence not found for this project",
                    404
                );
            }

            return successResponse(
                res,
                "Evidence proof metadata synced successfully",
                evidence
            );
        } catch (error) {
            return next(error);
        }
    };
}
