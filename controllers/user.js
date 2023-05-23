const User = require("../models/user");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.userRegister = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // find the user if already exists then don't register
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ msg: "User alreadye exists" });
    } else {
      // we need to hash the password before registering the user into the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      console.log("User register===>", newUser);

      res.status(200).json(newUser);
    }
  } catch (error) {
    console.log({ userRegisterError: error });
    throw new Error("Something went wrong");
  }
});

exports.userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // find the user in the database
    const userLoggedIn = await User.findOne({ email: email });
    if (userLoggedIn) {
      const checkPassword = await bcrypt.compare(
        password,
        userLoggedIn.password
      );
      if (checkPassword) {
        console.log("User logged in", userLoggedIn._id);
        return res.status(200).json({
          name: userLoggedIn.name,
          email: userLoggedIn.email,
          token: generateToken(userLoggedIn._id),
        });
      }
    }
    res.status(400).json({
      message: "Wrong user credentials",
    });
  } catch (error) {
    console.log("User Login error", error);
    throw new Error("Something went wrong");
  }
});

// we have to generate the tokens for users
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

exports.getUser = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({}).sort({ createdAt: -1 });
    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(allUsers);
  } catch (error) {
    console.log("Get user error", error);
    throw new Error("Something went wrong");
  }
});

// exports.updatePassword = asyncHandler(async (req, res) => {
//   try {
//     const userExists = await User.findOne({ email: email });
//     // will implement later using nodemailer
//   } catch (error) {
//     console.log("Get user error", error);
//     throw new Error("Something went wrong");
//   }
// });
