const { authModel } = require("../db/db");

module.exports = () => async (req, res, next) => {
  const sessionId = req.headers.authorization;

  if (sessionId) {
    try {
      const user = await authModel.getUserBySessionId(sessionId);
      req.user = user;
      req.sessionId = sessionId;
    } catch (err) {}
  }

  next();
};
