const express = require("express");
const crypto = require("crypto");
const Meeting = require("../models/meetingModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

const createZegoKitToken = ({ appID, serverSecret, roomID, userID, userName }) => {
  const createdAt = Math.floor(Date.now() / 1000);
  const expiresAt = createdAt + 60 * 60 * 2;
  const iv = crypto.randomBytes(12).toString("hex").slice(0, 16);
  const payload = JSON.stringify({ app_id: appID, user_id: userID, nonce: crypto.randomInt(1, 2147483647), ctime: createdAt, expire: expiresAt });
  const key = Buffer.from(serverSecret, "utf8");
  const cipher = crypto.createCipheriv(`aes-${key.length * 8}-cbc`, key, Buffer.from(iv, "utf8"));
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tokenData = Buffer.alloc(28 + encrypted.length);
  tokenData.writeUInt32BE(expiresAt, 4);
  tokenData.writeUInt16BE(Buffer.byteLength(iv), 8);
  tokenData.write(iv, 10, "utf8");
  tokenData.writeUInt16BE(encrypted.length, 26);
  encrypted.copy(tokenData, 28);
  const tokenPayload = Buffer.from(JSON.stringify({ userID, roomID, userName: encodeURIComponent(userName), appID })).toString("base64");
  return `04${tokenData.toString("base64")}#${tokenPayload}`;
};

router.post("/from-request", isAuthenticated, async (req, res) => {
  try {
    const { requestId, meetingTitle, meetingTime } = req.body;
    if (!requestId || !meetingTitle?.trim() || !meetingTime) return res.status(400).json({ message: "Request, title, and time are required" });
    const parsedTime = new Date(meetingTime);
    if (Number.isNaN(parsedTime.getTime()) || parsedTime <= new Date()) return res.status(400).json({ message: "Choose a future meeting time" });
    const instructor = await User.findById(req.id).select("role");
    if (!instructor || instructor.role !== "instructor") return res.status(403).json({ message: "Only instructors can schedule meetings" });
    const request = await Notification.findOne({ _id: requestId, receiverId: req.id, type: "meeting_request", status: "pending" });
    if (!request) return res.status(404).json({ message: "Pending meeting request not found" });

    const meeting = await Meeting.create({
      instructorId: req.id, studentId: request.senderId, courseId: request.courseId, requestId: request._id,
      meetingTitle: meetingTitle.trim(), meetingTime: parsedTime, roomID: crypto.randomBytes(16).toString("hex"), meetingLink: "pending",
    });
    meeting.meetingLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/meeting/${meeting._id}`;
    await meeting.save();
    request.meetingId = meeting._id;
    request.status = "scheduled";
    request.isRead = true;
    await request.save();
    await Notification.create({
      senderId: req.id, receiverId: request.senderId, courseId: request.courseId, meetingId: meeting._id,
      type: "meeting_scheduled", status: "scheduled",
      message: `Your meeting “${meeting.meetingTitle}” has been scheduled for ${parsedTime.toLocaleString()}.`,
    });
    res.status(201).json({ message: "Meeting scheduled and link sent to the student", meeting });
  } catch (error) { console.error("Create meeting error:", error); res.status(500).json({ message: "Unable to schedule meeting" }); }
});

router.get("/instructor", isAuthenticated, async (req, res) => {
  try {
    const instructor = await User.findById(req.id).select("role");
    if (!instructor || instructor.role !== "instructor") return res.status(403).json({ message: "Only instructors can view these meetings" });
    const meetings = await Meeting.find({ instructorId: req.id }).populate("studentId", "name email").populate("courseId", "courseName").sort({ meetingTime: 1 });
    res.json(meetings);
  } catch { res.status(500).json({ message: "Unable to fetch meetings" }); }
});

router.put("/:id/complete", isAuthenticated, async (req, res) => {
  const meeting = await Meeting.findOneAndUpdate({ _id: req.params.id, instructorId: req.id }, { status: "completed" }, { new: true });
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });
  await Notification.updateMany(
    { $or: [{ meetingId: meeting._id }, { _id: meeting.requestId }] },
    { status: "completed", isRead: true },
  );
  res.json({ message: "Meeting marked completed", meeting });
});

router.get("/:id/join", isAuthenticated, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting || meeting.status !== "scheduled") return res.status(404).json({ message: "Scheduled meeting not found" });
    if (![meeting.studentId.toString(), meeting.instructorId.toString()].includes(req.id)) return res.status(403).json({ message: "You are not invited to this meeting" });
    const now = Date.now();
    const start = new Date(meeting.meetingTime).getTime();
    if (now < start - 30 * 60 * 1000 || now > start + 3 * 60 * 60 * 1000) return res.status(403).json({ message: "This meeting can be joined from 30 minutes before its scheduled time until 3 hours after" });
    const user = await User.findById(req.id).select("name");
    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;
    if (!appID || !serverSecret) return res.status(503).json({ message: "Video calling is not configured. Ask the administrator to add Zego credentials." });
    const kitToken = createZegoKitToken({ appID, serverSecret, roomID: meeting.roomID, userID: req.id.toString(), userName: user.name });
    res.json({ appID, kitToken, meeting: { title: meeting.meetingTitle, meetingTime: meeting.meetingTime } });
  } catch (error) { console.error("Join meeting error:", error); res.status(500).json({ message: "Unable to join meeting" }); }
});

module.exports = router;
