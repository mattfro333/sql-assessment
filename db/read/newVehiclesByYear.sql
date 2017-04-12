SELECT * FROM vehicles v
JOIN users u on u.id = v.ownerid
WHERE year > 1999
order by year desc;
