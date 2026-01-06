-- PERFORMANCE REVIEW
select DISTINCT ON ("PEREMID")
ROW_NUMBER() OVER (ORDER BY tp."PEREMID" ) AS "No",
tp."PRD"  as "Period",
tp."PEREMNM" as "Remark",
tp."CHGBY" as "Updated By",
DATE(tp."UPAT") as "Last Update"
from t_performremarks tp


-- RISK OWNER
SELECT DISTINCT ON ("ROWID")
--ROW_NUMBER() OVER (ORDER BY tr."ROWID" ) AS "No",
t."LTEXT" as "Bussiness Unit",
tr. "PRD" as "Period",
tr."ROWNM" as "NAME",
tr."NSTRO",
t2."LTEXT", 
tr."BUCD",
tr."NIK",
tr."SELBY",
tr."SELEML"
from t_riskowner tr 
left join t_object t 
	on  tr."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
left join t_object t2 
	on tr."NSTRO" = t2."STEXT"
	and t2."OTYPE" = 'NSTRO'
where tr."ENDDA" = '2999-01-01'
	and tr."ISACT" = 'TRUE'
	and EXTRACT(YEAR FROM tr."STASS") = 2025;

-- risk champion list
SELECT DISTINCT ON (trl."RCLUID")
  t."LTEXT" AS "Bussiness Unit",
  trl."BUCD",
  trl."RCLNUM" AS "Risk Champion",
  trl."PRD" AS "Period",
  trl."RCHNM" AS "Risk Champion Coordinator",
  trl."STAT" AS "S",
  tr."NSTRC",
  t2."LTEXT",
  COALESCE(t2."LTEXT", 'ACTIVE NULL') AS nama_tampil
FROM t_rickchampion_list trl
LEFT JOIN t_object t 
  ON trl."BUCD" = t."STEXT"
 AND t."ENDDA" = DATE '2999-01-01'
LEFT JOIN t_riskchampion tr
  ON tr."BUCD" = trl."BUCD"
 AND tr."PRD" = trl."PRD"
LEFT JOIN t_object t2 
  ON tr."NSTRC" = t2."STEXT"
 AND t2."OTYPE" = 'NSTRC'
ORDER BY trl."RCLUID", trl."PRD" DESC;

--risk champion detail 
SELECT DISTINCT ON (trc."RCHID")
trc."RCHNM" as "Name",
trc."STAT" as "Status",
t."LTEXT" AS "Bussiness Unit",
tro."ROWNM" as "RISK OWNER"
from t_riskchampion trc
LEFT JOIN t_object t 
  ON trc."BUCD" = t."STEXT"
 AND t."ENDDA" = DATE '2999-01-01'
left join t_riskowner tro
 on trc."BUCD" = tro."BUCD"
 and trc."PRD" = tro."PRD"
 where trc."ENDDA"  = '2999-01-01'

-- revirewer list
select DISTINCT ON ("RVLUID")
t."LTEXT" as "Bussiness Unit",
trl."PRD" as "Period",
trl."RLNUM" as "Risk Reviewer",
COALESCE(t2."LTEXT", 'ACTIVE') AS "STATUS"
from t_reviewer_list trl
left join t_object t 
	on  trl."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
left join t_reviewer tr 
	on tr."BUCD" = trl."BUCD"
	and tr."PRD" = trl."PRD"
left join t_object t2 
	on tr."NSTNR" = t2."STEXT"
	and t2."OTYPE" = 'NSTNR';
--  DEtail reviewer

select DISTINCT ON ("RVWID") 
tr."RVWNM" as "Name",
t."LTEXT" as "Bussiness Unit",
CASE tr."ISACT"
    WHEN true THEN 'Active'
    WHEN false THEN 'Non Active'	
  END AS status_text,
 tr."CHGBY" as "Change by"
from t_reviewer tr
left join t_object t 
	on  tr."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
where tr."ENDDA" = '2999-01-01';


-- inventor
WITH buscdinv AS (
select DISTINCT ON ("INVNM") 
ti."INVNM" as "NAME",
CASE ti."ISACT"
    WHEN true THEN 'Active'
    WHEN false THEN 'Non Active'
  END AS status_text,
 CASE
    WHEN ti."BUCD" = tp."BUCD" THEN tp."BUCD"
    ELSE NULL
  END AS "BUCD",
 ti."CHGBY" as "Personel RM"
from t_inventor ti 
LEFT JOIN t_personal tp ON ti."INVNM" = tp."NAM"
where ti."ENDDA" = '2999-01-01'
)
SELECT
  mc."NAME",
  mc.status_text,
  mc."Personel RM",
  mc."BUCD",
  t."LTEXT" as "Bussiness Unit"
FROM buscdinv mc
left join t_object t 
	on  mc."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'



-- tratment testing
select DISTINCT ON ("TRILID")
t."LTEXT" as "Bussiness Unit",
EXTRACT(YEAR FROM ttr."PRD") AS "Period",
ttr."TRTCD" as "Treatment Code",
ttr."ADDCON" as "Additional Control",
ttr."RISKSUM" as "Risk Summary",
ttr."VRSN" as "Version"
--trit."DDLN" as "Deadline"
from t_trisklist ttr
left join t_object t 
--	on  ttr."RISKCD" = t."STEXT" 
	ON split_part(ttr."RISKCD", '-', 1) = t."STEXT"
	and t."ENDDA" = '2999-01-01'
where ttr."ENDDA" = '2999-01-01'


-- treatment final version
WITH filtered_data AS (
SELECT *
FROM (
    SELECT *,
           MAX("VRSN") OVER (PARTITION BY "TRTCD")                                   AS max_version,
           MAX(CASE WHEN "STATCD" <> 'STRE-0' THEN "VRSN"  END)
               OVER (PARTITION BY "TRTCD")                                           AS max_valid_version
    FROM t_trisklist
) t
WHERE
    (
        -- kalau versi tertinggi punya status selain ST01
        "VRSN" = max_version
        AND "STATCD" <> 'STRE-0'
    )
    OR
    (
        -- kalau versi tertinggi SEMUA ST01, ambil versi tertinggi non-ST01 di bawahnya
        "VRSN" = max_valid_version
        AND "STATCD" <> 'STRE-0'
        AND max_valid_version < max_version
        and "ENDDA" = '2999-01-01'
    )
   )
select DISTINCT ON ("TRILID")
t."LTEXT" as "Bussiness Unit",
EXTRACT(YEAR FROM fd."PRD") AS "Period",
fd."TRTCD" as "Treatment Code",
fd."ADDCON" as "Additional Control",
fd."RISKSUM" as "Risk Summary",
fd."VRSN" as "Version",
tgk."DDLN" as "Deadline",
t2."LTEXT" as "Status"
FROM filtered_data fd
left join t_object t 
--	on  ttr."RISKCD" = t."STEXT" 
	ON split_part(fd."RISKCD", '-', 1) = t."STEXT"
	and t."ENDDA" = '2999-01-01'
left join t_grisktreatment tgk
	on fd."TRTCD" = tgk."TRTCD"
	and tgk."ENDDA" = '2999-01-01'
left join t_object t2 
--	on  ttr."RISKCD" = t."STEXT" 
	on fd."STATCD" = t2."STEXT"
	and t."ENDDA" = '2999-01-01'


-- RISK REGISTER VIEW
create or replace view v_risk_register as
WITH base_data AS (
    SELECT
        LEFT("RISKCD", 3) AS riskcd_prefix,
        "PRD",
        "ENDDA",
        "VRSN",
        'A' AS src
    FROM t_grisklist

    UNION ALL

    SELECT
        LEFT("RISKCD", 3) AS riskcd_prefix,
        "PRD",
        "ENDDA",
        "VRSN",
        'B' AS src
    FROM t_irisklist
),
agg_data AS (
    SELECT
        riskcd_prefix,
        "PRD",

        MAX("VRSN") AS max_vrsn,

        COUNT(*) FILTER (WHERE src = 'A') AS total_table_a,
        COUNT(*) FILTER (WHERE src = 'B') AS total_table_b,

        COUNT(*) FILTER (WHERE src = 'A' AND "ENDDA" = DATE '2999-01-01') AS total_active_a,
        COUNT(*) FILTER (WHERE src = 'B' AND "ENDDA" = DATE '2999-01-01') AS total_active_b
    FROM base_data
    GROUP BY riskcd_prefix, "PRD"
)

SELECT 
	a.riskcd_prefix as "Business Unit",
    a."PRD" as "Period",
    trc."RCHNM" as "Risk Champion",
    a.max_vrsn as "Verrsion",
    a.total_table_a as "General info",
    a.total_table_b as "Info Sec",
    a.total_active_a as "Info Sec info Data Active",
    a.total_active_b as "General info Data Active"
FROM agg_data a
LEFT JOIN t_riskchampion trc
  on trc."BUCD" = a.riskcd_prefix
  and trc."ENDDA" = '2999-01-01'
ORDER BY riskcd_prefix;

-- ;loss event view
create or replace view v_loss_event as
select DISTINCT ON ("LOLID") 
tl."LOCD" as  "Loss Event Code",
tl."LOTIT" as "Title",
t."LTEXT" as "Status",
tl."REPBY" as "Reported By",
t2."LTEXT" as "Bussiness Unit",
tl."REPAT" as "Reported Date"

from t_losseventlist tl
left join t_object t 
	on  tl."STATLE" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
left join t_object t2 
	on  tl."BUCD" = t2."STEXT" 
	and t2."ENDDA" = '2999-01-01'
where tl."ENDDA" = '2999-01-01';
























-- public.detail_reviewer source

CREATE OR REPLACE VIEW public.detail_reviewer
AS SELECT DISTINCT ON (tr."RVWID") tr."RVWNM" AS "Name",
    t."LTEXT" AS "Bussiness Unit",
        CASE tr."ISACT"
            WHEN true THEN 'Active'::text
            WHEN false THEN 'Non Active'::text
            ELSE NULL::text
        END AS status_text,
    tr."CHGBY" AS "Change by"
   FROM t_reviewer tr
     LEFT JOIN t_object t ON tr."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
  WHERE tr."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.detail_reviewer IS 'Detail Dari List Reviewer';
COMMENT ON COLUMN public.detail_reviewer."Name" IS 'Nama Reviewer';
COMMENT ON COLUMN public.detail_reviewer."Bussiness Unit" IS 'Nama Bussines Unit';
COMMENT ON COLUMN public.detail_reviewer.status_text IS 'Status Reviewer';
COMMENT ON COLUMN public.detail_reviewer."Change by" IS 'User Yang merubah Datanya';

-- Permissions

ALTER TABLE public.detail_reviewer OWNER TO devermusr;
GRANT ALL ON TABLE public.detail_reviewer TO devermusr;


-- public.inventor source

CREATE OR REPLACE VIEW public.inventor
AS WITH buscdinv AS (
         SELECT DISTINCT ON (ti."INVNM") ti."INVNM" AS "NAME",
                CASE ti."ISACT"
                    WHEN true THEN 'Active'::text
                    WHEN false THEN 'Non Active'::text
                    ELSE NULL::text
                END AS status_text,
                CASE
                    WHEN ti."BUCD"::text = tp."BUCD"::text THEN tp."BUCD"
                    ELSE NULL::character varying
                END AS "BUCD",
            ti."CHGBY" AS "Personel RM"
           FROM t_inventor ti
             LEFT JOIN t_personal tp ON ti."INVNM"::text = tp."NAM"::text
          WHERE ti."ENDDA" = '2999-01-01'::date
        )
 SELECT mc."NAME",
    mc.status_text,
    mc."Personel RM",
    mc."BUCD",
    t."LTEXT" AS "Bussiness Unit"
   FROM buscdinv mc
     LEFT JOIN t_object t ON mc."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.inventor IS 'List Data Inventor';
COMMENT ON COLUMN public.inventor."NAME" IS 'Nama Inventor';
COMMENT ON COLUMN public.inventor.status_text IS 'Status Inventor';
COMMENT ON COLUMN public.inventor."Personel RM" IS 'Nama Personel RM';
COMMENT ON COLUMN public.inventor."BUCD" IS 'Code Bussiness Unit';
COMMENT ON COLUMN public.inventor."Bussiness Unit" IS 'Nama Bussiness Unit';

-- Permissions

ALTER TABLE public.inventor OWNER TO devermusr;
GRANT ALL ON TABLE public.inventor TO devermusr;


-- public.performance_review source

CREATE OR REPLACE VIEW public.performance_review
AS SELECT DISTINCT ON ("PEREMID") row_number() OVER (ORDER BY "PEREMID") AS "No",
    "PRD" AS "Period",
    "PEREMNM" AS "Remark",
    "CHGBY" AS "Updated By",
    date("UPAT") AS "Last Update"
   FROM t_performremarks tp;

COMMENT ON VIEW public.performance_review IS 'Data Performance Review';
COMMENT ON COLUMN public.performance_review."Period" IS 'Periode Performance Reviewer';
COMMENT ON COLUMN public.performance_review."Remark" IS 'Catatan Performance Review';
COMMENT ON COLUMN public.performance_review."Updated By" IS 'Di update oleh';
COMMENT ON COLUMN public.performance_review."Last Update" IS 'Tanggal update terakhir';

-- Permissions

ALTER TABLE public.performance_review OWNER TO devermusr;
GRANT ALL ON TABLE public.performance_review TO devermusr;


-- public.reviewer_list source

CREATE OR REPLACE VIEW public.reviewer_list
AS SELECT DISTINCT ON (trl."RVLUID") t."LTEXT" AS "Bussiness Unit",
    trl."PRD" AS "Period",
    trl."RLNUM" AS "Risk Reviewer",
    COALESCE(t2."LTEXT", 'ACTIVE'::character varying) AS "STATUS"
   FROM t_reviewer_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_reviewer tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTNR"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTNR'::text;

COMMENT ON VIEW public.reviewer_list IS 'Data List Reviewer';
COMMENT ON COLUMN public.reviewer_list."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.reviewer_list."Period" IS 'Periode reviewer';
COMMENT ON COLUMN public.reviewer_list."Risk Reviewer" IS 'Total Reviewer';
COMMENT ON COLUMN public.reviewer_list."STATUS" IS 'Status Reviewer';

-- Permissions

ALTER TABLE public.reviewer_list OWNER TO devermusr;
GRANT ALL ON TABLE public.reviewer_list TO devermusr;


-- public.risk_champion_detail source

CREATE OR REPLACE VIEW public.risk_champion_detail
AS SELECT DISTINCT ON (trc."RCHID") trc."RCHNM" AS "Name",
    trc."STAT" AS "Status",
    t."LTEXT" AS "Bussiness Unit",
    tro."ROWNM" AS "RISK OWNER"
   FROM t_riskchampion trc
     LEFT JOIN t_object t ON trc."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_riskowner tro ON trc."BUCD"::text = tro."BUCD"::text AND trc."PRD" = tro."PRD"
  WHERE trc."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.risk_champion_detail IS 'List Risk Champion Detail';
COMMENT ON COLUMN public.risk_champion_detail."Name" IS 'Nama Risk Champions';
COMMENT ON COLUMN public.risk_champion_detail."Status" IS 'Status Risk Champion';
COMMENT ON COLUMN public.risk_champion_detail."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.risk_champion_detail."RISK OWNER" IS 'Nama Risk Owner';

-- Permissions

ALTER TABLE public.risk_champion_detail OWNER TO devermusr;
GRANT ALL ON TABLE public.risk_champion_detail TO devermusr;


-- public.risk_champion_list source

CREATE OR REPLACE VIEW public.risk_champion_list
AS SELECT DISTINCT ON (trl."RCLUID") t."LTEXT" AS "Bussiness Unit",
    trl."BUCD",
    trl."RCLNUM" AS "Risk Champion",
    trl."PRD" AS "Period",
    trl."RCHNM" AS "Risk Champion Coordinator",
    trl."STAT" AS "S",
    tr."NSTRC",
    t2."LTEXT",
    COALESCE(t2."LTEXT", 'ACTIVE NULL'::character varying) AS nama_tampil
   FROM t_rickchampion_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_riskchampion tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTRC"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTRC'::text
  ORDER BY trl."RCLUID", trl."PRD" DESC;

COMMENT ON VIEW public.risk_champion_list IS 'List Risk Champion';
COMMENT ON COLUMN public.risk_champion_list."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.risk_champion_list."BUCD" IS 'Code Bussiness Unit';
COMMENT ON COLUMN public.risk_champion_list."Risk Champion" IS 'Total Risk Champion';
COMMENT ON COLUMN public.risk_champion_list."Period" IS 'Periode Risk Champion';
COMMENT ON COLUMN public.risk_champion_list."Risk Champion Coordinator" IS 'Nama Coordinator Risk Champion';
COMMENT ON COLUMN public.risk_champion_list.nama_tampil IS 'Status Risk Champion';

-- Permissions

ALTER TABLE public.risk_champion_list OWNER TO devermusr;
GRANT ALL ON TABLE public.risk_champion_list TO devermusr;


-- public.risk_owner source

CREATE OR REPLACE VIEW public.risk_owner
AS SELECT DISTINCT ON (tr."ROWID") t."LTEXT" AS "Bussiness Unit",
    tr."PRD" AS "Period",
    tr."ROWNM" AS "NAME",
    tr."NSTRO",
    t2."LTEXT",
    tr."BUCD",
    tr."NIK",
    tr."SELBY",
    tr."SELEML"
   FROM t_riskowner tr
     LEFT JOIN t_object t ON tr."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON tr."NSTRO"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTRO'::text
  WHERE tr."ENDDA" = '2999-01-01'::date AND tr."ISACT" = true AND EXTRACT(year FROM tr."STASS") = 2025::numeric;

COMMENT ON VIEW public.risk_owner IS 'List Risk Owner';
COMMENT ON COLUMN public.risk_owner."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.risk_owner."Period" IS 'Periode Risk Owner';
COMMENT ON COLUMN public.risk_owner."NAME" IS 'Nama Risk Owner';
COMMENT ON COLUMN public.risk_owner."LTEXT" IS 'Status Risk Owner';
COMMENT ON COLUMN public.risk_owner."BUCD" IS 'Business Unit Code';
COMMENT ON COLUMN public.risk_owner."NIK" IS 'NIK Risk Owner';
COMMENT ON COLUMN public.risk_owner."SELBY" IS 'Dipilih oleh';
COMMENT ON COLUMN public.risk_owner."SELEML" IS 'Email pemilih';

-- Permissions

ALTER TABLE public.risk_owner OWNER TO devermusr;
GRANT ALL ON TABLE public.risk_owner TO devermusr;


-- public.treatment_final_version source

CREATE OR REPLACE VIEW public.treatment_final_version
AS WITH filtered_data AS (
         SELECT t_1."BEGDA",
            t_1."ENDDA",
            t_1."TRILID",
            t_1."ADDCON",
            t_1."TRTCD",
            t_1."RISKSUM",
            t_1."CRAT",
            t_1."CHGDA",
            t_1."CHGBY",
            t_1."STATCD",
            t_1."PRD",
            t_1."RISKCD",
            t_1."FRZ",
            t_1."VRSN",
            t_1."X5",
            t_1."X6",
            t_1."X7",
            t_1."PICNIK",
            t_1."BEGDA"",""ENDDA"",""TRILID"",""ADDCON"",""TRTCD"",""RISKSUM"",""CRAT"",""CHGD",
            t_1.max_version,
            t_1.max_valid_version
           FROM ( SELECT t_trisklist."BEGDA",
                    t_trisklist."ENDDA",
                    t_trisklist."TRILID",
                    t_trisklist."ADDCON",
                    t_trisklist."TRTCD",
                    t_trisklist."RISKSUM",
                    t_trisklist."CRAT",
                    t_trisklist."CHGDA",
                    t_trisklist."CHGBY",
                    t_trisklist."STATCD",
                    t_trisklist."PRD",
                    t_trisklist."RISKCD",
                    t_trisklist."FRZ",
                    t_trisklist."VRSN",
                    t_trisklist."X5",
                    t_trisklist."X6",
                    t_trisklist."X7",
                    t_trisklist."PICNIK",
                    t_trisklist."BEGDA"",""ENDDA"",""TRILID"",""ADDCON"",""TRTCD"",""RISKSUM"",""CRAT"",""CHGD",
                    max(t_trisklist."VRSN") OVER (PARTITION BY t_trisklist."TRTCD") AS max_version,
                    max(
                        CASE
                            WHEN t_trisklist."STATCD"::text <> 'STRE-0'::text THEN t_trisklist."VRSN"
                            ELSE NULL::integer
                        END) OVER (PARTITION BY t_trisklist."TRTCD") AS max_valid_version
                   FROM t_trisklist) t_1
          WHERE t_1."VRSN" = t_1.max_version AND t_1."STATCD"::text <> 'STRE-0'::text OR t_1."VRSN" = t_1.max_valid_version AND t_1."STATCD"::text <> 'STRE-0'::text AND t_1.max_valid_version < t_1.max_version AND t_1."ENDDA" = '2999-01-01'::date
        )
 SELECT DISTINCT ON (fd."TRILID") t."LTEXT" AS "Bussiness Unit",
    EXTRACT(year FROM fd."PRD") AS "Period",
    fd."TRTCD" AS "Treatment Code",
    fd."ADDCON" AS "Additional Control",
    fd."RISKSUM" AS "Risk Summary",
    fd."VRSN" AS "Version",
    tgk."DDLN" AS "Deadline",
    t2."LTEXT" AS "Status"
   FROM filtered_data fd
     LEFT JOIN t_object t ON split_part(fd."RISKCD"::text, '-'::text, 1) = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_grisktreatment tgk ON fd."TRTCD"::text = tgk."TRTCD"::text AND tgk."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON fd."STATCD"::text = t2."STEXT"::text AND t."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.treatment_final_version IS 'Risk Treatment List';
COMMENT ON COLUMN public.treatment_final_version."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.treatment_final_version."Period" IS 'Periode Risk Treatment List';
COMMENT ON COLUMN public.treatment_final_version."Treatment Code" IS 'Treatment Code Risk Treatment';
COMMENT ON COLUMN public.treatment_final_version."Additional Control" IS 'Kontrol Tambahan Risk Treatment';
COMMENT ON COLUMN public.treatment_final_version."Risk Summary" IS 'Ringkasan Risiko Risk Treatment';
COMMENT ON COLUMN public.treatment_final_version."Version" IS 'Version Risk Treatment';
COMMENT ON COLUMN public.treatment_final_version."Deadline" IS 'Deadline Risk Treatment';
COMMENT ON COLUMN public.treatment_final_version."Status" IS 'Status Risk Treatment';

-- Permissions

ALTER TABLE public.treatment_final_version OWNER TO devermusr;
GRANT ALL ON TABLE public.treatment_final_version TO devermusr;


-- public.v_loss_event source

CREATE OR REPLACE VIEW public.v_loss_event
AS SELECT DISTINCT ON (tl."LOLID") tl."LOCD" AS "Loss Event Code",
    tl."LOTIT" AS "Title",
    t."LTEXT" AS "Status",
    tl."REPBY" AS "Reported By",
    t2."LTEXT" AS "Bussiness Unit",
    tl."REPAT" AS "Reported Date"
   FROM t_losseventlist tl
     LEFT JOIN t_object t ON tl."STATLE"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON tl."BUCD"::text = t2."STEXT"::text AND t2."ENDDA" = '2999-01-01'::date
  WHERE tl."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_loss_event IS 'List loss Event';
COMMENT ON COLUMN public.v_loss_event."Loss Event Code" IS 'Code Loss Event';
COMMENT ON COLUMN public.v_loss_event."Title" IS 'Title Loss Event';
COMMENT ON COLUMN public.v_loss_event."Status" IS 'Status Loss Event';
COMMENT ON COLUMN public.v_loss_event."Reported By" IS 'Dilaporkan Oleh';
COMMENT ON COLUMN public.v_loss_event."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.v_loss_event."Reported Date" IS 'tanggal pelaporan Loss Event';

-- Permissions

ALTER TABLE public.v_loss_event OWNER TO devermusr;
GRANT ALL ON TABLE public.v_loss_event TO devermusr;


-- public.v_risk_register source

CREATE OR REPLACE VIEW public.v_risk_register
AS WITH base_data AS (
         SELECT "left"(t_grisklist."RISKCD"::text, 3) AS riskcd_prefix,
            t_grisklist."PRD",
            t_grisklist."ENDDA",
            t_grisklist."VRSN",
            'A'::text AS src
           FROM t_grisklist
        UNION ALL
         SELECT "left"(t_irisklist."RISKCD"::text, 3) AS riskcd_prefix,
            t_irisklist."PRD",
            t_irisklist."ENDDA",
            t_irisklist."VRSN",
            'B'::text AS src
           FROM t_irisklist
        ), agg_data AS (
         SELECT base_data.riskcd_prefix,
            base_data."PRD",
            max(base_data."VRSN") AS max_vrsn,
            count(*) FILTER (WHERE base_data.src = 'A'::text) AS total_table_a,
            count(*) FILTER (WHERE base_data.src = 'B'::text) AS total_table_b,
            count(*) FILTER (WHERE base_data.src = 'A'::text AND base_data."ENDDA" = '2999-01-01'::date) AS total_active_a,
            count(*) FILTER (WHERE base_data.src = 'B'::text AND base_data."ENDDA" = '2999-01-01'::date) AS total_active_b
           FROM base_data
          GROUP BY base_data.riskcd_prefix, base_data."PRD"
        )
 SELECT a.riskcd_prefix AS "Business Unit",
    a."PRD" AS "Period",
    trc."RCHNM" AS "Risk Champion",
    a.max_vrsn AS "Verrsion",
    a.total_table_a AS "General info",
    a.total_table_b AS "Info Sec",
    a.total_active_a AS "Info Sec info Data Active",
    a.total_active_b AS "General info Data Active"
   FROM agg_data a
     LEFT JOIN t_riskchampion trc ON trc."BUCD"::text = a.riskcd_prefix AND trc."ENDDA" = '2999-01-01'::date
  ORDER BY a.riskcd_prefix;

COMMENT ON VIEW public.v_risk_register IS 'List Register';
COMMENT ON COLUMN public.v_risk_register."Business Unit" IS 'Nama Bussiness unit';
COMMENT ON COLUMN public.v_risk_register."Period" IS 'Periode Risk Register';
COMMENT ON COLUMN public.v_risk_register."Risk Champion" IS 'Nama Risk Champions';
COMMENT ON COLUMN public.v_risk_register."Verrsion" IS 'Version Risk Register';
COMMENT ON COLUMN public.v_risk_register."General info" IS 'Progress General info';
COMMENT ON COLUMN public.v_risk_register."Info Sec" IS 'Progress Info Sec';
COMMENT ON COLUMN public.v_risk_register."Info Sec info Data Active" IS 'Progress General info Completed';
COMMENT ON COLUMN public.v_risk_register."General info Data Active" IS 'Progress Info sec Completed';

-- Permissions

ALTER TABLE public.v_risk_register OWNER TO devermusr;
GRANT ALL ON TABLE public.v_risk_register TO devermusr;




create or replace view v_risk_universe as
select 
EXTRACT(YEAR FROM trl."PRD") AS "Period",
trl."BUTOT" as  "Total Business Unit",
trl."RISKTOT" as "Total Risk"
from t_riskuniversetotal trl;


create or replace view corporate_risk_period as
select 
EXTRACT(YEAR FROM tcp."PRD") AS "Period",
tcp."TOTAL" as "Total Risk"
from t_corporaterisktotal tcp

--Risk Database
--general information
CREATE OR REPLACE VIEW public.risk_database_general_info
select DISTINCT ON ("GRDID")
CONCAT(tgb."RISKCD",'-', EXTRACT(YEAR FROM tgb."PRD")) AS "RISK CODE" ,
tgb."RISK" as "Risk Description",
tck."DESC" as "Corporate Risk Description",
tcs."CHANNM" as "Risk Chain Analysis",
CASE
--        WHEN tgb."PRD" < CURRENT_DATE - INTERVAL '2 years'
       WHEN AGE(CURRENT_DATE, tgb."PRD" ) < INTERVAL '1 years'
--		WHEN EXTRACT(YEAR FROM CURRENT_DATE)
--           - EXTRACT(YEAR FROM tgb."PRD") < 2
        THEN 'Active'
        ELSE 'Non-Active'
    END AS "Key Risk",
CASE
    WHEN EXISTS (
            SELECT 1
            FROM t_griskdatabase tgb2
            WHERE tgb2."GRDID" = tgb."GRDID"
              AND tgb2."TARECD" = tgb."TARECD"
        )
        THEN 'MAPPED'
        ELSE 'NOT MAPPED'
    END AS "MAPPING"
from t_griskdatabase tgb
left join t_corporaterisk tck
	on tck."CORICD" = tgb."CORICD" 
	and tck."TARECD" = tgb."TARECD"
left join t_chainanalysis tcs
	on tcs."CHANCD" = tgb."CHANCD" 
where tgb."ENDDA" = '2999-01-01'








































































































































































































































































































































































































































































--- RISK OWNER WOK 
SELECT DISTINCT ON ("ROWID")
ROW_NUMBER() OVER (ORDER BY tr."ROWID" ) AS "No",
t."LTEXT" as "Bussiness Unit",
tr. "PRD" as "Period",
tr."ROWNM" as "NAME",
tr."NSTRO",
t2."LTEXT", 
tr."BUCD",
tr."NIK",
tr."SELBY",
tr."SELEML"
from t_riskowner tr 
left join t_object t 
	on  tr."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
left join t_object t2 
	on tr."NSTRO" = t2."STEXT"
	and t2."OTYPE" = 'NSTRO';


-- risk champion


select DISTINCT ON ("RCLUID")
t."LTEXT" as "Bussiness Unit",
trl."BUCD",
trl."RCLNUM" as "Risk Champion" ,
trl."PRD" as "Period", 
trl."RCHNM" as "Risk Champion Coordinator",
trl."STAT" as "S",
tr."NSTRC",
t2."LTEXT",
COALESCE(t2."LTEXT", 'ACTIVE NULL') AS nama_tampil

from t_rickchampion_list trl
left join t_object t 
	on  trl."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
left join t_riskchampion tr
	on tr."BUCD" = trl."BUCD"
	and tr."PRD" = trl."PRD"
--	and tr."CDTR" = 'TRUE'
left join t_object t2 
	on tr."NSTRC" = t2."STEXT"
	and t2."OTYPE" = 'NSTRC';

-- list reviewer
select DISTINCT ON ("RVLUID")
trl."BUCD",
t."LTEXT" as "Bussiness Unit",
trl."PRD",
trl."RLNUM",
tr."NSTNR",
COALESCE(t2."LTEXT", 'ACTIVE NULL') AS nama_tampil
from t_reviewer_list trl
left join t_object t 
	on  trl."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
left join t_reviewer tr 
	on tr."BUCD" = trl."BUCD"
	and tr."PRD" = trl."PRD"
left join t_object t2 
	on tr."NSTNR" = t2."STEXT"
	and t2."OTYPE" = 'NSTNR';


-- inventor 

select DISTINCT ON ("INVID")
tir."INVNM",
tir."STAT",
tir."BUCD",
t."LTEXT" as "Bussiness Unit",
tir."CHGBY"
from t_inventor tir
left join t_object t 
	on  tir."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'


-- risk treatment
select DISTINCT ON ("RTRUID")