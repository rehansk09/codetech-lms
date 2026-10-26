const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Notification", required: true, unique: true },
    meetingTitle: { type: String, required: true, trim: true },
    meetingTime: { type: Date, required: true },
    roomID: { type: String, required: true, unique: true },
    meetingLink: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
