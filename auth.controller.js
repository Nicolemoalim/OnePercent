const db = require("../db.Singleton");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// פונקציית הרשמה
const register = async (req, res) => {
  let conn;
  try {
    console.log('\n📩 Register route called:', {
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    });
    
    const { username, email, password, firstName, lastName, phone, address } = req.body;
    
    // Log the received data
    console.log('📝 Registration attempt:', { username, email, firstName, lastName });

    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('❌ Validation error:', errorMsg);
      return res.status(400).send({ 
        success: false,
        message: errorMsg,
        missingFields
      });
    }

    // Get a connection from the pool
    console.log('🔌 Getting database connection...');
    conn = await db.getConnection();
    
    // Start a transaction
    console.log('🔄 Starting database transaction...');
    await conn.beginTransaction();
    console.log('✅ Transaction started');

    try {
      // Check if user already exists
      console.log('🔍 Checking for existing user...');
      const [existing] = await conn.execute(
        "SELECT * FROM users WHERE email = ? OR username = ?", 
        [email, username]
      );
      
      if (existing.length > 0) {
        console.log('❌ User already exists:', { email, username });
        await conn.rollback();
        return res.status(400).send({ 
          success: false,
          message: "User with this email or username already exists" 
        });
      }

      // Create new user
      console.log('👤 Creating new user...');
      const [result] = await conn.execute(
        `INSERT INTO users 
          (username, email, password, first_name, last_name, phone, address, role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'user', NOW())`,
        [username, email, password, firstName, lastName, phone || null, address || null]
      );

      const userId = result.insertId;
      
      if (!userId) {
        throw new Error('Failed to create user: No user ID returned');
      }
      
      await conn.commit();
      console.log('✅ User created successfully with ID:', userId);

      // Generate JWT token
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).send({
        success: true,
        id: userId,
        username,
        email,
        firstName,
        lastName,
        accessToken: token,
        message: 'User registered successfully'
      });
      
    } catch (err) {
      if (conn) await conn.rollback();
      console.error('❌ Database error during registration:', err);
      throw err;
    }
  } catch (err) {
    console.error('❌ Registration failed:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).send({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? `Registration failed: ${err.message}` 
        : 'Registration failed. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  } finally {
    // Always release the connection back to the pool
    if (conn) {
      try {
        await conn.release();
      } catch (releaseErr) {
        console.error('❌ Error releasing database connection:', releaseErr);
      }
    }
  }
};

// פונקציית התחברות
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required" });
    }

    const conn = await db.getConnection(); // ✅ חיבור למסד
    const [users] = await conn.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("🧊 Stored password from DB:", users.password);
    console.log("➡️  Entered password:", password);
    console.log("✅ Password match result:", users.password === password);

    const user = users[0];
    const isPasswordValid = user.password === password;


    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role, // Include the user's role in the response
      accessToken: token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ message: "Login failed. Please try again later." });
  }
};

module.exports = {
  register,
  login
};
