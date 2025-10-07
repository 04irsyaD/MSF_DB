-- MIGRATION FROM ERM TO PROD
-- This script migrates data from the ERM schema to the PROD schema in a PostgreSQL database.
-- Author: IRSAAD
-- Date: 2025-10-07
-- Version: 1.0
-- Note: Ensure to back up your data before running this script.
-- Note: This script is idempotent and can be run multiple times without causing duplicate entries.
-- Note: This script assumes that the target tables in the PROD schema already exist and have the same structure as those in the ERM schema.
-- Note: This script uses a versioning system to manage data updates. The version number is set to 2 for this migration.

-- Step 1: Add New Tables and columns to PROD schema

FUNCTION to PROCEDURE