-- DROP FUNCTION public.fn_dashboard_concern_percentage(varchar);

CREATE OR REPLACE FUNCTION public.fn_dashboard_concern_percentage(p_year_text character varying DEFAULT NULL::character varying)
 RETURNS TABLE(status character varying, jumlah bigint, persentase numeric)
 LANGUAGE sql
 STABLE
AS $function$
WITH params AS (
    SELECT
        NULLIF(BTRIM(p_year_text), '')::int AS year_int
),
base_concern AS (
    SELECT
        trc.report_id,
        trc.action_id,
        trc.created_at,
        trc.id
    FROM "T_REPORT_CONCERN" trc
    JOIN "T_REPORT" tr ON tr.id = trc.report_id
    CROSS JOIN params p
    WHERE tr.deleted_at IS NULL
      AND tr.is_active = TRUE
      AND trc.is_active = TRUE
      AND (p.year_int IS NULL OR EXTRACT(YEAR FROM tr.created_at) = p.year_int)
),
latest_concern AS (
    SELECT DISTINCT ON (bc.report_id)
        bc.report_id,
        bc.action_id
    FROM base_concern bc
    ORDER BY bc.report_id, bc.created_at DESC, bc.id DESC
),
classified AS (
    SELECT
        CASE
            WHEN mac.code_concern = 'CC-0002' THEN 'Concern'
            ELSE 'UnConcern'
        END::varchar AS status
    FROM latest_concern lc
    LEFT JOIN "M_ACTION_CONCERN" mac ON mac.id = lc.action_id
),
aggregated AS (
    SELECT
        status,
        COUNT(*) AS jumlah
    FROM classified
    GROUP BY status
),
bucket AS (
    SELECT 'Concern'::varchar AS status
    UNION ALL
    SELECT 'UnConcern'::varchar AS status
),
final AS (
    SELECT
        b.status,
        COALESCE(a.jumlah, 0) AS jumlah
    FROM bucket b
    LEFT JOIN aggregated a ON a.status = b.status
)
SELECT
    status,
    jumlah,
    ROUND(
        CASE
            WHEN SUM(jumlah) OVER () = 0 THEN 0
            ELSE jumlah * 100.0 / SUM(jumlah) OVER ()
        END
    , 2) AS persentase
FROM final
ORDER BY status;
$function$
;
