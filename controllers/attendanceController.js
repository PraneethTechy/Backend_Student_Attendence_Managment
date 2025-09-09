import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";


const markAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body; 
    const teacherId = req.Id;

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Teacher ID not found" });
    }

    // Check if student exists
    const student = await Student.findById(studentId).populate("class");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    
    const targetClass = await Class.findOne({
      _id: student.class,
      teacher: teacherId,
    });
    if (!targetClass) {
      return res
        .status(403)
        .json({
          message: "Not authorized to mark attendance for this student",
        });
    }

    
    const attendanceDate = date ? new Date(date) : new Date();

    
    const newAttendance = new Attendance({
      student: studentId,
      teacher: teacherId,
      class: targetClass._id,
      status,
      date: attendanceDate,
    });

    const saved = await newAttendance.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({ student: studentId })
      .populate("teacher", "name email")
      .populate("class", "name");

    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};






const getTeacherAttendance = async (req, res) => {
  try {
    const teacherId = req.Id;
    if (!teacherId) return res.status(401).json({ message: "Unauthorized" });

    const records = await Attendance.find({ teacher: teacherId })
      .populate("student", "name rollno")
      .populate("class", "name");

    // Filter invalid records
    const validRecords = records.filter(r => r.student && r.class);

    res.json(validRecords);
  } catch (error) {
    console.error("Error fetching teacher attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const teacherId = req.Id;
    const { classId, date } = req.query;

    let matchCondition = { teacher: teacherId };

    if (classId) {
      matchCondition.class = classId;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      matchCondition.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(matchCondition);

    if (!records.length) {
      return res.json({
        present: 0,
        absent: 0,
        total: 0,
        date: date || "All Dates",
        message: "No attendance data found for the selected filter.",
      });
    }

    const presentCount = records.filter((r) => r.status === "Present").length;
    const absentCount = records.filter((r) => r.status === "Absent").length;

    res.json({
      present: presentCount,
      absent: absentCount,
      total: records.length,
      date: date || "All Dates",
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export {
  markAttendance,
  getStudentAttendance,
  getTeacherAttendance,
  getAttendanceSummary
};
