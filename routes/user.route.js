// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/user.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Importing the multer middleware
const files = require("../middlewares/multer");

// Creating a router
const userRouter = express.Router();

// Route to register a user
userRouter.post("/register", userController.register);

// Route to login a user
userRouter.post("/login", userController.login);

// Route to logout a user
userRouter.get("/logout", auth.authenticate, userController.logout);

// Route for forgot password
userRouter.post("/forgot-password", userController.forgotPassword);

// Route to verify OTP
userRouter.post("/verify", userController.verifyOtp);

// Route to reset password
userRouter.put("/reset", userController.resetPassword);

// Route for getting user profile
userRouter.get("/profile", auth.authenticate, userController.getProfile);

// Route for updating user profile
userRouter.put(
  "/update/:id",
  auth.authenticate,
  files.single("image"),
  userController.updateProfile
);

// Route for deleting user
userRouter.delete(
  "/delete/:id",
  auth.authenticate,
  userController.deleteProfile
);

userRouter.get(
  "/total",
  auth.authenticate,
  userController.totalUserIncomeExpense
);

// Exporting the router
module.exports = userRouter;
