CREATE TABLE public.t_t_insera (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
    status_ticket_insera_id uuid NOT NULL,
    number_ticket_insera VARCHAR(255) NOT NULL,
    description_ticket_insera TEXT,
    spbu_id int4 NOT NULL,
    created_ticket_insera timestamptz(6) NOT NULL,
    closed_ticket_insera timestamptz(6) NULL,
    creaated_by_ticket_insera uuid NOT NULL,
    closed_by_ticket_insera uudid NULL,
    created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
    is_active bool NULL,
    constraint t_t_insera_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_status_ticket_insera FOREIGN KEY (status_ticket_insera_id) REFERENCES public.t_m_status_ticket_insera(id)
);

create table t_m_status_ticket_insera (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    status_name varchar(255) NOT NULL,
    created_by_id uuid NOT NULL,
    updated_by_id uuid NULL,
    created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz(6) NULL,
    deleted_at timestamptz(6) NULL,
    constraint t_m_status_ticket_insera_id_pk PRIMARY KEY (id)
);  

CREATE table t_log_ticket_insera (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    t_ticket_insera_id uuid NOT NULL,
    status_ticket_insera_id uuid NOT NULL,
    description_log_ticket_insera TEXT,
    sla_insera timestamptz(6) NULL,
    pic_ticket_insera uuid NULL,
    created_by_id uuid NOT NULL,
    updated_by_id uuid NULL,
    created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz(6) NULL,
    deleted_at timestamptz(6) NULL,
    is_active bool NULL,
    constraint t_log_ticket_insera_id_pk PRIMARY KEY (id),
    CONSTRAINT fk_t_ticket_insera FOREIGN KEY (t_ticket_insera_id) REFERENCES public.t_t_insera(id),
    CONSTRAINT fk_status_ticket_insera_log FOREIGN KEY (status_ticket_insera_id) REFERENCES public.t_m_status_ticket_insera(id)
);




CREATE TABLE public.t_t_rating_logon_detail (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
    t_t_rating_logon_id uuid NOT NULL,
	logon_shift_id uuid NULL,
	rating_value int4 NULL,
	note_rating text NULL,
	t_ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	rate_by_id uuid NULL,
	rated_at timestamptz(6) NULL,
	CONSTRAINT t_t_rating_logon_Detail_pk PRIMARY KEY (id),
    constraint fk_t_t_rating_logon_id FOREIGN KEY (t_t_rating_logon_id) REFERENCES public.t_t_rating_logon(id) ON DELETE CASCADE,
	CONSTRAINT fk_t_t_rating_logon_logon_shift_id FOREIGN KEY (logon_shift_id) REFERENCES public.t_t_logon_shift(id) ON DELETE CASCADE,
	CONSTRAINT fk_t_t_rating_logon_ticket_id FOREIGN KEY (t_ticket_id) REFERENCES public.t_ticket(id) ON DELETE CASCADE
);