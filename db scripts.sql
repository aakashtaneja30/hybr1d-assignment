
CREATE TABLE users_1 (
	id varchar(36) NOT NULL ,
	full_name varchar(100) NULL,
  username varchar(150) NOT NULL,
	email varchar(150) NOT NULL UNIQUE, #UNIQUE
  role ENUM('seller', 'buyer') DEFAULT 'seller',
	PRIMARY KEY (id)
);

CREATE TABLE user_credentials_1 (
	id varchar(36) NOT NULL ,
  password varchar(255) NOT NULL,
  salt varchar(255) NOT NULL,
	email varchar(150) NOT NULL UNIQUE, #UNIQUE
	PRIMARY KEY (id),
  FOREIGN KEY (email) REFERENCES users_1(email) ON DELETE CASCADE
);


CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
	seller_id VARCHAR(36),
	FOREIGN KEY (seller_id) REFERENCES users_1(id) ON DELETE CASCADE,
	name varchar(50) NOT NULL,
	picture_url varchar(50) NULL
);


CREATE TABLE orders (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255)NOT NULL,
  placed_at timestamp DEFAULT current_timestamp ,
  buyer_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (buyer_id) REFERENCES users_1(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users_1(id) ON DELETE CASCADE
);

CREATE TABLE order_product (
  id VARCHAR(36) PRIMARY KEY,
	order_id VARCHAR(36),
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(36),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
