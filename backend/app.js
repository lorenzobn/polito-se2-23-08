const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pkg = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const { json, urlencoded } = pkg;

const app = express();
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));


// CORS options to access APIs
/*
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
*/
app.use(cors());


const thesisRouter = require("./routes.js");

app.use('/api/v1.0', thesisRouter);
//registerRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;