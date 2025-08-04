const db = require('../db.Singleton');

// יצירת מוצר חדש
exports.create = async (req, res) => {
  const { name, category, price, stock, imageUrl, gender } = req.body;
  let conn;

  // Input validation
  if (!name || !price || !category || !gender) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    conn = await db.getConnection();
    
    // First, get or create the category
    const [categoryResult] = await conn.execute(
      'SELECT id FROM categories WHERE name = ?',
      [category]
    );

    let categoryId;
    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].id;
    } else {
      // If category doesn't exist, create it
      const [newCategory] = await conn.execute(
        'INSERT INTO categories (name) VALUES (?)',
        [category]
      );
      categoryId = newCategory.insertId;
    }

    // Now insert the product
    const [result] = await conn.execute(
      'INSERT INTO products (ProductName, CategoryID, Price, QuantityInStock, ImageUrl, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [name, categoryId, price, stock || 0, imageUrl || '', gender]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      category: { id: categoryId, name: category }, 
      price, 
      stock: stock || 0, 
      imageUrl: imageUrl || '', 
      gender 
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Error creating product', error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// שליפת כל המוצרים עם חיפוש, מיון וסינון לפי gender
exports.findAll = async (req, res) => {
  const { category, search, gender, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  const params = [];
  let whereClause = 'WHERE 1=1';
  let conn;

  if (category) {
    whereClause += ' AND CategoryID = ?';
    params.push(category);
  }

  if (gender && gender.toLowerCase() !== 'all') {
    whereClause += ' AND gender = ?';
    params.push(gender);
  }

  if (search) {
    whereClause += ' AND ProductName LIKE ?';
    params.push(`%${search}%`);
  }

  try {
    conn = await db.getConnection();

    const [countRows] = await conn.execute(`SELECT COUNT(*) AS count FROM products ${whereClause}`, params);
    const total = countRows[0].count;

    const [products] = await conn.execute(
      `SELECT 
        ProductID as id,
        ProductName as name,
        Description as description,
        Price as price,
        QuantityInStock as stock,
        CategoryID as category,
        gender,
        ImageUrl as imageUrl
      FROM products
      ${whereClause} 
      ORDER BY ProductName
      LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const productImageMap = {
      'leggings': 'leggings.jpg',
      'sports': 'sports-bra.jpg',
      'shorts': 'everydayseamlessshorts.jpg',
      'tank': 'tanktop.jpg',
      't-shirt': 'oversizedshirt.jpg',
      'crop top': 'croptop.jpg',
      'sweatpants': 'sweatpants.jpg',
      'tanktopmen': 'tanktopmen.jpg', 
      'shirt':'shirt.jpg',
      'pantsmen':'pantsmen.jpg',
    
      
    };

    // For now, use default colors and sizes since variants tables might not exist
    const defaultColors = ['Black', 'Gray', 'Navy', 'Blue','White','Pink','Yellow','Green','Purple','Orange'];
    const defaultSizes = ['XS', 'S', 'M', 'L', 'XL'];
    
    // Create a simple mapping of product IDs to default variants
    const variantsByProduct = products.reduce((acc, product) => {
      const productId = product.id || product.ProductID;
      acc[productId] = { 
        colors: new Set(defaultColors),
        sizes: new Set(defaultSizes)
      };
      return acc;
    }, {});

    res.json({
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products: products.map(p => {
        const productId = p.id || p.ProductID;
        const productName = (p.name || '').toLowerCase();
        let imageFile = 'placeholder.jpg';
        
        // Find matching image from the map
        for (const [key, value] of Object.entries(productImageMap)) {
          if (productName.includes(key)) {
            imageFile = value;
            break;
          }
        }
        
        const finalImageUrl = imageFile !== 'placeholder.jpg' ? `/images/products/${imageFile}` :
          (p.imageUrl ? `/images/products/${p.imageUrl}` : '/images/products/placeholder.jpg');

        // Get unique colors and sizes from variants, or use defaults
        const productVariants = variantsByProduct[productId] || { colors: new Set(), sizes: new Set() };
        const uniqueColors = Array.from(productVariants.colors);
        const uniqueSizes = Array.from(productVariants.sizes);

        return {
          ...p,
          id: productId,
          name: p.name || p.ProductName,
          price: parseFloat(p.price || p.Price) || 0,
          description: p.description || p.Description || '',
          ImageUrl: finalImageUrl,
          rating: 4.5,
          isNew: Math.random() > 0.7, // 30% chance of being marked as new
          colors: uniqueColors.length > 0 ? uniqueColors : ['Black', 'Gray', 'Navy', 'Blue'],
          sizes: uniqueSizes.length > 0 ? uniqueSizes : ['XS', 'S', 'M', 'L', 'XL']
        };
      })
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// שליפת מוצר לפי מזהה
exports.findOne = async (req, res) => {
  const id = req.params.id;
  let conn;

  try {
    conn = await db.getConnection();
    const [rows] = await conn.execute(
      `SELECT 
        ProductID as id,
        ProductName as name,
        Description as description,
        Price as price,
        QuantityInStock as stock,
        CategoryID as category,
        gender,
        ImageUrl as imageUrl
      FROM products WHERE ProductID = ?`, 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = rows[0];
    res.json({
      ...product,
      image: product.imageUrl || '/images/products/' + product.id + '.jpg',
      colors: ['Black', 'Gray', 'Blue'],
      sizes: ['S', 'M', 'L', 'XL'],
      rating: 4.5
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// עדכון מוצר
exports.update = async (req, res) => {
  const { name, category, price, stock, imageUrl, gender } = req.body;
  const id = req.params.id;
  let conn;

  try {
    conn = await db.getConnection();

    const [result] = await conn.execute(
      'UPDATE products SET ProductName = ?, CategoryID = ?, Price = ?, QuantityInStock = ?, ImageUrl = ?, gender = ? WHERE ProductID = ?',
      [name, category, price, stock, imageUrl, gender, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'לא ניתן לעדכן את המוצר.' });
    }

    res.json({ message: 'המוצר עודכן בהצלחה.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// מחיקת מוצר
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  let conn;

  try {
    conn = await db.getConnection();

    const [result] = await conn.execute('DELETE FROM products WHERE ProductID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'לא ניתן למחוק את המוצר.' });
    }

    res.json({ message: 'המוצר נמחק בהצלחה!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) conn.release();
  }
};
