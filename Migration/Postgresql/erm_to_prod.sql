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
alter Table t_gkeyidentification
ADD "CATMPL" varchar(255) DEFAULT uuid_generate_v4() NULL,
	"DVSN" varchar(255) DEFAULT NULL::character varying NULL,
	"RSCR" varchar(255) DEFAULT NULL::character varying NULL,
	"RISKTPE" varchar(255) DEFAULT NULL::character varying NULL;

alter TABLE t_gkeylist
ADD "STATCD" varchar NULL;

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


public.t_griskdatabase
ADD "CATMPL" varchar(255) DEFAULT NULL::character varying NULL,
	"RISKTPE" varchar(255) DEFAULT NULL::character varying NULL;

ALTER TABLE public.t_griskidentification
ADD "CATMPL" varchar DEFAULT uuid_generate_v4() NULL,
	"RISKTPE" varchar NULL,
	"RSCR" varchar NULL,
	"DVSN" varchar NULL;

ALTER TABLE public.t_grisklist
ADD "NIK" varchar NULL,
	"RSCR" varchar NULL,
	"DVSN" varchar NULL,
	"ALIASEQ" int4 NULL; diambil dari RISKCD jika ENDDA = 0

CREATE TABLE public.t_griskregister
	prd varchar(50) NULL,
	lihocd varchar(50) NULL,
	lihoval int4 NULL,
	imvalcd varchar(50) NULL,
	imval int4 NULL,
	inrisco int4 NULL,
	inricat varchar(50) NULL,
	exconli int4 NULL,
	exconim int4 NULL,
	adinli int4 NULL,
	adinim int4 NULL,
	adinsc int4 NULL,
	adinsccat varchar(50) NULL,
	crat varchar(50) NULL,
	vrsn int4 NULL,
	x4 varchar(50) NULL


alter TABLE t_grisktreatment
ADD "TRTSRC" varchar(50) NULL;

alter table t_ikeyidentification
ADD "RFCDGEN" varchar(255) NULL;

alter table t_ikeylist
ADD "STATCD" varchar NULL;

CREATE TABLE public.t_irisk_notes (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"IRNID" uuid DEFAULT uuid_generate_v4() NULL,
	"RISKCD" varchar NULL,
	"PRD" date NULL,
	"VRSN" int4 NULL,
	"NIK" varchar NULL,
	"NOTES" text NULL,
	"SOURCE" varchar NULL,
	"IRILID" varchar NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_DATE NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_DATE NULL
);


ALTER TABLE t_iriskidentification
ADD "CATMPL" uuid NULL,
	"STRISK" varchar(50) NULL,
	"RSCR" varchar(50) NULL;

ALTER TABLE t_irisklist 
ADD	"NIK" varchar NULL,
	"RSCR" varchar NULL,
	"DVSN" varchar NULL,
	"ALIASEQ" int4 NULL;

ALTER TABLE t_irisktreatment
ADD "TRTSRC" varchar(50) NULL;

CREATE TABLE public.t_list_grisklist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"LIGRID" uuid DEFAULT uuid_generate_v4() NULL,
	"CRAT" timestamp(6) NULL,
	"CHGDA" timestamp(6) NULL,
	"CHGBY" varchar(150) NULL,
	"BUCD" varchar(255) NULL,
	"PRD" date NULL,
	"VRSN" varchar(255) NULL,
	"RCEML" varchar(255) NULL,
	"STATCD" varchar(255) NULL,
	"X1" varchar(255) NULL,
	"X2" varchar(255) NULL,
	"X3" varchar(255) NULL,
	"X4" varchar(255) NULL,
	"X5" varchar(255) NULL,
	"X6" varchar(255) NULL,
	"X7" varchar(255) NULL
);

CREATE TABLE public.t_log_gkeylist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"LGKEYID" uuid DEFAULT uuid_generate_v4() NULL,
	"CRAT" timestamp(6) NULL,
	"CHGDA" timestamp(6) NULL,
	"CHGBY" varchar(150) NULL,
	"X1" varchar(255) NULL,
	"X2" varchar(255) NULL,
	"X3" varchar(255) NULL,
	"X4" varchar(255) NULL,
	"X5" varchar(255) NULL,
	"X6" varchar(255) NULL,
	"X7" varchar(255) NULL,
	"ENFOD" varchar(255) NULL,
	"ENFOR" varchar(255) NULL,
	"ID_GKEY" int4 NULL,
	"STATCD" varchar(255) DEFAULT NULL::character varying NULL
);

CREATE TABLE public.t_log_grisklist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"LGRLID" varchar DEFAULT uuid_generate_v4() NULL,
	"GRILID" uuid NULL,
	"RISKCD" varchar NULL,
	"PRD" date NULL,
	"VRSN" int4 NULL,
	"STATCD" varchar NULL,
	"OLSTCD" varchar NULL,
	"NOTES" text NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"X1" varchar NULL,
	"X2" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.t_log_ikeylist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"LIKEYID" uuid DEFAULT uuid_generate_v4() NULL,
	"CRAT" timestamp(6) NULL,
	"CHGDA" timestamp(6) NULL,
	"CHGBY" varchar(150) NULL,
	"X1" varchar(255) NULL,
	"X2" varchar(255) NULL,
	"X3" varchar(255) NULL,
	"X4" varchar(255) NULL,
	"X5" varchar(255) NULL,
	"X6" varchar(255) NULL,
	"X7" varchar(255) NULL,
	"ENFOD" varchar(255) NULL,
	"ENFOR" varchar(255) NULL,
	"ID_IKEY" int4 NULL,
	"STATCD" varchar(255) DEFAULT NULL::character varying NULL
);

CREATE TABLE public.t_log_treatment (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"LTREID" uuid DEFAULT uuid_generate_v4() NULL,
	"PICIDS" varchar NULL,
	"DEADLI" date NULL,
	"EVID" varchar NULL,
	"CRAT" timestamp(6) NULL,
	"CHGDA" timestamp(6) NULL,
	"CHGBY" varchar(150) NULL,
	"TRILID" varchar(255) NULL,
	"X2" varchar(255) NULL,
	"X3" varchar(255) NULL,
	"X4" varchar(255) NULL,
	"X5" varchar(255) NULL,
	"X6" varchar(255) NULL,
	"X7" varchar(255) NULL,
	"SNBUCD" varchar(255) NULL
);

CREATE TABLE public.t_multiple_categorization (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date NULL,
	"CTMCGN" uuid DEFAULT uuid_generate_v4() NULL,
	"CATCD" varchar NULL,
	"CATMPL" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" date NULL,
	"CHGBY" varchar(150) DEFAULT 'Irsyad'::character varying NULL,
	"X1" varchar NULL,
	"X2" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.t_multiple_pic_rc (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date NULL,
	"MCPID" uuid DEFAULT uuid_generate_v4() NULL,
	"PICID" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz NULL,
	"CHGBY" varchar(150) DEFAULT 'Irsyad'::character varying NULL,
	"RLMPID" varchar NULL,
	"X2" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);


alter table public.t_reviewer
add "NSTNR" varchar NULL,
	"PRD" int4 NULL;


CREATE TABLE public.t_reviewer_list (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"RVLUID" varchar DEFAULT uuid_generate_v4() NULL,
	"BUCD" varchar NULL,
	"STRL" varchar NULL,
	"RLNUM" int4 NULL,
	"PRD" int4 NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" date NULL,
	"CHGBY" varchar(150) NULL,
	"STAT" varchar DEFAULT 'Active'::character varying NULL,
	"X1" varchar NULL,
	"X2" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.t_rickchampion_list (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"RCLUID" varchar DEFAULT uuid_generate_v4() NULL,
	"BUCD" varchar NULL,
	"STRCL" varchar NULL,
	"RCLNUM" int4 NULL,
	"PRD" int4 NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" date NULL,
	"CHGBY" varchar(150) NULL,
	"STAT" varchar DEFAULT 'Active'::character varying NULL,
	"RCHNM" varchar NULL,
	"RCHEML" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);




alter table t_risk_champion 
add "NSTRC" varchar NULL,
	"CDTR" bool NULL,
	"PRD" int4 NULL;

alter table public.t_risknotes
add "STAT" varchar NULL;


alter Table t_risk_owner
add "NSTRO" varchar NULL,  [SREG16 TGRISLIST BUCD = SRO = 4, SREG 1/2 = SRO1 , ENDDA =  CURENTTIME = SREG1, NONACTIVE SRO3] EXept SRO2z

GRIREGISTER BUCD = PRD { STATUS SRO1 =  HREG 1, SRO4 = HREG 5}

	"PRD" int4 NULL;


UPDATE nama_tabel
SET statt = CASE
    WHEN stcd IN ('CAT-5', 'CAT-6') THEN 'RI-1'
    WHEN stcd = 'CAT-3' THEN 'RI-2'
    ELSE statt  -- biar nilai lama tetap kalau tidak sesuai kondisi
END;


UPDATE t_riskowner  p
SET "NSTRO" = case
	WHEN p."ENDDA" <> DATE '2999-01-01' THEN 'SRO-3'
    WHEN p."STAT" <> 'Active' THEN 'SRO-3'
    WHEN EXISTS (
        SELECT 1
        FROM t_riskregisterstatus c
        WHERE c."BUCD" = p."BUCD"
          AND DATE_PART('year', c."BEGDA") = DATE_PART('year', p."BEGDA")
          AND c."STATCD" = 'HREG-5'
    ) THEN 'SRO-4'
     WHEN EXISTS (
        SELECT 1
        FROM t_riskregisterstatus c
         WHERE c."BUCD" = p."BUCD"
          AND DATE_PART('year', c."BEGDA") = DATE_PART('year', p."BEGDA")
          AND c."STATCD" = 'HREG-1'
    ) THEN 'SRO-1'
    ELSE 'SR0-2'
end
WHERE DATE_PART('year', p."BEGDA") = 2024;


UPDATE t_riskowner
SET "PRD" = EXTRACT(YEAR from "BEGDA")::INT
WHERE DATE_PART('year', p."BEGDA") = 2024;


RS1
RISKTYPE RI 2 NULL
CAT5 dan CAT6 diisi RI 1
CAT3 = RI 1 atau RI 2



-- view tables

CREATE View v_gris_irislist as
Select
tgr."RISKCD",
COUNT (tgr."RISKCD") as "COUNT",
tgr."PRD",
tgr."VRSN",
tgr."RSCR",
tgr."CRAT",
tgr."REFCD",
tgr."BEGDA",
tgr."ENDDA"
from t_grisklist tgr
inner join t_irisklist tir
	on tgr."RISKCD" = tir."RISKCD" 
	and tgr."RSCR" = tir."RSCR" 
group by tgr."RISKCD", 
		 tgr."PRD",
		 tgr."VRSN",
		 tgr."RSCR",
		 tgr."CRAT",
		 tgr."REFCD",
		 tgr."BEGDA",
		 tgr."ENDDA",
		 tgr."PRD"