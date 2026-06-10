import {
    NextFunction,
    Request,
    Response,
} from "express";
import { env } from "../config/env";
import { errorResponse } from "../utils/api-response";

export function errorMiddleware(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(error);

    return errorResponse(
        res,
        "Internal server error",
        500,
        env.nodeEnv === "development" ? error : undefined
    );
}