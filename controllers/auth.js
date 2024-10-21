import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { RESPONSE } from "../config/responseStatus.js";
import { STATUS } from "../config/status.js";
import jwt from "jsonwebtoken";

export const userSignup = expressAsyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    // verify if document is complete
    if (!firstname || !lastname || !email || !password) {
        res.status(RESPONSE.BAD_REQUEST).json({
            status: STATUS.ERROR,
            message: "All data is required",
            data: { firstname, lastname, email, password, confirmPassword },
        });
        return;
    }
    // check if email already exists
    const userExists = await User.findOne({ email: email });
    console.log(userExists);
    if (userExists) {
        res.status(RESPONSE.CONFLICT).json({
            status: STATUS.ERROR,
            message: "Email already exists, please signin",
        });
        return;
    }
    // check if passwords match
    if (password !== confirmPassword) {
        res.status(RESPONSE.BAD_REQUEST).json({
            status: STATUS.ERROR,
            message: "Passwords do not match",
        });
        return;
    }
    // create new user
    const user = new User({ firstname, lastname, email, password });
    const createdUser = await user.save();
    delete createdUser.password;
    return res.status(RESPONSE.CREATED).json({
        status: STATUS.SUCCESS,
        message: "User created successfully",
        // data: {
        //     createdUser: {
        //         id: createdUser._id,
        //         firstname: createdUser.firstname,
        //         lastname: createdUser.lastname,
        //         email: createdUser.email,
        //     },
        // },
    });
});

export const userSignin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // validate there's a body
    if (!email || !password) {
        return res
            .status(RESPONSE.BAD_REQUEST)
            .json({ status: STATUS.ERROR, message: "All fields are required", data: req.body });
    }
    const userExists = await User.findOne({ email });

    if (!userExists) {
        res.status(RESPONSE.FORBIDDEN).json({
            status: STATUS.ERROR,
            message: "Email does not exists, why not signup",
        });
        return;
    }

    if ((await userExists.comparePassword(password)) != true) {
        res.status(RESPONSE.UNAUTHORIZED).json({
            status: STATUS.ERROR,
            message: "Incorrect password",
        });
        return;
    }

    // log user in
    const refreshToken = jwt.sign({ userId: userExists._id }, process.env.REFRESH_TOKEN, {
        expiresIn: "1d",
    });
    const roles = Object.values(userExists.roles);
    const accessToken = jwt.sign({ userId: userExists._id, roles }, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
    });

    userExists.refreshToken = refreshToken;
    await userExists.save();

    // creqte http-only cookie with refreshToken
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    // added this just because i dont want to send the access token to the frontend localstorage
    /*
    res.cookie("access", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 10 * 60 * 1000,
    });
    */

    // send auth roles and token to user
    return res.json({
        status: STATUS.SUCCESS,
        message: "User logged in successfully",
        data: {
            roles: userExists.roles,
            accessToken: accessToken,
            user: {
                _id: userExists._id,
                firstname: userExists.firstname,
                lastname: userExists.lastname,
                email: userExists.email,
            },
        },
    });
});

export const refreshUserToken = expressAsyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res
            .status(RESPONSE.UNAUTHORIZED)
            .json({ status: STATUS.ERROR, message: "Please sign in first" });
    }
    // get refresh token
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.status(RESPONSE.UNAUTHORIZED).json({
            status: STATUS.ERROR,
            message: "You are not authorized for this action",
        });
        return;
    }
    // verify token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, tokenData) => {
        if (err || tokenData.userId !== foundUser._id.toString()) {
            res.status(RESPONSE.UNAUTHORIZED).json({
                status: STATUS.ERROR,
                message: "Unable to verify token",
            });
            return;
        }
    });
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign({ userId: foundUser._id, roles }, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
    });

    res.status(RESPONSE.OK).json({
        status: STATUS.SUCCESS,
        message: "Token refreshed",
        data: { accessToken: accessToken },
    });
});

export const logoutUser = async (req, res) => {
    delete req.userId;
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    return res.status(RESPONSE.OK).json({ status: STATUS.SUCCESS, message: "User Logged Out" });
};
