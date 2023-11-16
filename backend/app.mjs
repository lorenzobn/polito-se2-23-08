import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pkg from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const { json, urlencoded } = pkg;

const app = express();
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));


// CORS options to access APIs
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));


import thesisRouter from "./routes.js";

app.use('/api/v1.0', thesisRouter);
//registerRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default { app, PORT };