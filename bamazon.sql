CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NULL,
price DECIMAL (10,2) NULL,
stock_quantity INT NULL
PRIMARY KEY (id) 
);
