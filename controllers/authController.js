const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authMiddleware");

// Handle user registration and login
class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // Register endpoint: creates new user account
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
          error: "All fields are required"
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          error: "Passwords do not match"
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long"
        });
      }

      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: "Email already registered"
        });
      }

      // Create user
      const result = await this.userModel.create(name, email, password);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: result.id
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed"
      });
    }
  }

  // Login endpoint: validates credentials and returns JWT
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required"
        });
      }

      // Find user by email
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password"
        });
      }

      // Verify password
      const isPasswordValid = await this.userModel.verifyPassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Invalid email or password"
        });
      }

      // Generate JWT token (expires in 24 hours)
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Login failed"
      });
    }
  }
}

module.exports = AuthController;
