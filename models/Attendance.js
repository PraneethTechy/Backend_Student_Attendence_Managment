import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    class: { // changed from classId to class
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
