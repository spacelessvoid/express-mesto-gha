const jwt = require("jsonwebtoken");

const JWT_SECRET = "unbelievably-secret-key";

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Please sign in" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Please sign in" });
  }

  res.user = payload;

  next();
};

module.exports = { JWT_SECRET, auth };
