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
	users u,
	profiles p
WHERE
	u.profile_id = p.id
	AND p.firstname ILIKE $1
GROUP BY
	u.id,
	u.email,
	p.firstname,
	p.lastname,
	p.phone,
	p.address
ORDER BY
	id ASC
  OFFSET $2
LIMIT $3