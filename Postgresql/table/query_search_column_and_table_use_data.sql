-- Query untuk mencari "user:" di semua kolom text dalam schema public
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND (
    most_common_vals::text LIKE '%irsyad%' 
    OR histogram_bounds::text LIKE '%irsyad%'
);