const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc Register new user
// @route Post /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add fields");
  }
  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("INvalid user data");
  }
});

// @desc Authenticate auser
// @route Post /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("INvalid credentials");
  }
});

// @desc get user data
// @route Get /api/users
// @access private
const getMe = asyncHandler(async (req, res) => {
  const { name, email } = req.user;
  res.status(200).json(req.user);
});

// @desc Logout user
// @route Get /api/users/logout
// @access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", " ", {
    maxAge: 1,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
  });
});
// Generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
