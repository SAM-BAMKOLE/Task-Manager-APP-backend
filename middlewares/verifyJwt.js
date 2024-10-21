import jwt from "jsonwebtoken";
import { RESPONSE } from "../config/responseStatus.js";
import { STATUS } from "../config/status.js";

const verifyJwt = (req, res, next) => {
    // Get bearer token from frontend
    const authHeader = req.headers.authorization || req.headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(RESPONSE.UNAUTHORIZED).json({
            status: STATUS.ERROR,
            message: "Empty token, please sign in",
        });
    }
    // separate and get token alone
    const token = authHeader.split(" ")[1];

    // verify the token is atill allowed, not expired and is correct
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, tokenData) => {
        if (err || !tokenData) {
            // create new error
            const error = new Error("Invalid token");
            res.status(RESPONSE.UNAUTHORIZED);
            return next(error);
        }
        req.userId = tokenData.userId;
        req.roles = tokenData.roles;
    });
    next();
};

export default verifyJwt;
