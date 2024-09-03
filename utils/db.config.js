const { Sequelize } = require("sequelize");
const { DB_PASSWORD, DB_PORT, DB_USER } = require("./config");

const sequelize = new Sequelize(
  `postgresql://${DB_USER}:${DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:${DB_PORT}/postgres`,
  {
    logging: false,
  }
);

sequelize.sync({
  alter: true,
});

module.exports = sequelize;
