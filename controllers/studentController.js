import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

// ✅ Add Student to a specific Class
const addStudent = async (req, res) => {
  try {
    const { name, rollno, classId } = req.body;

    if (!name || !rollno || !classId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(req.Id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if class exists and belongs to teacher
    const targetClass = await Class.findOne({ _id: classId, teacher: teacher._id });
    if (!targetClass) {
      return res.status(403).json({ message: "Class not found or not authorized" });
    }

    // Ensure roll number is unique inside this class
    const existingStudent = await Student.findOne({ rollno, class: classId });
    if (existingStudent) {
      return res.status(400).json({ message: "Roll number already exists in this class" });
    }

    // Create new student
    const newStudent = new Student({
      name,
      rollno,
      class: classId,
      teacher: teacher._id
    });

    const savedStudent = await newStudent.save();

    // Push student into class
    targetClass.students.push(savedStudent._id);
    await targetClass.save();

    res.status(201).json({ message: "Student added successfully", student: savedStudent });

  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Student
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if teacher is authorized (student must belong to teacher's class)
    const targetClass = await Class.findOne({ _id: student.class, teacher: req.Id });
    if (!targetClass) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }

    // Remove student from class
    targetClass.students.pull(student._id);
    await targetClass.save();

    // Delete student record
    await Student.findByIdAndDelete(studentId);

    res.json({ message: "Student deleted successfully" });

  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit student info
const editStudent = async (req, res) => {
  try {
    const { StudentId } = req.params;
    const { name, rollno, class: studentClass } = req.body;

    const student = await Student.findById(StudentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if logged-in teacher is allowed to edit
    if (!student.teacher.includes(req.Id)) {
      return res.status(403).json({ message: "Not authorized to edit this student" });
    }

    if (name) student.name = name;
    if (rollno) student.rollno = rollno;
    if (studentClass) student.class = studentClass;

    const updatedStudent = await student.save();
    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Get all students for the logged-in teacher


const getStudents = async (req, res) => {
  try {
    const teacherId = req.Id; // from auth middleware
    const { classId } = req.query; // <-- filter param

    let filter = { teacher: teacherId };
    if (classId && classId !== 'all') filter.class = classId; // <-- apply filter

    const students = await Student.find(filter).populate('class', 'name');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



export { addStudent, deleteStudent, editStudent, getStudents };


