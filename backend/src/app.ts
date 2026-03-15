import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./modules/profile/profile.routes";
import modulesRoutes from "./modules/modulo/modulo.routes"
import courseRoutes from "./modules/course/course.routes";
import enrollmentRoutes from "./modules/enrollment/enrollment.routes";
import simulationRoutes from "./modules/simulation/simulation.routes"
import simulationAttemptRoutes from "./modules/simulationAttempt/simuAttempt.routes"
import { requireAuth } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Routes that need to be protected with authentication middleware should be registered after the auth middleware
app.use(requireAuth);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/simulations", simulationRoutes)
app.use("/api/simulations/attempt", simulationAttemptRoutes)

// Error handling middleware (must be last)
app.use(errorHandler);


export default app;
