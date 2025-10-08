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
-- ADD VIEWS 

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

-- insert ADD UPDATE table prd 

CREATE TABLE public.m_grisklist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"OBJTV" text NULL,
	"GRILID" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"RISKCD" varchar NULL,
	"RISKSUM" text NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"STATCD" varchar DEFAULT 'SREG-1'::character varying NULL,
	"PRGS" int4 DEFAULT 100 NULL,
	"PRD" date NULL,
	"VRSN" int4 NULL,
	"INRISCO" int4 NULL,
	"INFOCD" varchar NULL,
	"NOTES" varchar NULL,
	"REFCD" varchar NULL,
	"ID_GDB" int4 DEFAULT nextval('gdb_seq'::regclass) NULL,
	"REFPRD" varchar NULL,
	"REFID" varchar(255) NULL,
	"NIK" varchar NULL,
	"RSCR" varchar NULL,
	"DVSN" varchar NULL,
	"ALIASEQ" int4 NULL,
	CONSTRAINT m_grisklist_pkey PRIMARY KEY ("GRILID")
);


-- public.m_ikeylist definition

-- Drop table

-- DROP TABLE public.m_ikeylist;

CREATE TABLE public.m_ikeylist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"ID" serial4 NOT NULL,
	"REFCD" varchar NULL,
	"INFOCD" varchar NULL,
	"PRD" date NULL,
	"IDASCD" varchar NULL,
	"ASDESC" text NULL,
	"ENFOD" varchar NULL,
	"ENFOR" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" date NULL,
	"CHGBY" varchar(150) NULL,
	"SRC" varchar NULL,
	"X2" varchar NULL,
	"X3" varchar NULL,
	"X4" varchar NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL,
	"ID_IKEY" int4 NULL,
	"VRSN" int4 NULL,
	"STATCD" varchar NULL,
	CONSTRAINT m_ikeylist_pkey PRIMARY KEY ("ID")
);

CREATE TABLE public.m_inassets (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"INASSID" uuid DEFAULT uuid_generate_v4() NULL,
	"RISKCD" varchar NULL,
	"IDASCD" varchar NULL,
	"ASDESC" text NULL,
	"ASOWN" text NULL,
	"ASLOC" text NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) DEFAULT 'jihan'::character varying NULL,
	"PRD" date NULL,
	"INFOCD" varchar NULL,
	"REFCD" varchar NULL,
	"VRSN" int4 DEFAULT 0 NULL,
	"REFPRD" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.m_inthreat (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"INTHRID" uuid DEFAULT uuid_generate_v4() NULL,
	"RISKCD" varchar NULL,
	"ISSTH" text NULL,
	"IMPRCD" varchar NULL,
	"IDASCD" varchar NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"PRD" date NULL,
	"INFOCD" varchar NULL,
	"REFCD" varchar NULL,
	"VRSN" int4 DEFAULT 0 NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.m_invulnerability (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"INVULID" uuid DEFAULT uuid_generate_v4() NULL,
	"RISKCD" varchar NULL,
	"IDASCD" varchar NULL,
	"ISSVUL" text NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"PRD" date NULL,
	"INFOCD" varchar NULL,
	"REFCD" varchar NULL,
	"VRSN" int4 DEFAULT 0 NULL,
	"X5" varchar NULL,
	"X6" varchar NULL,
	"X7" varchar NULL
);

CREATE TABLE public.m_iresidualrisk (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"BUCD" varchar NULL,
	"RRGCD" varchar NULL,
	"PRD" date NULL,
	"RISKCD" varchar NULL,
	"TGTLI" int4 NULL,
	"TGTIM" int4 NULL,
	"TGTRISC" int4 NULL,
	"TGTRISCAT" varchar NULL,
	"REALI" int4 NULL,
	"REAIM" int4 NULL,
	"REARISC" int4 NULL,
	"REARISCAT" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"IDASCD" varchar NULL,
	"IRESID" varchar DEFAULT concat('IRES-', nextval('iresidualrisk_seq'::regclass)) NULL,
	"INFOCD" varchar NULL,
	"TGTLICD" varchar NULL,
	"TGTIMCD" varchar NULL,
	"VRSN" int4 NULL,
	"X7" varchar NULL
);

CREATE TABLE public.m_iriskidentification (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"RIDENID" varchar DEFAULT concat('IRI-', nextval('iriskidentification_seq'::regclass)) NULL,
	"RISKCD" varchar NULL,
	"RISK" text NULL,
	"CONCD" varchar NULL,
	"CATCD" text NULL,
	"CSCATCD" varchar NULL,
	"CAUSE" text NULL,
	"EXCON" text NULL,
	"SIRCCD" varchar NULL,
	"MSCONCD" varchar NULL,
	"IMCRCD" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL,
	"IDASCD" varchar NULL,
	"PRD" date NULL,
	"INFOCD" varchar NULL,
	"REFCD" varchar NULL,
	"VRSN" int4 NULL,
	"REFPRD" varchar NULL,
	"REFID" varchar NULL,
	"REVISED" varchar NULL,
	"CATMPL" uuid NULL,
	"STRISK" varchar(50) NULL,
	"RSCR" varchar(50) NULL
);


CREATE TABLE public.m_irisklist (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"OBJTV" text NULL,
	"IRILID" uuid DEFAULT uuid_generate_v4() NULL,
	"RISKCD" varchar NULL,
	"DESC" text NULL,
	"CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"STATCD" varchar DEFAULT 'SREG-2'::character varying NULL,
	"IDASCD" varchar NULL,
	"PRGS" int4 DEFAULT 100 NULL,
	"PRD" date DEFAULT CURRENT_DATE NULL,
	"INFOCD" varchar NULL,
	"NOTES" varchar NULL,
	"INRISCO" int4 NULL,
	"REFCD" varchar NULL,
	"ID_IDB" int4 DEFAULT nextval('idb_seq'::regclass) NULL,
	"VRSN" int4 DEFAULT 0 NULL,
	"REFPRD" varchar NULL,
	"REFID" varchar(255) NULL,
	"NIK" varchar NULL,
	"RSCR" varchar NULL,
	"DVSN" varchar NULL,
	"ALIASEQ" int4 NULL
);


CREATE TABLE public.m_iriskmeasurement (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"RIMEAID" varchar DEFAULT concat('IRM-', nextval('iriskmeasurement_seq'::regclass)) NULL,
	"LIHOVAL" int4 NULL,
	"IMVAL" int4 NULL,
	"INRISCO" int4 NULL,
	"INRICAT" varchar NULL,
	"EXCONLI" int4 NULL,
	"EXCONIM" int4 NULL,
	"ADINLI" int4 NULL,
	"ADINIM" int4 NULL,
	"ADINSC" int4 NULL,
	"ADINSCCAT" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"IDASCD" varchar NULL,
	"PRD" date NULL,
	"LIHOCD" varchar NULL,
	"IMVALCD" varchar NULL,
	"RISKCD" varchar NULL,
	"INFOCD" varchar NULL,
	"VRSN" int4 NULL
);



CREATE TABLE public.m_irisktreatment (
	"BEGDA" date DEFAULT CURRENT_DATE NULL,
	"ENDDA" date DEFAULT '2999-01-01'::date NULL,
	"RITREID" varchar DEFAULT concat('IRT-', nextval('irisktreatment_seq'::regclass)) NULL,
	"RISKCD" varchar NULL,
	"ADDCON" text NULL,
	"DDLN" date NULL,
	"BUDG" int8 DEFAULT 0 NULL,
	"SNBUCD" varchar NULL,
	"EFCONCD" varchar NULL,
	"CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	"CHGBY" varchar(150) NULL,
	"IDASCD" varchar NULL,
	"PICNIK" varchar NULL,
	"EFCONVAL" int4 NULL,
	"PRD" date NULL,
	"TRTCD" varchar NULL,
	"PIC" varchar NULL,
	"INFOCD" varchar NULL,
	"STATCD" varchar NULL,
	"VRSN" int4 DEFAULT 0 NULL,
	"TRTSRC" varchar(50) NULL
);


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

-- Step 2: RUN QUERY TO MIGRATE DATA

update t_gkeyidentification 
set "RSCR" = 'RS-1',
	"RISKTYPE" = 'RI-1'


update t_griskidentification 
SET "RISKTPE" = CASE
    WHEN "RISKCD" LIKE '%-1' THEN 'RI-1'
    ELSE 'RI-2'
END;

INSERT INTO t_multiple_pic_rc ("PICID")
SELECT b."PRSNID"
FROM t_grisktreatment  a
JOIN t_personal b ON a."PICNIK" = b."NIK";

update t_multiple_pic_rc
set "RLMPID" uuid_generate_v4()
where "RLMPID"  is null ;


UPDATE t_multiple_pic_rc
SET "RLMPID" = uuid_generate_v4()
WHERE "RLMPID" IS NULL;


INSERT INTO t_form_risklist ("BUCD", "PRD", "VRSN")
SELECT tlg."BUCD",
       tlg."PRD",
       tlg."VRSN"::integer
FROM t_list_grisklist tlg;


update t_irisklist ti 
set "ALIASEQ" = '0'
where ti."ENDDA" <> '2999-01-01'

UPDATE t_irisklist ti
SET "ALIASEQ" = CASE
    WHEN ti."ENDDA" <> '2999-01-01' THEN 0
    ELSE CAST(REGEXP_REPLACE(ti."RISKCD", '[^0-9]', '', 'g') AS INTEGER)
END;


UPDATE t_grisklist ti
SET "ALIASEQ" = CASE
    WHEN ti."ENDDA" <> '2999-01-01' THEN 0
    ELSE CAST(REGEXP_REPLACE(ti."RISKCD", '[^0-9]', '', 'g') AS INTEGER)
END;


WITH cte AS (
    SELECT 
        "REFCD",
        MIN("RIDENID") AS first_id,           -- ambil 1 baris acuan (ganti id dengan PK anda)
        gen_random_uuid() AS new_uuid
    FROM t_griskidentification
    GROUP BY "REFCD"
    HAVING COUNT(*) > 1
)
UPDATE t_griskidentification tg 	
SET 
    "CATMPL" = cte.new_uuid,
    "RISKTPE" = 'RI-2',
    "RSCR" = 'RS-2'
FROM cte
WHERE tg."REFCD" = cte."REFCD";


WITH cte AS (
    SELECT 
        "IDASCD",
        MIN("RIDENID") AS first_id,           -- ambil 1 baris acuan (ganti id dengan PK anda)
        gen_random_uuid() AS new_uuid
    FROM t_iriskidentification
    GROUP BY "IDASCD"
    HAVING COUNT(*) > 1
)
UPDATE t_iriskidentification tg 	
SET 
--    "CATMPL" = cte.new_uuid,
--    "RISKTPE" = 'RI-2',/
    "RSCR" = 'RS-2'
FROM cte
WHERE tg."IDASCD" = cte."IDASCD";

update t_gkeyidentification 
set "RSCR" = 'RS-1',
	"RISKTYPE" = 'RI-1'


INSERT INTO t_list_grisklist ("BEGDA", "ENDDA", "CHGBY", "VRSN", "BUCD","PRD","CRAT","CHGDA","STATCD")
SELECT t1."BEGDA",
       t1."ENDDA",
       t1."CHGBY",
       t1."VRSN",                 -- VRSN di urutan yang sama
       t1."BUCD",
       t1."PRD",
       t1."CRAT",
       t1."CHGDA"::timestamp,     -- CHGDA pas di kolom CHGDA
       t1."STATCD"
FROM t_riskregisterstatus t1
JOIN (
    SELECT "BUCD",
           "CHGBY",
           MIN("VRSN") AS min_vrsn
    FROM t_riskregisterstatus
    WHERE "ENDDA" = '2999-01-01'
    GROUP BY "BUCD", "CHGBY"
) t2
  ON t1."BUCD" = t2."BUCD"
 AND t1."CHGBY" = t2."CHGBY"
 AND t1."VRSN" = t2.min_vrsn;


 UPDATE t_griskidentification tg
SET "RSCR" = 'RS-2'
WHERE tg."REFID" IS NOT NULL;



    SELECT t1.*,
           ROW_NUMBER() OVER (
               PARTITION BY t1."BUCD", t1."CHGBY"
               ORDER BY t1."VRSN" ASC, t1."BEGDA" ASC
           ) AS rn
    FROM t_riskregisterstatus t1
    WHERE t1."ENDDA" = '2999-01-01'

 ALTER TABLE t_griskidentification 
ADD CONSTRAINT pk_t_griskidentification PRIMARY KEY ("RIDENID");


UPDATE t_reviewer p
SET "NSTNR" = case
	WHEN p."ENDDA" <> DATE '2999-01-01' THEN 'SRO-3'
	when exists (
	   SELECT 1
       FROM t_riskregisterstatus c
       WHERE c."BUCD" = p."BUCD"
          AND DATE_PART('year', c."BEGDA") = DATE_PART('year', p."BEGDA")
          AND c."STATCD" = 'HREG-1'
	) THEN 'SNR-1'
     WHEN EXISTS (
        SELECT 1
        FROM t_riskregisterstatus c
         WHERE c."BUCD" = p."BUCD"
          AND DATE_PART('year', c."BEGDA") = DATE_PART('year', p."BEGDA")
          AND c."STATCD" in ('HREG-2','HREG-3','HREG-4')
    ) THEN 'SNR-2'
    ELSE 'SNR-3'
end


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

