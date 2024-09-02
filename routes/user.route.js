// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/user.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

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
userRouter.put("/update/:id", auth.authenticate, userController.updateProfile);

// Route for deleting user
userRouter.delete(
  "/delete/:id",
  auth.authenticate,
  userController.deleteProfile
);

// Exporting the router
module.exports = userRouter;
