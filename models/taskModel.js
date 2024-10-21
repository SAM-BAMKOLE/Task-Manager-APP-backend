import { model, Schema } from "mongoose";
import { TASK_STATUS } from "../config/status.js";

const taskModel = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        datetime: { type: Date, required: true },
        activities: [{ type: String }],
        status: { type: String, default: TASK_STATUS.UNCOMPLETED },
        creator: { type: Schema.Types.ObjectId, ref: "user", required: true },
    },
    { timestamps: true }
);

const Task = model("task", taskModel);

export default Task;
