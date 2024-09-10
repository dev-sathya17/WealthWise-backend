const Budget = require("../models/budget");
const ExpenseCategory = require("../models/expenseCategory");
const ExpenseConfig = require("../models/expenseConfig");
const sequelize = require("../utils/db.config");

const expenseConfigController = {
  // API to get expense configuration
  getExpenseConfig: async (req, res) => {
    try {
      // Fetch expense configuration from the database
      const expenseConfig = await ExpenseConfig.findAll({
        where: { userId: req.userId },
        attributes: { exclude: ["expenseCategoryId"] },
        include: [
          {
            model: ExpenseCategory,
            attributes: ["expenseCategoryId", "name"],
          },
        ],
      });
      res.json(expenseConfig);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to add expense configuration
  addExpenseConfig: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      // Create new expense configuration object
      const { categories, amount } = req.body;

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Categories array cannot be empty");
      }

      // Save the new expense configuration to the database
      const configs = await Promise.all(
        categories.map((category) => {
          return ExpenseConfig.create(
            {
              userId: req.userId,
              expenseCategoryId: category,
            },
            { transaction }
          );
        })
      );

      configs.forEach(async (config) => {
        const values = config.dataValues;
        const budget = await Budget.create({
          expenseConfigId: values.expenseConfigId,
          amount,
        });
        budget.save();
      });

      await transaction.commit();
      res.status(201).json({
        message: "Expense configuration added successfully",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ message: error.message });
    }
  },

  // API to delete configuration
  deleteExpenseConfig: async (req, res) => {
    try {
      const { id } = req.params;
      // Delete Expense configuration from the database
      const config = await ExpenseConfig.destroy({
        where: { expenseConfigId: id },
      });
      console.log(config);
      res.status(200).json({
        message: "Expense configuration deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to initialize expense Config with budgets
  initialExpenseConfig: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      // Create new expense configuration object
      const { categories, amounts } = req.body;

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Categories array cannot be empty");
      }

      // Save the new expense configuration to the database
      const configs = await Promise.all(
        categories.map((category) => {
          return ExpenseConfig.create(
            {
              userId: req.userId,
              expenseCategoryId: category,
            },
            { transaction }
          );
        })
      );

      configs.forEach(async (config, index) => {
        const values = config.dataValues;
        const budget = await Budget.create({
          expenseConfigId: values.expenseConfigId,
          amount: amounts[index],
        });
        budget.save();
      });

      await transaction.commit();
      res.status(201).json({
        message: "Expense configuration initialized successfully",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = expenseConfigController;
