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

-- insert ADD UPDATE table prd 

CREATE TABLE public.t_form_risklist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"TFRLID" uuid DEFAULT uuid_generate_v4() NULL,
	"BUCD" varchar NULL,
	"PRD" date NULL,
	"VRSN" int4 DEFAULT 0 NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) NULL,
	"CHGBY" varchar(150) NULL,
	"X1" varchar NULL,
	"X2" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.t_grisk_notes (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"GRNID" uuid DEFAULT uuid_generate_v4() NULL,
	"RISKCD" varchar NULL,
	"PRD" date NULL,
	"VRSN" int4 NULL,
	"NIK" varchar NULL,
	"NOTES" text NULL,
	"SOURCE" varchar NULL,
	"GRILID" varchar NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_DATE NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_DATE NULL
);
