SELECT 
  p.id, 
  p."name", 
  p.description, 
  p.price,
  p.image,
  (
    SELECT array_to_json(array_agg(c)) AS category
    FROM 
    (
      SELECT 
        c.id, 
        c."name" 
      FROM categories c INNER JOIN product_category pc 
        ON c.id = pc.category_id 
      WHERE pc.product_id = p.id
    ) c
  ), 
  p.created_at, 
  p.updated_at
FROM products p 
{condition}
