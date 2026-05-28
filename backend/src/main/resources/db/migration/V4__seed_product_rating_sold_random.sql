UPDATE products
SET
    rating = CASE
        WHEN rating IS NULL THEN 3.0 + (random() * 2.0)
        ELSE rating
    END,
    sold = CASE
        WHEN sold IS NULL THEN (random() * 500)::INTEGER
        ELSE sold
    END
WHERE rating IS NULL OR sold IS NULL;
