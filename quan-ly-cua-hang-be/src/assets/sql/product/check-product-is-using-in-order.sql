SELECT od.product_id 
FROM order_detail od
WHERE od.product_id = $1;