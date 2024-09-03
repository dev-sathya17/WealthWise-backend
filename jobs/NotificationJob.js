const cron = require("node-cron");
const {
  notifyDeadlines,
  resetNotifications,
} = require("../helpers/notificationHelper");

// Schedule the job to run every hour
cron.schedule("*/20 * * * * *", () => {
  console.log("Checking deadlines...");
  notifyDeadlines();
  resetNotifications();
});
