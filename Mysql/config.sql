-- MySQL Configuration Script
select version() as mysql_version;
select @@global.sql_mode as global_sql_mode, @@session.sql_mode as session_sql_mode;