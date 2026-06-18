import { Router } from "express";
import { EvidenceController } from "../controllers/evidence.controller";
import { ProjectController } from "../controllers/project.controller";
import { VerificationController } from "../controllers/verification.controller";
import { uploadEvidenceFile } from "../middlewares/upload.middleware";

const projectRouter = Router();

const projectController = new ProjectController();
const evidenceController = new EvidenceController();
const verificationController = new VerificationController();

projectRouter.get("/", projectController.getAll);
projectRouter.post("/", projectController.create);
projectRouter.get("/:id", projectController.getById);

projectRouter.post(
    "/:id/evidence",
    uploadEvidenceFile.single("file"),
    evidenceController.create
);

projectRouter.patch(
    "/:id/evidence/:evidenceId/proof",
    evidenceController.syncProof
);

projectRouter.post(
    "/:id/verify",
    verificationController.verify
);

projectRouter.get(
    "/:id/verification-report",
    verificationController.getReport
);

export default projectRouter;
