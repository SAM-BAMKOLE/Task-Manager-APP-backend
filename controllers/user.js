import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { RESPONSE } from "../config/responseStatus.js";
import { STATUS } from "../config/status.js";
import { ROLES } from "../config/roles.js";

export const getUser = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const foundUser = await User.findById(userId)
        .select(["-password", "-refreshToken"])
        .populate("tasks"); // OR .select("-password -refreshToken")

    if (!foundUser) {
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "User with this id does not exist" });
    }
    res.json({ status: STATUS.SUCCESS, data: foundUser });
    return;
});
export const updateUser = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "User with this id does not exist" });
    }

    const data = req.body;

    if (!foundUser[data.name]) {
        return res.status(RESPONSE.BAD_REQUEST).json({
            status: STATUS.ERROR,
            message: "Bad request, data key does not exist in server",
        });
    }
    foundUser[data.name] = data.value;
    await foundUser.save();

    res.json({ status: STATUS.SUCCESS, message: `${data.name} updated`, data: foundUser });
});
export const deleteUser = expressAsyncHandler(async (req, res) => {});

export const makeAdmin = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId)
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "Please specify the user" });
    const foundUser = await User.findById(userId);
    if (!foundUser)
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "Invalid id, user does not exist" });

    foundUser.roles = { ...foundUser.roles, admin: ROLES.ADMIN };

    await foundUser.save();

    res.json({
        status: STATUS.SUCCEDD,
        message: `User \"${foundUser.firstname}\" is now an Admin`,
    });
});
