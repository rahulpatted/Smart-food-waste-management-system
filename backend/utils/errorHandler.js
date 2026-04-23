const logger = require("./logger");

module.exports = (err, req, res, _next) => {
  logger.error(err.stack);

  res.status(500).json({
    message: err.message || "Server Error",
  });
};
