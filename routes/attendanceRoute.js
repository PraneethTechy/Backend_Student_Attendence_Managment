import { Router } from "express";
import { markAttendance, getStudentAttendance, getTeacherAttendance,getAttendanceSummary } from "../controllers/attendanceController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

// ✅ Teacher marks attendance for a student (requires classId & studentId)
router.post("/mark", verifyToken, markAttendance);

// ✅ Get all attendance of a student (optionally filter by classId)
router.get("/student/:studentId", verifyToken, getStudentAttendance);

// ✅ Get all attendance records for the logged-in teacher (across their classes)
router.get("/teacher", verifyToken, getTeacherAttendance);

router.get("/summary", verifyToken, getAttendanceSummary);

export default router;
