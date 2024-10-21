import { Router } from "express";
import { getUser, updateUser, deleteUser, makeAdmin } from "../controllers/user.js";
import verifyRoles, { verifyUserWithOther } from "../middlewares/verifyRoles.js";
import { ROLES } from "../config/roles.js";

const router = Router();

// router.route("/details/:userId").get(verifyUserWithOther(ROLES.ADMIN), getUser).patch(updateUser);
router.route("/details/:userId").get(getUser).patch(updateUser);
router.delete("/delete/:userId", verifyUserWithOther(ROLES.ADMIN), deleteUser);
router.patch("/make-admin/:userId", verifyRoles(ROLES.ADMIN), makeAdmin);
export default router;
