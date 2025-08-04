const db = require('../db.Singleton');

// יצירת הזמנה חדשה
exports.create = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { items, shippingAddress } = req.body;
    let totalAmount = 0;

    await connection.beginTransaction();

    // חישוב סכום כולל
    for (const item of items) {
      const [rows] = await connection.execute('SELECT price, stock FROM products WHERE id = ?', [item.productId]);
      const product = rows[0];
      if (!product) throw new Error(`Product ID ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for product ${item.productId}`);
      totalAmount += product.price * item.quantity;
    }

    // יצירת הזמנה
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (userId, totalAmount, shippingAddress, status) VALUES (?, ?, ?, ?)',
      [req.user.id, totalAmount, shippingAddress, 'pending']
    );

    const orderId = orderResult.insertId;

    // יצירת פריטים להזמנה
    for (const item of items) {
      const [productData] = await connection.execute('SELECT price, stock FROM products WHERE id = ?', [item.productId]);
      const product = productData[0];

      await connection.execute(
        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, product.price]
      );

      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    await connection.commit();
    res.status(201).json({ orderId, totalAmount, shippingAddress });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};

// קבלת כל ההזמנות של המשתמש
exports.findUserOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// קבלת הזמנה בודדת לפי מזהה
exports.findOne = async (req, res) => {
  try {
    const [orderRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND userId = ?',
      [req.params.id, req.user.id]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    }

    const [items] = await db.execute(
      `SELECT oi.*, p.name, p.imageUrl, p.price 
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE oi.orderId = ?`,
      [req.params.id]
    );

    res.json({ order: orderRows[0], items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
