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