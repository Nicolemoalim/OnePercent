const express = require('express');
const router = express.Router();
const db = require('../db.Singleton');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'לא סופק טוקן אימות' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'טוקן לא תקין' });
    }
    req.user = user;
    next();
  });
}

// 🟢 Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log("🟡 Incoming data:", { username, email });

    // Check if user exists
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'משתמש עם אימייל זה כבר קיים' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user';

    // Insert into DB
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    console.log('✅ MySQL insert result:', result);

    const userId = result.insertId;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'נרשמת בהצלחה', userId, token });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'שגיאה בהרשמה', error: error.message });
  }
});

// 🔵 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userId: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בהתחברות', error: error.message });
  }
});

// 👤 Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [user] = await db.execute(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בקבלת פרטי המשתמש', error: error.message });
  }
});

// ✏️ Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { username, email } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    res.json({ message: 'פרטי המשתמש עודכנו בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון פרטי המשתמש', error: error.message });
  }
});

module.exports = router;
