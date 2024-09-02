// Importing nodemailer package
const nodemailer = require("nodemailer");

// Importing credentials from config
const { EMAIL_ID, EMAIL_APP_PASSWORD } = require("./config");

// Creating a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_APP_PASSWORD,
  },
});

module.exports = transporter;
