const ExpenseCategory = require("../models/expenseCategory");

const expenseCategoriesController = {
  // API to add a category
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await ExpenseCategory.create({ name });
      res
        .status(201)
        .json({ message: "Expense category added successfully", category });
    } catch (error) {
      // Return error message
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await ExpenseCategory.findAll();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to update a category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await ExpenseCategory.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Expense category not found" });
      }
      await category.update({ name });
      res.json({ message: "Expense category updated successfully", category });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete a category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await ExpenseCategory.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Expense category not found" });
      }
      await category.destroy();
      res.json({ message: "Expense category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = expenseCategoriesController;
