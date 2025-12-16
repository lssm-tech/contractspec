select pg_terminate_backend(pid) from pg_stat_activity where datname='<db-name>';
DROP DATABASE zerohealth;
CREATE DATABASE zerohealth;
