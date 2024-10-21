import { connect } from "mongoose";
import logger from "../utils/logger.js";
const connString = process.env.DB_CONN;

export const connectDb = async function () {
    try {
        const conn = await connect(connString);
        logger.info(
            `Server connected to database and database running on port ${conn.connection.port}`
        );
    } catch (e) {
        logger.error(`Server refused to connect to database with message: ${e.message}`);
        process.exit(1);
    }
};
