insert into public.orders (user_id, total_price) 
values($1, $2) RETURNING id;