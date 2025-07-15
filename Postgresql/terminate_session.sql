 select pg_terminate_backend(pid)
 from pg_stat_activity
 where pid <> pg_backend_pid() and state = 'idle in transaction' 