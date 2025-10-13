
SELECT 
    n.nspname AS schema,
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prokind = 'f'  -- hanya function biasa
  AND pg_get_functiondef(p.oid) ILIKE '%DELETE%';
-- You can change 'DELETE' to any keyword you want to search for in function definitions
-- and 'public' to the desired schema if needed.


--  add funtios 
-- add column trigger with relations funtions

SELECT 
    n.nspname AS schema,
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS definition,
    t.tgname AS trigger_name,
    c.relname AS table_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
LEFT JOIN pg_trigger t ON t.tgfoid = p.oid
LEFT JOIN pg_class c ON t.tgrelid = c.oid
WHERE p.prokind = 'f'  -- hanya function biasa
  AND pg_get_functiondef(p.oid) ILIKE '%try_max%'
ORDER BY schema, function_name;
-- You can change 'try_max' to any keyword you want to search for in function definitions
-- and 'public' to the desired schema if needed.