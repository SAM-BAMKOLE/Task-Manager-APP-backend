import expressAsyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import { RESPONSE } from "../config/responseStatus.js";

// NOTE: THIS MIDDLEWARE ONLY APPLIES IF THERE IS A ROUTE PARAMETER!
export const verifyTaskOwner = expressAsyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId;
    const userId = req.userId;

    const foundTask = await Task.findById(taskId);

    if (foundTask.creator == userId) next();
    else {
        const error = new Error("This task does not belong to you");
        res.status(RESPONSE.UNAUTHORIZED);
        return next(error);
    }
});
