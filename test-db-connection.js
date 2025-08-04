const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  let connection;
  try {
    // Create a connection to the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'onepercentdb',
      port: 3306
    });

    console.log('✅ Successfully connected to MySQL server');

    // Check if database exists
    const [dbs] = await connection.query('SHOW DATABASES');
    console.log('\n📂 Available databases:');
    console.log(dbs.map(db => `- ${db.Database}`).join('\n'));

    // Check if products table exists
    try {
      const [tables] = await connection.query('SHOW TABLES');
      console.log('\n📊 Database tables:');
      console.log(tables.length > 0 
        ? tables.map(t => `- ${Object.values(t)[0]}`).join('\n')
        : 'No tables found');

      // If products table exists, show some data
      if (tables.some(t => Object.values(t)[0] === 'products')) {
        const [products] = await connection.query('SELECT * FROM products LIMIT 5');
        console.log('\n🛍️  Sample products:');
        console.log(products.length > 0 
          ? products.map(p => `- ID: ${p.id}, Name: ${p.name || 'N/A'}, Price: ${p.price || 'N/A'}`).join('\n')
          : 'No products found');
      }
    } catch (tableErr) {
      console.error('\n❌ Error checking tables:', tableErr.message);
    }

  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Connection details:', {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'onepercentdb',
      port: 3306
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

testConnection();
