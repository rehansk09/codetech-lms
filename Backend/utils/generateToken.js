const jwt = require("jsonwebtoken");

const generateToken = (res, user, message) => {
  const isProduction = process.env.NODE_ENV === "production";
  if (!process.env.SECRET_KEY) {
    console.error("SECRET_KEY is not defined in the environment variables.");
    return res.status(500).json({
      success: false,
      message: "Server configuration error: SECRET_KEY is missing.",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "strict",
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message,
      user,
    });
};

module.exports = { generateToken };
