UPDATE vehicles
SET ownerid = NULL
WHERE id = $1
