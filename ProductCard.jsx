import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ 
  id, 
  name, 
  price, 
  imageUrl, 
  colors = [], 
  sizes = [],
  isNew = false,
  onColorSelect,
  onSizeSelect
}) => {
  // Default colors and sizes if not provided
  const availableColors = colors.length > 0 ? colors : ['Black', 'Gray', 'Navy', 'Blue'];
  const availableSizes = sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L', 'XL'];
  
  // State for selected color and size
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '');
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '');
  
  // Handle color selection
  const handleColorClick = (color) => {
    setSelectedColor(color);
    if (onColorSelect) onColorSelect(color);
  };
  
  // Handle size selection
  const handleSizeClick = (size) => {
    setSelectedSize(size);
    if (onSizeSelect) onSizeSelect(size);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/products/${id}`} className="product-link">
          <div className="product-image">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name || 'Product'}
              onError={(e) => {
                e.target.src = '/placeholder.svg';
                e.target.onerror = null;
              }}
              loading="lazy"
            />
          </div>
        </Link>
        {isNew && <span className="new-badge">New</span>}
      </div>
      
      <div className="product-info">
        <Link to={`/products/${id}`} className="product-link">
          <h3 className="product-name">{name}</h3>
          <p className="product-price">${price ? price.toFixed(2) : '0.00'}</p>
        </Link>
        
        <div className="product-options">
          {availableColors.length > 0 && (
            <div className="color-options">
              {availableColors.slice(0, 4).map((color, index) => {
                const colorValue = color.toLowerCase();
                return (
                  <span 
                    key={index} 
                    className={`color-swatch ${selectedColor === color ? 'selected' : ''}`} 
                    style={{ 
                      backgroundColor: colorValue === 'white' ? '#fff' : colorValue,
                      border: colorValue === 'white' ? '1px solid #ddd' : 'none'
                    }}
                    title={color}
                    onClick={() => handleColorClick(color)}
                  />
                );
              })}
              {availableColors.length > 4 && (
                <span className="color-more">+{availableColors.length - 4} more</span>
              )}
            </div>
          )}
          
          {availableSizes.length > 0 && (
            <div className="size-options">
              {availableSizes.map((size, index) => (
                <span 
                  key={index} 
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
