SELECT
	u.id
FROM
	users u,
	profiles p,
	user_role ur
WHERE
	(u.id = ur.user_id)
	AND (u.profile_id = p.id)
	AND (p.firstname ILIKE $1
		AND ur.role_id = ANY($2::int[]) )
GROUP BY
	u.id
ORDER BY
	u.id ASC;