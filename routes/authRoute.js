import { Router } from "express";
import {
    userSignup as signup,
    userSignin as signin,
    refreshUserToken,
} from "../controllers/auth.js";
// import verifyJwt from "../middlewares/verifyJwt.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refreshUserToken);

export default router;
