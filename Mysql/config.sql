-- MySQL Configuration Script
select version() as mysql_version;
select @@global.sql_mode as global_sql_mode, @@session.sql_mode as session_sql_mode;


--  mysqladmin flush-hosts
FLUSH HOSTS;


-- check for max connections
SHOW VARIABLES LIKE 'max_connections';

-- fix flush hosts
    SET GLOBAL max_connections = 500;

SELECT VERSION()