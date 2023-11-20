const pool = require("../db/connection");


const fetchSelf = async (req, res) => {
  try {
    const id = req.userId;

    const student = await pool.query("SELECT * FROM student WHERE id = $1", [
      id,
    ]);

    const teacher = await pool.query("SELECT * FROM teacher WHERE id = $1", [
      id,
    ]);

    if (student.rows.length === 0 && teacher.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    if (student.rows[0]) {
      userObj = student.rows[0];
      realPwd = student.rows[0].id;
      type = "student";
    } else {
      userObj = teacher.rows[0];
      realPwd = teacher.rows[0].id;
      type = "professor";
    }

    res.status(200).json({ data: userObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "fetching user data failed" });
  }
};

module.exports = { fetchSelf };
