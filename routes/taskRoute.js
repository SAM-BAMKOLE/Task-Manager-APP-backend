import { Router } from "express";
import { addTask, getAllTasks, getTask, getUserTasks } from "../controllers/task.js";
import { verifyTaskOwner } from "../middlewares/verifyTaskOwner.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import { ROLES } from "../config/roles.js";

const router = Router();

router.use;

router.get("/", getUserTasks);
router.post("/create", addTask);
router.get("/get-all", verifyRoles(ROLES.ADMIN), getAllTasks);
router.get("/:taskId", verifyTaskOwner, getTask);

export default router;
