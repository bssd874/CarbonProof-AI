import cors from "cors";
import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import projectRouter from "./routes/project.routes";
import { successResponse } from "./utils/api-response";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/api/health",
    (_req: Request, res: Response) => {
        return successResponse(
            res,
            "CarbonProof AI backend is running",
            {
                service: "carbonproof-ai-api",
                status: "healthy",
                timestamp: new Date().toISOString(),
            }
        );
    }
);

app.use("/api/projects", projectRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;