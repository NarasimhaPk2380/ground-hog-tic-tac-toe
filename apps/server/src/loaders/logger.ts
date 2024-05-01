import winston from "winston";
import { CONFIGURATION } from "../config";

const transports = [];
if (process.env.NODE_ENV === "development") {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: "logs/main.log",
    })
  );
}

const LoggerInstance = winston.createLogger({
  level: CONFIGURATION.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export default LoggerInstance;
