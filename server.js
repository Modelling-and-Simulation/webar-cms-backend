import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import verifyJWT from "./middleware/verifyJWT.js";
import errorHandler from "./middleware/errorHandler.js";
import credentials from "./middleware/credentials.js";

import connectDB from "./config/dbConnection.js";

// import routes
import targetRoute from "./routes/targetRoutes.js";
import contentRoute from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sceneRoute from "./routes/sceneRoutes.js";

const corsOptions = import("./config/corsOptions.js");

const PORT = process.env.PORT || 5000;

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// accept form-data
app.use(express.text());
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware for log all requests
import { logger } from "./middleware/logEvents.js";
app.use(logger);

/****************** Routes ******************/
// Public Files
app.use("/public", express.static("public"));

// Auth Routes
app.use("/api/auth", authRoutes);

// Auth Middleware
app.use(verifyJWT);
// Target Routes
app.use("/api/targets", targetRoute);

// Content Routes
app.use("/api/contents", contentRoute);

// Scene Routes
app.use("/api/scenes", sceneRoute);

app.get("/", (req, res) => {
  res.send("Hello WebAR-CMS API!");
});

// 404 Error
app.use((req, res) => {
  res.status(404).send("404 Error: Page not found");
});
/*********************************************/

// Custom middleware for error handling
app.use(errorHandler);

// Connect to MongoDB
connectDB();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
