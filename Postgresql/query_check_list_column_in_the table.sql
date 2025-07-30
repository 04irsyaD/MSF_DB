SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'   -- ganti dengan schema kamu
  AND table_name   = 't_users'; -- ganti dengan nama table