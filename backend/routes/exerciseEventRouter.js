import express from "express";
import { createExerciseEvents, getUpcomingExerciseEvents, getMonthlyExerciseEvents } from "../controllers/exerciseEventsController.js";

const router = express.Router();

router.post("/createEvents", createExerciseEvents);
router.get("/upcoming", getUpcomingExerciseEvents)
router.get("/monthly", getMonthlyExerciseEvents)

export default router;
