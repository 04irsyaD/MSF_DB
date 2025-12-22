
CREATE OR REPLACE FUNCTION public.f_irisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
-- Rafi Mahrus 27 Agust 2025
BEGIN
IF NEW."REFCD" IS NOT NULL THEN
	INSERT INTO t_IRiskList ("OBJTV", "RISKCD", "DESC", "IDASCD", "PRD", "INFOCD", "REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD", "REFID")
	SELECT b."IDASNM", a."RISKCD", a."ASDESC", a."IDASCD", a."PRD", a."INFOCD", a."REFCD", a."VRSN", a."CHGDA", a."CHGBY", 'SREG-1' AS "STATCD", NULL AS "PRGS", a."REFPRD", a."REFID"
	FROM t_InAssets a
	LEFT JOIN t_IdAssets b ON a."IDASCD" = b."IDASCD" 
	ORDER BY a."CRAT" 
	DESC LIMIT 1; 
END IF;

	
IF NEW."REFCD" IS NULL THEN
	INSERT INTO t_IRiskList ("OBJTV", "RISKCD", "DESC", "IDASCD", "PRD", "INFOCD", "REFCD", "VRSN", "CHGDA", "CHGBY", "REFPRD", "REFID")
	SELECT b."IDASNM", a."RISKCD", a."ASDESC", a."IDASCD", a."PRD", a."INFOCD", a."REFCD", a."VRSN", a."CHGDA", a."CHGBY", a."REFPRD", a."REFID"
	FROM t_InAssets a
	LEFT JOIN t_IdAssets b ON a."IDASCD" = b."IDASCD" 
	ORDER BY a."CRAT" 
	DESC LIMIT 1; 
END IF;

	RETURN NEW;
END;
$function$


-- DROP FUNCTION public.f_maxiresidualrisk();

CREATE OR REPLACE FUNCTION public.f_maxiresidualrisk()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GResidualRisk c
    SET 
		"TGTLICD"  = subquery."TGTLICD",
		"TGTLI"   = subquery."TGTLI",
		"TGTIMCD"   = subquery."TGTIMCD",
		"TGTIM" = subquery."TGTIM",
		"TGTRISC"   = subquery."TGTRISC",
		"TGTRISCAT"   = subquery."TGTRISCAT",
		"CRAT"   = subquery."CRAT",
		"CHGDA"  = subquery."CHGDA",
		"CHGBY"  = subquery."CHGBY"
--		"PRD"    = subquery."PRD"
   
    FROM (
    SELECT a."RISKCD", a."PRD", d."INFOCD", d."TGTLICD", d."TGTLI", d."TGTIMCD", d."TGTIM", d."TGTRISC", d."TGTRISCAT",
    d."CRAT", d."CHGDA", d."CHGBY", MAX(b."INRISCO") AS max_inrisco
    FROM t_IRiskIdentification a
    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
    JOIN t_IResidualRisk d ON a."RISKCD" = d."RISKCD" AND a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD"
    WHERE b."INRISCO" IS NOT NULL
    AND d."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
    GROUP BY a."RISKCD", a."PRD", d."INFOCD", d."TGTLICD", d."TGTLI", d."TGTIMCD", d."TGTIM", d."TGTRISC", d."TGTRISCAT",
    d."CRAT", d."CHGDA", d."CHGBY"
    ORDER BY 13 ASC, 10 ASC

) AS subquery

WHERE c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD";
	
	
--UPDATE t_GResidualRisk a
--SET 
----	"TGTLICD" 	= (SELECT b."TGTLICD"
----				   FROM t_IResidualRisk b, t_IRiskMeasurement c
----				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
----				   AND c."INRISCO" IS NOT NULL
----				   ORDER BY c."INRISCO" DESC
----				   LIMIT 1),
--	"TGTLI" 	= (SELECT b."TGTLI"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
----	"TGTIMCD" 	= (SELECT b."TGTIMCD"
----				   FROM t_IResidualRisk b, t_IRiskMeasurement c
----				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
----				   AND c."INRISCO" IS NOT NULL
----				   ORDER BY c."INRISCO" DESC
----				   LIMIT 1),
--	"TGTIM" 	= (SELECT b."TGTIM"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"TGTRISC" 	= (SELECT b."TGTRISC"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"TGTRISCAT" = (SELECT b."TGTRISCAT"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"CRAT" 		= (SELECT b."CRAT"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"CHGDA" 	= (SELECT b."CHGDA"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"CHGBY" 	= (SELECT b."CHGBY"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1)
--FROM t_IResidualRisk b
--WHERE a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD";
RETURN NEW;
END;
$function$
;


-- DROP FUNCTION public.f_maxiriskmeasurement();

CREATE OR REPLACE FUNCTION public.f_maxiriskmeasurement()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GRiskMeasurement c
    SET 
		"LIHOCD"  = subquery."LIHOCD",
		"LIHOVAL"   = subquery."LIHOVAL",
		"IMVALCD"   = subquery."IMVALCD",
		"IMVAL" = subquery."IMVAL",
		"INRISCO"   = subquery."INRISCO",
		"INRICAT"   = subquery."INRICAT",
		"EXCONLI"  = subquery."EXCONLI",
		"EXCONIM"  = subquery."EXCONIM",
		"ADINLI"   = subquery."ADINLI",
		"ADINIM"   = subquery."ADINIM",
		"ADINSC"  = subquery."ADINSC",
		"ADINSCCAT"  = subquery."ADINSCCAT",
		"CRAT"   = subquery."CRAT",
		"CHGDA"  = subquery."CHGDA",
		"CHGBY"  = subquery."CHGBY"
   
    FROM (
	  	SELECT a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
				b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
				b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY", a."PRD", MAX(b."INRISCO") AS max_inrisco
	    FROM t_IRiskIdentification a
	    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
	    WHERE b."INRISCO" IS NOT NULL
	    AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
	    GROUP BY a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
				b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
				b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY", a."PRD"
		ORDER BY 19 ASC, 15 ASC

    ) AS subquery

WHERE c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD";
    
--    SELECT a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
--			b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
--			b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY", MAX(b."INRISCO") AS max_inrisco
--    FROM t_IRiskIdentification a
--    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
--    WHERE b."INRISCO" IS NOT NULL
--    GROUP BY a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
--			b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
--			b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY"
--	ORDER BY 18 ASC, 15 ASC
	
	RETURN NEW;
END;
$function$
;
