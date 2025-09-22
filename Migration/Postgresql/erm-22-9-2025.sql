-- MIGRATION DEV TO STAGG

alter table t_risk_champion 
add COLUMN
"NSTRC" varchar NULL,
"CDTR" bool NULL,
"PRD" int4 NULL


