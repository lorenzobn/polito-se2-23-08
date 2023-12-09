const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pkg = require("body-parser");
const dotenv = require("dotenv");
const logger = require('./services/logger.js');
dotenv.config();
const { json, urlencoded } = pkg;
const crypto = require("crypto");

const {
  addVirtualClockMIddleware,
  addVirtualClockToResMiddleware,
} = require("./controllers/virtualClock.js");

const fileUpload = require("express-fileupload");


const app = express();
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));
const session = require("express-session");

// CORS options to access APIs

const corsOptions = {
  origin: "http://localhost:5174",
  credentials: true,
};

app.use(cors(corsOptions));
const randomSecret = crypto.randomBytes(32).toString("hex");
app.use(fileUpload());

app.use(
  session({
    secret: randomSecret,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
    resave: false,
    saveUninitialized: true,
  }) //2 hours
);

const thesisRouter = require("./routes.js");
app.use(addVirtualClockMIddleware);
app.use(addVirtualClockToResMiddleware);
app.use("/api/v1.0", thesisRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
