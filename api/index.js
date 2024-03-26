require("express-async-errors");
let NODE_ENV = process.env.NODE_ENV || "development";
require("dotenv").config();
const express = require("express");
const app = express();

require("../config/joiObjectId")();
const logger = require("../config/logging");
require("../config/db")();
require("../routes/index")(app);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info("app listening at port 4000");
});
