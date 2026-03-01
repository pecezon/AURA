import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import simulationRoutes from "./modules/simulations/simulations.routes";
// import profileRoutes from "./modules/profile/profile.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/simulations", simulationRoutes);
// app.use("/api/profile", profileRoutes);

export default app;
