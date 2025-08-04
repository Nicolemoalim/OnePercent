const pool = require('../database/dbSingleton'); // ודא שזה הנתיב הנכון
const { RowDataPacket } = require('mysql2');

exports.getCart = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ci.id, ci.productId, ci.quantity, p.name, p.price, p.imageUrl
      FROM cart_items ci
      JOIN products p ON ci.productId = p.id
      WHERE ci.userId = ?
    `, [req.user.id]);

    res.json(rows);
  } catch (error) {
    console.error('שגיאה בטעינת סל הקניות:', error);
    res.status(500).json({ error: 'שגיאה בטעינת סל הקניות' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const [results] = await pool.query(`
      SELECT * FROM cart_items WHERE userId = ? AND productId = ?
    `, [userId, productId]);

    if (results.length > 0) {
      const existing = results[0];
      await pool.query(`
        UPDATE cart_items SET quantity = quantity + ? WHERE id = ?
      `, [quantity, existing.id]);
      res.status(200).json({ message: 'עודכן בסל' });
    } else {
      const [insert] = await pool.query(`
        INSERT INTO cart_items (userId, productId, quantity)
        VALUES (?, ?, ?)
      `, [userId, productId, quantity]);
      res.status(201).json({ message: 'נוסף לסל', id: insert.insertId });
    }
  } catch (error) {
    console.error('שגיאה בהוספת מוצר לסל:', error);
    res.status(500).json({ error: 'שגיאה בהוספת מוצר לסל' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;
    const userId = req.user.id;

    const [results] = await pool.query(`
      SELECT * FROM cart_items WHERE id = ? AND userId = ?
    `, [itemId, userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'פריט לא נמצא בסל' });
    }

    if (quantity <= 0) {
      await pool.query(`DELETE FROM cart_items WHERE id = ?`, [itemId]);
      return res.json({ message: 'פריט הוסר מהסל' });
    }

    await pool.query(`
      UPDATE cart_items SET quantity = ? WHERE id = ?
    `, [quantity, itemId]);

    res.json({ message: 'עודכן בהצלחה' });
  } catch (error) {
    console.error('שגיאה בעדכון הפריט בסל:', error);
    res.status(500).json({ error: 'שגיאה בעדכון הפריט בסל' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    const [results] = await pool.query(`
      SELECT * FROM cart_items WHERE id = ? AND userId = ?
    `, [itemId, userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'פריט לא נמצא בסל' });
    }

    await pool.query(`DELETE FROM cart_items WHERE id = ?`, [itemId]);
    res.json({ message: 'פריט הוסר מהסל בהצלחה' });
  } catch (error) {
    console.error('שגיאה בהסרת הפריט מהסל:', error);
    res.status(500).json({ error: 'שגיאה בהסרת הפריט מהסל' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await pool.query(`DELETE FROM cart_items WHERE userId = ?`, [req.user.id]);
    res.json({ message: 'סל הקניות רוקן בהצלחה' });
  } catch (error) {
    console.error('שגיאה בריקון סל הקניות:', error);
    res.status(500).json({ error: 'שגיאה בריקון סל הקניות' });
  }
};
