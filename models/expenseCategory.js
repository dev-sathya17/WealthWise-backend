const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");

const ExpenseCategory = sequelize.define(
  "ExpenseCategory",
  {
    expenseCategoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "ExpenseCategories",
  }
);

module.exports = ExpenseCategory;
