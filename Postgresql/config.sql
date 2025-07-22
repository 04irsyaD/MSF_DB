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

-- check for idle transactions

SELECT query, state, usename, application_name, client_addr, backend_start
FROM pg_stat_activity
WHERE query_start > NOW() - INTERVAL '12 hour'
ORDER BY query_start DESC;