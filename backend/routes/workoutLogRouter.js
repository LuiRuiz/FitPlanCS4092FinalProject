import express from "express";
import { getWorkoutLogs, updateWorkoutLog } from "../controllers/workoutLogController.js";

const router = express.Router();


router.get("/getworkoutlogs", getWorkoutLogs)

router.put("/updateworkoutlog/:id", updateWorkoutLog);


export default router;