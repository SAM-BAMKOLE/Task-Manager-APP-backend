import { model, Schema } from "mongoose";
import { ROLES } from "../config/roles.js";
import bcrypt from "bcryptjs";
import Task from "./taskModel.js";

const userModel = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        password: { type: String, required: true },
        tasks: [{ type: Schema.Types.ObjectId, ref: "task" }],
        roles: { user: { type: Number, default: ROLES.USER }, editor: Number, admin: Number },
        refreshToken: String,
    },
    { timestamps: true }
);

userModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

userModel.methods.comparePassword = async function (pwd) {
    return await bcrypt.compare(pwd, this.password);
};

// IF YOU WANT TO USE THIS, COMMENT OUT THE TASK FIELD IN USER_MODEL
// userModel.virtual("tasks", {
//     ref: "task",
//     localField: "_id",
//     foreignField: "creator",
// });

userModel.pre("remove", async function (next) {
    await Task.deleteMany({ creator: this._id });
    next();
});

const User = model("user", userModel);

export default User;
