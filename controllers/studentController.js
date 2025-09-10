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
    const teacherId = req.Id; // from auth middleware
    const studentId = req.params.id;

    const student = await Student.findById(studentId).populate("class");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }

    if (student.class) {
      await Class.findByIdAndUpdate(student.class._id, {
        $pull: { students: student._id },
      });
    }

    await Student.findByIdAndDelete(studentId);

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error" });
  }
};




const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollno, class: classId } = req.body;

    // Find student and populate class
    const student = await Student.findById(id).populate("class");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure class exists and belongs to logged-in teacher
    let targetClass = student.class;
    if (classId) {
      targetClass = await Class.findById(classId);
      if (!targetClass) {
        return res.status(404).json({ message: "Class not found" });
      }
    }

    if (targetClass.teacher.toString() !== req.Id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this student" });
    }

    student.name = name || student.name;
    student.rollno = rollno || student.rollno;
    if (classId) student.class = classId;

    await student.save();

    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getStudents = async (req, res) => {
  try {
    const teacherId = req.Id; 
    const { classId } = req.query; 

    let filter = { teacher: teacherId };
    if (classId && classId !== 'all') filter.class = classId; 

    const students = await Student.find(filter).populate('class', 'name');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



export { addStudent, deleteStudent, editStudent, getStudents };


