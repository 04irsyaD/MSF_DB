--  documentations user GUIDE 1 databae 1 user
--  CREATE USER statement

CREATE USER user_db WITH PASSWORD 'passwordku';

-- GRANTING PRIVILEGES
-- Grant all privileges on a specific database to the user

GRANT ALL PRIVILEGES ON DATABASE dbdev TO userdb;

--  block exept database connection
-- revoke datatabase connection besides the required database

REVOKE CONNECT ON DATABASE db_test FROM user_db;
REVOKE CONNECT ON DATABASE db_prod FROM user_db;

-- grant connection on the required database
-- GRANT CONNECT ON DATABASE dbdev TO user_db;
GRANT ALL ON SCHEMA public TO user_db;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_db;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user_db;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO user_db;

-- to ensure that the user has the same privileges on any new objects created in the future within the specified schema, you can set default privileges:
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO user_db;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO user_db;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON FUNCTIONS TO user_db;





