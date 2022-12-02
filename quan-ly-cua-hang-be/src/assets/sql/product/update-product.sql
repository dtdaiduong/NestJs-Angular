UPDATE products 
SET 
  name = $1, 
  description = $2, 
  price = $3, 
  image = $4 
WHERE id = $5
;