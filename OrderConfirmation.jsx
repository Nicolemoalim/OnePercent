import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('אירעה שגיאה בטעינת פרטי ההזמנה');
      setLoading(false);
    }
  };

  if (loading) return <div>טוען...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div>הזמנה לא נמצאה</div>;

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <h2>תודה על הזמנתך!</h2>
        <p>מספר הזמנה: {order.id}</p>
      </div>
      
      <div className="order-details">
        <h3>פרטי ההזמנה</h3>
        <div className="items-list">
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>כמות: {item.quantity}</p>
                <p>מחיר: {item.price} ₪</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="order-summary">
          <p><strong>סה"כ לתשלום: {order.totalAmount} ₪</strong></p>
        </div>

        <div className="shipping-details">
          <h3>פרטי משלוח</h3>
          <p>{order.firstName} {order.lastName}</p>
          <p>{order.address}</p>
          <p>{order.city}, {order.zipCode}</p>
          <p>{order.phone}</p>
          <p>{order.email}</p>
        </div>
      </div>

      <div className="confirmation-footer">
        <p>אישור ההזמנה נשלח לכתובת המייל שלך</p>
        <Link to="/products" className="continue-shopping">
          המשך בקניות
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;