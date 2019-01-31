-- DROP DATABASE IF EXISTS bamazon;
-- CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NULL,
department_name VARCHAR(50) NULL,
price DECIMAL (10,2) NULL,
stock INT NULL,
PRIMARY KEY (id) 
);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ("Fender Stratocaster", "Musical Instruments", 399.99, 10),
("Gibson Les Paul", "Musical Instruments", 799.99, 8),
("Ibanez RG", "Musical Instruments", 699.99, 2),
("Marshall JCM 800", "Amplifiers & Effects", 999.99, 4),
("Fender Dual Showman", "Amplifiers & Effects", 799.99, 3),
("Peavey Practice Amp", "Amplifiers & Effects", 49.99, 15),
("Electro-Harmonix Big Muff", "Amplifiers & Effects", 80.99, 3),
("Boss DS-1", "Amplifiers & Effects", 49.99, 6),
("Boss Metal Zone", "Amplifiers & Effects", 59.99, 100),
("Guitar Picks", "Accessories", 4.99, 500),
("Guitar Strap", "Accessories", 19.99, 25),
("Marshall Stack Fridge", "Novelties", 79.99, 1300),
("Gibson #1 Fan Hat", "Novelties", 14.59, 1);

SELECT * FROM products LIMIT 5000;
