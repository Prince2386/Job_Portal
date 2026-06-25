import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js"; // 1. Imported the job routes
import connectDB from "./config/db.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes Middleware
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);  // 2. Hooked up the jobs endpoint
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Job Portal API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});