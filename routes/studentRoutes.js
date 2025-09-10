import express from "express";
import { addStudent, deleteStudent ,editStudent,getStudents} from "../controllers/studentController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/add', verifyToken, addStudent);

router.delete("/:id", verifyToken, deleteStudent);

router.put("/:id", verifyToken, editStudent);   


router.get('/my-students', verifyToken, getStudents); 



export default router;

