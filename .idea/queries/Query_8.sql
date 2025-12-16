DROP SCHEMA if exists public CASCADE;
DROP SCHEMA if exists extensions CASCADE;
CREATE SCHEMA public;
CREATE SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "vector";
ALTER DATABASE zerohealth SET search_path = public, extensions;