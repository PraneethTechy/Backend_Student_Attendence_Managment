import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import teacherRoutes from "./routes/teacherRoute.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import classRoutes from "./routes/classRoute.js";


dotenv.config();

const app = express(); 


app.use(cors());        
app.use(express.json());

app.use("/teacher", teacherRoutes);
app.use("/class", classRoutes);        
app.use("/student", studentRoutes);
app.use("/attendance", attendanceRoutes); 


app.get("/", (req, res) => {
  res.send("Student Attendence Management");
});


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(` Server running on http://localhost:${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to connect to DB", err);
    process.exit(1);
  });
