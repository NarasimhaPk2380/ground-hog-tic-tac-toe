import { NextFunction, Request, Response } from "express";
import { ErrorHandlerInstance } from "../../middleware/Error.middleware";
import { BadRequest, InternalServerError } from "http-errors";
import { UserService } from "./user.service";
import { IUserDocument } from "./user.interface";
import logger from "../../loaders/logger";
import { JwtHelper } from "../../helpers/jwt.helper";

class UserController {
  userService:UserService
  constructor() {
      this.userService = new UserService();
  }

  createUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`users.controller.ts--In createUsers-body-${JSON.stringify(req.body)}`);
      await this.userService.createUsers(req.body);
      res.status(200).json({
        status: true,
        message: "User has been registered..Please Login",
      });
    } catch (e: any) {
      ErrorHandlerInstance.error(
        new InternalServerError(
          e.code == "11000" ? "Email already exists" : (e?.message ? e?.message : "Failed to create users")
        ),
        req,
        res,
      );
    }
  };

  signIn = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        logger.info(`users.controller.ts--In signIn-user-${JSON.stringify(req.user)}`);
        const userData = req.user as IUserDocument
        const token = this.userService.signIn(userData);
        return res.status(200).json({
          status: true,
          token,
          userId:userData.id,
          userData:req?.user,
        });
      } else {
        ErrorHandlerInstance.error(
          new BadRequest(
            "Invalid Credentials"
          ),
          req,
          res
        );
      }
    } catch (e: any) {
      ErrorHandlerInstance.error(
        new InternalServerError(
          e?.message ? e?.message : "Failed to signin user"
        ),
        req,
        res
      );
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`users.controller.ts--In getUsers`);
      const users = await this.userService.getUsers();
      return res.status(200).json({
        status:true,
        users,
      });
    } catch (e: any) {
      ErrorHandlerInstance.error(
        new InternalServerError(
          e?.message ? e?.message : "Failed to get users"
        ),
        req,
        res
      );
    }
  };

  getUserByJwt = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        logger.info(`users.controller.ts--In getUserByJwt-user-${JSON.stringify(req.user)}`);
        return res.status(200).json({
          user: req.user,
          status: true,
        });
      } else {
        return res.status(200).json({
          message: "Failed to get the data",
          status: false,
        });
      }
    } catch (e: any) {
      ErrorHandlerInstance.error(
        new InternalServerError(e?.message ? e?.message : "Failed to get user"),
        req,
        res
      );
    }
  };
   
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAvail = await JwtHelper.verifyJwt(req.headers.authorisation as string) as any;
      if (userAvail) {
        const updated = await this.userService.updateUsers(userAvail?.id, req.body)
        return res.status(200).json({
          message: "Updated",
        });
       
      } else {
        return res.status(500).json({
          message: "Invalid Token or Token Expired",
        });
      }
    } catch (e: any) {
      ErrorHandlerInstance.error(
        new InternalServerError(
          e?.message ? e?.message : "Failed to update the profile"
        ),
        req,
        res
      );
    }
  };
}

export const UserControllerInstance = new UserController()
