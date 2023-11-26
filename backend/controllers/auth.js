const pool = require("../db/connection");
const jwt = require("jsonwebtoken");
const samlify = require("samlify");
const path = require("path");
const fs = require("fs");
const samlifyValidator = require("@authenio/samlify-xsd-schema-validator");
const crypto = require("crypto");

samlify.setSchemaValidator(samlifyValidator);

const randomSecret = crypto.randomBytes(32).toString("hex");
const userRoles = {
  teacher: "teacher",
  student: "student",
  any: "any",
};
let appLoginSessions = [];

const idpMetaDataPath = path.join(__dirname, "../idp-meta.xml");
const idpMetadata = fs.readFileSync(idpMetaDataPath, "utf8");
const idpCertPath = path.join(__dirname, "../idp-cert.pem");
const idpCert = fs.readFileSync(idpCertPath, "utf8");

const spOptions = {
  entityID: "urn:dev-4ovpyp08m022lhpz.us.auth0.com",
  assertEndpoint: "http://localhost:3000/api/v1.0/sso/acs",
  loginEndpoint: "http://localhost:3000/api/v1.0/login",
  forceAuthn: false,
  authnContext:
    "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
};
const idpOptions = {
  metadata: idpMetadata,
  certificate: idpCert,
};

const { ServiceProvider, IdentityProvider } = samlify;
const sp = ServiceProvider(spOptions);
const idp = IdentityProvider(idpOptions);

const login = async (req, res) => {
  console.log(req.session);
  res.json({
    redirectUrl:
      "https://dev-4ovpyp08m022lhpz.us.auth0.com/samlp/bvdcn8wtkXNhbfwppeRvxxSyOocJ3mY8?connection=polito",
  });
};
const assertion = async (req, res) => {
  try {
    const { extract } = await sp.parseLoginResponse(idp, "post", req);
    // TODO add other attributes, after adding them in
    if (extract) {
      userObj = {
        email:
          extract.attributes[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
      };
    }
    const token = jwt.sign(userObj, randomSecret, {
      expiresIn: "2m",
    });
    appLoginSessions.push(token);
    res.redirect(`http://localhost:5173/sso-callback?token=${token}`);
  } catch (error) {
    console.log("Error parsing SAML response:", error);
    res.status(500).send("Internal Server Error");
  }
};

const tokenVerification = async (req, res) => {
  try {
    const { token } = req.body;
    const data = await jwt.decode(token, randomSecret);
    const { email } = data;

    let userObj = {};
    const student = await pool.query("SELECT * FROM student WHERE email = $1", [
      email,
    ]);

    const teacher = await pool.query("SELECT * FROM teacher WHERE email = $1", [
      email,
    ]);

    if (student.rows.length === 0 && teacher.rows.length === 0) {
      return res.status(401).json({ msg: "Invalid email" });
    }

    if (student.rows[0]) {
      userObj = student.rows[0];
      realPwd = student.rows[0].id;
      type = userRoles.student;
    } else {
      userObj = teacher.rows[0];
      realPwd = teacher.rows[0].id;
      type = userRoles.teacher;
    }
    userObj.role = type;
    req.session.user = userObj;
    return res.status(200).json({ data: userObj });
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized");
  }
};

const logout = async (req, res) => {
  try {
    await req.session.destroy();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized");
  }
};

const authorize = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.session.user) {
        return res.status(401).json("Unauthorized");
      }
      if (role !== userRoles.any && req.session.user.role !== role) {
        return res.status(401).json("Unauthorized");
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send("Unauthorized");
    }
  };
};
module.exports = {
  login,
  assertion,
  tokenVerification,
  logout,
  authorize,
  userRoles,
};
