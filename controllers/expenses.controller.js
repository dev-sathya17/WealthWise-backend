const Expense = require("../models/expense.model");
const ExpenseCategory = require("../models/expenseCategory");
const ExpenseConfig = require("../models/expenseConfig");
const sequelize = require("../utils/db.config");

const expensesController = {
  // API to add an expense
  addExpense: async (req, res) => {
    try {
      const { amount, categoryId, description } = req.body;

      const expenseConfig = await ExpenseConfig.findOne({
        where: {
          userId: req.userId,
          expenseCategoryId: categoryId,
        },
      });

      const expenseConfigId = expenseConfig.dataValues.expenseConfigId;

      const expense = await Expense.create({
        amount,
        expenseConfigId,
        description,
      });
      res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all expenses
  getAllExpense: async (req, res) => {
    try {
      const expenses = await Expense.findAll({
        include: [
          {
            model: ExpenseConfig,
            attributes: ["expenseConfigId", "userId"],
            include: [
              {
                model: ExpenseCategory,
                attributes: ["name", "expenseCategoryId"],
              },
            ],
          },
        ],
        attributes: [
          "description",
          "amount",
          "debitDate",
          "isRecurring",
          "expenseId",
        ],
      });

      const userExpenses = expenses.filter(
        (expense) => expense.ExpenseConfig.userId === req.userId
      );
      res.json({ userExpenses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to update expenses
  updateExpenses: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, description, debitDate, isRecurring } = req.body;
      const expense = await Expense.findByPk(id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      await expense.update({
        amount: amount || expense.amount,
        description: description || expense.description,
        debitDate: debitDate || expense.debitDate,
        isRecurring: isRecurring || expense.isRecurring,
      });
      res.json({ message: "Expense updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete expense
  deleteExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findByPk(id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      await expense.destroy();
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to find total expense per month
  totalExpensePerMonth: async (req, res) => {
    try {
      const totalsPerMonth = await Expense.findAll({
        attributes: [
          [
            sequelize.fn("TO_CHAR", sequelize.col("debitDate"), "YYYY-MM"),
            "month",
          ],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          "$ExpenseConfig.userId$": req.userId,
        },
        include: [
          {
            model: ExpenseConfig,
            attributes: [],
          },
        ],
        group: [sequelize.fn("TO_CHAR", sequelize.col("debitDate"), "YYYY-MM")],
        order: [
          [
            sequelize.fn("TO_CHAR", sequelize.col("debitDate"), "YYYY-MM"),
            "ASC",
          ],
        ],
      });

      res.status(200).json(totalsPerMonth);
    } catch (error) {
      console.error("Error calculating totals per month:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = expensesController;
