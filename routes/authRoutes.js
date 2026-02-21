const express = require("express");

// Creates authentication routes
function createAuthRoutes(authController) {
  const router = express.Router();

  // POST /api/auth/register - User registration
  router.post("/register", (req, res) => {
    authController.register(req, res);
  });

  // POST /api/auth/login - User login
  router.post("/login", (req, res) => {
    authController.login(req, res);
  });

  return router;
}

module.exports = createAuthRoutes;
