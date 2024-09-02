const express = require("express");
const expenseCategoriesController = require("../controllers/expenseCategories.controller copy");

const expenseCategoriesRouter = express.Router();

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Route to add a category
expenseCategoriesRouter.post(
  "/",
  auth.authenticate,
  auth.authorize,
  expenseCategoriesController.addCategory
);

// Route to get all categories
expenseCategoriesRouter.get(
  "/",
  auth.authenticate,
  auth.authorize,
  expenseCategoriesController.getAllCategories
);

// Route to update a category
expenseCategoriesRouter.put(
  "/:id",
  auth.authenticate,
  auth.authorize,
  expenseCategoriesController.updateCategory
);

// Route to delete a category
expenseCategoriesRouter.delete(
  "/:id",
  auth.authenticate,
  auth.authorize,
  expenseCategoriesController.deleteCategory
);

module.exports = expenseCategoriesRouter;
