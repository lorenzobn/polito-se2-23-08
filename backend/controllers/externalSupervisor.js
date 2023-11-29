const pool = require("../db/connection");

//search external co supervisor based on name, surname
const searchExternalByName = async (req, res) => {
  try {
    const { name, surname } = req.query;

    //to lower case
    name = name.toLowerCase();
    surname = surname.toLowerCase();

    const query = `
        SELECT *
        FROM EXTERNAL_CO_SUPERVISOR
        WHERE name = $1 AND surname = $2 AND created_at< $3;
        `;

    const result = await pool.query(query, [
      name,
      surname,
      req.session.clock.time,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "External supervisor not found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const searchExternalByEmail = async (req, res) => {
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
        FROM EXTERNAL_CO_SUPERVISOR
        WHERE email = $1 AND created_at < $2;
        `;

    const result = await pool.query(query, [email, req.session.clock.time]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "External supervisor not found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//insert new external supervisor
const insertExternal = async (req, res) => {
  try {
    const { name, surname, email } = req.body;

    //check email format
    if (!email.includes("@")) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    //to lower case
    name = name.toLowerCase();
    surname = surname.toLowerCase();
    email = email.toLowerCase();

    const query = `
        INSERT INTO EXTERNAL_CO_SUPERVISOR (name, surname, email)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

    const result = await pool.query(query, [name, surname, email]);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//get all external supervisors
const getAllExternal = async (req, res) => {
  try {
    const query = `
        SELECT *
        FROM EXTERNAL_CO_SUPERVISOR WHERE created_at < $1;
        `;

    const result = await pool.query(query, [req.session.clock.time]);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  searchExternalByName,
  searchExternalByEmail,
  insertExternal,
  getAllExternal,
};
