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

create Table public."t_m_status_shift_member" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    status_shift varchar(100) NOT NULL,
    "order_data" SERIAL,
    created_by_id uuid NOT NULL,
    updated_by_id uuid NULL,
    created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz(6) NULL,
    deleted_at timestamptz(6) NULL,
    is_active bool DEFAULT true NOT NULL,
    CONSTRAINT t_m_status_shift_pk PRIMARY KEY (id)
)

create table 