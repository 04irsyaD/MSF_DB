CREATE TABLE public."user" (
	id uuid NOT NULL,
	email varchar NOT NULL,
	username varchar NULL,
	"password" varchar NOT NULL,
	is_active bool NULL,
	created_at timestamptz(6) NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	role_id int4 NULL,
	witel_id int4 NULL,
	spbu_id int4 NULL,
	jabatan varchar NULL,
	pengirim_penerima_id int4 NULL,
	"NIK" varchar NULL,
	signature_path varchar NULL,
	phone_number varchar NULL,
	updated_by varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);


CREATE TABLE public."L_FAQ" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	faq_id uuid NOT NULL,
	activity_log varchar(200),
	code_faq varchar(20) NULL,
	faq_title_idn varchar(100) NOT NULL,
	faq_title_eng varchar(100) NOT NULL,
	faq_desc_idn text NOT NULL,
	faq_desc_eng text NOT NULL,
	order_loc int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT "L_FAQ_pkey" PRIMARY KEY (id),
	constraint fk_l_faq_id foreign key(faq_id)references "M_FAQ"(id)
);

--  this is for final in this top is a example create table


CREATE TABLE public."t_m_jadwal_shift" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    nama_shift varchar(100) NOT NULL,
    waktu_mulai time NOT NULL,
    waktu_selesai time NOT NULL,
    "order_data" SERIAL,
    created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
    CONSTRAINT t_m_jadwal_shift_pk PRIMARY KEY (id)
)

create Table public."t_m_status_shift_kehadiran_member" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    status_shift varchar(100) NOT NULL,
    "order_data" SERIAL,
    created_by_id uuid NOT NULL,
    updated_by_id uuid NULL,
    created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz(6) NULL,
    deleted_at timestamptz(6) NULL,
    is_active bool DEFAULT true NOT NULL,
    CONSTRAINT t_m_status_shift_kehadiran_member_pk PRIMARY KEY (id)
)

create table public."t_m_reason_rating"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	reason_rating varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_reason_rating_pk PRIMARY KEY (id)
)

create Table public."t_r_jadwal_logon"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	jadwal_shift_id UUID NOT NULL,
	logon_id UUID NOT NULL,
	DATE_LOGON date NOT NULL,
	kondition_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_r_jadwal_logon_pk PRIMARY KEY (id),
	constraint fk_t_r_jadwal_logon_jadwal_shift_id foreign key(jadwal_shift_id)references t_m_jadwal_shift(id),
	constraint fk_t_r_jadwal_logon_logon_id foreign key(logon_id)references t_t_logon_shift(id),
	constraint fk_t_r_jadwal_logon_kondition_id foreign key(kondition_id)references t_m_condition_logon(id)

)

create Table public."t_m_condition_logon"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	kondition_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT condition_logon_pk PRIMARY KEY (id)
)

create table public."t_t_logon_shift"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NOT NULL,
	code_member varchar(100) NOT NULL,
	role_id int4 NOT NULL,
	status_shift_kehadiran_member_id int4 NOT NULL,
	reason_hadir TEXT NULL,
	evidence_path varchar(500) NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_user_id foreign key(user_id)references "user"(id),
	constraint fk_t_t_logon_status_shift_kehadiran_member_id foreign key(status_shift_kehadiran_member_id)references t_m_status_shift_kehadiran_member(id)
)


create table public."t_t_ticket_member" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	ticket_id uuid NOT NULL,
	ticket_take int4 NOT NULL DEFAULT 0,
	ticket_pending int4 NOT NULL DEFAULT 0,
	ticket_solved int4 NOT NULL DEFAULT 0,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_ticket_member_pk PRIMARY KEY (id),
	constraint fk_t_t_ticket_member_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id),
	constraint fk_t_t_ticket_member_ticket_id foreign key(ticket_id)references t_m_ticket(id)
)


create table public."t_t_rating_member" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	rating_value int4 NOT NULL,
	note_rating text NULL,
	reason_rating_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_rating_member_pk PRIMARY KEY (id),
	constraint fk_t_t_rating_member_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id),
	constraint fk_t_t_rating_member_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id)
)

-- qeuery testingquery testing
select 
p.id,
p.permission,
m.nama
from permission p
left join module m on m.id = p.module_id

create table public."t_t_rating" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	rating_value int4 NOT NULL,
	note_rating text NULL,	
	reason_rating_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,	
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,	
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_rating_pk PRIMARY KEY (id),
	constraint fk_t_t_rating_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id)
)


create table public."t_m_new_data_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	data_logon_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_new_data_logon_pk PRIMARY KEY (id)
)

alter table t_r_jadwal_logon
add submited_at timestamptz(6) NULL;
add CONSTRAINT fk_t_r_jadwal_logon_new_data_logon_id foreign key(status_new_data_id)references t_m_new_data_logon(id);



Create table public."t_m_division" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code_division varchar(50) NOT NULL,
	division_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_division_pk PRIMARY KEY (id)
)

alter table t_ticket_eskalasi
add constraint fk_t_ticket_eskalasi_division_id foreign key(division_id)references t_m_division(id);


--  add 

create table public."t_t_notes_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	note_logon text NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_notes_logon_pk PRIMARY KEY (id),
	constraint fk_t_t_notes_logon_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id)
)


Create table public."t_t_logon_anomaly" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_jadwal_id uuid NOT NULL,
	anomaly_logon_id uuid NOT NULL,
	ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_anomaly_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_anomaly_logon_jadwal_id foreign key(logon_jadwal_id)references t_r_jadwal_logon(id),
	constraint fk_t_t_logon_anomaly_anomaly_logon_id foreign key(anomaly_logon_id)references t_m_status_anomaly_logon(id),
	cosntraint fk_t_t_logon_anomaly_ticket_id foreign key(ticket_id)references t_ticket(id)

)


create table public."t_m_status_anomaly_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	anomaly_logon_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_anomaly_logon_pk PRIMARY KEY (id)
);


Create table public."t_t_logon_dispenser" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_jadwal_id uuid NOT NULL,
	dispenser_logon_id uuid  NULL,
	ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_anomaly_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_anomaly_logon_jadwal_id foreign key(logon_jadwal_id)references t_r_jadwal_logon(id),
	constraint fk_t_t_logon_anomaly_dispenser_logon_id foreign key(dispenser_logon_id)references t_m_status_anomaly_dispenser(id),
	cosntraint fk_t_t_logon_anomaly_ticket_id foreign key(ticket_id)references t_ticket(id)

)


create table public."t_m_status_anomaly_dispenser" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	anomaly_logon_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_anomaly_logon_pk PRIMARY KEY (id)
);

create table public."t_m_status_gangguan_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	gangguan_logon varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_status_gangguan_logon_pk PRIMARY KEY (id)
);


CREATE table public."t_t_logon_gangguan" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_jadwal_id uuid NOT NULL,
	gangguan_logon_id uuid  NULL,
	ticket_id int4 NULL,
	detail_gangguan text NULL,
	time_down timestamptz(6) NULL,
	time_up timestamptz(6) NULL,
	keterangan text NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_gangguan_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_gangguan_logon_jadwal_id foreign key(logon_jadwal_id)references t_r_jadwal_logon(id),
	constraint fk_t_t_logon_gangguan_gangguan_logon_id foreign key(gangguan_logon_id)references t_m_status_gangguan_logon(id),
	cosntraint fk_t_t_logon_gangguan_ticket_id foreign key(ticket_id)references t_ticket(id)

)

create Table public."t_t_notes_directions" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	note text NOT NULL,
	directions text NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_notes_directions_pk PRIMARY KEY (id),
	constraint fk_t_t_notes_directions_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id)
)

create table public."t_t_rating_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	rating_value int4 NOT NULL,
	note_rating text NULL,	
	reason_rating_id int4 NULL,
	t_ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,	
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,	
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_rating_logon_pk PRIMARY KEY (id),
	constraint fk_t_t_rating_logon_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id),
	constraint fk_t_t_rating_logon_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id),
	constraint fk_t_t_rating_logon_ticket_id foreign key(t_ticket_id)references t_ticket(id)
)


create table public."t_r_rating_logon_relation" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_rating_id uuid NOT NULL,
	reason_rating_id uuid NOT NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,	
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,	
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_r_rating_logon_history_pk PRIMARY KEY (id),
	constraint fk_t_r_rating_logon_history_logon_rating_id foreign key(logon_rating_id)references t_t_rating_logon(id),
	constraint fk_t_r_rating_logon_history_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id)
)


alter table t_t_logon_gangguan
add constraint fk_t_t_logon_gangguan_ticket_id foreign key(ticket_id)references t_ticket(id);
alter table t_t_logon_gangguan
add constraint fk_t_t_logon_gangguankategori_id foreign key(kategori_id)REFERENCES public.t_kategori(id);


CREATE INDEX idx_ticket_eskalasi_code_spbu 
ON t_ticket_eskalasi USING btree (code_ticket, nomor_spbu);


create INDEX fk_logon_gg_ticket_eskalasi
ON t_t_logon_gangguan USING btree (ticket_id) REFERENCES t_ticket_eskalasi(id);