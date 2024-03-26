const mongoose = require("mongoose");
const logger = require("../config/logging")

const db = process.env.MONGO_URI;
module.exports = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info(`Connected to ${db}`);
    })
    .catch((err) => {
      return logger.error(err.message);
    });

};
