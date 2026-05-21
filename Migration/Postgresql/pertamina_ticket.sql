-- Name Table 
USER

ROLE
ALTER TABLE t_role 
ADD CONSTRAINT t_role_id PRIMARY KEY (id);

ALTER TABLE t_role
ADD CONSTRAINT fk_t_tole_constraint
FOREIGN KEY (group_id) REFERENCES t_group(id);

GROUP 


t_permission
ALTER TABLE t_role 
ADD CONSTRAINT t_role_id PRIMARY KEY (id);


t_module
ALTER TABLE t_permission 
ADD CONSTRAINT fk_t_permission_module_id
FOREIGN KEY (module_id) REFERENCES t_module(id);


t_menu
ALTER TABLE t_menu
ADD CONSTRAINT fk_t_menu_permission
FOREIGN KEY (permission_id) REFERENCES t_permission (id);

t_ticket
ALTER TABLE t_ticket
ADD CONSTRAINT fk_t_ticket_sub_kategori
FOREIGN KEY (sub_kategori_id) REFERENCES t_sub_kategori (id);



-- t_grafana_alert_issue"
 
--     id = Column("id", Integer, primary_key=True, nullable=False, index=True)
--     issue_key = Column("issue_key", String(500), nullable=False, unique=True, index=True)
--     service = Column("service", String(255), nullable=False)
--     name = Column("name", String(255), nullable=True)
--     hostname = Column("hostname", String(255), nullable=True)
--     alert = Column("alert", Text, nullable=True)
--     first_seen_at = Column("first_seen_at", DateTime(timezone=True), nullable=False)
--     last_seen_at = Column("last_seen_at", DateTime(timezone=True), nullable=False)
--     seen_count = Column("seen_count", Integer, default=1, nullable=False)
--     resolved_at = Column("resolved_at", DateTime(timezone=True), nullable=True)
--     is_active = Column("is_active", Boolean, default=True, nullable=False)
--     created_at = Column("created_at", DateTime(timezone=True), nullable=False)
--     updated_at = Column("updated_at", DateTime(timezone=True), nullable=False)



CREATE table t_grafana_alert_issue (
    id SERIAL PRIMARY KEY,
    issue_key VARCHAR(500) NOT NULL UNIQUE,
    service VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    hostname VARCHAR(255),
    alert TEXT,
    first_seen_at TIMESTAMPTZ NOT NULL,
    last_seen_at TIMESTAMPTZ NOT NULL,
    seen_count INTEGER DEFAULT 1 NOT NULL,
    resolved_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
