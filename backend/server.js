import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
// routes
import usersRoutes from "./routes/usersRouter.js"
import exerciseRoutes from "./routes/exerciseEventRouter.js"
import workoutLogRoutes from "./routes/workoutLogRouter.js"


// neondb config
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(morgan("dev"));

// add routes here:
app.use("/api/users", usersRoutes);
app.use("/api/exerciseEvent", exerciseRoutes)
app.use("/api/workoutlogs", workoutLogRoutes)

//add initDB here

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});