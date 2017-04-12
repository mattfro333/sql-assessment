SELECT * FROM users u
JOIN vehicles v on u.id = v.ownerid
WHERE u.email = $1;
