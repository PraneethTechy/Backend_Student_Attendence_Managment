import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Routes
import teacherRoutes from "./routes/teacherRoute.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import classRoutes from "./routes/classRoute.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json()); // parse JSON requests

// ✅ Configure CORS
app.use(
  cors({
    origin: "*", // ⚠️ For production, replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Routes
app.use("/teacher", teacherRoutes);
app.use("/class", classRoutes);
app.use("/student", studentRoutes);
app.use("/attendance", attendanceRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Student Attendance Management API is running 🚀");
});

// ✅ Connect DB & Start Server
const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  });
