const winston = require("winston");
// const winstonDaily = require("winston-daily-rotate-file");
const fs =require('fs');
const process = require("process");
const moment = require('moment');
const { combine, timestamp, label, printf } = winston.format;

/**
 * 오늘날짜 조회
 * --
 */
 const getToday = () => {
  const d = new Date();
  const dd = {
    year: `${d.getFullYear()}`,
    month:
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`,
    day: d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`,
    timestamp: d.getTime() / 1000,
  };
  return {
    ...dd,
    date: `${dd.year}${dd.month}${dd.day}`,
  };
};
let today = getToday();
let todayLog = null;

/**
 * 디렉터리정보 조회
 * --
 */
const getDirPath = () => {
  const td = getToday();
  const { year, month, day } = td;
  today = { ...td };

  // 로그폴더
  const logFolderDir = `${process.cwd()}/logs`;
  // 연
  const logYearDir = `${logFolderDir}/${year}`;
  // 월
  const logMonthDir = `${logYearDir}/${month}`;
  // 월
  const logDayDir = `${logMonthDir}/${day}`;

  return {
    logFolderDir,
    logYearDir,
    logMonthDir,
    logDayDir,
  };
};

/**
 * 로그패스 생성
 * --
 */
const createLogDir = () => {
  const { logFolderDir, logYearDir, logMonthDir, logDayDir } = getDirPath();

  const logDir = logFolderDir;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  // 연 - 폴더생성
  if (!fs.existsSync(logYearDir)) {
    fs.mkdirSync(logYearDir);
  }
  // 월 - 폴더생성
  if (!fs.existsSync(logMonthDir)) {
    fs.mkdirSync(logMonthDir);
  }
  // 일 - 폴더생성
  if (!fs.existsSync(logDayDir)) {
    fs.mkdirSync(logDayDir);
  }
}; 

// 로그 파일 저장 경로 루트경로/logs 폴더
const logDir = `${process.cwd()}/logs`;
// log 출력 포맷 정의 함수
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
});

const fileOption = () => {
  const { logDayDir } = getDirPath();
  return {
    dirname: logDayDir,
    json: true,
    // maxsize: 5242880, // 5MB
    // maxFiles: 5,
    // colorize: false,
    format: combine(
      label({ label: 'citydatahub_security_module' }),
      timestamp(),
      logFormat // log 출력 포맷
    ),
  };
};

const logger = winston.createLogger({
  // 로그 출력 형식 정의
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "citydatahub_security_module" }),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      level: "info", // level 설정, info = 2 , 2미만 다 기록
      filename:"info.log",
      ...fileOption(),
      // datePattern: "YYYY-MM-DD", // data 형식
      // dirname: logDir + "/info", // log 경로
      // filename: `%DATE%.info.log`, // 파일 이름
      // maxFiles: 30, // 최근 30일치 로그 파일을 남김
      // zippedArchive: true, // gzip으로 압축 여부
    }),
    //* error
    new winston.transports.File({
      level: "error", // error Level만 기록
      filename:"error.log",
      ...fileOption(),
      // datePattern: "YYYY-MM-DD",
      // dirname: logDir + "/error", // /logs/error
      // filename: `%DATE%.error.log`,
      // maxFiles: 30,
      // zippedArchive: true,
    }),
  ],
  // Try-catch 에러 캐칭
  exceptionHandlers: [
    new winston.transports.File({
      level: "error",
      filename:"exception.log",
      ...fileOption(),
      // datePattern: "YYYY-MM-DD",
      // dirname: logDir,
      // filename: `%DATE%.exception.log`,
      // maxFiles: 30,
      // zippedArchive: true,
    }),
  ],
});

const stream = {
  // morgan wiston 설정
  write: (message) => {
    const d = getToday();

    // 날짜가 바꼈을 때
    if (!todayLog || today.date !== d.date) {
      createLogDir();
      today = {...d };
      todayLog = d.date;
    }
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // level별로 색상 적용
        winston.format.simple()
      ),
    })
  );
}

module.exports = {logger, stream};
