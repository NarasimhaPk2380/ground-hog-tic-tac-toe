import { Model, Document } from "mongoose";

export interface IUser {
  email: string;
  userName: string;
  password: string;
  noOfGamesPlayed: number;
  noOfGamesWins: number;
  noOfGamesLost: number;
}

export interface IUserDocument extends IUser, Document {
  id: string;
  isValidPwd(pwd: string): Promise<IUser>;
}

export type IUserModel = Model<IUserDocument>