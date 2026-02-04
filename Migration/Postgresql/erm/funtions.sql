CREATE OR REPLACE FUNCTION public.f_irisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW."REFCD" IS NOT NULL THEN
        INSERT INTO t_IRiskList (
            "OBJTV", "RISKCD", "DESC", "IDASCD", "PRD", "INFOCD", 
            "REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD", "RSCR"
        )
        SELECT 
            b."IDASNM", 
            i."RISKCD", 
            a."ASDESC", 
            i."IDASCD", 
            i."PRD", 
            i."INFOCD", 
            i."REFCD", 
            i."VRSN", 
            i."CHGDA", 
            i."CHGBY", 
            'SREG-1' AS "STATCD", 
            NULL AS "PRGS", 
            i."REFPRD", 
            i."RSCR"
        FROM t_IRiskIdentification i
        LEFT JOIN t_IdAssets b ON i."IDASCD" = b."IDASCD" 
        LEFT JOIN t_InAssets a ON 
            i."RISKCD" = a."RISKCD" 
            AND i."PRD" = a."PRD"
            AND i."VRSN" = a."VRSN"
        WHERE i."INFOCD" = NEW."INFOCD"
          AND i."PRD" = NEW."PRD"
          AND i."VRSN" = NEW."VRSN"
          AND i."RISKCD" = NEW."RISKCD"
        ORDER BY i."CRAT" DESC
        LIMIT 1; 
    END IF;

    IF NEW."REFCD" IS NULL THEN
        INSERT INTO t_IRiskList (
            "OBJTV", "RISKCD", "DESC", "IDASCD", "PRD", "INFOCD", 
            "REFCD", "VRSN", "CHGDA", "CHGBY", "REFPRD", "RSCR"
        )
        SELECT 
            b."IDASNM", 
            i."RISKCD", 
            a."ASDESC", 
            i."IDASCD", 
            i."PRD", 
            i."INFOCD", 
            i."REFCD", 
            i."VRSN", 
            i."CHGDA", 
            i."CHGBY", 
            i."REFPRD", 
            i."RSCR"
        FROM t_IRiskIdentification i
        LEFT JOIN t_IdAssets b ON i."IDASCD" = b."IDASCD" 
        LEFT JOIN t_InAssets a ON 
            i."RISKCD" = a."RISKCD" 
            AND i."PRD" = a."PRD"
            AND i."VRSN" = a."VRSN"
        WHERE i."INFOCD" = NEW."INFOCD"
          AND i."PRD" = NEW."PRD"
          AND i."VRSN" = NEW."VRSN"
          AND i."RISKCD" = NEW."RISKCD"
        ORDER BY i."CRAT" DESC
        LIMIT 1; 
    END IF;

    RETURN NEW;
END;
$function$
;