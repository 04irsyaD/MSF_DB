UPDATE t_riskowner
SET "PRD" = EXTRACT(YEAR from "BEGDA")::INT;   --- COLUMN PRD

