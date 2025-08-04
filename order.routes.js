const express = require('express');
const router = express.Router();

// Get pending orders
router.get('/pending', async (req, res) => {
  try {
    // Implement your database query here
    const orders = await Order.findAll({
      where: {
        status: ['shipped', 'delivered']
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['date', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Cancel an order
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.update(
      { status: 'cancelled' },
      { where: { id } }
    );
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Close an order
router.put('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.update(
      { status: 'closed' },
      { where: { id } }
    );
    res.json({ message: 'Order closed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { fullName, shippingAddress, city, zipCode, paymentMethod } = req.body;
    
    const order = await Order.create({
      customerName: fullName,
      shippingAddress,
      city,
      zipCode,
      paymentMethod,
      status: 'processing',
      date: new Date(),
      // Add other necessary fields like userId, total, etc.
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;