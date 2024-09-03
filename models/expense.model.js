const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const ExpenseConfig = require("./expenseConfig");
const Expense = sequelize.define(
  "Expense",
  {
    expenseId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    expenseConfigId: {
      type: DataTypes.UUID,
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    debitDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Expenses",
  }
);

Expense.belongsTo(ExpenseConfig, { foreignKey: "expenseConfigId" });

module.exports = Expense;
