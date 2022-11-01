const morgan = require("morgan");
const {stream} = require("./logger");

const format = () => {
  const result = process.env.NODE_ENV === "production" ? "combined" : "common";
  return result;
};

const skip = (_, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.ststusCode < 400;
  }
  return false;
};

const morganMiddleware = morgan(format(), { stream, skip });

module.exports = morganMiddleware;
