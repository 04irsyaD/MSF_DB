CREATE TABLE public."M_ROLE" (
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

CREATE TABLE public."M_USER" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	nik varchar(200) null,
	email varchar (200) NOT NULL,
	phone_number varchar(20) null,
	username varchar (200) NULL,
	"password" varchar (500) NOT NULL,
	bussiness_name varchar(100) null,
	position_name varchar(100) null,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP not NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);

CREATE TABLE public."M_MENU" (
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


CREATE TABLE public."R_USER_ROLE" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	user_id uuid NOT NULL,
	role_id uuid NOT null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	constraint fk_role_user_id foreign key(user_id)references "M_USER"(id),
	constraint fk_user_role_id foreign key(role_id)references "M_ROLE"(id)
);


CREATE TABLE public."M_FAQ" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	code_faq varchar(20) null,
	faq_title_idn varchar(100) not null,
	faq_title_eng varchar(100) not null,
	faq_desc_idn text not null,
	faq_desc_eng text not null,
	order_loc int4 null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);



CREATE TABLE public."M_QUESTIONS" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	code_questions varchar(20) null,
	questions_title_idn varchar(100) not null,
	questions_title_eng varchar(100) not null,
	minimum_answer int4 null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);


CREATE TABLE public."M_IDENTITY" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	code_identity varchar(20) null,
	identity_title_idn varchar(100) not null,
	identity_title_eng varchar(100) not null,
	identity_desc_idn varchar(100) not null,
	identity_desc_eng varchar(100) not null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);


CREATE TABLE public."M_TYPE_REPORT" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	code_type varchar(20) null,
	name_type varchar(100) not null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);


CREATE TABLE public."R_SELECT_TYPE_REPORT" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	type_report_id uuid NOT NULL,
	report_id uuid NOT NULL,
	created_by_id uuid  null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	constraint fk_r_select_type_report foreign key(report_id)references "T_REPORT"(id),
	constraint fk_r_select_report_type foreign key(type_report_id)references "M_TYPE_REPORT"(id)
);



CREATE TABLE public."R_ANSWER_QUESTION" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	question_id uuid NOT NULL,
	report_id uuid NOT NULL,
	answwer text null,
	created_by_id uuid  null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	constraint fk_r_answer_question_report foreign key(question_id)references "M_QUESTIONS"(id),
	constraint fk_r_report_questions foreign key(report_id)references "T_REPORT"(id)
);


CREATE TABLE public."M_TYPE_DOC" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	code_type varchar(20) null,
	name_type varchar(100) not null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);


CREATE TABLE public."M_STATUS_REPORT" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	code_status varchar(20) null,
	name_status varchar(100) not null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true
);



CREATE TABLE public."T_REPORT" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	trid varchar(100) not null,
	passcode varchar(100) not null,
	wbs_code varchar(100) not null,
	status_report_id uuid null,
	identity_id uuid null,
	name varchar(200) null,
	email varchar(200) null,
	instution varchar(200) null,
	phone_number varchar(200) null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	constraint fk_status_report foreign key(status_report_id)references "M_STATUS_REPORT"(id),
	constraint fk_identity_report foreign key(identity_id)references "M_IDENTITY"(id)
);



CREATE TABLE public."T_DOCUMENTATIONS" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	report_id uuid null,
	type_doc_id uuid null,
	filename varchar(200) null,
	note text null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	constraint fk_type_doc foreign key(type_doc_id)references "M_TYPE_DOC"(id),
	constraint fk_doc_report foreign key(report_id )references "T_REPORT"(id)
);

CREATE TABLE public."M_PERMISSION" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	menu_id int4 NULL,
	"permission" varchar NOT NULL,
	constraint fk_m_menu_permission foreign key(menu_id)references "M_MENU"(id)
);


CREATE TABLE public."R_USER_PERMISSION" (
	id uuid PRIMARY key NOT null default uuid_generate_v4(),
	user_id uuid NOT NULL,
	permission_id uuid NOT null,
	created_by_id uuid not null,
	updated_by_id uuid NULL,
	created_at timestamptz(6) not null DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active boolean not null default true,
	constraint fk_r_user_permission foreign key(user_id)references "M_USER"(id),
	constraint fk_user_role_permission foreign key(permission_id)references "M_PERMISSION"(id)
);


