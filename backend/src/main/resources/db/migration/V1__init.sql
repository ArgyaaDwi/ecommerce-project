CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        session_key VARCHAR(255),
        product_preference VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    product_categories (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);

CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        description VARCHAR(500),
        category_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories (id) ON DELETE SET NULL
    );

CREATE TABLE
    user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_user_preferences_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

CREATE TABLE
    product_promotions (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        description VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        CONSTRAINT fk_product_promotions_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

CREATE TABLE
    user_promotions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_promotion_id INTEGER NOT NULL,
        is_seen BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_promotions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_user_promotions_promotion FOREIGN KEY (product_promotion_id) REFERENCES product_promotions (id) ON DELETE CASCADE
    );