CREATE TABLE public.pm_activity (
	id serial4 NOT NULL,
	activity_name varchar(100) NOT NULL,
	activity_code varchar(100) NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active bool NULL,
	activity_location_id int4 NULL,
	"action" text NULL,
	CONSTRAINT pm_activity_id_pk PRIMARY KEY (id)
);

CREATE TABLE public.pm_activity_location (
	id serial4 NOT NULL,
	location_name varchar(100) NOT NULL,
	location_code varchar(100) NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active bool NULL,
	CONSTRAINT pm_activity_location_id_pk PRIMARY KEY (id)
);

CREATE TABLE public.pm_activity_mapping (
	id serial4 NOT NULL,
	id_kategori_asset int4 NOT NULL,
	mapping_code varchar(100) NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active bool NULL,
	CONSTRAINT pm_activity_mapping_id_pk PRIMARY KEY (id)
);

CREATE TABLE public.pm_detail_activity_mapping (
	id serial4 NOT NULL,
	id_pm_activity_mapping int4 NOT NULL,
	id_pm_activity int4 NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active bool NULL,
	CONSTRAINT pm_detail_activity_mapping_id_pk PRIMARY KEY (id)
);

CREATE TABLE public.pm_detail_preventive (
	id serial4 NOT NULL,
	pm_preventive_id int4 NULL,
	asset_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool NULL,
	foto_asset_depan varchar(550) NULL,
	foto_asset_atas varchar(550) NULL,
	foto_asset_dalam varchar(550) NULL,
	foto_asset_belakang varchar(550) NULL,
	kondisi bool NULL,
	catatan text NULL,
	pm_status_detail_id int4 DEFAULT 1 NOT NULL,
	verified_tl_by_id uuid NULL,
	verified_tl_at timestamptz(6) NULL,
	activity_pm_id int4 NULL,
	reason_reject varchar NULL,
	CONSTRAINT pm_detail_preventive_id PRIMARY KEY (id),
	CONSTRAINT fk_status_pm_detail_preventive FOREIGN KEY (pm_status_detail_id) REFERENCES public.pm_detail_status(id)
);

CREATE TABLE public.pm_detail_status (
	id serial4 NOT NULL,
	nama varchar NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active bool NULL,
	CONSTRAINT pm_detail_status_id PRIMARY KEY (id)
);

CREATE TABLE public.pm_log_task (
	id int4 DEFAULT nextval('pm_task_detail_id_seq'::regclass) NOT NULL,
	pm_detail_preventive_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	pm_activity_id int4 NULL,
	CONSTRAINT pm_detail_task PRIMARY KEY (id)
);

CREATE TABLE public.pm_preventive (
	id serial4 NOT NULL,
	created_by_id uuid NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool NULL,
	nomor_preventive varchar(100) NULL,
	submit_date timestamptz NULL,
	wilayah_kerja_id int4 NULL,
	pm_status_id int4 NOT NULL,
	sign_pm varchar(500) NULL,
	sign_name varchar NULL,
	CONSTRAINT pm_preventive_id PRIMARY KEY (id),
	CONSTRAINT fk_status_pm_preventive FOREIGN KEY (pm_status_id) REFERENCES public.pm_status(id),
	CONSTRAINT fk_wilayah__kerja_id_pm_preventive FOREIGN KEY (wilayah_kerja_id) REFERENCES public.wilayah_kerja(id)
);

CREATE TABLE public.pm_status (
	id serial4 NOT NULL,
	nama varchar NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active bool NULL,
	CONSTRAINT pm_status_id PRIMARY KEY (id)
);


CREATE TABLE public.pm_t_log (
	id serial4 NOT NULL,
	wilayah_kerja_id int4 NULL,
	activity_pm_id int4 NULL,
	create_date timestamptz(6) NULL,
	status_pm int4 NULL,
	kondisi bool NULL,
	evidence_1 varchar(550) NULL,
	evidence_2 varchar(550) NULL,
	evidence_3 varchar(550) NULL,
	evidence_4 varchar(550) NULL,
	live_sign varchar(550) NULL,
	created_by uuid NULL,
	verified_at timestamptz(6) NULL,
	verified_by uuid NULL,
	pm_id int4 NULL,
	created_by_id uuid NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool NULL,
	catatan text NULL,
	status_detail int4 NULL,
	sign_name varchar NULL,
	reason_reject varchar NULL,
	pm_create_date timestamptz NULL,
	CONSTRAINT pk_pm_t_log_id PRIMARY KEY (id)
);


ALTER TABLE public.t_t_rating_logon
ADD COLUMN rating_wb_value int4 NULL,
ADD COLUMN note_wb_rating text NULL,
ADD COLUMN rate_wb_by_id uuid NULL,
ADD COLUMN rated_wb_at timestamptz(6) NULL;


CREATE TABLE public.t_r_rating_wb_logon_relation (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_rating_id uuid NOT NULL,
	reason_rating_id uuid NOT NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	flag_rating int4 NULL,
	CONSTRAINT t_r_rating_logon_history_pk PRIMARY KEY (id),
	CONSTRAINT fk_t_r_rating_logon_history_logon_rating_id FOREIGN KEY (logon_rating_id) REFERENCES public.t_t_rating_logon(id) ON DELETE CASCADE,
	CONSTRAINT fk_t_r_rating_logon_history_reason_rating_id FOREIGN KEY (reason_rating_id) REFERENCES public.t_m_reason_rating(id) ON DELETE CASCADE
);