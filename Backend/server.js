require("dotenv").config();

const express = require("express");
const cors = require("cors");
const instructorRoute = require("./routes/instructorRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const userRoutes = require("./routes/userRoutes");
const { router: purchaseRoutes, razorpayWebhookHandler } = require("./routes/coursePurchase");
const questionRoute = require("./routes/questionRoute");
const certificateRoutes = require("./routes/certificateRoutes");
const notificationRoutes = require("./routes/notificationRoute");
const meetingRoutes=require("./routes/meetingRoutes")
const aiAssistantRoutes = require("./routes/aiAssistantRoutes");
const playgroundRoutes = require("./routes/playground");
const { dbConnect } = require("./utils/db");

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);


app.post("/api/payments/razorpay/webhook", express.raw({ type: "application/json" }), razorpayWebhookHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

// Connect Database
dbConnect();

// Routes
app.use("/course", instructorRoute);
app.use("/lecture", lectureRoutes);
app.use("/user", userRoutes);
app.use("/api", purchaseRoutes);
app.use("/api/questions", questionRoute);
app.use("/api/meetings",meetingRoutes)
app.use("/api/certificates", certificateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assistant", aiAssistantRoutes);
app.use("/api/playground", playgroundRoutes);




// Start Server
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
