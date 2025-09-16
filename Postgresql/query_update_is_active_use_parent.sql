-- Update the is_active status of child records based on the parent record
-- this sample data
UPDATE child c
SET is_active = p.is_active
FROM parent p
WHERE c.parent_id = p.id;

-- update Kategori
UPDATE t_sub_kategori tsk  
SET is_active = tk.is_active
FROM t_kategori tk
WHERE tsk.kategori_id  = tk.id;
