import { sql } from "../config/db.js";

const legDayExercises = ["Leg-Press", "Hack-Squat", "Barbell-Squat", "Deadlift"];
const pullDayExercises = ["Bicep Curl", "Preacher Curl", "Lat Pulldown", "Seated Row"];
const pushDayExercises = ["Bench Press", "Incline Press", "Tricep Extention", "Lateral Raise"];

export const createWorkoutLogs = async (eventID, groupName) => {
    let exercises = [];

    switch (groupName) {
        case 'Leg Day':
            exercises = legDayExercises;
            break;
        case 'Pull Day':
            exercises = pullDayExercises;
            break;
        case 'Push Day':
            exercises = pushDayExercises;
            break;
        default:
            throw new Error(`Unknown exercise group: ${groupName}`);
    }

    try {
        // Insert each workout log tied to the eventID
        for (const workoutName of exercises) {
            await sql`
                INSERT INTO workout_logs(event_id, workout_name)
                VALUES (${eventID}, ${workoutName})
            `;
        }
        console.log(`Workout logs created for event ${eventID} with group ${groupName}`);
    } catch (error) {
        console.error('Error creating workout logs:', error);
        throw error;
    }
};


export const getWorkoutLogs = async (req, res) => {
    const { event_id } = req.query;

    if (!event_id) {
        return res.status(400).json({ success: false, message: "Event ID is required" });
    }

    try {
        const logs = await sql`
        SELECT * FROM workout_logs
        WHERE event_id = ${event_id}
        ORDER BY id ASC
        `;

        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error("Error fetching workout logs:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateWorkoutLog = async (req, res) => {
    const { id } = req.params;
    const { weight, reps, sets } = req.body;

    if (!id || weight == null || reps == null || sets == null) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        await sql`
            UPDATE workout_logs
            SET weight = ${weight}, reps = ${reps}, sets = ${sets}
            WHERE id = ${id}
        `;

        return res.status(200).json({ success: true, message: "Workout log updated successfully" });
    } catch (error) {
        console.error("Error updating workout log:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};