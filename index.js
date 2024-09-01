const { SERVER_PORT, DB_PORT } = require("./utils/config");
const app = require("./app");
const sequelize = require("./utils/db.config");

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected} at ${DB_PORT}.`);
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
