const jwt = require("jsonwebtoken");

const getToken = (req) => {
  const cookieToken = req.headers.cookie
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("token="))
    ?.slice("token=".length);
  if (cookieToken) return decodeURIComponent(cookieToken);

  const authorization = req.headers.authorization;
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
};

const isAuthenticated = (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

module.exports = isAuthenticated;
