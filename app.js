const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Routers
const userRouter = require("./routes/user.route");
const incomeCategoriesRouter = require("./routes/incomeCategories.route");
const expenseCategoriesRouter = require("./routes/expenseCategories.route");
const incomeConfigRouter = require("./routes/incomeConfig.route");
const expenseConfigRouter = require("./routes/expenseConfig.route");
const budgetRouter = require("./routes/budget.route");
const incomeRouter = require("./routes/income.route");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/income-categories", incomeCategoriesRouter);
app.use("/api/v1/expense-categories", expenseCategoriesRouter);
app.use("/api/v1/income-config", incomeConfigRouter);
app.use("/api/v1/expense-config", expenseConfigRouter);
app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/incomes", incomeRouter);

module.exports = app;
