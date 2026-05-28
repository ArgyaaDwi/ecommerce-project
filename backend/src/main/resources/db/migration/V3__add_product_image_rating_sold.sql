ALTER TABLE products
    ADD COLUMN image_url VARCHAR(500),
    ADD COLUMN rating FLOAT,
    ADD COLUMN sold INTEGER;

UPDATE products
SET
    image_url = 'https://picsum.photos/seed/product-' || id || '/600/600',
    rating = 3.5 + ((id % 15)::FLOAT / 10),
    sold = (id * 7) % 200;
