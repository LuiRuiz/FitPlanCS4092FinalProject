import { sql } from "../config/db.js";

export const registerUser = async (req, res) => {
    const { username, email } = req.body

    try {
        const newUser = await sql`
        INSERT INTO fitusers (username, email)
        VALUES (${username}, ${email})
        returning *
        `
        console.log("New User ADDED ", newUser);

        res.status(201).json({ success: true, data: newUser[0] })
    } catch (error) {
        console.log("Error in registerUser function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const loginUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await sql`
        SELECT id, username FROM fitusers
        WHERE username = ${email}
        `;

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user[0] });
    } catch (error) {
        console.error("Error in loginUser function:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};