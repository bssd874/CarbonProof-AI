import { Request, Response } from "express";
import { errorResponse } from "../utils/api-response";

export function notFoundMiddleware(
    req: Request,
    res: Response
) {
    return errorResponse(
        res,
        `Route ${req.method} ${req.originalUrl} not found`,
        404
    );
}