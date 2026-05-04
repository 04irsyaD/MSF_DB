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
    constraint t_t_insera_id_pk PRIMARY KEY (id)
    CONSTRAINT fk_status_pm_preventive FOREIGN KEY (pm_status_id) REFERENCES public.pm_status(id),
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
);
