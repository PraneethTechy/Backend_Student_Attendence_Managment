import { RegisterTeacher, LoginTeacher ,editTeacher,getTeacherDetails} from '../controllers/teacherController.js';
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getTeacherClasses } from '../controllers/classController.js';

const router = Router();

// Register new teacher
router.post('/register', RegisterTeacher);

// Teacher login
router.post('/login', LoginTeacher);

// Get all classes (with students) for logged-in teacher
router.get('/classes', verifyToken, getTeacherClasses);

// Edit teacher
router.put("/edit", verifyToken, editTeacher);

router.get("/me", verifyToken, getTeacherDetails);



export default router;
