SELECT u.*
FROM users u
WHERE u.email = $1
;