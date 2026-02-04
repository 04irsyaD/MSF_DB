-- DROP SCHEMA public;

CREATE TABLE public."M_ACTION_CONCERN" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_concern varchar(20) NULL, name_concern varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_ACTION_CONCERN_pkey" PRIMARY KEY (id));


-- public."M_FAQ" definition

-- Drop table

-- DROP TABLE public."M_FAQ";

CREATE TABLE public."M_FAQ" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_faq varchar(20) NULL, faq_title_idn varchar(100) NOT NULL, faq_title_eng varchar(100) NOT NULL, faq_desc_idn text NOT NULL, faq_desc_eng text NOT NULL, order_loc varchar(150) NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_FAQ_pkey" PRIMARY KEY (id));


-- public."M_IDENTITY" definition

-- Drop table

-- DROP TABLE public."M_IDENTITY";

CREATE TABLE public."M_IDENTITY" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_identity varchar(20) NULL, identity_title_idn varchar(100) NOT NULL, identity_title_eng varchar(100) NOT NULL, identity_desc_idn varchar(100) NOT NULL, identity_desc_eng varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_IDENTITY_pkey" PRIMARY KEY (id));


-- public."M_MENU" definition

-- Drop table

-- DROP TABLE public."M_MENU";

CREATE TABLE public."M_MENU" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, "name" varchar NULL, icon varchar NULL, url varchar NULL, parent_id int4 NULL, permission_id int4 NULL, is_has_child bool NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, "order" int4 NULL, CONSTRAINT "M_MENU_pkey" PRIMARY KEY (id));


-- public."M_RESOURCE_REPORT" definition

-- Drop table

-- DROP TABLE public."M_RESOURCE_REPORT";

CREATE TABLE public."M_RESOURCE_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, resource_name varchar NOT NULL, resource_code varchar NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, "ordering" serial4 NOT NULL, CONSTRAINT "M_RESOURCE_REPORT_pkey" PRIMARY KEY (id));


-- public."M_ROLE" definition

-- Drop table

-- DROP TABLE public."M_ROLE";

CREATE TABLE public."M_ROLE" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, nama varchar NOT NULL, deskripsi varchar NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_ROLE_pkey" PRIMARY KEY (id));


-- public."M_STATUS_INSPECTION" definition

-- Drop table

-- DROP TABLE public."M_STATUS_INSPECTION";

CREATE TABLE public."M_STATUS_INSPECTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_status varchar(20) NULL, name_status varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_STATUS_INSPECTION_pkey" PRIMARY KEY (id));


-- public."M_STATUS_NOTES_RETURN" definition

-- Drop table

-- DROP TABLE public."M_STATUS_NOTES_RETURN";

CREATE TABLE public."M_STATUS_NOTES_RETURN" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_status varchar(20) NULL, name_status varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_STATUS_RETURN_pkey" PRIMARY KEY (id));


-- public."M_STATUS_REPORT" definition

-- Drop table

-- DROP TABLE public."M_STATUS_REPORT";

CREATE TABLE public."M_STATUS_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_status varchar(20) NULL, name_status varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_STATUS_REPORT_pkey" PRIMARY KEY (id));


-- public."M_STATUS_VALIDATION" definition

-- Drop table

-- DROP TABLE public."M_STATUS_VALIDATION";

CREATE TABLE public."M_STATUS_VALIDATION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_status varchar(20) NULL, name_status varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_STATUS_VALIDATION_pkey" PRIMARY KEY (id));


-- public."M_TYPE_DOC" definition

-- Drop table

-- DROP TABLE public."M_TYPE_DOC";

CREATE TABLE public."M_TYPE_DOC" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_type varchar(20) NULL, name_type varchar(100) NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_TYPE_DOC_pkey" PRIMARY KEY (id));


-- public."M_USER" definition

-- Drop table

-- DROP TABLE public."M_USER";

CREATE TABLE public."M_USER" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, nik varchar(200) NULL, email varchar(200) NOT NULL, phone_number varchar(20) NULL, username varchar(200) NULL, "password" varchar(500) NOT NULL, bussiness_name varchar(100) NULL, position_name varchar(100) NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, "name" varchar(250) NULL, CONSTRAINT "M_USER_pkey" PRIMARY KEY (id));


-- public.auth_group definition

-- Drop table

-- DROP TABLE public.auth_group;



-- public.data_rahasia definition

-- Drop table

-- DROP TABLE public.data_rahasia;

CREATE TABLE public.data_rahasia ( id serial4 NOT NULL, nama text NULL, data_enkripsi bytea NULL, CONSTRAINT data_rahasia_pkey PRIMARY KEY (id));


-- public.debug_toolbar_historyentry definition

-- Drop table

-- DROP TABLE public.debug_toolbar_historyentry;


-- public.django_celery_beat_crontabschedule definition

-- Drop table

-- DROP TABLE public.django_celery_beat_crontabschedule;


-- public.django_celery_beat_periodictasks definition

-- Drop table

-- DROP TABLE public.django_celery_beat_periodictasks;



-- public.django_content_type definition

-- Drop table

-- DROP TABLE public.django_content_type;



-- public.django_session definition

-- Drop table

-- DROP TABLE public.django_session;


-- public."L_FAQ" definition

-- Drop table

-- DROP TABLE public."L_FAQ";

CREATE TABLE public."L_FAQ" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, faq_id uuid NOT NULL, activity_log varchar(200) NULL, code_faq varchar(20) NULL, faq_title_idn varchar(100) NOT NULL, faq_title_eng varchar(100) NOT NULL, faq_desc_idn text NOT NULL, faq_desc_eng text NOT NULL, order_loc int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "L_FAQ_pkey" PRIMARY KEY (id), CONSTRAINT fk_l_faq_id FOREIGN KEY (faq_id) REFERENCES public."M_FAQ"(id));


-- public."M_PERMISSION" definition

-- Drop table

-- DROP TABLE public."M_PERMISSION";

CREATE TABLE public."M_PERMISSION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, menu_id uuid NOT NULL, "permission" varchar NOT NULL, CONSTRAINT "M_PERMISSION_pkey" PRIMARY KEY (id), CONSTRAINT fk_m_menu_permission FOREIGN KEY (menu_id) REFERENCES public."M_MENU"(id));


-- public."M_QUESTIONS" definition

-- Drop table

-- DROP TABLE public."M_QUESTIONS";

CREATE TABLE public."M_QUESTIONS" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, code_questions varchar(20) NULL, questions_title_idn varchar(100) NOT NULL, questions_title_eng varchar(100) NOT NULL, minimum_answer int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "M_QUESTIONS_pkey" PRIMARY KEY (id), CONSTRAINT fk_m_questions_created_by FOREIGN KEY (created_by_id) REFERENCES public."M_USER"(id), CONSTRAINT fk_m_questions_updated_by FOREIGN KEY (updated_by_id) REFERENCES public."M_USER"(id));


-- public."M_TYPE_REPORT" definition

-- Drop table

-- DROP TABLE public."M_TYPE_REPORT";

CREATE TABLE public."M_TYPE_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, name_type_short_idn varchar(150) NULL, description_long_idn text NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, icon varchar(25) NULL, name_type_short_eng varchar(150) NULL, description_long_eng text NULL, type_code varchar(25) NULL, CONSTRAINT "M_TYPE_REPORT_pkey" PRIMARY KEY (id), CONSTRAINT fk_m_type_report_created_by FOREIGN KEY (created_by_id) REFERENCES public."M_USER"(id));


-- public."R_ANSWER_QUESTION" definition

-- Drop table

-- DROP TABLE public."R_ANSWER_QUESTION";

CREATE TABLE public."R_ANSWER_QUESTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, question_id uuid NOT NULL, report_id uuid NOT NULL, answwer text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_ANSWER_QUESTION_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_select_report_type FOREIGN KEY (report_id) REFERENCES public."M_TYPE_REPORT"(id), CONSTRAINT fk_r_select_type_report FOREIGN KEY (question_id) REFERENCES public."M_QUESTIONS"(id));


-- public."R_ROLE_PERMISSION" definition

-- Drop table

-- DROP TABLE public."R_ROLE_PERMISSION";

CREATE TABLE public."R_ROLE_PERMISSION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, role_id uuid NOT NULL, permission_id uuid NOT NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, created_by_id uuid NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_ROLE_PERMISSION_pkey" PRIMARY KEY (id), CONSTRAINT fk_rrp_permission FOREIGN KEY (permission_id) REFERENCES public."M_PERMISSION"(id), CONSTRAINT fk_rrp_role FOREIGN KEY (role_id) REFERENCES public."M_ROLE"(id));


-- public."R_TYPE_REPORT_QUESTION" definition

-- Drop table

-- DROP TABLE public."R_TYPE_REPORT_QUESTION";

CREATE TABLE public."R_TYPE_REPORT_QUESTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, type_report_id uuid NULL, question_id uuid NULL, "sequence" int4 DEFAULT 0 NOT NULL, mandatory bool DEFAULT false NULL, added_by uuid NOT NULL, added_at timestamptz DEFAULT now() NULL, removed_by uuid NULL, removed_at timestamptz NULL, deleted_by uuid NULL, deleted_at timestamptz NULL, is_active bool DEFAULT true NULL, CONSTRAINT "R_TYPE_REPORT_QUESTION_pkey" PRIMARY KEY (id), CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public."M_QUESTIONS"(id), CONSTRAINT fk_r_type_report_question_added_by FOREIGN KEY (added_by) REFERENCES public."M_USER"(id), CONSTRAINT fk_r_type_report_question_deleted_by FOREIGN KEY (deleted_by) REFERENCES public."M_USER"(id), CONSTRAINT fk_r_type_report_question_removed_by FOREIGN KEY (removed_by) REFERENCES public."M_USER"(id), CONSTRAINT fk_type_report FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id));


-- public."R_USER_PERMISSION" definition

-- Drop table

-- DROP TABLE public."R_USER_PERMISSION";

CREATE TABLE public."R_USER_PERMISSION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, user_id uuid NOT NULL, permission_id uuid NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_USER_permisiion_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_user_permission FOREIGN KEY (user_id) REFERENCES public."M_USER"(id), CONSTRAINT fk_user_role_permission FOREIGN KEY (permission_id) REFERENCES public."M_PERMISSION"(id));


-- public."R_USER_ROLE" definition

-- Drop table

-- DROP TABLE public."R_USER_ROLE";

CREATE TABLE public."R_USER_ROLE" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, user_id uuid NOT NULL, role_id uuid NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_USER_ROLE_pkey" PRIMARY KEY (id), CONSTRAINT fk_role_user_id FOREIGN KEY (user_id) REFERENCES public."M_USER"(id), CONSTRAINT fk_user_role_id FOREIGN KEY (role_id) REFERENCES public."M_ROLE"(id));


-- public."T_REFRESH_TOKEN" definition

-- Drop table

-- DROP TABLE public."T_REFRESH_TOKEN";

CREATE TABLE public."T_REFRESH_TOKEN" ( "token" varchar(255) NOT NULL, user_id uuid NULL, expires_at timestamptz NOT NULL, created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token), CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."M_USER"(id) ON DELETE CASCADE);


-- public."T_REPORT" definition

-- Drop table

-- DROP TABLE public."T_REPORT";

CREATE TABLE public."T_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, trid varchar(100) NOT NULL, passcode varchar(100) NOT NULL, wbs_code varchar(100) NOT NULL, status_report_id uuid NULL, identity_id uuid NULL, "name" varchar(200) NULL, email varchar(200) NULL, instution varchar(200) NULL, phone_number varchar(200) NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, is_public bool DEFAULT true NOT NULL, resource_report_id uuid NULL, CONSTRAINT "T_REPORT_pkey" PRIMARY KEY (id), CONSTRAINT fk_identity_report FOREIGN KEY (identity_id) REFERENCES public."M_IDENTITY"(id), CONSTRAINT fk_resource_report FOREIGN KEY (resource_report_id) REFERENCES public."M_RESOURCE_REPORT"(id), CONSTRAINT fk_status_report FOREIGN KEY (status_report_id) REFERENCES public."M_STATUS_REPORT"(id));


-- public."T_REPORT_CONCERN" definition

-- Drop table

-- DROP TABLE public."T_REPORT_CONCERN";

CREATE TABLE public."T_REPORT_CONCERN" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_id uuid NOT NULL, concern text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, is_resolved bool DEFAULT true NOT NULL, action_id uuid NULL, CONSTRAINT "T_REPORT_CONCERN_pkey" PRIMARY KEY (id), CONSTRAINT fk_concern_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_concern_report_action FOREIGN KEY (action_id) REFERENCES public."M_ACTION_CONCERN"(id));


-- public."T_REPORT_INSPECTION" definition

-- Drop table

-- DROP TABLE public."T_REPORT_INSPECTION";

CREATE TABLE public."T_REPORT_INSPECTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_id uuid NULL, type_report_id uuid NULL, inspection_no varchar(150) NULL, inspection_sequence varchar(150) NULL, note text NULL, status_id uuid NULL, is_changed bool DEFAULT false NOT NULL, created_by uuid NOT NULL, created_at timestamptz DEFAULT now() NULL, updated_by uuid NULL, updated_at timestamptz NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "T_REPORT_INSPECTION_pkey" PRIMARY KEY (id), CONSTRAINT fk_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_report_status_inspection FOREIGN KEY (status_id) REFERENCES public."M_STATUS_INSPECTION"(id), CONSTRAINT fk_type_report FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id));


-- public."T_REPORT_INSPECTION_NOTES" definition

-- Drop table

-- DROP TABLE public."T_REPORT_INSPECTION_NOTES";

CREATE TABLE public."T_REPORT_INSPECTION_NOTES" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, inspection_id uuid NOT NULL, notes text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "T_INSPECTION_NOTES_pkey" PRIMARY KEY (id), CONSTRAINT fk_inspection_notes FOREIGN KEY (inspection_id) REFERENCES public."T_REPORT_INSPECTION"(id));


-- public."T_REPORT_NOTES" definition

-- Drop table

-- DROP TABLE public."T_REPORT_NOTES";

CREATE TABLE public."T_REPORT_NOTES" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_id uuid NOT NULL, notes text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, is_resolved bool DEFAULT true NOT NULL, CONSTRAINT "T_REPORT_NOTES_pkey" PRIMARY KEY (id), CONSTRAINT fk_notes_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id));


-- public."T_REPORT_VALIDATION" definition

-- Drop table

-- DROP TABLE public."T_REPORT_VALIDATION";

CREATE TABLE public."T_REPORT_VALIDATION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_id uuid NULL, type_report_id uuid NULL, validation_no varchar(150) NULL, validation_sequence varchar(150) DEFAULT '1'::character varying NOT NULL, status_id uuid NULL, is_changed bool DEFAULT false NOT NULL, note text NULL, validate_by uuid NULL, validate_at timestamptz NULL, created_at timestamptz DEFAULT now() NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, status varchar(50) NULL, created_by uuid NULL, CONSTRAINT "T_REPORT_VALIDATION_pkey" PRIMARY KEY (id), CONSTRAINT fk_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_report_status_validation FOREIGN KEY (status_id) REFERENCES public."M_STATUS_VALIDATION"(id), CONSTRAINT fk_type_report FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id));


-- public."T_REPORT_VALIDATION_NOTES" definition

-- Drop table

-- DROP TABLE public."T_REPORT_VALIDATION_NOTES";

CREATE TABLE public."T_REPORT_VALIDATION_NOTES" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, validation_id uuid NOT NULL, notes text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "T_VALIDATION_NOTES_pkey" PRIMARY KEY (id), CONSTRAINT fk_reportvalidation_notes FOREIGN KEY (validation_id) REFERENCES public."T_REPORT_VALIDATION"(id));


-- public."T_USER_MAINTENANCE" definition

-- Drop table

-- DROP TABLE public."T_USER_MAINTENANCE";

CREATE TABLE public."T_USER_MAINTENANCE" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, user_id uuid NOT NULL, "action" text NULL, username text NULL, email text NULL, old_data text NULL, new_data text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "T_USER_MAINTENANCE_pkey" PRIMARY KEY (id), CONSTRAINT fk_user_maintenance FOREIGN KEY (user_id) REFERENCES public."M_USER"(id));


-- public."T_USER_ROLE_APPROVAL" definition

-- Drop table

-- DROP TABLE public."T_USER_ROLE_APPROVAL";

CREATE TABLE public."T_USER_ROLE_APPROVAL" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, user_id uuid NOT NULL, role_id uuid NOT NULL, requested_by_id uuid NOT NULL, requested_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, approved_by_id uuid NULL, approved_at timestamptz NULL, status varchar(100) NOT NULL, CONSTRAINT "T_USER_ROLE_APPROVAL_pkey" PRIMARY KEY (id), CONSTRAINT fk_approval_role FOREIGN KEY (role_id) REFERENCES public."M_ROLE"(id), CONSTRAINT fk_approval_user FOREIGN KEY (user_id) REFERENCES public."M_USER"(id), CONSTRAINT fk_approved_by FOREIGN KEY (approved_by_id) REFERENCES public."M_USER"(id), CONSTRAINT fk_requested_by FOREIGN KEY (requested_by_id) REFERENCES public."M_USER"(id));


-- public."T_VALIDATION_REOPEN_REASON" definition

-- Drop table

-- DROP TABLE public."T_VALIDATION_REOPEN_REASON";

CREATE TABLE public."T_VALIDATION_REOPEN_REASON" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, validation_id uuid NOT NULL, report_id uuid NULL, trid varchar(20) NULL, wbs_code varchar(100) NOT NULL, reason text NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "T_VALIDATION_REOPEN_REASON_pkey" PRIMARY KEY (id), CONSTRAINT fk_reopenvalidation_notes FOREIGN KEY (validation_id) REFERENCES public."T_REPORT_VALIDATION"(id), CONSTRAINT fk_reopenvalidation_notes_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id));


-- public.auth_permission definition

-- Drop table

-- DROP TABLE public.auth_permission;


-- public."A_QUESTION" definition

-- Drop table

-- DROP TABLE public."A_QUESTION";

CREATE TABLE public."A_QUESTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, question_id uuid NOT NULL, user_id uuid NOT NULL, questions_title_idn varchar(100) NOT NULL, questions_title_eng varchar(100) NOT NULL, start_date timestamptz DEFAULT now() NULL, end_date timestamptz NULL, CONSTRAINT "A_QUESTION_pkey" PRIMARY KEY (id), CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public."M_QUESTIONS"(id), CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public."M_USER"(id));


-- public."L_INSPECTION_LOG" definition

-- Drop table

-- DROP TABLE public."L_INSPECTION_LOG";

CREATE TABLE public."L_INSPECTION_LOG" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, inspection_id uuid NOT NULL, status_id uuid NOT NULL, activity_log varchar(200) NULL, note text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "L_INSPECTION_LOG_pkey" PRIMARY KEY (id), CONSTRAINT fk_inspection_log FOREIGN KEY (inspection_id) REFERENCES public."T_REPORT_INSPECTION"(id), CONSTRAINT fk_status_inspection_log FOREIGN KEY (status_id) REFERENCES public."M_STATUS_INSPECTION"(id));


-- public."L_INSPECTION_NOTES" definition

-- Drop table

-- DROP TABLE public."L_INSPECTION_NOTES";

CREATE TABLE public."L_INSPECTION_NOTES" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, inspection_notes_id uuid NOT NULL, inspection_id uuid NOT NULL, activity_log varchar(200) NULL, notes text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "L_INSPECTION_NOTES_pkey" PRIMARY KEY (id), CONSTRAINT fk_l_inspection_notes FOREIGN KEY (inspection_id) REFERENCES public."T_REPORT_INSPECTION"(id), CONSTRAINT fk_l_inspection_notes_id FOREIGN KEY (inspection_notes_id) REFERENCES public."T_REPORT_INSPECTION_NOTES"(id));


-- public."L_QUESTIONS" definition

-- Drop table

-- DROP TABLE public."L_QUESTIONS";

CREATE TABLE public."L_QUESTIONS" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, question_id uuid NOT NULL, activity_log varchar(200) NULL, code_questions varchar(20) NULL, questions_title_idn varchar(100) NOT NULL, questions_title_eng varchar(100) NOT NULL, minimum_answer int4 NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "L_QUESTIONS_pkey" PRIMARY KEY (id), CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public."M_QUESTIONS"(id));


-- public."L_REPORT" definition

-- Drop table

-- DROP TABLE public."L_REPORT";

CREATE TABLE public."L_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_id uuid NOT NULL, activity_log varchar(200) NULL, trid varchar(100) NOT NULL, passcode varchar(100) NOT NULL, wbs_code varchar(100) NOT NULL, status_report_id uuid NULL, identity_id uuid NULL, "name" varchar(200) NULL, email varchar(200) NULL, instution varchar(200) NULL, phone_number varchar(200) NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, notes_id uuid NULL, CONSTRAINT "L_REPORT_pkey" PRIMARY KEY (id), CONSTRAINT fk_l_identity_report FOREIGN KEY (identity_id) REFERENCES public."M_IDENTITY"(id), CONSTRAINT fk_l_status_report FOREIGN KEY (status_report_id) REFERENCES public."M_STATUS_REPORT"(id), CONSTRAINT fk_log_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id));


-- public."L_REPORT_NOTES" definition

-- Drop table

-- DROP TABLE public."L_REPORT_NOTES";

CREATE TABLE public."L_REPORT_NOTES" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, notes_id uuid NOT NULL, report_id uuid NOT NULL, activity_log varchar(200) NULL, notes text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, is_resolved bool DEFAULT true NOT NULL, CONSTRAINT "L_REPORT_NOTES_pkey" PRIMARY KEY (id), CONSTRAINT fk_l_notes_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_l_notes_report_id FOREIGN KEY (notes_id) REFERENCES public."T_REPORT_NOTES"(id));


-- public."L_TYPE_REPORT" definition

-- Drop table

-- DROP TABLE public."L_TYPE_REPORT";

CREATE TABLE public."L_TYPE_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, type_report_id uuid NOT NULL, activity_log varchar(200) NULL, name_type_short_idn varchar(150) NULL, description_long_idn text NOT NULL, created_by_id uuid NOT NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, icon varchar(25) NULL, name_type_short_eng varchar(150) NULL, description_long_eng text NULL, type_code varchar(25) NULL, CONSTRAINT "L_TYPE_REPORT_pkey" PRIMARY KEY (id), CONSTRAINT fk_type_report FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id));


-- public."L_VALIDATION_LOG" definition

-- Drop table

-- DROP TABLE public."L_VALIDATION_LOG";

CREATE TABLE public."L_VALIDATION_LOG" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, validation_id uuid NOT NULL, status_id uuid NOT NULL, activity_log varchar(200) NULL, note text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, report_id uuid NULL, CONSTRAINT "L_VALIDATION_LOG_pkey" PRIMARY KEY (id), CONSTRAINT fk_report_log_validation_id FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_status_validation_log FOREIGN KEY (status_id) REFERENCES public."M_STATUS_VALIDATION"(id), CONSTRAINT fk_validation_log FOREIGN KEY (validation_id) REFERENCES public."T_REPORT_VALIDATION"(id));


-- public."L_VALIDATION_NOTES" definition

-- Drop table

-- DROP TABLE public."L_VALIDATION_NOTES";

CREATE TABLE public."L_VALIDATION_NOTES" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, validation_notes_id uuid NOT NULL, validation_id uuid NOT NULL, activity_log varchar(200) NULL, notes text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "L_VALIDATION_NOTES_pkey" PRIMARY KEY (id), CONSTRAINT fk_l_validation_notes FOREIGN KEY (validation_id) REFERENCES public."T_REPORT_VALIDATION"(id), CONSTRAINT fk_l_validation_notes_id FOREIGN KEY (validation_notes_id) REFERENCES public."T_REPORT_VALIDATION_NOTES"(id));


-- public."R_INSPECTION_NOTE_DETAIL" definition

-- Drop table

-- DROP TABLE public."R_INSPECTION_NOTE_DETAIL";

CREATE TABLE public."R_INSPECTION_NOTE_DETAIL" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, inspection_notes_id uuid NOT NULL, status_note_return_id uuid NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_INSPECTION_NOTE_DETAIL_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_inspection_notes FOREIGN KEY (inspection_notes_id) REFERENCES public."T_REPORT_INSPECTION_NOTES"(id), CONSTRAINT fk_r_inspection_status_id FOREIGN KEY (status_note_return_id) REFERENCES public."M_STATUS_NOTES_RETURN"(id));


-- public."R_REPORT_NOTE_DETAIL" definition

-- Drop table

-- DROP TABLE public."R_REPORT_NOTE_DETAIL";

CREATE TABLE public."R_REPORT_NOTE_DETAIL" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_notes_id uuid NOT NULL, status_notes_id uuid NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, status_report_id uuid NULL, CONSTRAINT "R_REPORT_NOTES_DETAILS" PRIMARY KEY (id), CONSTRAINT fk_r_m_report_id FOREIGN KEY (status_report_id) REFERENCES public."M_STATUS_REPORT"(id), CONSTRAINT fk_r_report_notes FOREIGN KEY (report_notes_id) REFERENCES public."T_REPORT_NOTES"(id), CONSTRAINT fk_r_report_status_return_notes_id FOREIGN KEY (status_notes_id) REFERENCES public."M_STATUS_NOTES_RETURN"(id));


-- public."R_SELECT_TYPE_REPORT" definition

-- Drop table

-- DROP TABLE public."R_SELECT_TYPE_REPORT";

CREATE TABLE public."R_SELECT_TYPE_REPORT" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, type_report_id uuid NOT NULL, report_id uuid NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_SELECT_TYPE_REPORT_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_select_report_type FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id), CONSTRAINT fk_r_select_type_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id));


-- public."R_SELECT_TYPE_REPORT_INSPECTION" definition

-- Drop table

-- DROP TABLE public."R_SELECT_TYPE_REPORT_INSPECTION";

CREATE TABLE public."R_SELECT_TYPE_REPORT_INSPECTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, type_report_id uuid NOT NULL, inspections_id uuid NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_SELECT_TYPE_REPORT_INSPECTION_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_select_report_type FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id), CONSTRAINT fk_r_select_type_validations FOREIGN KEY (inspections_id) REFERENCES public."T_REPORT_INSPECTION"(id));


-- public."R_SELECT_TYPE_REPORT_VALIDATION" definition

-- Drop table

-- DROP TABLE public."R_SELECT_TYPE_REPORT_VALIDATION";

CREATE TABLE public."R_SELECT_TYPE_REPORT_VALIDATION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, type_report_id uuid NOT NULL, validation_id uuid NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_SELECT_TYPE_REPORT_VALIDATION_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_select_report_type FOREIGN KEY (type_report_id) REFERENCES public."M_TYPE_REPORT"(id), CONSTRAINT fk_r_select_type_validations FOREIGN KEY (validation_id) REFERENCES public."T_REPORT_VALIDATION"(id));


-- public."R_VALIDATION_NOTE_DETAIL" definition

-- Drop table

-- DROP TABLE public."R_VALIDATION_NOTE_DETAIL";

CREATE TABLE public."R_VALIDATION_NOTE_DETAIL" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, validation_notes_id uuid NOT NULL, status_note_return_id uuid NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "R_VALIDATION_NOTE_DETAIL_pkey" PRIMARY KEY (id), CONSTRAINT fk_r_validation_notes FOREIGN KEY (validation_notes_id) REFERENCES public."T_REPORT_VALIDATION_NOTES"(id), CONSTRAINT fk_r_validation_status_id FOREIGN KEY (status_note_return_id) REFERENCES public."M_STATUS_NOTES_RETURN"(id));


-- public."T_ANSWER_QUESTION" definition

-- Drop table

-- DROP TABLE public."T_ANSWER_QUESTION";

CREATE TABLE public."T_ANSWER_QUESTION" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, question_id uuid NULL, report_id uuid NULL, answer text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, questions_title_idn varchar(100) NULL, questions_title_eng varchar(100) NULL, CONSTRAINT "T_ANSWER_QUESTION_pkey" PRIMARY KEY (id), CONSTRAINT fk_answer_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_type_doc FOREIGN KEY (question_id) REFERENCES public."M_QUESTIONS"(id));


-- public."T_DOCUMENTATIONS" definition

-- Drop table

-- DROP TABLE public."T_DOCUMENTATIONS";

CREATE TABLE public."T_DOCUMENTATIONS" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, report_id uuid NULL, type_doc_id uuid NULL, filename varchar(200) NULL, note text NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, file_size varchar(150) NULL, file_path varchar(250) NULL, mime_type varchar(150) NULL, CONSTRAINT "T_DOCUMENTATIONS_pkey" PRIMARY KEY (id), CONSTRAINT fk_doc_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id), CONSTRAINT fk_type_doc FOREIGN KEY (type_doc_id) REFERENCES public."M_TYPE_DOC"(id));


-- public."T_INSPECTION_REOPEN_REASON" definition

-- Drop table

-- DROP TABLE public."T_INSPECTION_REOPEN_REASON";

CREATE TABLE public."T_INSPECTION_REOPEN_REASON" ( id uuid DEFAULT uuid_generate_v4() NOT NULL, inspection_id uuid NOT NULL, report_id uuid NULL, trid varchar(20) NULL, wbs_code varchar(100) NOT NULL, reason text NOT NULL, created_by_id uuid NULL, updated_by_id uuid NULL, created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at timestamptz(6) NULL, deleted_at timestamptz(6) NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT "T_INSPECTION_REOPEN_REASON_pkey" PRIMARY KEY (id), CONSTRAINT fk_reopeninspection_notes FOREIGN KEY (inspection_id) REFERENCES public."T_REPORT_INSPECTION"(id), CONSTRAINT fk_reopeninspection_notes_report FOREIGN KEY (report_id) REFERENCES public."T_REPORT"(id));


-- public.auth_group_permissions definition

-- Drop table

-- DROP TABLE public.auth_group_permissions;


-- public."L_SELET_TYPE_REPORT" definition

-- Drop table

-- DROP TABLE public."L_SELET_TYPE_REPORT";



-- DROP FUNCTION public.armor(bytea, _text, _text);
