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