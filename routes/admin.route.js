const express = require("express");
const adminController = require("../controllers/admin.controller");

const auth = require("../middlewares/auth");

const adminRouter = express.Router();

adminRouter.get(
  "/users",
  auth.authenticate,
  auth.authorize,
  adminController.getUsers
);

adminRouter.get(
  "/users/count",
  auth.authenticate,
  auth.authorize,
  adminController.getTotalUsers
);

adminRouter.get(
  "/transaction-report",
  auth.authenticate,
  auth.authorize,
  adminController.getTotalTransactionReport
);

module.exports = adminRouter;
