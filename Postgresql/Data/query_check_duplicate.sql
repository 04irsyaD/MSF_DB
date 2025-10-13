SELECT id, COUNT(*)
FROM t_module
GROUP BY id
HAVING COUNT(*) > 1;


-- untuk menghapus duplicate id yang sama 

DELETE FROM t_module
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM t_module
  GROUP BY id
);
