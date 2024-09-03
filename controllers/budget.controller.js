const Budget = require("../models/budget");
const ExpenseCategory = require("../models/expenseCategory");
const ExpenseConfig = require("../models/expenseConfig");

const budgetController = {
  // API to add to budget
  addToBudget: async (req, res) => {
    try {
      const { amount, expenseConfigId } = req.body;
      const budget = await Budget.create({ amount, expenseConfigId });
      res
        .status(201)
        .json({ message: "Budget item added successfully", budget });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to update budget item
  updateBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const budget = await Budget.findByPk(id);
      if (!budget) {
        return res.status(404).json({ message: "Budget item not found" });
      }
      await budget.update({ amount });
      res.json({ message: "Budget item updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all budget items
  getAllBudgetItems: async (req, res) => {
    try {
      const budgetItems = await Budget.findAll({
        include: [
          {
            model: ExpenseConfig,
            include: [
              {
                model: ExpenseCategory,
                attributes: ["name"],
              },
            ],
          },
        ],
        attributes: ["budgetId", "amount"],
      });
      res.json({ budgetItems });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = budgetController;
