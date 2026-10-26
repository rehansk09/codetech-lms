const mongoose = require("mongoose");

const coursePurchaseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    gatewayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },
  },
  { timestamps: true }
);

coursePurchaseSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status === "completed") {
    try {

      await mongoose.model("User").findByIdAndUpdate(
        this.userId,
        { $addToSet: { enrolledCourses: this.courseId } }
      );

      await mongoose.model("Course").findByIdAndUpdate(
        this.courseId,
        { $addToSet: { enrolledUsers: this.userId } }
      );

      console.log("Pre-save hook: enrolledUsers and enrolledCourses updated");
    } catch (error) {
      console.error("Pre-save hook failed:", error.message);
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("CoursePurchase", coursePurchaseSchema);
