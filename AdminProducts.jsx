import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    imageUrl: '', 
    gender: 'women', 
    category: '',
    stock: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:3001/api/products');
      setProducts(res.data.products || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingId) {
        await axios.put(
          `http://localhost:3001/api/products/${editingId}`, 
          { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) },
          { headers }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/products', 
          { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) },
          { headers }
        );
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:3001/api/products/${id}`, { headers });
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      price: product.price || '',
      imageUrl: product.imageUrl || '',
      gender: product.gender || 'women',
      category: product.category || '',
      stock: product.stock || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ 
      name: '', 
      price: '', 
      imageUrl: '', 
      gender: 'women', 
      category: '',
      stock: 0 
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-container">
      <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Product Name</label>
          <input 
            type="text" 
            name="name" 
            value={form.name}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Price ($)</label>
            <input 
              type="number" 
              name="price" 
              value={form.price}
              onChange={handleChange} 
              step="0.01"
              min="0"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Stock</label>
            <input 
              type="number" 
              name="stock" 
              value={form.stock}
              onChange={handleChange} 
              min="0"
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input 
              type="text" 
              name="category" 
              value={form.category}
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Gender</label>
            <select 
              name="gender" 
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input 
            type="url" 
            name="imageUrl" 
            value={form.imageUrl}
            onChange={handleChange} 
            placeholder="https://example.com/image.jpg"
          />
          {form.imageUrl && (
            <div className="image-preview">
              <img 
                src={form.imageUrl} 
                alt="Preview" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="products-list">
        <h3>All Products</h3>
        {isLoading && products.length === 0 ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.gender}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="btn-edit"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="btn-delete"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
