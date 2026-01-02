import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const isDevelopment = process.env.NODE_ENV !== 'production';
const logsDirectory = process.env.LOGS_DIR || 'logs';

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('Randevusal', {
    colors: true,
    prettyPrint: true,
    processId: true,
    appName: true,
  }),
);

const errorRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: `${logsDirectory}/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: customFormat,
});

const combinedRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: `${logsDirectory}/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: customFormat,
});

const debugRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: `${logsDirectory}/debug-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  level: 'debug',
  format: customFormat,
});

const warnRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: `${logsDirectory}/warn-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'warn',
  format: customFormat,
});

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: isDevelopment ? 'debug' : 'info',
});

const transports: winston.transport[] = [
  consoleTransport,
  errorRotateFileTransport,
  combinedRotateFileTransport,
  warnRotateFileTransport,
];

if (isDevelopment) transports.push(debugRotateFileTransport);

export const winstonConfig: winston.LoggerOptions = {
  level: isDevelopment ? 'debug' : 'info',
  format: customFormat,
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: `${logsDirectory}/exceptions-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: `${logsDirectory}/rejections-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  exitOnError: false,
};
