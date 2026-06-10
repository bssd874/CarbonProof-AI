import { Router } from "express";
import { EvidenceController } from "../controllers/evidence.controller";
import { ProjectController } from "../controllers/project.controller";
import { VerificationController } from "../controllers/verification.controller";

const projectRouter = Router();

const projectController = new ProjectController();
const evidenceController = new EvidenceController();
const verificationController = new VerificationController();

projectRouter.get("/", projectController.getAll);
projectRouter.post("/", projectController.create);
projectRouter.get("/:id", projectController.getById);

projectRouter.post(
    "/:id/evidence",
    evidenceController.create
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