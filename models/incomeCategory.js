const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");

const IncomeCategory = sequelize.define(
  "IncomeCategory",
  {
    incomeCategoryId: {
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
    tableName: "IncomeCategories",
  }
);

module.exports = IncomeCategory;
