import { NextFunction, Request, Response } from "express";
import Joi, { Schema } from "joi";
import logger from "../loaders/logger";

export const RouterHelper = {
  validateRoute: (schema: Schema, byQuery = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
      logger.info(
        `router.helper.ts--In ValidateRoute-- Validate route has been called- schema ${JSON.stringify(
          req.body
        )}`
      );
      const result = byQuery
        ? schema.validate(req.query)
        : schema.validate(req.body);
      if (result.error) {
        logger.error(
          "router.helper.ts--In ValidateRoute- - Validate route has failed"
        );
        return res.status(400).json({
          message: result.error.details[0].message,
          status: false,
        });
      }
      next();
    };
  },
  schemas: {
    // need to make as one schema
    authSignUpSchema: Joi.object().keys({
      userName: Joi.string().min(3).max(20).required(),
      email: Joi.string().email({}).required(),
      password: Joi.string()
        .min(5)
        .max(10)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    }),
    authSignInSchema: Joi.object().keys({
      email: Joi.string().email({}).required(),
      password: Joi.string().required(),
    }),
  },
};
