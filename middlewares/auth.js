const jwt = require("jsonwebtoken");
const AuthError = require("../errors/authorization-error");

const JWT_SECRET = "unbelievably-secret-key";

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new AuthError("Please sign in"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError("Invalid token. Please sign in"));
  }

  res.user = payload;

  next();
};

module.exports = { JWT_SECRET, auth };
