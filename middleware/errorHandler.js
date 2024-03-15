import { logEvents } from "./logEvents.js";

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errorLog.txt");
  
  const statusCode = res.statusCode && res.statusCode != 200 ? res.statusCode : 500;
  console.log(statusCode, err.stack);
  
  res.status(statusCode).send({
    status: "error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;
