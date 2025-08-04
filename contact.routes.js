const express = require('express');
const router = express.Router();

// Handle contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email
    // 3. Handle any other business logic

    // For now, we'll just send a success response
    res.json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;