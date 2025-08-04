const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "לא סופק טוקן אימות!"
    });
  }

  try {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({
      message: "אין הרשאה!"
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"].replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "נדרשת הרשאת מנהל!" });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({ message: "שגיאה באימות הרשאות מנהל" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;