const express = require("express");
const expenseConfigController = require("../controllers/expenseConfig.controller");

const expenseConfigRouter = express.Router();

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Route to add a category
expenseConfigRouter.post(
  "/",
  auth.authenticate,
  expenseConfigController.addExpenseConfig
);

// Route to get all categories
expenseConfigRouter.get(
  "/",
  auth.authenticate,
  expenseConfigController.getExpenseConfig
);

// Route to initialize expense configs
expenseConfigRouter.post(
  "/initialize",
  auth.authenticate,
  expenseConfigController.initialExpenseConfig
);

// Route to delete a category
expenseConfigRouter.delete(
  "/:id",
  auth.authenticate,
  expenseConfigController.deleteExpenseConfig
);

module.exports = expenseConfigRouter;
