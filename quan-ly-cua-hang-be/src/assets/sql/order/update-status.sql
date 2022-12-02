UPDATE orders SET status = 'payment'
where id = $1;