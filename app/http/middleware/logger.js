import config from "../../../config/app.js";
import morgan from "morgan";
import { createLogger, format, transports } from "winston";

export const winstonLogger = createLogger({
  transports: new transports.Console({
    level: "http",
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      format.printf(
        info => `[${info.timestamp}] ${info.level}: ${info.message}`,
      ),
    ),
  }),
});

export default morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    skip: () => config.mute_logger === "ON",
    stream: {
      write: message => winstonLogger.http(message.trim()),
    },
  },
);
