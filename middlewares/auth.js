const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Please sign in" });
  }

  const token = authorization.replace("Bearer ", "");

  const payload = jwt.verify(
    token,
    "unbelievably-secret-key",
    (err, decoded) => {
      if (err) res.status(401).send({ message: "Please sign in" });

      return decoded;
    },
  );

  res.user = payload;

  next();
};
