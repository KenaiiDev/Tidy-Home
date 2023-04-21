const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  //check if authorization header is present
  if (!req.headers["authorization"])
    return res.status(401).json({ error: "Access denied" });

  //get bearer token from header
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = { validateToken };
