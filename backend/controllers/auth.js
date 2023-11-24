const pool = require("../db/connection");
const jwt = require("jsonwebtoken");
const samlify = require("samlify");
const path = require("path");
const fs = require("fs");
const samlifyValidator = require("@authenio/samlify-xsd-schema-validator");
const crypto = require("crypto");

samlify.setSchemaValidator(samlifyValidator);

const randomSecret = crypto.randomBytes(32).toString("hex");

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
    
    req.session.user = { email: data.email, type: "student" };

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(401).send("unauthorized");
  }
};

const logout = async (req, res) => {
  try {
    await req.session.destroy();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(401).send("unauthorized");
  }
};

const authorize = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.status(401).json("unauthorized");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("unauthorized");
  }
};
module.exports = {
  login,
  assertion,
  tokenVerification,
  logout,
  authorize,
};
