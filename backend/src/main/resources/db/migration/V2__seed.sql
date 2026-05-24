-- Insert Product Categories
INSERT INTO
    product_categories (name)
VALUES
    ('Electronics');

INSERT INTO
    product_categories (name)
VALUES
    ('Clothing');

INSERT INTO
    product_categories (name)
VALUES
    ('Books');

INSERT INTO
    product_categories (name)
VALUES
    ('Home & Garden');

INSERT INTO
    product_categories (name)
VALUES
    ('Sports');

INSERT INTO
    product_categories (name)
VALUES
    ('Beauty');

-- Insert Products (30 products)
-- Electronics (1-5)
INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Wireless Headphones',
        299000,
        1,
        'Premium noise-canceling wireless headphones with 30-hour battery life'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'USB-C Cable',
        49000,
        1,
        'High-quality USB-C to USB-C cable with fast charging support up to 100W'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Portable Power Bank',
        159000,
        1,
        '20000mAh portable power bank with dual USB ports and LED display'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Smart Watch',
        1299000,
        1,
        'Advanced smartwatch with fitness tracking, heart rate monitor, and 5-day battery'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        '4K Webcam',
        799000,
        1,
        '4K ultra HD webcam with auto-focus and built-in microphone for video conferencing'
    );

-- Clothing (6-13)
INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Cotton T-Shirt',
        79000,
        2,
        '100% organic cotton t-shirt in classic white, available in all sizes'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Slim Fit Jeans',
        249000,
        2,
        'Stylish slim fit denim jeans with stretch fabric and modern design'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Winter Jacket',
        599000,
        2,
        'Waterproof winter jacket with thermal insulation and reflective strips'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Running Shoes',
        649000,
        2,
        'Professional running shoes with cushioned sole and breathable mesh upper'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Casual Hoodie',
        349000,
        2,
        'Comfortable cotton hoodie perfect for casual wear and outdoor activities'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Wool Sweater',
        429000,
        2,
        'Premium wool sweater with soft feel and excellent temperature regulation'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Baseball Cap',
        99000,
        2,
        'Classic adjustable baseball cap made from high-quality cotton material'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Canvas Backpack',
        279000,
        2,
        'Durable canvas backpack with multiple compartments and laptop sleeve'
    );

-- Books (14-19)
INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Clean Code',
        189000,
        3,
        'Essential guide to writing better code and software craftsmanship by Robert Martin'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Design Patterns',
        229000,
        3,
        'Classic book on reusable solutions to common programming problems'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'The Pragmatic Programmer',
        199000,
        3,
        'Practical tips and best practices for professional software development'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Atomic Habits',
        149000,
        3,
        'Transform your life with small, consistent habits and behavioral change strategies'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Data Science Handbook',
        249000,
        3,
        'Comprehensive guide to data science tools, techniques, and real-world applications'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Psychology of Money',
        159000,
        3,
        'Explore the psychology behind financial decisions and money management'
    );

-- Home & Garden (20-25)
INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'LED Table Lamp',
        129000,
        4,
        'Energy-efficient LED table lamp with adjustable brightness and warm white light'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Plant Pot Set',
        89000,
        4,
        'Set of 3 ceramic plant pots in various sizes with drainage holes'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Bed Sheet Set',
        169000,
        4,
        '100% cotton bed sheet set including pillowcases and fitted sheet'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Kitchen Knife Set',
        299000,
        4,
        'Professional 5-piece kitchen knife set with stainless steel blades and wooden block'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Coffee Maker',
        449000,
        4,
        'Programmable coffee maker with thermal carafe and brew strength control'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Shower Curtain',
        119000,
        4,
        'Waterproof polyester shower curtain with reinforced eyelets and modern patterns'
    );

-- Sports (26-28)
INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Yoga Mat',
        139000,
        5,
        'Non-slip yoga mat made from eco-friendly TPE material with carrying strap'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Dumbbell Set',
        599000,
        5,
        'Adjustable dumbbell set with weights from 2kg to 10kg and storage rack'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Bicycle Helmet',
        249000,
        5,
        'Safety certified bicycle helmet with ventilation and adjustable fit system'
    );

-- Beauty (29-30)
INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Facial Cleanser',
        79000,
        6,
        'Gentle facial cleanser suitable for all skin types with natural ingredients'
    );

INSERT INTO
    products (name, price, category_id, description)
VALUES
    (
        'Moisturizer Cream',
        99000,
        6,
        '24-hour moisturizer cream with SPF protection and anti-aging properties'
    );