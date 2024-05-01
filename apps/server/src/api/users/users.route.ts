import { Router } from "express"
import { RouterHelper } from  "../../helpers/router.helper";
import { UserControllerInstance } from "./users.controller";
import passport from 'passport'
import { ErrorHandlerInstance } from "../../middleware/Error.middleware";
import { InternalServerError } from "http-errors";
require("../../helpers/passport.helper");

const { validateRoute, schemas } = RouterHelper;
const usersRouter = Router();

usersRouter.get("/", UserControllerInstance.getUsers);

// Get use through jwt
usersRouter.get("/getuser",function (req: any, res, next) {
    passport.authenticate('jwt',{ session:false}, function (err, user, info) {
        if(err) {
          ErrorHandlerInstance.error(new InternalServerError(err),req, res);
          return;
        }else if(info){
           ErrorHandlerInstance.error(new InternalServerError(info.toString()),req, res);
           return;
        }else if(!user){
            ErrorHandlerInstance.error(new InternalServerError('Failed to authenticate'),req, res);
            return;
        }
        req.user = user;
        next()
    })(req, res, next);
}, UserControllerInstance.getUserByJwt);

// Get use through jwt
usersRouter.post("/updateUser", UserControllerInstance.updateUser);

usersRouter.post("/register", validateRoute(schemas.authSignUpSchema), UserControllerInstance.createUsers);

usersRouter.post("/signin",validateRoute(schemas.authSignInSchema), function (req: any, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) next();
        req.user = user;
        next()
    })(req, res, next);
}, UserControllerInstance.signIn);


export { usersRouter };