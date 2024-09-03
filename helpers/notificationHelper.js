const sendEmail = require("./emailHelper");
const Income = require("../models/income.model");
const IncomeConfig = require("../models/incomeConfig");
const User = require("../models/user");
const Expense = require("../models/expense.model");
const ExpenseConfig = require("../models/expenseConfig");

const getNextOccurrence = (date) => {
  const baseDate = new Date(date);
  baseDate.setMonth(baseDate.getMonth() + 1);
  return baseDate.toISOString().split("T")[0];
};

const isDeadlineTomorrow = (deadline) => {
  const today = new Date();
  const startOfTomorrow = new Date(today);
  startOfTomorrow.setDate(today.getDate() + 1);
  startOfTomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date(today);
  endOfTomorrow.setDate(today.getDate() + 1);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const deadlineDate = new Date(deadline);

  return deadlineDate >= startOfTomorrow && deadlineDate <= endOfTomorrow;
};

const notifyDeadlines = async () => {
  const incomes = await Income.findAll({
    where: { isRecurring: true, isNotified: false },
    include: {
      model: IncomeConfig,
      attributes: ["userId"],
      include: {
        model: User,
        attributes: ["email", "name"],
      },
    },
  });

  const result = incomes.map((income) => {
    return {
      creditDate: income.dataValues.creditDate,
      email: income.IncomeConfig.User.dataValues.email,
      description: income.dataValues.description,
      amount: income.dataValues.amount,
      name: income.IncomeConfig.User.dataValues.name,
      incomeId: income.dataValues.incomeId,
    };
  });

  result.forEach(async (income) => {
    if (isDeadlineTomorrow(income.creditDate)) {
      const subject = "Upcoming Income Notification: Scheduled for Tomorrow";
      const text = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Income Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    line-height: 1.6;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Upcoming Income Notification</h1>
                <p>Dear ${income.name},</p>
                <p>We wanted to let you know that you have an income scheduled to be received tomorrow. Here are the details:</p>
                <p><strong>Amount:</strong> ${income.amount}</p>
                <p><strong>Description:</strong> ${income.description}</p>
                <p><strong>Credit Date:</strong> ${income.creditDate}</p>
                <p>Make sure to check your account on the mentioned date to confirm the transaction.</p>
                <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
                <p>Thank you for being a valued user!</p>
                <div class="footer">
                    <p>Best regards,</p>
                    <p>Wealth Wise Team</p>
                </div>
            </div>
        </body>
        </html>
        `;
      try {
        const incomeInstance = await Income.findByPk(income.incomeId);
        await incomeInstance.update({
          isNotified: true,
          creditDate: getNextOccurrence(income.creditDate),
        });
      } catch (error) {
        console.log(`error in updating income instance ${error}`);
      }
      await sendEmail(income.email, subject, text);
      console.log(
        `Email sent to ${income.email} for income ID: ${income.incomeId}`
      );
    }
  });

  const expenses = await Expense.findAll({
    where: { isRecurring: true, isNotified: false },
    include: {
      model: ExpenseConfig,
      attributes: ["userId"],
      include: {
        model: User,
        attributes: ["email", "name"],
      },
    },
  });

  const formattedExpenses = expenses.map((expense) => {
    return {
      creditDate: expense.dataValues.creditDate,
      email: expense.ExpenseConfig.User.dataValues.email,
      description: expense.dataValues.description,
      amount: expense.dataValues.amount,
      name: expense.ExpenseConfig.User.dataValues.name,
      expenseId: expense.dataValues.expenseId,
    };
  });

  formattedExpenses.forEach(async (expense) => {
    if (isDeadlineTomorrow(expense.creditDate)) {
      const subject = "Upcoming Expense Notification: Scheduled for Tomorrow";
      const text = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Expense Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    line-height: 1.6;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Upcoming Expense Notification</h1>
                <p>Dear ${expense.name},</p>
                <p>We wanted to let you know that you have an expense scheduled to be received tomorrow. Here are the details:</p>
                <p><strong>Amount:</strong> ${expense.amount}</p>
                <p><strong>Description:</strong> ${expense.description}</p>
                <p><strong>Credit Date:</strong> ${expense.creditDate}</p>
                <p>Make sure to check your account on the mentioned date to confirm the transaction.</p>
                <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
                <p>Thank you for being a valued user!</p>
                <div class="footer">
                    <p>Best regards,</p>
                    <p>Wealth Wise Team</p>
                </div>
            </div>
        </body>
        </html>
        `;

      const expenseInstance = await Expense.findByPk(expense.expenseId);
      await expenseInstance.update({
        isNotified: true,
        debitDate: getNextOccurrence(expense.debitDate),
      });
      await sendEmail(expense.email, subject, text);
      console.log(
        `Email sent to ${expense.email} for expense ID: ${expense.expenseId}`
      );
    }
  });
};

const resetNotifications = async (expense) => {
  const expenses = await Expense.findAll({
    where: {
      isRecurring: true,
      isNotified: true,
    },
  });

  expenses.forEach(async (expense) => {
    const lastNotificationDate = new Date(expense.debitDate);

    const resetDate = new Date(lastNotificationDate);
    resetDate.setDate(lastNotificationDate.getDate() + 15);

    const currentDate = new Date();

    if (currentDate >= resetDate) {
      await expense.update({ isNotified: false });
      console.log(`isNotified reset for expenseId: ${expense.expenseId}`);
    }
  });
};

module.exports = { notifyDeadlines, resetNotifications };
