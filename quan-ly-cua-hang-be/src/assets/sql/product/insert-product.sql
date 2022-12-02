INSERT INTO 
  public.products ("name", description, price, image)
VALUES ($1, $2, $3, $4) 
RETURNING id
;