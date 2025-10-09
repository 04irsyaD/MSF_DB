
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
