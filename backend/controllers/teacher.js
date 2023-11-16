const pool = require("../db/connection");
const Joi = require("@hapi/joi");

//search teacher based on name, surname
const searchTeacherByName = async (req, res) => {
    try {
        const { name, surname } = req.query;

        //to lower case
        name = name.toLowerCase();
        surname = surname.toLowerCase();
    
        const query = `
        SELECT *
        FROM TEACHER
        WHERE name = $1 AND surname = $2;
        `;
    
        const result = await pool.query(query, [name, surname]);
    
        if (result.rows.length === 0) {
        return res.status(404).json({ msg: "Teacher not found" });
        }
    
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

//search teacher based on email
const searchTeacherByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        //check email format
        if (!email.includes("@")) {
            return res.status(400).json({ msg: "Invalid email format" });
        }

        //to lower case
        email = email.toLowerCase();
    
        const query = `
        SELECT *
        FROM TEACHER
        WHERE email = $1;
        `;
    
        const result = await pool.query(query, [email]);
    
        if (result.rows.length === 0) {
        return res.status(404).json({ msg: "Teacher not found" });
        }
    
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    searchTeacherByName,
    searchTeacherByEmail
}