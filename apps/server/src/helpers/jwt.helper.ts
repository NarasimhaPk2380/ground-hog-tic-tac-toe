import { sign, verify } from "jsonwebtoken";
import { CONFIGURATION } from "../config";
import { UserModel } from "../api/users/users.model";
import { IUserDocument } from "../api/users/user.interface";
import logger from "../loaders/logger";

export const JwtHelper = {
  async verifyJwt(token: string) {
    try {
      logger.info(`jwt.helper.ts--In verifyJwt-token-${token}`);
      const jwtData = await verify(token, CONFIGURATION.JwtSecretKey);
      const user = await UserModel.findById(jwtData.sub);
      return user;
    } catch (e: any) {
      logger.error(
        `jwt.helper.ts--In verifyJwt-token-${token}-error-${e.message}`
      );
      throw new Error(e.message);
    }
  },
  generateToken(user: IUserDocument) {
    logger.info(`jwt.helper.ts--In generateToken-user-${JSON.stringify(user)}`);
    return sign(
      {
        iss: CONFIGURATION.JwtIssuer,
        sub: user.id,
        iat: new Date().getTime(),
      },
      CONFIGURATION.JwtSecretKey
    );
  },
};
