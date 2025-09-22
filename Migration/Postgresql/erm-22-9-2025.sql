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

add masterdata t_acces
BEGDATE         ENDATE           ACSID                                      ACSCD                                                           ACSNM                                     CRAT                                 CHGDATE           CHGBY
2025-09-09      2999-12-31      "d66d9696-a053-42d2-99bc-834e4679bc77"      "risk_treatment__pic_deadline" "No specific treatment"          "Risk Treatment Pic Deadline"             2025-09-09 13:34:14.072 +0700        2025-09-09        Jihan/Irsyad
2025-09-09      2999-12-31      "d66d9696-a053-42d2-99bc-834e4679bc77"      "risk_treatment__only_pic_deadline" "Considered treatment"      "Risk Treatment Only Pic Deadline"        2025-09-09 13:34:14.072 +0700        2025-09-09        Jihan/Irsyad


last udapte in table t_evidencele

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


-- kondistional update



