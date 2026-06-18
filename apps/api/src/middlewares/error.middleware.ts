import {
    NextFunction,
    Request,
    Response,
} from "express";
import multer from "multer";
import { env } from "../config/env";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/app-error";
import { errorResponse } from "../utils/api-response";

export function errorMiddleware(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(error);

    if (error instanceof AppError) {
        return errorResponse(
            res,
            error.message,
            error.statusCode,
            error.details
        );
    }

    if (error instanceof multer.MulterError) {
        const statusCode =
            error.code === "LIMIT_FILE_SIZE"
                ? 413
                : 400;

        return errorResponse(
            res,
            error.message,
            statusCode,
            {
                code: error.code,
                field: error.field,
            }
        );
    }

    if (
        error instanceof SyntaxError &&
        "body" in error
    ) {
        return errorResponse(
            res,
            "Invalid JSON request body",
            400
        );
    }

    if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
    ) {
        return errorResponse(
            res,
            getPrismaErrorMessage(error.code),
            getPrismaStatusCode(error.code),
            {
                code: error.code,
                meta: error.meta,
            }
        );
    }

    return errorResponse(
        res,
        "Internal server error",
        500,
        env.nodeEnv === "development"
            ? serializeError(error)
            : undefined
    );
}

function getPrismaStatusCode(code: string) {
    if (code === "P2002" || code === "P2003") {
        return 409;
    }

    if (code === "P2025") {
        return 404;
    }

    return 400;
}

function getPrismaErrorMessage(code: string) {
    const messages: Record<string, string> = {
        P2002: "A record with the same unique value already exists",
        P2003: "Related record does not exist",
        P2025: "Requested record was not found",
    };

    return messages[code] ?? "Database request failed";
}

function serializeError(error: unknown) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return error;
}
