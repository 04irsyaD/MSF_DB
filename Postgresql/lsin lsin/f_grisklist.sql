f_grisklist


-- DROP FUNCTION public.f_grisklist();

CREATE OR REPLACE FUNCTION public.f_grisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN
--IF NEW."REFCD" IS NOT NULL AND NEW."VRSN" = 0 THEN
IF NEW."REFCD" IS NOT NULL THEN
	INSERT INTO t_GRiskList ("OBJTV", "RISKCD", "RISKSUM", "PRD", "REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD")
	SELECT g."OBJTV", g."RISKCD", g."RISK", g."PRD", g."REFCD", g."VRSN", g."CHGDA", g."CHGBY", 'SREG-1' AS "STATCD", NULL AS "PRGS", g."REFPRD"
	FROM t_GRiskIdentification g
	ORDER BY g."CRAT" 
	DESC limit 1;
END IF;

--IF NEW."REFCD" IS NOT NULL AND NEW."VRSN" > 0 THEN
--	INSERT INTO t_GRiskList ("OBJTV", "RISKCD", "RISKSUM", "PRD", "REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD")
--	SELECT g."OBJTV", g."RISKCD", g."RISK", g."PRD", g."REFCD", g."VRSN", g."CHGDA", g."CHGBY", 'SREG-2' AS "STATCD", NULL AS "PRGS", g."REFPRD"
--	FROM t_GRiskIdentification g
--	ORDER BY g."CRAT" 
--	DESC limit 1;
--END IF;

IF NEW."REFCD" IS NULL THEN
	INSERT INTO t_GRiskList ("OBJTV", "RISKCD", "RISKSUM", "PRD", "REFCD", "VRSN", "CHGDA", "CHGBY", "REFPRD")
	SELECT g."OBJTV", g."RISKCD", g."RISK", g."PRD", g."REFCD", g."VRSN", g."CHGDA", g."CHGBY", g."REFPRD"
	FROM t_GRiskIdentification g
	ORDER BY g."CRAT" 
	DESC limit 1;
END IF;

	RETURN NEW;
END;
$function$
;


