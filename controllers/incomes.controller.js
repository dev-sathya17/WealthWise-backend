const Income = require("../models/income.model");
const IncomeCategory = require("../models/incomeCategory");
const IncomeConfig = require("../models/incomeConfig");
const sequelize = require("../utils/db.config");

const incomesController = {
  // API to add an income
  addIncome: async (req, res) => {
    try {
      const { amount, categoryId, description } = req.body;

      const incomeConfig = await IncomeConfig.findOne({
        where: {
          userId: req.userId,
          incomeCategoryId: categoryId,
        },
      });

      const incomeConfigId = incomeConfig.dataValues.incomeConfigId;

      const income = await Income.create({
        amount,
        incomeConfigId,
        description,
      });
      res.status(201).json({ message: "Income added successfully", income });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all incomes
  getAllIncomes: async (req, res) => {
    try {
      const incomes = await Income.findAll({
        include: [
          {
            model: IncomeConfig,
            attributes: ["incomeConfigId", "userId"],
            include: [
              {
                model: IncomeCategory,
                attributes: ["name", "incomeCategoryId"],
              },
            ],
          },
        ],
        attributes: [
          "description",
          "amount",
          "creditDate",
          "isRecurring",
          "incomeId",
        ],
      });

      const userIncomes = incomes.filter(
        (income) => income.IncomeConfig.userId === req.userId
      );
      res.json({ userIncomes });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to update incomes
  updateIncomes: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, description, creditDate, isRecurring } = req.body;
      const income = await Income.findByPk(id);
      if (!income) {
        return res.status(404).json({ message: "Income not found" });
      }
      await income.update({
        amount: amount || income.amount,
        description: description || income.description,
        creditDate: creditDate || income.creditDate,
        isRecurring: isRecurring || income.isRecurring,
      });
      res.json({ message: "Income updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete incomes
  deleteIncome: async (req, res) => {
    try {
      const { id } = req.params;
      const income = await Income.findByPk(id);
      if (!income) {
        return res.status(404).json({ message: "Income not found" });
      }
      await income.destroy();
      res.json({ message: "Income deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to find total income per month
  totalIncomePerMonth: async (req, res) => {
    try {
      const totalsPerMonth = await Income.findAll({
        attributes: [
          [
            sequelize.fn("TO_CHAR", sequelize.col("creditDate"), "YYYY-MM"),
            "month",
          ],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          "$IncomeConfig.userId$": req.userId,
        },
        include: [
          {
            model: IncomeConfig,
            attributes: [],
          },
        ],
        group: [
          sequelize.fn("TO_CHAR", sequelize.col("creditDate"), "YYYY-MM"),
        ],
        order: [
          [
            sequelize.fn("TO_CHAR", sequelize.col("creditDate"), "YYYY-MM"),
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

module.exports = incomesController;
