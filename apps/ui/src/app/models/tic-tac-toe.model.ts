export interface GameResultI {
    player_1: string; 
    player_2: string;
    winnerId?: string;
    isDraw: boolean;
}

export interface UserDataI {
    _id: string;
    email: string;
    userName: string;
    password: string;
    noOfGamesPlayed: number;
    noOfGamesWins: number;
    noOfGamesLost: number;
} 

export interface Player extends UserDataI{
  urTurn?: boolean;
  symbol?: 'X' | 'O';
  fromId?: string;
  toId?: string;
  sent?: boolean
  gotRequest?: boolean;
  accept?: boolean;
}

export interface SignedUserI {
    userId: string;
    token: string;
    userData: UserDataI;
} 