import { RESPONSE } from "../config/responseStatus.js";

const verifyRoles = function (...allowedRoles) {
    return (req, res, next) => {
        if (!req.roles) {
            const error = new Error("Invalid roles");
            res.status(RESPONSE.UNAUTHORIZED);
            next(error);
        }
        const allUserRoles = [...allowedRoles];
        const result = req.roles
            .map((role) => allUserRoles.includes(role))
            .find((val) => val === true);
        if (!result) {
            const error = new Error("Not authorized for this action");
            res.status(RESPONSE.UNAUTHORIZED);
            next(error);
        }
        next();
    };
};

export default verifyRoles;

export const verifyUserWithOther = function (...allowedRoles) {
    return (req, res, next) => {
        if (req.roles.map((role) => [...allowedRoles].includes(role)).find((val) => val == true)) {
            return next();
        } else if (req.userId == req.params.userId) {
            return next();
        } else {
            res.status(RESPONSE.UNAUTHORIZED);
            const error = new Error("Invalid role, cannot access this route");
            return next(error);
        }
    };
};
