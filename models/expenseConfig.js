const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const User = require("./user");
const ExpenseCategory = require("./expenseCategory");

const ExpenseConfig = sequelize.define(
  "ExpenseConfig",
  {
    expenseConfigId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    expenseCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "ExpenseCategories",
        key: "expenseCategoryId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: false,
    tableName: "ExpenseConfig",
  }
);

ExpenseConfig.belongsTo(User, { foreignKey: "userId" });
ExpenseConfig.belongsTo(ExpenseCategory, { foreignKey: "expenseCategoryId" });

module.exports = ExpenseConfig;
