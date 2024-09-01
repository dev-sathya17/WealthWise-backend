require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PORT = process.env.DB_PORT || 5432;
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  DB_USER,
  DB_PORT,
  DB_PASSWORD,
  SERVER_PORT,
  EMAIL_ID,
  EMAIL_APP_PASSWORD,
  SECRET_KEY,
};
