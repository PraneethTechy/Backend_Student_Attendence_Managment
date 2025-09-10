import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const RegisterTeacher = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const emailExist = await Teacher.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = new Teacher({
            name,
            email,
            password: hashedPassword
        });

        await newTeacher.save();
        res.status(201).json({ message: "Account registered successfully" });
    } catch (error) {
        console.error("Error registering teacher:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const LoginTeacher = async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });
        if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: teacher._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Error logging in teacher:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllStudents = async (req, res) => {
    try {
        // Find all classes created by this teacher
        const classes = await Class.find({ teacher: req.Id }).populate("students");

        if (!classes || classes.length === 0) {
            return res.status(404).json({ message: "No classes or students found" });
        }

        // Flatten all students from all classes
        const students = classes.flatMap(cls => cls.students);

        res.json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Edit teacher info
const editTeacher = async (req, res) => {
  try {
    const teacherId = req.Id; // from verifyToken
    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updateData, { new: true });
    res.json({ message: "Teacher info updated successfully", teacher: updatedTeacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getTeacherDetails = async (req, res) => {
  try {
    const teacherId = req.Id; // assuming you have verifyToken middleware
    const teacher = await Teacher.findById(teacherId).select("-password"); // exclude password

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ teacher });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export { RegisterTeacher, LoginTeacher, getAllStudents ,editTeacher,getTeacherDetails};
