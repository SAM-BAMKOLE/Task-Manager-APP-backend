import express from "express";
import logger from "./utils/logger.js";
import { connectDb } from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
// ========== JWT ===========
import verifyJwt from "./middlewares/verifyJwt.js";
// =========== ROUTES ================
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import taskRoutes from "./routes/taskRoute.js";

const app = express();
const port = process.env.PORT || 3000;

connectDb();

// ========== cors ========
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// =========== MIDDLEWARES ============
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =========== USER DEFINED MIDDLEWARES ============

app.use("/auth", authRoutes);
// ========= ALWAYS VERIFY USER BEFORE ACCESSING USER ROUTES =========
app.use(verifyJwt);
app.use("/user", userRoutes);
app.use("/task", taskRoutes);
// ============ ERROR =============
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    logger.info("Server running on port " + port);
});
