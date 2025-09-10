// routes/classRoute.js
import express from "express";
import { createClass, getTeacherClasses, addStudentToClass ,deleteClass} from "../controllers/classController.js";
import verifyToken from "../middlewares/verifyToken.js";  
const router = express.Router();

router.post("/create", verifyToken, createClass);

router.get("/my-classes", verifyToken, getTeacherClasses);

router.post("/add-student", verifyToken, addStudentToClass);

router.delete("/delete/:classId", verifyToken, deleteClass);


export default router;
