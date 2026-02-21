const jwt = require("jsonwebtoken");

// JWT secret key (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware: Verify JWT token from Authorization header
// Attaches decoded user info to req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

// Middleware: Check if user has required role
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRole, JWT_SECRET };
