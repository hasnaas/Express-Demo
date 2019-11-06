
require("express-async-errors");
const winston = require('winston');


module.exports = function () {
    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({ filename: 'serverLogs.log' }));

    process.on("uncaughtException", (ex) => {
        winston.log("error", ex.message);
    })

    process.on("unhandledRejection", (ex) => {
        winston.log("error", ex.message);
    })

}