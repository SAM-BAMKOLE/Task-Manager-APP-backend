import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";
import { RESPONSE } from "../config/responseStatus.js";
import { STATUS } from "../config/status.js";
import moment from "moment";

export const addTask = expressAsyncHandler(async (req, res) => {
    const userId = req.userId;
    const foundUser = await User.findById(userId);
    if (!foundUser) {
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "User with this id does not exist" });
    }

    // get task info
    const { title, description, activities, datetime } = req.body;

    if (!title)
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "Title is required" });
    if (!moment(datetime).toDate())
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "Date is required" });

    const newTask = await Task.create({
        title,
        description,
        activities,
        datetime,
        creator: foundUser,
    });

    if (!newTask)
        return res.status(RESPONSE.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: "Unable to create new task, please try again!",
        });
    foundUser.tasks.push(newTask._id);
    await foundUser.save();

    res.status(RESPONSE.CREATED).json({
        status: STATUS.SUCCESS,
        message: "Task created",
    });
    return;
});

export const editTask = expressAsyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
        return res
            .status(RESPONSE.NOT_FOUND)
            .json({ status: STATUS.ERROR, message: "Invalid task id, this task doesn't exist" });
    }
    // get info
    const { data } = req.body;

    if (!task[data.name])
        return res.status(RESPONSE.BAD_REQUEST).json({
            status: STATUS.ERROR,
            message: "Cannot update invalid data, not found in task",
        });

    task[data.name] = data.value;

    await task.save();

    return res
        .status(RESPONSE.SUCCESS)
        .json({ status: STATUS.SUCCESS, message: `Task ${data.name} updated` });
});

export const getTask = expressAsyncHandler(async (req, res) => {
    const taskId = req.params.taskId;

    const foundTask = await Task.findById(taskId).populate({
        path: "creator",
        select: "_id firstname lastname email",
    });

    if (!foundTask) {
        return res
            .status(RESPONSE.NOT_FOUND)
            .json({ status: STATUS.ERROR, message: "Invalid task id, this task doesn't exist" });
    }

    res.json({ status: STATUS.SUCCESS, data: foundTask });
    return;
});

export const getAllTasks = expressAsyncHandler(async (req, res) => {
    const tasks = await Task.find().populate({ path: "creator" });

    return res.json({ status: STATUS.SUCCESS, data: tasks });
});

export const getUserTasks = expressAsyncHandler(async function (req, res) {
    const userId = req.userId;
    const tasks = await Task.find({ creator: userId }).populate({
        path: "creator",
        select: "_id firstname lastname email",
    });

    return res.json({ status: STATUS.SUCCESS, data: tasks });
});
