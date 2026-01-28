-- performance_review
create or replace view v_performance_review as
SELECT DISTINCT ON ("PEREMID") row_number() OVER (ORDER BY "PEREMID") AS "No",
    "PRD" AS "Period",
    "PEREMNM" AS "Remark",
    "CHGBY" AS "Updated By",
    date("UPAT") AS "Last Update"
   FROM t_performremarks tp;

-- RISK OWNER
CREATE OR REPLACE VIEW public.v_risk_owner AS
SELECT DISTINCT ON (tr."ROWID") t."LTEXT" AS "Bussiness Unit",
    tr."PRD" AS "Period",
    tr."ROWNM" AS "NAME",
    t2."LTEXT" as "Status",
    tr."NIK",
    tr."SELBY" as "Personel RM",
    tr."SELEML" as "Email Personel RM"
   FROM t_riskowner tr
     LEFT JOIN t_object t ON tr."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON tr."NSTRO"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTRO'::text
  WHERE tr."ENDDA" = '2999-01-01'::date AND tr."ISACT" = true AND EXTRACT(year FROM tr."STASS") = 2025::numeric;

--  risk champion list
CREATE OR REPLACE VIEW public.v_risk_champion_list AS
SELECT DISTINCT ON (trl."RCLUID") 
	t."LTEXT" AS "Bussiness Unit",
	trl."PRD" AS "Period",
    trl."RCLNUM" AS "Total Risk Champion",
    trl."RCHNM" AS "Risk Champion Coordinator",
    COALESCE(t2."LTEXT", 'Active'::character varying) AS "Status"
   FROM t_rickchampion_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_riskchampion tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTRC"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTRC'::text
  ORDER BY trl."RCLUID", trl."PRD" DESC;

-- risk champion detail
CREATE OR REPLACE VIEW public.v_risk_champion_detail AS
 SELECT DISTINCT ON (trc."RCHID") 
 	trc."RCHNM" AS "Name",
    trc."STAT" AS "Status",
    t."LTEXT" AS "Bussiness Unit",
    tro."ROWNM" AS "RISK OWNER"
   FROM t_riskchampion trc
     LEFT JOIN t_object t ON trc."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_riskowner tro ON trc."BUCD"::text = tro."BUCD"::text AND trc."PRD" = tro."PRD"
  WHERE trc."ENDDA" = '2999-01-01'::date;


-- list Reviewer
CREATE OR REPLACE VIEW public.v_reviewer_list AS
SELECT DISTINCT ON (trl."RVLUID") 
	t."LTEXT" AS "Bussiness Unit",
    trl."PRD" AS "Period",
    trl."RLNUM" AS "Total Risk Reviewer",
    COALESCE(t2."LTEXT", 'Active'::character varying) AS "STATUS"
   FROM t_reviewer_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_reviewer tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTNR"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTNR'::text;

-- reviewer detail
CREATE OR REPLACE VIEW public.v_reviewer_detail AS
SELECT DISTINCT ON (tr."RVWID") 
	tr."RVWNM" AS "Name",
    t."LTEXT" AS "Bussiness Unit",
        CASE tr."ISACT"
            WHEN true THEN 'Active'::text
            WHEN false THEN 'Non Active'::text
            ELSE NULL::text
        END AS "Status",
    tr."CHGBY" AS "Change by"
   FROM t_reviewer tr
     LEFT JOIN t_object t ON tr."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
  WHERE tr."ENDDA" = '2999-01-01'::date;


-- list risk treatment view
CREATE OR REPLACE VIEW public.v_risk_treatment_list
AS 
WITH filtered_data AS (
SELECT *
FROM (
    SELECT *,
           MAX("VRSN") OVER (PARTITION BY "TRTCD") AS max_version,
           MAX(CASE WHEN "STATCD" <> 'STRE-0' THEN "VRSN"  END)
               OVER (PARTITION BY "TRTCD") AS max_valid_version
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
-- Perbaikan: Tambahkan DISTINCT pada level yang tepat dan fix JOIN condition
select DISTINCT 
    t."LTEXT" as "Bussiness Unit",
    EXTRACT(YEAR FROM fd."PRD") AS "Period",
    fd."TRTCD" as "Treatment Code", 
    fd."ADDCON" as "Additional Control",
    fd."RISKSUM" as "Risk Summary",
    fd."VRSN" as "Version",
    tgk."DDLN" as "Deadline",
    t2."LTEXT" as "Status"
FROM (
    -- Sub-query untuk memastikan unique filtered_data per TRTCD
    SELECT DISTINCT ON ("TRTCD", "VRSN") *
    FROM filtered_data
    ORDER BY "TRTCD", "VRSN" DESC, "TRILID"
) fd
left join t_object t 
    ON split_part(fd."RISKCD", '-', 1) = t."STEXT"
    AND t."ENDDA" = '2999-01-01'
left join t_grisktreatment tgk
    ON fd."TRTCD" = tgk."TRTCD"
    AND tgk."ENDDA" = '2999-01-01'
left join t_object t2 
    ON fd."STATCD" = t2."STEXT"
    AND t2."ENDDA" = '2999-01-01'  -- Fix: ganti t."ENDDA" jadi t2."ENDDA"
ORDER BY fd."TRTCD", fd."VRSN" DESC;



-- risk universe view
create or replace view public.v_risk_universe as
select 
EXTRACT(YEAR FROM trl."PRD") AS "Period",
trl."BUTOT" as  "Total Business Unit",
trl."RISKTOT" as "Total Risk"
from t_riskuniversetotal trl;

-- corporate risk period
create or replace view public.v_corporate_risk_period as
select 
EXTRACT(YEAR FROM tcp."PRD") AS "Period",
tcp."TOTAL" as "Total Risk"
from t_corporaterisktotal tcp

--Risk Database
--general information
CREATE OR REPLACE VIEW public.v_risk_database_general_info
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


--informations security
-- Risk Database
CREATE OR REPLACE VIEW public.v_risk_database_information_security
select DISTINCT ON ("IRDID")
CONCAT(tib."INFOCD",'-', EXTRACT(YEAR FROM tib."PRD")) AS "Asset Code" ,
tib."ASDESC" as "Asset Description",
tck."DESC" as "Corporate Risk Description",
tcs."CHANNM" as "Risk Chain Analysis",
	CASE
       WHEN AGE(CURRENT_DATE, tib."PRD" ) < INTERVAL '1 years'
        THEN 'Active'
        ELSE 'Non-Active'
    END AS "Key Risk",
CASE
    WHEN EXISTS (
            SELECT 1
            FROM t_iriskdatabase tib2
            WHERE tib2."IRDID" = tib."IRDID"
              AND tib2."TARECD" = tib."TARECD"
        )
        THEN 'MAPPED'
        ELSE 'NOT MAPPED'
    END AS "MAPPING"

from t_iriskdatabase tib
left join t_corporaterisk tck
	on tck."CORICD" = tib."CORICD" 
	and tck."TARECD" = tib."TARECD"
left join t_chainanalysis tcs
	on tcs."CHANCD" = tib."CHANCD" 
where tib."ENDDA" = '2999-01-01'


   
--Key Risk List Library
--  general information
create or replace view v_keyrisklist_generalinfo as
select DISTINCT ON ("ID")
CONCAT(tgl."REFCD",'-', EXTRACT(YEAR FROM tgl."PRD")) AS "REFERENCE" ,
tgl."STATCD" as "Status ",
tgl."DESC" as "Risk Description",
tgl."ENFOD" as "Set as Library Dropdown List",
tgl."ENFOR" as "Enforce Risk for Business Unit"
from t_gkeylist tgl
where tgl."ENDDA" = '2999-01-01'

   
--Key Risk List Library
--information security
create or replace view v_keyrisklist_informationsecurity as
select 
CONCAT(ti."REFCD",'-', EXTRACT(YEAR FROM ti."PRD")) AS "REFERENCE" ,
ti."ASDESC" as "Asset Description",
ti."ENFOD" as "Set as Library Dropdown List",
ti."ENFOR" as "Enforce Risk for Business Unit"
from t_ikeylist ti 


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













ALTER view v_keyrisklist_generalinfo as
	SELECT DISTINCT ON ( tgl."ID") 
	concat( "REFCD", '-', EXTRACT(year FROM "PRD")) AS "REFERENCE",
      t."LTEXT" AS "Status",
     "DESC" AS "Risk Description",
     "ENFOD" AS "Set as Library Dropdown List",
     "ENFOR" AS "Enforce Risk for Business Unit"
   FROM t_gkeylist tgl
  LEFT JOIN t_object t on "STATCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
  where  tgl. "ENDDA" = '2999-01-01'::date;






WITH base AS (

  /* =======================
     QUERY 1 : TABLE A + B + C
     ======================= */
  SELECT
    "PRD",
    "ENDDA",
    "VRSN",
    MAX("STATCD") AS "STATCD",
    split_part("RISKCD", '-', 1) AS riskcd_clean,

    COUNT(*) AS total_q1,
    COUNT(*) FILTER (
      WHERE "STATCD" <> 'SREG-1'
      and "STATCD" <> 'SREG-7'
    ) AS total_q1_endda,

    0 AS total_q2,
    0 AS total_q2_endda

  FROM (
    SELECT "PRD", "VRSN", "RISKCD", "ENDDA", "STATCD" FROM t_grisklist
--    UNION ALL
--    SELECT "PRD", "VRSN", "RISKCD", "ENDDA", "STATCD" FROM m_grisklist
    UNION ALL
    SELECT "PRD", "VRSN", "RISKCD", "ENDDA", "STATCD" FROM t_dup_grisklist
  ) q1
  WHERE "RISKCD" IS NOT NULL
  AND "ENDDA" = '2999-01-01'
  GROUP BY
    "PRD", "ENDDA", "VRSN", split_part("RISKCD", '-', 1)

  UNION ALL

  /* =======================
     QUERY 2 : TABLE D + F + G
     ======================= */
  SELECT
    "PRD",
    "ENDDA",
    "VRSN",
    MAX("STATCD") AS "STATCD",
    split_part("RISKCD", '-', 1) AS riskcd_clean,

    0 AS total_q1,
    0 AS total_q1_endda,

    COUNT(*) AS total_q2,
    COUNT(*) FILTER (
        WHERE "STATCD" <> 'SREG-1'
        and "STATCD" <> 'SREG-7'
    ) AS total_q2_endda

  FROM (
    SELECT "PRD", "VRSN", "RISKCD", "ENDDA", "STATCD" FROM t_irisklist
--    UNION ALL
--    SELECT "PRD", "VRSN", "RISKCD", "ENDDA", "STATCD" FROM m_irisklist
    UNION ALL
    SELECT "PRD", "VRSN", "RISKCD", "ENDDA", "STATCD" FROM t_dup_irisklist
  ) q2
  WHERE "RISKCD" IS NOT NULL
  AND "ENDDA" = '2999-01-01'
  GROUP BY
    "PRD", "ENDDA", "VRSN", split_part("RISKCD", '-', 1)
)

SELECT
  b."PRD" as "Period",
  b."VRSN" as "Version",
--  MAX("STATCD") AS "STATCD",
 
  b."riskcd_clean",
  t2."LTEXT" as "Bussiness Unit",
  trc."RCHNM" AS "Risk Champion",

  SUM(total_q1) AS "General info",
  SUM(total_q1_endda) AS "General Info Active",

  SUM(total_q2) AS "Info Security",
  SUM(total_q2_endda) AS "Info Security Active"

--  SUM(total_q1 + total_q2) AS total_all

FROM base b
LEFT JOIN (
	SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"
	FROM t_object 
	WHERE "ENDDA" = '2999-01-01'
	ORDER BY "STEXT", "LTEXT"
) t2 ON b."riskcd_clean" = t2."STEXT" 

LEFT JOIN (
	SELECT DISTINCT ON ("BUCD") "BUCD", "RCHNM"
	FROM t_rickchampion_list 
	WHERE "ENDDA" = '2999-01-01'
	ORDER BY "BUCD", "RCHNM"
) trc ON trc."BUCD"::text = b."riskcd_clean"
GROUP BY
  b."PRD",
  b."VRSN",
  b.riskcd_clean,
  t2."LTEXT",
  trc."RCHNM"
  
ORDER BY
  b."PRD", b."VRSN", b.riskcd_clean;

-- Risk List Final View (Keep All Data)
-- v1 risk list final view
-- harus join ke table lain untuk ambil deskripsi dan detail lain
-- mengg
CREATE OR REPLACE VIEW v_risk_list_final AS
WITH base_data AS (
    -- UNION ALL: Gabungkan semua data tanpa hilangkan apapun
    SELECT "PRD", "RISKCD", "STATCD", "OBJTV",'General' as source_type
    FROM t_grisklist
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
    
    UNION ALL
    
    SELECT "PRD", "RISKCD", "STATCD","OBJTV", 'InfoSec' as source_type
    FROM t_dup_grisklist  
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
)
-- LEFT JOIN: Ambil deskripsi dari master tables
SELECT 
    bd."PRD",
    bd."RISKCD",
    bd.source_type,
    bd."OBJTV",
    obj."LTEXT" as "Business Unit",
    stat."LTEXT" as "Status Description"
FROM base_data bd
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) obj ON split_part(bd."RISKCD", '-', 1) = obj."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"  
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) stat ON bd."STATCD" = stat."STEXT";


-- v2 risk list final view with risk type
CREATE OR REPLACE VIEW v_risk_list_final_with_type AS
WITH base_data AS (
    -- UNION ALL: Gabungkan semua data tanpa hilangkan apapun
    SELECT "PRD", "RISKCD", "STATCD","VRSN", "OBJTV",'General' as source_type
    FROM t_grisklist
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
    
    UNION ALL
    
    SELECT "PRD", "RISKCD", "STATCD","VRSN","OBJTV", 'InfoSec' as source_type
    FROM t_dup_grisklist  
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
)
-- LEFT JOIN: Ambil deskripsi dari master tables
SELECT 
    bd."PRD",
    bd."RISKCD",
    bd."VRSN",
    bd.source_type,
    obj."LTEXT" as "Business Unit",
    bd."OBJTV" as "Status",
    stat."LTEXT" as "Status Description",
    bd."STATCD",
    rtpe."RISKTPE"
    
FROM base_data bd
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) obj ON split_part(bd."RISKCD", '-', 1) = obj."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"  
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) stat ON bd."STATCD" = stat."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("RISKCD", "PRD", "VRSN") "RISKCD", "PRD", "VRSN", "RISKTPE"
    FROM t_griskidentification 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "RISKCD", "PRD", "VRSN"
) rtpe 
ON bd."RISKCD" = rtpe."RISKCD" 
and bd."PRD" = rtpe."PRD"
and bd."VRSN" = rtpe."VRSN";

-- verisi gacor king
-- v3 risk list final view with risk type and risk source
CREATE OR REPLACE VIEW v_risk_list_general_inf_detail AS
WITH base_data AS (
    -- UNION ALL: Gabungkan semua data tanpa hilangkan apapun
    SELECT "PRD", "RISKCD", "STATCD","VRSN","RSCR","RISKSUM","DVSN", "OBJTV",'General' as source_type
    FROM t_grisklist
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
    
    UNION ALL
    
    SELECT "PRD", "RISKCD", "STATCD","VRSN","RSCR","RISKSUM","DVSN","OBJTV", 'InfoSec' as source_type
    FROM t_dup_grisklist  
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
)
-- LEFT JOIN: Ambil deskripsi dari master tables
SELECT 
    bd."PRD" as "Period",
    bd."VRSN"as "Version",
    obj."LTEXT" as "Business Unit",
    bd."OBJTV" as "Objecttive",
    stat."LTEXT" as "Status Description",
--    bd."STATCD" as "",
    rtpe."RISKTPE" as "Risk Type",
--    bd."RSCR" 
    rist."LTEXT" as "Risk Source",
    bd."RISKCD" as "Risk Code",
    bd."RISKSUM" as "Risk Summary",
    bd."DVSN" as "Division"
    
FROM base_data bd
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) obj ON split_part(bd."RISKCD", '-', 1) = obj."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"  
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) stat ON bd."STATCD" = stat."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"  
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) rist ON bd."RSCR" = rist."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("RISKCD", "PRD", "VRSN") "RISKCD", "PRD", "VRSN", "RISKTPE"
    FROM t_griskidentification 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "RISKCD", "PRD", "VRSN"
) rtpe 
ON bd."RISKCD" = rtpe."RISKCD" 
and bd."PRD" = rtpe."PRD"
and bd."VRSN" = rtpe."VRSN";


-- VERSI GACOR KING WOKK DAMNN !( SAWIT)
CREATE OR REPLACE VIEW v_risk_list_information_sec_detail AS
WITH base_data AS (
    -- UNION ALL: Gabungkan semua data tanpa hilangkan apapun
    SELECT "PRD", "RISKCD", "STATCD","VRSN","RSCR","DVSN","DESC", "OBJTV",'General' as source_type
    FROM t_irisklist
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
    
    UNION ALL
    
    SELECT "PRD", "RISKCD", "STATCD","VRSN","RSCR","DVSN","DESC", "OBJTV", 'InfoSec' as source_type
    FROM t_dup_irisklist  
    WHERE "ENDDA" = '2999-01-01'
      AND "RISKCD" IS NOT NULL
)
-- LEFT JOIN: Ambil deskripsi dari master tables
SELECT 
    bd."PRD" as "Period",
    bd."VRSN"as "Version",
    obj."LTEXT" as "Business Unit",
    bd."OBJTV" as "Objecttive",
    stat."LTEXT" as "Status",
    bd."RISKCD" as "Asset Code",
    bd."DESC" as "Description"
    
FROM base_data bd
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) obj ON split_part(bd."RISKCD", '-', 1) = obj."STEXT"
LEFT JOIN (
    SELECT DISTINCT ON ("STEXT") "STEXT", "LTEXT"  
    FROM t_object 
    WHERE "ENDDA" = '2999-01-01'
    ORDER BY "STEXT", "LTEXT"
) stat ON bd."STATCD" = stat."STEXT"


-- public.v_risk_register source

CREATE OR REPLACE VIEW public.v_risk_register
AS WITH base AS (
         SELECT q1."PRD",
            q1."ENDDA",
            q1."VRSN",
            max(q1."STATCD"::text) AS "STATCD",
            split_part(q1."RISKCD"::text, '-'::text, 1) AS riskcd_clean,
            count(*) AS total_q1,
            count(*) FILTER (WHERE q1."STATCD"::text <> 'SREG-1'::text AND q1."STATCD"::text <> 'SREG-7'::text) AS total_q1_endda,
            0 AS total_q2,
            0 AS total_q2_endda
           FROM ( SELECT t_grisklist."PRD",
                    t_grisklist."VRSN",
                    t_grisklist."RISKCD",
                    t_grisklist."ENDDA",
                    t_grisklist."STATCD"
                   FROM t_grisklist
                UNION ALL
                 SELECT t_dup_grisklist."PRD",
                    t_dup_grisklist."VRSN",
                    t_dup_grisklist."RISKCD",
                    t_dup_grisklist."ENDDA",
                    t_dup_grisklist."STATCD"
                   FROM t_dup_grisklist) q1
          WHERE q1."RISKCD" IS NOT NULL AND q1."ENDDA" = '2999-01-01'::date
          GROUP BY q1."PRD", q1."ENDDA", q1."VRSN", (split_part(q1."RISKCD"::text, '-'::text, 1))
        UNION ALL
         SELECT q2."PRD",
            q2."ENDDA",
            q2."VRSN",
            max(q2."STATCD"::text) AS "STATCD",
            split_part(q2."RISKCD"::text, '-'::text, 1) AS riskcd_clean,
            0 AS total_q1,
            0 AS total_q1_endda,
            count(*) AS total_q2,
            count(*) FILTER (WHERE q2."STATCD"::text <> 'SREG-1'::text AND q2."STATCD"::text <> 'SREG-7'::text) AS total_q2_endda
           FROM ( SELECT t_irisklist."PRD",
                    t_irisklist."VRSN",
                    t_irisklist."RISKCD",
                    t_irisklist."ENDDA",
                    t_irisklist."STATCD"
                   FROM t_irisklist
                UNION ALL
                 SELECT t_dup_irisklist."PRD",
                    t_dup_irisklist."VRSN",
                    t_dup_irisklist."RISKCD",
                    t_dup_irisklist."ENDDA",
                    t_dup_irisklist."STATCD"
                   FROM t_dup_irisklist) q2
          WHERE q2."RISKCD" IS NOT NULL AND q2."ENDDA" = '2999-01-01'::date
          GROUP BY q2."PRD", q2."ENDDA", q2."VRSN", (split_part(q2."RISKCD"::text, '-'::text, 1))
        )
 SELECT b."PRD" AS "Period",
    b."VRSN" AS "Version",
    t2."LTEXT" AS "Bussiness Unit",
    trc."RCHNM" AS "Risk Champion",
    sum(b.total_q1) AS "General info",
    sum(b.total_q1_endda) AS "General Info Active",
    sum(b.total_q2) AS "Info Security",
    sum(b.total_q2_endda) AS "Info Security Active",
    tstat."LTEXT" AS "Risk Register Status"
   FROM base b
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") t2 ON b.riskcd_clean = t2."STEXT"::text
     LEFT JOIN ( SELECT DISTINCT ON (t_rickchampion_list."BUCD") t_rickchampion_list."BUCD",
            t_rickchampion_list."RCHNM"
           FROM t_rickchampion_list
          WHERE t_rickchampion_list."ENDDA" = '2999-01-01'::date
          ORDER BY t_rickchampion_list."BUCD", t_rickchampion_list."RCHNM") trc ON trc."BUCD"::text = b.riskcd_clean
    LEFT JOIN ( SELECT DISTINCT on (t_riskregisterstatus."BUCD", t_riskregisterstatus."PRD", t_riskregisterstatus."VRSN") 
            t_riskregisterstatus."STATCD",
            t_riskregisterstatus."BUCD",
            t_riskregisterstatus."PRD",
            t_riskregisterstatus."VRSN"
           FROM t_riskregisterstatus
          WHERE t_riskregisterstatus."ENDDA" = '2999-01-01'::date
          ORDER BY t_riskregisterstatus."BUCD", t_riskregisterstatus."PRD", t_riskregisterstatus."VRSN") trs 
    ON trs."BUCD"::text = b.riskcd_clean
    AND trs."PRD" = b."PRD"
    AND trs."VRSN" = b."VRSN"
    LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") tstat ON trs."STATCD" = tstat."STEXT"
    
  GROUP BY b."PRD", b."VRSN", b.riskcd_clean, t2."LTEXT", trc."RCHNM", tstat."LTEXT"
  ORDER BY b."PRD", b."VRSN", b.riskcd_clean;


 CREATE OR REPLACE VIEW public.v_inventor AS
 WITH buscdinv AS (
select DISTINCT ON ("INVNM") 
ti."INVNM" as "NAME",
CASE ti."ISACT"
    WHEN true THEN 'Active'
    WHEN false THEN 'Non Active'
  END AS "Status",
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
  mc."Status",
  mc."Personel RM",
--  mc."BUCD",
  t."LTEXT" as "Bussiness Unit",
  CASE 
        WHEN t."LTEXT" IS NULL THEN 'Non-Active'
        ELSE 'Active'
  END AS "Status Bussiness Unit"
FROM buscdinv mc
left join t_object t 
	on  mc."BUCD" = t."STEXT" 
	and t."ENDDA" = '2999-01-01'
GROUP BY t."LTEXT", mc."NAME", mc."Status", mc."Personel RM", mc."BUCD"
ORDER BY mc."NAME";