const express = require("express");
const Notification = require("../models/notificationModel");
const Course = require("../models/courseModel");
const CoursePurchase = require("../models/coursePurchaseModel");
const Meeting = require("../models/meetingModel");
const User = require("../models/userModel");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ $or: [{ senderId: req.id }, { receiverId: req.id }] })
      .populate("senderId", "name role").populate("receiverId", "name role")
      .populate("courseId", "courseName").populate("meetingId", "meetingTitle meetingTime meetingLink status").sort({ createdAt: -1 });
    res.json(notifications);
  } catch { res.status(500).json({ message: "Unable to fetch notifications" }); }
});

router.post("/meeting-request", isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "Course is required" });
    const student = await User.findById(req.id).select("role name");
    if (!student || student.role !== "student") return res.status(403).json({ message: "Only students can request a meeting" });
    const [course, purchase, pendingRequest, activeMeeting] = await Promise.all([
      Course.findById(courseId).populate("creator", "name"),
      CoursePurchase.findOne({ courseId, userId: req.id, status: "completed" }),
      Notification.findOne({ senderId: req.id, courseId, type: "meeting_request", status: "pending" }),
      Meeting.findOne({ studentId: req.id, courseId, status: "scheduled" }),
    ]);
    if (!course?.creator) return res.status(404).json({ message: "Course or instructor not found" });
    if (!purchase) return res.status(403).json({ message: "Buy this course before requesting a meeting" });
    if (pendingRequest || activeMeeting) return res.status(409).json({ message: "You already have an active meeting request for this course" });
    const notification = await Notification.create({ senderId: req.id, receiverId: course.creator._id, courseId, type: "meeting_request", status: "pending", message: `${student.name} requested a one-to-one meeting for ${course.courseName}.` });
    res.status(201).json({ message: "Meeting request sent to the instructor", notification });
  } catch (error) { console.error("Meeting request error:", error); res.status(500).json({ message: "Unable to send meeting request" }); }
});

router.put("/:id/read", isAuthenticated, async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, receiverId: req.id }, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json(notification);
});

module.exports = router;
