SHOW max_connections;

SHOW shared_buffers;

SHOW config_file;

-- version information
select version();

-- check history of queries

SELECT pid, usename, query, state_change
FROM pg_stat_activity
WHERE query_start > NOW() - INTERVAL '12 hour'
ORDER BY query_start DESC;


"RIDENID" IN ('IRI-2370','IRI-2369','IRI-2368')


"INVULID"::uuid = '2b1aa284-c9b4-4e49-9af1-9795bc2d64cf'::uuid OR "INVULID" = '44a2bfdd-d2d1-4403-8e86-b55cdcd0dced'::uuid OR "INVULID" = '53bd7609-cff6-4571-9d1b-62db85f883fe'::uuid AND ("RISKCD" ~ 'CIS' and "PRD" = '2025-12-31' and "VRSN" = 0)
"INTHRID" ::uuid = '1819f291-4b9c-4815-a1db-b2d6e28890ad'::uuid OR "INTHRID" = 'b135ded3-3403-4173-b6a4-6276c1f42f01'::uuid OR "INTHRID" = '445483ee-6965-4597-b49f-bf90f0e17391'::uuid 

-- check for idle transactions

SELECT query, state, usename, application_name, client_addr, backend_start
FROM pg_stat_activity
WHERE query_start > NOW() - INTERVAL '12 hour'
ORDER BY query_start DESC;


-- check inforrmation for disabled trigger
SELECT 
    t.tgname AS trigger_name,
    n.nspname AS schema_name,
    c.relname AS table_name,
    t.tgenabled AS enabled_status
FROM 
    pg_trigger t
JOIN 
    pg_class c ON t.tgrelid = c.oid
JOIN 
    pg_namespace n ON c.relnamespace = n.oid
WHERE 
    NOT t.tgisinternal -- untuk menghindari trigger sistem
    AND n.nspname = 'nama_schema'; -- ganti dengan nama schema kamu
