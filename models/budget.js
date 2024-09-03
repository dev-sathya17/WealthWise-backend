const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const ExpenseConfig = require("./expenseConfig");

const Budget = sequelize.define(
  "Budget",
  {
    budgetId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    expenseConfigId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "ExpenseConfig",
        key: "expenseConfigId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "Budgets",
  }
);

Budget.belongsTo(ExpenseConfig, { foreignKey: "expenseConfigId" });

module.exports = Budget;
