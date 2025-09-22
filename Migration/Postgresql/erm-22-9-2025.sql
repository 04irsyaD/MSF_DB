-- MIGRATION DEV TO STAGG

alter table t_risk_champion 
add COLUMN
"NSTRC" varchar NULL,
"CDTR" bool NULL,
"PRD" int4 NULL

alter Table t_risk_owner
add COLUMN
"NSTRO" varchar NULL,
"PRD" int4 NULL;

ALTER TABLE t_irisktreatment
ADD COLUMN
"TRTSRC" varchar(50) NULL



