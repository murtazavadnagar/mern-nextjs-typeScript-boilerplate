import { createLogger, format, transports } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) => {
      return stack
        ? `${timestamp} [${level.toUpperCase()}] ${message} - ${stack}`
        : `${timestamp} [${level.toUpperCase()}] ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});

export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};
