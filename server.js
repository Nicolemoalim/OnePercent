console.log('Starting server...');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db.Singleton');

const app = express();

// ✅ Log environment variables (not secrets)
console.log('Environment variables:');
console.log(`PORT: ${process.env.PORT}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);

// ✅ Middleware
console.log('Setting up middleware...');
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route imports
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/users');
const { verifyToken, isAdmin } = require('./middleware/auth.middleware');


// ✅ Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the OnePercent API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      cart: '/api/cart'
    }
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [tables] = await db.execute("SHOW TABLES");
    res.json({
      status: 'Database connection successful',
      tables: tables.map(t => Object.values(t)[0])
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({
      status: 'Database connection failed',
      error: err.message
    });
  }
});

// ✅ Mount routes
console.log('Mounting routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// ✅ Admin-only route
app.get('/api/admin', verifyToken, isAdmin, (req, res) => {
  res.send('Welcome, Admin!');
});


// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ✅ Start server on fixed port
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
