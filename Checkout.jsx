import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('אירעה שגיאה בטעינת העגלה');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/orders',
        {
          ...formData,
          items: cartItems,
          totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      setError('אירעה שגיאה ביצירת הזמנה');
    }
  };

  if (loading) return <div>טוען...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (cartItems.length === 0) return <div>העגלה ריקה</div>;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout-container">
      <h2>תשלום</h2>
      <div className="order-summary">
        <h3>סיכום הזמנה</h3>
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name}</span>
            <span>{item.quantity} x {item.price} ₪</span>
          </div>
        ))}
        <div className="total">
          <strong>סה"כ: {total} ₪</strong>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <h3>פרטי משלוח</h3>
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="שם פרטי"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="שם משפחה"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="דואר אלקטרוני"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="טלפון"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            placeholder="כתובת"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="city"
            placeholder="עיר"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="מיקוד"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        <h3>פרטי תשלום</h3>
        <div className="form-group">
          <input
            type="text"
            name="cardNumber"
            placeholder="מספר כרטיס"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-order">
          אישור הזמנה
        </button>
      </form>
    </div>
  );
}

export default Checkout;