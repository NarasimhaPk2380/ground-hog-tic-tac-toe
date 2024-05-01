import { Request, Response, NextFunction } from "express";
import { HttpError, NotFound } from "http-errors";
import logger from "../loaders/logger";

export class ErrorHandlerMiddleware {
  // default as development;
  public isProduction = process.env.NODE_ENV || "development";

  public appError(req: Request, res: Response, next: NextFunction): void {
    next(new NotFound());
  }

  public error(
    error: HttpError,
    req: Request,
    res: Response,
  ): void {
    logger.error(
      "Error.middleware.ts--In ErrorHandlerMiddleware",
      error.message
    );
    res.status(error.statusCode || 500);
    res.json({
      name: error.name,
      message: error.message,
      errors: error["errors"] || [],
    });
  }
}

export const ErrorHandlerInstance = new ErrorHandlerMiddleware();
