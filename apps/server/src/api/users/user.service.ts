import { IUser, IUserDocument } from "./user.interface";
import { UserModel } from "./users.model";
import { JwtHelper } from "../../helpers/jwt.helper";

export class UserService {
  createUsers = (userData: IUser) => {
    try {
      const newUser = new UserModel(userData);
      return newUser.save();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
  signIn = (userData: IUserDocument) => {
    try {
      return JwtHelper.generateToken(userData);
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
  getUsers = () => {
    try {
      return UserModel.find();
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
  getUser = (userId: string) => {
    try {
      return UserModel.findById(userId);
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
  updateUsers = async(id, data) => {
    try {
      const { player_1, player_2, winnerId, isDraw } = data;
      const firstPlayerData = await UserModel.findById(player_1);
      const secondPlayerData = await UserModel.findById(player_2);
      if(!isDraw && winnerId && firstPlayerData.id === winnerId) {
        firstPlayerData.noOfGamesPlayed = firstPlayerData.noOfGamesPlayed + 1;
        firstPlayerData.noOfGamesWins = firstPlayerData.noOfGamesWins + 1;
        secondPlayerData.noOfGamesPlayed = secondPlayerData.noOfGamesPlayed + 1;
        secondPlayerData.noOfGamesLost = secondPlayerData.noOfGamesLost + 1;
      } else if(!isDraw && winnerId && secondPlayerData.id === winnerId) {
        secondPlayerData.noOfGamesPlayed = secondPlayerData.noOfGamesPlayed + 1;
        secondPlayerData.noOfGamesWins = secondPlayerData.noOfGamesWins + 1;
        firstPlayerData.noOfGamesPlayed = firstPlayerData.noOfGamesPlayed + 1;
        firstPlayerData.noOfGamesLost = firstPlayerData.noOfGamesLost + 1;
      } else if(isDraw) {
        secondPlayerData.noOfGamesPlayed = secondPlayerData.noOfGamesPlayed + 1;
        firstPlayerData.noOfGamesPlayed = firstPlayerData.noOfGamesPlayed + 1;
      }
      await firstPlayerData.save();
      await secondPlayerData.save();
      return Promise.resolve(true);
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
}
