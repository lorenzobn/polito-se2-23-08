const pool = require("../db/connection");

const userTypes = {
  student: "student",
  teacher: "teacher",
};
const fetchSelf = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const id = req.session?.user?.id;

    const student = await pool.query(
      "SELECT * FROM student WHERE id = $1 AND created_at < $2",
      [id, req.session.clock.time]
    );

    const teacher = await pool.query(
      "SELECT * FROM teacher WHERE id = $1 AND created_at < $2",
      [id, req.session.clock.time]
    );

    if (student.rowCount === 0 && teacher.rowCount === 0) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    let userObj;
    let realPwd;

    if (student.rowCount > 0) {
      userObj = student.rows[0];
      realPwd = student.rows[0].id;
      userObj.type = "student";
    } else {
      userObj = teacher.rows[0];
      realPwd = teacher.rows[0].id;
      userObj.type = "professor";
    }
    res.status(200).json({ data: userObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

module.exports = { fetchSelf, userTypes };
