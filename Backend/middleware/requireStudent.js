const User = require("../models/userModel");

const requireStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.id).select("role");
    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Only student accounts can purchase and enroll in courses." });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireStudent;
