import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development"; // default as development
const envAvailable = dotenv.config();

// if (envAvailable.error) {
//   throw new Error("Couldn't find .env file");
// }
const MONGODB_ATLAS_URL = "mongodb://localhost:27017";
export const CONFIGURATION = {
  port: process.env.PORT || 8888, // PORT

  JwtIssuer: process.env.JWT_ISSUER || "tic-tac-toe",

  JwtSecretKey: process.env.JWT_SECRET_KEY || "tic-tac-toe",

  databaseURL: process.env.MONGODB_URI || MONGODB_ATLAS_URL,

  logs: {
    level: process.env.LOG_LEVEL || "silly", // LOGS
  },
  api: {
    prefix: "/api", // ROUTE LEVEL API
  }
};
