const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/index.js");

require("./db.js");

const server = express();

server.name = "API";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

server.use(cors({ origin: allowedOrigins, credentials: false }));
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));
server.use(morgan("dev"));

server.use("/", routes);

server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message || String(err);
  console.error(err);
  res.status(status).json({ error: message });
});

module.exports = server;
