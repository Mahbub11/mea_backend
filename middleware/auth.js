const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const db = require("../model/index");
const User = db.user;

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userData = await User.findOne({ where: { id: decoded.id } });
  if (userData) {
    req.userInfo = userData;

    next();
  } else {
    return next(
      new ErrorHandler("Account Logged in another device, Logging out", 401)
    );
  }
});
