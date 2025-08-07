import { sql } from "../config/db.js";
import { format, addDays, startOfMonth, endOfMonth } from "date-fns"
import { getPreferences } from "./preferenceController.js";
import { createWorkoutLogs } from "./workoutLogController.js";
// used if preferences dont load 
const defaultPreferences = {
    prefTime: "7:00pm",
    restDays: 2,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false
}

const exerciseGroups = ['Push Day', "Leg Day", "Pull Day"];
// small function to handle group index for creating events in mass 

function handleExerciseIndex(index) {
    return (index + 1) % 3;
}
// used to get dates correct in createExerciseEvents
export const getMostRecentExerciseDate = async (userID) => {
    try {
        const result = await sql`
            SELECT date 
            FROM exercise_events
            WHERE userid = ${userID}
            ORDER BY date DESC
            LIMIT 1
        `;

        if (result.length > 0 && result[0].date) {
            return addDays(new Date(result[0].date), 1);
            console.log(result)


        } else {
            return new Date(); // return today if no event found
        }
    } catch (error) {
        console.error('Error fetching most recent exercise event date:', error);
        return new Date(); // fallback on error
    }
};

export const createExerciseEvents = async (req, res) => {

    const { userID, count } = req.body;

    const retrievedPref = await getPreferences(userID)[1];

    const preferences = retrievedPref ? retrievedPref : defaultPreferences;

    console.log(preferences);

    let restDayCount = preferences.restDays
    console.log(restDayCount);

    let eventDate = await getMostRecentExerciseDate(userID);

    let eventDateString = format(eventDate, "yyyy-MM-dd");

    let eventDay = format(eventDate, 'EEEE');

    // start sql loop to create exercise events
    let i = 0;
    let daysScheduled = 0;
    let exerciseGroupIndex = 0;
    let daysOff = 0;

    if (!userID || !count) {
        return res.status(400).json({ success: false, message: "All fields Required" });
    }



    while (i < count) {
        if (preferences[eventDay] && daysScheduled < (preferences.restDays)) {
            try {
                const [newExerciseEvent] = await sql`
                    INSERT INTO exercise_events(userid, date, time, exercise_group )
                    VALUES (${userID}, ${eventDateString}, ${preferences.prefTime}, ${exerciseGroups[exerciseGroupIndex]})
                    RETURNING *`


                exerciseGroupIndex = handleExerciseIndex(exerciseGroupIndex);
                await createWorkoutLogs(newExerciseEvent.id, newExerciseEvent.exercise_group);

                console.log("NEW EXERCISE EVENT ADDED ", exerciseGroupIndex, newExerciseEvent);
                i++;
                daysScheduled++;
                daysOff = 0;





            } catch (error) {
                console.log("Error in createExerciseEvent function", error);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            eventDate = addDays(eventDate, 1)
        } else {
            // take rest day break
            if (daysScheduled >= restDayCount) {
                eventDate = addDays(eventDate, restDayCount - daysOff)
                daysScheduled = 0;
            }
            // move on and add day
            else {
                eventDate = addDays(eventDate, 1)
                daysOff++;
                if (daysOff > restDayCount) daysOff = restDayCount;
                daysScheduled = 0;
            }
        }
        //make sure strings reflect current schedule day
        eventDateString = format(eventDate, "yyyy-MM-dd");
        eventDay = format(eventDate, 'EEEE');

    }
    res.status(201).json({ success: true });

}

export const getUpcomingExerciseEvents = async (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const today = format(new Date(), "yyyy-MM-dd");

    try {
        const events = await sql`
            SELECT id, userid, to_char(date, 'YYYY-MM-DD') AS date, time, exercise_group
            FROM exercise_events
            WHERE userid = ${userID}
              AND date >= ${today}
            ORDER BY date ASC
            LIMIT 4
        `;

        return res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Error fetching upcoming exercise events:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getMonthlyExerciseEvents = async (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Format current month's start and end dates
    const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const endDate = format(endOfMonth(new Date()), "yyyy-MM-dd");

    try {
        const events = await sql`
            SELECT id, userid, to_char(date, 'YYYY-MM-DD') AS date, time, exercise_group
            FROM exercise_events
            WHERE userid = ${userID}
              AND date >= ${startDate}
            ORDER BY date ASC
        `;

        return res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Error fetching monthly exercise events:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};