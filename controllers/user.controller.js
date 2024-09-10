// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the models
const User = require("../models/user");
const Income = require("../models/income.model");
const Expense = require("../models/expense.model");
const IncomeConfig = require("../models/incomeConfig");
const ExpenseConfig = require("../models/expenseConfig");

// Importing helper function to send email
const sendEmail = require("../helpers/emailHelper");

// Importing the jwt library
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../utils/config");
const generateOtp = require("../helpers/userHelper");
const sequelize = require("../utils/db.config");
const IncomeCategory = require("../models/incomeCategory");
const ExpenseCategory = require("../models/expenseCategory");

const userController = {
  // API for registering users
  register: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      // Destructuring the request body
      const { name, email, password, mobile, role } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Checking if mobile number already exists
      const existingMobile = await User.findOne({ where: { mobile } });

      if (existingMobile) {
        return res.json({ message: "Mobile number must be unique" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = await User.create(
        {
          name,
          email,
          password: hashedPassword,
          mobile,
          image: req.file ? req.file.path : "uploads/avatar.png",
          role: role || "user",
        },
        { transaction: t }
      );

      const subject = "Welcome to WealthWise!";
      const text = `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Wealth Wise</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 100px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            padding: 20px 0;
            text-align: center;
        }
        .content h2 {
            margin: 0 0 10px;
            font-size: 22px;
            color: #333333;
        }
        .content p {
            font-size: 16px;
            color: #666666;
            line-height: 1.6;
        }
        .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #999999;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Wealth Wise!</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering with Wealth Wise, your personal finance management partner. We’re excited to help you take control of your financial future!</p>
            <p>To get started, simply log in to your account and explore all the tools and resources we have to offer.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us</p>
            <p>Regards, Wealth Wise Team.</p>
        </div>
    </div>
</body>
</html>
`;

      // Sending an email notification
      sendEmail(email, subject, text);

      // Saving the user to the database
      await t.commit();

      // Sending a success response
      res.status(201).json({
        message: "Your account has been created successfully.",
        user,
      });
    } catch (error) {
      await t.rollback();
      // Sending an error response
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // API for user login
  login: async (req, res) => {
    try {
      // getting the user email and password from the request body
      const { email, password } = req.body;

      // checking if the user exists in the database
      const user = await User.findOne({ where: { email } });

      // if the user does not exist, return an error response
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // if the user exists check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // if the password is invalid, return an error response
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      // generating a JWT token
      const token = jwt.sign({ id: user.userId }, SECRET_KEY);

      // setting the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // Setting user role as cookie
      res.cookie("role", user.role, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // sending a success response
      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      // sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for user logout
  logout: async (req, res) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).send({ message: "User not authenticated" });
      }

      // clearing the cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("role", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      // sending a success response
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for sending email for the user when user wants to reset password
  forgotPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Generating otp
      const otp = generateOtp();

      // Update user
      await user.update({ otp });

      const subject = "Password Reset Request";
      const message = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Wealth Wise Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            margin: auto;
                        }
                        h1 {
                            color: #333333;
                            font-size: 24px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #555555;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #28a745;
                            letter-spacing: 2px;
                            margin: 20px 0;
                            padding: 10px 20px;
                            border: 1px dashed #28a745;
                            display: inline-block;
                            background-color: #f0f9f4;
                            border-radius: 5px;
                        }
                        
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset Request</h1>
                        <p>Hi ${user.name},</p>
                        <p>You recently requested to reset your password for your Wealth Wise account. Use the following OTP (One Time Password) to reset your password:</p>
                        <div class="otp">${otp}</div>
                        <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                        <p>Thank you,<br>The Wealth Wise Team</p>
                    </div>
                </body>
                </html>
                `;

      // Sending an email
      sendEmail(email, subject, message);

      await user.save();

      // Sending a success response
      res.status(200).json({
        message: "OTP successfully sent to your email address.",
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to verify OTP
  verifyOtp: async (req, res) => {
    try {
      const { otp, email } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).send({ message: "user not found" });
      }

      if (user.otp === parseInt(otp)) {
        user.otp = 0;
        await user.save();
        res.status(200).send({ message: "OTP verified successfully" });
      } else {
        return res.status(400).send({ message: "Invalid OTP" });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  // API for resetting password
  resetPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email, password } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user
      await user.update({
        password: hashedPassword,
      });
      await user.save();

      // Sending a success response
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get user profile information
  getProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;

      // Fetching the user from the database
      const user = await User.findByPk(id, {
        attributes: {
          exclude: [
            "password",
            "createdAt",
            "updatedAt",
            "otp",
            "isFirstLogin",
          ],
        },
      });

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user found, return the user data
      res.json(user);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to update user profile information
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: "User not authenticated" });
      }
      const { name, email, mobile } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
        mobile: mobile || user.mobile,
        image: req.file ? req.file.path : user.image,
      });

      await user.save();
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  },

  // API to delete user
  deleteProfile: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: "User not authenticated" });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ message: "Customer not found" });
      }
      await user.destroy();

      if (id === req.userId) {
        // clearing the cookie
        res.clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });
        res.clearCookie("role", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });
      }

      res.status(200).send({ message: "Profile deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // API to find total income and expenses
  totalUserIncomeExpense: async (req, res) => {
    try {
      // Fetch total income
      const totalIncomeResult = await Income.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("amount")), "totalIncome"],
        ],
        where: {
          "$IncomeConfig.userId$": req.userId,
        },
        include: [
          {
            model: IncomeConfig,
            attributes: [],
          },
        ],
        raw: true,
      });

      // Fetch total expense
      const totalExpenseResult = await Expense.findOne({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("amount")), "totalExpense"],
        ],
        where: {
          "$ExpenseConfig.userId$": req.userId,
        },
        include: [
          {
            model: ExpenseConfig,
            attributes: [],
          },
        ],
        raw: true,
      });

      // Extract the totals
      const totalIncome = totalIncomeResult.totalIncome || 0;
      const totalExpense = totalExpenseResult.totalExpense || 0;

      // Send response
      res.status(200).json({
        totalIncome,
        totalExpense,
      });
    } catch (error) {
      console.error("Error fetching totals:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // API to find total income and expenses per category
  totalUserIncomeExpenseByCategory: async (req, res) => {
    try {
      // Fetch total income
      const totalIncomeByCategory = await Income.findAll({
        include: [
          {
            model: IncomeConfig,
            attributes: [],
            include: [
              {
                model: IncomeCategory,
                attributes: ["incomeCategoryId", "name"],
              },
            ],
          },
        ],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
          [sequelize.col("IncomeConfig->IncomeCategory.name"), "categoryName"],
        ],
        where: {
          "$IncomeConfig.userId$": req.userId,
        },
        group: [
          "IncomeConfig.IncomeCategory.incomeCategoryId",
          "IncomeConfig.IncomeCategory.name",
        ],
        raw: true,
      });

      // Fetch total expense
      const totalExpenseByCategory = await Expense.findAll({
        include: [
          {
            model: ExpenseConfig,
            attributes: [],
            include: [
              {
                model: ExpenseCategory,
                attributes: ["expenseCategoryId", "name"],
              },
            ],
          },
        ],
        attributes: [
          [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
          [
            sequelize.col("ExpenseConfig->ExpenseCategory.name"),
            "categoryName",
          ],
        ],
        where: {
          "$ExpenseConfig.userId$": req.userId,
        },
        group: [
          "ExpenseConfig.ExpenseCategory.expenseCategoryId",
          "ExpenseConfig.ExpenseCategory.name",
        ],
        raw: true,
      });

      // Cleansing the data
      const incomeData = totalIncomeByCategory.map((income) => {
        return {
          name: income.categoryName,
          value: parseInt(income.totalAmount),
        };
      });

      const expenseData = totalExpenseByCategory.map((expense) => {
        return {
          name: expense.categoryName,
          value: parseInt(expense.totalAmount),
        };
      });

      // Send response
      res.status(200).json({
        incomeData,
        expenseData,
      });
    } catch (error) {
      console.error("Error fetching totals:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // API to check authentication
  checkAuthentication: async (req, res) => {
    try {
      const token = req.cookies.token;
      const role = req.cookies.role;

      // If token does not exist
      if (!token) {
        return res.status(401).json({ message: "Access Denied" });
      }

      // Verifying the token using JWT
      try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ message: "Authentication successful", role });
      } catch (error) {
        // Sending an error response
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch user budget settings.
  getSettings: async (req, res) => {
    try {
      const incomeConfig = await IncomeConfig.findAll({
        include: [
          {
            model: IncomeCategory,
            attributes: ["incomeCategoryId", "name"],
          },
        ],
        attributes: ["incomeConfigId"],
        where: {
          userId: req.userId,
        },
      });

      const configCategories = incomeConfig.map((config) => {
        return {
          ...config.IncomeCategory.dataValues,
          incomeConfigId: config.dataValues.incomeConfigId,
        };
      });

      const incomeCategories = await IncomeCategory.findAll();

      const incomeSettings = [];
      incomeCategories.forEach((incomeCategory) => {
        const settingsObj = {};
        const income = configCategories.find(
          (inc) => inc.incomeCategoryId === incomeCategory.incomeCategoryId
        );
        if (income) {
          settingsObj.name = income.name;
          settingsObj.categoryId = income.incomeCategoryId;
          settingsObj.isActive = true;
          settingsObj.incomeConfigId = income.incomeConfigId;
        } else {
          settingsObj.name = incomeCategory.name;
          settingsObj.categoryId = incomeCategory.incomeCategoryId;
          settingsObj.isActive = false;
          settingsObj.incomeConfigId = null;
        }
        incomeSettings.push(settingsObj);
      });

      const expenseConfig = await ExpenseConfig.findAll({
        include: [
          {
            model: ExpenseCategory,
            attributes: ["expenseCategoryId", "name"],
          },
        ],
        attributes: ["expenseConfigId"],
        where: {
          userId: req.userId,
        },
      });

      const expenseConfigCategories = expenseConfig.map((expense) => {
        return {
          ...expense.ExpenseCategory.dataValues,
          expenseConfigId: expense.dataValues.expenseConfigId,
        };
      });

      const expenseCategories = await ExpenseCategory.findAll();

      const expenseSettings = [];
      expenseCategories.forEach((expenseCategory) => {
        const settingsObj = {};
        const expense = expenseConfigCategories.find(
          (exp) => exp.expenseCategoryId === expenseCategory.expenseCategoryId
        );
        if (expense) {
          settingsObj.name = expense.name;
          settingsObj.categoryId = expense.expenseCategoryId;
          settingsObj.isActive = true;
          settingsObj.expenseConfigId = expense.expenseConfigId;
        } else {
          settingsObj.name = expenseCategory.name;
          settingsObj.categoryId = expenseCategory.expenseCategoryId;
          settingsObj.isActive = false;
          settingsObj.expenseConfigId = null;
        }
        expenseSettings.push(settingsObj);
      });

      return res
        .status(200)
        .json({ income: incomeSettings, expense: expenseSettings });
    } catch (error) {
      console.error("Error fetching user budget settings:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
      throw new Error("Internal Server Error");
    }
  },
};

module.exports = userController;
