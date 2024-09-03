const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      required: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin"]],
      },
    },
    isFirstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "Users",
  }
);

module.exports = User;
