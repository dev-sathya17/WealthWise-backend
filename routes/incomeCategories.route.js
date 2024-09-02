const express = require("express");
const incomeCategoriesController = require("../controllers/incomeCategories.controller");

const incomeCategoriesRouter = express.Router();

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Route to add a category
incomeCategoriesRouter.post(
  "/",
  auth.authenticate,
  auth.authorize,
  incomeCategoriesController.addCategory
);

// Route to get all categories
incomeCategoriesRouter.get(
  "/",
  auth.authenticate,
  auth.authorize,
  incomeCategoriesController.getAllCategories
);

// Route to update a category
incomeCategoriesRouter.put(
  "/:id",
  auth.authenticate,
  auth.authorize,
  incomeCategoriesController.updateCategory
);

// Route to delete a category
incomeCategoriesRouter.delete(
  "/:id",
  auth.authenticate,
  auth.authorize,
  incomeCategoriesController.deleteCategory
);

module.exports = incomeCategoriesRouter;
