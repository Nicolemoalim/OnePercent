import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import './Products.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Products({ gender: propGender }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  const fetchProducts = async (gender) => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: { gender }
      });

      const mapped = (response.data.products || []).map(product => {
        const imageUrl = product.imageUrl || product.ImageUrl || 
          `/images/products/${(product.ProductName || '').toLowerCase().replace(/\s+/g, '-')}.jpg`;
        const cleanImageUrl = imageUrl.startsWith('http') ? imageUrl : `/${imageUrl.replace(/^\/+|\/+$/g, '')}`;

        return {
          id: product.id || product.ProductID,
          name: product.name || product.ProductName || 'Unnamed',
          price: parseFloat(product.price || product.Price) || 0,
          description: product.description || product.Description || '',
          imageUrl: cleanImageUrl,
          colors: Array.isArray(product.colors) ? product.colors : 
                 (product.colors ? product.colors.split(',').map(c => c.trim()) : []),
          sizes: Array.isArray(product.sizes) ? product.sizes :
                (product.sizes ? product.sizes.split(',').map(s => s.trim()) : []),
          isNew: product.isNew || false
        };
      });

      setProducts(mapped);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const genderFromUrl = searchParams.get('gender');
    const gender = genderFromUrl || propGender || 'all';
    fetchProducts(gender);
  }, [propGender, location.search, location.pathname]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-page">
      <h2 style={{ textTransform: 'uppercase' }}>
        {propGender ? `${propGender} Products` : 'All Products'}
      </h2>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              colors={product.colors}
              sizes={product.sizes}
              isNew={product.isNew}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default Products;
