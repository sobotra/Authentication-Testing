const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
