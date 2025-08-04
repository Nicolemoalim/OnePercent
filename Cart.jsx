import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('אירעה שגיאה בטעינת העגלה');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/cart/${productId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchCart();
    } catch (err) {
      setError('אירעה שגיאה בעדכון הכמות');
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.post(
        'http://localhost:3001/api/cart',
        {
          productId: product.id,
          quantity: 1,
          color: product.color || 'Default',
          size: product.size || 'M'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      fetchCart();
    } catch (err) {
      setError('אירעה שגיאה בהוספת המוצר לעגלה');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      setError('אירעה שגיאה בהסרת המוצר');
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div>טוען...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>עגלת קניות</h2>
      {cartItems.length === 0 ? (
        <p>העגלה ריקה</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <p className="item-price">{item.price} ₪</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-buttons">
                      <button
                        className="add-another"
                        onClick={() => addToCart(item)}
                      >
                        הוסף עוד
                      </button>
                      <button
                        className="remove-item"
                        onClick={() => removeItem(item.id)}
                      >
                        הסר
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>סיכום הזמנה</h3>
            <p>סה"כ: {total} ₪</p>
            <button
              className="checkout-button"
              onClick={proceedToCheckout}
            >
              המשך לתשלום
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;