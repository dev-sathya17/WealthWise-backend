const express = require("express");
const incomesController = require("../controllers/incomes.controller");

const incomeRouter = express.Router();

const auth = require("../middlewares/auth");

incomeRouter.post("/", auth.authenticate, incomesController.addIncome);

incomeRouter.get("/", auth.authenticate, incomesController.getAllIncomes);

incomeRouter.get(
  "/count",
  auth.authenticate,
  incomesController.totalIncomePerMonth
);

incomeRouter.put("/:id", auth.authenticate, incomesController.updateIncomes);

incomeRouter.delete("/:id", auth.authenticate, incomesController.deleteIncome);

module.exports = incomeRouter;
