CREATE DATABASE IF NOT EXISTS onepercentdb;

USE onepercentdb;

CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) DEFAULT NULL,  -- 🔐 plain text password (for dev only)
  role ENUM('user', 'admin') DEFAULT 'user',
  first_name VARCHAR(50) DEFAULT NULL,
  last_name VARCHAR(50) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE customer (
  CustomerID INT(11) NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) DEFAULT NULL,
  LastName VARCHAR(50) DEFAULT NULL,
  Email VARCHAR(100) DEFAULT NULL,
  Address VARCHAR(255) DEFAULT NULL,
  Phone VARCHAR(20) DEFAULT NULL,
  City VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (CustomerID)
);



CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);

CREATE TABLE products (
  ProductID INT AUTO_INCREMENT PRIMARY KEY,
  ProductName VARCHAR(100) NOT NULL,
  Description TEXT,
  Price DECIMAL(10,2) NOT NULL,
  QuantityInStock INT DEFAULT 0,
  CategoryID INT,
  ImageUrl VARCHAR(255),
  FOREIGN KEY (CategoryID) REFERENCES categories(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE orders (
  id INT(11) NOT NULL AUTO_INCREMENT,
  userId INT(11) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  totalAmount DECIMAL(10,2) NOT NULL,
  shippingAddress TEXT NOT NULL,
  paymentStatus ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  PRIMARY KEY (id),
  KEY (userId)
);



CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE TABLE orderdetail (
  OrderDetailID INT(11) NOT NULL AUTO_INCREMENT,
  OrderID INT(11),
  ProductID INT(11),
  Quantity INT(11),
  UnitPrice DECIMAL(10,2),
  PRIMARY KEY (OrderDetailID),
  KEY (OrderID),
  KEY (ProductID),
  FOREIGN KEY (OrderID) REFERENCES orders(id),
  FOREIGN KEY (ProductID) REFERENCES product(ProductID)
);

CREATE TABLE product_category (
  CategoryID INT(11) NOT NULL AUTO_INCREMENT,
  CategoryName VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (CategoryID)
);

CREATE TABLE product_variants (
  VariantID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID INT NOT NULL,
  ColorID INT,
  SizeID INT,
  SKU VARCHAR(100),
  QuantityInStock INT DEFAULT 0,
  PriceAdjustment DECIMAL(10,2) DEFAULT 0.00,
  ImageURL VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

