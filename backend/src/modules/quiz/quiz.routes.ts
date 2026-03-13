import { Router } from "express";
import { createQuizController} from "./quiz.controller";
import { getQuizByIdController } from "./quiz.controller";
import { getAllQuizzesInAModuleController } from "./quiz.controller";
import { getQuizByNameController } from "./quiz.controller";
import { getAllQuizzesController } from "./quiz.controller";


const router = Router();

router.post("/create-quiz", createQuizController);
router.get("/:id", getQuizByIdController);
router.get("/get-quizzes-in-module/:moduleId",getAllQuizzesInAModuleController);
router.get("/search-quizz-by-name",getQuizByNameController);
router.get("/",getAllQuizzesController);

export default router;