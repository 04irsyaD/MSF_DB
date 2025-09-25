-- MIGRATION DEV TO STAGG
-- kondistional update
m_grisklist
m_iklist
m_innassets
m_inthreats
m_invulnerability
m_iresidualrisk
m_irisidentification
m_irisklist
m_irismeasurement
m_irisktreatment

-- fix update
--  udapte master data
add masterdata t_acces
BEGDATE         ENDATE           ACSID                                      ACSCD                                                           ACSNM                                     CRAT                                 CHGDATE           CHGBY
2025-09-09      2999-12-31      "d66d9696-a053-42d2-99bc-834e4679bc77"      "risk_treatment__pic_deadline" "No specific treatment"          "Risk Treatment Pic Deadline"             2025-09-09 13:34:14.072 +0700        2025-09-09        Jihan/Irsyad
2025-09-09      2999-12-31      "d66d9696-a053-42d2-99bc-834e4679bc77"      "risk_treatment__only_pic_deadline" "Considered treatment"      "Risk Treatment Only Pic Deadline"        2025-09-09 13:34:14.072 +0700        2025-09-09        Jihan/Irsyad

add master data t_menu_accces
BEGDATE		 ENDATE           MNACID                                     MNACCD                                     				MNCD                               ACSD          	 					CRAT           						CHGDA					CHGBY	
2025-09-09  2999-12-31      "01cf59ba-f97d-40ae-9b00-11e92f00d741"      "menu_risk_reporting__risk_treatment__only_pic_deadline"   menu_risk_reporting       		"risk_treatment__only_pic_deadline"     2025-09-09 13:28:32.382 +0700        2025-09-09        Jihan/Irsyad
2025-09-09  2999-12-31      "0efade78-3360-41d5-aee1-9c96b851f52c"      "menu_risk_reporting__risk_treatment__pic_deadline"  	   menu_risk_reporting      		"risk_treatment__pic_deadline"        	2025-09-09 13:28:32.382 +0700		 2025-09-09        Jihan/Irsyad

UPDATE master data t_otype

update master data t_personal

update master data t_rbac

update master data t_status_register

update master data t_user

-- update table or column

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
add "NSTRO" varchar NULL,  [SREG16 TGRISLIST BUCD = SRO = 4, SREG 1/2 = SRO1 , ENDDA =  CURENTTIME = SREG1, NONACTIVE SRO3] EXept SRO2
	"PRD" int4 NULL;


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



