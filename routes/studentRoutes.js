import express from "express";
import { addStudent, deleteStudent ,editStudent,getStudents} from "../controllers/studentController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Add a new student (and assign to class)
router.post('/add', verifyToken, addStudent);

// Delete student (and remove from class)
router.delete('/delete/:studentId', verifyToken, deleteStudent);

// Edit student
router.put("/edit/:StudentId", verifyToken, editStudent);

router.get('/my-students', verifyToken, getStudents); // ✅ new route



export default router;
