const User = require("../models/userModel");

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Administrator access is required." });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireAdmin;
