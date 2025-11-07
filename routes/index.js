const express = require("express");
const winston = require("winston");
const cors = require("cors");

const morgan = require("morgan");

const episodes = require("../routes/episodes");
const podcasts = require("../routes/podcasts");
const users = require("../routes/users");

const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://press-play.site",
        "https://www.press-play.site",
      ],
      credentials: true,
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
      ],
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    })
  );
  app.use(morgan("dev"));

  // Serve uploads folder as static files in development
  if (process.env.NODE_ENV !== "production") {
    app.use("/uploads", express.static("uploads"));
  }

  app.get("/", (req, res, next) => {
    res.send(
      `Welcome to Press Play API. Documentation available at <a href="https://documenter.getpostman.com/view/9823092/TW74i51A">https://documenter.getpostman.com/view/9823092/TW74i51A.</a>`
    );
  });

  app.use("/api/episodes", episodes); // use the episodes router;
  app.use("/api/podcasts", podcasts); // use the podcasts router;
  app.use("/api/users", users); // use the users router;

  app.use("*", (req, res) => {
    res.send({
      status: false,
      message: "This is an invalid route",
      data: null,
    });
  });
  //error middleware
  app.use(error(winston));
};
