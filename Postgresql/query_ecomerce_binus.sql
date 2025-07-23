CREATE TABLE public."user" (
	id uuid NOT NULL,
	email varchar(150) NOT NULL,
	username varchar(150) NULL,
	phone_number varchar(20) NULL,
	"password" varchar(500) NOT NULL,
	date_birth date null,
	profile_picture varchar(500) null,
	is_active bool NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE public."role" (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	description varchar NULL,
	created_by_id uuid NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	CONSTRAINT role_key PRIMARY KEY (id)
);


CREATE TABLE public.user_role (
	id serial4 NOT NULL,
	user_id uuid NOT NULL,
	role_id int4 NOT null,
	CONSTRAINT user_role_pkey PRIMARY KEY (id),
	CONSTRAINT FK_role_user_id foreign key(user_id) REFERENCES "user"(id),
	CONSTRAINT FK_user_role_id foreign key(role_id) REFERENCES "role"(id)
	
);


CREATE TABLE public."module" (
	id serial4 NOT NULL,
	nama varchar NOT NULL,
	CONSTRAINT module_pkey PRIMARY KEY (id)
);

CREATE TABLE public."permission" (
	id serial4 NOT NULL,
	module_id int4 NULL,
	"permission" varchar NOT null,
	CONSTRAINT permission_pkey PRIMARY KEY (id),
	CONSTRAINT FK_permission_module_id foreign key(module_id) REFERENCES "module"(id)
);


CREATE TABLE public.t_metadata (
	id serial4 NOT NULL,
	value text NULL,
	is_active bool NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	user_id uuid NULL,
	"path" text NULL,
	deskripsi text NULL,
	CONSTRAINT t_metadata_pk PRIMARY KEY (id)
);


CREATE TABLE public.menu (
	id serial4 NOT NULL,
	"name" varchar NULL,
	icon varchar NULL,
	url varchar NULL,
	parent_id int4 NULL,
	permission_id int4 NULL,
	is_has_child bool NULL,
	is_active bool NULL,
	"order" int4 NULL,
	CONSTRAINT menu_pkey PRIMARY KEY (id),
	CONSTRAINT FK_menu_permission_id foreign key(permission_id) REFERENCES "permission"(id)
);




CREATE TABLE public.t_content_notification (
	id serial4 NOT NULL,
	nama_content text NULL,
	deskripsi text NULL,
	type_notif varchar NULL,
	pengguna_notifikasi varchar NULL,
	title varchar(50) NULL,
	CONSTRAINT t_content_notification_id PRIMARY KEY (id)
);

CREATE TABLE public.t_notification (
	id serial4 NOT NULL,
	created_by_id uuid NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	"order" int4 NULL,
	is_active bool NULL,
	start_date date NULL,
	end_date date NULL,
	is_read bool NULL,
	kondisi varchar(100) NULL,
	aktivitas_selanjutnya text NULL,
	isi_notifikasi text NULL,
	read_at timestamptz(6) NULL,
	role_id int4 NULL,
	user_id uuid NULL,
	CONSTRAINT t_notification_id PRIMARY KEY (id)
);


CREATE TABLE public.forgot_password (
	id serial4 NOT NULL,
	user_id uuid NOT NULL,
	"token" varchar(200) NOT NULL,
	created_date timestamptz(6) NULL
);

CREATE TABLE public.category (
	id serial4 NOT NULL,
	nama varchar NOT NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool NULL,
	group_id int4 NULL,
	kategori_id int4 NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	CONSTRAINT category_pk PRIMARY KEY (id)
);

CREATE TABLE public.product (
	id uuid NOT NULL,
	name_product varchar NOT NULL,
	category_id int4 NULL,
	description_product text null,
	price decimal not null,
	stock_product int not null,
	picture_product varchar(500),
	rating decimal null,
	mercant_id uuid null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint product_pk PRIMARY KEY (id)
);


CREATE TABLE public.wishlist (
	id uuid NOT NULL,
	product_id uuid not null,
--	user_id uuid not null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint wishlist_pk PRIMARY KEY (id)
);



CREATE TABLE public.cart (
	id uuid NOT NULL,
	product_id uuid not null,
	qty int4 null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint cart_pk PRIMARY KEY (id)
);



CREATE TABLE public.merchant (
	id uuid NOT NULL,
	name_merchant varchar(50) not null,
	address_merchant text not null,
	deskripsion_merchant text not null,
	rating decimal null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint merchant_pk PRIMARY KEY (id)
);


CREATE TABLE public.order_product (
	id uuid NOT NULL,
	total_price decimal not null,
	is_active bool NULL,
	status_id int4 null,
	payment_id uuid null,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint order_product_pk PRIMARY KEY (id)
);

CREATE TABLE public.payment_user (
	id serial4 NOT NULL,
	amount decimal NOT NULL,
	payment_method_id not null,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT payment_method_pk  PRIMARY KEY (id)
);







CREATE TABLE public.payment_method (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT payment_method_pk  PRIMARY KEY (id)
);



CREATE TABLE public.status_order (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT status_pkey PRIMARY KEY (id)
);

CREATE TABLE public.order_product_details (
	id uuid NOT NULL,
	product_id uuid not null,
	qty_product int4 not null,
	price decimal not null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint order_product_detail_pk PRIMARY KEY (id)
);


CREATE TABLE public.rating (
	id uuid NOT NULL,
	number_rating decimal not null,
	description_rating null,
	photo_rating varchar(500) null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint rating_pk PRIMARY KEY (id)
);


CREATE TABLE public.shipment (
	id uuid NOT NULL,
	address_shipment varchar not null,
	city_shipment varchar not null,
	zip_code varchar(50) null,
	is_active bool NULL,
	created_by_id varchar(50) NULL,
	updated_by_id varchar(50) NULL,
	created_at varchar(50) NULL,
	updated_at varchar(50) NULL,
	deleted_at timestamptz(6) NULL,
	constraint shipment_pk PRIMARY KEY (id)
);

CREATE TABLE public.role_permission (
	id serial4 NOT NULL,
	role_id int4 NOT NULL,
	permission_id int4 NOT NULL,
    constraint role_permission_pk PRIMARY KEY (id)
);