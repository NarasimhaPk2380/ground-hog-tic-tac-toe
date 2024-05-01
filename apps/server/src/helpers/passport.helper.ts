import passport from "passport";
import passportJWT from "passport-jwt";
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../api/users/users.model";
import { CONFIGURATION } from "../config";
import logger from "../loaders/logger";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CONFIGURATION.JwtSecretKey,
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.sub);
        logger.info(
          `passport.helper.ts--In JwtStrategy-${JSON.stringify(user)}`
        );
        if (user) {
          done(null, user);
        }
        done(null, false);
      } catch (error) {
        logger.error(`passport.helper.ts--In JwtStrategy-${error}`);
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, pwd, done) => {
      try {
        const user = await UserModel.findOne({
          email: email,
        });
        logger.info(
          `passport.helper.ts--In LocalStrategy-user-${JSON.stringify(user)}`
        );
        if (!user) {
          return done(null, false);
        }
        const isPwdMatch = await user.isValidPwd(pwd);
        logger.info(
          `passport.helper.ts--In LocalStrategy-isPwdMatch-${isPwdMatch}`
        );
        if (!isPwdMatch) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        logger.error(`passport.helper.ts--In LocalStrategy-${error}`);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user: any, done) {
  done(null, user);
});
