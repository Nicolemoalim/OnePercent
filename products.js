const express = require('express');
const router = express.Router();
const db = require('../db.Singleton');

// קבלת כל המוצרים
router.get('/', async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת המוצרים', error: error.message });
    }
});

// קבלת מוצר לפי מזהה
router.get('/:id', async (req, res) => {
    try {
        const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'מוצר לא נמצא' });
        }
        res.json(product[0]);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת המוצר', error: error.message });
    }
});

// הוספת מוצר חדש
router.post('/', async (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, category, image_url]
        );
        res.status(201).json({ id: result.insertId, message: 'מוצר נוסף בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בהוספת המוצר', error: error.message });
    }
});

// עדכון מוצר
router.put('/:id', async (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
            [name, description, price, category, image_url, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'מוצר לא נמצא' });
        }
        res.json({ message: 'מוצר עודכן בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בעדכון המוצר', error: error.message });
    }
});

// מחיקת מוצר
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'מוצר לא נמצא' });
        }
        res.json({ message: 'מוצר נמחק בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה במחיקת המוצר', error: error.message });
    }
});

module.exports = router;