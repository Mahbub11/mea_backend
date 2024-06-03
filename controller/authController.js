const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../model/index");
const User = db.user;

exports.signIn = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ error: "No user with this Email" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    if (!user.is_active) {
      return next(new ErrorHandler("Account not Activated", 401));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    await user.update({ accessToken: token });
    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});
exports.getUser = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.userInfo.id } });

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
