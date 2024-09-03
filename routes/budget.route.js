const express = require("express");

const budgetRouter = express.Router();

const budgetController = require("../controllers/budget.controller");

const auth = require("../middlewares/auth");

// Defining routes

budgetRouter.get("/", auth.authenticate, budgetController.getAllBudgetItems);

budgetRouter.post("/", auth.authenticate, budgetController.addToBudget);

budgetRouter.put("/:id", auth.authenticate, budgetController.updateBudget);

module.exports = budgetRouter;
