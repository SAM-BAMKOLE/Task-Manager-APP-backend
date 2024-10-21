import { STATUS } from "../config/status.js";

export const notFound = (req, res, next) => {
    const error = new Error(`Invalid request route on: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (error, req, res, next) => {
    let message = error.message;
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // check for mongoose error
    if (error.name === "CastError" && error.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
    }
    
    res.status(statusCode).json({ status: STATUS.ERROR, message });
    return next();
};
