const { userTypes } = require("./users");
const pool = require("../db/connection");

const createNotification = async (
  userId,

  userType,
  title,
  message,
  sendEmail = false
) => {
  let teacherId = null;
  let studentId = null;
  if (userType === userTypes.student) {
    studentId = userId;
  }
  if (userType === userTypes.teacher) {
    teacherId = userId;
  }
  if (title.length > 200) {
    title = title.substring(0, 200) + "...";
  }
  if (message.length > 200) {
    message = message.substring(0, 200) + "...";
  }

  const query = {
    text: `
        INSERT INTO Notification (teacher_id, student_id, user_type, title, message, emailed, seen)
        VALUES ($1, $2, $3, $4, $5, false, false)
        RETURNING *;
      `,
    values: [teacherId, studentId, userType, title, message],
  };

  try {
    const result = await pool.query(query);
    return result.rows[0];
    if (sendEmail) {
      // handle sending email
    }
  } catch (error) {
    throw error;
  }
};

const getNotificationsByUserId = async (req, res) => {
  const userId = req.session.user.id;
  const userType = req.session.user.role;
  const columnName =
    userType === userTypes.teacher ? "teacher_id" : "student_id";
  const query = {
    text: `
        SELECT * FROM Notification
        WHERE ${columnName} = $1 AND seen = false AND created_at < $2;
      `,
    values: [userId, req.session.clock.time],
  };

  try {
    const result = await pool.query(query);
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "error on getting notifications" });
  }
};
const markNotificationAsSeen = async (req, res) => {
  const notificationId = req.params.id;
  const query = {
    text: `
        UPDATE Notification
        SET seen = true
        WHERE id = $1
        RETURNING *;
      `,
    values: [notificationId],
  };

  try {
    const result = await pool.query(query);
    return res.status(200).json({ msg: "done" });
  } catch (error) {
    throw error;
  }
};
module.exports = {
  markNotificationAsSeen,
  getNotificationsByUserId,
  createNotification,
};
