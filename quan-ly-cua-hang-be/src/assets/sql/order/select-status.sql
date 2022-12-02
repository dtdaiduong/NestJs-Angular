select o.status
from orders o 
where o.id = $1;