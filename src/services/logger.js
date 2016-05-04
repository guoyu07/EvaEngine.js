import Env from './env';
import Config from './config';
import { Dependencies } from 'constitute';
import winston from 'winston';

@Dependencies(Env, Config) //eslint-disable-line new-cap
export default class Logger {
  constructor(env, config) {
    this.env = env;
    this.config = config;

    let level = env.isProduction() ? 'info' : 'debug';
    if (process.env.LOG_LEVEL) {
      level = process.env.LOG_LEVEL;
    }
    winston.level = this.level = level;
    this.instance = null;
    this.label = null;
  }

  getWinston() {
    return winston;
  }

  getInstance() {
    if (this.instance) {
      return this.instance;
    }
    const logPath = this.config.get().logger.file;
    this.instance = this.env.isProduction() ? new (winston.Logger)({
      transports: [
        new (winston.transports.File)({
          name: 'global-file',
          level: this.level,
          label: this.label,
          filename: logPath
        })
      ]
    }) : new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          name: 'global-console',
          level: this.level,
          label: this.label,
          colorize: true
        }),
        new (winston.transports.File)({
          name: 'global-file',
          level: this.level,
          label: this.label,
          filename: logPath
        })
      ]
    });
    return this.instance;
  }

  setLabel(label) {
    this.label = label;
  }

  debug(...args) {
    return this.getInstance().debug(...args);
  }

  verbose(...args) {
    return this.getInstance().verbose(...args);
  }

  info(...args) {
    return this.getInstance().info(...args);
  }

  warn(...args) {
    return this.getInstance().warn(...args);
  }

  error(...args) {
    return this.getInstance().error(...args);
  }
}
