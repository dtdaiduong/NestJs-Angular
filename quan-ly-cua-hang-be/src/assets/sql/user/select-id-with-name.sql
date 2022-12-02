SELECT
	u.id
FROM
	users u,
	profiles p
WHERE
	u.profile_id = p.id
	AND p.firstname ILIKE $1
GROUP BY
	u.id
ORDER BY
	u.id ASC
;