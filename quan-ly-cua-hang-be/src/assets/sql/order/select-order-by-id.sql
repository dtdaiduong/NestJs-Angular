select o.id, o.user_id, p."firstname",
			(
				select array_to_json(array_agg(p)) as product
				from (
					select p.id, p."name", od.quantity, od.price, (od.price * od.quantity) as "subprice"  
					from products p 
					inner join order_detail od on od.product_id = p.id
					where od.order_id = o.id 
				) p
			),
			o.total_price, 
			o.create_at,
			o.update_at,
			o.status 
from ((orders o inner join users u on o.user_id = u.id)
		inner join profiles p on u.profile_id = p.id )
where o.id = $1;