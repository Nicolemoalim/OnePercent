import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/products/ProductCard.css';  // or ProductDetails.css if that’s what you want


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('שגיאה בטעינת המוצר');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      await axios.post('/api/cart', {
        productId: id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('המוצר נוסף לסל בהצלחה');
    } catch (err) {
      setError('שגיאה בהוספת המוצר לסל');
    }
  };

  if (loading) return <div>טוען...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div>מוצר לא נמצא</div>;

  return (
    <div className="product-details">
      <div className="product-images">
        <img src={product.imageUrl} alt={product.name} className="main-image" />
      </div>
      
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">₪{product.price}</p>
        <p className="description">{product.description}</p>
        
        <div className="quantity-selector">
          <label>כמות:</label>
          <div className="quantity-controls">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
        </div>

        <button onClick={addToCart} className="add-to-cart-btn">
          הוסף לסל
        </button>

        <div className="product-details-grid">
          <div className="detail-item">
            <h3>משלוח</h3>
            <p>2-3 ימי עסקים</p>
          </div>
          <div className="detail-item">
            <h3>החזרות</h3>
            <p>14 יום אחריות החזרה</p>
          </div>
          <div className="detail-item">
            <h3>מלאי</h3>
            <p>{product.stock > 0 ? 'במלאי' : 'אזל מהמלאי'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;