CREATE TABLE public.pm_report (
	id serial4 NOT NULL,
	witel_id int4 not null,
	total_spbu_number int4 not null,
	total_spbu_percentage decimal,
	done_pm_witel int4 not null,
	not_pm_witel  int not null,
	period date not null,
	created_by_id uuid NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool null,
	CONSTRAINT pk.pm_report_id_pk PRIMARY KEY (id)
);



CREATE TABLE public.pm_report_details (
	id serial4 NOT NULL,
	pm_report_id not null,
	spbu_id int4 not null,
	done_pm_spbu int4 not null,
	not_pm_spbu  int not null,
	period date not null,
	created_by_id uuid NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool null,
	CONSTRAINT pk.pm_report_id_pk PRIMARY KEY (id)
);