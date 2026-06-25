import cors from "cors";
import express, { Request, Response } from "express";
import { prisma } from "./config/database";
import { env } from "./config/env";
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

app.get("/", (_req: Request, res: Response) => {
    return successResponse(
        res,
        "CarbonProof AI API",
        {
            service: "carbonproof-ai-api",
            status: "running",
            health: "/api/health",
            projects: "/api/projects",
        }
    );
});

app.get(
    "/api/health",
    async (_req: Request, res: Response) => {
        if (env.dataStore === "memory") {
            return successResponse(
                res,
                "CarbonProof AI local demo backend is running",
                {
                    service: "carbonproof-ai-api",
                    status: "healthy",
                    database: "memory",
                    timestamp: new Date().toISOString(),
                }
            );
        }

        try {
            await prisma.$queryRaw`SELECT 1`;

            return successResponse(
                res,
                "CarbonProof AI backend is running",
                {
                    service: "carbonproof-ai-api",
                    status: "healthy",
                    database: "connected",
                    timestamp: new Date().toISOString(),
                }
            );
        } catch (error) {
            console.error("Health check database failure", error);

            return res.status(503).json({
                success: false,
                message: "Backend is running but the database is unavailable",
                data: {
                    service: "carbonproof-ai-api",
                    status: "degraded",
                    database: "disconnected",
                    timestamp: new Date().toISOString(),
                },
            });
        }
    }
);

app.use("/api/projects", projectRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
