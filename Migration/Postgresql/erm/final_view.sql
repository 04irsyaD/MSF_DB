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
