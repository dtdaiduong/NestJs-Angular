update orders o 
set total_price = (select sum(od.price*od.quantity)
from order_detail od
where od.order_id = $1)
where o.id = $1;