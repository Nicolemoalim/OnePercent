const db = require("../db.Singleton");

// Verify token and return user data
exports.verifyToken = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, username, email, firstName, lastName, role 
       FROM users 
       WHERE id = ?`, 
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const user = rows[0];

    res.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error in verifyToken:', err);
    res.status(500).send({ message: 'Error verifying token.' });
  }
};
