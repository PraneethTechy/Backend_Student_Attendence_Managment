// controllers/classController.js
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

// Create a new class (only by logged-in teacher)
const createClass = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const teacherId = req.Id; // ✅ from verifyToken middleware

    // check if teacher already has a class with same name
    const existing = await Class.findOne({ name, teacher: teacherId });
    if (existing) {
      return res.status(400).json({ message: "You already have a class with this name" });
    }

    const newClass = new Class({
      name,
      teacher: teacherId,
      students: []
    });

    const savedClass = await newClass.save();

    // also push this class into teacher.classes
    await Teacher.findByIdAndUpdate(teacherId, {
      $push: { classes: savedClass._id }
    });

    res.status(201).json(savedClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all classes of a teacher
const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.Id;

    const classes = await Class.find({ teacher: teacherId })
      .populate("students", "name rollno")
      .populate("teacher", "name email");

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add student to a class
const addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;
    const teacherId = req.Id;

    // ensure class belongs to teacher
    const classDoc = await Class.findOne({ _id: classId, teacher: teacherId });
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found or not owned by you" });
    }

    // ensure student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // prevent duplicate add
    if (classDoc.students.includes(studentId)) {
      return res.status(400).json({ message: "Student already in class" });
    }

    classDoc.students.push(studentId);
    await classDoc.save();

    res.json({ message: "Student added to class successfully", class: classDoc });
  } catch (error) {
    console.error("Error adding student to class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.Id; // from verifyToken

    const classDoc = await Class.findOne({ _id: classId, teacher: teacherId });
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found or not owned by you" });
    }

    await Class.findByIdAndDelete(classId);

    // Also remove this class from teacher.classes array
    await Teacher.findByIdAndUpdate(teacherId, {
      $pull: { classes: classId }
    });

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createClass, getTeacherClasses, addStudentToClass, deleteClass };

