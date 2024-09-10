const IncomeCategory = require("../models/incomeCategory");
const IncomeConfig = require("../models/incomeConfig");
const User = require("../models/user");
const sequelize = require("../utils/db.config");

const incomeConfigController = {
  // API to get income configuration
  getIncomeConfig: async (req, res) => {
    try {
      // Fetch income configuration from the database
      const incomeConfig = await IncomeConfig.findAll({
        where: { userId: req.userId },
        attributes: { exclude: ["incomeCategoryId"] },
        include: [
          {
            model: IncomeCategory,
            attributes: ["incomeCategoryId", "name"],
          },
        ],
      });
      res.json(incomeConfig);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // API to add income configuration
  addIncomeConfig: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      // Create new income configuration object
      const { categories, isInitial } = req.body;

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Categories array cannot be empty");
      }

      // Save the new income configuration to the database
      await Promise.all(
        categories.map((category) => {
          return IncomeConfig.create(
            {
              userId: req.userId,
              incomeCategoryId: category,
            },
            { transaction }
          );
        })
      );

      if (isInitial) {
        const user = await User.findByPk(req.userId);
        await user.update({
          isFirstLogin: false,
        });
        user.save();
      }

      await transaction.commit();
      res.status(201).json({
        message: "Income configuration added successfully",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ message: error.message });
    }
  },

  // API to delete configuration
  deleteIncomeConfig: async (req, res) => {
    try {
      const { id } = req.params;
      // Delete income configuration from the database
      await IncomeConfig.destroy({
        where: { incomeConfigId: id },
      });
      res.status(200).json({
        message: "Income configuration deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = incomeConfigController;
