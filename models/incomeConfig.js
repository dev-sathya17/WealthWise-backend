const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const User = require("./user");
const IncomeCategory = require("./incomeCategory");

const IncomeConfig = sequelize.define(
  "IncomeConfig",
  {
    incomeConfigId: {
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
    incomeCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "IncomeCategories",
        key: "incomeCategoryId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: false,
    tableName: "IncomeConfig",
  }
);

IncomeConfig.belongsTo(User, { foreignKey: "userId" });
IncomeConfig.belongsTo(IncomeCategory, { foreignKey: "incomeCategoryId" });

module.exports = IncomeConfig;
