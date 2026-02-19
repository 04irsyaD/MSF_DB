select 
tr.id,
mac.name_concern
from "T_REPORT" tr 
left join "T_REPORT_CONCERN" trc  on tr.id = trc.report_id
left join "M_ACTION_CONCERN" mac on trc.action_id = mac.id 
where tr.deleted_at is null 

-- ============================================
-- Query Persentase Data Berdasarkan Status (M_ACTION_CONCERN)
-- ============================================

-- Persentase setiap status berdasarkan name_concern
--  persentase select doang belum ke rposedure
SELECT 
    mac.name_concern AS status,
    COUNT(*) AS jumlah,
    ROUND(
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 
        2
    ) AS persentase
FROM "T_REPORT" tr 
right JOIN "T_REPORT_CONCERN" trc ON tr.id = trc.report_id
LEFT JOIN "M_ACTION_CONCERN" mac ON trc.action_id = mac.id 
WHERE tr.deleted_at IS NULL
GROUP BY mac.name_concern
ORDER BY jumlah DESC;



-- ini query selct untuk content Concern unconcern
SELECT 
    mac.name_concern AS status,
    COUNT(*) AS jumlah,
    ROUND(
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 
        2
    ) AS persentase
FROM "T_REPORT" tr 
right JOIN "T_REPORT_CONCERN" trc ON tr.id = trc.report_id
LEFT JOIN "M_ACTION_CONCERN" mac ON trc.action_id = mac.id 
WHERE tr.deleted_at IS NULL
GROUP BY mac.name_concern
ORDER BY jumlah DESC;

-- ini query untuk content  pengaduan baesed on status
select 
--COUNT(*) AS jumlah
--tr.wbs_code 
COUNT(DISTINCT tr.id) AS "total_pengaduan",
COUNT(DISTINCT tri.id) AS "total_pemeriksaan",
COUNT(DISTINCT trv.id) AS "total_validasi",
COUNT(msr.id) AS "total_tidak_sesuai",
COUNT(msr2.id) as "total_cek_kelengkapan"
from  "T_REPORT" tr 
left join "T_REPORT_INSPECTION" tri 
	on tr.id = tri.report_id
	and tri.deleted_at IS null
left join "T_REPORT_VALIDATION" trv 
	on tr.id = trv.report_id 
	and trv.deleted_at is null
left join "M_STATUS_REPORT" msr 
	on tr.status_report_id = msr.id 
	and msr.name_status = 'TIDAK SESUAI'
left join "M_STATUS_REPORT" msr2 
	on tr.status_report_id = msr2.id 
	and msr2.name_status IN ('NEW', 'DRAFT')
--	and msr2.name_status  = 'NEW'
--	and msr2.name_status  = 'DRAFT'
where tr.deleted_at IS null;

-- jenis pengaduan berdasarkan identity
select 
mtr.name_type_short_idn, 
mi.identity_title_eng,
count(mi.id) as "Jenis pengguna",
COUNT(DISTINCT mtr.id) AS "total_pengaduan"
from  "T_REPORT" tr 
left join "M_IDENTITY" mi  on tr.identity_id = mi.id 
left join "R_SELECT_TYPE_REPORT" rstr on tr.id = rstr.report_id 
left join "M_TYPE_REPORT" mtr on rstr.type_report_id  = mtr.id 
where tr.deleted_at IS null
group by mi.identity_title_eng,mtr.name_type_short_idn


-- total pengguna berdasarkan identity
SELECT 
    EXTRACT(YEAR FROM tr.created_at)::INTEGER AS tahun,
    EXTRACT(MONTH FROM tr.created_at)::INTEGER AS bulan,
    TO_CHAR(tr.created_at, 'FMMonth') AS nama_bulan,
    mi.identity_title_eng,
    COUNT(mi.id) AS "Jumlah Pengguna"
FROM "T_REPORT" tr 
LEFT JOIN "M_IDENTITY" mi ON tr.identity_id = mi.id
WHERE tr.deleted_at IS NULL
GROUP BY EXTRACT(YEAR FROM tr.created_at), EXTRACT(MONTH FROM tr.created_at), TO_CHAR(tr.created_at, 'FMMonth'), mi.identity_title_eng
ORDER BY tahun DESC, bulan ASC, "Jumlah Pengguna" DESC;



