-- Create Database
CREATE DATABASE IF NOT EXISTS campusbites;
USE campusbites;

-- Disable checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ================= USERS =================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

INSERT INTO users VALUES
(1,'user1','user1@gmail.com','$2b$10$kwbs1aT7sQJxgsxSwAKuLutVxOxipJSDR/sXwzPlLgXrQvDxRU6rC','user'),
(2,'user2','user2@gmail.com','$2b$10$K83/jCEOm/hZf8jMRaQ7sOkA9SdZ5CLO6wg7kaKaMF2XBCOIJje7m','user'),
(3,'user3','user3@gmail.com','$2b$10$K2dk.8Jk8.BgWNmdefIm3OtuFYJK9ffp9XXIeMmzm6xxUQsASGfF.','user');

-- ================= ADMINS =================
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100),
  password VARCHAR(255),
  role VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username (username)
);

INSERT INTO admins VALUES
(1,'admin','$2b$10$uU5Z2k4T7XI4eBiHpGx/B.QZU/jxEdn8Vwue1dRP2khlbJf6EI3oC','admin');

-- ================= SHOPS =================
DROP TABLE IF EXISTS shops;
CREATE TABLE shops (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  type ENUM('veg','nonveg'),
  rating FLOAT DEFAULT 0,
  image_url VARCHAR(255),
  PRIMARY KEY (id)
);

INSERT INTO shops VALUES
(1,'Bunker','veg',3,'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'),
(4,'Zaika','veg',5,'https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
(5,'Punjabi Rasoi','veg',1,'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600'),
(6,'Rock & Roll','nonveg',4,'https://images.unsplash.com/photo-1553621042-f6e147245754'),
(9,'Parantha House','veg',5,'http://localhost:5000/uploads/1775672814332-parantha.webp'),
(10,'Dominos','nonveg',5,'http://localhost:5000/uploads/1775673103697-Dominos.avif'),
(11,'Italiano Pizza','nonveg',5,'http://localhost:5000/uploads/1775673222211-Italiano.webp'),
(12,'Catch Up Cafe','nonveg',0,'http://localhost:5000/uploads/1775746882043-catch up cafe.avif');

-- ================= MENU ITEMS =================
DROP TABLE IF EXISTS menu_items;
CREATE TABLE menu_items (
  id INT NOT NULL AUTO_INCREMENT,
  shop_id INT,
  item_name VARCHAR(100),
  price INT,
  PRIMARY KEY (id),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

INSERT INTO menu_items VALUES
(1,1,'Samosa',20),
(3,4,'Full Thali',100),
(4,5,'Chole Bhature',120),
(5,6,'Egg Roll',50),
(6,5,'Samosa',30),
(7,5,'fried Rice',120),
(8,5,'chicken fried rice',150),
(9,5,'Masala Maggi',40),
(10,9,'Aloo Parantha',60),
(11,10,'Cheese Pizza',150),
(12,10,'Coca Cola',40),
(13,11,'Italian Delight',120);

-- ================= FAVORITES =================
DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  shop_id INT,
  PRIMARY KEY (id),
  UNIQUE KEY user_shop (user_id, shop_id)
);

INSERT INTO favorites VALUES
(8,1,4),(9,1,6),(5,2,4),(6,2,6),
(7,2,11),(10,3,4),(12,3,6),(11,3,9);

-- ================= FAVORITE ITEMS =================
DROP TABLE IF EXISTS favorite_items;
CREATE TABLE favorite_items (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  item_id INT,
  PRIMARY KEY (id)
);

-- ================= ITEM RATINGS =================
DROP TABLE IF EXISTS item_ratings;
CREATE TABLE item_ratings (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  item_id INT,
  rating INT,
  PRIMARY KEY (id),
  CHECK (rating BETWEEN 1 AND 5)
);

-- ================= REVIEWS =================
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  shop_id INT NOT NULL,
  username VARCHAR(100),
  review_text TEXT,
  rating INT,
  review_date DATE DEFAULT (CURDATE()),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_daily_review (user_id, shop_id, review_date),
  CHECK (rating >= 1 AND rating <= 5)
);

INSERT INTO reviews VALUES
(4,2,5,'user2','good',1,'2026-04-03','2026-04-03 09:36:41'),
(8,2,1,'user2','not good',1,'2026-04-03','2026-04-03 09:54:53'),
(14,1,1,'user1','nice',3,'2026-04-08','2026-04-08 14:49:02'),
(15,1,6,'user1','good',3,'2026-04-08','2026-04-08 14:51:17'),
(16,2,6,'user2','good',5,'2026-04-08','2026-04-08 14:56:32'),
(17,2,4,'user2','excellent',5,'2026-04-08','2026-04-08 14:57:29'),
(18,1,9,'user1','good',5,'2026-04-08','2026-04-08 18:28:07'),
(19,2,9,'user2','excellent !!!',5,'2026-04-08','2026-04-08 18:29:11'),
(20,1,4,'user1','good',5,'2026-04-09','2026-04-08 18:30:27'),
(21,1,11,'user1','good',5,'2026-04-09','2026-04-08 18:34:29'),
(22,1,10,'user1','good',5,'2026-04-09','2026-04-08 18:34:41'),
(23,2,10,'user2','good',5,'2026-04-09','2026-04-08 18:35:13'),
(24,2,11,'user2','good',5,'2026-04-09','2026-04-08 18:35:24'),
(25,2,4,'user2','nice',5,'2026-04-09','2026-04-08 18:36:11'),
(26,3,4,'user3','very good',5,'2026-04-09','2026-04-08 18:37:05'),
(27,1,1,'user1','wonderful food',5,'2026-04-09','2026-04-09 14:40:58');

-- ================= USER ACTIVITY =================
DROP TABLE IF EXISTS user_activity;
CREATE TABLE user_activity (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  shop_id INT,
  clicks INT DEFAULT 1,
  last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

INSERT INTO user_activity VALUES
(1,3,1,1,'2026-04-09 14:59:11'),
(2,3,6,1,'2026-04-10 08:45:26'),
(3,3,5,1,'2026-04-10 08:45:29'),
(4,3,9,1,'2026-04-10 09:09:27'),
(5,3,4,1,'2026-04-10 09:09:33'),
(6,3,9,1,'2026-04-10 09:10:57'),
(7,3,9,1,'2026-04-10 09:11:06'),
(8,3,4,1,'2026-04-10 09:15:00'),
(9,3,9,1,'2026-04-10 09:15:03'),
(10,3,5,1,'2026-04-10 09:15:07'),
(11,3,12,1,'2026-04-10 09:15:19'),
(12,3,12,1,'2026-04-10 09:15:20');

-- Enable checks back
SET FOREIGN_KEY_CHECKS = 1;