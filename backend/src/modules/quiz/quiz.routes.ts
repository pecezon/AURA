import { Router } from "express";
import { createQuizController} from "./quiz.controller";

const router = Router();

router.post("/create-quiz", createQuizController);

export default router;