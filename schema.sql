DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
    item_id INT(100) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DOUBLE(10,2) NULL,
    stock_quantity INT(100) NULL,
    units_ordered INT(100) NULL,
    PRIMARY KEY (item_id)
);

SELECT *
FROM products;
