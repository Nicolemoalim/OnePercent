-- Add colors table
CREATE TABLE IF NOT EXISTS colors (
  ColorID INT AUTO_INCREMENT PRIMARY KEY,
  ColorName VARCHAR(50) NOT NULL,
  ColorCode VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add sizes table
CREATE TABLE IF NOT EXISTS sizes (
  SizeID INT AUTO_INCREMENT PRIMARY KEY,
  SizeName VARCHAR(20) NOT NULL,
  SizeDescription VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  VariantID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID INT NOT NULL,
  ColorID INT,
  SizeID INT,
  SKU VARCHAR(100) UNIQUE,
  QuantityInStock INT DEFAULT 0,
  PriceAdjustment DECIMAL(10,2) DEFAULT 0.00,
  ImageURL VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES products(ProductID) ON DELETE CASCADE,
  FOREIGN KEY (ColorID) REFERENCES colors(ColorID) ON DELETE SET NULL,
  FOREIGN KEY (SizeID) REFERENCES sizes(SizeID) ON DELETE SET NULL
);

-- Insert default colors if they don't exist
INSERT IGNORE INTO colors (ColorName, ColorCode) VALUES
  ('Black', '#000000'),
  ('White', '#FFFFFF'),
  ('Gray', '#808080'),
  ('Navy', '#000080'),
  ('Blue', '#0000FF'),
  ('Red', '#FF0000'),
  ('Green', '#008000'),
  ('Yellow', '#FFFF00'),
  ('Pink', '#FFC0CB'),
  ('Purple', '#800080');

-- Insert default sizes if they don't exist
INSERT IGNORE INTO sizes (SizeName, SizeDescription) VALUES
  ('XS', 'Extra Small'),
  ('S', 'Small'),
  ('M', 'Medium'),
  ('L', 'Large'),
  ('XL', 'Extra Large'),
  ('XXL', 'Double Extra Large');

-- Add some sample variants for existing products (adjust product IDs as needed)
-- This is just an example - you'll need to adjust the ProductID values
INSERT IGNORE INTO product_variants (ProductID, ColorID, SizeID, SKU, QuantityInStock)
SELECT 
  p.ProductID, 
  c.ColorID, 
  s.SizeID,
  CONCAT('PROD', p.ProductID, '-', c.ColorID, '-', s.SizeID) as SKU,
  FLOOR(RAND() * 50) as QuantityInStock
FROM products p
CROSS JOIN (SELECT ColorID FROM colors LIMIT 3) c
CROSS JOIN (SELECT SizeID FROM sizes LIMIT 3) s
WHERE p.ProductID IN (1, 2, 3, 4, 5) -- Adjust these product IDs as needed
LIMIT 10;

-- Add an index for better performance
CREATE INDEX idx_product_variants_product ON product_variants(ProductID);
CREATE INDEX idx_product_variants_sku ON product_variants(SKU);
