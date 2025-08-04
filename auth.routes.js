const express = require('express');
const router = express.Router();
const db = require('../db.Singleton');
const bcrypt = require('bcryptjs');

// ✅ Test route to verify backend works
router.get('/test-connection', (req, res) => {
  console.log('✅ Test connection received from frontend');
  res.status(200).json({
    success: true,
    message: 'Backend is connected and responding!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Register route
router.post('/register', async (req, res) => {
    console.log('🔵 Registration request received:', req.body);
  
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address
    } = req.body;
  
    // Validation: check required fields
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
  
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }
  
    let connection;
    try {
      connection = await db.getConnection();
      console.log('🔌 DB connection established');
  
      // Check if email already exists
      const [existingUser] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
  
      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
  
      const role = 'user';
  
      await connection.beginTransaction();
  
      const [result] = await connection.execute(
        `INSERT INTO users 
        (username, email, password, first_name, last_name, phone, address, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          username,
          email,
          password,
          firstName,
          lastName,
          phone || null,
          address || null,
          role
        ]
      );
  
      await connection.commit();
  
      console.log('✅ User registered successfully with ID:', result.insertId);
  
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        userId: result.insertId
      });
  
    } catch (error) {
      console.error('❌ Registration failed:', error);
      if (connection) await connection.rollback();
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
        error: error.message
      });
    } finally {
      if (connection) await connection.release();
    }
  });

// ✅ Login route
router.post('/login', async (req, res) => {
  console.log('🔵 Login request received:', { email: req.body.email });
  
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    
    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    
    // Debug logging
    console.log('🔍 Login attempt details:', {
      userId: user.id,
      storedPassword: user.password,
      providedPassword: password,
      match: user.password === password
    });

    // Compare plaintext passwords
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Create JWT token (if using JWT)
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with user data (excluding password)
    const { password: _, ...userData } = user;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData
      // token: token // Uncomment if using JWT
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  } finally {
    if (connection) await connection.release();
  }
});

// Export the router
module.exports = router;