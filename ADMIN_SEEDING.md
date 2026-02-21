## Admin Seeding Feature - Implementation Guide

### What It Does

When the CookieBliss server starts, it automatically:
1. Checks if an admin user exists in the database
2. If no admin exists, creates one with credentials from environment variables
3. Hashes the password using bcrypt (automatic, handled by the User model)
4. Sets the user role to "admin"
5. Logs the created admin credentials to the console

### The Complete Function

```javascript
// Seed admin user if it doesn't exist
async function seedAdminUser() {
  try {
    // Check if an admin user already exists in the database
    const adminExists = await userModel.findByEmail(
      process.env.ADMIN_EMAIL || "admin@cookiebliss.com"
    );

    if (adminExists) {
      console.log("Admin user already exists. Skipping seed.");
      return;
    }

    // Get admin credentials from environment variables or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || "admin@cookiebliss.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    // Create admin user with bcrypt hashed password
    const result = await userModel.create("Admin User", adminEmail, adminPassword);

    // Update the role to "admin" (default is "customer")
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET role = ? WHERE id = ?",
        ["admin", result.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log(`✓ Admin user created successfully`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword} (Change this in production!)`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}
```

### Where It's Called

Inside `server.js`, inside the `initializeDatabase()` function:

```javascript
async function initializeDatabase() {
  try {
    // Initialize users table
    await userModel.initTable();
    console.log("Users table ready");

    // Initialize orders table
    await new Promise((resolve, reject) => {
      db.run(`...`, (err) => {
        if (err) reject(err);
        else {
          console.log("Orders table ready");
          resolve();
        }
      });
    });

    // Seed admin user if it doesn't exist ← CALLED HERE
    await seedAdminUser();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
```

### How to Use

#### Option 1: Use Environment Variables (Recommended)

Create a `.env` file in your project root:
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123
```

Then start the server:
```bash
npm start
```

#### Option 2: Use Default Credentials

Simply run the server without environment variables:
```bash
npm start
```

Default credentials will be used:
- Email: `admin@cookiebliss.com`
- Password: `admin123456`

### What Happens on First Run

```
$ npm start
Connected to SQLite database
Users table ready
Orders table ready
✓ Admin user created successfully
  Email: admin@cookiebliss.com
  Password: admin123456 (Change this in production!)
Server running on http://localhost:3000
```

### What Happens on Subsequent Runs

```
$ npm start
Connected to SQLite database
Users table ready
Orders table ready
Admin user already exists. Skipping seed.
Server running on http://localhost:3000
```

### Key Features

✓ **Auto-detection**: Checks if admin exists before creating
✓ **Environment Variables**: Loads credentials from `.env`
✓ **Default Fallback**: Works without `.env` file
✓ **Password Hashing**: Automatically hashed using bcrypt
✓ **Role Assignment**: Sets role to "admin" after creation
✓ **Error Handling**: Gracefully handles errors
✓ **Logging**: Clear console messages for debugging
✓ **Idempotent**: Safe to run multiple times (doesn't duplicate admins)

### Security Notes

⚠️ **For Development Only**:
- Default password is weak
- Always use environment variables in production
- Change the default credentials immediately
- Use a strong password (20+ characters)
- Store credentials securely in production environment

### Testing the Admin Account

After the server starts, you can log in:

**URL**: http://localhost:3000/login.html

**Default Credentials**:
- Email: `admin@cookiebliss.com`
- Password: `admin123456`

**After Login**:
- You'll be redirected to http://localhost:3000/admin.html
- You'll have access to the order management dashboard
