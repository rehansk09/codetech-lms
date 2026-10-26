const crypto = require("crypto");
const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const CoursePurchase = require("../models/coursePurchaseModel");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const isAuthenticated = require("../middleware/isAuthenticated");
const requireStudent = require("../middleware/requireStudent");

const router = express.Router();

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const completePurchase = async (purchase, payment) => {
  if (purchase.status === "completed") return;

  const purchaser = await User.findById(purchase.userId).select("role");
  if (!purchaser || purchaser.role !== "student") {
    purchase.status = "failed";
    await purchase.save();
    return;
  }

  purchase.paymentId = payment.id;
  purchase.amount = payment.amount / 100;
  purchase.status = "completed";
  await purchase.save();
};

router.post("/payments/razorpay/order", isAuthenticated, requireStudent, async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(503).json({ message: "Razorpay test keys are not configured." });
    }

    const course = await Course.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    const amount = Math.round(Number(course.coursePrice) * 100);
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ message: "Course price must be greater than zero." });
    }

    const ownedCourse = await CoursePurchase.findOne({
      courseId: course._id,
      userId: req.id,
      status: "completed",
    });
    if (ownedCourse) return res.status(409).json({ message: "You already own this course." });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `lms_${Date.now()}`,
      notes: { courseId: course._id.toString(), userId: req.id.toString() },
    });

    await CoursePurchase.create({
      courseId: course._id,
      userId: req.id,
      amount: amount / 100,
      status: "pending",
      gatewayOrderId: order.id,
      provider: "razorpay",
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.courseName,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error.message);
    return res.status(500).json({ message: "Unable to start Razorpay checkout." });
  }
});

router.post("/payments/razorpay/verify", isAuthenticated, requireStudent, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Incomplete Razorpay payment response." });
    }

    const purchase = await CoursePurchase.findOne({
      gatewayOrderId: razorpay_order_id,
      userId: req.id,
    });
    if (!purchase) return res.status(404).json({ message: "Payment order not found." });

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${purchase.gatewayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    const signaturesMatch =
      razorpay_signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(razorpay_signature), Buffer.from(expectedSignature));
    if (!signaturesMatch) {
      return res.status(400).json({ message: "Invalid Razorpay payment signature." });
    }

    const razorpay = getRazorpayClient();
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== purchase.gatewayOrderId || payment.status !== "captured") {
      return res.status(409).json({ message: "Payment has not been captured yet." });
    }

    await completePurchase(purchase, payment);
    return res.status(200).json({ success: true, message: "Payment verified and course enrolled." });
  } catch (error) {
    console.error("Razorpay payment verification failed:", error.message);
    return res.status(500).json({ message: "Unable to verify Razorpay payment." });
  }
});

const razorpayWebhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) return res.status(503).send("Razorpay webhook secret is not configured.");

    const receivedSignature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(req.body).digest("hex");
    if (
      !receivedSignature ||
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))
    ) {
      return res.status(400).send("Invalid Razorpay webhook signature.");
    }

    const event = JSON.parse(req.body.toString("utf8"));
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const purchase = await CoursePurchase.findOne({ gatewayOrderId: payment.order_id });
      if (purchase) await completePurchase(purchase, payment);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error.message);
    return res.status(500).send("Webhook processing failed.");
  }
};

router.post("/payments/status", isAuthenticated, requireStudent, async (req, res) => {
  try {
    const purchase = await CoursePurchase.findOne({
      courseId: req.body.courseId,
      userId: req.id,
      status: "completed",
    });
    return res.status(200).json({ success: true, purchased: Boolean(purchase) });
  } catch (error) {
    console.error("Purchase-status lookup failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to check purchase status." });
  }
});

router.get("/total-revenue/:instructorId", async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.params.instructorId }).select("_id");
    const purchases = await CoursePurchase.aggregate([
      { $match: { courseId: { $in: courses.map((course) => course._id) }, status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    return res.status(200).json({ success: true, totalRevenue: purchases[0]?.totalRevenue || 0 });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/instructor-courses/:instructorId", async (req, res) => {
  try {
    const { instructorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ success: false, message: "Invalid instructor ID" });
    }

    const courses = await Course.find({ creator: instructorId });
    const data = await Promise.all(courses.map(async (course) => {
      const revenue = await CoursePurchase.aggregate([
        { $match: { courseId: course._id, status: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ]);
      return { ...course.toObject(), totalRevenue: revenue[0]?.totalRevenue || 0 };
    }));
    return res.status(200).json({ success: true, courses: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = { router, razorpayWebhookHandler };
