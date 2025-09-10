import { Router } from "express";
import { markAttendance, getStudentAttendance, getTeacherAttendance,getAttendanceSummary } from "../controllers/attendanceController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/mark", verifyToken, markAttendance);

router.get("/student/:studentId", verifyToken, getStudentAttendance);

router.get("/teacher", verifyToken, getTeacherAttendance);

router.get("/summary", verifyToken, getAttendanceSummary);

export default router;
