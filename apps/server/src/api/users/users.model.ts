import mongoose, { Schema } from "mongoose";
import { compare, genSalt, hash } from "bcryptjs";
import {
  IUserDocument,
  IUserModel,
} from "./user.interface";

const usersSchema: Schema<IUserDocument> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  noOfGamesPlayed: {
    type: Number,
    default: 0
  },
  noOfGamesWins: {
    type: Number,
    default: 0
  },
  noOfGamesLost: {
    type: Number,
    default: 0
  }
});

usersSchema.pre("save", async function (next) {
  const salt = await genSalt(10);
  const hashPwd = await hash(this.password, salt);
  this.password = hashPwd;
  next();
});

usersSchema.method("isValidPwd", async function (pwd: string) {
  try {
    return await compare(pwd, this.password);
  } catch (e: any) {
    throw new Error(e);
  }
});

const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>(
  "User",
  usersSchema
);

export { UserModel };
