import { Router } from "express";
import { createFullModule } from "./modulo.controller";

const router = Router();

router.post("/create-module", createFullModule)
