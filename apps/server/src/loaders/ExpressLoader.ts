import express, { Application, Router } from "express";
import { urlencoded, json } from "body-parser";
import cors from "cors";
import { ErrorHandlerInstance } from "../middleware/Error.middleware";
import { connect, ConnectOptions } from "mongoose";
import { CONFIGURATION } from "../config";
import { usersRouter } from "../api/users/users.route";
import passport from "passport";
import logger from "./logger";
// https://wanago.io/2018/12/03/typescript-express-tutorial-routing-controllers-middleware/

export class ExpressLoader {
  public app: Application;

  constructor(app: Application) {
    this.app = app;

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.intializeRoutes();
    this.initializeErrorHandling();
  }

  public intializeRoutes() {
    this.app.use("/api/users", usersRouter);
  }

  private initializeMiddlewares() {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(passport.initialize());
    logger.info(
      "ExpressLoader.ts--In initializeMiddlewares-Initalising the middleware"
    );
  }

  private initializeErrorHandling() {
    this.app.use(ErrorHandlerInstance.appError);
    this.app.use(ErrorHandlerInstance.error);
  }

  private connectToTheDatabase() {
    connect(CONFIGURATION.databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
      .then(() =>
        logger.info(
          "ExpressLoader.ts--In connectToTheDatabase-Database connected"
        )
      )
      .catch((err) =>
        logger.error(`ExpressLoader.ts--In connectToTheDatabase-${err}`)
      );
  }
}
