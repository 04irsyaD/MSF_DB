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



