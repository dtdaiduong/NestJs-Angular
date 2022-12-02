select o.id as order_id, u.id as user_id, p.firstname,
			o.total_price, 
			o.create_at,
			o.update_at,
			o.status 
from ((orders o inner join users u on o.user_id = u.id)
		inner join profiles p on u.profile_id = p.id)
{x}
;
