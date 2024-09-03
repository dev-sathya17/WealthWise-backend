const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const IncomeConfig = require("./incomeConfig");
const Income = sequelize.define(
  "Income",
  {
    incomeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    incomeConfigId: {
      type: DataTypes.UUID,
      references: {
        model: "IncomeConfig",
        key: "incomeConfigId",
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
    creditDate: {
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
    tableName: "Incomes",
  }
);

Income.belongsTo(IncomeConfig, { foreignKey: "incomeConfigId" });

module.exports = Income;
