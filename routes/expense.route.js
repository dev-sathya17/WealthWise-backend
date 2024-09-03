const express = require("express");
const expensesController = require("../controllers/expenses.controller");

const expenseRouter = express.Router();

const auth = require("../middlewares/auth");

expenseRouter.post("/", auth.authenticate, expensesController.addExpense);

expenseRouter.get("/", auth.authenticate, expensesController.getAllExpense);

expenseRouter.get(
  "/count",
  auth.authenticate,
  expensesController.totalExpensePerMonth
);

expenseRouter.put("/:id", auth.authenticate, expensesController.updateExpenses);

expenseRouter.delete(
  "/:id",
  auth.authenticate,
  expensesController.deleteExpense
);

module.exports = expenseRouter;
