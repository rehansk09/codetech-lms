const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", default: null },
    type: { type: String, enum: ["meeting_request", "meeting_scheduled"], default: "meeting_request" },
    status: { type: String, enum: ["pending", "scheduled", "completed", "cancelled"], default: "pending" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model("Notification", notificationSchema);
