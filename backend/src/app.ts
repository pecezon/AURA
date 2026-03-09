import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./modules/profile/profile.routes";
import quizRoutes from "./modules/quiz/quiz.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/quizzes", quizRoutes);

export default app;
