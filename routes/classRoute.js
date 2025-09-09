// routes/classRoute.js
import express from "express";
import { createClass, getTeacherClasses, addStudentToClass ,deleteClass} from "../controllers/classController.js";
import verifyToken from "../middlewares/verifyToken.js";  // ✅ fixed path & name

const router = express.Router();

// Create a class
router.post("/create", verifyToken, createClass);

// Get all classes of logged-in teacher
router.get("/my-classes", verifyToken, getTeacherClasses);

// Add student to a class
router.post("/add-student", verifyToken, addStudentToClass);

// Delete a class
router.delete("/delete/:classId", verifyToken, deleteClass);


export default router;
