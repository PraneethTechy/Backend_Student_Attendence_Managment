import { RegisterTeacher, LoginTeacher ,editTeacher,getTeacherDetails} from '../controllers/teacherController.js';
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getTeacherClasses } from '../controllers/classController.js';

const router = Router();

router.post('/register', RegisterTeacher);

router.post('/login', LoginTeacher);

router.get('/classes', verifyToken, getTeacherClasses);

router.put("/edit", verifyToken, editTeacher);

router.get("/me", verifyToken, getTeacherDetails);



export default router;
