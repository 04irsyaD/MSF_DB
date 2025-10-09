SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'   -- ganti dengan schema kamu
  AND table_name   = 't_users'; -- ganti dengan nama table


  "CATMPL" 
	"DVSN" 
	"RSCR" 
	"RISKTPE"

  -- DROP FUNCTION public.f_griskreferencesupdate();

CREATE OR REPLACE FUNCTION public.f_griskreferencesupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GRiskIdentification a
	SET 
		"OBJTV" = b."OBJTV",
		"RISK" = b."RISK",
		"PRONM" = b."PRONM",
		"CONCD" = b."CONCD",
		"CATCD" = b."CATCD",
		"CSCATCD" = b."CSCATCD",
		"CAUSE" = b."CAUSE",
		"EXCON" = b."EXCON",
		"IMCRCD" = b."IMCRCD",
		"CHGDA" = b."CHGDA",
		"CATMPL" = b."CATMPL",
		"DVSN" = b."DVSN",
		"RSCR" = b."RSCR",
		"RISKTPE"= b."RISKTPE"
	 
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_GKeyIdentification b, t_GRiskList c
--	WHERE a."REFCD" = b."REFCD" AND a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2')
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_GKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND c."STATCD" IN ('SREG-1', 'SREG-2'); --AND a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2')
	RETURN NEW;
END;
$function$
;
