-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public."MOR_id_seq";

CREATE SEQUENCE public."MOR_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."SLA_id_seq";

CREATE SEQUENCE public."SLA_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.action_id_seq;

CREATE SEQUENCE public.action_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.aktivitas_notifikasi_id_seq;

CREATE SEQUENCE public.aktivitas_notifikasi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ba_serah_terima_barang_pemenuhan_aset_id_seq;

CREATE SEQUENCE public.ba_serah_terima_barang_pemenuhan_aset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ba_serah_terima_barang_pemenuhan_evidence_id_seq;

CREATE SEQUENCE public.ba_serah_terima_barang_pemenuhan_evidence_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ba_serah_terima_barang_pemenuhan_id_seq;

CREATE SEQUENCE public.ba_serah_terima_barang_pemenuhan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ba_serah_terima_barang_pemenuhan_qc_id_seq;

CREATE SEQUENCE public.ba_serah_terima_barang_pemenuhan_qc_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ba_serah_terima_barang_pemenuhan_tahapan_id_seq;

CREATE SEQUENCE public.ba_serah_terima_barang_pemenuhan_tahapan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.batch_id_seq;

CREATE SEQUENCE public.batch_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.check_in_id_seq;

CREATE SEQUENCE public.check_in_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.code_faq_seq;

CREATE SEQUENCE public.code_faq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.code_inventaris_asset_seq;

CREATE SEQUENCE public.code_inventaris_asset_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.code_pm_preventive_seq;

CREATE SEQUENCE public.code_pm_preventive_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.code_ticket_seq;

CREATE SEQUENCE public.code_ticket_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.condition_id_seq;

CREATE SEQUENCE public.condition_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_by_flag_counter_id_seq;

CREATE SEQUENCE public.data_barang_by_flag_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_by_status_barang_counter_id_seq;

CREATE SEQUENCE public.data_barang_by_status_barang_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_by_status_counter_id_seq;

CREATE SEQUENCE public.data_barang_by_status_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_counter_id_seq;

CREATE SEQUENCE public.data_barang_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_distribusi_counter_id_seq;

CREATE SEQUENCE public.data_barang_distribusi_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_evidence_id_seq;

CREATE SEQUENCE public.data_barang_evidence_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_id_seq;

CREATE SEQUENCE public.data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_keseluruhan_counter_id_seq;

CREATE SEQUENCE public.data_barang_keseluruhan_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.data_barang_qc_not_pass_id_seq;

CREATE SEQUENCE public.data_barang_qc_not_pass_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ekspedisi_id_seq;

CREATE SEQUENCE public.ekspedisi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.forgot_password_id_seq;

CREATE SEQUENCE public.forgot_password_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.group_id_seq;

CREATE SEQUENCE public.group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.gudang_id_seq;

CREATE SEQUENCE public.gudang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.heartbeat_app_version_seq;

CREATE SEQUENCE public.heartbeat_app_version_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.heartbeat_schedule_id_seq;

CREATE SEQUENCE public.heartbeat_schedule_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 2
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.kategori_id_seq;

CREATE SEQUENCE public.kategori_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.kelengkapan_id_seq;

CREATE SEQUENCE public.kelengkapan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.kota_kabupaten_id_seq;

CREATE SEQUENCE public.kota_kabupaten_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_daily_detail_pemenuhan_id_seq;

CREATE SEQUENCE public.laporan_availability_daily_detail_pemenuhan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_daily_detail_penambahan_id_seq;

CREATE SEQUENCE public.laporan_availability_daily_detail_penambahan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_daily_detail_stok_akhir_id_seq;

CREATE SEQUENCE public.laporan_availability_daily_detail_stok_akhir_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_daily_detail_stok_awal_id_seq;

CREATE SEQUENCE public.laporan_availability_daily_detail_stok_awal_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_daily_detail_terpakai_id_seq;

CREATE SEQUENCE public.laporan_availability_daily_detail_terpakai_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_daily_id_seq;

CREATE SEQUENCE public.laporan_availability_daily_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_suca_id_seq;

CREATE SEQUENCE public.laporan_availability_suca_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_suca_pemenuhan_suca_id_seq;

CREATE SEQUENCE public.laporan_availability_suca_pemenuhan_suca_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_suca_penambahan_suca_id_seq;

CREATE SEQUENCE public.laporan_availability_suca_penambahan_suca_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_suca_stock_akhir_id_seq;

CREATE SEQUENCE public.laporan_availability_suca_stock_akhir_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_suca_stock_awal_bulan_id_seq;

CREATE SEQUENCE public.laporan_availability_suca_stock_awal_bulan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_suca_stock_terpakai_id_seq;

CREATE SEQUENCE public.laporan_availability_suca_stock_terpakai_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_weekly_detail_pemenuhan_id_seq;

CREATE SEQUENCE public.laporan_availability_weekly_detail_pemenuhan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_weekly_detail_penambahan_id_seq;

CREATE SEQUENCE public.laporan_availability_weekly_detail_penambahan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_weekly_detail_stok_akhir_id_seq;

CREATE SEQUENCE public.laporan_availability_weekly_detail_stok_akhir_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_weekly_detail_stok_awal_id_seq;

CREATE SEQUENCE public.laporan_availability_weekly_detail_stok_awal_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_weekly_detail_terpakai_id_seq;

CREATE SEQUENCE public.laporan_availability_weekly_detail_terpakai_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_availability_weekly_id_seq;

CREATE SEQUENCE public.laporan_availability_weekly_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_kerusakan_id_seq;

CREATE SEQUENCE public.laporan_kerusakan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_kerusakan_manage_service_id_seq;

CREATE SEQUENCE public.laporan_kerusakan_manage_service_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_pemenuhan_id_seq;

CREATE SEQUENCE public.laporan_pemenuhan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_pemenuhan_suca_id_seq;

CREATE SEQUENCE public.laporan_pemenuhan_suca_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_stok_id_seq;

CREATE SEQUENCE public.laporan_stok_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.laporan_terpakai_rnw_id_seq;

CREATE SEQUENCE public.laporan_terpakai_rnw_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.log_aktivitas_id_seq;

CREATE SEQUENCE public.log_aktivitas_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.log_aktivitas_id_seq1;

CREATE SEQUENCE public.log_aktivitas_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 49250
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.log_barang_evidence_id_seq;

CREATE SEQUENCE public.log_barang_evidence_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.log_barang_id_seq;

CREATE SEQUENCE public.log_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.log_heartbeat_id_seq;

CREATE SEQUENCE public.log_heartbeat_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.log_part_data_barang_id_seq;

CREATE SEQUENCE public.log_part_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.master_data_barang_id_seq;

CREATE SEQUENCE public.master_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.menu_id_seq;

CREATE SEQUENCE public.menu_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.module_id_seq;

CREATE SEQUENCE public.module_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.new_lokasi_id_seq;

CREATE SEQUENCE public.new_lokasi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.new_regional_id_seq;

CREATE SEQUENCE public.new_regional_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.new_wilayah_kerja_id_seq;

CREATE SEQUENCE public.new_wilayah_kerja_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.new_witel_id_seq;

CREATE SEQUENCE public.new_witel_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.notifikasi_aset_id_seq;

CREATE SEQUENCE public.notifikasi_aset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.notifikasi_id_seq;

CREATE SEQUENCE public.notifikasi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.part_data_barang_id_seq;

CREATE SEQUENCE public.part_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pemenuhan_id_seq;

CREATE SEQUENCE public.pemenuhan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.penambahan_id_seq;

CREATE SEQUENCE public.penambahan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.penambahan_v2_id_seq;

CREATE SEQUENCE public.penambahan_v2_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pengirim_penerima_counter_id_seq;

CREATE SEQUENCE public.pengirim_penerima_counter_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pengirim_penerima_id_seq;

CREATE SEQUENCE public.pengirim_penerima_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.permission_id_seq;

CREATE SEQUENCE public.permission_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_activity_id_seq;

CREATE SEQUENCE public.pm_activity_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_activity_location_id_seq;

CREATE SEQUENCE public.pm_activity_location_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_activity_mapping_id_seq;

CREATE SEQUENCE public.pm_activity_mapping_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_detail_activity_mapping_id_seq;

CREATE SEQUENCE public.pm_detail_activity_mapping_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_detail_preventive_id_seq;

CREATE SEQUENCE public.pm_detail_preventive_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_detail_status_id_seq;

CREATE SEQUENCE public.pm_detail_status_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_preventive_id_seq;

CREATE SEQUENCE public.pm_preventive_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_status_id_seq;

CREATE SEQUENCE public.pm_status_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_t_log_id_seq;

CREATE SEQUENCE public.pm_t_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.pm_task_detail_id_seq;

CREATE SEQUENCE public.pm_task_detail_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.provinsi_id_seq;

CREATE SEQUENCE public.provinsi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.qc_data_barang_id_seq;

CREATE SEQUENCE public.qc_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.qc_part_data_barang_id_seq;

CREATE SEQUENCE public.qc_part_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.regional_id_seq;

CREATE SEQUENCE public.regional_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.relokasi_data_barang_id_seq;

CREATE SEQUENCE public.relokasi_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.relokasi_id_seq;

CREATE SEQUENCE public.relokasi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.role_id_seq;

CREATE SEQUENCE public.role_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.role_permission_id_seq;

CREATE SEQUENCE public.role_permission_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.st_perangkat_rusak_data_barang_id_seq;

CREATE SEQUENCE public.st_perangkat_rusak_data_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.st_perangkat_rusak_id_seq;

CREATE SEQUENCE public.st_perangkat_rusak_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.state_id_seq;

CREATE SEQUENCE public.state_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.status_barang_id_seq;

CREATE SEQUENCE public.status_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.status_id_seq;

CREATE SEQUENCE public.status_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.status_pengiriman_id_seq;

CREATE SEQUENCE public.status_pengiriman_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.status_relocation_id_seq;

CREATE SEQUENCE public.status_relocation_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.status_rma_id_seq;

CREATE SEQUENCE public.status_rma_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.stock_akhir_id_seq;

CREATE SEQUENCE public.stock_akhir_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.stock_awal_id_seq;

CREATE SEQUENCE public.stock_awal_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.stock_id_seq;

CREATE SEQUENCE public.stock_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_asset_id_seq;

CREATE SEQUENCE public.t_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_content_notification_id_seq;

CREATE SEQUENCE public.t_content_notification_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_exsel_lisensi_id_seq;

CREATE SEQUENCE public.t_exsel_lisensi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_faq_id_seq;

CREATE SEQUENCE public.t_faq_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_forgot_password_id_seq;

CREATE SEQUENCE public.t_forgot_password_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_group_id_seq;

CREATE SEQUENCE public.t_group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_inventaris_asset_id_seq;

CREATE SEQUENCE public.t_inventaris_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_kategori_asset_id_seq;

CREATE SEQUENCE public.t_kategori_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_kategori_id_seq;

CREATE SEQUENCE public.t_kategori_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_log_asset_id_seq;

CREATE SEQUENCE public.t_log_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_log_inventaris_id_seq;

CREATE SEQUENCE public.t_log_inventaris_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_log_validasi_id_seq;

CREATE SEQUENCE public.t_log_validasi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_anomaly_logon_order_data_seq;

CREATE SEQUENCE public.t_m_anomaly_logon_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_condition_logon_order_data_seq;

CREATE SEQUENCE public.t_m_condition_logon_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_division_order_data_seq;

CREATE SEQUENCE public.t_m_division_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_jadwal_shift_order_data_seq;

CREATE SEQUENCE public.t_m_jadwal_shift_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_new_data_logon_order_data_seq;

CREATE SEQUENCE public.t_m_new_data_logon_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_reason_rating_order_data_seq;

CREATE SEQUENCE public.t_m_reason_rating_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_status_anomaly_dispenser_order_data_seq;

CREATE SEQUENCE public.t_m_status_anomaly_dispenser_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_status_anomaly_logon_order_data_seq;

CREATE SEQUENCE public.t_m_status_anomaly_logon_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_status_gangguan_logon_order_data_seq;

CREATE SEQUENCE public.t_m_status_gangguan_logon_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_m_status_shift_kehadiran_member_order_data_seq;

CREATE SEQUENCE public.t_m_status_shift_kehadiran_member_order_data_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_master_data_activity_id_seq;

CREATE SEQUENCE public.t_master_data_activity_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_master_data_kategori_id_seq;

CREATE SEQUENCE public.t_master_data_kategori_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_menu_id_seq;

CREATE SEQUENCE public.t_menu_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_metadata_id_seq;

CREATE SEQUENCE public.t_metadata_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_module_id_seq;

CREATE SEQUENCE public.t_module_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_module_id_seq1;

CREATE SEQUENCE public.t_module_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_new_lokasi_id_seq;

CREATE SEQUENCE public.t_new_lokasi_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_notification_id_seq;

CREATE SEQUENCE public.t_notification_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_pemilik_asset_id_seq;

CREATE SEQUENCE public.t_pemilik_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_permission_id_seq;

CREATE SEQUENCE public.t_permission_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_permission_id_seq1;

CREATE SEQUENCE public.t_permission_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_posisi_aset_id_seq;

CREATE SEQUENCE public.t_posisi_aset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_role_id_seq;

CREATE SEQUENCE public.t_role_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_role_permission_id_seq;

CREATE SEQUENCE public.t_role_permission_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_role_permission_id_seq1;

CREATE SEQUENCE public.t_role_permission_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_status_asset_verify_id_seq;

CREATE SEQUENCE public.t_status_asset_verify_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_status_coordinate_verify_id_seq;

CREATE SEQUENCE public.t_status_coordinate_verify_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_status_inventaris_id_seq;

CREATE SEQUENCE public.t_status_inventaris_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_status_opname_id_seq;

CREATE SEQUENCE public.t_status_opname_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_status_option_asset_id_seq;

CREATE SEQUENCE public.t_status_option_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_status_reject_id_seq;

CREATE SEQUENCE public.t_status_reject_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_sub_kategori_id_seq;

CREATE SEQUENCE public.t_sub_kategori_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_sub_kategori_id_seq1;

CREATE SEQUENCE public.t_sub_kategori_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_details_id_seq;

CREATE SEQUENCE public.t_ticket_details_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_details_id_seq1;

CREATE SEQUENCE public.t_ticket_details_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_eskalasi_log_id_seq;

CREATE SEQUENCE public.t_ticket_eskalasi_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_eskalasi_log_id_seq1;

CREATE SEQUENCE public.t_ticket_eskalasi_log_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_eskalasi_note_id_seq;

CREATE SEQUENCE public.t_ticket_eskalasi_note_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_eskalasi_work_logs_id_seq;

CREATE SEQUENCE public.t_ticket_eskalasi_work_logs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_id_seq;

CREATE SEQUENCE public.t_ticket_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_id_seq1;

CREATE SEQUENCE public.t_ticket_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_log_id_seq;

CREATE SEQUENCE public.t_ticket_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_log_id_seq1;

CREATE SEQUENCE public.t_ticket_log_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_note_id_seq;

CREATE SEQUENCE public.t_ticket_note_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_status_id_seq;

CREATE SEQUENCE public.t_ticket_status_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_ticket_status_id_seq1;

CREATE SEQUENCE public.t_ticket_status_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_user_log_aktivitas_id_seq;

CREATE SEQUENCE public.t_user_log_aktivitas_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_user_role_ticket_id_seq1;

CREATE SEQUENCE public.t_user_role_ticket_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_user_telegram_id_seq;

CREATE SEQUENCE public.t_user_telegram_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_user_telegram_id_seq1;

CREATE SEQUENCE public.t_user_telegram_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_validasi_asset_id_seq;

CREATE SEQUENCE public.t_validasi_asset_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_work_logs_id_seq;

CREATE SEQUENCE public.t_work_logs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.task_barang_evidence_id_seq;

CREATE SEQUENCE public.task_barang_evidence_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.task_barang_id_seq;

CREATE SEQUENCE public.task_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.task_evidence_id_seq;

CREATE SEQUENCE public.task_evidence_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.task_id_seq;

CREATE SEQUENCE public.task_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.task_tahapan_id_seq;

CREATE SEQUENCE public.task_tahapan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.terpakai_id_seq;

CREATE SEQUENCE public.terpakai_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tipe_spbu_id_seq;

CREATE SEQUENCE public.tipe_spbu_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tracking_barang_id_seq;

CREATE SEQUENCE public.tracking_barang_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tracking_evidence_id_seq;

CREATE SEQUENCE public.tracking_evidence_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tracking_id_seq;

CREATE SEQUENCE public.tracking_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.user_role_id_seq;

CREATE SEQUENCE public.user_role_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.vendor_id_seq;

CREATE SEQUENCE public.vendor_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.warantty_id_seq;

CREATE SEQUENCE public.warantty_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.wilayah_id_seq;

CREATE SEQUENCE public.wilayah_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public."MOR" definition

-- Drop table

-- DROP TABLE public."MOR";

CREATE TABLE public."MOR" ( id serial4 NOT NULL, nama varchar NOT NULL, CONSTRAINT pk_mor_id PRIMARY KEY (id));


-- public."SLA" definition

-- Drop table

-- DROP TABLE public."SLA";

CREATE TABLE public."SLA" ( id serial4 NOT NULL, nama varchar NOT NULL, sla float8 NULL);


-- public."action" definition

-- Drop table

-- DROP TABLE public."action";

CREATE TABLE public."action" ( id serial4 NOT NULL, nama varchar NOT NULL);


-- public.aktivitas_notifikasi definition

-- Drop table

-- DROP TABLE public.aktivitas_notifikasi;

CREATE TABLE public.aktivitas_notifikasi ( id serial4 NOT NULL, kondisi varchar NOT NULL, aktivitas_selanjutnya varchar NOT NULL, is_redirect bool NOT NULL, ref_nomor varchar NOT NULL, page varchar NULL, CONSTRAINT aktifitas_notifikasi_id PRIMARY KEY (id));


-- public.alembic_version definition

-- Drop table

-- DROP TABLE public.alembic_version;

CREATE TABLE public.alembic_version ( version_num varchar(32) NOT NULL);


-- public.asset_backup definition

-- Drop table

-- DROP TABLE public.asset_backup;

CREATE TABLE public.asset_backup ( id int4 NULL, created_by_id varchar(50) NULL, updated_by_id varchar(50) NULL, created_at varchar(50) NULL, updated_at varchar(50) NULL, deleted_at varchar(50) NULL, koneksi varchar(50) NULL, lokasi_asset varchar(50) NULL, is_valid bool NULL, kategori_asset int4 NULL, witel_id int4 NULL, kode_spbu int4 NULL, status_spbu varchar(50) NULL, serial_number varchar(50) NULL, kondisi_asset varchar(50) NULL, merk varchar(50) NULL, foto varchar(64) NULL, asset_reconciled bool NULL, pemilik_asset_id int4 NULL, is_rack_it bool NULL, asset_code varchar(50) NULL, is_migrated bool NULL, lokasi_code varchar(50) NULL, is_verified bool NULL, id_asset varchar(50) NULL, full_asset_code varchar(50) NULL, pic_inventarisasi_by_id varchar(50) NULL, verified_tl_by_id varchar(50) NULL, verified_at varchar(50) NULL, is_active bool NULL, verified_sda_by_id varchar(50) NULL, code_asset varchar(50) NULL, serialnumber varchar(50) NULL, seerial_number varchar(50) NULL, foto_serial_number varchar(64) NULL, foto_berita_acara varchar(64) NULL, status_reject_id varchar(50) NULL, submitted_at varchar(50) NULL, posisi_aset_id int4 NULL, tiket_insera varchar(50) NULL, catatan varchar(50) NULL, validated int4 NULL, status_validasi varchar(50) NULL, status_inventaris varchar(50) NULL, kondisi_asset_validasi varchar(50) NULL, revalidate int4 NULL, foto_validasi varchar(64) NULL, foto_serial_number_validasi varchar(64) NULL, foto_berita_acara_validasi varchar(64) NULL, validasi_verified_at varchar(50) NULL, validasi_submitted_at varchar(50) NULL, is_validasi_verified bool NULL, pic_validasi_by_id varchar(50) NULL, validasi_verified_tl_by_id varchar(50) NULL, validasi_verified_sda_by_id varchar(50) NULL);


-- public.b_user definition

-- Drop table

-- DROP TABLE public.b_user;

CREATE TABLE public.b_user ( "No." int4 NULL, nama varchar(50) NULL, email varchar(50) NULL, "Perusahaan/Departemen" varchar(50) NULL, jabatan varchar(50) NULL, witel varchar(50) NULL, "Witel Baru" varchar(50) NULL, status varchar(50) NULL, "Tanggal Pembuatan" varchar(50) NULL);


-- public.b_wilayah definition

-- Drop table

-- DROP TABLE public.b_wilayah;

CREATE TABLE public.b_wilayah ( "No" int4 NULL, site_id varchar NULL, spbu_type varchar(50) NULL, treg varchar(50) NULL, witel varchar(50) NULL, province varchar(50) NULL, city varchar(50) NULL, address varchar(128) NULL);


-- public.ba_serah_terima_barang_pemenuhan definition

-- Drop table

-- DROP TABLE public.ba_serah_terima_barang_pemenuhan;

CREATE TABLE public.ba_serah_terima_barang_pemenuhan ( id serial4 NOT NULL, tanggal_pengiriman date NOT NULL, tanggal_diterima date NULL, lokasi_pengiriman_id int4 NOT NULL, lokasi_tujuan_id int4 NOT NULL, user_pengirim_id uuid NOT NULL, user_penerima_id uuid NULL, metode_pengiriman_id int4 NULL, nomor_resi varchar NULL, tahapan_id int4 NOT NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NOT NULL, user_qc_witel_id uuid NULL, user_qc_tl_id uuid NULL, note_pengiriman varchar NULL, tracking_id int4 NULL, upload_resi_path varchar NULL);


-- public.ba_serah_terima_barang_pemenuhan_aset definition

-- Drop table

-- DROP TABLE public.ba_serah_terima_barang_pemenuhan_aset;

CREATE TABLE public.ba_serah_terima_barang_pemenuhan_aset ( id serial4 NOT NULL, ba_serah_terima_barang_pemenuhan_id int4 NOT NULL, data_barang_id int4 NOT NULL, is_qc bool NULL);


-- public.ba_serah_terima_barang_pemenuhan_evidence definition

-- Drop table

-- DROP TABLE public.ba_serah_terima_barang_pemenuhan_evidence;

CREATE TABLE public.ba_serah_terima_barang_pemenuhan_evidence ( id serial4 NOT NULL, ba_serah_terima_barang_pemenuhan_id int4 NOT NULL, file_evidence varchar NOT NULL);


-- public.ba_serah_terima_barang_pemenuhan_qc definition

-- Drop table

-- DROP TABLE public.ba_serah_terima_barang_pemenuhan_qc;

CREATE TABLE public.ba_serah_terima_barang_pemenuhan_qc ( id serial4 NOT NULL, ba_serah_terima_barang_pemenuhan_aset_id int4 NOT NULL, kelengkapan_id int4 NOT NULL, is_ok bool NULL);


-- public.ba_serah_terima_barang_pemenuhan_tahapan definition

-- Drop table

-- DROP TABLE public.ba_serah_terima_barang_pemenuhan_tahapan;

CREATE TABLE public.ba_serah_terima_barang_pemenuhan_tahapan ( id serial4 NOT NULL, "order" int4 NOT NULL, nama varchar NOT NULL);


-- public.batch definition

-- Drop table

-- DROP TABLE public.batch;

CREATE TABLE public.batch ( id serial4 NOT NULL, nama varchar NOT NULL);


-- public.check_in definition

-- Drop table

-- DROP TABLE public.check_in;

CREATE TABLE public.check_in ( id serial4 NOT NULL, user_id uuid NOT NULL, created_date timestamptz(6) NOT NULL, aktivitas varchar NOT NULL, tujuan_id int4 NOT NULL);


-- public."condition" definition

-- Drop table

-- DROP TABLE public."condition";

CREATE TABLE public."condition" ( id serial4 NOT NULL, nama varchar NOT NULL, deleted_at timestamptz(6) NULL, status_id int4 NULL);


-- public.daata definition

-- Drop table

-- DROP TABLE public.daata;

CREATE TABLE public.daata ( tanggal varchar NULL, spbu varchar(255) NULL, sn varchar(255) NULL, stat varchar(255) NULL);


-- public.data_barang definition

-- Drop table

-- DROP TABLE public.data_barang;

CREATE TABLE public.data_barang ( id serial4 NOT NULL, keterangan varchar NULL, barang_id int4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, serial_number varchar NULL, lokasi_id int4 NULL, tujuan int4 NULL, status_barang_id int4 NULL, status_pengiriman_id int4 NULL, condition_id int4 NULL, status_id int4 NULL, state_id int4 NULL, latest_tracking_id int4 NULL, batch_id int4 NULL, vendor_id int4 NULL, owned_by int4 NULL, used_by int4 NULL, managed_by int4 NULL, ploting_id int4 NULL, warranty_id int4 NULL, replaced_by int4 NULL, replacing_by int4 NULL, relokasi_id int4 NULL, latest_stpr_id int4 NULL, bisa_diganti bool NULL, status_rma_id int4 NULL, is_masuk_laporan_availability bool NULL, status_relocation_id int4 NULL, latest_bastbp_id int4 NULL, warranty_date date NULL, asset_awal bool NULL, qc_not_passed bool NULL, pengiriman int4 DEFAULT 1 NULL);


-- public.data_barang_by_flag_counter definition

-- Drop table

-- DROP TABLE public.data_barang_by_flag_counter;

CREATE TABLE public.data_barang_by_flag_counter ( id serial4 NOT NULL, count int4 NOT NULL, flag varchar NOT NULL, last_updated timestamptz(6) NOT NULL);


-- public.data_barang_by_status_barang_counter definition

-- Drop table

-- DROP TABLE public.data_barang_by_status_barang_counter;

CREATE TABLE public.data_barang_by_status_barang_counter ( id serial4 NOT NULL, status_barang_id int4 NULL, count int4 NOT NULL, last_updated timestamptz(6) NOT NULL);


-- public.data_barang_by_status_counter definition

-- Drop table

-- DROP TABLE public.data_barang_by_status_counter;

CREATE TABLE public.data_barang_by_status_counter ( id serial4 NOT NULL, status_id int4 NULL, count int4 NOT NULL, last_updated timestamptz(6) NOT NULL);


-- public.data_barang_counter definition

-- Drop table

-- DROP TABLE public.data_barang_counter;

CREATE TABLE public.data_barang_counter ( id serial4 NOT NULL, regional_id int4 NULL, master_data_barang_id int4 NULL, count int4 NOT NULL, last_updated timestamptz(6) NOT NULL, kategori int4 NULL);


-- public.data_barang_distribusi_counter definition

-- Drop table

-- DROP TABLE public.data_barang_distribusi_counter;

CREATE TABLE public.data_barang_distribusi_counter ( id serial4 NOT NULL, count int4 NOT NULL, last_updated timestamptz(6) NOT NULL);


-- public.data_barang_evidence definition

-- Drop table

-- DROP TABLE public.data_barang_evidence;

CREATE TABLE public.data_barang_evidence ( id serial4 NOT NULL, data_barang_id int4 NOT NULL, file_evidence varchar NOT NULL);


-- public.data_barang_keseluruhan_counter definition

-- Drop table

-- DROP TABLE public.data_barang_keseluruhan_counter;

CREATE TABLE public.data_barang_keseluruhan_counter ( id serial4 NOT NULL, count int4 NOT NULL, last_updated timestamptz(6) NOT NULL);


-- public.data_barang_qc_not_pass definition

-- Drop table

-- DROP TABLE public.data_barang_qc_not_pass;

CREATE TABLE public.data_barang_qc_not_pass ( id serial4 NOT NULL, tanggal date NOT NULL, data_barang_id int4 NOT NULL, is_still_not_pass bool NOT NULL);


-- public.data_edc definition

-- Drop table

-- DROP TABLE public.data_edc;

CREATE TABLE public.data_edc ( "no" int4 NULL, regional varchar(255) NULL, "MOR" varchar(255) NULL, "Witel" varchar(255) NULL, "ID SPBU" varchar(255) NULL, serial_number varchar(255) NULL, "SN 5200 EDC" varchar(255) NULL, "QTY" int4 NULL, "Tipe EDC" varchar(255) NULL, "Batch Delivery" varchar(255) NULL, "Noted" varchar(255) NULL);


-- public.dup_t_sub_kategori definition

-- Drop table

-- DROP TABLE public.dup_t_sub_kategori;

CREATE TABLE public.dup_t_sub_kategori ( id int4 NULL, kategori_id int4 NULL, nama varchar(128) NULL, created_by_id uuid NULL, updated_by_id varchar(50) NULL, created_at timestamptz(6) NULL, updated_at varchar(50) NULL, deleted_at varchar(50) NULL, is_active bool NULL, group_id int4 NULL);


-- public.ekspedisi definition

-- Drop table

-- DROP TABLE public.ekspedisi;

CREATE TABLE public.ekspedisi ( id serial4 NOT NULL, nama varchar NOT NULL, kode varchar NOT NULL, courier varchar NOT NULL);


-- public.forgot_password definition

-- Drop table

-- DROP TABLE public.forgot_password;

CREATE TABLE public.forgot_password ( id serial4 NOT NULL, user_id uuid NOT NULL, "token" varchar(200) NOT NULL, created_date timestamptz(6) NULL);


-- public."group" definition

-- Drop table

-- DROP TABLE public."group";

CREATE TABLE public."group" ( id serial4 NOT NULL, nama varchar NOT NULL, deskripsi varchar NULL, deleted_at timestamptz(6) NULL, CONSTRAINT pk_group_id PRIMARY KEY (id));


-- public.gudang definition

-- Drop table

-- DROP TABLE public.gudang;

CREATE TABLE public.gudang ( id serial4 NOT NULL, nama varchar NOT NULL, alamat varchar NULL, kota_kabupaten_id int4 NULL, provinsi_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL);


-- public.heartbeat_app_version definition

-- Drop table

-- DROP TABLE public.heartbeat_app_version;

CREATE TABLE public.heartbeat_app_version ( id int4 DEFAULT nextval('heartbeat_app_version_seq'::regclass) NOT NULL, "version" varchar NULL, is_active bool NULL, created_at timestamptz NULL, created_by_id uuid NULL, "path" varchar NULL, deskripsi text NULL, CONSTRAINT heartbeat_app_version_pk PRIMARY KEY (id));


-- public.heartbeat_schedule definition

-- Drop table

-- DROP TABLE public.heartbeat_schedule;

CREATE TABLE public.heartbeat_schedule ( id serial4 NOT NULL, "period" varchar(255) NOT NULL, start_time time NULL, minute_interval int4 NULL, created_at timestamptz NULL, created_by_id varchar NULL);


-- public.kategori definition

-- Drop table

-- DROP TABLE public.kategori;

CREATE TABLE public.kategori ( id serial4 NOT NULL, nama varchar NOT NULL, deleted_at timestamptz(6) NULL, CONSTRAINT pk_kategori_id PRIMARY KEY (id));


-- public.kelengkapan definition

-- Drop table

-- DROP TABLE public.kelengkapan;

CREATE TABLE public.kelengkapan ( id serial4 NOT NULL, nama varchar NOT NULL, master_data_barang_id int4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_fungsional bool NULL, is_kelengkapan bool NULL, is_instalasi bool NULL);


-- public.kota_kabupaten definition

-- Drop table

-- DROP TABLE public.kota_kabupaten;

CREATE TABLE public.kota_kabupaten ( id serial4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, provinsi_id int4 NULL);


-- public.laporan_availability_daily definition

-- Drop table

-- DROP TABLE public.laporan_availability_daily;

CREATE TABLE public.laporan_availability_daily ( id serial4 NOT NULL, tanggal date NOT NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL);


-- public.laporan_availability_daily_detail_pemenuhan definition

-- Drop table

-- DROP TABLE public.laporan_availability_daily_detail_pemenuhan;

CREATE TABLE public.laporan_availability_daily_detail_pemenuhan ( id serial4 NOT NULL, tanggal date NOT NULL, laporan_availability_daily_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_daily_detail_penambahan definition

-- Drop table

-- DROP TABLE public.laporan_availability_daily_detail_penambahan;

CREATE TABLE public.laporan_availability_daily_detail_penambahan ( id serial4 NOT NULL, tanggal date NOT NULL, laporan_availability_daily_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_daily_detail_stok_akhir definition

-- Drop table

-- DROP TABLE public.laporan_availability_daily_detail_stok_akhir;

CREATE TABLE public.laporan_availability_daily_detail_stok_akhir ( id serial4 NOT NULL, tanggal date NOT NULL, laporan_availability_daily_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_daily_detail_stok_awal definition

-- Drop table

-- DROP TABLE public.laporan_availability_daily_detail_stok_awal;

CREATE TABLE public.laporan_availability_daily_detail_stok_awal ( id serial4 NOT NULL, tanggal date NOT NULL, laporan_availability_daily_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_daily_detail_terpakai definition

-- Drop table

-- DROP TABLE public.laporan_availability_daily_detail_terpakai;

CREATE TABLE public.laporan_availability_daily_detail_terpakai ( id serial4 NOT NULL, tanggal date NOT NULL, laporan_availability_daily_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_suca definition

-- Drop table

-- DROP TABLE public.laporan_availability_suca;

CREATE TABLE public.laporan_availability_suca ( id serial4 NOT NULL, tanggal date NOT NULL, witel_id int4 NOT NULL, ploted_stock int4 NOT NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL);


-- public.laporan_availability_suca_pemenuhan_suca definition

-- Drop table

-- DROP TABLE public.laporan_availability_suca_pemenuhan_suca;

CREATE TABLE public.laporan_availability_suca_pemenuhan_suca ( id serial4 NOT NULL, laporan_availability_suca_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_suca_penambahan_suca definition

-- Drop table

-- DROP TABLE public.laporan_availability_suca_penambahan_suca;

CREATE TABLE public.laporan_availability_suca_penambahan_suca ( id int4 NOT NULL, laporan_availability_suca_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_suca_stock_akhir definition

-- Drop table

-- DROP TABLE public.laporan_availability_suca_stock_akhir;

CREATE TABLE public.laporan_availability_suca_stock_akhir ( id int4 NOT NULL, laporan_availability_suca_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_suca_stock_awal_bulan definition

-- Drop table

-- DROP TABLE public.laporan_availability_suca_stock_awal_bulan;

CREATE TABLE public.laporan_availability_suca_stock_awal_bulan ( id int4 NOT NULL, laporan_availability_suca_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_suca_stock_terpakai definition

-- Drop table

-- DROP TABLE public.laporan_availability_suca_stock_terpakai;

CREATE TABLE public.laporan_availability_suca_stock_terpakai ( id int4 NOT NULL, laporan_availability_suca_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_weekly definition

-- Drop table

-- DROP TABLE public.laporan_availability_weekly;

CREATE TABLE public.laporan_availability_weekly ( id int4 NOT NULL, tanggal date NOT NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL);


-- public.laporan_availability_weekly_detail_pemenuhan definition

-- Drop table

-- DROP TABLE public.laporan_availability_weekly_detail_pemenuhan;

CREATE TABLE public.laporan_availability_weekly_detail_pemenuhan ( id int4 NOT NULL, tanggal date NOT NULL, laporan_availability_weekly_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_weekly_detail_penambahan definition

-- Drop table

-- DROP TABLE public.laporan_availability_weekly_detail_penambahan;

CREATE TABLE public.laporan_availability_weekly_detail_penambahan ( id int4 NOT NULL, tanggal date NOT NULL, laporan_availability_weekly_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_weekly_detail_stok_akhir definition

-- Drop table

-- DROP TABLE public.laporan_availability_weekly_detail_stok_akhir;

CREATE TABLE public.laporan_availability_weekly_detail_stok_akhir ( id int4 NOT NULL, tanggal date NOT NULL, laporan_availability_weekly_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_weekly_detail_stok_awal definition

-- Drop table

-- DROP TABLE public.laporan_availability_weekly_detail_stok_awal;

CREATE TABLE public.laporan_availability_weekly_detail_stok_awal ( id int4 NOT NULL, tanggal date NOT NULL, laporan_availability_weekly_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_availability_weekly_detail_terpakai definition

-- Drop table

-- DROP TABLE public.laporan_availability_weekly_detail_terpakai;

CREATE TABLE public.laporan_availability_weekly_detail_terpakai ( id int4 NOT NULL, tanggal date NOT NULL, laporan_availability_weekly_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, jumlah int4 NOT NULL);


-- public.laporan_kerusakan_manage_service definition

-- Drop table

-- DROP TABLE public.laporan_kerusakan_manage_service;

CREATE TABLE public.laporan_kerusakan_manage_service ( id serial4 NOT NULL, tanggal date NOT NULL, master_data_barang_id int4 NOT NULL, condition_id int4 NOT NULL, regional_id int4 NOT NULL, diganti int4 NOT NULL, tidak_diganti int4 NOT NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL);


-- public.laporan_kerusakan_rnw definition

-- Drop table

-- DROP TABLE public.laporan_kerusakan_rnw;

CREATE TABLE public.laporan_kerusakan_rnw ( id int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL, region_id int8 NULL, witel_id int8 NULL, master_data_barang_id int8 NULL, serial_number varchar(255) NULL, status_id int8 NULL, condition_id int8 NULL, log_barang_id int8 NULL, bisa_diganti bool NULL, created_at timestamptz NULL, hari int8 NULL, bulan int8 NULL, tahun int8 NULL, lokasi_id int4 NULL, lokasi varchar(255) NULL);


-- public.laporan_pemenuhan_rnw definition

-- Drop table

-- DROP TABLE public.laporan_pemenuhan_rnw;

CREATE TABLE public.laporan_pemenuhan_rnw ( id int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL, sla_id int8 NULL, regional_id int8 NULL, witel_id int8 NULL, master_data_barang_id int8 NULL, serial_number varchar NULL, tracking_id int8 NULL, nomor_resi varchar(255) NULL, delivery_date date NULL, recieve_date date NULL, created_at timestamp NULL, hari int8 NULL, bulan int8 NULL, tahun int8 NULL, log_barang_id int8 NULL);


-- public.laporan_pemenuhan_rnw_mentah definition

-- Drop table

-- DROP TABLE public.laporan_pemenuhan_rnw_mentah;

CREATE TABLE public.laporan_pemenuhan_rnw_mentah ( region_id int4 NULL, witel_name varchar(255) NULL, master_data_barang varchar(255) NULL, serial_number varchar(255) NULL, nomor_resi varchar(255) NULL, delivery_date timestamptz NULL, recieve_date timestamptz NULL, created_at timestamptz NULL, hari int4 NULL, bulan int4 NULL, tahun int4 NULL, witel_id int4 NULL, master_data_barang_id int4 NULL);


-- public.laporan_pemenuhan_suca definition

-- Drop table

-- DROP TABLE public.laporan_pemenuhan_suca;

CREATE TABLE public.laporan_pemenuhan_suca ( id serial4 NOT NULL, "year" int4 NOT NULL, "month" int4 NOT NULL, witel_id int4 NOT NULL, jumlah_edc int4 NOT NULL, lama_pengiriman int4 NOT NULL, keterangan varchar NULL, sla float8 NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL);


-- public.laporan_stok_rnw definition

-- Drop table

-- DROP TABLE public.laporan_stok_rnw;

CREATE TABLE public.laporan_stok_rnw ( id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL, region_id int4 NULL, witel_id int4 NULL, master_barang_id int4 NULL, serial_number varchar NULL, log_barang_id int4 NULL, tanggal timestamp(6) NULL, hari int4 NULL, bulan int4 NULL, tahun int4 NULL, used_date date NULL);


-- public.laporan_terpakai_rnw definition

-- Drop table

-- DROP TABLE public.laporan_terpakai_rnw;

CREATE TABLE public.laporan_terpakai_rnw ( id int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL, region_id int8 NULL, regional varchar(255) NULL, witel_id int8 NULL, witel varchar(255) NULL, master_data_barang_id int8 NULL, master_barang varchar(255) NULL, serial_number varchar(255) NULL, tanggal date NULL, hari int8 NULL, bulan int8 NULL, tahun int8 NULL, log_barang_id int8 NULL);


-- public.log_aktivitas definition

-- Drop table

-- DROP TABLE public.log_aktivitas;

CREATE TABLE public.log_aktivitas ( id int4 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 49250 CACHE 1 NO CYCLE) NOT NULL, log_date timestamptz(6) NOT NULL, user_id uuid NOT NULL, lokasi_id int4 NOT NULL, aktivitas varchar NOT NULL);


-- public.log_barang definition

-- Drop table

-- DROP TABLE public.log_barang;

CREATE TABLE public.log_barang ( id serial4 NOT NULL, data_barang_id int4 NOT NULL, tracking_id int4 NULL, log_date timestamptz(6) NOT NULL, lokasi_id int4 NULL, tujuan int4 NULL, status_barang_id int4 NULL, status_pengiriman_id int4 NULL, keterangan varchar NULL, bast varchar NULL, condition_id int4 NULL, status_id int4 NULL, state_id int4 NULL, user_id uuid NULL, batch_id int4 NULL, vendor_id int4 NULL, owned_by int4 NULL, used_by int4 NULL, managed_by int4 NULL, replaced_by int4 NULL, replacing_by int4 NULL, bisa_diganti bool NULL, status_rma_id int4 NULL);

-- Table Triggers

create trigger
insert
    after
insert
    on
    public.log_barang for each row execute function log_to_report();


-- public.log_barang_evidence definition

-- Drop table

-- DROP TABLE public.log_barang_evidence;

CREATE TABLE public.log_barang_evidence ( id serial4 NOT NULL, log_barang_id int4 NOT NULL, data_barang_id int4 NOT NULL, file_evidence varchar NOT NULL);

-- Table Triggers

create trigger "insert rma" after
insert
    on
    public.log_barang_evidence for each row execute function log_to_report_copy1();


-- public.log_heartbeat definition

-- Drop table

-- DROP TABLE public.log_heartbeat;

CREATE TABLE public.log_heartbeat ( id bigserial NOT NULL, data_barang_id int8 NULL, latitude float8 NULL, longitude float8 NULL, "period" varchar NULL, is_active bool NULL, status_match bool NULL, url_coordinate varchar NULL, created_at timestamptz DEFAULT clock_timestamp() NULL, alamat varchar NULL, version_pot varchar NULL);


-- public.log_part_data_barang definition

-- Drop table

-- DROP TABLE public.log_part_data_barang;

CREATE TABLE public.log_part_data_barang ( id serial4 NOT NULL, log_barang_id int4 NOT NULL, kelengkapan_id int4 NOT NULL, data_barang_id int4 NOT NULL, serial_number varchar NULL, is_exists bool NULL);


-- public.master_data_barang definition

-- Drop table

-- DROP TABLE public.master_data_barang;

CREATE TABLE public.master_data_barang ( id int4 NOT NULL, nama_barang varchar NOT NULL, tipe varchar NOT NULL, spesifikasi varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, kategori_id int4 NULL);


-- public.menu definition

-- Drop table

-- DROP TABLE public.menu;

CREATE TABLE public.menu ( id serial4 NOT NULL, "name" varchar NULL, icon varchar NULL, url varchar NULL, parent_id int4 NULL, permission_id int4 NULL, is_has_child bool NULL, is_active bool NULL, "order" int4 NULL, CONSTRAINT pk_menu_id PRIMARY KEY (id));


-- public."module" definition

-- Drop table

-- DROP TABLE public."module";

CREATE TABLE public."module" ( id serial4 NOT NULL, nama varchar NOT NULL, CONSTRAINT pk_module_id PRIMARY KEY (id));


-- public.new_lokasi definition

-- Drop table

-- DROP TABLE public.new_lokasi;

CREATE TABLE public.new_lokasi ( id serial4 NOT NULL, longitude float8 NULL, latitude float8 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, wilayah_kerja_id int4 NULL, CONSTRAINT pk_new_lokasi_id PRIMARY KEY (id));


-- public.new_regional definition

-- Drop table

-- DROP TABLE public.new_regional;

CREATE TABLE public.new_regional ( id serial4 NOT NULL, nama varchar(50) NULL, "order" int4 NULL, code_regional varchar NULL, CONSTRAINT new_regional_pk PRIMARY KEY (id));


-- public.new_wilayah_kerja definition

-- Drop table

-- DROP TABLE public.new_wilayah_kerja;

CREATE TABLE public.new_wilayah_kerja ( id serial4 NOT NULL, kode_spbu varchar NULL, nama varchar NOT NULL, alamat varchar NULL, kota_kabupaten_id int4 NULL, provinsi_id int4 NULL, longtitude varchar NULL, latitude varchar NULL, flag varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, regional_spbu varchar NULL, regional_spbu_id int4 NULL, witel_id int4 NULL, mor_id int4 NULL, "is_RAFI_2022" bool NULL, is_jalur_toll bool NULL, is_jalur_utama bool NULL, is_jalur_wisata bool NULL, is_nataru bool NULL, tipe_spbu_id int4 NULL, regional_id_2 int4 NULL, mor_id_2 int4 NULL, ploted_stock int4 NULL, wilayah_id int4 NULL, sla_id int4 NULL, new_regional int4 NULL, network varchar NULL, new_witel int4 NULL, "open" varchar NULL, closed varchar NULL, CONSTRAINT pk_new_wilayah_kerja_id PRIMARY KEY (id));


-- public.newspbu definition

-- Drop table

-- DROP TABLE public.newspbu;

CREATE TABLE public.newspbu ( site_id varchar(50) NULL, spbu_type varchar(50) NULL, treg varchar(50) NULL, witel varchar(50) NULL, province varchar(50) NULL, city varchar(50) NULL, address varchar(50) NULL, kota_id varchar(50) NULL, provinsi_id varchar(50) NULL, longitute varchar(50) NULL, laltite varchar(50) NULL, flag varchar(50) NULL, created_by_id varchar(50) NULL, updated_by_id varchar(50) NULL, created_at varchar(50) NULL, updated_at varchar(50) NULL, deleted_at varchar(50) NULL, regional_spbu varchar(50) NULL, regional_spbu_id varchar(50) NULL, witel_id varchar(50) NULL, mor_id varchar(50) NULL, is_rafi_2022 varchar(50) NULL, is_jalur_toll varchar(50) NULL, is_jalur_utama varchar(50) NULL, is_jalur_wisata varchar(50) NULL, is_nataru varchar(50) NULL, tipe_spbu_id varchar(50) NULL, regional_id_2 varchar(50) NULL, mor_id_2 varchar(50) NULL, ploted_stock varchar(50) NULL, wilayah_id varchar(50) NULL, sla_id varchar(50) NULL, regional_inventaris_id varchar(50) NULL, network varchar(50) NULL, witel_inventaris_id varchar(50) NULL, "open" varchar(50) NULL, closed varchar(50) NULL, id int2 NULL);


-- public.notifikasi definition

-- Drop table

-- DROP TABLE public.notifikasi;

CREATE TABLE public.notifikasi ( id serial4 NOT NULL, aktivitas_notifikasi_id int4 NOT NULL, isi_notifikasi varchar NULL, role_pengirim_id int4 NULL, wilayah_kerja_pengirim_id int4 NULL, role_penerima_id int4 NULL, wilayah_kerja_penerima_id int4 NULL, read_at timestamptz(6) NULL, created_at timestamptz(6) NULL, task_id int4 NULL, st_perangkat_rusak_id int4 NULL, keterangan_kerusakan varchar NULL, relokasi_id int4 NULL, spbu_awal_id int4 NULL, spbu_tujuan_id int4 NULL);


-- public.notifikasi_aset definition

-- Drop table

-- DROP TABLE public.notifikasi_aset;

CREATE TABLE public.notifikasi_aset ( id serial4 NOT NULL, notifikasi_id int4 NOT NULL, "data_barang.id" int4 NOT NULL);


-- public.part_data_barang definition

-- Drop table

-- DROP TABLE public.part_data_barang;

CREATE TABLE public.part_data_barang ( id serial4 NOT NULL, kelengkapan_id int4 NOT NULL, data_barang_id int4 NOT NULL, serial_number varchar NULL, is_exists bool NULL);


-- public.pemenuhan definition

-- Drop table

-- DROP TABLE public.pemenuhan;

CREATE TABLE public.pemenuhan ( id serial4 NOT NULL, tanggal date NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, owned_by int4 NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.penambahan definition

-- Drop table

-- DROP TABLE public.penambahan;

CREATE TABLE public.penambahan ( id serial4 NOT NULL, tanggal date NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, owned_by int4 NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.penambahan_v2 definition

-- Drop table

-- DROP TABLE public.penambahan_v2;

CREATE TABLE public.penambahan_v2 ( id serial4 NOT NULL, tanggal date NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, owned_by int4 NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.pengirim_penerima_counter definition

-- Drop table

-- DROP TABLE public.pengirim_penerima_counter;

CREATE TABLE public.pengirim_penerima_counter ( id serial4 NOT NULL, regional_id int4 NULL, count int4 NOT NULL, last_updated timestamptz(6) NOT NULL);


-- public."permission" definition

-- Drop table

-- DROP TABLE public."permission";

CREATE TABLE public."permission" ( id serial4 NOT NULL, module_id int4 NULL, "permission" varchar NOT NULL, action_id int4 NULL, CONSTRAINT pk_permission_id PRIMARY KEY (id));


-- public.pm_activity definition

-- Drop table

-- DROP TABLE public.pm_activity;

CREATE TABLE public.pm_activity ( id serial4 NOT NULL, activity_name varchar(100) NOT NULL, activity_code varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, activity_location_id int4 NULL, "action" text NULL, CONSTRAINT pm_activity_id_pk PRIMARY KEY (id));


-- public.pm_activity_location definition

-- Drop table

-- DROP TABLE public.pm_activity_location;

CREATE TABLE public.pm_activity_location ( id serial4 NOT NULL, location_name varchar(100) NOT NULL, location_code varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pm_activity_location_id_pk PRIMARY KEY (id));


-- public.pm_activity_mapping definition

-- Drop table

-- DROP TABLE public.pm_activity_mapping;

CREATE TABLE public.pm_activity_mapping ( id serial4 NOT NULL, id_kategori_asset int4 NOT NULL, mapping_code varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pm_activity_mapping_id_pk PRIMARY KEY (id));


-- public.pm_detail_activity_mapping definition

-- Drop table

-- DROP TABLE public.pm_detail_activity_mapping;

CREATE TABLE public.pm_detail_activity_mapping ( id serial4 NOT NULL, id_pm_activity_mapping int4 NOT NULL, id_pm_activity int4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pm_detail_activity_mapping_id_pk PRIMARY KEY (id));


-- public.pm_detail_status definition

-- Drop table

-- DROP TABLE public.pm_detail_status;

CREATE TABLE public.pm_detail_status ( id serial4 NOT NULL, nama varchar NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pm_detail_status_id PRIMARY KEY (id));


-- public.pm_log_task definition

-- Drop table

-- DROP TABLE public.pm_log_task;

CREATE TABLE public.pm_log_task ( id int4 DEFAULT nextval('pm_task_detail_id_seq'::regclass) NOT NULL, pm_detail_preventive_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, pm_activity_id int4 NULL, CONSTRAINT pm_detail_task PRIMARY KEY (id));


-- public.pm_status definition

-- Drop table

-- DROP TABLE public.pm_status;

CREATE TABLE public.pm_status ( id serial4 NOT NULL, nama varchar NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pm_status_id PRIMARY KEY (id));


-- public.pm_t_log definition

-- Drop table

-- DROP TABLE public.pm_t_log;

CREATE TABLE public.pm_t_log ( id serial4 NOT NULL, wilayah_kerja_id int4 NULL, activity_pm_id int4 NULL, create_date timestamptz(6) NULL, status_pm int4 NULL, kondisi bool NULL, evidence_1 varchar(550) NULL, evidence_2 varchar(550) NULL, evidence_3 varchar(550) NULL, evidence_4 varchar(550) NULL, live_sign varchar(550) NULL, created_by uuid NULL, verified_at timestamptz(6) NULL, verified_by uuid NULL, pm_id int4 NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, catatan text NULL, status_detail int4 NULL, sign_name varchar NULL, reason_reject varchar NULL, pm_create_date timestamptz NULL, CONSTRAINT pk_pm_t_log_id PRIMARY KEY (id));


-- public.provinsi definition

-- Drop table

-- DROP TABLE public.provinsi;

CREATE TABLE public.provinsi ( id serial4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL);


-- public.qc_data_barang definition

-- Drop table

-- DROP TABLE public.qc_data_barang;

CREATE TABLE public.qc_data_barang ( id serial4 NOT NULL, data_barang_id int4 NOT NULL, tracking_id int4 NULL, keterangan varchar NULL, status varchar NOT NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL);


-- public.qc_part_data_barang definition

-- Drop table

-- DROP TABLE public.qc_part_data_barang;

CREATE TABLE public.qc_part_data_barang ( id serial4 NOT NULL, "QCDataBarang" int4 NOT NULL, "PartDataBarang" int4 NOT NULL, is_ok bool NOT NULL);


-- public.regional definition

-- Drop table

-- DROP TABLE public.regional;

CREATE TABLE public.regional ( id serial4 NOT NULL, nama varchar NOT NULL);


-- public.relokasi definition

-- Drop table

-- DROP TABLE public.relokasi;

CREATE TABLE public.relokasi ( id serial4 NOT NULL, kode_transaksi varchar NOT NULL, tanggal_pengajuan date NULL, ttd_witel_id uuid NOT NULL, ttd_telkom_akses_id uuid NULL, ttd_hq_id uuid NULL, spbu_awal_id int4 NULL, witel_id int4 NULL, is_relokasi_penarikan_selesai bool NULL, is_relokasi_instalasi_selesai bool NULL, confirmed bool NULL);


-- public.relokasi_data_barang definition

-- Drop table

-- DROP TABLE public.relokasi_data_barang;

CREATE TABLE public.relokasi_data_barang ( id serial4 NOT NULL, relokasi_id int4 NOT NULL, data_barang_id int4 NOT NULL, spbu_awal_id int4 NOT NULL, spbu_relokasi_id int4 NULL, tiket varchar NULL, alasan varchar NULL);


-- public."role" definition

-- Drop table

-- DROP TABLE public."role";

CREATE TABLE public."role" ( id serial4 NOT NULL, nama varchar NOT NULL, deskripsi varchar NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, group_id int4 NULL, CONSTRAINT pk_role_id PRIMARY KEY (id));


-- public.role_permission definition

-- Drop table

-- DROP TABLE public.role_permission;

CREATE TABLE public.role_permission ( id serial4 NOT NULL, role_id int4 NOT NULL, permission_id int4 NOT NULL, CONSTRAINT pk_role_permission_id PRIMARY KEY (id));


-- public.st_perangkat_rusak definition

-- Drop table

-- DROP TABLE public.st_perangkat_rusak;

CREATE TABLE public.st_perangkat_rusak ( id serial4 NOT NULL, tanggal_penyerahan date NOT NULL, ttd_witel_id uuid NULL, witel_id int4 NULL, ttd_telkom_akses_id uuid NOT NULL, ttd_telkom_sigma_id uuid NULL);


-- public.st_perangkat_rusak_data_barang definition

-- Drop table

-- DROP TABLE public.st_perangkat_rusak_data_barang;

CREATE TABLE public.st_perangkat_rusak_data_barang ( id serial4 NOT NULL, st_perangkat_rusak_id int4 NOT NULL, spbu_id int4 NOT NULL, data_barang_rusak_id int4 NOT NULL, data_barang_pengganti_id int4 NULL, penyebab_kerusakan varchar NULL, kronologi_kerusakan varchar NULL, no_tiket varchar NULL);


-- public.state definition

-- Drop table

-- DROP TABLE public.state;

CREATE TABLE public.state ( id int4 NOT NULL, nama varchar NOT NULL, deleted_at timestamptz(6) NULL);


-- public.status definition

-- Drop table

-- DROP TABLE public.status;

CREATE TABLE public.status ( id int4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, state_id int4 NULL);


-- public.status_barang definition

-- Drop table

-- DROP TABLE public.status_barang;

CREATE TABLE public.status_barang ( id int4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL);


-- public.status_pengiriman definition

-- Drop table

-- DROP TABLE public.status_pengiriman;

CREATE TABLE public.status_pengiriman ( id int4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL);


-- public.status_relocation definition

-- Drop table

-- DROP TABLE public.status_relocation;

CREATE TABLE public.status_relocation ( id int4 NOT NULL, nama varchar NOT NULL);


-- public.status_rma definition

-- Drop table

-- DROP TABLE public.status_rma;

CREATE TABLE public.status_rma ( id int4 NOT NULL, nama varchar NOT NULL);


-- public.stock definition

-- Drop table

-- DROP TABLE public.stock;

CREATE TABLE public.stock ( id int4 NOT NULL, tanggal date NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, owned_by int4 NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.stock_akhir definition

-- Drop table

-- DROP TABLE public.stock_akhir;

CREATE TABLE public.stock_akhir ( id int4 NOT NULL, tanggal date NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, owned_by int4 NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.stock_awal definition

-- Drop table

-- DROP TABLE public.stock_awal;

CREATE TABLE public.stock_awal ( id int4 NOT NULL, "year" int4 NOT NULL, "month" int4 NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.t_content_notification definition

-- Drop table

-- DROP TABLE public.t_content_notification;

CREATE TABLE public.t_content_notification ( id serial4 NOT NULL, nama_content text NULL, deskripsi text NULL, type_notif varchar NULL, pengguna_notifikasi varchar NULL, title varchar(50) NULL, CONSTRAINT pk_t_content_notification_id PRIMARY KEY (id));


-- public.t_exsel_lisensi definition

-- Drop table

-- DROP TABLE public.t_exsel_lisensi;

CREATE TABLE public.t_exsel_lisensi ( id serial4 NOT NULL, "no" int4 NULL, nama varchar(100) NULL, alamat text NULL, expire date NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, CONSTRAINT pk_t_exsel_lisensi_id PRIMARY KEY (id));


-- public.t_forgot_password definition

-- Drop table

-- DROP TABLE public.t_forgot_password;

CREATE TABLE public.t_forgot_password ( id serial4 NOT NULL, user_id uuid NOT NULL, email varchar(100) NULL, "password" varchar NULL, created_date timestamptz(6) NULL, "key" varchar NULL, CONSTRAINT pk_t_forgot_password_id PRIMARY KEY (id));


-- public.t_group definition

-- Drop table

-- DROP TABLE public.t_group;

CREATE TABLE public.t_group ( id serial4 NOT NULL, nama varchar NOT NULL, deskripsi varchar NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT t_group_pk PRIMARY KEY (id));


-- public.t_lisensi definition

-- Drop table

-- DROP TABLE public.t_lisensi;

CREATE TABLE public.t_lisensi ( "int" varchar(50) NOT NULL, lic_site varchar(50) NULL, nama_spbu varchar(50) NULL, alamat_lisensi text NULL, kadaluarsa date NULL, lisensi_hash varchar(255) NULL, created_at timestamptz NULL, updated_at timestamptz NULL, created_by_id uuid NULL, updated_by_id uuid NULL, is_active bool NULL, id int4 NULL, file_path varchar NULL, nomor_spbu varchar(50) NULL, filename varchar(100) NULL);


-- public.t_m_anomaly_logon definition

-- Drop table

-- DROP TABLE public.t_m_anomaly_logon;

CREATE TABLE public.t_m_anomaly_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, anomaly_logon_name varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_anomaly_logon_pk PRIMARY KEY (id));


-- public.t_m_condition_logon definition

-- Drop table

-- DROP TABLE public.t_m_condition_logon;

CREATE TABLE public.t_m_condition_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, kondition_name varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT condition_logon_pk PRIMARY KEY (id));


-- public.t_m_division definition

-- Drop table

-- DROP TABLE public.t_m_division;

CREATE TABLE public.t_m_division ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_division varchar(50) NOT NULL, division_name varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_division_pk PRIMARY KEY (id));


-- public.t_m_global_variabel definition

-- Drop table

-- DROP TABLE public.t_m_global_variabel;

CREATE TABLE public.t_m_global_variabel ( id uuid DEFAULT uuid_generate_v4() NOT NULL, "name" varchar NOT NULL, value varchar NULL, "group" varchar NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz NULL, deleted_at timestamptz NULL, satuan varchar NULL, is_encrypted bool NULL, is_active bool DEFAULT true NULL, CONSTRAINT global_variabel PRIMARY KEY (id));


-- public.t_m_jadwal_shift definition

-- Drop table

-- DROP TABLE public.t_m_jadwal_shift;

CREATE TABLE public.t_m_jadwal_shift ( id uuid DEFAULT uuid_generate_v4() NOT NULL, nama_shift varchar(100) NOT NULL, waktu_mulai time NOT NULL, waktu_selesai time NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_jadwal_shift_pk PRIMARY KEY (id));


-- public.t_m_new_data_logon definition

-- Drop table

-- DROP TABLE public.t_m_new_data_logon;

CREATE TABLE public.t_m_new_data_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, data_logon_name varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_new_data_logon_pk PRIMARY KEY (id));


-- public.t_m_reason_rating definition

-- Drop table

-- DROP TABLE public.t_m_reason_rating;

CREATE TABLE public.t_m_reason_rating ( id uuid DEFAULT uuid_generate_v4() NOT NULL, reason_rating varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, is_positive bool NOT NULL, CONSTRAINT t_m_reason_rating_pk PRIMARY KEY (id));


-- public.t_m_status_anomaly_dispenser definition

-- Drop table

-- DROP TABLE public.t_m_status_anomaly_dispenser;

CREATE TABLE public.t_m_status_anomaly_dispenser ( id uuid DEFAULT uuid_generate_v4() NOT NULL, anomaly_logon_name varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_anomaly_dispenser_pk PRIMARY KEY (id));


-- public.t_m_status_anomaly_logon definition

-- Drop table

-- DROP TABLE public.t_m_status_anomaly_logon;

CREATE TABLE public.t_m_status_anomaly_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, anomaly_logon_name varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_mstatus_anomaly_logon_pk PRIMARY KEY (id));


-- public.t_m_status_gangguan_logon definition

-- Drop table

-- DROP TABLE public.t_m_status_gangguan_logon;

CREATE TABLE public.t_m_status_gangguan_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, gangguan_logon varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_status_gangguan_logon_pk PRIMARY KEY (id));


-- public.t_m_status_shift_kehadiran_member definition

-- Drop table

-- DROP TABLE public.t_m_status_shift_kehadiran_member;

CREATE TABLE public.t_m_status_shift_kehadiran_member ( id uuid DEFAULT uuid_generate_v4() NOT NULL, status_shift varchar(100) NOT NULL, order_data serial4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_m_status_shift_kehadiran_member_pk PRIMARY KEY (id));


-- public.t_master_data_activity definition

-- Drop table

-- DROP TABLE public.t_master_data_activity;

CREATE TABLE public.t_master_data_activity ( id serial4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, type_master_data varchar NULL, "order" int4 NULL, deskripsi text NULL, CONSTRAINT t_master_data_activity_pk PRIMARY KEY (id));


-- public.t_master_data_kategori definition

-- Drop table

-- DROP TABLE public.t_master_data_kategori;

CREATE TABLE public.t_master_data_kategori ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, is_active bool NULL, nama varchar(50) NULL, lokasi varchar(50) NULL, is_rack_it bool NULL, "order" int2 NULL, CONSTRAINT t_master_data_kategori_pk PRIMARY KEY (id));


-- public.t_metadata definition

-- Drop table

-- DROP TABLE public.t_metadata;

CREATE TABLE public.t_metadata ( id serial4 NOT NULL, value text NULL, is_active bool NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, user_id uuid NULL, "path" text NULL, deskripsi text NULL, CONSTRAINT t_metadata_pk PRIMARY KEY (id));


-- public.t_module definition

-- Drop table

-- DROP TABLE public.t_module;

CREATE TABLE public.t_module ( id serial4 NOT NULL, nama varchar NOT NULL, is_active bool NOT NULL, "order" int4 NULL, CONSTRAINT pk_t_module_id PRIMARY KEY (id));


-- public.t_notification definition

-- Drop table

-- DROP TABLE public.t_notification;

CREATE TABLE public.t_notification ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, "order" int4 NULL, is_active bool NULL, start_date date NULL, end_date date NULL, is_read bool NULL, kondisi varchar(100) NULL, aktivitas_selanjutnya text NULL, isi_notifikasi text NULL, code_ticket varchar NULL, read_at timestamptz NULL, role_id int4 NULL, user_id uuid NULL, kode_spbu varchar(200) NULL);


-- public.t_pemilik_asset definition

-- Drop table

-- DROP TABLE public.t_pemilik_asset;

CREATE TABLE public.t_pemilik_asset ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, is_active bool NULL, nama varchar(50) NULL, CONSTRAINT pk_t_pemilik_asset PRIMARY KEY (id));


-- public.t_posisi_aset definition

-- Drop table

-- DROP TABLE public.t_posisi_aset;

CREATE TABLE public.t_posisi_aset ( id serial4 NOT NULL, nama varchar NULL, CONSTRAINT t_posisi_aset_pk PRIMARY KEY (id));


-- public.t_role_permission definition

-- Drop table

-- DROP TABLE public.t_role_permission;

CREATE TABLE public.t_role_permission ( id serial4 NOT NULL, role_id int4 NOT NULL, permission_id int4 NOT NULL, is_active bool NULL, CONSTRAINT pk_t_role_permission_id PRIMARY KEY (id));


-- public.t_status_asset_verify definition

-- Drop table

-- DROP TABLE public.t_status_asset_verify;

CREATE TABLE public.t_status_asset_verify ( id serial4 NOT NULL, nama_status varchar NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, nama varchar NULL, CONSTRAINT pk_status_asset_verify PRIMARY KEY (id));


-- public.t_status_coordinate_verify definition

-- Drop table

-- DROP TABLE public.t_status_coordinate_verify;

CREATE TABLE public.t_status_coordinate_verify ( id serial4 NOT NULL, nama_status varchar NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, nama varchar(50) NULL, CONSTRAINT pk_status_coordinate_verify PRIMARY KEY (id));


-- public.t_status_inventaris definition

-- Drop table

-- DROP TABLE public.t_status_inventaris;

CREATE TABLE public.t_status_inventaris ( id serial4 NOT NULL, nama varchar NULL, CONSTRAINT t_status_inventaris_pk PRIMARY KEY (id));


-- public.t_status_opname definition

-- Drop table

-- DROP TABLE public.t_status_opname;

CREATE TABLE public.t_status_opname ( id serial4 NOT NULL, nama varchar NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pk_t_status_opname PRIMARY KEY (id));


-- public.t_status_option_asset definition

-- Drop table

-- DROP TABLE public.t_status_option_asset;

CREATE TABLE public.t_status_option_asset ( id serial4 NOT NULL, nama varchar(50) NULL, code_option_asset varchar(50) NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, is_active bool NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, CONSTRAINT pk_t_status_option_asset_id PRIMARY KEY (id));


-- public.t_status_reject definition

-- Drop table

-- DROP TABLE public.t_status_reject;

CREATE TABLE public.t_status_reject ( id serial4 NOT NULL, nama varchar NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT pk_t_status_reject PRIMARY KEY (id));


-- public.t_ticket_details definition

-- Drop table

-- DROP TABLE public.t_ticket_details;

CREATE TABLE public.t_ticket_details ( id serial4 NOT NULL, t_ticket_id int4 NOT NULL, requester_by_id uuid NULL, taker_by_id uuid NULL, solver_by_ud uuid NULL, requester_date timestamp NULL, taker_date timestamp NULL, solver_date timestamp NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp NULL, is_active bool NULL, deleted_at timetz NULL, CONSTRAINT pk_t_ticket_details_id PRIMARY KEY (id));


-- public.t_ticket_log definition

-- Drop table

-- DROP TABLE public.t_ticket_log;

CREATE TABLE public.t_ticket_log ( id serial4 NOT NULL, status varchar(50) NULL, "date" timestamptz NULL, user_id uuid NULL, code_ticket varchar NULL, status_id int4 NULL, CONSTRAINT t_ticket_log_pk PRIMARY KEY (id));
CREATE INDEX i_t_ticket_log ON public.t_ticket_log USING btree (status, code_ticket, date);


-- public.t_ticket_note definition

-- Drop table

-- DROP TABLE public.t_ticket_note;

CREATE TABLE public.t_ticket_note ( id serial4 NOT NULL, t_ticket_id int4 NOT NULL, id_ticket_status int4 NULL, catatan_status_ticket text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, code_ticket varchar NULL, CONSTRAINT pk_t_ticket_note_id PRIMARY KEY (id));


-- public.t_ticket_status definition

-- Drop table

-- DROP TABLE public.t_ticket_status;

CREATE TABLE public.t_ticket_status ( id serial4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, type_status varchar NULL, "order" int4 NULL, group_id int4 NULL, group_name varchar(50) NULL, CONSTRAINT t_ticket_status_pk PRIMARY KEY (id));
CREATE INDEX i_t_t_ticket_status ON public.t_ticket_status USING btree (id, nama, is_active);


-- public.t_user_log_aktivitas definition

-- Drop table

-- DROP TABLE public.t_user_log_aktivitas;

CREATE TABLE public.t_user_log_aktivitas ( id serial4 NOT NULL, created_at timestamptz(6) NOT NULL, user_id uuid NOT NULL, activity text NULL, "date" date NULL, lokasi_witel text NULL, CONSTRAINT t_user_log_aktivitas_pk PRIMARY KEY (id));


-- public.t_work_logs definition

-- Drop table

-- DROP TABLE public.t_work_logs;

CREATE TABLE public.t_work_logs ( id serial4 NOT NULL, code_ticket varchar(25) NOT NULL, catatan_work_logs text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT t_logs_pk PRIMARY KEY (id));
CREATE INDEX i_t_work_logs ON public.t_work_logs USING btree (catatan_work_logs, code_ticket, is_active);


-- public.task definition

-- Drop table

-- DROP TABLE public.task;

CREATE TABLE public.task ( id serial4 NOT NULL, tanggal_kirim date NULL, kode_transaksi varchar NULL, lokasi_id int4 NULL, tujuan_id int4 NULL, pic_id uuid NULL, tanggal_diterima date NULL, upload_bast varchar NULL, tipe_task varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, task_tahapan_id int4 NULL, done_at timestamptz(6) NULL, pic_at timestamptz(6) NULL, ba_instalasi_selesai_path varchar NULL, perihal varchar NULL, keterangan varchar NULL, lampiran_path varchar NULL, ttd_spbu_path varchar NULL, relokasi_id int4 NULL, ba_kerusakan_path varchar NULL, no_urut_relokasi_instalasi varchar NULL, ba_relokasi_penarikan_selesai_path varchar NULL, no_pendonor_relokasi_instalasi varchar NULL);


-- public.task_barang definition

-- Drop table

-- DROP TABLE public.task_barang;

CREATE TABLE public.task_barang ( id serial4 NOT NULL, task_id int4 NOT NULL, data_barang_id int4 NOT NULL, is_monitored_ok bool NULL, evidence varchar NULL, tanda_tangan_pengawas varchar NULL, tanda_tangan_waspang varchar NULL, ba_path varchar NULL, status_id int4 NULL, state_id int4 NULL, keterangan_aset_rusak varchar NULL, relokasi_id int4 NULL, spbu_awal_id int4 NULL, alasan_relokasi varchar NULL, nama_pic_spbu varchar NULL, jabatan_pic_spbu varchar NULL, lost_witel_approval_id uuid NULL, ba_path_st_perangkat_rusak varchar NULL);


-- public.task_barang_evidence definition

-- Drop table

-- DROP TABLE public.task_barang_evidence;

CREATE TABLE public.task_barang_evidence ( id serial4 NOT NULL, task_barang_id int4 NOT NULL, file_evidence varchar NOT NULL);


-- public.task_evidence definition

-- Drop table

-- DROP TABLE public.task_evidence;

CREATE TABLE public.task_evidence ( id serial4 NOT NULL, task_id int4 NOT NULL, file_evidence varchar NOT NULL);


-- public.task_tahapan definition

-- Drop table

-- DROP TABLE public.task_tahapan;

CREATE TABLE public.task_tahapan ( id int4 NOT NULL, nama varchar NOT NULL, urutan int4 NULL, tipe_task varchar NULL);


-- public.temp_analytic definition

-- Drop table

-- DROP TABLE public.temp_analytic;

CREATE TABLE public.temp_analytic ( dayname varchar(255) NULL, tanggal varchar(255) NULL, region_id int4 NULL, region varchar(255) NULL, witel_id int4 NULL, witel varchar(255) NULL, master_data_barang_id int4 NULL, data_barang_id int4 NULL, serial_number varchar(255) NULL, lokasi varchar(255) NULL, execute_time timestamptz DEFAULT clock_timestamp() NULL, report bpchar(1) NULL, "condition" varchar(255) NULL);


-- public.temp_ava_suca definition

-- Drop table

-- DROP TABLE public.temp_ava_suca;

CREATE TABLE public.temp_ava_suca ( "partition" varchar(32) NULL, bulan int4 NULL, tahun int4 NULL, id_region int4 NULL, regional varchar(255) NULL, id_witel int4 NULL, witel varchar(255) NULL, historis_stock int4 NULL, stock_awal_n5 int4 NULL, stock_awal_a930 int4 NULL, stock_awal_total int4 NULL, terpakai_n5 int4 NULL, terpakai_a930 int4 NULL, pemenuhan_n5 int4 NULL, pemenuhan_a930 int4 NULL, stock_akhir_n5 int4 NULL, stock_akhir_a930 int4 NULL, stock_akhir_total int4 NULL, availability float8 NULL, selisih int4 NULL, id int4 NOT NULL, CONSTRAINT temp_ava_suca_pkey PRIMARY KEY (id));


-- public.temp_pemenuhan definition

-- Drop table

-- DROP TABLE public.temp_pemenuhan;

CREATE TABLE public.temp_pemenuhan ( regional int4 NULL, witel varchar(255) NULL, serial_number varchar(255) NULL, master_data varchar(255) NULL, dt varchar(255) NULL);


-- public.temp_stok_akhir definition

-- Drop table

-- DROP TABLE public.temp_stok_akhir;

CREATE TABLE public.temp_stok_akhir ( log_date date NULL, master_data_barang_id int4 NULL, serial_number varchar(255) NULL, witel_id int4 NULL, region_id int4 NULL);


-- public.temp_stok_awal definition

-- Drop table

-- DROP TABLE public.temp_stok_awal;

CREATE TABLE public.temp_stok_awal ( log_date date NULL, master_data_barang_id int4 NULL, serial_number varchar(255) NULL, witel_id int4 NULL, region_id int4 NULL);


-- public.temp_stok_awal_agg definition

-- Drop table

-- DROP TABLE public.temp_stok_awal_agg;

CREATE TABLE public.temp_stok_awal_agg ( witel_id int4 NULL, a930_awal int4 NULL, n5_awal int4 NULL, total_awal int4 NULL);


-- public.temp_terpakai definition

-- Drop table

-- DROP TABLE public.temp_terpakai;

CREATE TABLE public.temp_terpakai ( spbu_id varchar(255) NULL, regional varchar(255) NULL, witel varchar(255) NULL, master_barang varchar(255) NULL, serial_number varchar(255) NULL, dt date NULL);


-- public.terpakai definition

-- Drop table

-- DROP TABLE public.terpakai;

CREATE TABLE public.terpakai ( id int4 NOT NULL, tanggal date NOT NULL, regional_id int4 NOT NULL, witel_id int4 NOT NULL, master_data_barang_id int4 NOT NULL, owned_by int4 NULL, data_barang_id int4 NOT NULL, created_at timestamptz(6) NOT NULL);


-- public.tipe_spbu definition

-- Drop table

-- DROP TABLE public.tipe_spbu;

CREATE TABLE public.tipe_spbu ( id int4 NOT NULL, nama varchar NOT NULL);


-- public.tracking definition

-- Drop table

-- DROP TABLE public.tracking;

CREATE TABLE public.tracking ( id serial4 NOT NULL, tanggal_kirim timestamptz(6) NULL, kode_transaksi varchar NULL, pengirim_id int4 NOT NULL, tujuan_id int4 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, upload_resi varchar NULL, no_resi varchar NULL, ekspedisi varchar NULL, pic_id uuid NULL, tanggal_diterima date NULL, upload_bast varchar NULL, ekspedisi_id int4 NULL, waybill_raja_ongkir text NULL, note_sampai_tujuan varchar NULL);


-- public.tracking_barang definition

-- Drop table

-- DROP TABLE public.tracking_barang;

CREATE TABLE public.tracking_barang ( id serial4 NOT NULL, tracking_id int4 NOT NULL, data_barang_id int4 NOT NULL, is_qc_pass bool NULL);


-- public.tracking_evidence definition

-- Drop table

-- DROP TABLE public.tracking_evidence;

CREATE TABLE public.tracking_evidence ( id serial4 NOT NULL, tracking_id int4 NOT NULL, file_evidence varchar NOT NULL);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" ( id uuid DEFAULT gen_random_uuid() NOT NULL, email varchar NOT NULL, username varchar NULL, "password" varchar NOT NULL, is_active bool NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, role_id int4 NULL, witel_id int4 NULL, spbu_id int4 NULL, jabatan varchar NULL, pengirim_penerima_id int4 NULL, "NIK" varchar NULL, signature_path varchar NULL, phone_number varchar NULL, CONSTRAINT user_pk PRIMARY KEY (id));

-- Table Triggers

create trigger t_sync_data_user_telkom_akses before
insert
    or
update
    on
    public."user" for each row execute function f_sync_data_user_telkom_akses();


-- public.user_permission definition

-- Drop table

-- DROP TABLE public.user_permission;

CREATE TABLE public.user_permission ( user_id uuid NOT NULL, permission_id int4 NOT NULL, "grant" bool NULL);


-- public.user_role definition

-- Drop table

-- DROP TABLE public.user_role;

CREATE TABLE public.user_role ( id serial4 NOT NULL, user_id uuid NOT NULL, role_id int4 NOT NULL);

-- Table Triggers

create trigger t_sync_data_user_telkom_akses after
insert
    or
update
    on
    public.user_role for each row execute function f_sync_data_user_telkom_akses();


-- public.vendor definition

-- Drop table

-- DROP TABLE public.vendor;

CREATE TABLE public.vendor ( id serial4 NOT NULL, nama varchar NOT NULL);


-- public.warantty definition

-- Drop table

-- DROP TABLE public.warantty;

CREATE TABLE public.warantty ( id serial4 NOT NULL, nama varchar NULL, tanggal_berakhir date NULL, action_ketika_rma varchar NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL);


-- public.wilayah definition

-- Drop table

-- DROP TABLE public.wilayah;

CREATE TABLE public.wilayah ( id serial4 NOT NULL, nama varchar NOT NULL, sla float8 NULL);


-- public.new_witel definition

-- Drop table

-- DROP TABLE public.new_witel;

CREATE TABLE public.new_witel ( id serial4 NOT NULL, nama varchar NULL, "order" int4 NULL, code int4 NULL, regional_inventaris_id int4 NULL, CONSTRAINT new_witel_pk PRIMARY KEY (id), CONSTRAINT fk_regional_new_witel FOREIGN KEY (regional_inventaris_id) REFERENCES public.new_regional(id));


-- public.pm_detail_preventive definition

-- Drop table

-- DROP TABLE public.pm_detail_preventive;

CREATE TABLE public.pm_detail_preventive ( id serial4 NOT NULL, pm_preventive_id int4 NULL, asset_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, foto_asset_depan varchar(550) NULL, foto_asset_atas varchar(550) NULL, foto_asset_dalam varchar(550) NULL, foto_asset_belakang varchar(550) NULL, kondisi bool NULL, catatan text NULL, pm_status_detail_id int4 DEFAULT 1 NOT NULL, verified_tl_by_id uuid NULL, verified_tl_at timestamptz(6) NULL, activity_pm_id int4 NULL, reason_reject varchar NULL, CONSTRAINT pm_detail_preventive_id PRIMARY KEY (id), CONSTRAINT fk_status_pm_detail_preventive FOREIGN KEY (pm_status_detail_id) REFERENCES public.pm_detail_status(id));

-- Column comments

COMMENT ON COLUMN public.pm_detail_preventive.foto_asset_depan IS 'Evidence 1';
COMMENT ON COLUMN public.pm_detail_preventive.foto_asset_atas IS 'Evidence 2';
COMMENT ON COLUMN public.pm_detail_preventive.foto_asset_dalam IS 'Evidence 3';
COMMENT ON COLUMN public.pm_detail_preventive.foto_asset_belakang IS 'Evidence 4';


-- public.t_inventaris_asset definition

-- Drop table

-- DROP TABLE public.t_inventaris_asset;

CREATE TABLE public.t_inventaris_asset ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, nomor_inventaris varchar(100) NULL, submit_date timestamptz NULL, wilayah_kerja_id int4 NULL, status_id int4 DEFAULT 1 NOT NULL, longitude float8 NULL, latitude float8 NULL, status_coordinate_verify_id int4 NULL, verified_tl_by_id uuid NULL, verified_sda_by_id uuid NULL, flag varchar NULL, revalidate int4 DEFAULT 0 NULL, CONSTRAINT t_inventaris_asset_pkey PRIMARY KEY (id), CONSTRAINT fk_status_coordinate_verify FOREIGN KEY (status_coordinate_verify_id) REFERENCES public.t_status_coordinate_verify(id), CONSTRAINT fk_status_inventaris FOREIGN KEY (status_id) REFERENCES public.t_status_inventaris(id));

-- Table Triggers

create trigger t_generate_sequence_t_inventaris_asset_seq before
insert
    on
    public.t_inventaris_asset for each row execute function f_add_sequence_t_code_inventaris_asset();


-- public.t_kategori definition

-- Drop table

-- DROP TABLE public.t_kategori;

CREATE TABLE public.t_kategori ( id serial4 NOT NULL, nama varchar NOT NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, group_id int4 NULL, kategori_id int4 NULL, created_by_id varchar(50) NULL, updated_by_id varchar(50) NULL, created_at varchar(50) NULL, updated_at varchar(50) NULL, CONSTRAINT t_kategori_pk PRIMARY KEY (id), CONSTRAINT fk_t_kategori_group_id FOREIGN KEY (group_id) REFERENCES public.t_group(id));
CREATE INDEX i_t_kategori ON public.t_kategori USING btree (id, nama, is_active);


-- public.t_kategori_asset definition

-- Drop table

-- DROP TABLE public.t_kategori_asset;

CREATE TABLE public.t_kategori_asset ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, is_active bool NULL, nama varchar(50) NULL, lokasi varchar(50) NULL, is_rack_it bool NULL, "order" int4 NULL, code varchar NULL, master_data_id int4 NULL, CONSTRAINT pk_t_kategori_asset_id PRIMARY KEY (id), CONSTRAINT fk_master_data_kategori FOREIGN KEY (master_data_id) REFERENCES public.t_master_data_kategori(id));


-- public.t_log_asset definition

-- Drop table

-- DROP TABLE public.t_log_asset;

CREATE TABLE public.t_log_asset ( id serial4 NOT NULL, t_asset_id int4 NOT NULL, t_inventaris_asset_id int4 NULL, change_data timestamptz(6) NULL, tiket_insera varchar NULL, foto_asset varchar(500) NULL, foto_ba varchar(500) NULL, foto_sn varchar(500) NULL, verified_at timestamptz(6) NULL, inventaris_at timestamptz(6) NULL, pic_inventarisasi_by_id uuid NULL, verified_tl_by_id uuid NULL, verified_sda_by_id uuid NULL, kondisi_asset varchar NULL, is_valid bool NULL, is_migrated bool DEFAULT false NULL, serial_number varchar NULL, pemilik_asset_id int4 NULL, kategori_asset_id int4 NULL, kode_spbu varchar NULL, asset_reconciled bool NULL, is_verified bool NULL, validasi bool DEFAULT false NULL, status_validasi varchar DEFAULT 'Belum Divalidasi'::character varying NULL, status_inventaris varchar DEFAULT 'Belum Diinventaris'::character varying NULL, is_active bool NULL, CONSTRAINT t_log_asset_pk PRIMARY KEY (id), CONSTRAINT fk_log_asset_inventory FOREIGN KEY (t_inventaris_asset_id) REFERENCES public.t_inventaris_asset(id) ON DELETE CASCADE);


-- public.t_log_inventaris definition

-- Drop table

-- DROP TABLE public.t_log_inventaris;

CREATE TABLE public.t_log_inventaris ( id serial4 NOT NULL, inventaris_asset_id int4 NULL, asset_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, kondisi_asset varchar NULL, is_valid bool NULL, verified_by_id uuid NULL, is_verified bool NULL, status_asset_verify_id int4 NULL, status_reject_id int4 NULL, is_relocate bool NULL, t_asset_id int4 NULL, t_inventaris_asset_id int4 NULL, change_data varchar(50) NULL, tiket_insera varchar(50) NULL, foto_asset varchar(64) NULL, foto_ba varchar(64) NULL, foto_sn varchar(50) NULL, verified_at varchar(50) NULL, inventaris_at varchar(50) NULL, pic_inventarisasi_by_id varchar(50) NULL, verified_tl_by_id varchar(50) NULL, verified_sda_by_id varchar(50) NULL, is_migrated bool NULL, serial_number varchar(50) NULL, pemilik_asset_id int4 NULL, kategori_asset_id int4 NULL, kode_spbu int4 NULL, asset_reconciled bool NULL, validasi bool NULL, previous_wilayah_kerja_id int4 NULL, status_validasi varchar DEFAULT 'Belum Divalidasi'::character varying NULL, status_inventaris varchar DEFAULT 'Belum Diinventaris'::character varying NULL, foto varchar NULL, foto_berita_acara varchar NULL, foto_serial_number varchar NULL, revalidate int4 DEFAULT 0 NULL, CONSTRAINT pk__log_inventaris_id PRIMARY KEY (id), CONSTRAINT fk_t_log_inventaris FOREIGN KEY (inventaris_asset_id) REFERENCES public.t_inventaris_asset(id) ON DELETE CASCADE);

-- Table Triggers

create trigger t_insert_asset_code_from_log after
insert
    or
update
    on
    public.t_log_inventaris for each row execute function update_asset_code_from_log();


-- public.t_permission definition

-- Drop table

-- DROP TABLE public.t_permission;

CREATE TABLE public.t_permission ( id serial4 NOT NULL, module_id int4 NULL, "permission" varchar NOT NULL, action_id int4 NULL, is_active bool NOT NULL, CONSTRAINT t_permission_id PRIMARY KEY (id), CONSTRAINT fk_t_permission_module_id FOREIGN KEY (module_id) REFERENCES public.t_module(id));


-- public.t_r_jadwal_logon definition

-- Drop table

-- DROP TABLE public.t_r_jadwal_logon;

CREATE TABLE public.t_r_jadwal_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, jadwal_shift_id uuid NOT NULL, date_open timestamptz(6) NOT NULL, kondition_id uuid NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, status_new_data_id uuid NULL, submited_at timestamptz(6) NULL, date_closed timestamptz(6) NULL, CONSTRAINT t_r_jadwal_logon_pk PRIMARY KEY (id), CONSTRAINT fk_t_r_jadwal_logon_jadwal_shift_id FOREIGN KEY (jadwal_shift_id) REFERENCES public.t_m_jadwal_shift(id), CONSTRAINT fk_t_r_jadwal_logon_kondition_id FOREIGN KEY (kondition_id) REFERENCES public.t_m_condition_logon(id), CONSTRAINT fk_t_r_jadwal_logon_new_data_logon_id FOREIGN KEY (status_new_data_id) REFERENCES public.t_m_new_data_logon(id));


-- public.t_refresh_token definition

-- Drop table

-- DROP TABLE public.t_refresh_token;

CREATE TABLE public.t_refresh_token ( "token" text NOT NULL, user_id uuid NULL, expires_at timestamptz NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, version_token int4 NULL, user_agent_hash varchar NULL, id uuid NOT NULL, ip_address varchar NULL, CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token), CONSTRAINT t_refresh_token_unique UNIQUE (id), CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE);
CREATE INDEX idx_refresh_tokens_user_id ON public.t_refresh_token USING btree (user_id);


-- public.t_role definition

-- Drop table

-- DROP TABLE public.t_role;

CREATE TABLE public.t_role ( id serial4 NOT NULL, nama varchar NOT NULL, deskripsi varchar NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, group_id int4 NULL, CONSTRAINT t_role_id PRIMARY KEY (id), CONSTRAINT fk_t_tole_constraint FOREIGN KEY (group_id) REFERENCES public.t_group(id));


-- public.t_sub_kategori definition

-- Drop table

-- DROP TABLE public.t_sub_kategori;

CREATE TABLE public.t_sub_kategori ( id serial4 NOT NULL, kategori_id int4 NOT NULL, nama varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NOT NULL, group_id int4 NULL, CONSTRAINT t_sub_kategori_pk PRIMARY KEY (id), CONSTRAINT fk_sub_kategori FOREIGN KEY (kategori_id) REFERENCES public.t_kategori(id));
CREATE INDEX i_t_sub_kategori ON public.t_sub_kategori USING btree (id, nama, is_active);


-- public.t_t_logon_shift definition

-- Drop table

-- DROP TABLE public.t_t_logon_shift;

CREATE TABLE public.t_t_logon_shift ( id uuid DEFAULT uuid_generate_v4() NOT NULL, user_id uuid NOT NULL, nik varchar(100) NULL, role_id int4 NOT NULL, status_shift_kehadiran_member_id uuid NULL, reason_hadir text NULL, evidence_path varchar(500) NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, jadwal_logon_id uuid NULL, CONSTRAINT t_t_logon_pk PRIMARY KEY (id), CONSTRAINT fk_t_t_logon_role_id FOREIGN KEY (role_id) REFERENCES public.t_role(id), CONSTRAINT fk_t_t_logon_status_shift_kehadiran_member_id FOREIGN KEY (status_shift_kehadiran_member_id) REFERENCES public.t_m_status_shift_kehadiran_member(id), CONSTRAINT fk_t_t_logon_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id), CONSTRAINT fk_tt_t_logon_shift_logon_id FOREIGN KEY (jadwal_logon_id) REFERENCES public.t_r_jadwal_logon(id));


-- public.t_t_notes_directions definition

-- Drop table

-- DROP TABLE public.t_t_notes_directions;

CREATE TABLE public.t_t_notes_directions ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_shift_id uuid NULL, note text NOT NULL, directions text NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_t_notes_directions_pk PRIMARY KEY (id), CONSTRAINT fk_t_t_notes_directions_logon_shift_id FOREIGN KEY (logon_shift_id) REFERENCES public.t_t_logon_shift(id));


-- public.t_t_ticket_member definition

-- Drop table

-- DROP TABLE public.t_t_ticket_member;

CREATE TABLE public.t_t_ticket_member ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_shift_id uuid NOT NULL, ticket_take int4 DEFAULT 0 NOT NULL, ticket_pending int4 DEFAULT 0 NOT NULL, ticket_solved int4 DEFAULT 0 NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_t_ticket_member_pk PRIMARY KEY (id), CONSTRAINT fk_t_t_ticket_member_logon_shift_id FOREIGN KEY (logon_shift_id) REFERENCES public.t_t_logon_shift(id));


-- public.t_ticket definition

-- Drop table

-- DROP TABLE public.t_ticket;

CREATE TABLE public.t_ticket ( id serial4 NOT NULL, deskripsi text NULL, code_ticket varchar(20) NULL, nomor_spbu varchar(20) NULL, kategori_id int4 NULL, sub_kategori_id int4 NULL, evidence varchar(255) NULL, taker_by_id uuid NULL, solver_by_id uuid NULL, user_role_ticket_id int4 NULL, role_permission_ticket_id int4 NULL, ticket_status_id int4 NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, type_ticket_id int4 NULL, taker_date timestamptz(6) NULL, solver_date timestamptz(6) NULL, requester_date timestamptz(6) NULL, note text NULL, pending_date timestamptz(6) NULL, user_date timestamptz(6) NULL, note_pending text NULL, kategori_id_old int4 NULL, sub_kategori_id_old int4 NULL, type_ticket_id_old int4 NULL, nomor_insera varchar(11) NULL, first_taker_id uuid NULL, first_taker_date timestamptz(6) NULL, merk_asset varchar(50) NULL, pump varchar(50) NULL, CONSTRAINT pk_t_ticket PRIMARY KEY (id), CONSTRAINT fk_t_ticket_sub_kategori FOREIGN KEY (sub_kategori_id) REFERENCES public.t_sub_kategori(id), CONSTRAINT fk_ticket_kategori FOREIGN KEY (kategori_id) REFERENCES public.t_kategori(id));
CREATE INDEX i_t_ticket ON public.t_ticket USING btree (created_at, code_ticket, is_active);

-- Table Triggers

create trigger t_generate_sequence_t_ticket_code_ticket before
insert
    on
    public.t_ticket for each row execute function f_add_sequence_t_ticket_code_ticket();


-- public.t_ticket_eskalasi definition

-- Drop table

-- DROP TABLE public.t_ticket_eskalasi;

CREATE TABLE public.t_ticket_eskalasi ( id int4 DEFAULT nextval('t_ticket_details_id_seq'::regclass) NOT NULL, deskripsi text NULL, code_ticket varchar(20) NULL, nomor_spbu varchar(20) NULL, kategori_id int4 NULL, sub_kategori_id int4 NULL, evidence varchar(255) NULL, taker_by_id uuid NULL, user_role_ticket_id int4 NULL, eskalasi_role_id int4 NULL, ticket_status_id int4 NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, type_ticket_id int4 NULL, taker_date timestamptz(6) NULL, solver_date timestamptz(6) NULL, requester_date timestamptz(6) NULL, note text NULL, pending_date timestamptz(6) NULL, user_date timestamptz(6) NULL, note_pending text NULL, note_solve text NULL, division_id uuid NULL, x2 varchar NULL, x3 varchar NULL, CONSTRAINT t_ticket_eskalasi_pk PRIMARY KEY (id), CONSTRAINT fk_eskalasi_kategori FOREIGN KEY (kategori_id) REFERENCES public.t_kategori(id), CONSTRAINT fk_eskalasi_sub_kategori FOREIGN KEY (sub_kategori_id) REFERENCES public.t_sub_kategori(id), CONSTRAINT fk_eskalasi_ticket_status FOREIGN KEY (ticket_status_id) REFERENCES public.t_ticket_status(id), CONSTRAINT fk_t_ticket_eskalasi_division_id FOREIGN KEY (division_id) REFERENCES public.t_m_division(id));
CREATE INDEX idx_ticket_eskalasi_code_spbu ON public.t_ticket_eskalasi USING btree (code_ticket, nomor_spbu);

-- Table Triggers

create trigger t_generate_sequence_t_ticket_eskalasi_code_ticket before
insert
    on
    public.t_ticket_eskalasi for each row execute function f_add_sequence_t_ticket_eskalasi_code_ticket();


-- public.t_ticket_eskalasi_log definition

-- Drop table

-- DROP TABLE public.t_ticket_eskalasi_log;

CREATE TABLE public.t_ticket_eskalasi_log ( id serial4 NOT NULL, ticket_eskalasi_id int4 NULL, "date" timestamptz NULL, user_id uuid NULL, status_id int4 NULL, CONSTRAINT t_ticket_eskalasi__log_pk PRIMARY KEY (id), CONSTRAINT fk_eskalasi_log FOREIGN KEY (ticket_eskalasi_id) REFERENCES public.t_ticket_eskalasi(id));


-- public.t_ticket_eskalasi_note definition

-- Drop table

-- DROP TABLE public.t_ticket_eskalasi_note;

CREATE TABLE public.t_ticket_eskalasi_note ( id serial4 NOT NULL, ticket_eskalasi_id int4 NOT NULL, ticket_status_id int4 NULL, catatan_status_ticket text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, x1 varchar NULL, CONSTRAINT t_ticket_eskalasi_note_pk PRIMARY KEY (id), CONSTRAINT fk_ticket_eskalasi_note FOREIGN KEY (ticket_eskalasi_id) REFERENCES public.t_ticket_eskalasi(id));


-- public.t_ticket_eskalasi_work_logs definition

-- Drop table

-- DROP TABLE public.t_ticket_eskalasi_work_logs;

CREATE TABLE public.t_ticket_eskalasi_work_logs ( id serial4 NOT NULL, ticket_eskalasi_id int4 NOT NULL, catatan_work_logs text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, CONSTRAINT t_eskalasi_work_logs_pk PRIMARY KEY (id), CONSTRAINT fk_ticket_eskalasi_work_logs FOREIGN KEY (ticket_eskalasi_id) REFERENCES public.t_ticket_eskalasi(id));


-- public.t_user_role_ticket definition

-- Drop table

-- DROP TABLE public.t_user_role_ticket;

CREATE TABLE public.t_user_role_ticket ( id serial4 NOT NULL, user_id uuid NULL, role_id int4 NULL, CONSTRAINT t_user_role_ticket_pk PRIMARY KEY (id), CONSTRAINT t_user_role_ticket_user_id UNIQUE (user_id), CONSTRAINT fk_t_user_role_ticket FOREIGN KEY (user_id) REFERENCES public."user"(id));


-- public.t_user_telegram definition

-- Drop table

-- DROP TABLE public.t_user_telegram;

CREATE TABLE public.t_user_telegram ( id serial4 NOT NULL, user_id uuid NOT NULL, ip_telegram varchar(100) NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamp NULL, is_active bool NULL, created_by uuid NULL, updated_by uuid NULL, CONSTRAINT t_user_telegram_pk PRIMARY KEY (id), CONSTRAINT fk_user_telegram FOREIGN KEY (user_id) REFERENCES public."user"(id));
CREATE INDEX i_t_user_telegram ON public.t_user_telegram USING btree (user_id, ip_telegram, is_active);


-- public.wilayah_kerja definition

-- Drop table

-- DROP TABLE public.wilayah_kerja;

CREATE TABLE public.wilayah_kerja ( id int4 DEFAULT nextval('pengirim_penerima_id_seq'::regclass) NOT NULL, kode_spbu varchar NOT NULL, nama varchar NOT NULL, alamat varchar NULL, kota_kabupaten_id int4 NULL, provinsi_id int4 NULL, longtitude varchar NULL, latitude varchar NULL, flag varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, regional_spbu varchar NULL, regional_spbu_id int4 NULL, witel_id int4 NULL, mor_id int4 NULL, "is_RAFI_2022" bool NULL, is_jalur_toll bool NULL, is_jalur_utama bool NULL, is_jalur_wisata bool NULL, is_nataru bool NULL, tipe_spbu_id int4 NULL, regional_id_2 int4 NULL, mor_id_2 int4 NULL, ploted_stock int4 NULL, wilayah_id int4 NULL, sla_id int4 NULL, regional_inventaris_id int4 NULL, network varchar NULL, witel_inventaris_id int4 NULL, "open" varchar NULL, closed varchar NULL, CONSTRAINT pengirim_penerima_pkey PRIMARY KEY (id), CONSTRAINT fk_wilayah_kerja_new_regional_id FOREIGN KEY (regional_inventaris_id) REFERENCES public.new_regional(id), CONSTRAINT fk_wilayah_kerja_new_witel_id FOREIGN KEY (witel_inventaris_id) REFERENCES public.new_witel(id));


-- public.pm_preventive definition

-- Drop table

-- DROP TABLE public.pm_preventive;

CREATE TABLE public.pm_preventive ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool NULL, nomor_preventive varchar(100) NULL, submit_date timestamptz NULL, wilayah_kerja_id int4 NULL, pm_status_id int4 NOT NULL, sign_pm varchar(500) NULL, sign_name varchar NULL, CONSTRAINT pm_preventive_id PRIMARY KEY (id), CONSTRAINT fk_status_pm_preventive FOREIGN KEY (pm_status_id) REFERENCES public.pm_status(id), CONSTRAINT fk_wilayah__kerja_id_pm_preventive FOREIGN KEY (wilayah_kerja_id) REFERENCES public.wilayah_kerja(id));

-- Table Triggers

create trigger t_generate_sequence_t_code_pm before
insert
    on
    public.pm_preventive for each row execute function f_add_sequence_t_code_pm();


-- public.t_asset_opname definition

-- Drop table

-- DROP TABLE public.t_asset_opname;

CREATE TABLE public.t_asset_opname ( id uuid DEFAULT uuid_generate_v4() NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_valid bool DEFAULT false NULL, serial_number varchar(250) DEFAULT NULL::character varying NULL, foto_serial_number varchar(500) DEFAULT NULL::character varying NULL, foto varchar(500) DEFAULT NULL::character varying NULL, status_opname_id int4 DEFAULT 1 NULL, kategori_asset int4 NULL, witel_id int4 NULL, kode_spbu varchar NULL, kondisi_asset varchar NULL, pemilik_asset_id int4 NULL, is_migrated bool DEFAULT false NULL, is_active bool NULL, foto_berita_acara varchar(500) DEFAULT NULL::character varying NULL, submitted_by uuid NULL, submitted_date timestamptz NULL, CONSTRAINT t_asset_opname_pkey PRIMARY KEY (id), CONSTRAINT fk_kategori_asset FOREIGN KEY (kategori_asset) REFERENCES public.t_kategori_asset(id), CONSTRAINT fk_pemilik_asset_id FOREIGN KEY (pemilik_asset_id) REFERENCES public.t_pemilik_asset(id), CONSTRAINT fk_status_opname_id FOREIGN KEY (status_opname_id) REFERENCES public.t_status_opname(id), CONSTRAINT fk_witel_id FOREIGN KEY (witel_id) REFERENCES public.wilayah_kerja(id));

-- Table Triggers

create trigger trg_insert_to_asset_if_finale after
insert
    or
update
    on
    public.t_asset_opname for each row execute function f_insert_to_asset_if_finale();


-- public.t_faq definition

-- Drop table

-- DROP TABLE public.t_faq;

CREATE TABLE public.t_faq ( id serial4 NOT NULL, code_faq varchar(20) NULL, masalah text NULL, mitigasi text NULL, catatan text NULL, kategori_id int4 NULL, sub_kategori_id int4 NULL, group_id int4 NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, is_active bool NULL, deleted_at timestamptz(6) NULL, deleted_by_id uuid NULL, CONSTRAINT t_faq_pk PRIMARY KEY (id), CONSTRAINT fk_t_faq_kategori FOREIGN KEY (kategori_id) REFERENCES public.t_kategori(id), CONSTRAINT fk_t_faq_sub_kategori FOREIGN KEY (sub_kategori_id) REFERENCES public.t_sub_kategori(id));

-- Table Triggers

create trigger t_generate_sequence_sequence_t_code_faq_seq_ticket before
insert
    on
    public.t_faq for each row execute function f_add_sequence_t_code_faq_seq_ticket();


-- public.t_menu definition

-- Drop table

-- DROP TABLE public.t_menu;

CREATE TABLE public.t_menu ( id serial4 NOT NULL, "name" varchar NULL, icon varchar NULL, url varchar NULL, parent_id int4 NULL, permission_id int4 NULL, is_has_child bool NULL, is_active bool NULL, "order" int4 NULL, CONSTRAINT pk_t_menu_id PRIMARY KEY (id), CONSTRAINT fk_t_menu_permission FOREIGN KEY (permission_id) REFERENCES public.t_permission(id));


-- public.t_new_lokasi definition

-- Drop table

-- DROP TABLE public.t_new_lokasi;

CREATE TABLE public.t_new_lokasi ( id serial4 NOT NULL, longtitude varchar NULL, latitude varchar NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, wilayah_kerja_id int4 NULL, CONSTRAINT pk_t_new_lokasi PRIMARY KEY (id), CONSTRAINT fk_new_lokasi_wilayah_kerja FOREIGN KEY (wilayah_kerja_id) REFERENCES public.wilayah_kerja(id));


-- public.t_t_logon_anomaly definition

-- Drop table

-- DROP TABLE public.t_t_logon_anomaly;

CREATE TABLE public.t_t_logon_anomaly ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_jadwal_id uuid NOT NULL, anomaly_logon_id uuid NULL, ticket_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_t_logon_anomaly_pk PRIMARY KEY (id), CONSTRAINT fk_t_t_logon_anomaly_anomaly_logon_id FOREIGN KEY (anomaly_logon_id) REFERENCES public.t_m_status_anomaly_logon(id), CONSTRAINT fk_t_t_logon_anomaly_logon_jadwal_id FOREIGN KEY (logon_jadwal_id) REFERENCES public.t_r_jadwal_logon(id), CONSTRAINT fk_t_t_logon_anomaly_ticket_id FOREIGN KEY (ticket_id) REFERENCES public.t_ticket(id));


-- public.t_t_logon_dispenser definition

-- Drop table

-- DROP TABLE public.t_t_logon_dispenser;

CREATE TABLE public.t_t_logon_dispenser ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_jadwal_id uuid NOT NULL, dispenser_logon_id uuid NULL, ticket_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_t_logon_dispenser_pk PRIMARY KEY (id), CONSTRAINT fk_t_t_logon_dispenser_dispenser_logon_id FOREIGN KEY (dispenser_logon_id) REFERENCES public.t_m_status_anomaly_dispenser(id), CONSTRAINT fk_t_t_logon_dispenser_logon_jadwal_id FOREIGN KEY (logon_jadwal_id) REFERENCES public.t_r_jadwal_logon(id), CONSTRAINT fk_t_t_logon_dispenser_ticket_id FOREIGN KEY (ticket_id) REFERENCES public.t_ticket(id));


-- public.t_t_logon_gangguan definition

-- Drop table

-- DROP TABLE public.t_t_logon_gangguan;

CREATE TABLE public.t_t_logon_gangguan ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_jadwal_id uuid NOT NULL, gangguan_logon_id uuid NULL, ticket_id int4 NULL, detail_gangguan text NULL, time_down timestamptz(6) NULL, time_up timestamptz(6) NULL, keterangan text NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, kategori_id int4 NULL, ticket_eskalasi_id int4 NULL, CONSTRAINT t_t_logon_gangguan_pk PRIMARY KEY (id), CONSTRAINT fk_logon_gg_ticket_eskalasi FOREIGN KEY (ticket_eskalasi_id) REFERENCES public.t_ticket_eskalasi(id), CONSTRAINT fk_t_t_logon_gangguan_gangguan_logon_id FOREIGN KEY (gangguan_logon_id) REFERENCES public.t_m_status_gangguan_logon(id), CONSTRAINT fk_t_t_logon_gangguan_logon_jadwal_id FOREIGN KEY (logon_jadwal_id) REFERENCES public.t_r_jadwal_logon(id), CONSTRAINT fk_t_t_logon_gangguan_ticket_id FOREIGN KEY (ticket_id) REFERENCES public.t_ticket(id), CONSTRAINT fk_t_t_logon_gangguankategori_id FOREIGN KEY (kategori_id) REFERENCES public.t_kategori(id));


-- public.t_t_rating_logon definition

-- Drop table

-- DROP TABLE public.t_t_rating_logon;

CREATE TABLE public.t_t_rating_logon ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_shift_id uuid NULL, rating_value int4 NULL, note_rating text NULL, t_ticket_id int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_t_rating_logon_pk PRIMARY KEY (id), CONSTRAINT fk_t_t_rating_logon_logon_shift_id FOREIGN KEY (logon_shift_id) REFERENCES public.t_t_logon_shift(id), CONSTRAINT fk_t_t_rating_logon_ticket_id FOREIGN KEY (t_ticket_id) REFERENCES public.t_ticket(id));


-- public.t_validasi_asset definition

-- Drop table

-- DROP TABLE public.t_validasi_asset;

CREATE TABLE public.t_validasi_asset ( id serial4 NOT NULL, wilayah_kerja_id int4 NULL, created_by_id uuid NULL, created_at timestamptz NULL, updated_by_id uuid NULL, updated_at timestamptz NULL, submit_date date NULL, CONSTRAINT t_validasi_asset_pk PRIMARY KEY (id), CONSTRAINT t_validasi_asset_user_created_by_fk FOREIGN KEY (created_by_id) REFERENCES public."user"(id), CONSTRAINT t_validasi_asset_user_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES public."user"(id), CONSTRAINT t_validasi_asset_wilayah_kerja_fk FOREIGN KEY (wilayah_kerja_id) REFERENCES public.wilayah_kerja(id));


-- public.t_asset definition

-- Drop table

-- DROP TABLE public.t_asset;

CREATE TABLE public.t_asset ( id serial4 NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, koneksi varchar(50) NULL, lokasi_asset varchar(50) NULL, is_valid bool DEFAULT false NULL, kategori_asset int4 NULL, witel_id int4 NULL, kode_spbu varchar NULL, status_spbu varchar(250) NULL, serial_number varchar(250) DEFAULT NULL::character varying NULL, kondisi_asset varchar NULL, merk varchar NULL, foto varchar(500) DEFAULT NULL::character varying NULL, asset_reconciled bool DEFAULT false NULL, pemilik_asset_id int4 NULL, is_rack_it bool DEFAULT false NULL, asset_code varchar(50) NULL, is_migrated bool DEFAULT false NULL, lokasi_code varchar NULL, is_verified bool DEFAULT false NULL, id_asset int4 NULL, full_asset_code varchar(50) NULL, pic_inventarisasi_by_id uuid NULL, verified_tl_by_id uuid NULL, verified_at timestamptz NULL, is_active bool NULL, verified_sda_by_id uuid NULL, code_asset varchar(50) NULL, serialnumber varchar(50) NULL, seerial_number varchar(50) NULL, foto_serial_number varchar(500) DEFAULT NULL::character varying NULL, foto_berita_acara varchar(500) DEFAULT NULL::character varying NULL, status_reject_id int4 NULL, submitted_at timestamptz(6) NULL, posisi_aset_id int4 NULL, tiket_insera varchar NULL, catatan text NULL, validated int4 DEFAULT 0 NULL, status_validasi varchar DEFAULT 'Belum Divalidasi'::character varying NULL, status_inventaris varchar DEFAULT 'Belum Diinventaris'::character varying NULL, kondisi_asset_validasi varchar NULL, revalidate int4 DEFAULT 0 NULL, foto_validasi varchar(500) DEFAULT NULL::character varying NULL, foto_serial_number_validasi varchar(500) DEFAULT NULL::character varying NULL, foto_berita_acara_validasi varchar(500) DEFAULT NULL::character varying NULL, validasi_verified_at timestamptz NULL, validasi_submitted_at timestamptz(6) NULL, is_validasi_verified bool DEFAULT false NULL, pic_validasi_by_id uuid NULL, validasi_verified_tl_by_id uuid NULL, validasi_verified_sda_by_id uuid NULL, asset_opname_id uuid NULL, CONSTRAINT full_asset_unique UNIQUE (full_asset_code), CONSTRAINT t_asset_pk PRIMARY KEY (id), CONSTRAINT u_asset_code_unique UNIQUE (asset_code), CONSTRAINT fk_asset_opname_id FOREIGN KEY (asset_opname_id) REFERENCES public.t_asset_opname(id));

-- Table Triggers

create trigger t_code_asset_t_asset before
insert
    on
    public.t_asset for each row execute function f_code_asset_asset();
create trigger t_code_lokasi_asset before
insert
    on
    public.t_asset for each row execute function f_code_update_code_asset_lokasi_from_kode_spbu();


-- public.t_log_validasi definition

-- Drop table

-- DROP TABLE public.t_log_validasi;

CREATE TABLE public.t_log_validasi ( id serial4 NOT NULL, validasi_asset_id int4 NULL, asset_id int4 NULL, created_by_id uuid NULL, created_at timestamptz NULL, updated_by_id uuid NULL, updated_at timestamptz NULL, CONSTRAINT t_log_validasi_pk PRIMARY KEY (id), CONSTRAINT t_log_validasi_created_by_fk FOREIGN KEY (created_by_id) REFERENCES public."user"(id), CONSTRAINT t_log_validasi_t_asset_fk FOREIGN KEY (asset_id) REFERENCES public.t_asset(id), CONSTRAINT t_log_validasi_t_validasi_asset_fk FOREIGN KEY (validasi_asset_id) REFERENCES public.t_validasi_asset(id), CONSTRAINT t_log_validasi_updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES public."user"(id));


-- public.t_r_rating_logon_relation definition

-- Drop table

-- DROP TABLE public.t_r_rating_logon_relation;

CREATE TABLE public.t_r_rating_logon_relation ( id uuid DEFAULT uuid_generate_v4() NOT NULL, logon_rating_id uuid NOT NULL, reason_rating_id uuid NOT NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT t_r_rating_logon_history_pk PRIMARY KEY (id), CONSTRAINT fk_t_r_rating_logon_history_logon_rating_id FOREIGN KEY (logon_rating_id) REFERENCES public.t_t_rating_logon(id), CONSTRAINT fk_t_r_rating_logon_history_reason_rating_id FOREIGN KEY (reason_rating_id) REFERENCES public.t_m_reason_rating(id));


-- public.pg_stat_statements source

CREATE OR REPLACE VIEW public.pg_stat_statements
AS SELECT userid,
    dbid,
    toplevel,
    queryid,
    query,
    plans,
    total_plan_time,
    min_plan_time,
    max_plan_time,
    mean_plan_time,
    stddev_plan_time,
    calls,
    total_exec_time,
    min_exec_time,
    max_exec_time,
    mean_exec_time,
    stddev_exec_time,
    rows,
    shared_blks_hit,
    shared_blks_read,
    shared_blks_dirtied,
    shared_blks_written,
    local_blks_hit,
    local_blks_read,
    local_blks_dirtied,
    local_blks_written,
    temp_blks_read,
    temp_blks_written,
    blk_read_time,
    blk_write_time,
    temp_blk_read_time,
    temp_blk_write_time,
    wal_records,
    wal_fpi,
    wal_bytes,
    jit_functions,
    jit_generation_time,
    jit_inlining_count,
    jit_inlining_time,
    jit_optimization_count,
    jit_optimization_time,
    jit_emission_count,
    jit_emission_time
   FROM pg_stat_statements(true) pg_stat_statements(userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, blk_read_time, blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time);


-- public.pg_stat_statements_info source

CREATE OR REPLACE VIEW public.pg_stat_statements_info
AS SELECT dealloc,
    stats_reset
   FROM pg_stat_statements_info() pg_stat_statements_info(dealloc, stats_reset);



-- DROP PROCEDURE public.analytic(varchar, varchar, date, date);

CREATE OR REPLACE PROCEDURE public.analytic(IN report character varying, IN tipe character varying, IN date_start date, IN date_end date)
 LANGUAGE plpgsql
AS $procedure$BEGIN
	-- Routine body goes here...
	
	TRUNCATE TABLE temp_analytic;

	case 
	-- kerusakan
	when report='K' THEN
		case
			when tipe = 'W' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report,"condition")
				SELECT
					to_char(ke.created_at::date, 'TMDay') as dayname,
					ke.created_at::date as tanggal,
					ke.region_id,
					wk1.nama as region,
					ke.witel_id,
					wk2.nama as witel,
					ke.master_data_barang_id,
					db."id" as data_barang_id,
					ke.serial_number,
					ke.lokasi,
					report,
					cd.nama
				FROM
					laporan_kerusakan_rnw ke
				JOIN
					"condition" cd on ke.condition_id=cd."id"
				JOIN
					wilayah_kerja wk1 on ke.region_id=wk1."id"
				JOIN
					wilayah_kerja wk2 on ke.witel_id=wk2."id" 
				JOIN
					data_barang db on ke.serial_number=db.serial_number
				WHERE
					ke.created_at::date BETWEEN date_start::date and date_end::date
				ORDER BY
				 tanggal asc, wk1.nama asc, ke.witel_id asc, ke.master_data_barang_id ASC;

			when tipe = 'M' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report)
				SELECT
					wk.week,
					lb.created_at::date as tanggal,
					lb.region_id,
					wk1.nama as region,
					lb.witel_id,
					wk2.nama as witel,
					lb.master_data_barang_id,
					db.id as data_barang_id,
					lb.serial_number,
					lb.lokasi,report
				FROM
				(
					SELECT
						'WEEK ' || rank() over (order by log_barang.log_date::date asc) week,
						EXTRACT(ISODOW FROM log_barang.log_date::date) dayy,
						to_char(log_barang.log_date::date, 'TMDay') as dayname,
						log_barang.log_date::date as tanggal_end,
						log_barang.log_date::date - 6 as tanggal_start
					FROM
						log_barang
					WHERE
						EXTRACT(MONTH from log_barang.log_date)=EXTRACT(MONTH from date_end::date) AND
						EXTRACT(YEAR from log_barang.log_date)=EXTRACT(YEAR from date_end::date) AND
						EXTRACT(ISODOW FROM log_barang.log_date::date) = 5
					GROUP BY
						dayy, tanggal_end
					ORDER BY
						tanggal_end asc) 
					wk
				JOIN
					laporan_kerusakan_rnw lb
					on lb.created_at BETWEEN wk.tanggal_start AND wk.tanggal_end+1
				JOIN
					wilayah_kerja wk1 on lb.region_id=wk1."id"
				JOIN
					wilayah_kerja wk2 on lb.witel_id=wk2."id" 
				JOIN
					data_barang db on lb.serial_number=db.serial_number
				GROUP BY
					wk.week,
					tanggal,
					lb.region_id,
					region,
					lb.witel_id,
					witel,
					lb.master_data_barang_id,
					data_barang_id,
					lb.serial_number,
					lb.lokasi,report
				ORDER BY
					wk.week asc, region asc, witel asc, master_data_barang_id asc;
			
			ELSE
				call do_nothing();
		end case;
		
		when report='L' THEN
		case
			when tipe = 'W' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report)
				SELECT
					to_char(ke.created_at::date, 'TMDay') as dayname,
					ke.created_at::date as tanggal,
					ke.region_id,
					wk1.nama as region,
					ke.witel_id,
					wk2.nama as witel,
					ke.master_data_barang_id,
					db."id" as data_barang_id,
					ke.serial_number,
					ke.lokasi,report
				FROM
					laporan_kerusakan_rnw ke
				JOIN
					wilayah_kerja wk1 on ke.region_id=wk1."id"
				JOIN
					wilayah_kerja wk2 on ke.witel_id=wk2."id" 
				JOIN
					data_barang db on ke.serial_number=db.serial_number
				WHERE ke.bisa_diganti is FALSE AND
					ke.created_at::date BETWEEN date_start::date and date_end::date
				ORDER BY
				 tanggal asc, wk1.nama asc, ke.witel_id asc, ke.master_data_barang_id ASC;

			when tipe = 'M' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report)
				SELECT
					wk.week,
					lb.created_at::date as tanggal,
					lb.region_id,
					wk1.nama as region,
					lb.witel_id,
					wk2.nama as witel,
					lb.master_data_barang_id,
					db.id as data_barang_id,
					lb.serial_number,
					lb.lokasi,report
				FROM
				(
					SELECT
						'WEEK ' || rank() over (order by log_barang.log_date::date asc) week,
						EXTRACT(ISODOW FROM log_barang.log_date::date) dayy,
						to_char(log_barang.log_date::date, 'TMDay') as dayname,
						log_barang.log_date::date as tanggal_end,
						log_barang.log_date::date - 6 as tanggal_start
					FROM
						log_barang
					WHERE
						EXTRACT(MONTH from log_barang.log_date)=EXTRACT(MONTH from date_end::date) AND
						EXTRACT(YEAR from log_barang.log_date)=EXTRACT(YEAR from date_end::date) AND
						EXTRACT(ISODOW FROM log_barang.log_date::date) = 5
					GROUP BY
						dayy, tanggal_end
					ORDER BY
						tanggal_end asc) 
					wk
				JOIN
					laporan_kerusakan_rnw lb
					on lb.created_at BETWEEN wk.tanggal_start AND wk.tanggal_end+1
				JOIN
					wilayah_kerja wk1 on lb.region_id=wk1."id"
				JOIN
					wilayah_kerja wk2 on lb.witel_id=wk2."id" 
				JOIN
					data_barang db on lb.serial_number=db.serial_number
				WHERE
				  lb.bisa_diganti is FALSE
				GROUP BY
					wk.week,
					tanggal,
					lb.region_id,
					region,
					lb.witel_id,
					witel,
					lb.master_data_barang_id,
					data_barang_id,
					lb.serial_number,
					lb.lokasi,report
				ORDER BY
					wk.week asc, region asc, witel asc, master_data_barang_id asc;
			
			ELSE
				call do_nothing();
		end case;
		
			when report='R' THEN
		case
			when tipe = 'W' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report)
				SELECT 
	to_char( rl.tanggal_pengajuan :: DATE, 'TMDay' ) AS dayname,
	rl.tanggal_pengajuan :: DATE AS tanggal,
	wk1.regional_id_2,
	wk2.nama as region,
	wk1.witel_id,
	wk3.nama as witel,
	db.barang_id,
	rd.data_barang_id,
	db.serial_number,
	'SPBU ' || wk4.nama || ' ke SPBU ' || wk1.nama,report
	--38786
	
FROM
	relokasi rl
	JOIN relokasi_data_barang rd ON rl."id" = rd.relokasi_id
	JOIN wilayah_kerja wk1 ON rd.spbu_relokasi_id = wk1."id"
	JOIN wilayah_kerja wk2 ON wk1.regional_id_2 = wk2."id"
	JOIN wilayah_kerja wk3 ON wk1.witel_id = wk3."id"
	JOIN wilayah_kerja wk4 ON rd.spbu_awal_id = wk4."id"
	JOIN data_barang db ON rd.data_barang_id = db."id"
WHERE rl.is_relokasi_instalasi_selesai is true AND
	rl.tanggal_pengajuan :: DATE BETWEEN date_start::date and date_end::date
ORDER BY
	tanggal ASC,
	wk1.nama ASC,
	wk1.witel_id ASC,
	db.barang_id ASC;

			when tipe = 'M' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report)
				SELECT
	wk.week,
	rl.tanggal_pengajuan :: DATE AS tanggal,
	wk1.regional_id_2 as region_id,
	wk2.nama as region,
	wk1.witel_id,
	wk3.nama as witel,
	db.barang_id,
	rd.data_barang_id,
	db.serial_number,
	'SPBU ' || wk4.nama || ' ke SPBU ' || wk1.nama as lokasi,report
FROM
	(
	SELECT
		'WEEK ' || RANK ( ) OVER ( ORDER BY log_barang.log_date :: DATE ASC ) week,
		EXTRACT ( ISODOW FROM log_barang.log_date :: DATE ) dayy,
		to_char( log_barang.log_date :: DATE, 'TMDay' ) AS dayname,
		log_barang.log_date :: DATE AS tanggal_end,
		log_barang.log_date :: DATE - 6 AS tanggal_start 
	FROM
		log_barang 
	WHERE
		EXTRACT ( MONTH FROM log_barang.log_date ) = EXTRACT ( MONTH FROM date_end :: DATE ) 
		AND EXTRACT ( YEAR FROM log_barang.log_date ) = EXTRACT ( YEAR FROM date_end :: DATE ) 
		AND EXTRACT ( ISODOW FROM log_barang.log_date :: DATE ) = 5 
	GROUP BY
		dayy,
		tanggal_end 
	ORDER BY
		tanggal_end ASC 
	) wk
	JOIN relokasi rl
	JOIN relokasi_data_barang rd ON rl."id" = rd.relokasi_id ON rl.tanggal_pengajuan BETWEEN wk.tanggal_start 
	AND wk.tanggal_end + 1
	JOIN wilayah_kerja wk1 ON rd.spbu_relokasi_id = wk1."id"
	JOIN wilayah_kerja wk2 ON wk1.regional_id_2 = wk2."id"
	JOIN wilayah_kerja wk3 ON wk1.witel_id = wk3."id"
	JOIN wilayah_kerja wk4 ON rd.spbu_awal_id = wk4."id"
	JOIN data_barang db ON rd.data_barang_id = db."id" 
GROUP BY
	wk.week,
	tanggal,
	wk1.regional_id_2,
	region,
	wk1.witel_id,
	witel,
	db.barang_id,
	rd.data_barang_id,
	db.serial_number,
	lokasi,report 
ORDER BY
	wk.week ASC,
	region ASC,
	witel ASC,
	barang_id ASC;
				
			ELSE
				call do_nothing();
		end case;
		
		
		WHEN report = 'S' THEN
		CASE
				
				WHEN tipe = 'W' THEN
				INSERT INTO temp_analytic ( dayname, tanggal, region_id, region, witel_id, witel, master_data_barang_id, data_barang_id, serial_number, lokasi, report ) 
				SELECT DISTINCT
				to_char( log_barang.log_date :: DATE, 'TMDay' ) AS dayname,
				log_barang.log_date :: DATE,
				wilayah_kerja.regional_id_2 AS region_id,
				wk1.nama AS region,
				wilayah_kerja."id",
				wilayah_kerja.nama,
				data_barang.barang_id AS master_data_barang_id,
				data_barang."id" AS barang_id,
				data_barang.serial_number, 
				wilayah_kerja.nama,report 
			FROM
				log_barang
				JOIN data_barang ON log_barang.data_barang_id = data_barang."id"
				JOIN wilayah_kerja ON log_barang.lokasi_id = wilayah_kerja."id"
				LEFT JOIN wilayah_kerja wk1 ON wilayah_kerja.regional_id_2 = wk1."id"
				LEFT JOIN wilayah_kerja wk2 ON wilayah_kerja.witel_id = wk2."id" 
			WHERE
				log_barang.condition_id = 2 
				AND log_barang.state_id = 2 
				AND log_barang.status_id = 5 
				AND log_date > '2022-01-01' :: DATE 
				AND log_barang.log_date < date_end::date 
			ORDER BY
				serial_number ASC;
				
			DELETE 
			FROM
				temp_analytic 
			WHERE
				serial_number IN ( SELECT tsa.serial_number FROM temp_analytic tsa WHERE tsa.serial_number = tsa.serial_number AND tsa.tanggal < tsa.tanggal );
				
				when tipe = 'M' THEN
				INSERT INTO
					temp_analytic(dayname,tanggal,region_id,region,witel_id,witel,master_data_barang_id,data_barang_id,serial_number,lokasi,report)
						SELECT 'WEEK ' ||  dense_rank()OVER w1 AS "week",
log_barang.log_date :: DATE as tanggal,
wilayah_kerja.regional_id_2 AS region_id,
wk1.nama as region,
wilayah_kerja."id",
wilayah_kerja.nama,
data_barang.barang_id AS master_data_barang_id,
data_barang."id" as barang_id,
data_barang.serial_number,
wilayah_kerja.nama,'S'
FROM  log_barang
	JOIN data_barang ON log_barang.data_barang_id = data_barang."id"
	JOIN wilayah_kerja ON log_barang.lokasi_id = wilayah_kerja."id"
	left JOIN wilayah_kerja wk1 ON wilayah_kerja.regional_id_2 = wk1."id"
	
WHERE 
	log_barang.condition_id = 2
	AND log_barang.state_id = 2 
	AND log_barang.status_id = 5 
				AND log_date > '2022-01-01' :: DATE 
				AND log_barang.log_date < date_end::date 
GROUP BY tanggal,data_barang.serial_number,data_barang."id",master_data_barang_id,region,wilayah_kerja."id",wilayah_kerja.nama,region_id
WINDOW w1 AS (ORDER BY EXTRACT(WEEK FROM log_barang.log_date::date)
                      +(EXTRACT(ISODOW FROM log_barang.log_date::date) in (6,7))::int)
ORDER BY tanggal asc;

			DELETE 
			FROM
				temp_analytic 
			WHERE
				serial_number IN ( SELECT tsa.serial_number FROM temp_analytic tsa WHERE tsa.serial_number = tsa.serial_number AND tsa.tanggal < tsa.tanggal );
					
		
					ELSE
				call do_nothing();
		end case;
	
	ELSE
	call do_nothing();
	END case;			

END$procedure$
;

-- DROP FUNCTION public.detail_report_ava(varchar, int4, date, int8, int8, int8);

CREATE OR REPLACE FUNCTION public.detail_report_ava(tipe character varying, kolom integer, deet date, regional_id bigint, witel_iid bigint, master_id bigint)
 RETURNS TABLE(barang_id bigint, number_serial character varying)
 LANGUAGE plpgsql
AS $function$ BEGIN-- Routine body goes here...
	CASE
			WHEN deet < '2024/06/01' :: DATE THEN
			-- terpakai
			case when kolom =2 THEN
					-- "Witel"
					case when witel_iid is not NULL THEN
					-- master_barang
							case when master_id is not NULL
							THEN
					RETURN query
					SELECT
					data_barang."id"::int8,
					temp_terpakai.serial_number::VARCHAR
					FROM
					temp_terpakai
					JOIN
					wilayah_kerja 
					on 'WITEL '||temp_terpakai.witel LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_terpakai.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_terpakai.dt)=EXTRACT(month from deet)
					and 
					EXTRACT(year from temp_terpakai.dt)=EXTRACT(YEAR from deet)
					and
					wilayah_kerja."id"=witel_iid
					and
					data_barang.barang_id=master_id;
					-- total
							else
					RETURN query
					SELECT
					data_barang."id"::int8,
					temp_terpakai.serial_number::VARCHAR
					FROM
					temp_terpakai
					JOIN
					wilayah_kerja 
					on 'WITEL '||temp_terpakai.witel LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_terpakai.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_terpakai.dt)=EXTRACT(month from deet)
					and 
					EXTRACT(year from temp_terpakai.dt)=EXTRACT(YEAR from deet)
					and
					wilayah_kerja."id"=witel_iid
-- 					and
-- 					data_barang.barang_id=master_id
					;
							end case;
					-- regional
					ELSE
					-- master_barang
							case when master_id is not NULL
							THEN
					RETURN query
					SELECT
					data_barang."id"::int8,
					temp_terpakai.serial_number::VARCHAR
					FROM
					temp_terpakai
					JOIN
					wilayah_kerja 
					on temp_terpakai.regional LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_terpakai.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_terpakai.dt)=EXTRACT(month from deet)
					and 
					EXTRACT(year from temp_terpakai.dt)=EXTRACT(YEAR from deet)
					and
					wilayah_kerja."id"=regional_id
					and
					data_barang.barang_id=master_id;
					-- total
							else
					RETURN query
					SELECT
					data_barang."id"::int8,
					temp_terpakai.serial_number::VARCHAR
					FROM
					temp_terpakai
					JOIN
					wilayah_kerja 
					on temp_terpakai.regional LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_terpakai.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_terpakai.dt)=EXTRACT(month from deet)
					and 
					EXTRACT(year from temp_terpakai.dt)=EXTRACT(YEAR from deet)
					and
					wilayah_kerja."id"=regional_id
-- 					and
-- 					data_barang.barang_id=master_id
					;
							end case;				
					end case;
			-- pemenuhan
			ELSE
				-- "Witel"
					case when witel_iid is not NULL THEN
					-- master_barang
							case when master_id is not NULL
							THEN
					RETURN query
					SELECT
					data_barang."id"::int8,
					temp_pemenuhan.serial_number::VARCHAR
					FROM
					temp_pemenuhan
					JOIN
					wilayah_kerja 
					on 'WITEL '||temp_pemenuhan.witel LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_pemenuhan.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_pemenuhan.dt::DATE)=EXTRACT(month from deet)
					and 
					EXTRACT(year from temp_pemenuhan.dt::DATE)=EXTRACT(YEAR from deet)
					and
					wilayah_kerja."id"=witel_iid
 					and
 					data_barang.barang_id=master_id
					;
					-- total_
							
							else
										RETURN query
					SELECT
					data_barang."id"::int8,
					temp_pemenuhan.serial_number::VARCHAR
					FROM
					temp_pemenuhan
					JOIN
					wilayah_kerja 
					on 'WITEL '||temp_pemenuhan.witel LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_pemenuhan.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_pemenuhan.dt::DATE)=EXTRACT(month from deet::DATE)
					and 
					EXTRACT(year from temp_pemenuhan.dt::DATE)=EXTRACT(YEAR from deet::DATE)
					and
					wilayah_kerja."id"=witel_iid
-- 					and
-- 					data_barang.barang_id=master_id
					;
							end case;
					-- regional
					ELSE
					-- master_barang
							case when master_id is not NULL
							THEN
					RETURN query
					SELECT
					data_barang."id"::int8,
					temp_pemenuhan.serial_number::VARCHAR
					FROM
					temp_pemenuhan
					JOIN
					wilayah_kerja 
					on 'TREG '||temp_pemenuhan.regional LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_pemenuhan.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_pemenuhan.dt::DATE)=EXTRACT(month from deet)
					and 
					EXTRACT(year from temp_pemenuhan.dt::DATE)=EXTRACT(YEAR from deet)
					and
					wilayah_kerja."id"=regional_id
 					and
 					data_barang.barang_id=master_id
					;
					-- total_
							
							else
										RETURN query
					SELECT
					data_barang."id"::int8,
					temp_pemenuhan.serial_number::VARCHAR
					FROM
					temp_pemenuhan
					JOIN
					wilayah_kerja 
					on 'TREG '||temp_pemenuhan.regional LIKE '%'||wilayah_kerja.nama||'%'
					join
					data_barang 
					on temp_pemenuhan.serial_number=data_barang.serial_number
					WHERE
					EXTRACT(month from temp_pemenuhan.dt::DATE)=EXTRACT(month from deet::DATE)
					and 
					EXTRACT(year from temp_pemenuhan.dt::DATE)=EXTRACT(YEAR from deet::DATE)
					and
					wilayah_kerja."id"=regional_id
-- 					and
-- 					data_barang.barang_id=master_id
					;
							end case;
					end case;		
			end case;
		ELSE
			RETURN query SELECT null::int8, null::VARCHAR;
	END case;			
END $function$
;

-- DROP FUNCTION public.detail_report_ava_renew(varchar, int4, date, int8, int8, int8);

CREATE OR REPLACE FUNCTION public.detail_report_ava_renew(tipe character varying, kolom integer, deet date, reg_id bigint, witel_iid bigint, master_id bigint)
 RETURNS TABLE(barang_id integer, number_serial character varying, data_barang_id bigint)
 LANGUAGE plpgsql
AS $function$ BEGIN-- Routine body goes here...
	
	case when tipe = 'M' THEN
	
			
			-- terpakai
			case when kolom =2 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				return query 
			  SELECT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.witel_id=witel_iid;
				
		ELSE
				return query 
				SELECT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		return query 
		SELECT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.region_id=reg_id;
				
		ELSE
				return query 
SELECT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.region_id=reg_id AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id;
	end case;
	end case;
			-- pemenuhan
			WHEN kolom = 3 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				return query 
			  SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.witel_id=witel_iid;
				
		ELSE
				return query 
				SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.witel_id=witel_iid AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		return query 
		SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.regional_id=reg_id;
				
		ELSE
				return query 
SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.regional_id=reg_id AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id;
	end case;
end case;

		-- stock_awal
			WHEN kolom = 1 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				
				return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid;
		ELSE
		return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid and temp_stok_awal.master_data_barang_id::int4=master_id;
				
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		
				return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id;
		ELSE
		return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id and temp_stok_awal.master_data_barang_id::int4=master_id;

	end case;
end case;
-- stok akhir
			WHEN kolom = 4 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				
								return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid	
				and temp_stok_awal.serial_number not in (
				SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.witel_id=witel_iid
				)
							
				UNION
				
				SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.witel_id=witel_iid AND
					laporan_pemenuhan_rnw.serial_number not in (
				SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.witel_id=witel_iid
				);
					
		ELSE
		return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid and temp_stok_awal.master_data_barang_id::int4=master_id 
				and temp_stok_awal.serial_number not in (
				SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id 
				)
				
				UNION
				
				SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.witel_id=witel_iid AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id AND
					laporan_pemenuhan_rnw.serial_number not in (
				SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id 
				);
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		
				return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id	
				and temp_stok_awal.serial_number not IN
				(SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.region_id=reg_id)
							
				UNION
				
				SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.regional_id=reg_id AND
					laporan_pemenuhan_rnw.serial_number not IN
				(SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.region_id=reg_id);
		ELSE
		return query
				SELECT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id and temp_stok_awal.master_data_barang_id::int4=master_id
				and temp_stok_awal.serial_number not IN
				(SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.region_id=reg_id AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id)
				
				UNION
				
				SELECT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from deet) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from deet) and laporan_pemenuhan_rnw.regional_id=reg_id AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id AND
					laporan_pemenuhan_rnw.serial_number not IN
				(SELECT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.bulan=EXTRACT(MONTH from deet) and laporan_terpakai_rnw.tahun=EXTRACT(YEAR from deet) and laporan_terpakai_rnw.region_id=reg_id AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id);
				
	end case;
end case;

		ELSE
			RETURN query SELECT DISTINCT null::int8, null::VARCHAR;
	END case;
	
	 when tipe = 'D' THEN
	
			
			-- terpakai
			case when kolom =2 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				return query 
			  SELECT DISTINCT 
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and laporan_terpakai_rnw.witel_id=witel_iid;
				
		ELSE
				return query 
				SELECT  DISTINCT 
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		return query 
		SELECT  DISTINCT 
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and laporan_terpakai_rnw.region_id=reg_id;
				
		ELSE
				return query 
SELECT DISTINCT 
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.region_id=reg_id AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id;
	end case;
	end case;
			-- pemenuhan
			WHEN kolom = 3 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				return query 
			  SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE  laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.witel_id=witel_iid;
				
		ELSE
				return query 
				SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE  laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.witel_id=witel_iid AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		return query 
		SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.regional_id=reg_id;
				
		ELSE
				return query 
SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.regional_id=reg_id AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id;
	end case;
end case;

		-- stock_awal
			WHEN kolom = 1 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				
				return query
				SELECT DISTINCT 
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid;
		ELSE
		return query
				SELECT DISTINCT 
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid and temp_stok_awal.master_data_barang_id::int4=master_id;
				
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		
				return query
				SELECT DISTINCT 
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id;
		ELSE
		return query
				SELECT DISTINCT 
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id and temp_stok_awal.master_data_barang_id::int4=master_id;

	end case;
end case;
-- stok akhir
			WHEN kolom = 4 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				
				return query
				SELECT DISTINCT 
				temp_stok_akhir.master_data_barang_id::int4,
				temp_stok_akhir.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_akhir.witel_id=witel_iid
				and temp_stok_akhir.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id) 
				UNION
				
								SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE  laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.witel_id=witel_iid AND
				laporan_pemenuhan_rnw.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id) ;
				
		ELSE
		return query
				SELECT DISTINCT 
				temp_stok_akhir.master_data_barang_id::int4,
				temp_stok_akhir.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_akhir.witel_id=witel_iid and temp_stok_akhir.master_data_barang_id::int4=master_id
				and temp_stok_akhir.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id)
				
				UNION
				
								SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE  laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.witel_id=witel_iid AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id AND
				laporan_pemenuhan_rnw.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.witel_id=witel_iid AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id);
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		
				return query
				SELECT DISTINCT 
				temp_stok_akhir.master_data_barang_id::int4,
				temp_stok_akhir.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_akhir.region_id=reg_id
				and temp_stok_akhir.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.region_id=reg_id ) 
				
				UNION
				
				SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.regional_id=reg_id AND
				laporan_pemenuhan_rnw.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.region_id=reg_id ) ;
				
				
		ELSE
		return query
				SELECT DISTINCT 
				temp_stok_akhir.master_data_barang_id::int4,
				temp_stok_akhir.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_akhir.region_id=reg_id and temp_stok_akhir.master_data_barang_id::int4=master_id 
				and temp_stok_akhir.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.region_id=reg_id AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id) 
				
				UNION
				
				SELECT DISTINCT 
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date=deet and laporan_pemenuhan_rnw.regional_id=reg_id AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id AND
				laporan_pemenuhan_rnw.serial_number not IN
				(SELECT  DISTINCT 
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE laporan_terpakai_rnw.tanggal= deet and  laporan_terpakai_rnw.region_id=reg_id AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id) ;

	end case;
end case;

		ELSE
			RETURN query SELECT DISTINCT null::int8, null::VARCHAR,null::int8;
	END case;
	
	
		 when tipe = 'W' THEN
	
			
			-- terpakai
			case when kolom =2 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				return query 
			  SELECT DISTINCT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.witel_id=witel_iid;
				
		ELSE
				return query 
				SELECT DISTINCT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id  and laporan_terpakai_rnw.witel_id=witel_iid;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		return query 
SELECT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE
					laporan_terpakai_rnw.tanggal between deet::date-7 and deet::date and laporan_terpakai_rnw.region_id=reg_id;
				
		ELSE
				return query 
SELECT DISTINCT
					laporan_terpakai_rnw.master_data_barang_id::int4,
					laporan_terpakai_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE  laporan_terpakai_rnw.tanggal between deet::date-7 and deet::date AND laporan_terpakai_rnw.master_data_barang_id::int4=master_id and laporan_terpakai_rnw.region_id=reg_id;
	end case;
	end case;
			-- pemenuhan
			WHEN kolom = 3 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				return query 
			  SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet and laporan_pemenuhan_rnw.witel_id=witel_iid;
				
		ELSE
				return query 
				SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id  and laporan_pemenuhan_rnw.witel_id=witel_iid;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		return query 
		SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet  and laporan_pemenuhan_rnw.regional_id=reg_id;
				
		ELSE
				return query 
SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet  and laporan_pemenuhan_rnw.regional_id=reg_id AND laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id;
	end case;
end case;

		-- stock_awal
			WHEN kolom = 1 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				
				return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid;
		ELSE
		return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid and temp_stok_awal.master_data_barang_id::int4=master_id;
				
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		
				return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id;
		ELSE
		return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id and temp_stok_awal.master_data_barang_id::int4=master_id;

	end case;
end case;
-- stok akhir
			WHEN kolom = 4 THEN
case when witel_iid is NOT null THEN
		case when master_id is null THEN
				
				return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid
				and temp_stok_awal.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.witel_id=witel_iid
				)
				
				UNION
				
				SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet and laporan_pemenuhan_rnw.witel_id=witel_iid			AND
				laporan_pemenuhan_rnw.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.witel_id=witel_iid
				)	
				;
		ELSE
		return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid and temp_stok_awal.master_data_barang_id::int4=master_id
				and temp_stok_awal.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.witel_id=witel_iid and laporan_terpakai_rnw.master_data_barang_id::int4=master_id
				)
				
				UNION
				
				SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet and laporan_pemenuhan_rnw.witel_id=witel_iid	and laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id		AND
				laporan_pemenuhan_rnw.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.witel_id=witel_iid and laporan_terpakai_rnw.master_data_barang_id::int4=master_id
				)
					
				;
				
		end case;

 when witel_iid is null THEN
		case when master_id is null THEN
		
				return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.region_id=reg_id and temp_stok_awal.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.region_id=reg_id
				)
				
				UNION
				
				SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet and laporan_pemenuhan_rnw.regional_id=reg_id	AND
				laporan_pemenuhan_rnw.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.region_id=reg_id
				)
				;
		ELSE
		return query
				SELECT DISTINCT
				temp_stok_awal.master_data_barang_id::int4,
				temp_stok_awal.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
				temp_stok_awal
				JOIN
				data_barang on temp_stok_awal.serial_number=data_barang.serial_number
				where 
				temp_stok_awal.witel_id=witel_iid and temp_stok_awal.master_data_barang_id::int4=master_id
				and temp_stok_awal.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.region_id=reg_id and laporan_terpakai_rnw.master_data_barang_id::int4=master_id
				)
				
				UNION
				
				SELECT DISTINCT
					laporan_pemenuhan_rnw.master_data_barang_id::int4,
					laporan_pemenuhan_rnw.serial_number,
				data_barang."id"::int8 as data_barang_id
				FROM
					laporan_pemenuhan_rnw
					JOIN
				data_barang on laporan_pemenuhan_rnw.serial_number=data_barang.serial_number
				WHERE laporan_pemenuhan_rnw.created_at::date BETWEEN deet-7 and deet	and laporan_pemenuhan_rnw.master_data_barang_id::int4=master_id  and laporan_pemenuhan_rnw.regional_id=reg_id		AND
				laporan_pemenuhan_rnw.serial_number not in (
				SELECT DISTINCT
					laporan_terpakai_rnw.serial_number
				FROM
					laporan_terpakai_rnw
					JOIN
				data_barang on laporan_terpakai_rnw.serial_number=data_barang.serial_number
				WHERE (laporan_terpakai_rnw.tanggal BETWEEN deet-7 and deet) and laporan_terpakai_rnw.region_id=reg_id and laporan_terpakai_rnw.master_data_barang_id::int4=master_id
				)		
				;
	end case;
end case;

		ELSE
			RETURN query SELECT DISTINCT null::int8, null::VARCHAR;
	END case;
	
			ELSE
			RETURN query SELECT DISTINCT null::int8, null::VARCHAR;
end case;			
END $function$
;

-- DROP FUNCTION public.detail_stok_akhir(varchar, date, int8, int8, int8);

CREATE OR REPLACE FUNCTION public.detail_stok_akhir(tipe character varying, dt date, witel bigint, reg bigint, idm bigint)
 RETURNS TABLE(data_barang_id bigint, serial_number character varying)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
case when witel is null THEN
	case when tipe='D' THEN
		case when idm is null THEN
				return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.regional_id=reg;
		ELSE
				return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.regional_id=reg;
		end case;
	
	when tipe='W' THEN
		case when idm is null THEN
			return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.regional_id=reg;		
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8  = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.regional_id=reg;
		
		end case;
	
	ELSE
			case when idm is null THEN
			return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date) + interval '1 month - 1 day')::date) and s.regional_id=reg;
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date) + interval '1 month - 1 day')::date) and s.regional_id=reg;
		end case;
	
	end case;
ELSE
	case when tipe='D' THEN
		case when idm is null THEN
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.witel_id=witel;
		ELSE
				return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.witel_id=witel;
		
		end case;
	
	when tipe='W' THEN
				case when idm is null THEN
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.witel_id=witel;		
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8  = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date and s.witel_id=witel;
			end case;
	
	ELSE
			case when idm is null THEN
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date) + interval '1 month - 1 day')::date) and s.witel_id=witel;
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date) + interval '1 month - 1 day')::date) and s.witel_id=witel;
		end case;
	
	end case;

end case;

	RETURN;
END$function$
;

-- DROP FUNCTION public.detail_stok_awal(varchar, date, int8, int8, int8);

CREATE OR REPLACE FUNCTION public.detail_stok_awal(tipe character varying, dt date, witel bigint, reg bigint, idm bigint)
 RETURNS TABLE(data_barang_id bigint, serial_number character varying)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
case when witel is null THEN
	case when tipe='D' THEN
		case when idm is null THEN
				return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-1 and s.regional_id=reg;
		ELSE
				return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-1 and s.regional_id=reg;
		end case;
	
	when tipe='W' THEN
		case when idm is null THEN
			return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-7 and s.regional_id=reg;		
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8  = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-7 and s.regional_id=reg;
		
		end case;
	
	ELSE
			case when idm is null THEN
			return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date) and s.regional_id=reg;
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date) and s.regional_id=reg;
		end case;
	
	end case;
ELSE
	case when tipe='D' THEN
		case when idm is null THEN
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-1 and s.witel_id=witel;
		ELSE
				return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-1 and s.witel_id=witel;
		
		end case;
	
	when tipe='W' THEN
				case when idm is null THEN
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-7 and s.witel_id=witel;		
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8  = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-7 and s.witel_id=witel;
			end case;
	
	ELSE
			case when idm is null THEN
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date) and s.witel_id=witel;
		ELSE
		return query SELECT  mdb.id :: INT8 as master_data_barang_id, db.serial_number
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 = idm
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date) and s.witel_id=witel;
		end case;
	
	end case;

end case;
	
END$function$
;

-- DROP FUNCTION public.detail_stok_pemenuhan(varchar, date, int8, int8, int8);

CREATE OR REPLACE FUNCTION public.detail_stok_pemenuhan(tipe character varying, dt date, wtel bigint, reg bigint, idm bigint)
 RETURNS TABLE(data_barang_id bigint, serial_number character varying)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
case when wtel is null THEN
		case when idm is null THEN
				return query 
				SELECT DISTINCT db.barang_id::INT8 as mdb_id, db.serial_number
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 6
        AND db.barang_id IN (6,13,14,15)
    AND date(lb.log_date) = dt::date and witel.regional_id_2=reg;    
				
		ELSE
				return query 
				SELECT DISTINCT db.barang_id::INT8 as mdb_id, db.serial_number
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 6
        AND db.barang_id IN (6,13,14,15)
    AND date(lb.log_date) = dt::date and witel.regional_id_2=reg and db.barang_id=idm;
				
		end case;

ELSE
		case when idm is null THEN
		return query 
		SELECT DISTINCT db.barang_id::INT8 as mdb_id, db.serial_number
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 6
        AND db.barang_id IN (6,13,14,15)
    AND date(lb.log_date) = dt::date and lb.lokasi_id=wtel;    
				
		ELSE
				return query 
				SELECT DISTINCT db.barang_id::INT8 as mdb_id, db.serial_number
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 6
        AND db.barang_id IN (6,13,14,15)
    AND date(lb.log_date) = dt::date and lb.lokasi_id=wtel and db.barang_id=idm;
		end case;

end case;


	RETURN;
END$function$
;

-- DROP FUNCTION public.detail_stok_pemenuhan_renew(varchar, date, int8, int8, int8);

CREATE OR REPLACE FUNCTION public.detail_stok_pemenuhan_renew(tipe character varying, dt date, wtel bigint, reg bigint, idm bigint)
 RETURNS TABLE(data_barang_id bigint, serial_number character varying)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
case when wtel is NOT null THEN
		case when idm is null THEN
				return query 
			  SELECT
					laporan_pemenuhan_rnw.master_data_barang_id,
					laporan_pemenuhan_rnw.serial_number
				FROM
					laporan_pemenuhan_rnw
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from dt) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from dt) and laporan_pemenuhan_rnw.witel_id=wtel;
				
		ELSE
				return query 
				SELECT
					laporan_pemenuhan_rnw.master_data_barang_id,
					laporan_pemenuhan_rnw.serial_number
				FROM
					laporan_pemenuhan_rnw
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from dt) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from dt) and laporan_pemenuhan_rnw.witel_id=wtel AND laporan_pemenuhan_rnw.master_data_barang_id=idm;
				
		end case;

when wtel is null THEN
		case when idm is null THEN
		return query 
		SELECT
					laporan_pemenuhan_rnw.master_data_barang_id,
					laporan_pemenuhan_rnw.serial_number
				FROM
					laporan_pemenuhan_rnw
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from dt) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from dt) and laporan_pemenuhan_rnw.regional_id=reg;
				
		ELSE
				return query 
SELECT
					laporan_pemenuhan_rnw.master_data_barang_id,
					laporan_pemenuhan_rnw.serial_number
				FROM
					laporan_pemenuhan_rnw
				WHERE
					laporan_pemenuhan_rnw.bulan=EXTRACT(MONTH from dt) and laporan_pemenuhan_rnw.tahun=EXTRACT(YEAR from dt) and laporan_pemenuhan_rnw.regional_id=reg AND laporan_pemenuhan_rnw.master_data_barang_id=idm;
	end case;
end case;


	RETURN;
END$function$
;

-- DROP PROCEDURE public.do_nothing();

CREATE OR REPLACE PROCEDURE public.do_nothing()
 LANGUAGE plpgsql
AS $procedure$BEGIN
	-- Routine body goes here...

END$procedure$
;

-- DROP FUNCTION public.f_add_sequence_t_code_faq_seq_ticket();

CREATE OR REPLACE FUNCTION public.f_add_sequence_t_code_faq_seq_ticket()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Format angka dengan awalan 'TS' dan leading zero (misal: PO0001, PO0002)
   	NEW."code_faq" := 'FAQ' || LPAD(nextval('code_faq_seq')::text, 3, '0');
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_add_sequence_t_code_inventaris_asset();

CREATE OR REPLACE FUNCTION public.f_add_sequence_t_code_inventaris_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Format angka dengan awalan 'TS' dan leading zero (misal: PO0001, PO0002)
   	NEW."nomor_inventaris" := 'INV' || LPAD(nextval('code_inventaris_asset_seq')::text, 5, '0');
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_add_sequence_t_code_pm();

CREATE OR REPLACE FUNCTION public.f_add_sequence_t_code_pm()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Format angka dengan awalan 'TS' dan leading zero (misal: PO0001, PO0002)
   	NEW."nomor_preventive" := 'PM' || LPAD(nextval('code_pm_preventive_seq')::text, 8, '0');
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_add_sequence_t_ticket_code_ticket();

CREATE OR REPLACE FUNCTION public.f_add_sequence_t_ticket_code_ticket()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Format angka dengan awalan 'TS' dan leading zero (misal: PO0001, PO0002)
    NEW."code_ticket" := 'TA' || to_char(current_timestamp, 'YYYYMMDDHH24MISSMS');
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_add_sequence_t_ticket_eskalasi_code_ticket();

CREATE OR REPLACE FUNCTION public.f_add_sequence_t_ticket_eskalasi_code_ticket()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Format angka dengan awalan 'TS' dan leading zero (misal: PO0001, PO0002)
   	NEW."code_ticket" := 'TS' || to_char(current_timestamp, 'YYYYMMDDHH24MISSMS');
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_code_asset_asset();

CREATE OR REPLACE FUNCTION public.f_code_asset_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    kode_kode VARCHAR;  -- Variabel untuk menyimpan kode dari t_kategori_asset
    nomor_urutan VARCHAR(10);  -- Variabel untuk menyimpan nomor urutan yang diformat
    urutan_berikutnya INTEGER;  -- Variabel untuk menyimpan nomor urutan berikutnya
BEGIN
    -- Ambil kode dari t_kategori_asset berdasarkan kategori_asset
    SELECT tka."code"
    INTO kode_kode
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.kategori_asset;

    -- Hitung nomor urutan berikutnya untuk kode yang sama dalam tabel t_asset
    SELECT COALESCE(
        MAX(CASE 
                WHEN SPLIT_PART(full_asset_code, '-', 2) = '' THEN 0
                ELSE SPLIT_PART(full_asset_code, '-', 2)::INT
            END), 0
    ) + 1
    INTO urutan_berikutnya
    FROM t_asset
    WHERE SPLIT_PART(full_asset_code, '-', 1) = kode_kode;

    -- Format nomor urutan sebagai 5 digit (menambahkan nol di depan jika kurang dari 5 digit)
    nomor_urutan := LPAD(urutan_berikutnya::TEXT, 5, '0');

    -- Buat full_asset_code baru
    NEW.full_asset_code := kode_kode || '-' || nomor_urutan;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_code_update_code_asset_lokasi_from_kode_spbu();

CREATE OR REPLACE FUNCTION public.f_code_update_code_asset_lokasi_from_kode_spbu()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    nama varchar(100);
    new_witel varchar(100);
BEGIN
    -- Ambil reg_pbu dan wit_id dari tabel kode_pbu berdasarkan kode_spbu
    SELECT r.code_regional, nw.code INTO nama, new_witel
    FROM wilayah_kerja wk
    LEFT JOIN new_regional r ON wk.regional_inventaris_id = r.id
    LEFT JOIN new_witel nw ON wk.witel_inventaris_id = nw.id
    WHERE wk.kode_spbu = NEW.kode_spbu;

    -- Cek jika new_witel memiliki panjang 1, maka tambah '0'
    IF length(new_witel) = 1 THEN
        new_witel := '0' || new_witel;
    END IF;

    -- Mengupdate lokasi sebagai gabungan dari data_pbu dan wit_id
    NEW.lokasi_code := nama || '-' || new_witel;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_insert_to_asset_if_finale();

CREATE OR REPLACE FUNCTION public.f_insert_to_asset_if_finale()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Jalankan hanya jika status_id = 3
    IF NEW.status_opname_id = 3 THEN
        -- Cek apakah user belum ada di pelanggan
        IF NOT EXISTS (SELECT 1 FROM t_asset WHERE asset_opname_id = NEW.id) THEN
            INSERT INTO t_asset (asset_opname_id, created_by_id, created_at, is_valid, serial_number, foto_serial_number, foto, kategori_asset, witel_id, kode_spbu, kondisi_asset, pemilik_asset_id, is_migrated, is_active, foto_berita_acara, is_rack_it)
            VALUES (NEW.id, NEW.created_by_id, NEW.created_at, NEW.is_valid, NEW.serial_number, NEW.foto_serial_number, NEW.foto, NEW.kategori_asset, NEW.witel_id, NEW.kode_spbu, NEW.kondisi_asset, NEW.pemilik_asset_id, NEW.is_migrated, NEW.is_active, NEW.foto_berita_acara, TRUE);
        END IF;
    END IF;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_sync_data_user();

CREATE OR REPLACE FUNCTION public.f_sync_data_user()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_id UUID;
    v_role_id INT;
BEGIN
    -- Loop through each user and corresponding role
    FOR v_user_id, v_role_id IN
        SELECT u.id, tr.id
        FROM "user" u
        JOIN user_role ur ON u.id = ur.user_id
        JOIN "role" r ON ur.role_id = r.id
        JOIN "group" g ON r.group_id = g.id
        JOIN t_role tr ON tr.group_id = g.id
        JOIN t_group tg ON tr.group_id = tg.id
        WHERE g.id = '3' AND g.nama = 'Telkom Akses'
						 AND tr.id = '19'
    LOOP
        BEGIN
            -- Attempt to insert the record, skipping duplicates
            INSERT INTO public.t_user_role_ticket (user_id, role_id)
            VALUES (v_user_id, v_role_id);
        EXCEPTION WHEN unique_violation THEN
            -- Do nothing, skip the duplicate
        END;
    END LOOP;
END;
$function$
;

-- DROP FUNCTION public.f_sync_data_user_telkom_akses();

CREATE OR REPLACE FUNCTION public.f_sync_data_user_telkom_akses()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- call funtions f_sync_data_user();
    PERFORM f_sync_data_user();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.log_to_report();

CREATE OR REPLACE FUNCTION public.log_to_report()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
	case 
	-- instock
		when NEW.status_id=5 and NEW.state_id=2 and NEW.condition_id=2 then
		INSERT INTO laporan_pemenuhan_rnw(sla_id, regional_id, witel_id,master_data_barang_id,serial_number, tracking_id, nomor_resi,delivery_date, recieve_date, created_at,hari,bulan,tahun,log_barang_id)
		SELECT 
		NULL,
wilayah_kerja.regional_id_2,
wilayah_kerja."id",
data_barang.barang_id::int8,
data_barang.serial_number::VARCHAR,
log_barang.tracking_id,
tracking.no_resi,
lb3.log_date,
lb2.log_date,
log_barang.log_date,
EXTRACT(DAY from log_barang.log_date),
EXTRACT(MONTH from log_barang.log_date),
EXTRACT(YEAR from log_barang.log_date),
log_barang."id"
FROM
log_barang
JOIN
data_barang ON log_barang.data_barang_id=data_barang."id"
JOIN
wilayah_kerja ON log_barang.lokasi_id=wilayah_kerja."id"
LEFT JOIN
tracking on log_barang.tracking_id=tracking."id"
left JOIN
(SELECT
lb2.data_barang_id,
max(lb2.log_date)::date as log_date
from
log_barang lb2
WHERE lb2.keterangan LIKE 'Barang sampai%' and lb2.status_id=4 and lb2.state_id=1  and lb2.condition_id =1 and lb2.status_pengiriman_id=1 and lb2.status_pengiriman_id=1 AND
lb2.data_barang_id=NEW.data_barang_id GROUP BY lb2.data_barang_id)lb2 on log_barang.data_barang_id=lb2.data_barang_id
left JOIN
(SELECT
lb3.data_barang_id,
max(lb3.log_date)::date as log_date
from
log_barang lb3 
WHERE lb3.keterangan LIKE 'Barang dikirim%' and lb3.status_id=6 and lb3.state_id=1  and lb3.condition_id is NULL and lb3.status_pengiriman_id=2 AND
lb3.data_barang_id=NEW.data_barang_id  GROUP BY lb3.data_barang_id)lb3 on log_barang.data_barang_id=lb3.data_barang_id
WHERE
log_barang.status_id=5 and log_barang.state_id=2  and log_barang.condition_id =2
and
log_barang.lokasi_id IN (SELECT "id" from wilayah_kerja where nama like '%WITEL%')
AND
log_barang."id"=NEW."id";

  DELETE  FROM
    laporan_pemenuhan_rnw a
    USING laporan_pemenuhan_rnw b
  WHERE
      a."id" < b."id" and
      a.regional_id = b.regional_id AND
			a.witel_id = b.witel_id AND
			a.serial_number = b.serial_number AND
			a.created_at = b.created_at AND
			a.log_barang_id=b.log_barang_id;
	
	-- in stock
	--when NEW.status_id=5 and NEW.state_id=2 and NEW.condition_id=2 then
	-- pemenuhan
	-- when NEW.status_id=5 and NEW.state_id=2 and NEW.condition_id=2 then
-- 	INSERT INTO "public"."laporan_pemenuhan_rnw" ( "regional_id", "witel_id", "master_data_barang_id", "serial_number", "tracking_id", "nomor_resi", "delivery_date", "recieve_date", "created_at", "hari", "bulan", "tahun", "log_barang_id") 
-- SELECT 
-- wilayah_kerja.regional_id_2,
-- wilayah_kerja."id",
-- data_barang.barang_id,
-- data_barang.serial_number,
-- log_barang.tracking_id,
-- tracking.no_resi,
-- lb3.log_date,
-- lb2.log_date,
-- log_barang.log_date,
-- EXTRACT(DAY from log_barang.log_date),
-- EXTRACT(MONTH from log_barang.log_date),
-- EXTRACT(YEAR from log_barang.log_date),
-- log_barang."id"
-- FROM
-- log_barang
-- JOIN
-- data_barang ON log_barang.data_barang_id=data_barang."id"
-- JOIN
-- wilayah_kerja ON log_barang.lokasi_id=wilayah_kerja."id"
-- LEFT JOIN
-- tracking on log_barang.tracking_id=tracking."id"
-- JOIN
-- (SELECT
-- lb2.data_barang_id,
-- max(lb2.log_date)::date as log_date
-- from
-- log_barang lb2
-- WHERE lb2.keterangan LIKE 'Barang sampai%' and lb2.status_id=4 and lb2.state_id=1  and lb2.condition_id =1 and lb2.status_pengiriman_id=1 and lb2.status_pengiriman_id=1 AND
-- lb2.data_barang_id=NEW.data_barang_id GROUP BY lb2.data_barang_id)lb2 on log_barang.data_barang_id=lb2.data_barang_id
-- JOIN
-- (SELECT
-- lb3.data_barang_id,
-- max(lb3.log_date)::date as log_date
-- from
-- log_barang lb3 
-- WHERE lb3.keterangan LIKE 'Barang dikirim%' and lb3.status_id=6 and lb3.state_id=1  and lb3.condition_id is NULL and lb3.status_pengiriman_id=2 AND
-- lb3.data_barang_id=NEW.data_barang_id  GROUP BY lb3.data_barang_id)lb3 on log_barang.data_barang_id=lb3.data_barang_id
-- WHERE
-- log_barang.status_id=5 and log_barang.state_id=2  and log_barang.condition_id =2
-- and
-- log_barang.lokasi_id IN (SELECT "id" from wilayah_kerja where nama like '%WITEL%')
-- AND
-- log_barang."id"=NEW."id";
-- 
	
	
	
-- 		INSERT INTO laporan_pemenuhan_rnw(sla_id, regional_id, witel_id,master_data_barang_id,serial_number, tracking_id, delivery_date, recieve_date, created_at, log_barang_id,hari,bulan,tahun)
-- SELECT
-- bx.sla_id,bx.regional_id_2,NEW.lokasi_id,cx.master_barang_id,cx.serial_number,NEW.tracking_id,ax.delivery_date,NEW.log_date,NEW.log_date,NEW."id",EXTRACT(DAY from NEW.log_date),EXTRACT(MONTH from NEW.log_date),EXTRACT(YEAR from NEW.log_date)
-- 
-- FROM
-- (
-- SELECT log_barang.data_barang_id as barang_id,log_barang.log_date as delivery_date from log_barang where data_barang_id=NEW.data_barang_id and status_id=6 and state_id=1 ORDER BY log_barang.log_date DESC limit 1)ax
-- JOIN
-- (SELECT log_barang.data_barang_id as barang_id, wilayah_kerja.regional_id_2, wilayah_kerja.sla_id
-- FROM log_barang JOIN wilayah_kerja on log_barang.lokasi_id=wilayah_kerja."id"
-- where log_barang."id"=NEW."id")bx ON ax.barang_id=bx.barang_id
-- JOIN
-- (SELECT data_barang."id" as barang_id, data_barang.barang_id as master_barang_id, data_barang.serial_number
-- FROM data_barang where data_barang."id"=NEW.data_barang_id)cx ON ax.barang_id=cx.barang_id;
-- -- 
-- -- stok EDC
-- DELETE from laporan_stok_rnw
-- where serial_number=(SELECT data_barang.serial_number
-- FROM data_barang where data_barang."id"=NEW.data_barang_id);
-- 
-- INSERT INTO laporan_stok_rnw(region_id, witel_id,master_barang_id, serial_number, log_barang_id,tanggal,hari,bulan,tahun)
-- SELECT
-- bx.regional_id_2,NEW.lokasi_id,cx.master_barang_id,cx.serial_number,NEW."id",NEW.log_date,EXTRACT(DAY from NEW.log_date),EXTRACT(MONTH from NEW.log_date),EXTRACT(YEAR from NEW.log_date)
-- 
-- FROM
-- (
-- SELECT log_barang.data_barang_id as barang_id,log_barang.log_date as delivery_date from log_barang where data_barang_id=NEW.data_barang_id and status_id=6 and state_id=1 ORDER BY log_barang.log_date DESC limit 1)ax
-- JOIN
-- (SELECT log_barang.data_barang_id as barang_id, wilayah_kerja.regional_id_2, wilayah_kerja.sla_id
-- FROM log_barang JOIN wilayah_kerja on log_barang.lokasi_id=wilayah_kerja."id"
-- where log_barang."id"=NEW."id")bx ON ax.barang_id=bx.barang_id
-- JOIN
-- (SELECT data_barang."id" as barang_id, data_barang.barang_id as master_barang_id, data_barang.serial_number
-- FROM data_barang where data_barang."id"=NEW.data_barang_id)cx ON ax.barang_id=cx.barang_id;
-- 
	-- kerusakan kelalaian
	when NEW.status_id=33 and NEW.state_id=3 and NEW.bisa_diganti is false then
	 INSERT INTO laporan_kerusakan_rnw (
 	region_id,	witel_id,	master_data_barang_id,	serial_number,	status_id,	condition_id,	log_barang_id,	bisa_diganti,	created_at,	hari,	bulan,	tahun,	lokasi_id,	lokasi,data_barang_id 
 ) 
SELECT
wilayah_kerja.regional_id_2, wilayah_kerja.witel_id, data_barang.barang_id, data_barang.serial_number, log_barang.status_id,log_barang.condition_id, log_barang."id", FALSE, log_barang.log_date::date,
EXTRACT ( DAY FROM log_barang.log_date ), EXTRACT ( MONTH FROM log_barang.log_date ), EXTRACT ( year FROM log_barang.log_date ), log_barang.lokasi_id, 
		case when  wilayah_kerja."flag" = 'SPBU' then wilayah_kerja."flag" || ' ' || wilayah_kerja.nama || ' ' || wilayah_kerja.alamat else wilayah_kerja.nama END AS lokasi, log_barang.data_barang_id

FROM
	log_barang join wilayah_kerja on log_barang.lokasi_id=wilayah_kerja."id"
	join data_barang on log_barang.data_barang_id=data_barang."id"
WHERE
	log_barang.condition_id NOT IN ( 1, 2, 3, 4, 5, 6 ) 
	AND log_barang.status_id = 33 AND log_barang.state_id = 3 and log_barang.bisa_diganti is false
	-- AND log_barang.status_rma_id IS NULL 
	-- 	AND EXTRACT ( MONTH FROM log_barang.log_date ) = 6 
-- 	AND EXTRACT ( YEAR FROM log_barang.log_date ) = 2024
	 and log_barang."id"=NEW."id";
-- 	INSERT into laporan_kerusakan_rnw(region_id,witel_id,master_data_barang_id,serial_number,status_id,condition_id,log_barang_id,bisa_diganti,created_at,hari,bulan,tahun,lokasi_id,lokasi)
-- SELECT
-- 	bx.regional_id_2,
-- 	bx.witel_id ,
-- 	cx.master_barang_id,
-- 	cx.serial_number,
-- bx.status_id,
-- bx.condition_id,
-- 	NEW."id",
-- 	FALSE,
-- 	NEW.log_date,
-- 	EXTRACT ( DAY FROM NEW.log_date ),
-- 	EXTRACT ( MONTH FROM NEW.log_date ),
-- 	EXTRACT ( YEAR FROM NEW.log_date ) ,
-- 	bx.lokasi_id,
-- 	bx.lokasi
-- FROM
-- 	(
-- 	SELECT
-- 		log_barang.data_barang_id AS barang_id,
-- 		log_barang.lokasi_id,
-- 		log_barang.status_id,
-- 		log_barang.state_id,
-- 		log_barang.condition_id,
-- 		case when  wilayah_kerja."flag" = 'SPBU' then wilayah_kerja."flag" || ' ' || wilayah_kerja.nama || ' ' || wilayah_kerja.alamat else wilayah_kerja.nama END AS lokasi,
-- 		wilayah_kerja.witel_id,
-- 		wilayah_kerja.regional_id_2,
-- 		wilayah_kerja.sla_id 
-- 	FROM
-- 		log_barang
-- 		JOIN wilayah_kerja ON log_barang.lokasi_id = wilayah_kerja."id" 
-- 	WHERE
-- 		log_barang."id" =  NEW."id"
-- 		
-- 		AND log_barang.status_id = 33 
-- 		AND log_barang.state_id = 3 
-- 	) bx
-- 	JOIN ( SELECT data_barang."id" AS barang_id, data_barang.barang_id AS master_barang_id, data_barang.serial_number FROM data_barang WHERE data_barang."id" =  NEW.data_barang_id
-- 	) cx ON bx.barang_id = cx.barang_id;
	
-- 	-- kerusakan rma
-- 	when NEW.status_id=11 and NEW.state_id=3 then
-- 	INSERT into laporan_kerusakan_rnw(region_id,witel_id,master_data_barang_id,serial_number,status_id,condition_id,log_barang_id,bisa_diganti,created_at,hari,bulan,tahun)
-- 	SELECT
-- bx.regional_id_2,NEW.lokasi_id,cx.master_barang_id,cx.serial_number,NEW.status_id,NEW.condition_id,NEW."id",TRUE,NEW.log_date,EXTRACT(DAY from NEW.log_date),EXTRACT(MONTH from NEW.log_date),EXTRACT(YEAR from NEW.log_date)
-- FROM
-- (SELECT log_barang.data_barang_id as barang_id, wilayah_kerja.regional_id_2, wilayah_kerja.sla_id
-- FROM log_barang JOIN wilayah_kerja on log_barang.lokasi_id=wilayah_kerja."id"
-- where log_barang."id"=NEW."id")bx
-- JOIN
-- (SELECT data_barang."id" as barang_id, data_barang.barang_id as master_barang_id, data_barang.serial_number
-- FROM data_barang where data_barang."id"=NEW.data_barang_id)cx ON bx.barang_id=cx.barang_id;

--terpakai
	when NEW.status_id=8 and NEW.state_id=2 and NEW.status_pengiriman_id =1 and NEW.keterangan like 'Barang sampai%' then
-- -- 	INSERT into laporan_terpakai_rnw(region_id,witel_id,master_data_barang_id,serial_number,log_barang_id,tanggal,hari,bulan,tahun)
-- INSERT into laporan_terpakai_rnw_bs(region_id,witel_id,master_data_barang_id,serial_number,log_barang_id,tanggal,hari,bulan,tahun)
-- SELECT 
-- wilayah_kerja.regional_id_2,
-- wilayah_kerja.witel_id,
-- data_barang.barang_id,
-- data_barang.serial_number,
-- log_barang."id",
-- log_barang.log_date,
-- EXTRACT(DAY from log_barang.log_date),
-- EXTRACT(MONTH from log_barang.log_date),
-- EXTRACT(YEAR from log_barang.log_date)
-- FROM
-- log_barang
-- JOIN
-- data_barang ON log_barang.data_barang_id=data_barang."id"
-- JOIN
-- wilayah_kerja ON log_barang.lokasi_id=wilayah_kerja."id"
-- WHERE
-- log_barang."id"=NEW."id" AND
-- log_barang.status_id=8 and log_barang.state_id=2  and log_barang.status_pengiriman_id =1 and log_barang.keterangan like 'Barang sampai%' and log_barang.condition_id is NULL
-- and
-- log_barang.lokasi_id not IN (SELECT "id" from wilayah_kerja where nama like '%WITEL%')
-- -- AND
-- -- (EXTRACT(MONTH from log_barang.log_date) =6) AND
-- -- EXTRACT(YEAR from log_barang.log_date)=2024 
-- ;

-- UPDATE laporan_stok_rnw
-- set used_date=NEW.log_date
--  where serial_number=(SELECT data_barang.serial_number
-- FROM data_barang where data_barang."id"=NEW.data_barang_id);

 INSERT into laporan_terpakai_rnw(region_id,witel_id,master_data_barang_id,serial_number,log_barang_id,tanggal,hari,bulan,tahun)

SELECT 
wilayah_kerja.regional_id_2,
wilayah_kerja.witel_id,
data_barang.barang_id,
data_barang.serial_number,
log_barang."id",
log_barang.log_date,
EXTRACT(DAY from log_barang.log_date),
EXTRACT(MONTH from log_barang.log_date),
EXTRACT(YEAR from log_barang.log_date)
FROM
log_barang
JOIN
data_barang ON log_barang.data_barang_id=data_barang."id"
JOIN
wilayah_kerja ON log_barang.lokasi_id=wilayah_kerja."id"
WHERE
log_barang."id"=NEW."id" AND
log_barang.status_id=8 and log_barang.state_id=2  and log_barang.status_pengiriman_id =1 and log_barang.keterangan like 'Barang sampai%' and log_barang.condition_id is NULL
and
log_barang.lokasi_id not IN (SELECT "id" from wilayah_kerja where nama like '%WITEL%')
and log_barang.data_barang_id IN
(SELECT
data_barang_id
FROM
(SELECT RANK
	( ) OVER ( PARTITION BY data_barang_id ORDER BY log_date DESC ) rk,
	"id",
	data_barang_id,
	log_date,
	keterangan 
FROM
	log_barang 
WHERE
  data_barang_id = NEW.data_barang_id
) xy
WHERE rk BETWEEN 1 and 4 and keterangan like 'Pengganti aset rusak dengan%')

-- AND
-- (EXTRACT(MONTH from log_barang.log_date) =6) AND
-- EXTRACT(YEAR from log_barang.log_date)=2024 
;
  DELETE  FROM
    laporan_terpakai_rnw a
    USING laporan_terpakai_rnw b
  WHERE
      a."id" < b."id" and
      a.region_id = b.region_id AND
			a.witel_id = b.witel_id AND
			a.serial_number = b.serial_number AND
			a.tanggal = b.tanggal AND
			a.log_barang_id = b.log_barang_id;
			
	ELSE
		CALL do_nothing();
	end case;

	RETURN NEW;
END$function$
;

-- DROP FUNCTION public.log_to_report_copy1();

CREATE OR REPLACE FUNCTION public.log_to_report_copy1()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
	INSERT into laporan_kerusakan_rnw(region_id,witel_id,master_data_barang_id,serial_number,status_id,condition_id,log_barang_id,bisa_diganti,created_at,hari,bulan,tahun, lokasi_id,lokasi)
	SELECT
	bx.regional_id_2,
	bx.witel_id,
	cx.master_barang_id,
	cx.serial_number,
	bx.status_id,
	bx.condition_id,
	bx.log_barang_id,
	TRUE,
	bx.log_date,
	EXTRACT ( DAY FROM bx.log_date ),
	EXTRACT ( MONTH FROM bx.log_date ),
	EXTRACT ( YEAR FROM bx.log_date ) ,
	bx.lokasi_id,
	bx.lokasi
FROM
	(
	SELECT
		log_barang_evidence.log_barang_id,
		log_barang.data_barang_id AS barang_id,
		wilayah_kerja.regional_id_2,
		wilayah_kerja.sla_id,
		wilayah_kerja.witel_id,
		log_barang.lokasi_id,
		case when  wilayah_kerja."flag" = 'SPBU' then wilayah_kerja."flag" || ' ' || wilayah_kerja.nama || ' ' || wilayah_kerja.alamat else wilayah_kerja.nama END AS lokasi,
		log_barang.status_id,
		log_barang.condition_id,
		log_barang.log_date 
	FROM
		log_barang_evidence
		JOIN log_barang ON log_barang."id" = log_barang_evidence.log_barang_id
		JOIN wilayah_kerja ON log_barang.lokasi_id = wilayah_kerja."id" 
		WHERE log_barang."id"=NEW.log_barang_id and
		log_barang.condition_id NOT IN ( 1, 2, 3, 4, 5, 6 ) 
		AND log_barang.status_id = 11 
	) bx
	JOIN ( SELECT data_barang."id" AS barang_id, data_barang.barang_id AS master_barang_id, data_barang.serial_number FROM data_barang WHERE data_barang."id" =  NEW.data_barang_id 
	) cx ON bx.barang_id = cx.barang_id;

	RETURN NEW;
END$function$
;

-- DROP FUNCTION public.pg_stat_statements(in bool, out oid, out oid, out bool, out int8, out text, out int8, out float8, out float8, out float8, out float8, out float8, out int8, out float8, out float8, out float8, out float8, out float8, out int8, out int8, out int8, out int8, out int8, out int8, out int8, out int8, out int8, out int8, out int8, out float8, out float8, out float8, out float8, out int8, out int8, out numeric, out int8, out float8, out int8, out float8, out int8, out float8, out int8, out float8);

CREATE OR REPLACE FUNCTION public.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision)
 RETURNS SETOF record
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pg_stat_statements', $function$pg_stat_statements_1_10$function$
;

-- DROP FUNCTION public.pg_stat_statements_info(out int8, out timestamptz);

CREATE OR REPLACE FUNCTION public.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone)
 RETURNS record
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pg_stat_statements', $function$pg_stat_statements_info$function$
;

-- DROP FUNCTION public.pg_stat_statements_reset(oid, oid, int8);

CREATE OR REPLACE FUNCTION public.pg_stat_statements_reset(userid oid DEFAULT 0, dbid oid DEFAULT 0, queryid bigint DEFAULT 0)
 RETURNS void
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pg_stat_statements', $function$pg_stat_statements_reset_1_7$function$
;

-- DROP FUNCTION public.report_ava(varchar, date);

CREATE OR REPLACE FUNCTION public.report_ava(tipe character varying, dt date)
 RETURNS TABLE(id_reg integer, reg character varying, id_witel integer, witel character varying, ploted_stock integer, "A930_awal" integer, "N5_awal" integer, total_stock_awal integer, "A930_terpakai" integer, "N5_terpakai" integer, "A930_pemenuhan" integer, "N5_pemenuhan" integer, "A930_akhir" integer, "N5_akhir" integer, total_stock_akhir integer)
 LANGUAGE plpgsql
AS $function$ 
BEGIN
	
		case
		when tipe = 'D' THEN
		RETURN QUERY
		SELECT
		xy.regional_id,
	xy.regional,
	xy.witel_id::int4,
	xy.witel::VARCHAR,	
	xy.ploted_stock::INT4,
xy.stok_awal_a930::int4,
xy.stok_awal_n5::int4,
xy.stok_awal_total::int4,
xy.terpakai_a930::int4,
xy.terpakai_n5::int4,
xy.pemenuhan_a930::int4,
xy.pemenuhan_n5::int4,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930)::int4 stock_akir_a930,
(xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_n5,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930 +
xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_total
		from (
		SELECT DISTINCT
		reg."id":: int4 as regional_id,
	reg.nama:: varchar as regional,
	witel."id"::int8 as witel_id,
	witel.nama::TEXT as witel,
	witel.ploted_stock::int8 as ploted_stock,
	-- stok awal
		sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 stok_awal_a930,
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_n5,
	sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 +
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_total,
	-- terpakai
	sum(case when terpakai.mdb_id in(6,13) then terpakai.ct_barang else 0 end)::int4 terpakai_a930,
	sum(case when terpakai.mdb_id in(14,15) then terpakai.ct_barang else 0 end)::int4 terpakai_n5,
	-- pemenuhan
	sum(case when penuh.mdb_id in(6,13) then penuh.ct_barang else 0 end)::int4 pemenuhan_a930,
	sum(case when penuh.mdb_id in(14,15) then penuh.ct_barang else 0 end)::int4 pemenuhan_n5,
	-- stok akir
		sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end) ::int4 stok_akir_a930,
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_n5,
	sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end)::int4 +
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_total
	
FROM
	wilayah_kerja reg
	join wilayah_kerja witel on reg."id"=witel.regional_id_2 and witel.nama like 'WITEL%'
	-- stok awal
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-1
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_awal 
	on  witel."id"=stok_awal.witel_id
	-- stok akir
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_akir 
	on  witel."id"=stok_akir.witel_id
	-- terpakai
	left join(
	    SELECT regional.id as id_regi, witel.id as id_wit, db.barang_id as mdb_id, count(lb.data_barang_id) as ct_barang
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 7
    AND date(lb.log_date) = dt::date
    GROUP BY regional.id, witel.id, db.barang_id
	)terpakai
	on  witel."id"=terpakai.id_wit
	-- pemenuhan
	LEFT join
	(       SELECT regional.id as id_regi, witel.id as wit_id, db.barang_id as mdb_id, count(lb.data_barang_id) ct_barang
        FROM public.log_barang lb
        join wilayah_kerja witel on lb.tujuan = witel.id
        join wilayah_kerja regional on witel.regional_id_2 = regional.id
        join data_barang db on lb.data_barang_id = db.id
        WHERE lb.status_id = 6
        AND witel.flag = 'Witel'
        AND date(lb.log_date) = dt::date
        AND db.barang_id IN (6,13,14,15)
        GROUP BY regional.id, witel.id, db.barang_id,regional.nama
        ORDER BY regional.nama ASC, witel.nama ASC
	)penuh
	on witel."id"=penuh.wit_id
	

WHERE
reg.nama like 'TREG%'
GROUP BY
reg."id",witel."id",regional,witel,witel.ploted_stock
--,terpakai_a930,terpakai_n5,stok_awal_a930,stok_awal_n5,stok_akir_a930,stok_akir_n5,pemenuhan_a930,pemenuhan_n5
)xy
UNION

		SELECT
		xy.regional_id,
	xy.regional,
	xy.witel_id::int4,
	xy.witel,	xy.ploted_stock::INT4,
xy.stok_awal_a930::int4,
xy.stok_awal_n5::int4,
xy.stok_awal_total::int4,
xy.terpakai_a930::int4,
xy.terpakai_n5::int4,
xy.pemenuhan_a930::int4,
xy.pemenuhan_n5::int4,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930)::int4 stock_akir_a930,
(xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_n5,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930 +
xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_total
from
(
SELECT DISTINCT
		reg."id":: int4 as regional_id,
	reg.nama:: varchar as regional,
	null::int8 as witel_id,
	null::TEXT as witel,
	sum(witel.ploted_stock)::int8 as ploted_stock,
	-- stok awal
		sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 stok_awal_a930,
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_n5,
	sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 +
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_total,
	-- terpakai
	sum(case when terpakai.mdb_id in(6,13) then terpakai.ct_barang else 0 end)::int4 terpakai_a930,
	sum(case when terpakai.mdb_id in(14,15) then terpakai.ct_barang else 0 end)::int4 terpakai_n5,
	-- pemenuhan
	sum(case when penuh.mdb_id in(6,13) then penuh.ct_barang else 0 end)::int4 pemenuhan_a930,
	sum(case when penuh.mdb_id in(14,15) then penuh.ct_barang else 0 end)::int4 pemenuhan_n5,
	-- stok akir
		sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end) ::int4 stok_akir_a930,
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_n5,
	sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end)::int4 +
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_total
	
FROM
	wilayah_kerja reg
	join wilayah_kerja witel on reg."id"=witel.regional_id_2 and witel.nama like 'WITEL%'
	-- stok awal
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-1
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_awal 
	on  witel."id"=stok_awal.witel_id
	-- stok akir
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_akir 
	on  witel."id"=stok_akir.witel_id
	-- terpakai
	left join(
	    SELECT regional.id as id_regi, witel.id as id_wit, db.barang_id as mdb_id, count(lb.data_barang_id) as ct_barang
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 7
    AND date(lb.log_date) = dt::date
    GROUP BY regional.id, witel.id, db.barang_id
	)terpakai
	on  witel."id"=terpakai.id_wit
	-- pemenuhan
	join
	(       SELECT regional.id as id_regi, witel.id as wit_id, db.barang_id as mdb_id, count(lb.data_barang_id) ct_barang
        FROM public.log_barang lb
        join wilayah_kerja witel on lb.tujuan = witel.id
        join wilayah_kerja regional on witel.regional_id_2 = regional.id
        join data_barang db on lb.data_barang_id = db.id
        WHERE lb.status_id = 6
        AND witel.flag = 'Witel'
        AND date(lb.log_date) = dt::date
        AND db.barang_id IN (6,13,14,15)
        GROUP BY regional.id, witel.id, db.barang_id,regional.nama
        ORDER BY regional.nama ASC, witel.nama ASC
	)penuh
	on witel."id"=penuh.wit_id
	

WHERE
reg.nama like 'TREG%'
GROUP BY
reg."id",regional
--,terpakai_a930,terpakai_n5,stok_awal_a930,stok_awal_n5,stok_akir_a930,stok_akir_n5,pemenuhan_a930,pemenuhan_n5
ORDER BY regional ASC,witel DESC 
		)xy
		;
		when tipe = 'W' THEN

RETURN query
		SELECT
		xy.regional_id,
	xy.regional,
	xy.witel_id::int4,
	xy.witel::VARCHAR,	xy.ploted_stock::INT4,
xy.stok_awal_a930::int4,
xy.stok_awal_n5::int4,
xy.stok_awal_total::int4,
xy.terpakai_a930::int4,
xy.terpakai_n5::int4,
xy.pemenuhan_a930::int4,
xy.pemenuhan_n5::int4,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930)::int4 stock_akir_a930,
(xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_n5,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930 +
xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_total
from
(
		SELECT DISTINCT
		reg."id":: int4 as regional_id,
	reg.nama:: varchar as regional,
	witel."id"::int8 as witel_id,
	witel.nama::TEXT as witel,
	witel.ploted_stock::int8 as ploted_stock,
	-- stok awal
		sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 stok_awal_a930,
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_n5,
	sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 +
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_total,
	-- terpakai
	sum(case when terpakai.mdb_id in(6,13) then terpakai.ct_barang else 0 end)::int4 terpakai_a930,
	sum(case when terpakai.mdb_id in(14,15) then terpakai.ct_barang else 0 end)::int4 terpakai_n5,
	-- pemenuhan
	sum(case when penuh.mdb_id in(6,13) then penuh.ct_barang else 0 end)::int4 pemenuhan_a930,
	sum(case when penuh.mdb_id in(14,15) then penuh.ct_barang else 0 end)::int4 pemenuhan_n5,
	-- stok akir
		sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end) ::int4 stok_akir_a930,
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_n5,
	sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end)::int4 +
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_total
	
FROM
	wilayah_kerja reg
	join wilayah_kerja witel on reg."id"=witel.regional_id_2 and witel.nama like 'WITEL%'
	-- stok awal
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-7
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_awal 
	on  witel."id"=stok_awal.witel_id
	-- stok akir
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_akir 
	on  witel."id"=stok_akir.witel_id
	-- terpakai
	left join(
	    SELECT regional.id as id_regi, witel.id as id_wit, db.barang_id as mdb_id, count(lb.data_barang_id) as ct_barang
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 7
    AND date(lb.log_date) = dt::date
    GROUP BY regional.id, witel.id, db.barang_id
	)terpakai
	on  witel."id"=terpakai.id_wit
	-- pemenuhan
	LEFT join
	(       SELECT regional.id as id_regi, witel.id as wit_id, db.barang_id as mdb_id, count(lb.data_barang_id) ct_barang
        FROM public.log_barang lb
        join wilayah_kerja witel on lb.tujuan = witel.id
        join wilayah_kerja regional on witel.regional_id_2 = regional.id
        join data_barang db on lb.data_barang_id = db.id
        WHERE lb.status_id = 6
        AND witel.flag = 'Witel'
        AND date(lb.log_date) = dt::date
        AND db.barang_id IN (6,13,14,15)
        GROUP BY regional.id, witel.id, db.barang_id
        ORDER BY regional.nama ASC, witel.nama ASC
	)penuh
	on witel."id"=penuh.wit_id
	

WHERE
reg.nama like 'TREG%'
GROUP BY
reg."id",witel."id",regional,witel,witel.ploted_stock
--,terpakai_a930,terpakai_n5,stok_awal_a930,stok_awal_n5,stok_akir_a930,stok_akir_n5,pemenuhan_a930,pemenuhan_n5
)xy
UNION
		SELECT
		xy.regional_id,
	xy.regional,
	xy.witel_id::int4,
	xy.witel::VARCHAR,	xy.ploted_stock::INT4,
xy.stok_awal_a930::int4,
xy.stok_awal_n5::int4,
xy.stok_awal_total::int4,
xy.terpakai_a930::int4,
xy.terpakai_n5::int4,
xy.pemenuhan_a930::int4,
xy.pemenuhan_n5::int4,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930)::int4 stock_akir_a930,
(xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_n5,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930 +
xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_total
from
(
SELECT DISTINCT
		reg."id":: int4 as regional_id,
	reg.nama:: varchar as regional,
	null::int8 as witel_id,
	null::TEXT as witel,
	sum(witel.ploted_stock)::int8 as ploted_stock,
	-- stok awal
		sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 stok_awal_a930,
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_n5,
	sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 +
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_total,
	-- terpakai
	sum(case when terpakai.mdb_id in(6,13) then terpakai.ct_barang else 0 end)::int4 terpakai_a930,
	sum(case when terpakai.mdb_id in(14,15) then terpakai.ct_barang else 0 end)::int4 terpakai_n5,
	-- pemenuhan
	sum(case when penuh.mdb_id in(6,13) then penuh.ct_barang else 0 end)::int4 pemenuhan_a930,
	sum(case when penuh.mdb_id in(14,15) then penuh.ct_barang else 0 end)::int4 pemenuhan_n5,
	-- stok akir
		sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end) ::int4 stok_akir_a930,
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_n5,
	sum(case when stok_akir.master_data_barang_id in(6,13) then stok_akir.ct_barang else 0 end)::int4 +
	sum(case when stok_akir.master_data_barang_id in(14,15) then stok_akir.ct_barang else 0 end)::int4 stok_akir_total
	
FROM
	wilayah_kerja reg
	join wilayah_kerja witel on reg."id"=witel.regional_id_2 and witel.nama like 'WITEL%'
	-- stok awal
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date-7
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_awal 
	on  witel."id"=stok_awal.witel_id
	-- stok akir
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_akir 
	on  witel."id"=stok_akir.witel_id
	-- terpakai
	left join(
	    SELECT regional.id as id_regi, witel.id as id_wit, db.barang_id as mdb_id, count(lb.data_barang_id) as ct_barang
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 7
    AND date(lb.log_date) = dt::date
    GROUP BY regional.id, witel.id, db.barang_id
	)terpakai
	on  witel."id"=terpakai.id_wit
	-- pemenuhan
	join
	(       SELECT regional.id as id_regi, witel.id as wit_id, db.barang_id as mdb_id, count(lb.data_barang_id) ct_barang
        FROM public.log_barang lb
        join wilayah_kerja witel on lb.tujuan = witel.id
        join wilayah_kerja regional on witel.regional_id_2 = regional.id
        join data_barang db on lb.data_barang_id = db.id
        WHERE lb.status_id = 6
        AND witel.flag = 'Witel'
        AND date(lb.log_date) = dt::date
        AND db.barang_id IN (6,13,14,15)
        GROUP BY regional.id, witel.id, db.barang_id
        ORDER BY regional.nama ASC, witel.nama ASC
	)penuh
	on witel."id"=penuh.wit_id
	

WHERE
reg.nama like 'TREG%'
GROUP BY
reg."id",regional
--,terpakai_a930,terpakai_n5,stok_awal_a930,stok_awal_n5,stok_akir_a930,stok_akir_n5,pemenuhan_a930,pemenuhan_n5
)xy
		ORDER BY regional ASC,witel DESC 
		;		

		ELSE
		
		RETURN query
				SELECT
		xy.regional_id,
	xy.regional,
	xy.witel_id::int4,
	xy.witel::VARCHAR,	xy.ploted_stock::INT4,
xy.stok_awal_a930::int4,
xy.stok_awal_n5::int4,
xy.stok_awal_total::int4,
xy.terpakai_a930::int4,
xy.terpakai_n5::int4,
xy.pemenuhan_a930::int4,
xy.pemenuhan_n5::int4,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930)::int4 stock_akir_a930,
(xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_n5,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930 +
xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_total
from
(
		SELECT DISTINCT
		reg."id":: int4 as regional_id,
	reg.nama:: varchar as regional,
	witel."id"::int8 as witel_id,
	witel.nama::TEXT as witel,
	witel.ploted_stock::int8 as ploted_stock,
	-- stok awal
		sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 stok_awal_a930,
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_n5,
	sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 +
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_total,
	-- terpakai
	sum(case when terpakai.mdb_id in(6,13) then terpakai.ct_barang else 0 end)::int4 terpakai_a930,
	sum(case when terpakai.mdb_id in(14,15) then terpakai.ct_barang else 0 end)::int4 terpakai_n5,
	-- pemenuhan
	sum(case when penuh.mdb_id in(6,13) then penuh.ct_barang else 0 end)::int4 pemenuhan_a930,
	sum(case when penuh.mdb_id in(14,15) then penuh.ct_barang else 0 end)::int4 pemenuhan_n5,
	-- stok akir
		sum(case when stok_akhir.master_data_barang_id in(6,13) then stok_akhir.ct_barang else 0 end) ::int4 stok_akhir_a930,
	sum(case when stok_akhir.master_data_barang_id in(14,15) then stok_akhir.ct_barang else 0 end)::int4 stok_akhir_n5,
	sum(case when stok_akhir.master_data_barang_id in(6,13) then stok_akhir.ct_barang else 0 end)::int4 +
	sum(case when stok_akhir.master_data_barang_id in(14,15) then stok_akhir.ct_barang else 0 end)::int4 stok_akhir_total
	
FROM
	wilayah_kerja reg
	join wilayah_kerja witel on reg."id"=witel.regional_id_2 and witel.nama like 'WITEL%'
	-- stok awal
	left join(
		 SELECT s.regional_id,s.witel_id ,mdb.id :: INT8 as master_data_barang_id, count(db.serial_number)ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date)
				group by s.regional_id,s.witel_id,mdb.id)
				stok_awal 
	on  witel."id"=stok_awal.witel_id
	-- stok akir
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_akhir 
	on  witel."id"=stok_akhir.witel_id
	-- terpakai
	left join(
	    SELECT regional.id as id_regi, witel.id as id_wit, db.barang_id as mdb_id, count(lb.data_barang_id) as ct_barang
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 7
    AND date(lb.log_date) = dt::date
    GROUP BY regional.id, witel.id, db.barang_id
	)terpakai
	on  witel."id"=terpakai.id_wit
	-- pemenuhan
	LEFT join
	(       SELECT regional.id as id_regi, witel.id as wit_id, db.barang_id as mdb_id, count(lb.data_barang_id) ct_barang
        FROM public.log_barang lb
        join wilayah_kerja witel on lb.tujuan = witel.id
        join wilayah_kerja regional on witel.regional_id_2 = regional.id
        join data_barang db on lb.data_barang_id = db.id
        WHERE lb.status_id = 6
        AND witel.flag = 'Witel'
        AND date(lb.log_date) = dt::date
        AND db.barang_id IN (6,13,14,15)
        GROUP BY regional.id, witel.id, db.barang_id,regional.nama,witel.nama
        ORDER BY regional.nama ASC, witel.nama ASC
	)penuh
	on witel."id"=penuh.wit_id
	

WHERE
reg.nama like 'TREG%'
GROUP BY
reg."id",witel."id",regional,witel,witel.ploted_stock
--,terpakai_a930,terpakai_n5,stok_awal_a930,stok_awal_n5,stok_akhir_a930,stok_akhir_n5,pemenuhan_a930,pemenuhan_n5
)xy
UNION
		SELECT
		xy.regional_id,
	xy.regional,
	xy.witel_id::int4,
	xy.witel::VARCHAR,	xy.ploted_stock::INT4,
xy.stok_awal_a930::int4,
xy.stok_awal_n5::int4,
xy.stok_awal_total::int4,
xy.terpakai_a930::int4,
xy.terpakai_n5::int4,
xy.pemenuhan_a930::int4,
xy.pemenuhan_n5::int4,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930)::int4 stock_akir_a930,
(xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_n5,
(xy.stok_awal_a930-xy.terpakai_a930+xy.pemenuhan_a930 +
xy.stok_awal_n5-xy.terpakai_n5+xy.pemenuhan_n5)::int4 stock_akir_total
from
(
SELECT DISTINCT
		reg."id":: int4 as regional_id,
	reg.nama:: varchar as regional,
	null::int8 as witel_id,
	null::TEXT as witel,
	sum(witel.ploted_stock)::int8 as ploted_stock,
	-- stok awal
		sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 stok_awal_a930,
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_n5,
	sum(case when stok_awal.master_data_barang_id in(6,13) then stok_awal.ct_barang else 0 end)::int4 +
	sum(case when stok_awal.master_data_barang_id in(14,15) then stok_awal.ct_barang else 0 end) ::int4 stok_awal_total,
	-- terpakai
	sum(case when terpakai.mdb_id in(6,13) then terpakai.ct_barang else 0 end)::int4 terpakai_a930,
	sum(case when terpakai.mdb_id in(14,15) then terpakai.ct_barang else 0 end)::int4 terpakai_n5,
	-- pemenuhan
	sum(case when penuh.mdb_id in(6,13) then penuh.ct_barang else 0 end)::int4 pemenuhan_a930,
	sum(case when penuh.mdb_id in(14,15) then penuh.ct_barang else 0 end)::int4 pemenuhan_n5,
	-- stok akir
		sum(case when stok_akhir.master_data_barang_id in(6,13) then stok_akhir.ct_barang else 0 end) ::int4 stok_akhir_a930,
	sum(case when stok_akhir.master_data_barang_id in(14,15) then stok_akhir.ct_barang else 0 end)::int4 stok_akhir_n5,
	sum(case when stok_akhir.master_data_barang_id in(6,13) then stok_akhir.ct_barang else 0 end)::int4 +
	sum(case when stok_akhir.master_data_barang_id in(14,15) then stok_akhir.ct_barang else 0 end)::int4 stok_akhir_total
	
FROM
	wilayah_kerja reg
	join wilayah_kerja witel on reg."id"=witel.regional_id_2 and witel.nama like 'WITEL%'
	-- stok awal
	left join(
		 SELECT s.regional_id,s.witel_id ,mdb.id :: INT8 as master_data_barang_id, count(db.serial_number)ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date)
				group by s.regional_id,s.witel_id,mdb.id)stok_awal 
	on  witel."id"=stok_awal.witel_id
	-- stok akir
	left join(
		SELECT DISTINCT s.regional_id, s.witel_id, mdb.id :: INT8 as master_data_barang_id, count( mdb.id) ct_barang
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt::date
				GROUP BY s.regional_id, s.witel_id,mdb.id)stok_akhir 
	on  witel."id"=stok_akhir.witel_id
	-- terpakai
	left join(
	    SELECT regional.id as id_regi, witel.id as id_wit, db.barang_id as mdb_id, count(lb.data_barang_id) as ct_barang
    FROM public.log_barang lb
    join wilayah_kerja witel on lb.lokasi_id = witel.id
    join wilayah_kerja regional on witel.regional_id_2 = regional.id
    join data_barang db on lb.data_barang_id = db.id
    WHERE lb.status_id = 7
    AND date(lb.log_date) = dt::date
    GROUP BY regional.id, witel.id, db.barang_id
	)terpakai
	on  witel."id"=terpakai.id_wit
	-- pemenuhan
	join
	(       SELECT regional.id as id_regi, witel.id as wit_id, db.barang_id as mdb_id, count(lb.data_barang_id) ct_barang
        FROM public.log_barang lb
        join wilayah_kerja witel on lb.tujuan = witel.id
        join wilayah_kerja regional on witel.regional_id_2 = regional.id
        join data_barang db on lb.data_barang_id = db.id
        WHERE lb.status_id = 6
        AND witel.flag = 'Witel'
        AND date(lb.log_date) = dt::date
        AND db.barang_id IN (6,13,14,15)
        GROUP BY regional.id, witel.id, db.barang_id,regional.nama , witel.nama
        ORDER BY regional.nama ASC, witel.nama ASC
	)penuh
	on witel."id"=penuh.wit_id
	

WHERE
reg.nama like 'TREG%'
GROUP BY
reg."id",regional
--,terpakai_a930,terpakai_n5,stok_awal_a930,stok_awal_n5,stok_akhir_a930,stok_akhir_n5,pemenuhan_a930,pemenuhan_n5
)xy
		ORDER BY regional ASC,witel DESC 
		;			
		
		END CASE;

	--RETURN;
END$function$
;

-- DROP FUNCTION public.report_ava_(varchar, date);

CREATE OR REPLACE FUNCTION public.report_ava_(tipe character varying, dt date)
 RETURNS TABLE(id_reg integer, reg character varying, id_witel integer, witel character varying, ploted_stock integer, "A930_awal" integer, "N5_awal" integer, total_stock_awal integer, "A930_terpakai" integer, "N5_terpakai" integer, "A930_pemenuhan" integer, "N5_pemenuhan" integer, "A930_akhir" integer, "N5_akhir" integer, total_stock_akhir integer)
 LANGUAGE plpgsql
AS $function$
	
	DECLARE bul int4 := EXTRACT(MONTH from dt);
	DECLARE har int4 := EXTRACT(DAY from dt);
	DECLARE tah int4 := EXTRACT(YEAR from dt);
	
	declare Mdt date := dt-7;
	DECLARE Mbul int4 := EXTRACT(MONTH from Mdt);
	DECLARE Mhar int4 := EXTRACT(DAY from Mdt);
	DECLARE Mtah int4 := EXTRACT(YEAR from Mdt);
	
	BEGIN
	
	case 
		when tipe = 'D' THEN
	
	-- Routine body goes here...
	-- repopulate temp stok awal
TRUNCATE TABLE temp_stok_awal;
INSERT into temp_stok_awal(log_date,master_data_barang_id,serial_number,witel_id,region_id)
SELECT
log.log_date :: DATE,
data_barang.barang_id AS master_data_barang_id,
data_barang.serial_number,
wilayah_kerja."id" AS witel_id,
wilayah_kerja.regional_id_2 AS region_id
from
(SELECT
RANK () OVER ( 
		PARTITION BY lb.data_barang_id
		ORDER BY lb.log_date DESC
	) ranking, 
lb.log_date ::date,
lb.data_barang_id,
lb.condition_id,
lb.status_id,
lb.state_id,
lb.lokasi_id
FROM
log_barang lb
WHERE
lb.log_date::date BETWEEN '2022/01/01'::date and dt::date)log
JOIN
data_barang ON log.data_barang_id=data_barang."id"
JOIN
wilayah_kerja ON log.lokasi_id=wilayah_kerja."id"
WHERE
log.ranking = 1 and  log.condition_id=2 and log.state_id=2 and log.status_id=5;

-- delete FROM temp_stok_awal
-- WHERE
-- serial_number in 
-- (SELECT
--  tsa.serial_number
-- FROM
-- temp_stok_awal tsa
-- WHERE
-- temp_stok_awal.serial_number=tsa.serial_number and temp_stok_awal.log_date<tsa.log_date);


TRUNCATE temp_stok_awal_agg;
INSERT into temp_stok_awal_agg(witel_id,a930_awal,n5_awal,total_awal)
SELECT
witel_id,
sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
count(serial_number) total_awal
FROM
temp_stok_awal 
GROUP BY
witel_id
ORDER BY
witel_id;

-- repopulate stok akhir
TRUNCATE TABLE temp_stok_akhir;
INSERT into temp_stok_akhir(log_date,master_data_barang_id,serial_number,witel_id,region_id)
SELECT DISTINCT
log_barang.log_date::date, data_barang.barang_id as master_data_barang_id, data_barang.serial_number, wilayah_kerja."id" as witel_id, wilayah_kerja.regional_id_2 as region_id
FROM
log_barang
join
data_barang
on log_barang.data_barang_id=data_barang."id"
JOIN
wilayah_kerja 
on log_barang.lokasi_id=wilayah_kerja."id"
WHERE log_barang.condition_id=2 and log_barang.state_id=2 and log_barang.status_id=5
and log_date>'2022-01-01'::date and log_barang.log_date<dt::date
and data_barang.serial_number not in (SELECT
laporan_terpakai_rnw.serial_number
FROM
laporan_terpakai_rnw
where  tanggal=dt::date and laporan_terpakai_rnw.witel_id=log_barang.lokasi_id
)

UNION

SELECT
laporan_pemenuhan_rnw.created_at,laporan_pemenuhan_rnw.master_data_barang_id,laporan_pemenuhan_rnw.serial_number,laporan_pemenuhan_rnw.witel_id,laporan_pemenuhan_rnw.regional_id
FROM
laporan_pemenuhan_rnw
WHERE
laporan_pemenuhan_rnw.created_at=dt::date;

-- delete duplicate serial_number  with same witel
DELETE FROM
    temp_stok_awal a1
        USING temp_stok_awal a2
WHERE
    a1.serial_number=a2.serial_number and a1.witel_id=a2.witel_id
    AND a1.log_date<a2.log_date;

DELETE FROM
    temp_stok_akhir a1
        USING temp_stok_akhir a2
WHERE
    a1.serial_number=a2.serial_number and a1.witel_id=a2.witel_id
    AND a1.log_date<a2.log_date;

return query
SELECT
region."id" as region_id,
region.nama as regional,
witel."id" as witel_id,
witel.nama AS witel,
witel.ploted_stock,
coalesce(awal.a930_awal,0)::int4,
coalesce(awal.n5_awal,0)::int4,
coalesce(awal.total_awal,0)::int4,

coalesce(pakai.a930,0)::int4,
coalesce(pakai.n5,0)::int4,
coalesce(penuh.a930,0)::int4,
coalesce(penuh.n5,0)::int4,

(coalesce(awal.a930_awal,0)+coalesce(penuh.a930,0)-coalesce(pakai.a930,0))::int4,
(coalesce(awal.n5_awal,0)+coalesce(penuh.n5,0)-coalesce(pakai.n5,0))::int4,
(coalesce(awal.total_awal,0)+(coalesce(penuh.a930,0)+coalesce(penuh.n5,0))-(coalesce(pakai.a930,0)+coalesce(pakai.n5,0)))::int4

FROM
wilayah_kerja witel
join 
wilayah_kerja region on witel.regional_id_2=region."id" 
LEFT JOIN
(SELECT
laporan_terpakai_rnw.witel_id,
sum(case when laporan_terpakai_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_terpakai_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_terpakai_rnw
where  tanggal=dt
GROUP BY
laporan_terpakai_rnw.witel_id) pakai on pakai.witel_id=witel."id"
left JOIN
(SELECT
laporan_pemenuhan_rnw.witel_id,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_pemenuhan_rnw
where created_at=dt
GROUP BY
laporan_pemenuhan_rnw.witel_id) penuh on penuh.witel_id=witel."id"
LEFT JOIN
temp_stok_awal_agg awal on witel."id"=awal.witel_id

WHERE
witel.nama like 'WITEL %'

-- GROUP BY
-- region.nama,witel.nama,witel.ploted_stock,region."id",witel."id",a930_akhir,n5_akhir,total_akhir,a930_awal,n5_awal,total_awal 
-- 
UNION

SELECT
region."id" as region_id,
region.nama as regional,
NULL as witel_id,
NULL AS witel,
sum(witel.ploted_stock)::int4,
sum(coalesce(awal.a930_awal,0))::int4,
sum(coalesce(awal.n5_awal,0))::int4,
sum(coalesce(awal.total_awal,0))::int4,
-- sum(case when awal.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_awal,
-- sum(case when awal.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_awal,
-- count(awal.serial_number)::INT4 total_awal,
sum(coalesce(pakai.a930,0))::int4,
sum(coalesce(pakai.n5,0))::int4,
sum(coalesce(penuh.a930,0))::int4,
sum(coalesce(penuh.n5,0))::int4,
--, sum(case when akhir.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_akhir,
-- sum(case when akhir.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_akhir,
-- count(akhir.serial_number)::INT4 total_akhir
-- 
(sum(coalesce(awal.a930_awal,0))+sum(coalesce(penuh.a930,0))-sum(coalesce(pakai.a930,0)))::int4,
(sum(coalesce(awal.n5_awal,0))+sum(coalesce(penuh.n5,0))-sum(coalesce(pakai.n5,0)))::int4,
(sum(coalesce(awal.total_awal,0))+(sum(coalesce(penuh.a930,0))+sum(coalesce(penuh.n5,0)))-(sum(coalesce(pakai.n5,0))-sum(coalesce(pakai.n5,0))))::int4
FROM
wilayah_kerja witel
join 
wilayah_kerja region on witel.regional_id_2=region."id"
left JOIN
(SELECT
laporan_terpakai_rnw.witel_id,
sum(case when laporan_terpakai_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_terpakai_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_terpakai_rnw
where  tanggal=dt
GROUP BY
laporan_terpakai_rnw.witel_id) pakai on pakai.witel_id=witel."id"
left JOIN
(SELECT
laporan_pemenuhan_rnw.witel_id,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_pemenuhan_rnw
where created_at=dt
GROUP BY
laporan_pemenuhan_rnw.witel_id) penuh on penuh.witel_id=witel."id"
-- temp_stok_awal awal on witel."id"=awal.witel_id
-- LEFT JOIN
-- temp_stok_akhir akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_akhir,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_akhir,
-- count(serial_number) total_akhir
-- FROM
-- temp_stok_akhir
-- GROUP BY
-- witel_id) akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
-- count(serial_number) total_awal
-- FROM
-- temp_stok_awal 
-- GROUP BY
-- witel_id)awal on witel."id"=awal.witel_id
-- 
LEFT JOIN
temp_stok_awal_agg awal on witel."id"=awal.witel_id
WHERE
witel.nama like 'WITEL %'

GROUP BY
region.nama,region."id"

ORDER BY regional asc, witel desc
;

		when tipe = 'M' THEN
	
	-- Routine body goes here...
	-- repopulate temp stok awal
TRUNCATE TABLE temp_stok_awal;
--INSERT into temp_stok_awal(log_date,master_data_barang_id,serial_number,witel_id,region_id)
INSERT into temp_stok_awal(log_date,master_data_barang_id,serial_number,witel_id,region_id)
SELECT
log.log_date :: DATE,
data_barang.barang_id AS master_data_barang_id,
data_barang.serial_number,
wilayah_kerja."id" AS witel_id,
wilayah_kerja.regional_id_2 AS region_id
from
(SELECT
RANK () OVER ( 
		PARTITION BY lb.data_barang_id
		ORDER BY lb.log_date DESC
	) ranking, 
lb.log_date ::date,
lb.data_barang_id,
lb.condition_id,
lb.status_id,
lb.state_id,
lb.lokasi_id
FROM
log_barang lb
WHERE
lb.log_date::date BETWEEN '2022/01/01'::date and dt::date)log
JOIN
data_barang ON log.data_barang_id=data_barang."id"
JOIN
wilayah_kerja ON log.lokasi_id=wilayah_kerja."id"
WHERE
log.ranking = 1 and  log.condition_id=2 and log.state_id=2 and log.status_id=5;

delete FROM temp_stok_awal
WHERE
serial_number in 
(SELECT
 tsa.serial_number
FROM
temp_stok_awal tsa
WHERE
temp_stok_awal.serial_number=tsa.serial_number and temp_stok_awal.log_date<tsa.log_date)
;

TRUNCATE temp_stok_awal_agg;
INSERT into temp_stok_awal_agg(witel_id,a930_awal,n5_awal,total_awal)
SELECT
witel_id,
sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
count(serial_number) total_awal
FROM
temp_stok_awal 
GROUP BY
witel_id
ORDER BY
witel_id;


-- repopulate stok akhir
TRUNCATE TABLE temp_stok_akhir;
INSERT into temp_stok_akhir(log_date,master_data_barang_id,serial_number,witel_id,region_id)
SELECT DISTINCT
log_barang.log_date::date, data_barang.barang_id as master_data_barang_id, data_barang.serial_number, wilayah_kerja."id" as witel_id, wilayah_kerja.regional_id_2 as region_id
FROM
log_barang
join
data_barang
on log_barang.data_barang_id=data_barang."id"
JOIN
wilayah_kerja 
on log_barang.lokasi_id=wilayah_kerja."id"
WHERE log_barang.condition_id=2 and log_barang.state_id=2 and log_barang.status_id=5
and log_date>'2022-01-01'::date and log_barang.log_date<dt::date
and data_barang.serial_number not in (SELECT
laporan_terpakai_rnw.serial_number
FROM
laporan_terpakai_rnw
where bulan=bul and tahun=tah and laporan_terpakai_rnw.witel_id=log_barang.lokasi_id
)

UNION

SELECT
laporan_pemenuhan_rnw.created_at,laporan_pemenuhan_rnw.master_data_barang_id,laporan_pemenuhan_rnw.serial_number,laporan_pemenuhan_rnw.witel_id,laporan_pemenuhan_rnw.regional_id
FROM
laporan_pemenuhan_rnw
WHERE
bulan=bul and tahun=tah;

-- delete duplicate serial_number  with same witel
DELETE FROM
    temp_stok_awal a1
        USING temp_stok_awal a2
WHERE
    a1.serial_number=a2.serial_number and a1.witel_id=a2.witel_id
    AND a1.log_date<a2.log_date;

DELETE FROM
    temp_stok_akhir a1
        USING temp_stok_akhir a2
WHERE
    a1.serial_number=a2.serial_number and a1.witel_id=a2.witel_id
    AND a1.log_date<a2.log_date;


return query
SELECT
region."id" as region_id,
region.nama as regional,
witel."id" as witel_id,
witel.nama AS witel,
witel.ploted_stock,
coalesce(awal.a930_awal,0)::int4,
coalesce(awal.n5_awal,0)::int4,
coalesce(awal.total_awal,0)::int4,
-- sum(case when awal.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_awal,
-- sum(case when awal.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_awal,
-- count(awal.serial_number)::INT4 total_awal,
coalesce(pakai.a930,0)::int4,
coalesce(pakai.n5,0)::int4,
coalesce(penuh.a930,0)::int4,
coalesce(penuh.n5,0)::int4,
--, sum(case when akhir.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_akhir,
-- sum(case when akhir.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_akhir,
-- count(akhir.serial_number)::INT4 total_akhir
-- 

(coalesce(awal.a930_awal,0)+coalesce(penuh.a930,0)-coalesce(pakai.a930,0))::int4,
(coalesce(awal.n5_awal,0)+coalesce(penuh.n5,0)-coalesce(pakai.n5,0))::int4,
(coalesce(awal.total_awal,0)+(coalesce(penuh.a930,0)+coalesce(penuh.n5,0))-(coalesce(pakai.a930,0)+coalesce(pakai.n5,0)))::int4
-- ,coalesce(akhir.a930_akhir,0)::int4,
-- coalesce(akhir.n5_akhir,0)::int4,
-- coalesce(akhir.total_akhir,0)::int4
FROM
wilayah_kerja witel
join 
wilayah_kerja region on witel.regional_id_2=region."id"
left JOIN
(SELECT
laporan_terpakai_rnw.witel_id,
sum(case when laporan_terpakai_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_terpakai_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_terpakai_rnw
where  bulan=bul and tahun=tah
GROUP BY
laporan_terpakai_rnw.witel_id) pakai on pakai.witel_id=witel."id"
left JOIN
(SELECT
laporan_pemenuhan_rnw.witel_id,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_pemenuhan_rnw
where bulan=bul and tahun=tah
GROUP BY
laporan_pemenuhan_rnw.witel_id) penuh on penuh.witel_id=witel."id"
-- LEFT JOIN
-- temp_stok_awal awal on witel."id"=awal.witel_id
-- LEFT JOIN
-- temp_stok_akhir akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_akhir,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_akhir,
-- count(serial_number) total_akhir
-- FROM
-- temp_stok_akhir
-- GROUP BY
-- witel_id) akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
-- count(serial_number) total_awal
-- FROM
-- temp_stok_awal 
-- GROUP BY
-- witel_id)awal on witel."id"=awal.witel_id
LEFT JOIN
temp_stok_awal_agg awal on witel."id"=awal.witel_id
WHERE
witel.nama like 'WITEL %'

-- GROUP BY
-- region.nama,witel.nama,witel.ploted_stock,region."id",witel."id",a930_akhir,n5_akhir,total_akhir,a930_awal,n5_awal,total_awal 
-- 
UNION

SELECT
region."id" as region_id,
region.nama as regional,null as witel_id,null as witel,
-- witel."id" as witel_id,
-- witel.nama AS witel,
sum(witel.ploted_stock)::int4,
sum(coalesce(awal.a930_awal,0))::int4,
sum(coalesce(awal.n5_awal,0))::int4,
sum(coalesce(awal.total_awal,0))::int4,
-- sum(case when awal.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_awal,
-- sum(case when awal.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_awal,
-- count(awal.serial_number)::INT4 total_awal,
sum(coalesce(pakai.a930,0))::int4,
sum(coalesce(pakai.n5,0))::int4,
sum(coalesce(penuh.a930,0))::int4,
sum(coalesce(penuh.n5,0))::int4,
--, sum(case when akhir.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_akhir,
-- sum(case when akhir.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_akhir,
-- count(akhir.serial_number)::INT4 total_akhir
-- 
(sum(coalesce(awal.a930_awal,0))+sum(coalesce(penuh.a930,0))-sum(coalesce(pakai.a930,0)))::int4,
(sum(coalesce(awal.n5_awal,0))+sum(coalesce(penuh.n5,0))-sum(coalesce(pakai.n5,0)))::int4,
(sum(coalesce(awal.total_awal,0))+(sum(coalesce(penuh.a930,0))+sum(coalesce(penuh.n5,0)))-(sum(coalesce(pakai.n5,0))-sum(coalesce(pakai.n5,0))))::int4
FROM
wilayah_kerja witel
join 
wilayah_kerja region on witel.regional_id_2=region."id"
left JOIN
(SELECT
laporan_terpakai_rnw.witel_id,
sum(case when laporan_terpakai_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_terpakai_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_terpakai_rnw
where  bulan=bul and tahun=tah
GROUP BY
laporan_terpakai_rnw.witel_id) pakai on pakai.witel_id=witel."id"
left JOIN
(SELECT
laporan_pemenuhan_rnw.witel_id,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_pemenuhan_rnw
where bulan=bul and tahun=tah
GROUP BY
laporan_pemenuhan_rnw.witel_id) penuh on penuh.witel_id=witel."id"
-- LEFT JOIN
-- temp_stok_awal awal on witel."id"=awal.witel_id
-- LEFT JOIN
-- temp_stok_akhir akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_akhir,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_akhir,
-- count(serial_number) total_akhir
-- FROM
-- temp_stok_akhir
-- GROUP BY
-- witel_id) akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
-- count(serial_number) total_awal
-- FROM
-- temp_stok_awal 
-- GROUP BY
-- witel_id)awal on witel."id"=awal.witel_id
LEFT JOIN
temp_stok_awal_agg awal on witel."id"=awal.witel_id
WHERE
witel.nama like 'WITEL %'

GROUP BY
region.nama,region."id" 

ORDER BY regional asc, witel desc;



		ELSE
	
	-- Routine body goes here...
	-- repopulate temp stok awal
TRUNCATE TABLE temp_stok_awal;
--INSERT into temp_stok_awal(log_date,master_data_barang_id,serial_number,witel_id,region_id)
INSERT into temp_stok_awal(log_date,master_data_barang_id,serial_number,witel_id,region_id)
SELECT
log.log_date :: DATE,
data_barang.barang_id AS master_data_barang_id,
data_barang.serial_number,
wilayah_kerja."id" AS witel_id,
wilayah_kerja.regional_id_2 AS region_id
from
(SELECT
RANK () OVER ( 
		PARTITION BY lb.data_barang_id
		ORDER BY lb.log_date DESC
	) ranking, 
lb.log_date ::date,
lb.data_barang_id,
lb.condition_id,
lb.status_id,
lb.state_id,
lb.lokasi_id
FROM
log_barang lb
WHERE
lb.log_date::date BETWEEN '2022/01/01'::date and Mdt::date)log
JOIN
data_barang ON log.data_barang_id=data_barang."id"
JOIN
wilayah_kerja ON log.lokasi_id=wilayah_kerja."id"
WHERE
log.ranking = 1 and  log.condition_id=2 and log.state_id=2 and log.status_id=5;

-- delete FROM temp_stok_awal
-- WHERE
-- serial_number in 
-- (SELECT
--  tsa.serial_number
-- FROM
-- temp_stok_awal tsa
-- WHERE
-- temp_stok_awal.serial_number=tsa.serial_number and temp_stok_awal.log_date<tsa.log_date);


TRUNCATE temp_stok_awal_agg;
INSERT into temp_stok_awal_agg(witel_id,a930_awal,n5_awal,total_awal)
SELECT
witel_id,
sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
count(serial_number) total_awal
FROM
temp_stok_awal 
GROUP BY
witel_id
ORDER BY
witel_id;

-- repopulate stok akhir
TRUNCATE TABLE temp_stok_akhir;
INSERT into temp_stok_akhir(log_date,master_data_barang_id,serial_number,witel_id,region_id)
SELECT DISTINCT
log_barang.log_date::date, data_barang.barang_id as master_data_barang_id, data_barang.serial_number, wilayah_kerja."id" as witel_id, wilayah_kerja.regional_id_2 as region_id
FROM
log_barang
join
data_barang
on log_barang.data_barang_id=data_barang."id"
JOIN
wilayah_kerja 
on log_barang.lokasi_id=wilayah_kerja."id"
WHERE log_barang.condition_id=2 and log_barang.state_id=2 and log_barang.status_id=5
and log_date>'2022-01-01'::date and log_barang.log_date<dt::date
and data_barang.serial_number not in (SELECT
laporan_terpakai_rnw.serial_number
FROM
laporan_terpakai_rnw
where (laporan_terpakai_rnw.tanggal BETWEEN Mdt and dt) and laporan_terpakai_rnw.witel_id=log_barang.lokasi_id
)

UNION

SELECT
laporan_pemenuhan_rnw.created_at,laporan_pemenuhan_rnw.master_data_barang_id,laporan_pemenuhan_rnw.serial_number,laporan_pemenuhan_rnw.witel_id,laporan_pemenuhan_rnw.regional_id
FROM
laporan_pemenuhan_rnw
WHERE
laporan_pemenuhan_rnw.created_at BETWEEN Mdt and dt;

-- delete duplicate serial_number  with same witel
DELETE FROM
    temp_stok_awal a1
        USING temp_stok_awal a2
WHERE
    a1.serial_number=a2.serial_number and a1.witel_id=a2.witel_id
    AND a1.log_date<a2.log_date;

DELETE FROM
    temp_stok_akhir a1
        USING temp_stok_akhir a2
WHERE
    a1.serial_number=a2.serial_number and a1.witel_id=a2.witel_id
    AND a1.log_date<a2.log_date;


return query
SELECT
region."id" as region_id,
region.nama as regional,
witel."id" as witel_id,
witel.nama AS witel,
witel.ploted_stock,
coalesce(awal.a930_awal,0)::int4,
coalesce(awal.n5_awal,0)::int4,
coalesce(awal.total_awal,0)::int4,
-- sum(case when awal.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_awal,
-- sum(case when awal.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_awal,
-- count(awal.serial_number)::INT4 total_awal,
coalesce(pakai.a930,0)::int4,
coalesce(pakai.n5,0)::int4,
coalesce(penuh.a930,0)::int4,
coalesce(penuh.n5,0)::int4,
--, sum(case when akhir.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_akhir,
-- sum(case when akhir.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_akhir,
-- count(akhir.serial_number)::INT4 total_akhir
-- 
(coalesce(awal.a930_awal,0)+coalesce(penuh.a930,0)-coalesce(pakai.a930,0))::int4,
(coalesce(awal.n5_awal,0)+coalesce(penuh.n5,0)-coalesce(pakai.n5,0))::int4,
(coalesce(awal.total_awal,0)+(coalesce(penuh.a930,0)+coalesce(penuh.n5,0))-(coalesce(pakai.a930,0)+coalesce(pakai.n5,0)))::int4

-- coalesce(akhir.a930_akhir,0)::int4,
-- coalesce(akhir.n5_akhir,0)::int4,
-- coalesce(akhir.total_akhir,0)::int4
FROM
wilayah_kerja witel
join 
wilayah_kerja region on witel.regional_id_2=region."id"
left JOIN
(SELECT
laporan_terpakai_rnw.witel_id,
sum(case when laporan_terpakai_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_terpakai_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_terpakai_rnw
where laporan_terpakai_rnw.tanggal BETWEEN Mdt and dt
GROUP BY
laporan_terpakai_rnw.witel_id) pakai on pakai.witel_id=witel."id"
left JOIN
(SELECT
laporan_pemenuhan_rnw.witel_id,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_pemenuhan_rnw
where created_at between Mdt and dt
GROUP BY
laporan_pemenuhan_rnw.witel_id) penuh on penuh.witel_id=witel."id"
-- LEFT JOIN
-- temp_stok_awal awal on witel."id"=awal.witel_id
-- LEFT JOIN
-- temp_stok_akhir akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_akhir,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_akhir,
-- count(serial_number) total_akhir
-- FROM
-- temp_stok_akhir
-- GROUP BY
-- witel_id) akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
-- count(serial_number) total_awal
-- FROM
-- temp_stok_awal 
-- GROUP BY
-- witel_id)awal on witel."id"=awal.witel_id
LEFT JOIN
temp_stok_awal_agg awal on witel."id"=awal.witel_id
WHERE
witel.nama like 'WITEL %'

-- GROUP BY
-- region.nama,witel.nama,witel.ploted_stock,region."id",witel."id",a930_akhir,n5_akhir,total_akhir,a930_awal,n5_awal,total_awal 
-- 
UNION

SELECT
region."id" as region_id,
region.nama as regional,
null,
null,
sum(witel.ploted_stock)::int4,
sum(coalesce(awal.a930_awal,0))::int4,
sum(coalesce(awal.n5_awal,0))::int4,
sum(coalesce(awal.total_awal,0))::int4,
-- sum(case when awal.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_awal,
-- sum(case when awal.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_awal,
-- count(awal.serial_number)::INT4 total_awal,
sum(coalesce(pakai.a930,0))::int4,
sum(coalesce(pakai.n5,0))::int4,
sum(coalesce(penuh.a930,0))::int4,
sum(coalesce(penuh.n5,0))::int4,
--, sum(case when akhir.master_data_barang_id=13 then 1 else 0 end)::INT4 a930_akhir,
-- sum(case when akhir.master_data_barang_id=14 then 1 else 0 end)::INT4 n5_akhir,
-- count(akhir.serial_number)::INT4 total_akhir
-- 
(sum(coalesce(awal.a930_awal,0))+sum(coalesce(penuh.a930,0))-sum(coalesce(pakai.a930,0)))::int4,
(sum(coalesce(awal.n5_awal,0))+sum(coalesce(penuh.n5,0))-sum(coalesce(pakai.n5,0)))::int4,
(sum(coalesce(awal.total_awal,0))+(sum(coalesce(penuh.a930,0))+sum(coalesce(penuh.n5,0)))-(sum(coalesce(pakai.n5,0))-sum(coalesce(pakai.n5,0))))::int4


-- sum(coalesce(akhir.a930_akhir,0))::int4,
-- sum(coalesce(akhir.n5_akhir,0))::int4,
-- sum(coalesce(akhir.total_akhir,0))::int4
FROM
wilayah_kerja witel
join 
wilayah_kerja region on witel.regional_id_2=region."id"
left JOIN
(SELECT
laporan_terpakai_rnw.witel_id,
sum(case when laporan_terpakai_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_terpakai_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_terpakai_rnw
where laporan_terpakai_rnw.tanggal BETWEEN Mdt and dt
GROUP BY
laporan_terpakai_rnw.witel_id) pakai on pakai.witel_id=witel."id"
left JOIN
(SELECT
laporan_pemenuhan_rnw.witel_id,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=13 then 1 else 0 end) as a930,
sum(case when laporan_pemenuhan_rnw.master_data_barang_id=14 then 1 else 0 end) as n5
FROM
laporan_pemenuhan_rnw
where created_at between Mdt and dt
GROUP BY
laporan_pemenuhan_rnw.witel_id) penuh on penuh.witel_id=witel."id"-- LEFT JOIN
-- temp_stok_awal awal on witel."id"=awal.witel_id
-- LEFT JOIN
-- temp_stok_akhir akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_akhir,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_akhir,
-- count(serial_number) total_akhir
-- FROM
-- temp_stok_akhir
-- GROUP BY
-- witel_id) akhir on witel."id"=akhir.witel_id
-- LEFT JOIN
-- (SELECT
-- witel_id,
-- sum(case when master_data_barang_id=13 then 1 end) as a930_awal,
-- sum(case when master_data_barang_id=14 then 1 end) as n5_awal,
-- count(serial_number) total_awal
-- FROM
-- temp_stok_awal 
-- GROUP BY
-- witel_id)awal on witel."id"=awal.witel_id
LEFT JOIN
temp_stok_awal_agg awal on witel."id"=awal.witel_id
WHERE
witel.nama like 'WITEL %'

GROUP BY
region.nama,region."id"
ORDER BY regional asc, witel desc;

end case;

END$function$
;

-- DROP FUNCTION public.report_ava_1(varchar, date);

CREATE OR REPLACE FUNCTION public.report_ava_1(tipe character varying, dt date)
 RETURNS TABLE(id_reg integer, reg character varying, id_witel bigint, witel text, ploted_stock bigint, "A930_awal" numeric, "N5_awal" numeric, total_stock_awal numeric, "A930_terpakai" numeric, "N5_terpakai" numeric, "A930_pemenuhan" numeric, "N5_pemenuhan" numeric, "A930_akhir" numeric, "N5_akhir" numeric, total_stock_akhir numeric)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
	case when dt < '2024/06/01'::DATE
		THEN
		RETURN QUERY
		select 
		(select wilayah_kerja."id"::INT4 from wilayah_kerja where temp_ava_suca.regional like '%'||wilayah_kerja.nama||'%') as id_reg,
		temp_ava_suca.regional::VARCHAR,
				wilayah_kerja."id"::int8 AS id_witel,
		temp_ava_suca.witel::TEXT,
		temp_ava_suca.historis_stock::INT8,
		temp_ava_suca.stock_awal_n5::NUMERIC,
		temp_ava_suca.stock_awal_a930::NUMERIC,
		temp_ava_suca.stock_awal_total::NUMERIC,
		temp_ava_suca.terpakai_n5::NUMERIC,
		temp_ava_suca.terpakai_a930::NUMERIC,
		temp_ava_suca.pemenuhan_n5::NUMERIC,
		temp_ava_suca.pemenuhan_a930::NUMERIC,
		temp_ava_suca.stock_akhir_n5::NUMERIC,
		temp_ava_suca.stock_akhir_a930::NUMERIC,
		temp_ava_suca.stock_akhir_total::NUMERIC
		 from temp_ava_suca
		 LEFT JOIN
		 wilayah_kerja on 'WITEL '|| temp_ava_suca.witel LIKE '%'|| wilayah_kerja.nama ||'%'
		WHERE
		temp_ava_suca.bulan=EXTRACT(month from dt) and temp_ava_suca.tahun=EXTRACT(YEAR from dt)
					ORDER BY 
			temp_ava_suca.regional asc,temp_ava_suca.witel DESC ;
		ELSE
		RETURN QUERY
		select * from report_ava(tipe, dt);
	END case;

END$function$
;

-- DROP FUNCTION public.report_ava_nw(varchar, date);

CREATE OR REPLACE FUNCTION public.report_ava_nw(tipe character varying, dt date)
 RETURNS TABLE(id_reg bigint, reg character varying, id_witel bigint, witel text, ploted_stock bigint, "A930_awal" numeric, "N5_awal" numeric, "A930_akhir" numeric, "N5_akhir" numeric)
 LANGUAGE plpgsql
AS $function$
	-- Routine body goes here...
BEGIN
	
	
	case
	-- DAY
	when tipe='D'
	THEN
	RETURN QUERY
	SELECT
 reg.regional_id::int8,
 reg.regional::varchar,
 reg.witel_id::int8,
 reg.witel::TEXT,
 reg.ploted_stock::int8,
 stok_awal.n5::NUMERIC,
 stok_awal.a930::NUMERIC
	FROM
	-- region dan witel
	(
	SELECT
 regi."id" regional_id,
 regi.nama regional,
 witl."id" witel_id,
 witl.nama witel,
 witl.ploted_stock
FROM
	wilayah_kerja regi
	join wilayah_kerja witl on regi."id"=witl.regional_id_2 and witl.nama like '%WITEL%' and regi.nama like '%TREG%')
	 reg LEFT JOIN
	-- stok awal
	(
	SELECT
sa.regional_id, sa.witel_id,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '13'),0) as a930,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '14'),0) as n5
FROM
(SELECT s.regional_id,s.witel_id ,mdb.id :: INT8 as master_data_barang_id, count(db.serial_number)ct
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt-1
				group by s.regional_id,s.witel_id,mdb.id )sa
				GROUP BY sa.regional_id, sa.witel_id)
				stok_awal ON reg.regional_id=stok_awal.regional_id
				 AND reg.witel_id=stok_awal.witel_id;
	-- MONGH------------------------------------------------------------------
	when tipe='M'
	THEN
	
			RETURN QUERY
	SELECT
 reg.regional_id::int8,
 reg.regional::varchar,
 reg.witel_id::int8,
 reg.witel::TEXT,
 reg.ploted_stock::int8,
 stok_awal.n5::NUMERIC,
 stok_awal.a930::NUMERIC,
 stok_akir.n5::NUMERIC,
 stok_akir.a930::NUMERIC
	FROM
	-- region dan witel
	(
	SELECT
 regi."id" regional_id,
 regi.nama regional,
 witl."id" witel_id,
 witl.nama witel,
 witl.ploted_stock
FROM
	wilayah_kerja regi
	join wilayah_kerja witl on regi."id"=witl.regional_id_2 and witl.nama like '%WITEL%' and regi.nama like '%TREG%')
	 reg LEFT JOIN
	-- stok awal
	(
SELECT
sa.regional_id, sa.witel_id,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '13'),0) as a930,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '14'),0) as n5
FROM
(SELECT s.regional_id,s.witel_id ,mdb.id :: INT8 as master_data_barang_id, count(db.serial_number)ct
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = (select (date_trunc('month', dt::date-INTERVAL '1 month') + interval '1 month - 1 day')::date)
				group by s.regional_id,s.witel_id,mdb.id )sa
				GROUP BY sa.regional_id, sa.witel_id)
				stok_awal ON reg.regional_id=stok_awal.regional_id
				 AND reg.witel_id=stok_awal.witel_id
				 LEFT JOIN
	-- stok akhir
	(
SELECT
sa.regional_id, sa.witel_id,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '13'),0) as a930,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '14'),0) as n5
FROM
(SELECT s.regional_id,s.witel_id ,mdb.id :: INT8 as master_data_barang_id, count(db.serial_number)ct
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt
				group by s.regional_id,s.witel_id,mdb.id )sa
				GROUP BY sa.regional_id, sa.witel_id)
				stok_akir ON reg.regional_id=stok_akir.regional_id
				 AND reg.witel_id=stok_akir.witel_id;
	

	-- WEEK------------------------------------------------------------------
	ELSE
		RETURN QUERY
	SELECT
 reg.regional_id::int8,
 reg.regional::varchar,
 reg.witel_id::int8,
 reg.witel::TEXT,
 reg.ploted_stock::int8,
 stok_awal.n5::NUMERIC,
 stok_awal.a930::NUMERIC
	FROM
	-- region dan witel
	(
	SELECT
 regi."id" regional_id,
 regi.nama regional,
 witl."id" witel_id,
 witl.nama witel,
 witl.ploted_stock
FROM
	wilayah_kerja regi
	join wilayah_kerja witl on regi."id"=witl.regional_id_2 and witl.nama like '%WITEL%' and regi.nama like '%TREG%')
	 reg LEFT JOIN
	-- stok awal
	(
SELECT
sa.regional_id, sa.witel_id,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '13'),0) as a930,
COALESCE(MAX("ct") FILTER (WHERE sa.master_data_barang_id = '14'),0) as n5
FROM
(SELECT s.regional_id,s.witel_id ,mdb.id :: INT8 as master_data_barang_id, count(db.serial_number)ct
        FROM public.stock_akhir s
        JOIN wilayah_kerja witel ON s.witel_id = witel.id
        JOIN wilayah_kerja regional ON s.regional_id = regional.id
        JOIN master_data_barang mdb ON s.master_data_barang_id = mdb.id :: INT8 
				and mdb.id :: INT8 in(6,13,14,15)
				join data_barang db on s.data_barang_id=db.id
        WHERE s.tanggal = dt-7
				group by s.regional_id,s.witel_id,mdb.id )sa
				GROUP BY sa.regional_id, sa.witel_id)
				stok_awal ON reg.regional_id=stok_awal.regional_id
				 AND reg.witel_id=stok_awal.witel_id;
	
	END CASE;
	



	--RETURN;
END$function$
;

-- DROP FUNCTION public.report_ava_renew(varchar, date);

CREATE OR REPLACE FUNCTION public.report_ava_renew(tipe character varying, dt date)
 RETURNS TABLE(id_reg integer, reg character varying, id_witel integer, witel character varying, ploted_stock integer, "A930_awal" integer, "N5_awal" integer, total_stock_awal integer, "A930_terpakai" integer, "N5_terpakai" integer, "A930_pemenuhan" integer, "N5_pemenuhan" integer, "A930_akhir" integer, "N5_akhir" integer, total_stock_akhir integer)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...
	
	case when dt < '2024/06/01'::DATE
		THEN
		RETURN query
		select 
		temp_ava_suca.id_region,
		temp_ava_suca.regional,
		temp_ava_suca.id_witel,
		temp_ava_suca.witel,
		temp_ava_suca.historis_stock,
		temp_ava_suca.stock_awal_a930,
		temp_ava_suca.stock_awal_n5,
		temp_ava_suca.stock_awal_total,
		temp_ava_suca.terpakai_a930,
		temp_ava_suca.terpakai_n5,
		temp_ava_suca.pemenuhan_a930,
		temp_ava_suca.pemenuhan_n5,
		temp_ava_suca.stock_akhir_a930,
		temp_ava_suca.stock_akhir_n5,
		temp_ava_suca.stock_akhir_total
		 from temp_ava_suca where bulan=EXTRACT(MONTH from dt::date) and tahun=EXTRACT(YEAR from dt::date)
		 ORDER BY temp_ava_suca."id";
		ELSE
		RETURN QUERY
		select * from report_ava_(tipe, dt);
	END case;

END$function$
;

-- DROP FUNCTION public.report_insert_suca();

CREATE OR REPLACE FUNCTION public.report_insert_suca()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	
	case 
				
	-- ----------------------------------------------------------------------------------------------
	-- ----------------------------------------------------------------------------------------------			
	-- KERUSAKAAN bisa diganti
	-- ----------------------------------------------------------------------------------------------
	-- ----------------------------------------------------------------------------------------------
		WHEN NEW.status_id = 11 
		THEN
		INSERT INTO laporan_kerusakan_rnw ( region_id, witel_id, master_data_barang_id, serial_number, status_id, condition_id, log_barang_id, bisa_diganti, created_at, hari, bulan, tahun ) SELECT
		regional."id" regional_id,
			witel."id" witel_id,
			db.barang_id AS maste_data_barang_id,
			db.serial_number,
			lb.status_id,
			lb.condition_id,
			lb."id" log_barang_id,
			TRUE bisa_diganti,
			CURRENT_TIMESTAMP created_at,
			EXTRACT ( DAY FROM lb.log_date ) hari,
			EXTRACT ( MONTH FROM lb.log_date ) bulan,
			EXTRACT ( YEAR FROM lb.log_date ) tahun 
			FROM
				log_barang lb
				JOIN data_barang db ON lb.data_barang_id = db."id"
				JOIN wilayah_kerja spbu ON lb.lokasi_id = spbu."id"
				JOIN wilayah_kerja witel ON spbu.witel_id = witel."id"
				JOIN wilayah_kerja regional ON witel.regional_id_2 = regional."id"
				JOIN "condition" C ON lb.condition_id = C."id" 
				AND C.ID > 6 
			WHERE
				lb."id" = NEW."id" AND lb.status_id = 11;
				
	-- ----------------------------------------------------------------------------------------------
	-- ----------------------------------------------------------------------------------------------			
	-- KERUSAKAAN tidak bisa diganti
	-- ----------------------------------------------------------------------------------------------
	-- ----------------------------------------------------------------------------------------------
		WHEN  ( NEW.status_id = 10 or NEW.status_id=33) 
		THEN 
		INSERT INTO laporan_kerusakan_rnw ( region_id, witel_id, master_data_barang_id, serial_number, status_id, condition_id, log_barang_id, bisa_diganti, created_at, hari, bulan, tahun ) SELECT
		regional."id" regional_id,
			witel."id" witel_id,
			db.barang_id AS maste_data_barang_id,
			db.serial_number,
			33,
			lb.condition_id,
			lb."id" log_barang_id,
			TRUE bisa_diganti,
			CURRENT_TIMESTAMP created_at,
			EXTRACT ( DAY FROM lb.log_date ) hari,
			EXTRACT ( MONTH FROM lb.log_date ) bulan,
			EXTRACT ( YEAR FROM lb.log_date ) tahun 
			FROM
				log_barang lb
				JOIN data_barang db ON lb.data_barang_id = db."id"
				JOIN wilayah_kerja spbu ON lb.lokasi_id = spbu."id"
				JOIN wilayah_kerja witel ON spbu.witel_id = witel."id"
				JOIN wilayah_kerja regional ON witel.regional_id_2 = regional."id"
				JOIN "condition" C ON lb.condition_id = C."id" 
				AND C.ID > 6 
			WHERE
				lb."id" = NEW."id" AND ( lb.status_id = 10 or lb.status_id=33);
		
	-- ----------------------------------------------------------------------------------------------
	-- ----------------------------------------------------------------------------------------------			
	-- pemenuhan
	-- ----------------------------------------------------------------------------------------------
	-- ----------------------------------------------------------------------------------------------
		WHEN  ( NEW.status_id = 5 or NEW.state_id=2) 
		THEN 
		INSERT into laporan_pemenuhan_rnw
		(sla_id,regional_id,witel_id,master_data_barang_id,serial_number,tracking_id, nomor_resi,delivery_date,recieve_date,created_at,hari,bulan,tahun)
		SELECT 
"SLA".sla,
 regional."id" regional_id,
 witel."id" witel_id,
 db.barang_id master_data_barang_id,
 db.serial_number,
 lb2.tracking_id,
 tc.no_resi,
 max(lb2.log_date) as recieve_date,
 max(lb1.log_date) as delivery_date,
 CURRENT_TIMESTAMP,
 			EXTRACT ( DAY FROM lb2.log_date ) hari,
			EXTRACT ( MONTH FROM lb2.log_date ) bulan,
			EXTRACT ( YEAR FROM lb2.log_date ) tahun ,
			lb2."id" log_barang_id
 
FROM 
log_barang lb1
join
log_barang lb2 on lb1.data_barang_id=lb2.data_barang_id and( lb2.status_id=6 and lb2.state_id=1)
				JOIN data_barang db ON lb1.data_barang_id = db."id"
				JOIN wilayah_kerja witel ON lb1.lokasi_id = witel."id"
				JOIN wilayah_kerja regional ON witel.regional_id_2 = regional."id"
				left join tracking tc ON lb2.tracking_id=tc."id"
				JOIN "SLA" ON witel.sla_id="SLA"."id"
WHERE
lb1.status_id=5 and lb1.state_id=2
GROUP BY
tc.no_resi,"SLA".sla,regional_id,witel."id",master_data_barang_id,db.serial_number,lb2.tracking_id,hari,bulan,tahun,lb2."id"
;		
				
		END CASE;

	--RETURN;
END$function$
;

-- DROP FUNCTION public.report_kerusakan_a930(int8, int8, int8);

CREATE OR REPLACE FUNCTION public.report_kerusakan_a930(bln bigint, thn bigint, stat bigint)
 RETURNS TABLE(idd bigint, condition character varying, "TREG_1" bigint, "TREG_2" bigint, "TREG_3" bigint, "TREG_4" bigint, "TREG_5" bigint, "TREG_6" bigint, "TREG_7" bigint)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...

return query
SELECT
rnw.condition_id as "idd",
con.nama as "condition",
COUNT(case when region_id=5593 then (serial_number) else null end ) TREG_1,
COUNT(case when region_id=5594 then (serial_number) else null end ) TREG_2,
COUNT(case when region_id=5591 then (serial_number) else null end ) TREG_3,
COUNT(case when region_id=5595 then (serial_number) else null end ) TREG_4,
COUNT(case when region_id=5597 then (serial_number) else null end ) TREG_5,
COUNT(case when region_id=5592 then (serial_number) else null end ) TREG_6,
COUNT(case when region_id=5596 then (serial_number) else null end ) TREG_7
FROM
laporan_kerusakan_rnw rnw
JOIN
"condition" con
on rnw.condition_id=con."id"
WHERE
rnw.status_id=stat
AND
rnw.bulan=bln and rnw.tahun=thn and rnw.master_data_barang_id=13
GROUP BY 
"condition", "idd"

UNION

SELECT 999::int8 as "idd",
'TOTAL' as "condition",
COUNT(case when region_id=5593 then (serial_number) else null end ) TREG_1,
COUNT(case when region_id=5594 then (serial_number) else null end ) TREG_2,
COUNT(case when region_id=5591 then (serial_number) else null end ) TREG_3,
COUNT(case when region_id=5595 then (serial_number) else null end ) TREG_4,
COUNT(case when region_id=5597 then (serial_number) else null end ) TREG_5,
COUNT(case when region_id=5592 then (serial_number) else null end ) TREG_6,
COUNT(case when region_id=5596 then (serial_number) else null end ) TREG_7
FROM
laporan_kerusakan_rnw rnw
JOIN
"condition" con
on rnw.condition_id=con."id"
WHERE
rnw.status_id=stat
AND
rnw.bulan=bln and rnw.tahun=thn and rnw.master_data_barang_id=13

ORDER BY
"idd" asc
;
	
END$function$
;

-- DROP FUNCTION public.report_kerusakan_n5(int8, int8, int8);

CREATE OR REPLACE FUNCTION public.report_kerusakan_n5(bln bigint, thn bigint, stat bigint)
 RETURNS TABLE(idd bigint, condition character varying, "TREG_1" bigint, "TREG_2" bigint, "TREG_3" bigint, "TREG_4" bigint, "TREG_5" bigint, "TREG_6" bigint, "TREG_7" bigint)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...

return query
SELECT
rnw.condition_id as "idd",
con.nama as "condition",
COUNT(case when region_id=5593 then (serial_number) else null end ) TREG_1,
COUNT(case when region_id=5594 then (serial_number) else null end ) TREG_2,
COUNT(case when region_id=5591 then (serial_number) else null end ) TREG_3,
COUNT(case when region_id=5595 then (serial_number) else null end ) TREG_4,
COUNT(case when region_id=5597 then (serial_number) else null end ) TREG_5,
COUNT(case when region_id=5592 then (serial_number) else null end ) TREG_6,
COUNT(case when region_id=5596 then (serial_number) else null end ) TREG_7
FROM
laporan_kerusakan_rnw rnw
JOIN
"condition" con
on rnw.condition_id=con."id"
WHERE
rnw.status_id=stat
AND
rnw.bulan=bln and rnw.tahun=thn and rnw.master_data_barang_id=14
GROUP BY 
"condition", "idd"

UNION

SELECT 999::int8 as "idd",
'TOTAL' as "condition",
COUNT(case when region_id=5593 then (serial_number) else null end ) TREG_1,
COUNT(case when region_id=5594 then (serial_number) else null end ) TREG_2,
COUNT(case when region_id=5591 then (serial_number) else null end ) TREG_3,
COUNT(case when region_id=5595 then (serial_number) else null end ) TREG_4,
COUNT(case when region_id=5597 then (serial_number) else null end ) TREG_5,
COUNT(case when region_id=5592 then (serial_number) else null end ) TREG_6,
COUNT(case when region_id=5596 then (serial_number) else null end ) TREG_7
FROM
laporan_kerusakan_rnw rnw
JOIN
"condition" con
on rnw.condition_id=con."id"
WHERE
rnw.status_id=stat
AND
rnw.bulan=bln and rnw.tahun=thn and rnw.master_data_barang_id=14

ORDER BY
"idd" asc
;
	
END$function$
;

-- DROP FUNCTION public.report_pemenuhan(int8, int8);

CREATE OR REPLACE FUNCTION public.report_pemenuhan(bln bigint, thn bigint)
 RETURNS TABLE(sla_id integer, wilayah character varying, witel_id integer, witel character varying, pengiriman_1 bigint, pengiriman_2 bigint, pengiriman_3 bigint, pengiriman_4 bigint, pengiriman_5 bigint, jumlah_edc bigint, lama_pengiriman numeric, sla numeric, keterangan text, avarage_time numeric)
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Routine body goes here...

return query
SELECT 
	"SLA"."id" as sla_id,
	"SLA".nama as wilayah,
	witel."id" as witel_id,
	witel.nama as witel,
	count(case when rnw.week=1 then rnw.serial_number else null end) pengiriman_1,
	sum(case when rnw.week=2 then 1 else 0 end) pengiriman_2,
	count(case when rnw.week=3 then rnw.serial_number else null end) pengiriman_3,
	count(case when rnw.week=4 then rnw.serial_number else null end) pengiriman_4,
	count(case when rnw.week=5 then rnw.serial_number else null end) pengiriman_5,
	count(rnw.serial_number) as jumlah_edc,
	ceiling (avg( rnw.recieve_date::date-rnw.delivery_date::Date)) as lama_pengiriman,
	"SLA".sla::numeric AS slaa,
	'delivered' as keterangan,
	ceiling(avrg.avrg)::NUMERIC as average_time
FROM
	"SLA"
	JOIN
	wilayah_kerja witel on witel.sla_id="SLA"."id"
	JOIN
	(SELECT
		dense_rank()OVER w1 AS "week",
	rnw.created_at::date, rnw.witel_id,rnw.serial_number,rnw.recieve_date,rnw.delivery_date
		FROM
	laporan_pemenuhan_rnw rnw
		where
	rnw.bulan=bln and rnw.tahun=thn
	WINDOW w1 AS (ORDER BY EXTRACT(WEEK FROM rnw.created_at::date)
                      +(EXTRACT(ISODOW FROM rnw.created_at::date) in (6,7))::int)) rnw on rnw.witel_id=witel."id"
	join(
	SELECT
	"SLA"."id",(avg( rnw.recieve_date::date-rnw.delivery_date::Date)::DECIMAL(10,0)) avrg
FROM
	"SLA"
	JOIN
	wilayah_kerja witel on witel.sla_id="SLA"."id"
	JOIN
	laporan_pemenuhan_rnw rnw on rnw.witel_id=witel."id"
	where
	rnw.bulan=bln and rnw.tahun=thn
	GROUP BY
	"SLA"."id"
	)avrg on "SLA"."id"=avrg."id"
	GROUP BY
	wilayah,witel,slaa,keterangan,average_time,"SLA"."id",witel."id"
;
	
END$function$
;

-- DROP FUNCTION public.search_all(text);

CREATE OR REPLACE FUNCTION public.search_all(keyword text)
 RETURNS TABLE(location text, row_data jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    r RECORD;
    v_sql TEXT;
BEGIN
    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name NOT LIKE 'pg_%'
          AND data_type IN ('text', 'character varying', 'character', 'citext')
    LOOP
        v_sql := format(
            'SELECT %L AS location, to_jsonb(t) AS row_data
             FROM %I.%I t
             WHERE %I ILIKE %L',
            r.table_schema || '.' || r.table_name || '.' || r.column_name,
            r.table_schema, r.table_name,
            r.column_name,
            '%' || keyword || '%'
        );

        RETURN QUERY EXECUTE v_sql;
    END LOOP;
END;
$function$
;

-- DROP FUNCTION public.update_asset_code_backup();

CREATE OR REPLACE FUNCTION public.update_asset_code_backup()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.asset_code = NEW.lokasi_code || '-' || NEW.full_asset_code;
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_asset_code_from_log();

CREATE OR REPLACE FUNCTION public.update_asset_code_from_log()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_lokasi_code text;
    v_full_asset_code text;
BEGIN
    -- Memastikan asset_code hanya diperbarui jika status_asset_verify_id adalah 1
    IF NEW.status_asset_verify_id = 4 THEN
        -- Mengambil lokasi_code dan full_asset_code dari tabel t_asset
        SELECT lokasi_code, full_asset_code
        INTO v_lokasi_code, v_full_asset_code
        FROM t_asset
        WHERE id = NEW.asset_id;

        -- Memperbarui asset_code di tabel t_asset
        UPDATE t_asset
        SET asset_code = v_lokasi_code || '-' || v_full_asset_code
        WHERE id = NEW.asset_id;
    END IF;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_code_asset();

CREATE OR REPLACE FUNCTION public.update_code_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Memperbarui asset_code di tabel t_asset jika is_verified = true
    IF NEW.is_verified = true THEN
        NEW.asset_code = NEW.lokasi_code || '-' || NEW.full_asset_code;
    END IF;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.uuid_generate_v1();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- DROP FUNCTION public.uuid_generate_v1mc();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- DROP FUNCTION public.uuid_generate_v4();

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- DROP FUNCTION public.uuid_nil();

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- DROP FUNCTION public.uuid_ns_dns();

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- DROP FUNCTION public.uuid_ns_oid();

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- DROP FUNCTION public.uuid_ns_url();

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- DROP FUNCTION public.uuid_ns_x500();

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;