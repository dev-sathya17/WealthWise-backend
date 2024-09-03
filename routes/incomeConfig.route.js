const express = require("express");
const incomeConfigController = require("../controllers/incomeConfig.controller");

const incomeConfigRouter = express.Router();

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Route to add a category
incomeConfigRouter.post(
  "/",
  auth.authenticate,
  incomeConfigController.addIncomeConfig
);

// Route to get all categories
incomeConfigRouter.get(
  "/",
  auth.authenticate,
  incomeConfigController.getIncomeConfig
);

// Route to delete a category
incomeConfigRouter.delete(
  "/:id",
  auth.authenticate,
  incomeConfigController.deleteIncomeConfig
);

module.exports = incomeConfigRouter;
