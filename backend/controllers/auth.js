const pool = require("../db/connection");
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let realPwd = '';
    let userObj = {};
    let type = '';
    const student = await pool.query(
      "SELECT * FROM student WHERE email = $1",
      [email]
    );

    const teacher = await pool.query(
      "SELECT * FROM teacher WHERE email = $1",
      [email]
    );

    if (student.rows.length === 0 && teacher.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    if (student.rows[0]){
      userObj = student.rows[0];
      realPwd = student.rows[0].id;
      type = "student";
    } else {
      userObj = teacher.rows[0];
      realPwd = teacher.rows[0].id;
      type = "professor";
    }

    // INSECURE PWD CHECK, JUST FOR THE PROTOTYPE
    //const passwordMatch = await bcrypt.compare(password, realPwd);
    if (password !== realPwd) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign(userObj, 'your-secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ id: userObj.id, type: type, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Login failed' });
  }
}

/*
const userSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};
*/

module.exports = {
  userLogin
};