CREATE TABLE public."m_role" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	nama varchar NOT NULL,
	deskripsi varchar NULL,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);

CREATE TABLE public."m_user" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	nik varchar(200) null,
	email varchar (200) NOT NULL,
	username varchar (200) NULL,
	"password" varchar (500) NOT NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP not NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);

CREATE TABLE public.m_menu (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	name varchar NULL,
	icon varchar NULL,
	url varchar NULL,
	parent_id int4 NULL,
	permission_id int4 NULL,
	is_has_child bool NULL,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	"order" int4 NULL
);


CREATE TABLE public."module" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	nama varchar NOT null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) null,
	is_active boolean not null default true
);

CREATE TABLE public.m_status_document_verification (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	"order"serial4 NOT NULL,
	nama varchar NULL,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);

CREATE TABLE public.m_status_type_document_verification(
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	"order"serial4 NOT NULL,
	nama varchar NULL,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);


CREATE TABLE public.r_user_role (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	user_id uuid NOT NULL,
	role_id uuid NOT null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);