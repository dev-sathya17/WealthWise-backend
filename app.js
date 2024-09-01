const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(morgan("dev"));

module.exports = app;
