CREATE OR REPLACE VIEW public.v_business_unit
AS SELECT "BUCD" AS "Bussiness Unit Code",
    "BUNM" AS "Bussiness Unit",
    "CHGBY" AS "Changed by"
   FROM t_businessunit tb
  WHERE "ENDDA" = '2999-01-01'::date;

  