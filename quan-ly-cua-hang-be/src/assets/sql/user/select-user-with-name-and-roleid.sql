SELECT
	u.id,
	u.email,
	p.firstname,
	p.lastname,
	p.phone,
	p.address,
	(
	SELECT
		array_to_json(array_agg(r)) AS roles
	FROM
		(
		SELECT
			r.id,
			r."name"
		FROM
			roles r
		INNER JOIN user_role ur ON
			r.id = ur.role_id
		WHERE
			ur.user_id = u.id
    ) r
  ),
	u.created_at,
	u.updated_at
FROM
	users u, user_role ur, profiles p 
{condition}
GROUP BY
	u.id,
	p.firstname,
	u.email,
	p.firstname,
	p.lastname,
	p.phone,
	p.address
