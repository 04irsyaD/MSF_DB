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

--  risk champion
CREATE OR REPLACE VIEW public.v_risk_champion AS
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


-- list Reviewer
CREATE OR REPLACE VIEW public.v_list_reviewer AS
SELECT DISTINCT ON (trl."RVLUID") 
	t."LTEXT" AS "Bussiness Unit",
    trl."PRD" AS "Period",
    trl."RLNUM" AS "Total Risk Reviewer",
    COALESCE(t2."LTEXT", 'Active'::character varying) AS "STATUS"
   FROM t_reviewer_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_reviewer tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTNR"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTNR'::text;