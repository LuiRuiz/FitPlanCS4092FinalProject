import { previousDay } from "date-fns";
import { sql } from "../config/db.js";

export const getPreferences = async (userID) => {
    try {
        const preference = await sql`
                SELECT * 
                FROM preferences
                WHERE userid = ${userID}
            `;


        if (preference.length === 0) {
            return 0
        };

        return preference;
    } catch (error) {
        console.error('Error fetching preference', error);
    }
};