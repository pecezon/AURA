import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./modules/profile/profile.routes";
import courseRoutes from "./modules/course/course.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);



export default app;
