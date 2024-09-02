const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const incomeCategoriesRouter = require("./routes/incomeCategories.route");
const expenseCategoriesRouter = require("./routes/expenseCategories.route");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/income-categories", incomeCategoriesRouter);
app.use("/api/v1/expense-categories", expenseCategoriesRouter);

module.exports = app;
