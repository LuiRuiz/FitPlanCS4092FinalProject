
import dotenv from "dotenv";
import { sql } from "./config/db.js";
dotenv.config();
const getMultiTable = async () => {
    try {
        const User_WorkoutLog_Table = sql`
                SELECT u.username, COUNT(wl.id) AS WorkoutLogCount
                FROM 
                    fitusers u
                JOIN 
                    exercise_events ee ON u.id = ee.userid
                JOIN 
                    workout_logs wl ON ee.id = wl.event_id
                GROUP BY 
                    u.username
                ORDER BY 
                    WorkoutLogCount DESC;`;


        if (User_WorkoutLog_Table.length === 0) {
            return 0
        };

        return User_WorkoutLog_Table;
    } catch (error) {
        console.error('Error fetching preference', error);
    }
};
const multi_table = await getMultiTable();
console.log(multi_table);