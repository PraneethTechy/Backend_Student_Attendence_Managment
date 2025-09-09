import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

const addStudent = async (req, res) => {
  try {
    const { name, rollno, classId } = req.body;

    if (!name || !rollno || !classId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teacher = await Teacher.findById(req.Id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const targetClass = await Class.findOne({ _id: classId, teacher: teacher._id });
    if (!targetClass) {
      return res.status(403).json({ message: "Class not found or not authorized" });
    }

    const existingStudent = await Student.findOne({ rollno, class: classId });
    if (existingStudent) {
      return res.status(400).json({ message: "Roll number already exists in this class" });
    }

    const newStudent = new Student({
      name,
      rollno,
      class: classId,
      teacher: teacher._id
    });

    const savedStudent = await newStudent.save();

    targetClass.students.push(savedStudent._id);
    await targetClass.save();

    res.status(201).json({ message: "Student added successfully", student: savedStudent });

  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const targetClass = await Class.findOne({ _id: student.class, teacher: req.Id });
    if (!targetClass) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }

    targetClass.students.pull(student._id);
    await targetClass.save();

    await Student.findByIdAndDelete(studentId);

    res.json({ message: "Student deleted successfully" });

  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editStudent = async (req, res) => {
  try {
    const { StudentId } = req.params;
    const { name, rollno, class: studentClass } = req.body;

    const student = await Student.findById(StudentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

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


