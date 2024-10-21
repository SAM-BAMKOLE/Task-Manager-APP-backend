import { createLogger, format as _format, transports as _transports } from "winston";

const logger = createLogger({
    level: "info",
    format: _format.combine(
        _format.timestamp(), // adds a timestamp property
        _format.json()
    ),
    transports: [
        new _transports.Console(),
        new _transports.File({ filename: "log/error.log", level: "warn" }),
        new _transports.File({ filename: "log/app.log" }),
    ],
});

export default logger;
