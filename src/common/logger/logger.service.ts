import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tehran',
};

@Injectable()
export class CustomLoggerService implements LoggerService {
  log(message: any, filename: string) {
    const logData = this._prepareLogMassage(message, 'SERVER');
    console.log(logData);
    this._logToFile(logData, filename);
  }

  error(message: any, filename: string) {
    const logData = this._prepareLogMassage(message, 'ERROR');
    console.error(logData);
    this._logToFile(logData, filename);
  }
  warn(message: any, filename: string) {
    const logData = this._prepareLogMassage(message, 'WARN');
    console.warn(logData);
    this._logToFile(logData, filename);
  }

  _prepareLogMassage(message: string, type: string) {
    const dateTime = `${new Date().toLocaleDateString('en-US', options)}`;
    return `[CUSTOM_LOG_${type}]-${dateTime}\t${message}`;
  }

  _logToFile(message: string, logName: string) {
    if (!fs.existsSync(join(__dirname, '..', '..', '..', 'logs'))) {
      console.log(1);
      fs.mkdirSync(join(__dirname, '..', '..', '..', 'logs'));
    }
    fs.appendFileSync(
      join(__dirname, '..', '..', '..', 'logs', logName),
      message,
    );
  }
}
