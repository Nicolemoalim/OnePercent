import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishlistButton = ({ productId, size = 'md' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:3001/api/wishlist/check/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(response.data.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [productId]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await axios.delete(`http://localhost:3001/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('המוצר הוסר מהמועדפים');
      } else {
        await axios.post(
          'http://localhost:3001/api/wishlist',
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('המוצר נוסף למועדפים');
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('אירעה שגיאה בעדכון המועדפים');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`wishlist-button ${sizeClasses[size]} flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 ${
        isInWishlist 
          ? 'text-red-500 hover:bg-red-50' 
          : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
      }`}
      aria-label={isInWishlist ? 'הסר ממועדפים' : 'הוסף למועדפים'}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default WishlistButton;
