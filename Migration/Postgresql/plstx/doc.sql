-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP TYPE public."period";

CREATE TYPE public."period" AS ENUM (
	'days',
	'hours',
	'minutes',
	'seconds',
	'microseconds');

-- DROP TYPE public.solarevent;

CREATE TYPE public.solarevent AS ENUM (
	'dawn_astronomical',
	'dawn_nautical',
	'dawn_civil',
	'sunrise',
	'solar_noon',
	'sunset',
	'dusk_civil',
	'dusk_nautical',
	'dusk_astronomical');

-- DROP SEQUENCE public.access_seq;

CREATE SEQUENCE public.access_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ai_model_profiles_id_seq;

CREATE SEQUENCE public.ai_model_profiles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ai_org_aliases_id_seq;

CREATE SEQUENCE public.ai_org_aliases_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ai_prompt_versions_id_seq;

CREATE SEQUENCE public.ai_prompt_versions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.auth_group_id_seq;

CREATE SEQUENCE public.auth_group_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.auth_group_permissions_id_seq;

CREATE SEQUENCE public.auth_group_permissions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.auth_permission_id_seq;

CREATE SEQUENCE public.auth_permission_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.categorization_seq;

CREATE SEQUENCE public.categorization_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.causecategory_seq;

CREATE SEQUENCE public.causecategory_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.chain_seq;

CREATE SEQUENCE public.chain_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.coimpactcriteria_seq;

CREATE SEQUENCE public.coimpactcriteria_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.coimpactvalue_seq;

CREATE SEQUENCE public.coimpactvalue_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.colikelihood_seq;

CREATE SEQUENCE public.colikelihood_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.condition_seq;

CREATE SEQUENCE public.condition_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.config_sync_tables_id_seq;

CREATE SEQUENCE public.config_sync_tables_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.db_scheme_id_seq;

CREATE SEQUENCE public.db_scheme_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_admin_log_id_seq;

CREATE SEQUENCE public.django_admin_log_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_admin_log_id_seq1;

CREATE SEQUENCE public.django_admin_log_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_clockedschedule_id_seq;

CREATE SEQUENCE public.django_celery_beat_clockedschedule_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_clockedschedule_id_seq1;

CREATE SEQUENCE public.django_celery_beat_clockedschedule_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_crontabschedule_id_seq;

CREATE SEQUENCE public.django_celery_beat_crontabschedule_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_crontabschedule_id_seq1;

CREATE SEQUENCE public.django_celery_beat_crontabschedule_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_intervalschedule_id_seq;

CREATE SEQUENCE public.django_celery_beat_intervalschedule_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_intervalschedule_id_seq1;

CREATE SEQUENCE public.django_celery_beat_intervalschedule_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_periodictask_id_seq;

CREATE SEQUENCE public.django_celery_beat_periodictask_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_periodictask_id_seq1;

CREATE SEQUENCE public.django_celery_beat_periodictask_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_solarschedule_id_seq;

CREATE SEQUENCE public.django_celery_beat_solarschedule_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_celery_beat_solarschedule_id_seq1;

CREATE SEQUENCE public.django_celery_beat_solarschedule_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_content_type_id_seq;

CREATE SEQUENCE public.django_content_type_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_content_type_id_seq1;

CREATE SEQUENCE public.django_content_type_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_migrations_id_seq;

CREATE SEQUENCE public.django_migrations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.django_migrations_id_seq1;

CREATE SEQUENCE public.django_migrations_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.effectcontrol_seq;

CREATE SEQUENCE public.effectcontrol_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.gdb_seq;

CREATE SEQUENCE public.gdb_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.gkey_seq;

CREATE SEQUENCE public.gkey_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.global_variabel_id_seq;

CREATE SEQUENCE public.global_variabel_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.gresidualrisk_seq;

CREATE SEQUENCE public.gresidualrisk_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.griskidentification_seq;

CREATE SEQUENCE public.griskidentification_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.grisklistoid_seq;

CREATE SEQUENCE public.grisklistoid_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.griskmeasurement_seq;

CREATE SEQUENCE public.griskmeasurement_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.grisktreatment_seq;

CREATE SEQUENCE public.grisktreatment_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.id_temporaryimpact;

CREATE SEQUENCE public.id_temporaryimpact
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.idassets_seq;

CREATE SEQUENCE public.idassets_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.idb_seq;

CREATE SEQUENCE public.idb_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ikey_seq;

CREATE SEQUENCE public.ikey_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.impact_seq;

CREATE SEQUENCE public.impact_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.impactcriteria_seq;

CREATE SEQUENCE public.impactcriteria_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.impacttoprocess_seq;

CREATE SEQUENCE public.impacttoprocess_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.impactvalue_seq;

CREATE SEQUENCE public.impactvalue_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.iresidualrisk_seq;

CREATE SEQUENCE public.iresidualrisk_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.iriskidentification_seq;

CREATE SEQUENCE public.iriskidentification_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.iriskmeasurement_seq;

CREATE SEQUENCE public.iriskmeasurement_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.irisktreatment_seq;

CREATE SEQUENCE public.irisktreatment_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.ismscontrol_seq;

CREATE SEQUENCE public.ismscontrol_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.likelihood_seq;

CREATE SEQUENCE public.likelihood_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.likelihoodcr_seq;

CREATE SEQUENCE public.likelihoodcr_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.llm_provider_keys_id_seq;

CREATE SEQUENCE public.llm_provider_keys_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."m_ikeylist_ID_seq";

CREATE SEQUENCE public."m_ikeylist_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.menu_seq;

CREATE SEQUENCE public.menu_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.menuaccess_seq;

CREATE SEQUENCE public.menuaccess_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.performitem_seq;

CREATE SEQUENCE public.performitem_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.performreview_seq;

CREATE SEQUENCE public.performreview_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.performsum_seq;

CREATE SEQUENCE public.performsum_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.rbac_seq;

CREATE SEQUENCE public.rbac_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.role_seq;

CREATE SEQUENCE public.role_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.scheduler_db_config_id_seq;

CREATE SEQUENCE public.scheduler_db_config_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.sregister_seq;

CREATE SEQUENCE public.sregister_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.streatment_seq;

CREATE SEQUENCE public.streatment_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.systeminforc_seq;

CREATE SEQUENCE public.systeminforc_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_geditable_ID_seq";

CREATE SEQUENCE public."t_geditable_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_genforcement_ID_seq";

CREATE SEQUENCE public."t_genforcement_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_gkeyidentification_ID_seq";

CREATE SEQUENCE public."t_gkeyidentification_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_gkeylist_ID_seq";

CREATE SEQUENCE public."t_gkeylist_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_gkeylist_ID_seq1";

CREATE SEQUENCE public."t_gkeylist_ID_seq1"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_ieditable_ID_seq";

CREATE SEQUENCE public."t_ieditable_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_ienforcement_ID_seq";

CREATE SEQUENCE public."t_ienforcement_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_ikeyidentification_ID_seq";

CREATE SEQUENCE public."t_ikeyidentification_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_ikeylist_ID_seq";

CREATE SEQUENCE public."t_ikeylist_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_ikeylist_ID_seq1";

CREATE SEQUENCE public."t_ikeylist_ID_seq1"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_lossevent_idku_seq;

CREATE SEQUENCE public.t_lossevent_idku_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_losseventlist_idku_seq;

CREATE SEQUENCE public.t_losseventlist_idku_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_users_auth_USID_seq";

CREATE SEQUENCE public."t_users_auth_USID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_users_auth_groups_id_seq;

CREATE SEQUENCE public.t_users_auth_groups_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.t_users_auth_user_permissions_id_seq;

CREATE SEQUENCE public.t_users_auth_user_permissions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_users_role_ID_seq";

CREATE SEQUENCE public."t_users_role_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."t_users_tokens_ID_seq";

CREATE SEQUENCE public."t_users_tokens_ID_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.taksonomi_seq;

CREATE SEQUENCE public.taksonomi_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tempcoimpact_seq;

CREATE SEQUENCE public.tempcoimpact_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.tempcolikelihood_seq;

CREATE SEQUENCE public.tempcolikelihood_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;-- public.ai_attachment definition

-- Drop table

-- DROP TABLE public.ai_attachment;

CREATE TABLE public.ai_attachment ( id uuid NOT NULL, document_name varchar NULL, okkai_doc_id varchar NULL, created_at timestamptz NULL, updated_at timestamptz NULL, original_filename varchar NULL, conversation_id uuid NULL, context jsonb NULL, CONSTRAINT ai_attachment_pkey PRIMARY KEY (id));
CREATE INDEX ix_public_ai_attachment_created_at ON public.ai_attachment USING btree (created_at);
CREATE INDEX ix_public_ai_attachment_id ON public.ai_attachment USING btree (id);


-- public.ai_conversations definition

-- Drop table

-- DROP TABLE public.ai_conversations;

CREATE TABLE public.ai_conversations ( id uuid DEFAULT gen_random_uuid() NOT NULL, user_id text NOT NULL, created_at timestamptz(6) DEFAULT now() NOT NULL, updated_at timestamptz(6) DEFAULT now() NOT NULL, state jsonb NULL, CONSTRAINT conversations_pkey PRIMARY KEY (id), CONSTRAINT uq_conversations_user_id UNIQUE (user_id));


-- public.ai_model_profiles definition

-- Drop table

-- DROP TABLE public.ai_model_profiles;

CREATE TABLE public.ai_model_profiles ( id bigserial NOT NULL, profile_key text NOT NULL, model text NOT NULL, temperature numeric DEFAULT 0 NOT NULL, max_tokens int4 DEFAULT 256 NOT NULL, timeout_s numeric DEFAULT 25 NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL, is_active bool DEFAULT true NOT NULL, CONSTRAINT ai_model_profiles_pkey PRIMARY KEY (id), CONSTRAINT ai_model_profiles_profile_key_key UNIQUE (profile_key));


-- public.ai_org_aliases definition

-- Drop table

-- DROP TABLE public.ai_org_aliases;

CREATE TABLE public.ai_org_aliases ( id bigserial NOT NULL, alias_type text NOT NULL, alias text NOT NULL, canonical text NOT NULL, active bool DEFAULT true NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL, CONSTRAINT ai_org_aliases_pkey PRIMARY KEY (id));
CREATE INDEX idx_ai_org_aliases_lookup ON public.ai_org_aliases USING btree (alias_type, lower(alias)) WHERE (active = true);


-- public.ai_prompt_versions definition

-- Drop table

-- DROP TABLE public.ai_prompt_versions;

CREATE TABLE public.ai_prompt_versions ( id bigserial NOT NULL, prompt_key text NOT NULL, "version" int4 NOT NULL, is_active bool DEFAULT false NOT NULL, system_text text NOT NULL, user_template text NULL, response_schema jsonb NULL, notes text NULL, updated_at timestamptz DEFAULT now() NOT NULL, updated_by text NULL, CONSTRAINT ai_prompt_versions_pkey PRIMARY KEY (id));
CREATE UNIQUE INDEX ux_ai_prompt_active ON public.ai_prompt_versions USING btree (prompt_key) WHERE (is_active = true);
CREATE UNIQUE INDEX ux_ai_prompt_ver ON public.ai_prompt_versions USING btree (prompt_key, version);


-- public.config_sync_tables definition

-- Drop table

-- DROP TABLE public.config_sync_tables;

CREATE TABLE public.config_sync_tables ( id serial4 NOT NULL, table_name varchar(255) NOT NULL, is_active bool NOT NULL, created_at timestamptz DEFAULT now() NULL, CONSTRAINT config_sync_tables_pkey PRIMARY KEY (id));
CREATE INDEX ix_public_config_sync_tables_id ON public.config_sync_tables USING btree (id);
CREATE UNIQUE INDEX ix_public_config_sync_tables_table_name ON public.config_sync_tables USING btree (table_name);


-- public.db_scheme definition

-- Drop table

-- DROP TABLE public.db_scheme;

CREATE TABLE public.db_scheme ( id serial4 NOT NULL, "name" varchar NULL, scheme text NULL, is_view bool NULL, created_at timestamptz NULL, updated_at timestamptz NULL, CONSTRAINT db_scheme_pkey PRIMARY KEY (id));
CREATE INDEX ix_public_db_scheme_created_at ON public.db_scheme USING btree (created_at);
CREATE INDEX ix_public_db_scheme_id ON public.db_scheme USING btree (id);


-- public.global_variabel definition

-- Drop table

-- DROP TABLE public.global_variabel;

CREATE TABLE public.global_variabel ( id serial4 NOT NULL, "name" varchar NOT NULL, value varchar NULL, "group" varchar NULL, created_at timestamptz DEFAULT now() NULL, satuan varchar NULL, is_encrypted bool NULL, is_active bool DEFAULT true NULL, CONSTRAINT global_variabel_pkey PRIMARY KEY (id));


-- public.llm_provider_keys definition

-- Drop table

-- DROP TABLE public.llm_provider_keys;

CREATE TABLE public.llm_provider_keys ( id serial4 NOT NULL, provider varchar(50) NOT NULL, api_key_encrypted text NOT NULL, is_active bool NULL, description varchar(255) NULL, created_at timestamptz DEFAULT now() NULL, CONSTRAINT llm_provider_keys_pkey PRIMARY KEY (id));
CREATE INDEX ix_public_llm_provider_keys_id ON public.llm_provider_keys USING btree (id);
CREATE INDEX ix_public_llm_provider_keys_provider ON public.llm_provider_keys USING btree (provider);


-- public.promt_ai definition

-- Drop table

-- DROP TABLE public.promt_ai;

CREATE TABLE public.promt_ai ( id uuid NOT NULL, task varchar(500) NULL, promt varchar(500) NULL, CONSTRAINT promt_ai_pk PRIMARY KEY (id));


-- public.scheduler_db_config definition

-- Drop table

-- DROP TABLE public.scheduler_db_config;

CREATE TABLE public.scheduler_db_config ( id serial4 NOT NULL, "name" varchar(50) NOT NULL, db_host varchar(255) NOT NULL, db_port int4 NOT NULL, db_user varchar(100) NOT NULL, db_pass_encrypted text NOT NULL, db_name varchar(100) NOT NULL, description text NULL, is_active bool NULL, created_at timestamptz DEFAULT now() NULL, updated_at timestamptz NULL, CONSTRAINT scheduler_db_config_name_key UNIQUE (name), CONSTRAINT scheduler_db_config_pkey PRIMARY KEY (id));
CREATE INDEX ix_public_scheduler_db_config_id ON public.scheduler_db_config USING btree (id);

-- Column comments

COMMENT ON COLUMN public.scheduler_db_config."name" IS 'Nama unik koneksi, misal: ''DB_ORI_PROD''';
COMMENT ON COLUMN public.scheduler_db_config.db_pass_encrypted IS 'Password terenkripsi';


-- public.suggestion_question definition

-- Drop table

-- DROP TABLE public.suggestion_question;

CREATE TABLE public.suggestion_question ( id uuid NOT NULL, question_text text NOT NULL, "language" varchar(8) NOT NULL, intent_key varchar NULL, placement varchar(32) NOT NULL, priority int4 NOT NULL, is_active bool NULL, category varchar(32) NOT NULL, icon varchar NULL, created_at timestamptz NULL, updated_at timestamptz NULL, sql_query text NULL, CONSTRAINT suggestion_question_pkey PRIMARY KEY (id));


-- public.t_businessunit definition

-- Drop table

-- DROP TABLE public.t_businessunit;

CREATE TABLE public.t_businessunit ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "BUID" varchar DEFAULT uuid_generate_v4() NULL, "BUCD" varchar NULL, "BUNM" varchar NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);
CREATE INDEX i_businessunit ON public.t_businessunit USING btree ("BEGDA", "ENDDA", "BUCD");


-- public.t_chainanalysis definition

-- Drop table

-- DROP TABLE public.t_chainanalysis;

CREATE TABLE public.t_chainanalysis ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "CHANID" uuid DEFAULT uuid_generate_v4() NULL, "CHANCD" varchar DEFAULT concat('CHAN-', nextval('chain_seq'::regclass)) NULL, "CHANNM" varchar NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);


-- public.t_corporaterisk definition

-- Drop table

-- DROP TABLE public.t_corporaterisk;

CREATE TABLE public.t_corporaterisk ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" uuid DEFAULT uuid_generate_v4() NULL, "CORICD" varchar NULL, "RISKNUM" int4 NULL, "PRD" date NULL, "DESC" text NULL, "TARECD" varchar NULL, "RISKCR" text NULL, "IMCRCD" varchar NULL, "LIHOCD" varchar NULL, "LIHOVAL" int4 NULL, "IMVALCD" varchar NULL, "IMVAL" int4 NULL, "INRISCO" int4 NULL, "INRICAT" varchar NULL, "TGTLICD" varchar NULL, "TGTLI" int4 NULL, "TGTIMCD" varchar NULL, "TGTIM" int4 NULL, "TGTRISC" int4 NULL, "TGTRISCAT" varchar NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);

-- Table Triggers

create trigger tg_corporateriskmeasurement_newheatmap before
insert
    or
update
    of "LIHOVAL",
    "TGTIM",
    "TGTLI",
    "IMVAL" on
    public.t_corporaterisk for each row execute function f_corporateriskmeasurement_newheatmap();
create trigger tg_corporaterisklistupdate after
update
    on
    public.t_corporaterisk for each row execute function f_corporaterisklistupdate();
create trigger tg_corporaterisklist after
insert
    on
    public.t_corporaterisk for each row execute function f_corporaterisklist();


-- public.t_corporaterisktotal definition

-- Drop table

-- DROP TABLE public.t_corporaterisktotal;

CREATE TABLE public.t_corporaterisktotal ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" uuid DEFAULT uuid_generate_v4() NULL, "PRD" date NULL, "TOTAL" int4 NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);


-- public.t_dup_grisklist definition

-- Drop table

-- DROP TABLE public.t_dup_grisklist;

CREATE TABLE public.t_dup_grisklist ( "BEGDA" date NULL, "ENDDA" date NULL, "OBJTV" text NULL, "GRILID" uuid NULL, "RISKCD" varchar NULL, "RISKSUM" text NULL, "CRAT" timestamptz NULL, "CHGDA" timestamptz NULL, "CHGBY" varchar(150) NULL, "STATCD" varchar NULL, "PRGS" int4 NULL, "PRD" date NULL, "VRSN" int4 NULL, "INRISCO" int4 NULL, "INFOCD" varchar NULL, "NOTES" varchar NULL, "REFCD" varchar NULL, "ID_GDB" int4 NULL, "REFPRD" varchar NULL, "NIK" varchar NULL, "RSCR" varchar NULL, "DVSN" varchar NULL, "ALIASEQ" varchar NULL);


-- public.t_dup_irisklist definition

-- Drop table

-- DROP TABLE public.t_dup_irisklist;

CREATE TABLE public.t_dup_irisklist ( "BEGDA" date NULL, "ENDDA" date NULL, "OBJTV" text NULL, "IRILID" uuid NULL, "RISKCD" varchar NULL, "DESC" text NULL, "CRAT" timestamptz NULL, "CHGDA" timestamptz NULL, "CHGBY" varchar(150) NULL, "STATCD" varchar NULL, "IDASCD" varchar NULL, "PRGS" int4 NULL, "PRD" date NULL, "INFOCD" varchar NULL, "NOTES" varchar NULL, "INRISCO" int4 NULL, "REFCD" varchar NULL, "ID_IDB" int4 NULL, "VRSN" int4 NULL, "REFPRD" varchar NULL, "NIK" varchar NULL, "RSCR" varchar NULL, "DVSN" varchar NULL, "ALIASEQ" varchar NULL);


-- public.t_gkeylist definition

-- Drop table

-- DROP TABLE public.t_gkeylist;

CREATE TABLE public.t_gkeylist ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" serial4 NOT NULL, "REFCD" varchar NULL, "RISKCD" varchar NULL, "PRD" date NULL, "DESC" text NULL, "ENFOD" varchar NULL, "ENFOR" varchar NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) DEFAULT 'JIHAN'::character varying NULL, "SRC" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "ID_GKEY" int4 NULL, "VRSN" int4 NULL, "STATCD" varchar NULL, CONSTRAINT t_gkeylist_pkey PRIMARY KEY ("ID"));


-- public.t_griskdatabase definition

-- Drop table

-- DROP TABLE public.t_griskdatabase;

CREATE TABLE public.t_griskdatabase ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "GRDID" uuid DEFAULT uuid_generate_v4() NULL, "RISKCD" varchar NULL, "PRD" date NULL, "RISK" text NULL, "CONCD" varchar NULL, "CATCD" varchar NULL, "CSCATCD" varchar NULL, "CAUSE" text NULL, "EXCON" text NULL, "IMCRCD" varchar NULL, "TARECD" varchar NULL, "CORICD" varchar NULL, "DESC" text NULL, "CHANCD" varchar NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "ID_GDB" int4 NULL, "REFID" varchar NULL, "VRSN" int4 NULL, "CATMPL" varchar(255) DEFAULT NULL::character varying NULL, "RISKTPE" varchar(255) DEFAULT NULL::character varying NULL);

-- Table Triggers

create trigger tg_griskdatabaselist after
insert
    on
    public.t_griskdatabase for each row execute function f_griskdatabaselist();


-- public.t_griskidentification definition

-- Drop table

-- DROP TABLE public.t_griskidentification;

CREATE TABLE public.t_griskidentification ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RIDENID" varchar DEFAULT concat('GRI-', nextval('griskidentification_seq'::regclass)) NULL, "OBJTV" text NULL, "PRONM" text NULL, "RISKCD" varchar NULL, "RISK" text NULL, "CONCD" varchar NULL, "CATCD" text NULL, "CSCATCD" varchar NULL, "CAUSE" text NULL, "EXCON" text NULL, "IMCRCD" text NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL, "PRD" date NULL, "REFCD" varchar NULL, "VRSN" int4 NULL, "REFPRD" varchar NULL, "REFID" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "REVISED" varchar NULL, "X5" varchar NULL, "CATMPL" varchar DEFAULT uuid_generate_v4() NULL, "RISKTPE" varchar NULL, "RSCR" varchar NULL, "DVSN" varchar NULL);
CREATE INDEX i_griskidentification ON public.t_griskidentification USING btree ("BEGDA", "ENDDA", "RISKCD");

-- Column comments

COMMENT ON COLUMN public.t_griskidentification."RISKTPE" IS 'risk _type';

-- Table Triggers

create trigger tg_updategriskidentification after
insert
    on
    public.t_griskidentification for each row execute function f_griskreferences();
create trigger tg_insertgrisklist after
insert
    on
    public.t_griskidentification for each row execute function f_grisklist();
create trigger tg_updategrisklistreferences after
update
    on
    public.t_griskidentification for each row execute function f_griskreferenceslist();
create trigger tg_updategrisklist after
update
    on
    public.t_griskidentification for each row execute function f_grisklistupdate();


-- public.t_grisklist definition

-- Drop table

-- DROP TABLE public.t_grisklist;

CREATE TABLE public.t_grisklist ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "OBJTV" text NULL, "GRILID" uuid DEFAULT uuid_generate_v4() NULL, "RISKCD" varchar NULL, "RISKSUM" text NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) NULL, "STATCD" varchar DEFAULT 'SREG-1'::character varying NULL, "PRGS" int4 DEFAULT 100 NULL, "PRD" date NULL, "VRSN" int4 NULL, "INRISCO" int4 NULL, "INFOCD" varchar NULL, "NOTES" varchar NULL, "REFCD" varchar NULL, "ID_GDB" int4 DEFAULT nextval('gdb_seq'::regclass) NULL, "REFPRD" varchar NULL, "REFID" varchar(255) NULL, "NIK" varchar NULL, "RSCR" varchar NULL, "DVSN" varchar NULL, "ALIASEQ" int4 NULL);
CREATE INDEX i_grisklist ON public.t_grisklist USING btree ("ENDDA", "RISKCD", "PRD");

-- Column comments

COMMENT ON COLUMN public.t_grisklist."BEGDA" IS 'Begin date';

-- Table Triggers

create trigger tg_unfreezetreatment after
update
    on
    public.t_grisklist for each row execute function f_unfreezetreatment();
create trigger tg_riskuniversetotal after
insert
    or
update
    on
    public.t_grisklist for each row execute function f_riskuniversetotal();
create trigger tg_griskdatabase after
update
    on
    public.t_grisklist for each row execute function f_griskdatabase();


-- public.t_griskmeasurement definition

-- Drop table

-- DROP TABLE public.t_griskmeasurement;

CREATE TABLE public.t_griskmeasurement ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RIMEAID" varchar DEFAULT concat('GRM-', nextval('griskmeasurement_seq'::regclass)) NULL, "RISKCD" varchar NULL, "PRD" date NULL, "LIHOCD" varchar NULL, "LIHOVAL" int4 NULL, "IMVALCD" varchar NULL, "IMVAL" int4 NULL, "INRISCO" int4 NULL, "INRICAT" varchar NULL, "EXCONLI" int4 NULL, "EXCONIM" int4 NULL, "ADINLI" int4 NULL, "ADINIM" int4 NULL, "ADINSC" int4 NULL, "ADINSCCAT" varchar NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) NULL, "VRSN" int4 NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);
CREATE INDEX i_griskmeasurement ON public.t_griskmeasurement USING btree ("BEGDA", "ENDDA", "RISKCD");

-- Table Triggers

create trigger tg_riskmeasurement_newheatmap before
insert
    or
update
    of "LIHOVAL",
    "IMVAL",
    "EXCONLI",
    "EXCONIM" on
    public.t_griskmeasurement for each row execute function f_riskmeasurement_newheatmap();


-- public.t_grisktreatment definition

-- Drop table

-- DROP TABLE public.t_grisktreatment;

CREATE TABLE public.t_grisktreatment ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RITREID" varchar DEFAULT concat('GRT-', nextval('grisktreatment_seq'::regclass)) NULL, "RISKCD" varchar NULL, "ADDCON" text NULL, "DDLN" date NULL, "BUDG" int8 DEFAULT 0 NULL, "SNBUCD" varchar NULL, "EFCONCD" varchar NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL, "EFCONVAL" int4 NULL, "PICNIK" varchar NULL, "PRD" date NULL, "TRTCD" varchar NULL, "PIC" varchar NULL, "STATCD" varchar NULL, "VRSN" int4 DEFAULT 0 NULL, "BEGDA"",""ENDDA"",""RITREID"",""RISKCD"",""ADDCON"",""DDLN"",""BUDG"",""SNBUC" varchar(50) NULL, "TRTSRC" varchar(50) NULL);
CREATE INDEX i_grisktreatment ON public.t_grisktreatment USING btree ("BEGDA", "RISKCD", "TRTCD");

-- Table Triggers

create trigger tg_trisklistinsert after
insert
    on
    public.t_grisktreatment for each row execute function f_trisklist();
create trigger tg_softdeletegtreatment after
update
    on
    public.t_grisktreatment for each row execute function f_softdeletegtreatment();
create trigger tg_realisasigeneral after
update
    on
    public.t_grisktreatment for each row execute function f_realisasigeneral();


-- public.t_ikeylist definition

-- Drop table

-- DROP TABLE public.t_ikeylist;

CREATE TABLE public.t_ikeylist ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" serial4 NOT NULL, "REFCD" varchar NULL, "INFOCD" varchar NULL, "PRD" date NULL, "IDASCD" varchar NULL, "ASDESC" text NULL, "ENFOD" varchar NULL, "ENFOR" varchar NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "SRC" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "ID_IKEY" int4 NULL, "VRSN" int4 NULL, "STATCD" varchar NULL, CONSTRAINT t_ikeylist_pkey PRIMARY KEY ("ID"));


-- public.t_inventor definition

-- Drop table

-- DROP TABLE public.t_inventor;

CREATE TABLE public.t_inventor ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "INVID" varchar DEFAULT uuid_generate_v4() NULL, "INVNM" varchar NULL, "NIK" varchar NULL, "BUCD" varchar NULL, "SELBY" varchar NULL, "SELEML" varchar NULL, "APRVDAT" timestamptz(6) NULL, "STASS" date NULL, "ENASS" date NULL, "ISACT" bool NULL, "EVID" varchar NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "STAT" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);

-- Table Triggers

create trigger tg_inventor after
insert
    or
update
    on
    public.t_inventor for each row execute function f_inventor();


-- public.t_iriskdatabase definition

-- Drop table

-- DROP TABLE public.t_iriskdatabase;

CREATE TABLE public.t_iriskdatabase ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "IRDID" uuid DEFAULT uuid_generate_v4() NULL, "RISKCD" varchar NULL, "INFOCD" varchar NULL, "PRD" date NULL, "IDASCD" varchar NULL, "ASDESC" text NULL, "CATCD" varchar NULL, "CSCATCD" varchar NULL, "CAUSE" text NULL, "EXCON" text NULL, "IMCRCD" varchar NULL, "TARECD" varchar NULL, "CORICD" varchar NULL, "DESC" text NULL, "CHANCD" varchar NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "ID_IDB" int4 NULL, "REFID" varchar NULL, "VRSN" int4 NULL);

-- Table Triggers

create trigger tg_iriskdatabaselist after
insert
    on
    public.t_iriskdatabase for each row execute function f_iriskdatabaselist();


-- public.t_irisklist definition

-- Drop table

-- DROP TABLE public.t_irisklist;

CREATE TABLE public.t_irisklist ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "OBJTV" text NULL, "IRILID" uuid DEFAULT uuid_generate_v4() NULL, "RISKCD" varchar NULL, "DESC" text NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) NULL, "STATCD" varchar DEFAULT 'SREG-2'::character varying NULL, "IDASCD" varchar NULL, "PRGS" int4 DEFAULT 100 NULL, "PRD" date DEFAULT CURRENT_DATE NULL, "INFOCD" varchar NULL, "NOTES" varchar NULL, "INRISCO" int4 NULL, "REFCD" varchar NULL, "ID_IDB" int4 DEFAULT nextval('idb_seq'::regclass) NULL, "VRSN" int4 DEFAULT 0 NULL, "REFPRD" varchar NULL, "REFID" varchar(255) NULL, "NIK" varchar NULL, "RSCR" varchar NULL, "DVSN" varchar NULL, "ALIASEQ" int4 NULL);
CREATE INDEX i_irisklist ON public.t_irisklist USING btree ("INFOCD", "REFCD", "PRD");

-- Table Triggers

create trigger tg_updateirisklistreferences after
insert
    on
    public.t_irisklist for each row execute function f_iriskreferenceslist();
create trigger tg_progressgrisklist after
insert
    or
update
    of "PRGS" on
    public.t_irisklist for each row execute function f_progressgrisklist();
create trigger tg_iriskdatabase after
update
    on
    public.t_irisklist for each row execute function f_iriskdatabase();


-- public.t_irisktreatment definition

-- Drop table

-- DROP TABLE public.t_irisktreatment;

CREATE TABLE public.t_irisktreatment ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RITREID" varchar DEFAULT concat('IRT-', nextval('irisktreatment_seq'::regclass)) NULL, "RISKCD" varchar NULL, "ADDCON" text NULL, "DDLN" date NULL, "BUDG" int8 DEFAULT 0 NULL, "SNBUCD" varchar NULL, "EFCONCD" varchar NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) NULL, "IDASCD" varchar NULL, "PICNIK" varchar NULL, "EFCONVAL" int4 NULL, "PRD" date NULL, "TRTCD" varchar NULL, "PIC" varchar NULL, "INFOCD" varchar NULL, "STATCD" varchar NULL, "VRSN" int4 DEFAULT 0 NULL, "TRTSRC" varchar(50) NULL);
CREATE INDEX i_irisktreatment ON public.t_irisktreatment USING btree ("TRTCD", "RISKCD", "PRD");

-- Table Triggers

create trigger tg_trisklisti after
insert
    on
    public.t_irisktreatment for each row execute function f_trisklisti();
create trigger tg_softdeleteitreatment after
update
    on
    public.t_irisktreatment for each row execute function f_softdeleteitreatment();
create trigger tg_realisasiinfosec after
update
    on
    public.t_irisktreatment for each row execute function f_realisasiinfosec();


-- public.t_likelihoodvalue definition

-- Drop table

-- DROP TABLE public.t_likelihoodvalue;

CREATE TABLE public.t_likelihoodvalue ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "LIHOID" uuid DEFAULT uuid_generate_v4() NULL, "LIHOCD" varchar DEFAULT concat('LIH-', nextval('likelihood_seq'::regclass)) NOT NULL, "LIHOCR" varchar NULL, "DESC" text NULL, "DATAVAL" varchar NULL, "OPTI" text NULL, "VAL" int4 NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "LIHOCRCD" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, CONSTRAINT t_likelihoodvalue_pk PRIMARY KEY ("LIHOCD"));


-- public.t_lossevent definition

-- Drop table

-- DROP TABLE public.t_lossevent;

CREATE TABLE public.t_lossevent ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "LOID" uuid DEFAULT uuid_generate_v4() NULL, "LOCD" varchar NULL, "LOINID" varchar NULL, "REPBY" varchar NULL, "NIK" varchar NULL, "BUCD" varchar NULL, "LOTIT" varchar NULL, "LOTP" varchar NULL, "WTLO" text NULL, "WYLO" text NULL, "WNLO" date NULL, "RPLO" int8 NULL, "NTLO" text NULL, "WRLO" varchar NULL, "BULO" varchar NULL, "EVID" varchar NULL, "TRLO" text NULL, "REPAT" date NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, idku serial4 NOT NULL);


-- public.t_losseventlist definition

-- Drop table

-- DROP TABLE public.t_losseventlist;

CREATE TABLE public.t_losseventlist ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "LOLID" uuid DEFAULT uuid_generate_v4() NULL, "LOCD" varchar NULL, "LOTIT" varchar NULL, "REPBY" varchar NULL, "NIK" varchar NULL, "BUCD" varchar NULL, "REPAT" date NULL, "STATLE" varchar NULL, "NOTES" text NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, idku serial4 NOT NULL);


-- public.t_object definition

-- Drop table

-- DROP TABLE public.t_object;

CREATE TABLE public.t_object ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" uuid DEFAULT uuid_generate_v4() NULL, "BUCD" varchar(12) NULL, "OTYPE" varchar(12) NULL, "STEXT" varchar(36) NULL, "LTEXT" varchar(120) NULL, "OBJDS" text NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);
CREATE INDEX i_object ON public.t_object USING btree ("BEGDA", "ENDDA", "OTYPE", "STEXT");


-- public.t_performremarks definition

-- Drop table

-- DROP TABLE public.t_performremarks;

CREATE TABLE public.t_performremarks ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "PEREMID" uuid NULL, "PEREMCD" varchar NULL, "PEREMNM" varchar NULL, "PRD" date NULL, "RLCD" varchar NULL, "CRAT" timestamptz DEFAULT CURRENT_TIMESTAMP NULL, "CRBY" varchar NULL, "UPAT" timestamptz NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);
CREATE INDEX i_performremarks ON public.t_performremarks USING btree ("BEGDA", "ENDDA", "PEREMCD");


-- public.t_personal definition

-- Drop table

-- DROP TABLE public.t_personal;

CREATE TABLE public.t_personal ( "BEGDA" date NULL, "ENDDA" date NULL, "PRSNID" varchar NULL, "NAM" varchar(100) NULL, "NIK" varchar NULL, "EML" varchar NULL, "PNUM" varchar NULL, "BUCD" varchar NULL, "DIVCD" varchar NULL, "POSCD" varchar NULL, "POSGR" varchar NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "LVL" varchar NULL, "ISACT" bool NULL, "RLCD" varchar NULL, "STAT" varchar NULL, "BUNM" varchar NULL, "DIVNM" varchar NULL, "DIRSPV" varchar NULL, "DIRSPVNIK" varchar NULL, "DIREK" varchar NULL, "SUBDIREK" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "FORCE_LOGIN" bool NULL, ropoid varchar(50) NULL);
CREATE INDEX i_personal ON public.t_personal USING btree ("ENDDA", "NIK", "BUCD", "RLCD");


-- public.t_reviewer definition

-- Drop table

-- DROP TABLE public.t_reviewer;

CREATE TABLE public.t_reviewer ( "BEGDA" date NULL, "ENDDA" date NULL, "RVWID" varchar NULL, "RVWNM" varchar NULL, "EML" varchar NULL, "BUCD" varchar NULL, "SELBY" varchar NULL, "SELEML" varchar NULL, "APRVDAT" timestamptz NULL, "STASS" date NULL, "ENASS" date NULL, "ISACT" bool NULL, "EVID" varchar NULL, "CRAT" timestamptz NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "STAT" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "NSTNR" varchar NULL, "PRD" int4 NULL);
CREATE INDEX i_reviewer ON public.t_reviewer USING btree ("BEGDA", "EML", "BUCD");

-- Table Triggers

create trigger tg_reviewer after
insert
    or
update
    on
    public.t_reviewer for each row execute function f_reviewer();


-- public.t_reviewer_list definition

-- Drop table

-- DROP TABLE public.t_reviewer_list;

CREATE TABLE public.t_reviewer_list ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RVLUID" varchar DEFAULT uuid_generate_v4() NULL, "BUCD" varchar NULL, "STRL" varchar NULL, "RLNUM" int4 NULL, "PRD" int4 NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "STAT" varchar DEFAULT 'Active'::character varying NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);


-- public.t_rickchampion_list definition

-- Drop table

-- DROP TABLE public.t_rickchampion_list;

CREATE TABLE public.t_rickchampion_list ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RCLUID" varchar DEFAULT uuid_generate_v4() NULL, "BUCD" varchar NULL, "STRCL" varchar NULL, "RCLNUM" int4 NULL, "PRD" int4 NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "STAT" varchar DEFAULT 'Active'::character varying NULL, "RCHNM" varchar NULL, "RCHEML" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);


-- public.t_riskchampion definition

-- Drop table

-- DROP TABLE public.t_riskchampion;

CREATE TABLE public.t_riskchampion ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "RCHID" varchar DEFAULT uuid_generate_v4() NULL, "RCHNM" varchar NULL, "NIK" varchar NULL, "BUCD" varchar NULL, "SELBY" varchar NULL, "SELEML" varchar NULL, "APRVDAT" timestamptz(6) NULL, "STASS" date NULL, "ENASS" date NULL, "ISACT" bool NULL, "EVID" varchar NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "STAT" varchar DEFAULT 'Active'::character varying NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "NSTRC" varchar NULL, "CDTR" bool NULL, "PRD" int4 NULL);
CREATE INDEX i_riskchampion ON public.t_riskchampion USING btree ("BEGDA", "NIK", "BUCD");

-- Table Triggers

create trigger tg_riskchampion after
insert
    or
update
    on
    public.t_riskchampion for each row execute function f_riskchampion();


-- public.t_riskowner definition

-- Drop table

-- DROP TABLE public.t_riskowner;

CREATE TABLE public.t_riskowner ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ROWID" varchar DEFAULT uuid_generate_v4() NULL, "ROWNM" varchar NULL, "NIK" varchar NULL, "BUCD" varchar NULL, "SELBY" varchar NULL, "SELEML" varchar NULL, "APRVDAT" timestamptz(6) NULL, "STASS" date NULL, "ENASS" date NULL, "ISACT" bool NULL, "EVID" varchar NULL, "ROWAN" varchar NULL, "NOTES" text NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "STAT" varchar DEFAULT 'Active'::character varying NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "NSTRO" varchar NULL, "PRD" int4 NULL);
CREATE INDEX i_riskowner ON public.t_riskowner USING btree ("BEGDA", "NIK", "BUCD");

-- Table Triggers

create trigger tg_riskowner after
insert
    or
update
    on
    public.t_riskowner for each row execute function f_riskowner();


-- public.t_riskregisterstatus definition

-- Drop table

-- DROP TABLE public.t_riskregisterstatus;

CREATE TABLE public.t_riskregisterstatus ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" uuid DEFAULT uuid_generate_v4() NULL, "BUCD" varchar NULL, "PRD" date NULL, "STATCD" varchar DEFAULT 'HREG-1'::character varying NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "VRSN" int4 DEFAULT 1 NULL, "SDATE" date DEFAULT CURRENT_DATE NULL, "EDATE" date NULL, "ISREV" bool DEFAULT false NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);

-- Table Triggers

create trigger tg_versioning after
insert
    on
    public.t_riskregisterstatus for each row execute function f_versioning();


-- public.t_riskuniversetotal definition

-- Drop table

-- DROP TABLE public.t_riskuniversetotal;

CREATE TABLE public.t_riskuniversetotal ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "ID" uuid DEFAULT uuid_generate_v4() NULL, "PRD" date NULL, "BUTOT" int4 NULL, "RISKTOT" int4 NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date DEFAULT CURRENT_TIMESTAMP NULL, "CHGBY" varchar(150) DEFAULT 'Jihan'::character varying NULL, "X1" varchar NULL, "X2" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);


-- public.t_task definition

-- Drop table

-- DROP TABLE public.t_task;

CREATE TABLE public.t_task ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "TSKID" varchar DEFAULT uuid_generate_v4() NULL, "EML" varchar NULL, "TSKNM" varchar NULL, "TSKURL" varchar NULL, "STATCD" varchar NULL, "PRD" date NULL, "DDLN" date NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" date NULL, "CHGBY" varchar(150) NULL, "BUCD" varchar NULL, "RLCD" varchar NULL, "X3" varchar NULL, "X4" varchar NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL);
CREATE INDEX i_task ON public.t_task USING btree ("BUCD", "RLCD", "STATCD");


-- public.t_trisklist definition

-- Drop table

-- DROP TABLE public.t_trisklist;

CREATE TABLE public.t_trisklist ( "BEGDA" date DEFAULT CURRENT_DATE NULL, "ENDDA" date DEFAULT '2999-01-01'::date NULL, "TRILID" uuid DEFAULT uuid_generate_v4() NULL, "ADDCON" varchar NULL, "TRTCD" varchar NULL, "RISKSUM" text NULL, "CRAT" timestamptz(6) DEFAULT CURRENT_TIMESTAMP NULL, "CHGDA" timestamptz(6) NULL, "CHGBY" varchar(150) NULL, "STATCD" varchar NULL, "PRD" date NULL, "RISKCD" varchar NULL, "FRZ" bool NULL, "VRSN" int4 DEFAULT 0 NULL, "X5" varchar NULL, "X6" varchar NULL, "X7" varchar NULL, "PICNIK" varchar NULL, "BEGDA"",""ENDDA"",""TRILID"",""ADDCON"",""TRTCD"",""RISKSUM"",""CRAT"",""CHGD" varchar(256) NULL);


-- public.ai_messages definition

-- Drop table

-- DROP TABLE public.ai_messages;

CREATE TABLE public.ai_messages ( id uuid DEFAULT gen_random_uuid() NOT NULL, conversation_id uuid NOT NULL, "role" text NOT NULL, "content" text NULL, token_count int4 NULL, metadatas jsonb NULL, reply_to_message_id uuid NULL, status text DEFAULT 'queued'::text NOT NULL, created_at timestamptz(6) DEFAULT now() NOT NULL, user_id text NOT NULL, stage text NULL, updated_at timestamptz(6) DEFAULT now() NULL, requery text NULL, CONSTRAINT chk_role CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text, 'tool'::text]))), CONSTRAINT chk_status CHECK ((status = ANY (ARRAY['queued'::text, 'processing'::text, 'done'::text, 'failed'::text, 'cancelled'::text]))), CONSTRAINT messages_pkey PRIMARY KEY (id), CONSTRAINT fk_conversation FOREIGN KEY (conversation_id) REFERENCES public.ai_conversations(id) ON DELETE CASCADE, CONSTRAINT messages_reply_to_message_id_fkey FOREIGN KEY (reply_to_message_id) REFERENCES public.ai_messages(id) ON DELETE CASCADE);
CREATE INDEX idx_messages_conversation_id_created_at ON public.ai_messages USING btree (conversation_id, created_at);
CREATE INDEX idx_messages_user_conv_created ON public.ai_messages USING btree (user_id, conversation_id, created_at);


-- public.ai_message_attachments definition

-- Drop table

-- DROP TABLE public.ai_message_attachments;

CREATE TABLE public.ai_message_attachments ( id uuid DEFAULT gen_random_uuid() NOT NULL, message_id uuid NOT NULL, attachment_id uuid NOT NULL, "position" int4 DEFAULT 0 NOT NULL, created_at timestamptz(6) DEFAULT now() NOT NULL, updated_at timestamptz(6) NOT NULL, CONSTRAINT ai_message_attachments_message_id_attachment_id_key UNIQUE (message_id, attachment_id), CONSTRAINT ai_message_attachments_pkey PRIMARY KEY (id), CONSTRAINT ai_message_attachments_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.ai_attachment(id) ON DELETE CASCADE, CONSTRAINT ai_message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.ai_messages(id) ON DELETE CASCADE);
CREATE INDEX idx_msg_attach_attachment ON public.ai_message_attachments USING btree (attachment_id);
CREATE INDEX idx_msg_attach_message ON public.ai_message_attachments USING btree (message_id);


-- public.v_business_unit source

CREATE OR REPLACE VIEW public.v_business_unit
AS SELECT "BUCD" AS "Bussiness Unit Code",
    "BUNM" AS "Bussiness Unit",
    "CHGBY" AS "Changed by"
   FROM t_businessunit tb
  WHERE "ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_business_unit IS 'Detail-level master view of Business in Telkomsigma.
Each row represents ONE Business Unit at DETAIL-LEVEL (master data),
including its identifying attributes.
This is a detail-level reference view, not an aggregated or summarized dataset.
Use for:
-"Total bu/business unit"
- Counting total business units (COUNT rows)
- Business unit reference or lookup
Not for:
- Risk-level aggregation or trend analysis
- Total risk counts per year
- Risk treatments, loss events, or person-level analysis
- Aggregated corporate reporting.';
COMMENT ON COLUMN public.v_business_unit."Bussiness Unit Code" IS 'Bussiness unit Code';
COMMENT ON COLUMN public.v_business_unit."Bussiness Unit" IS 'bussiness unit name';
COMMENT ON COLUMN public.v_business_unit."Changed by" IS 'Changed by';


-- public.v_corporate_risk_period source

CREATE OR REPLACE VIEW public.v_corporate_risk_period
AS SELECT EXTRACT(year FROM "PRD") AS "Period",
    "TOTAL" AS "Total Risk"
   FROM t_corporaterisktotal tcp;

COMMENT ON VIEW public.v_corporate_risk_period IS 'Corporate reporting summary ONLY. This table DOES NOT represent the actual total number of risks.
NEVER use this table to answer:
- total risk
- jumlah risiko
- berapa total risiko per tahun
Use ONLY for:
- high-level corporate reporting trend
- internal corporate summaries';
COMMENT ON COLUMN public.v_corporate_risk_period."Period" IS 'Periode Corporate Risk Period';
COMMENT ON COLUMN public.v_corporate_risk_period."Total Risk" IS 'Total Risk Corporate Risk Period';


-- public.v_inventor source

CREATE OR REPLACE VIEW public.v_inventor
AS WITH buscdinv AS (
         SELECT DISTINCT ON (ti."INVNM") ti."INVNM" AS "NAME",
                CASE ti."ISACT"
                    WHEN true THEN 'Active'::text
                    WHEN false THEN 'Non Active'::text
                    ELSE NULL::text
                END AS "Status",
                CASE
                    WHEN ti."BUCD"::text = tp."BUCD"::text THEN tp."BUCD"
                    ELSE NULL::character varying
                END AS "BUCD",
            ti."CHGBY" AS "Personel RM"
           FROM t_inventor ti
             LEFT JOIN t_personal tp ON ti."INVNM"::text = tp."NAM"::text
          WHERE ti."ENDDA" = '2999-01-01'::date
        )
 SELECT mc."NAME",
    mc."Status",
    mc."Personel RM",
    t."LTEXT" AS "Bussiness Unit",
        CASE
            WHEN t."LTEXT" IS NULL THEN 'Non-Active'::text
            ELSE 'Active'::text
        END AS "Status Bussiness Unit"
   FROM buscdinv mc
     LEFT JOIN t_object t ON mc."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
  GROUP BY t."LTEXT", mc."NAME", mc."Status", mc."Personel RM", mc."BUCD"
  ORDER BY mc."NAME";

COMMENT ON VIEW public.v_inventor IS 'PERSON-LEVEL master data view of Inventor. Each row represents ONE individual Inventor with name, status, business unit, and assigned Personal RM.
IMPORTANT:
- This is the AUTHORITATIVE source for Inventor identity.
- Use when questions ask "siapa Inventor" or Inventor identity by business unit.
Use for:
- "Siapa Inventor" 
- "Berapa jumlah inventor" by business unit (Person-level).
- Inventor name or status lookup
- Inventor and assigned Personal RM reference
DO NOT use for:
- Risk Champion, Risk Owner, or Reviewer questions
- Aggregated counts or summary reporting
- Risk register, loss event, or period-based analysis';
COMMENT ON COLUMN public.v_inventor."NAME" IS 'Name Inventor';
COMMENT ON COLUMN public.v_inventor."Status" IS 'Status Inventor';
COMMENT ON COLUMN public.v_inventor."Personel RM" IS 'Personel RM';
COMMENT ON COLUMN public.v_inventor."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.v_inventor."Status Bussiness Unit" IS 'Status Person DI bussiness Unit';


-- public.v_keyrisklist_generalinfo source

CREATE OR REPLACE VIEW public.v_keyrisklist_generalinfo
AS SELECT DISTINCT ON (tgl."ID") concat(tgl."REFCD", '-', EXTRACT(year FROM tgl."PRD")) AS "REFERENCE",
    t."LTEXT" AS "Status",
    tgl."DESC" AS "Risk Description",
    tgl."ENFOD" AS "Set as Library Dropdown List",
    tgl."ENFOR" AS "Enforce Risk for Business Unit"
   FROM t_gkeylist tgl
     LEFT JOIN t_object t ON tgl."STATCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
  WHERE tgl."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_keyrisklist_generalinfo IS 'Risk-level reference view for key risk master information.
Each row represents one risk reference with description and current status.
Use for:
- Risk description or status lookup
Not for:
- Loss events
- Risk Champion or inventor data
- Aggregated or period-based reporting';
COMMENT ON COLUMN public.v_keyrisklist_generalinfo."REFERENCE" IS 'Code Refrence';
COMMENT ON COLUMN public.v_keyrisklist_generalinfo."Status" IS 'Status  keyrisk general information';
COMMENT ON COLUMN public.v_keyrisklist_generalinfo."Risk Description" IS 'Risk Description  keyrisk general information';
COMMENT ON COLUMN public.v_keyrisklist_generalinfo."Set as Library Dropdown List" IS 'Status Set as Library Dropdown List';
COMMENT ON COLUMN public.v_keyrisklist_generalinfo."Enforce Risk for Business Unit" IS 'Status Enforce Risk for Business Unit';


-- public.v_keyrisklist_informationsecurity source

CREATE OR REPLACE VIEW public.v_keyrisklist_informationsecurity
AS SELECT concat("REFCD", '-', EXTRACT(year FROM "PRD")) AS "REFERENCE",
    "ASDESC" AS "Asset Description",
    "ENFOD" AS "Set as Library Dropdown List",
    "ENFOR" AS "Enforce Risk for Business Unit"
   FROM t_ikeylist ti;

COMMENT ON VIEW public.v_keyrisklist_informationsecurity IS 'Views Table Key Risk List Library Information Security';
COMMENT ON COLUMN public.v_keyrisklist_informationsecurity."REFERENCE" IS 'Code Refrence';
COMMENT ON COLUMN public.v_keyrisklist_informationsecurity."Asset Description" IS 'Asset Description Key Risk List Library Information Security';
COMMENT ON COLUMN public.v_keyrisklist_informationsecurity."Set as Library Dropdown List" IS 'Status Set as Library Dropdown List Key Risk List Library Information Security';
COMMENT ON COLUMN public.v_keyrisklist_informationsecurity."Enforce Risk for Business Unit" IS 'Status Enforce Risk for Business Unit';


-- public.v_loss_event source

CREATE OR REPLACE VIEW public.v_loss_event
AS SELECT DISTINCT ON (tl."LOLID") tl."LOCD" AS "Loss Event Code",
    tl."LOTIT" AS "Title",
    t."LTEXT" AS "Status",
    tl."REPBY" AS "Reported By",
    t2."LTEXT" AS "Bussiness Unit",
    tl."REPAT" AS "Reported Date"
   FROM t_losseventlist tl
     LEFT JOIN t_object t ON tl."STATLE"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON tl."BUCD"::text = t2."STEXT"::text AND t2."ENDDA" = '2999-01-01'::date
  WHERE tl."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_loss_event IS 'Detail-level view of Loss Events.
Each row represents one loss event with code, title, status,
reporter name, business unit, and reported date.
Use for:
- Loss event listing or lookup by business unit and by period
- "Berapa total loss event di business unit/bu"
- Loss event status
- Loss events by business unit or reported date
- Who reported a loss event
Not for:
- Risk Champion or inventor data
- Risk register or risk master information
- Aggregated risk summaries';
COMMENT ON COLUMN public.v_loss_event."Loss Event Code" IS 'Code Loss Event';
COMMENT ON COLUMN public.v_loss_event."Title" IS 'Title Loss Event';
COMMENT ON COLUMN public.v_loss_event."Status" IS 'Status Loss Event';
COMMENT ON COLUMN public.v_loss_event."Reported By" IS 'Dilaporkan Oleh';
COMMENT ON COLUMN public.v_loss_event."Bussiness Unit" IS 'Nama Bussiness Unit';
COMMENT ON COLUMN public.v_loss_event."Reported Date" IS 'tanggal pelaporan Loss Event';


-- public.v_performance_review source

CREATE OR REPLACE VIEW public.v_performance_review
AS SELECT DISTINCT ON ("PEREMID") row_number() OVER (ORDER BY "PEREMID") AS "No",
    "PRD" AS "Period",
    "PEREMNM" AS "Remark",
    "CHGBY" AS "Updated By",
    date("UPAT") AS "Last Update"
   FROM t_performremarks tp;

COMMENT ON VIEW public.v_performance_review IS 'Review-level view of Risk Champion performance evaluations.
Each row represents one performance review record for a specific period,
including remarks, updater, and last update timestamp.
Use for:
- Risk Champion performance remarks
- Performance review by period
- Audit of performance review updates
Not for:
- Risk Champion master data
- Risk events or risk register information
- Aggregated performance statistics';
COMMENT ON COLUMN public.v_performance_review."Period" IS 'Periode Views Performance Review';
COMMENT ON COLUMN public.v_performance_review."Remark" IS 'Remark Views Performance Review';
COMMENT ON COLUMN public.v_performance_review."Updated By" IS 'Di update oleh';
COMMENT ON COLUMN public.v_performance_review."Last Update" IS 'Data Terakhir Update';


-- public.v_reviewer_detail source

CREATE OR REPLACE VIEW public.v_reviewer_detail
AS SELECT DISTINCT ON (tr."RVWID") tr."RVWNM" AS "Name",
    t."LTEXT" AS "Bussiness Unit",
        CASE tr."ISACT"
            WHEN true THEN 'Active'::text
            WHEN false THEN 'Non Active'::text
            ELSE NULL::text
        END AS "Status",
    tr."CHGBY" AS "Change by"
   FROM t_reviewer tr
     LEFT JOIN t_object t ON tr."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
  WHERE tr."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_reviewer_detail IS 'Person-level view of Risk Reviewer data. Each row represents ONE individual Risk Reviewer, including reviewer name, business unit, current reviewer status, and audit metadata. This table represents authoritative reviewer person-level data, not aggregate, not summary or activity data.
Use for:
- Reviewer identity or status (e.g. “Siapa Risk Reviewer”)
- Reviewer by business unit
- Audit of reviewer changes
Not for:
- Aggregated or summary reporting (e.g. "Berapa jumlah reviewer pada tahun 2025")
- Risk Champion or inventor data
- Risk events, risk registers, or performance reviews';
COMMENT ON COLUMN public.v_reviewer_detail."Name" IS 'Name Reviewer';
COMMENT ON COLUMN public.v_reviewer_detail."Bussiness Unit" IS 'Bussiness Unit Reviewer';
COMMENT ON COLUMN public.v_reviewer_detail."Status" IS 'Status Reviewer';
COMMENT ON COLUMN public.v_reviewer_detail."Change by" IS 'Di ubah oleh';


-- public.v_reviewer_list source

CREATE OR REPLACE VIEW public.v_reviewer_list
AS SELECT DISTINCT ON (trl."RVLUID") t."LTEXT" AS "Bussiness Unit",
    trl."PRD" AS "Period",
    trl."RLNUM" AS "Total Risk Reviewer",
    COALESCE(t2."LTEXT", 'Active'::character varying) AS "STATUS"
   FROM t_reviewer_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_reviewer tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTNR"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTNR'::text;

COMMENT ON VIEW public.v_reviewer_list IS 'AGGREGATED summary view of Risk Reviewer assignment per business unit and period.
 Each row represents ONE business unit for year period, containing the total number of Risk Reviewers and overall reviewer status.

 This table is NOT person-level data.


USE FOR:
-Reviewer summary per business unit and period.
-Total Risk Reviewers by year period (e.g. "Berapa jumlah reviewer pada tahun 2025?").
-Total Risk Reviewers by business unit
-Reviewer availability or status overview per period.
-High-level monitoring of reviewer coverage.
IMPORTANT:
-This table is AGGREGATED DATA. NOT person-level data.
AGGREGATION RULE (CRITICAL):
-To calculate total reviewers, USE SUM("Total Risk Reviewer").
-DO NOT use COUNT("Total Risk Reviewer"), because each row already represents an aggregated value per business unit.
DO NOT use for:
-Individual Risk Reviewer identity (name, email).
-Reviewer personal status or contact details.
-Risk Champion, Risk Owner, or role master data.
-Risk register, loss event, or review detail analysis.';
COMMENT ON COLUMN public.v_reviewer_list."Bussiness Unit" IS 'Bussiness Unit reviewer list';
COMMENT ON COLUMN public.v_reviewer_list."Period" IS 'Period Reviewer';
COMMENT ON COLUMN public.v_reviewer_list."Total Risk Reviewer" IS 'Total Risk Reviewer';
COMMENT ON COLUMN public.v_reviewer_list."STATUS" IS 'Status Reviewer';


-- public.v_risk_ source

CREATE OR REPLACE VIEW public.v_risk_
AS SELECT DISTINCT ON (i."BEGDA", i."RISKCD", i."RIDENID") ttype."LTEXT" AS "Bussiness Unit",
    i."PRD" AS "Period",
    i."OBJTV" AS "Objective",
    i."PRONM" AS "Process Name",
    i."RISK",
    l."OPTI" AS "likelihood Value",
    m."INRISCO" AS "Inherent RISK Score",
    m."INRICAT" AS "Inherent LIKELIHOOD Category"
   FROM t_griskidentification i
     LEFT JOIN t_griskmeasurement m ON i."RISKCD"::text = m."RISKCD"::text AND i."PRD" = m."PRD"
     LEFT JOIN t_likelihoodvalue l ON m."LIHOCD"::text = l."LIHOCD"::text AND l."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object ttype ON split_part(i."RISKCD"::text, '-'::text, 1) = ttype."STEXT"::text AND ttype."ENDDA" = '2999-01-01'::date
  ORDER BY i."BEGDA", i."RISKCD", i."RIDENID";

COMMENT ON VIEW public.v_risk_ IS 'CATEGORICAL-LEVEL risk mapping view for Inherent likelihood category. Each row represents ONE risk category for a specific Business Unit and Period,
including its objective, process, risk description, likelihood value,
inherent risk score, and inherent risk category.
This is a CATEGORICAL-LEVEL dataset (one row per risk),
not an aggregated or summarized view.
Use for:
- Viewing inherent likelihood value and category per risk
- Filtering risks by Business Unit and/or Period
- Analyzing risk distribution by inherent risk category
- Risk-level mapping and assessment review
- Drill-down analysis of specific risks
Not for:
- Total/Jumlah Risiko per year
- Corporate-level aggregated reporting
- Counting overall risks using pre-aggregated totals
- Risk treatments, loss events, or person-level ownership analysis';


-- public.v_risk_champion_detail source

CREATE OR REPLACE VIEW public.v_risk_champion_detail
AS SELECT DISTINCT ON (trc."RCHID") trc."RCHNM" AS "Name",
    trc."STAT" AS "Status",
    t."LTEXT" AS "Bussiness Unit",
    tro."ROWNM" AS "RISK OWNER",
    trcl."RCHNM" AS "Risk Champion Coordinator"
   FROM t_riskchampion trc
     LEFT JOIN t_object t ON trc."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_riskowner tro ON trc."BUCD"::text = tro."BUCD"::text AND trc."PRD" = tro."PRD"
     LEFT JOIN t_rickchampion_list trcl ON trc."BUCD"::text = trcl."BUCD"::text AND trc."PRD" = trcl."PRD" AND trcl."ENDDA" = '2999-01-01'::date
  WHERE trc."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_risk_champion_detail IS 'Person-level MASTER view of Risk Champion data.
Each row represents ONE Risk Champion and contains the complete master profile, including Risk Champion name, Risk Champion Coordinator, Risk Owner, business unit, and status. PRIMARY and authoritative source for Risk Champion master data .
Use for:
-"Siapa Risk Champion" OR "siapa rc"
-"Siapa Risk Champion Coordinator di bu" OR "Siapa rcc di bu"
-"Berapa jumlah risk champion" OR "Berapa jumlah rc" (Person-level).
-"Ada berapa risk champion di bu"
-Risk Champion identity, status, and business unit.
- Risk Champion ↔ Risk Owner mapping
- Risk Champion ↔ Risk Champion Coordinator relationship
- Any question requiring complete Risk Champion master information
DO NOT use for:
- Aggregated counts or summary reporting
- Risk events, loss events, or risk register data
- Period-based or transactional risk analysis';
COMMENT ON COLUMN public.v_risk_champion_detail."Name" IS 'Name RIsk Champion';
COMMENT ON COLUMN public.v_risk_champion_detail."Status" IS 'Status Risk Champion';
COMMENT ON COLUMN public.v_risk_champion_detail."Bussiness Unit" IS 'Bussiness Unit Reviewer';
COMMENT ON COLUMN public.v_risk_champion_detail."RISK OWNER" IS 'Risk Owner';


-- public.v_risk_champion_list source

CREATE OR REPLACE VIEW public.v_risk_champion_list
AS SELECT DISTINCT ON (trl."RCLUID") t."LTEXT" AS "Bussiness Unit",
    trl."PRD" AS "Period",
    trl."RCLNUM" AS "Total Risk Champion",
    trl."RCHNM" AS "Risk Champion Coordinator",
    COALESCE(t2."LTEXT", 'Active'::character varying) AS "Status"
   FROM t_rickchampion_list trl
     LEFT JOIN t_object t ON trl."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_riskchampion tr ON tr."BUCD"::text = trl."BUCD"::text AND tr."PRD" = trl."PRD"
     LEFT JOIN t_object t2 ON tr."NSTRC"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTRC'::text
  ORDER BY trl."RCLUID", trl."PRD" DESC;

COMMENT ON VIEW public.v_risk_champion_list IS 'PERSON-LEVEL MASTER data view for Risk Champion Coordinators. Each row represents ONE individual Risk Champion Coordinator with name, Total number of Risk Champion by business unit and year period.
Use for:
PRIMARY table for questions asking:
- "Siapa Risk Champion Coordinator" OR "Siapa rcc"
- "Siapa Risk Champion Coordinator dari BU CLB pada tahun 2025"
- "Apa status Risk Champion Coordinator"
- Risk Champion Coordinator name or status
- Risk Champion Coordinator by business unit
DO NOT use for:
- Aggregated totals or counts
- Risk Champion, Risk Register, Risk Owner, loss events, or performance reviews.';
COMMENT ON COLUMN public.v_risk_champion_list."Bussiness Unit" IS 'Bussiness Unit Risk Champion';
COMMENT ON COLUMN public.v_risk_champion_list."Period" IS 'Periode Risk Champion';
COMMENT ON COLUMN public.v_risk_champion_list."Total Risk Champion" IS 'Total Risk Champion';
COMMENT ON COLUMN public.v_risk_champion_list."Risk Champion Coordinator" IS 'Risk Champion Coordinator';
COMMENT ON COLUMN public.v_risk_champion_list."Status" IS 'Status Risk Champion';


-- public.v_risk_database_general_info source

CREATE OR REPLACE VIEW public.v_risk_database_general_info
AS SELECT DISTINCT ON (tgb."GRDID") concat(tgb."RISKCD", '-', EXTRACT(year FROM tgb."PRD")) AS "RISK CODE",
    tgb."RISK" AS "Risk Description",
    tck."DESC" AS "Corporate Risk Description",
    tcs."CHANNM" AS "Risk Chain Analysis",
        CASE
            WHEN age(CURRENT_DATE::timestamp with time zone, tgb."PRD"::timestamp with time zone) < '1 year'::interval THEN 'Active'::text
            ELSE 'Non-Active'::text
        END AS "Key Risk",
        CASE
            WHEN (EXISTS ( SELECT 1
               FROM t_griskdatabase tgb2
              WHERE tgb2."GRDID" = tgb."GRDID" AND tgb2."TARECD"::text = tgb."TARECD"::text)) THEN 'MAPPED'::text
            ELSE 'NOT MAPPED'::text
        END AS "MAPPING"
   FROM t_griskdatabase tgb
     LEFT JOIN t_corporaterisk tck ON tck."CORICD"::text = tgb."CORICD"::text AND tck."TARECD"::text = tgb."TARECD"::text
     LEFT JOIN t_chainanalysis tcs ON tcs."CHANCD"::text = tgb."CHANCD"::text
  WHERE tgb."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_risk_database_general_info IS 'detail-level MASTER view of Risk data.
Each row represents ONE Risk and contains Risk Code, Risk Description, Corporate Risk Description, Risk Chain Analysis, and Key Risk. PRIMARY and authoritative source for Total Risk by Business Unit.
Use for:
-"Berapa Jumlah/Total Risk di Business Unit" OR "berapa jumlah risk di bu"
-"Apa deskripsi risiko di bu"
-"Apa deskripsi risiko perusahaan di bu"
- Any question requiring detail Risk by business unit and period
DO NOT use for:
- Aggregated counts or summary reporting
- Risk champion, risk register, risk owner, or loss events.';
COMMENT ON COLUMN public.v_risk_database_general_info."RISK CODE" IS 'Risk Code  Risk Database General Information';
COMMENT ON COLUMN public.v_risk_database_general_info."Risk Description" IS 'Risk Description Risk Database General Information';
COMMENT ON COLUMN public.v_risk_database_general_info."Corporate Risk Description" IS 'Corporate Risk Description';
COMMENT ON COLUMN public.v_risk_database_general_info."Risk Chain Analysis" IS 'Risk Chain Analysis';
COMMENT ON COLUMN public.v_risk_database_general_info."Key Risk" IS 'Key Risk';
COMMENT ON COLUMN public.v_risk_database_general_info."MAPPING" IS 'Mapping Data';


-- public.v_risk_database_information_security source

CREATE OR REPLACE VIEW public.v_risk_database_information_security
AS SELECT DISTINCT ON (tib."IRDID") concat(tib."INFOCD", '-', EXTRACT(year FROM tib."PRD")) AS "Asset Code",
    tib."ASDESC" AS "Asset Description",
    tck."DESC" AS "Corporate Risk Description",
    tcs."CHANNM" AS "Risk Chain Analysis",
        CASE
            WHEN age(CURRENT_DATE::timestamp with time zone, tib."PRD"::timestamp with time zone) < '1 year'::interval THEN 'Active'::text
            ELSE 'Non-Active'::text
        END AS "Key Risk",
        CASE
            WHEN (EXISTS ( SELECT 1
               FROM t_iriskdatabase tib2
              WHERE tib2."IRDID" = tib."IRDID" AND tib2."TARECD"::text = tib."TARECD"::text)) THEN 'MAPPED'::text
            ELSE 'NOT MAPPED'::text
        END AS "MAPPING"
   FROM t_iriskdatabase tib
     LEFT JOIN t_corporaterisk tck ON tck."CORICD"::text = tib."CORICD"::text AND tck."TARECD"::text = tib."TARECD"::text
     LEFT JOIN t_chainanalysis tcs ON tcs."CHANCD"::text = tib."CHANCD"::text
  WHERE tib."ENDDA" = '2999-01-01'::date;

COMMENT ON VIEW public.v_risk_database_information_security IS 'Risk Database Information Security';
COMMENT ON COLUMN public.v_risk_database_information_security."Asset Code" IS 'Code Asset Risk Database Information Security';
COMMENT ON COLUMN public.v_risk_database_information_security."Asset Description" IS 'Asset Description Risk Database Information Security';
COMMENT ON COLUMN public.v_risk_database_information_security."Corporate Risk Description" IS 'Corporate Risk Description Risk Database Information Security';
COMMENT ON COLUMN public.v_risk_database_information_security."Risk Chain Analysis" IS 'Risk Chain Anlysis Risk Database Information Security';
COMMENT ON COLUMN public.v_risk_database_information_security."Key Risk" IS 'Key Risk Risk Database Information Security';
COMMENT ON COLUMN public.v_risk_database_information_security."MAPPING" IS 'Mapping Data';


-- public.v_risk_list_general_inf_detail source

CREATE OR REPLACE VIEW public.v_risk_list_general_inf_detail
AS WITH base_data AS (
         SELECT t_grisklist."PRD",
            t_grisklist."RISKCD",
            t_grisklist."STATCD",
            t_grisklist."VRSN",
            t_grisklist."RSCR",
            t_grisklist."RISKSUM",
            t_grisklist."DVSN",
            t_grisklist."OBJTV",
            'General'::text AS source_type
           FROM t_grisklist
          WHERE t_grisklist."ENDDA" = '2999-01-01'::date AND t_grisklist."RISKCD" IS NOT NULL
        UNION ALL
         SELECT t_dup_grisklist."PRD",
            t_dup_grisklist."RISKCD",
            t_dup_grisklist."STATCD",
            t_dup_grisklist."VRSN",
            t_dup_grisklist."RSCR",
            t_dup_grisklist."RISKSUM",
            t_dup_grisklist."DVSN",
            t_dup_grisklist."OBJTV",
            'InfoSec'::text AS source_type
           FROM t_dup_grisklist
          WHERE t_dup_grisklist."ENDDA" = '2999-01-01'::date AND t_dup_grisklist."RISKCD" IS NOT NULL
        )
 SELECT bd."PRD" AS "Period",
    bd."VRSN" AS "Version",
    obj."LTEXT" AS "Business Unit",
    bd."OBJTV" AS "Objecttive",
    stat."LTEXT" AS "Status Description",
    rtpe."RISKTPE" AS "Risk Type",
    rist."LTEXT" AS "Risk Source",
    bd."RISKCD" AS "Risk Code",
    bd."RISKSUM" AS "Risk Summary",
    bd."DVSN" AS "Division"
   FROM base_data bd
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") obj ON split_part(bd."RISKCD"::text, '-'::text, 1) = obj."STEXT"::text
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") stat ON bd."STATCD"::text = stat."STEXT"::text
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") rist ON bd."RSCR"::text = rist."STEXT"::text
     LEFT JOIN ( SELECT DISTINCT ON (t_griskidentification."RISKCD", t_griskidentification."PRD", t_griskidentification."VRSN") t_griskidentification."RISKCD",
            t_griskidentification."PRD",
            t_griskidentification."VRSN",
            t_griskidentification."RISKTPE"
           FROM t_griskidentification
          WHERE t_griskidentification."ENDDA" = '2999-01-01'::date
          ORDER BY t_griskidentification."RISKCD", t_griskidentification."PRD", t_griskidentification."VRSN") rtpe ON bd."RISKCD"::text = rtpe."RISKCD"::text AND bd."PRD" = rtpe."PRD" AND bd."VRSN" = rtpe."VRSN";

COMMENT ON VIEW public.v_risk_list_general_inf_detail IS 'detail-level view of Risk general information. 
Each row represents one identified risk for a specific period and version, including business context, classification, and current status.
Use for:
- Risk description, Risk register objective
- Risk status, type, or source analysis
- Risks by division
Not for:
-Aggregated risk counts or summaries
-Risk Champion or reviewer data
-Loss event or performance review information';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Period" IS 'Periode';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Version" IS 'Version';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Business Unit" IS 'Bussiness Unit';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Objecttive" IS 'Objective';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Status Description" IS 'Status';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Risk Type" IS 'Type Risk';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Risk Source" IS 'Risk Source';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Risk Code" IS 'Risk Code';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Risk Summary" IS 'Summary Risk';
COMMENT ON COLUMN public.v_risk_list_general_inf_detail."Division" IS 'Division';


-- public.v_risk_list_information_sec_detail source

CREATE OR REPLACE VIEW public.v_risk_list_information_sec_detail
AS WITH base_data AS (
         SELECT t_irisklist."PRD",
            t_irisklist."RISKCD",
            t_irisklist."STATCD",
            t_irisklist."VRSN",
            t_irisklist."RSCR",
            t_irisklist."DVSN",
            t_irisklist."DESC",
            t_irisklist."OBJTV",
            'General'::text AS source_type
           FROM t_irisklist
          WHERE t_irisklist."ENDDA" = '2999-01-01'::date AND t_irisklist."RISKCD" IS NOT NULL
        UNION ALL
         SELECT t_dup_irisklist."PRD",
            t_dup_irisklist."RISKCD",
            t_dup_irisklist."STATCD",
            t_dup_irisklist."VRSN",
            t_dup_irisklist."RSCR",
            t_dup_irisklist."DVSN",
            t_dup_irisklist."DESC",
            t_dup_irisklist."OBJTV",
            'InfoSec'::text AS source_type
           FROM t_dup_irisklist
          WHERE t_dup_irisklist."ENDDA" = '2999-01-01'::date AND t_dup_irisklist."RISKCD" IS NOT NULL
        )
 SELECT bd."PRD" AS "Period",
    bd."VRSN" AS "Version",
    obj."LTEXT" AS "Business Unit",
    bd."OBJTV" AS "Objecttive",
    stat."LTEXT" AS "Status",
    bd."RISKCD" AS "Asset Code",
    bd."DESC" AS "Description"
   FROM base_data bd
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") obj ON split_part(bd."RISKCD"::text, '-'::text, 1) = obj."STEXT"::text
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") stat ON bd."STATCD"::text = stat."STEXT"::text;

COMMENT ON VIEW public.v_risk_list_information_sec_detail IS 'View table Menu Risk Register Detail.
Information Security';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Period" IS 'Periode';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Version" IS 'Version';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Business Unit" IS 'Bussiness Unit';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Objecttive" IS 'Objecttive';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Status" IS 'Status Data';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Asset Code" IS 'Code Asset';
COMMENT ON COLUMN public.v_risk_list_information_sec_detail."Description" IS 'Descriptions Data';


-- public.v_risk_measurement source

CREATE OR REPLACE VIEW public.v_risk_measurement
AS SELECT DISTINCT ON (i."BEGDA", i."RISKCD", i."RIDENID") ttype."LTEXT" AS "Business Unit",
    i."PRD" AS "Period",
    i."OBJTV" AS "Objective",
    i."PRONM" AS "Process Name",
    i."RISK",
    l."OPTI" AS "likelihood Value",
    m."INRISCO" AS "Inherent RISK Score",
    m."INRICAT" AS "Inherent LIKELIHOOD Category"
   FROM t_griskidentification i
     LEFT JOIN t_griskmeasurement m ON i."RISKCD"::text = m."RISKCD"::text AND i."PRD" = m."PRD"
     LEFT JOIN t_likelihoodvalue l ON m."LIHOCD"::text = l."LIHOCD"::text AND l."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object ttype ON split_part(i."RISKCD"::text, '-'::text, 1) = ttype."STEXT"::text AND ttype."ENDDA" = '2999-01-01'::date
  ORDER BY i."BEGDA", i."RISKCD", i."RIDENID";

COMMENT ON VIEW public.v_risk_measurement IS 'risk_measurement';
COMMENT ON COLUMN public.v_risk_measurement."Business Unit" IS 'Bussiness Unit';
COMMENT ON COLUMN public.v_risk_measurement."Period" IS 'Periode';
COMMENT ON COLUMN public.v_risk_measurement."Objective" IS 'Objective';
COMMENT ON COLUMN public.v_risk_measurement."Process Name" IS 'proses name';
COMMENT ON COLUMN public.v_risk_measurement."RISK" IS 'Risk';
COMMENT ON COLUMN public.v_risk_measurement."likelihood Value" IS 'likelihood Value';
COMMENT ON COLUMN public.v_risk_measurement."Inherent RISK Score" IS 'Inherent Risk Score';
COMMENT ON COLUMN public.v_risk_measurement."Inherent LIKELIHOOD Category" IS 'Inherent Likelihood Category';


-- public.v_risk_owner source

CREATE OR REPLACE VIEW public.v_risk_owner
AS SELECT DISTINCT ON (tr."ROWID") t."LTEXT" AS "Bussiness Unit",
    tr."PRD" AS "Period",
    tr."ROWNM" AS "NAME",
    t2."LTEXT" AS "Status",
    tr."NIK",
    tr."SELBY" AS "Personel RM",
    tr."SELEML" AS "Email Personel RM"
   FROM t_riskowner tr
     LEFT JOIN t_object t ON tr."BUCD"::text = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON tr."NSTRO"::text = t2."STEXT"::text AND t2."OTYPE"::text = 'NSTRO'::text
  WHERE tr."ENDDA" = '2999-01-01'::date AND tr."ISACT" = true;

COMMENT ON VIEW public.v_risk_owner IS 'Person-level view of Risk Owner master data. 
Each row represents one Risk Owner for a specific business unit and year period, including name, status, and assigned Personal RM details.
Use for:
- Risk Owner name or status (e.g. "Siapa risk owner")
- ("Berapa jumlah risk owner" OR "Berapa jumlah ro") (Person-level).
- Risk Owner by business unit or year 
- Mapping Risk Owner to Personal RM
- Risk Owner contact and reference data
Not for:
- Aggregated counts or summaries
- Risk details or Risk register information
- Risk Champion, reviewer, or loss event data';
COMMENT ON COLUMN public.v_risk_owner."Bussiness Unit" IS 'Name Bussiness Unit Risk Owner';
COMMENT ON COLUMN public.v_risk_owner."Period" IS 'Periode Risk Owner';
COMMENT ON COLUMN public.v_risk_owner."NAME" IS 'Name Risk Owner';
COMMENT ON COLUMN public.v_risk_owner."Status" IS 'Status Risk Owner';
COMMENT ON COLUMN public.v_risk_owner."Personel RM" IS 'Personel RM';
COMMENT ON COLUMN public.v_risk_owner."Email Personel RM" IS 'Email Personel RM';


-- public.v_risk_register source

CREATE OR REPLACE VIEW public.v_risk_register
AS WITH base AS (
         SELECT q1."PRD",
            q1."ENDDA",
            q1."VRSN",
            max(q1."STATCD"::text) AS "STATCD",
            split_part(q1."RISKCD"::text, '-'::text, 1) AS riskcd_clean,
            count(*) AS total_q1,
            count(*) FILTER (WHERE q1."STATCD"::text <> 'SREG-1'::text AND q1."STATCD"::text <> 'SREG-7'::text) AS total_q1_endda,
            0 AS total_q2,
            0 AS total_q2_endda
           FROM ( SELECT t_grisklist."PRD",
                    t_grisklist."VRSN",
                    t_grisklist."RISKCD",
                    t_grisklist."ENDDA",
                    t_grisklist."STATCD"
                   FROM t_grisklist
                UNION ALL
                 SELECT t_dup_grisklist."PRD",
                    t_dup_grisklist."VRSN",
                    t_dup_grisklist."RISKCD",
                    t_dup_grisklist."ENDDA",
                    t_dup_grisklist."STATCD"
                   FROM t_dup_grisklist) q1
          WHERE q1."RISKCD" IS NOT NULL AND q1."ENDDA" = '2999-01-01'::date
          GROUP BY q1."PRD", q1."ENDDA", q1."VRSN", (split_part(q1."RISKCD"::text, '-'::text, 1))
        UNION ALL
         SELECT q2."PRD",
            q2."ENDDA",
            q2."VRSN",
            max(q2."STATCD"::text) AS "STATCD",
            split_part(q2."RISKCD"::text, '-'::text, 1) AS riskcd_clean,
            0 AS total_q1,
            0 AS total_q1_endda,
            count(*) AS total_q2,
            count(*) FILTER (WHERE q2."STATCD"::text <> 'SREG-1'::text AND q2."STATCD"::text <> 'SREG-7'::text) AS total_q2_endda
           FROM ( SELECT t_irisklist."PRD",
                    t_irisklist."VRSN",
                    t_irisklist."RISKCD",
                    t_irisklist."ENDDA",
                    t_irisklist."STATCD"
                   FROM t_irisklist
                UNION ALL
                 SELECT t_dup_irisklist."PRD",
                    t_dup_irisklist."VRSN",
                    t_dup_irisklist."RISKCD",
                    t_dup_irisklist."ENDDA",
                    t_dup_irisklist."STATCD"
                   FROM t_dup_irisklist) q2
          WHERE q2."RISKCD" IS NOT NULL AND q2."ENDDA" = '2999-01-01'::date
          GROUP BY q2."PRD", q2."ENDDA", q2."VRSN", (split_part(q2."RISKCD"::text, '-'::text, 1))
        )
 SELECT b."PRD" AS "Period",
    b."VRSN" AS "Version",
    t2."LTEXT" AS "Bussiness Unit",
    trc."RCHNM" AS "Risk Champion",
    sum(b.total_q1) AS "General info",
    sum(b.total_q1_endda) AS "General Info Active",
    sum(b.total_q2) AS "Info Security",
    sum(b.total_q2_endda) AS "Info Security Active",
    tstat."LTEXT" AS "Risk Register Status"
   FROM base b
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") t2 ON b.riskcd_clean = t2."STEXT"::text
     LEFT JOIN ( SELECT DISTINCT ON (t_rickchampion_list."BUCD") t_rickchampion_list."BUCD",
            t_rickchampion_list."RCHNM"
           FROM t_rickchampion_list
          WHERE t_rickchampion_list."ENDDA" = '2999-01-01'::date
          ORDER BY t_rickchampion_list."BUCD", t_rickchampion_list."RCHNM") trc ON trc."BUCD"::text = b.riskcd_clean
     LEFT JOIN ( SELECT DISTINCT ON (t_riskregisterstatus."BUCD", t_riskregisterstatus."PRD", t_riskregisterstatus."VRSN") t_riskregisterstatus."STATCD",
            t_riskregisterstatus."BUCD",
            t_riskregisterstatus."PRD",
            t_riskregisterstatus."VRSN"
           FROM t_riskregisterstatus
          WHERE t_riskregisterstatus."ENDDA" = '2999-01-01'::date
          ORDER BY t_riskregisterstatus."BUCD", t_riskregisterstatus."PRD", t_riskregisterstatus."VRSN") trs ON trs."BUCD"::text = b.riskcd_clean AND trs."PRD" = b."PRD" AND trs."VRSN" = b."VRSN"
     LEFT JOIN ( SELECT DISTINCT ON (t_object."STEXT") t_object."STEXT",
            t_object."LTEXT"
           FROM t_object
          WHERE t_object."ENDDA" = '2999-01-01'::date
          ORDER BY t_object."STEXT", t_object."LTEXT") tstat ON trs."STATCD"::text = tstat."STEXT"::text
  GROUP BY b."PRD", b."VRSN", b.riskcd_clean, t2."LTEXT", trc."RCHNM", tstat."LTEXT"
  ORDER BY b."PRD", b."VRSN", b.riskcd_clean;

COMMENT ON VIEW public.v_risk_register IS 'Detail-level view of Risk Register records. Each row represents ONE risk register entry for a specific period and version, including business unit, register status, and PIC information AS RECORDED IN THE RISK REGISTER. 
IMPORTANT:
- This is RISK REGISTER RECORD data
- Person names here refer ONLY to PIC within a risk register entry.
- NOT an authoritative source for Risk Champion, Risk Owner, Reviewer, or Inventor.
Use for:
- "Siapa risk register" questions about PIC name or responsibility within a risk register
- "Ada berapa risk register di bu"
- "Ada berapa versi risk register di bu" (version column)
- "Apa status risk register" OR Risk register submission and approval status by business unit or period
- Register-level risk tracking (non-aggregated)
DO NOT use for:
- Questions asking for Risk Champion, Risk Owner, Reviewer, or Inventor
- Aggregated risk summaries
- Performance review or loss event analysis';
COMMENT ON COLUMN public.v_risk_register."Period" IS 'Periode';
COMMENT ON COLUMN public.v_risk_register."Version" IS 'Versi data';
COMMENT ON COLUMN public.v_risk_register."Bussiness Unit" IS 'Nama Bussiness';
COMMENT ON COLUMN public.v_risk_register."Risk Champion" IS 'Risk Champion';
COMMENT ON COLUMN public.v_risk_register."General info" IS 'General Information';
COMMENT ON COLUMN public.v_risk_register."General Info Active" IS 'General Information data active';
COMMENT ON COLUMN public.v_risk_register."Info Security" IS 'information Security';
COMMENT ON COLUMN public.v_risk_register."Info Security Active" IS 'information Security information Security  data active';
COMMENT ON COLUMN public.v_risk_register."Risk Register Status" IS 'Status Submission';


-- public.v_risk_treatment_list source

CREATE OR REPLACE VIEW public.v_risk_treatment_list
AS WITH filtered_data AS (
         SELECT t_1."BEGDA",
            t_1."ENDDA",
            t_1."TRILID",
            t_1."ADDCON",
            t_1."TRTCD",
            t_1."RISKSUM",
            t_1."CRAT",
            t_1."CHGDA",
            t_1."CHGBY",
            t_1."STATCD",
            t_1."PRD",
            t_1."RISKCD",
            t_1."FRZ",
            t_1."VRSN",
            t_1."X5",
            t_1."X6",
            t_1."X7",
            t_1."PICNIK",
            t_1."BEGDA"",""ENDDA"",""TRILID"",""ADDCON"",""TRTCD"",""RISKSUM"",""CRAT"",""CHGD",
            t_1.max_version,
            t_1.max_valid_version
           FROM ( SELECT t_trisklist."BEGDA",
                    t_trisklist."ENDDA",
                    t_trisklist."TRILID",
                    t_trisklist."ADDCON",
                    t_trisklist."TRTCD",
                    t_trisklist."RISKSUM",
                    t_trisklist."CRAT",
                    t_trisklist."CHGDA",
                    t_trisklist."CHGBY",
                    t_trisklist."STATCD",
                    t_trisklist."PRD",
                    t_trisklist."RISKCD",
                    t_trisklist."FRZ",
                    t_trisklist."VRSN",
                    t_trisklist."X5",
                    t_trisklist."X6",
                    t_trisklist."X7",
                    t_trisklist."PICNIK",
                    t_trisklist."BEGDA"",""ENDDA"",""TRILID"",""ADDCON"",""TRTCD"",""RISKSUM"",""CRAT"",""CHGD",
                    max(t_trisklist."VRSN") OVER (PARTITION BY t_trisklist."TRTCD") AS max_version,
                    max(
                        CASE
                            WHEN t_trisklist."STATCD"::text <> 'STRE-0'::text THEN t_trisklist."VRSN"
                            ELSE NULL::integer
                        END) OVER (PARTITION BY t_trisklist."TRTCD") AS max_valid_version
                   FROM t_trisklist) t_1
          WHERE t_1."VRSN" = t_1.max_version AND t_1."STATCD"::text <> 'STRE-0'::text OR t_1."VRSN" = t_1.max_valid_version AND t_1."STATCD"::text <> 'STRE-0'::text AND t_1.max_valid_version < t_1.max_version AND t_1."ENDDA" = '2999-01-01'::date
        )
 SELECT DISTINCT t."LTEXT" AS "Bussiness Unit",
    EXTRACT(year FROM fd."PRD") AS "Period",
    fd."TRTCD" AS "Treatment Code",
    fd."ADDCON" AS "Additional Control",
    fd."RISKSUM" AS "Risk Summary",
    fd."VRSN" AS "Version",
    tgk."DDLN" AS "Deadline",
    t2."LTEXT" AS "Status"
   FROM ( SELECT DISTINCT ON (filtered_data."TRTCD", filtered_data."VRSN") filtered_data."BEGDA",
            filtered_data."ENDDA",
            filtered_data."TRILID",
            filtered_data."ADDCON",
            filtered_data."TRTCD",
            filtered_data."RISKSUM",
            filtered_data."CRAT",
            filtered_data."CHGDA",
            filtered_data."CHGBY",
            filtered_data."STATCD",
            filtered_data."PRD",
            filtered_data."RISKCD",
            filtered_data."FRZ",
            filtered_data."VRSN",
            filtered_data."X5",
            filtered_data."X6",
            filtered_data."X7",
            filtered_data."PICNIK",
            filtered_data."BEGDA"",""ENDDA"",""TRILID"",""ADDCON"",""TRTCD"",""RISKSUM"",""CRAT"",""CHGD",
            filtered_data.max_version,
            filtered_data.max_valid_version
           FROM filtered_data
          ORDER BY filtered_data."TRTCD", filtered_data."VRSN" DESC, filtered_data."TRILID") fd
     LEFT JOIN t_object t ON split_part(fd."RISKCD"::text, '-'::text, 1) = t."STEXT"::text AND t."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_grisktreatment tgk ON fd."TRTCD"::text = tgk."TRTCD"::text AND tgk."ENDDA" = '2999-01-01'::date
     LEFT JOIN t_object t2 ON fd."STATCD"::text = t2."STEXT"::text AND t2."ENDDA" = '2999-01-01'::date
  ORDER BY fd."TRTCD", fd."VRSN" DESC;

COMMENT ON VIEW public.v_risk_treatment_list IS 'Action-level view of Risk Treatment records. Each row represents one risk treatment action for a specific business unit and period, including treatment details, deadline, and current status.
Use for:
- Risk treatment or mitigation actions
- Treatment status or deadline tracking
- Risk treatments by business unit or period
- Mapping treatment actions to risk summary
Not for:
- Risk register master or risk classification data
- Aggregated risk counts or summaries
- Risk Champion, reviewer, or loss event information';
COMMENT ON COLUMN public.v_risk_treatment_list."Bussiness Unit" IS 'Name Bussiness Unit';
COMMENT ON COLUMN public.v_risk_treatment_list."Period" IS 'Period Risk Treatment';
COMMENT ON COLUMN public.v_risk_treatment_list."Treatment Code" IS 'Treatment Code Risk Treatment';
COMMENT ON COLUMN public.v_risk_treatment_list."Additional Control" IS 'Additional Control Risk Treatment';
COMMENT ON COLUMN public.v_risk_treatment_list."Risk Summary" IS 'Risk Summary Risk Treatment';
COMMENT ON COLUMN public.v_risk_treatment_list."Version" IS 'Version Risk Treatment';
COMMENT ON COLUMN public.v_risk_treatment_list."Deadline" IS 'Deadline Risk Treatment';
COMMENT ON COLUMN public.v_risk_treatment_list."Status" IS 'Status Risk Treatment';


-- public.v_risk_universe source

CREATE OR REPLACE VIEW public.v_risk_universe
AS SELECT EXTRACT(year FROM "PRD") AS "Period",
    "BUTOT" AS "Total Business Unit",
    "RISKTOT" AS "Total Risk"
   FROM t_riskuniversetotal trl;

COMMENT ON VIEW public.v_risk_universe IS 'Aggregated risk-level view of Total Risk. Authoritative source for Total Risk counts.
Each row represents one year period with total identified risks and total business units.
Use for:
MUST be used for:
- Total risk per year
- "Jumlah risiko/risk" 
- "Berapa total risiko di tahun ..."
- Risk universe trend analysis
Not for:
- Individual risk or business unit details
- Risk treatments, loss events, or person-level data
- Operational or transaction-level analysis';
COMMENT ON COLUMN public.v_risk_universe."Period" IS 'Periode Risk Universe';
COMMENT ON COLUMN public.v_risk_universe."Total Business Unit" IS 'Total Bussines Unit Risk Universe';
COMMENT ON COLUMN public.v_risk_universe."Total Risk" IS 'Total Risk';



-- DROP FUNCTION public.coba_infosec_universe(in date, out varchar, out text, out text, out text, out text, out varchar, out varchar, out text, out text, out text, out varchar, out text, out varchar, out varchar, out text, out text, out varchar, out text, out varchar, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out int4, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out varchar);

CREATE OR REPLACE FUNCTION public.coba_infosec_universe(prd date, OUT "DIRNM" character varying, OUT "STATUS" text, OUT "BUCD" text, OUT "ISSVUL" text, OUT "ISSTH" text, OUT "IMPRNM" character varying, OUT "IDASNM" character varying, OUT "ASDESC" text, OUT "ASOWN" text, OUT "ASLOC" text, OUT "RISKCD" character varying, OUT "RISK" text, OUT "CONNM" character varying, OUT "CSCATNM" character varying, OUT "CAUSE" text, OUT "EXCON" text, OUT "SIRCNM" character varying, OUT "MSCONNM" text, OUT "IMRCNM" character varying, OUT "LIHONM" text, OUT "LIHOVAL" integer, OUT "IMVALNM" text, OUT "IMVAL" integer, OUT "INRISCO" integer, OUT "INRICAT" character varying, OUT "EXCONLI" integer, OUT "EXCONIM" integer, OUT "ADINLI" integer, OUT "ADINIM" integer, OUT "ADINSC" integer, OUT "ADINSCCAT" character varying, OUT "TADDCON" integer, OUT "TEFC1" integer, OUT "TEFC2" integer, OUT "TEFC3" integer, OUT "TEFC4" integer, OUT "TEFC5" integer, OUT "TGTLICD" text, OUT "TGTLI" integer, OUT "TGTIMCD" text, OUT "TGTIM" integer, OUT "TGTRISC" integer, OUT "TGTRISCAT" character varying, OUT "REALI" integer, OUT "REAIM" integer, OUT "REARISC" integer, OUT "REARISCAT" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
SELECT  
	    dir."DIRNM" AS "DIRNM",
	    n."OBJDS" AS "STATUS",
	    split_part(a."RISKCD",'-',1) AS "BUCD",
		b."ISSVUL", 
		c."ISSTH", pr."IMPRNM",
		ida."IDASNM", d."ASDESC", d."ASOWN", d."ASLOC", 
		a."RISKCD", e."RISK", con."CONNM", cscat."CSCATNM", e."CAUSE", e."EXCON",
		sir."SIRCNM", 
		isms."MSCONNM", 
		imc."IMCRNM",
		liho1."OPTI" AS "LIHONM", f."LIHOVAL", imv1."OPTI" AS "IMVALNM", f."IMVAL", f."INRISCO", f."INRICAT",
		f."EXCONLI", f."EXCONIM", f."ADINLI", f."ADINIM", f."ADINSC", f."ADINSCCAT",
		g."TADDCON"::int AS "TADDCON", h."TEFC1"::int AS "TEFC1", i."TEFC2"::int AS "TEFC2", j."TEFC3"::int AS "TEFC3", k."TEFC4"::int AS "TEFC4", l."TEFC5"::int AS "TEFC5",
		liho2."OPTI" AS "TGTLICD", m."TGTLI", imv2."OPTI" AS "TGTIMCD", m."TGTIM", m."TGTRISC", m."TGTRISCAT",
		m."REALI", m."REAIM", m."REARISC", m."REARISCAT"
FROM t_IRiskList a
LEFT JOIN t_Object n ON a."STATCD" = n."STEXT"
LEFT JOIN t_InVulnerability b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
LEFT JOIN t_InThreat c ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD"
LEFT JOIN t_InAssets d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD"
LEFT JOIN t_IRiskIdentification e ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD"
LEFT JOIN t_IRiskMeasurement f ON a."INFOCD" = f."INFOCD" AND a."PRD" = f."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."RITREID") AS "TADDCON"
	FROM t_IRiskTreatment tr
	GROUP BY tr."INFOCD", tr."PRD"
	) AS g
	ON a."INFOCD" = g."INFOCD" AND a."PRD" = g."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC1"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-1'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS h
	ON a."INFOCD" = h."INFOCD" AND a."PRD" = h."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC2"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-2'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS i
	ON a."INFOCD" = i."INFOCD" AND a."PRD" = i."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC3"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-3'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS j
	ON a."INFOCD" = j."INFOCD" AND a."PRD" = j."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC4"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-4'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS k
	ON a."INFOCD" = k."INFOCD" AND a."PRD" = k."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC5"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-5'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS l
	ON a."INFOCD" = l."INFOCD" AND a."PRD" = l."PRD"
LEFT JOIN t_IResidualRisk m ON a."INFOCD" = m."INFOCD" AND a."PRD" = m."PRD"
LEFT JOIN t_IdAssets ida ON d."IDASCD" = ida."IDASCD"
LEFT JOIN t_ImpactToProcess pr ON c."IMPRCD" = pr."IMPRCD"
LEFT JOIN t_Condition con ON e."CONCD" = con."CONCD"
LEFT JOIN t_Categorization cat ON e."CATCD" = cat."CATCD"
LEFT JOIN t_CauseCategory cscat ON e."CSCATCD" = cscat."CSCATCD"
LEFT JOIN t_ImpactCriteria imc ON e."IMCRCD" = imc."IMCRCD"
LEFT JOIN t_IsmsControl ms ON e."MSCONCD" = ms."MSCONCD" 
LEFT JOIN t_LikelihoodValue liho1 ON f."LIHOCD" = liho1."LIHOCD"
LEFT JOIN t_ImpactValue imv1 ON f."IMVALCD" = imv1."IMVALCD"
LEFT JOIN t_LikelihoodValue liho2 ON m."TGTLICD" = liho2."LIHOCD"
LEFT JOIN t_ImpactValue imv2 ON m."TGTIMCD" = imv2."IMVALCD"
LEFT JOIN t_SystemInfoRC sir ON e."SIRCCD" = sir."SIRCCD"
LEFT JOIN (
SELECT bu."RISKCD", bu."INFOCD", bu."PRD", bu."BUCD", direktorat."DIRNM", direktorat."SUBDIRNM"
FROM
	(SELECT ir."RISKCD", ir."INFOCD", ir."PRD", split_part(ir."RISKCD",'-',1) AS "BUCD" FROM t_IRiskList ir
	) AS bu
LEFT JOIN 
	(SELECT 
	a."STEXT" AS "BUCD", a."LTEXT" AS "BUNM", 
	dir."DIRCD" AS "DIRCD", dir."DIRNM" AS "DIRNM",
	sdir."DIRCD" AS "SUBDIRCD", sdir."DIRNM" AS "SUBDIRNM"
	FROM t_Object a
	LEFT JOIN 
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('DIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS dir
	ON a."STEXT" = dir."BUCD"
	LEFT JOIN
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('SUBDIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS sdir
	ON a."STEXT" = sdir."BUCD"
	WHERE a."OTYPE" = 'BUCD' 
	ORDER BY a."STEXT"
	) AS direktorat
	ON bu."BUCD" = direktorat."BUCD"
) AS dir
ON a."INFOCD" = dir."INFOCD" AND a."PRD" = dir."PRD"

LEFT JOIN (
	SELECT z."INFOCD", string_agg(z."OPTI", ',') AS "MSCONNM"
	FROM (
	SELECT x."INFOCD", x."ISMS", y."OPTI"
	FROM (SELECT "INFOCD", UNNEST(STRING_TO_ARRAY("MSCONCD", ',')) AS "ISMS" FROM t_IRiskIdentification a
		 ) AS x
	JOIN t_IsmsControl y ON x."ISMS" = y."MSCONCD"
	ORDER BY x."INFOCD"
	) AS z
	GROUP BY 1
	) AS isms
ON e."INFOCD" = isms."INFOCD"
WHERE a."ENDDA" = '2999-01-01' AND a."PRD" = prd
ORDER BY a."RISKCD", a."CRAT";
END
$function$
;

-- DROP FUNCTION public.coba_infosec_universe(in date, out varchar, out text, out text, out text, out text, out varchar, out varchar, out text, out text, out text, out varchar, out text, out varchar, in varchar, out text, out text, out varchar, out text, out varchar, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out int4, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out varchar);

CREATE OR REPLACE FUNCTION public.coba_infosec_universe(prd date, OUT "DIRNM" character varying, OUT "STATUS" text, OUT "BUCD" text, OUT "ISSVUL" text, OUT "ISSTH" text, OUT "IMPRNM" character varying, OUT "IDASNM" character varying, OUT "ASDESC" text, OUT "ASOWN" text, OUT "ASLOC" text, OUT "RISKCD" character varying, OUT "RISK" text, OUT "CONNM" character varying, "CSCATNM" character varying, OUT "CAUSE" text, OUT "EXCON" text, OUT "SIRCNM" character varying, OUT "MSCONNM" text, OUT "IMRCNM" character varying, OUT "LIHONM" text, OUT "LIHOVAL" integer, OUT "IMVALNM" text, OUT "IMVAL" integer, OUT "INRISCO" integer, OUT "INRICAT" character varying, OUT "EXCONLI" integer, OUT "EXCONIM" integer, OUT "ADINLI" integer, OUT "ADINIM" integer, OUT "ADINSC" integer, OUT "ADINSCCAT" character varying, OUT "TADDCON" integer, OUT "TEFC1" integer, OUT "TEFC2" integer, OUT "TEFC3" integer, OUT "TEFC4" integer, OUT "TEFC5" integer, OUT "TGTLICD" text, OUT "TGTLI" integer, OUT "TGTIMCD" text, OUT "TGTIM" integer, OUT "TGTRISC" integer, OUT "TGTRISCAT" character varying, OUT "REALI" integer, OUT "REAIM" integer, OUT "REARISC" integer, OUT "REARISCAT" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
SELECT  
	    dir."DIRNM" AS "DIRNM",
	    n."OBJDS" AS "STATUS",
	    split_part(a."RISKCD",'-',1) AS "BUCD",
		b."ISSVUL", 
		c."ISSTH", pr."IMPRNM",
		ida."IDASNM", d."ASDESC", d."ASOWN", d."ASLOC", 
		a."RISKCD", e."RISK", con."CONNM", cscat."CSCATNM", e."CAUSE", e."EXCON",
		sir."SIRCNM", 
		isms."MSCONNM", 
		imc."IMCRNM",
		liho1."OPTI" AS "LIHONM", f."LIHOVAL", imv1."OPTI" AS "IMVALNM", f."IMVAL", f."INRISCO", f."INRICAT",
		f."EXCONLI", f."EXCONIM", f."ADINLI", f."ADINIM", f."ADINSC", f."ADINSCCAT",
		g."TADDCON"::int AS "TADDCON", h."TEFC1"::int AS "TEFC1", i."TEFC2"::int AS "TEFC2", j."TEFC3"::int AS "TEFC3", k."TEFC4"::int AS "TEFC4", l."TEFC5"::int AS "TEFC5",
		liho2."OPTI" AS "TGTLICD", m."TGTLI", imv2."OPTI" AS "TGTIMCD", m."TGTIM", m."TGTRISC", m."TGTRISCAT",
		m."REALI", m."REAIM", m."REARISC", m."REARISCAT"
FROM t_IRiskList a
LEFT JOIN t_Object n ON a."STATCD" = n."STEXT"
LEFT JOIN t_InVulnerability b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
LEFT JOIN t_InThreat c ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD"
LEFT JOIN t_InAssets d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD"
LEFT JOIN t_IRiskIdentification e ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD"
LEFT JOIN t_IRiskMeasurement f ON a."INFOCD" = f."INFOCD" AND a."PRD" = f."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."RITREID") AS "TADDCON"
	FROM t_IRiskTreatment tr
	GROUP BY tr."INFOCD", tr."PRD"
	) AS g
	ON a."INFOCD" = g."INFOCD" AND a."PRD" = g."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC1"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-1'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS h
	ON a."INFOCD" = h."INFOCD" AND a."PRD" = h."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC2"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-2'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS i
	ON a."INFOCD" = i."INFOCD" AND a."PRD" = i."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC3"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-3'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS j
	ON a."INFOCD" = j."INFOCD" AND a."PRD" = j."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC4"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-4'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS k
	ON a."INFOCD" = k."INFOCD" AND a."PRD" = k."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC5"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-5'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS l
	ON a."INFOCD" = l."INFOCD" AND a."PRD" = l."PRD"
LEFT JOIN t_IResidualRisk m ON a."INFOCD" = m."INFOCD" AND a."PRD" = m."PRD"
LEFT JOIN t_IdAssets ida ON d."IDASCD" = ida."IDASCD"
LEFT JOIN t_ImpactToProcess pr ON c."IMPRCD" = pr."IMPRCD"
LEFT JOIN t_Condition con ON e."CONCD" = con."CONCD"
LEFT JOIN t_Categorization cat ON e."CATCD" = cat."CATCD"
LEFT JOIN t_CauseCategory cscat ON e."CSCATCD" = cscat."CSCATCD"
LEFT JOIN t_ImpactCriteria imc ON e."IMCRCD" = imc."IMCRCD"
LEFT JOIN t_IsmsControl ms ON e."MSCONCD" = ms."MSCONCD" 
LEFT JOIN t_LikelihoodValue liho1 ON f."LIHOCD" = liho1."LIHOCD"
LEFT JOIN t_ImpactValue imv1 ON f."IMVALCD" = imv1."IMVALCD"
LEFT JOIN t_LikelihoodValue liho2 ON m."TGTLICD" = liho2."LIHOCD"
LEFT JOIN t_ImpactValue imv2 ON m."TGTIMCD" = imv2."IMVALCD"
LEFT JOIN t_SystemInfoRC sir ON e."SIRCCD" = sir."SIRCCD"
LEFT JOIN (
SELECT bu."RISKCD", bu."INFOCD", bu."PRD", bu."BUCD", direktorat."DIRNM", direktorat."SUBDIRNM"
FROM
	(SELECT ir."RISKCD", ir."INFOCD", ir."PRD", split_part(ir."RISKCD",'-',1) AS "BUCD" FROM t_IRiskList ir
	) AS bu
LEFT JOIN 
	(SELECT 
	a."STEXT" AS "BUCD", a."LTEXT" AS "BUNM", 
	dir."DIRCD" AS "DIRCD", dir."DIRNM" AS "DIRNM",
	sdir."DIRCD" AS "SUBDIRCD", sdir."DIRNM" AS "SUBDIRNM"
	FROM t_Object a
	LEFT JOIN 
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('DIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS dir
	ON a."STEXT" = dir."BUCD"
	LEFT JOIN
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('SUBDIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS sdir
	ON a."STEXT" = sdir."BUCD"
	WHERE a."OTYPE" = 'BUCD' 
	ORDER BY a."STEXT"
	) AS direktorat
	ON bu."BUCD" = direktorat."BUCD"
) AS dir
ON a."INFOCD" = dir."INFOCD" AND a."PRD" = dir."PRD"

LEFT JOIN (
	SELECT z."INFOCD", string_agg(z."OPTI", ',') AS "MSCONNM"
	FROM (
	SELECT x."INFOCD", x."ISMS", y."OPTI"
	FROM (SELECT "INFOCD", UNNEST(STRING_TO_ARRAY("MSCONCD", ',')) AS "ISMS" FROM t_IRiskIdentification a
		 ) AS x
	JOIN t_IsmsControl y ON x."ISMS" = y."MSCONCD"
	ORDER BY x."INFOCD"
	) AS z
	GROUP BY 1
	) AS isms
ON e."INFOCD" = isms."INFOCD"
WHERE a."ENDDA" = '2999-01-01' AND a."PRD" = prd
ORDER BY a."RISKCD", a."CRAT";
END
$function$
;

-- DROP FUNCTION public.f_coimpactcriteria();

CREATE OR REPLACE FUNCTION public.f_coimpactcriteria()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_CoImpactCriteria ("BEGDA", "ENDDA", "ASPCD", "IMCRCD", "IMCRNM", "DESC", "CRAT", "CHGDA", "CHGBY")
	SELECT "BEGDA", "ENDDA", "ASPCD", "IMCRCD", "IMCRNM", "DESC", "CRAT", "CHGDA", "CHGBY" 
	FROM t_TemporaryCoImpact
	ORDER BY "CRAT"
	DESC LIMIT 1;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_coimpactvalue();

CREATE OR REPLACE FUNCTION public.f_coimpactvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

	INSERT INTO t_CoImpactValue ("BEGDA", "ENDDA", "ASPCD", "IMCRCD", "CRAT", "CHGDA", "CHGBY", "OPTI", "VAL")

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
 	CASE WHEN ti."VLOW" IS NOT NULL THEN ti."VLOW" ELSE NULL END AS value,
 	CASE WHEN ti."VLOW" IS NOT NULL THEN 1 ELSE NULL END AS score
 	FROM t_TemporaryCoImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoImpact)
	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
 
	UNION
	
	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
  	CASE WHEN ti."LOW" is not NULL THEN ti."LOW" ELSE NULL END AS value,
  	CASE WHEN ti."LOW" is not NULL THEN 2 ELSE NULL END AS score
	FROM t_TemporaryCoImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoImpact)
	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
	CASE WHEN ti."MEDIUM" is not NULL THEN ti."MEDIUM" ELSE NULL END AS value,
	CASE WHEN ti."MEDIUM" is not NULL THEN 3 ELSE NULL END AS score
	FROM t_TemporaryCoImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoImpact)
 	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
  
    UNION

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
	CASE WHEN ti."HIGH" is not NULL THEN ti."HIGH" ELSE NULL END AS value,
	CASE WHEN ti."HIGH" is not NULL THEN 4 ELSE NULL END AS score
	FROM t_TemporaryCoImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoImpact)
 	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
	CASE WHEN ti."VHIGH" is not NULL THEN ti."VHIGH" ELSE NULL END AS value,
	CASE WHEN ti."VHIGH" is not NULL THEN 5 ELSE NULL END AS score
	FROM t_TemporaryCoimpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoImpact)
 	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY";
 
 	RETURN NEW;
 
END;
$function$
;

-- DROP FUNCTION public.f_colikelihoodvalue();

CREATE OR REPLACE FUNCTION public.f_colikelihoodvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	INSERT INTO t_CoLikelihoodValue ("BEGDA", "ENDDA", "LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", "CRAT", "CHGDA", "CHGBY", "OPTI", "VAL")
	
	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
 	CASE WHEN tl."VLOW" IS NOT NULL THEN tl."VLOW" ELSE NULL END AS value,
 	CASE WHEN tl."VLOW" IS NOT NULL THEN 1 ELSE NULL END AS score
	FROM t_TemporaryCoLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
 
	UNION
	
	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
  	CASE WHEN tl."LOW" IS NOT NULL THEN tl."LOW" ELSE NULL END AS value,
  	CASE WHEN tl."LOW" IS NOT NULL THEN 2 ELSE NULL END AS score
	FROM t_TemporaryCoLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
	CASE WHEN tl."MEDIUM" IS NOT NULL THEN tl."MEDIUM" ELSE NULL END AS value,
	CASE WHEN tl."MEDIUM" IS NOT NULL THEN 3 ELSE NULL END AS score
	FROM t_TemporaryCoLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
  
    UNION

	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
	CASE WHEN tl."HIGH" IS NOT NULL THEN tl."HIGH" ELSE NULL END AS value,
	CASE WHEN tl."HIGH" IS NOT NULL THEN 4 ELSE NULL END AS score
	FROM t_TemporaryCoLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
	CASE WHEN tl."VHIGH" IS NOT NULL THEN tl."VHIGH" ELSE NULL END AS value,
	CASE WHEN tl."VHIGH" IS NOT NULL THEN 5 ELSE NULL END AS score
	FROM t_TemporaryCoLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryCoLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY";

 	RETURN NEW;
 
END;
$function$
;

-- DROP FUNCTION public.f_corporateinherent();

CREATE OR REPLACE FUNCTION public.f_corporateinherent()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW."INRISCO" = NEW."LIHOVAL" * NEW."IMVAL";
	IF NEW."IMVAL" < 5 AND NEW."INRISCO" < 6 THEN
		NEW."INRICAT" := 'Low';
	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" >= 10 THEN
		NEW."INRICAT" := 'High';
	ELSEIF NEW."IMVAL" < 5 AND NEW."INRISCO" >= 15 THEN
		NEW."INRICAT" := 'High';
	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" < 10 THEN 
		NEW."INRICAT" := 'Medium';
	ELSEIF NEW."LIHOVAL" IS NULL OR NEW."IMVAL" IS NULL THEN 
		NEW."INRICAT" := '';
	ELSEIF NEW."LIHOVAL" IS NULL AND NEW."IMVAL" IS NULL THEN 
		NEW."INRICAT" := '';
	ELSE
		NEW."INRICAT" := 'Medium';
	END IF;
	
	NEW."TGTRISC" = NEW."TGTLI" * NEW."TGTIM";
	IF NEW."TGTIM" < 5 AND NEW."TGTRISC" < 6 THEN
		NEW."TGTRISCAT" := 'Low';
	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" >= 10 THEN
		NEW."TGTRISCAT" := 'High';
	ELSEIF NEW."TGTIM" < 5 AND NEW."TGTRISC" >= 15 THEN
		NEW."TGTRISCAT" := 'High';
	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" < 10 THEN
		NEW."TGTRISCAT" := 'Medium';
	ELSEIF NEW."TGTIM" IS NULL OR NEW."TGTRISC" IS NULL THEN
		NEW."TGTRISCAT" := '';
	ELSEIF NEW."TGTIM" IS NULL AND NEW."TGTRISC" IS NULL THEN
		NEW."TGTRISCAT" := '';
	ELSE
		NEW."TGTRISCAT" := 'Medium';
	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_corporateinherent_newhitmap();

CREATE OR REPLACE FUNCTION public.f_corporateinherent_newhitmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRISCO" = 1;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 5;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 10;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 15;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 20;

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 2;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 6;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 11;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 16;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 3;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 13;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 18;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 4;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 8;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 14;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 19;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 12;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 17;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 22;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 25;

	END IF;


	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	END IF;


	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISC" = 1;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 5;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 10;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 15;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 20;
	
	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 2;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 6;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 11;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 16;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 3;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 13;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 18;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 4;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 8;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 14;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 19;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 12;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 17;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 22;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 25;
	END IF;


	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	END IF;


	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_corporaterisklist();

CREATE OR REPLACE FUNCTION public.f_corporaterisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
 BEGIN
	INSERT INTO t_CorporateRiskList ("PRD", "CORICD", "DESC", "REFID", "TARECD", "CRAT", "CHGDA", "CHGBY")
	SELECT "PRD", "CORICD", "DESC", "ID", "TARECD", "CRAT", "CHGDA", "CHGBY"
	FROM t_CorporateRisk
	ORDER BY "CRAT" DESC 
	LIMIT 1;
	RETURN NEW;
END;
 $function$
;

-- DROP FUNCTION public.f_corporaterisklistupdate();

CREATE OR REPLACE FUNCTION public.f_corporaterisklistupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
 BEGIN
	UPDATE t_CorporateRiskList a
	SET "ENDDA" = b."ENDDA",
		"DESC" = b."DESC",
		"CORICD" = b."CORICD",
		"TARECD" = b."TARECD"
	FROM t_CorporateRisk b
	WHERE a."REFID"::UUID = b."ID"::UUID;-- AND a."PRD" = b."PRD";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_corporateriskmeasurement_newheatmap();

CREATE OR REPLACE FUNCTION public.f_corporateriskmeasurement_newheatmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRISCO" = 1;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 5;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 10;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 15;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 20;

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 2;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 6;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 11;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 16;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 3;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 8;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 13;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 18;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 4;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 9;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 14;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 19;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 12;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 17;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 22;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 25;

	END IF;


	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	END IF;


	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISC" = 1;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 5;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 10;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 15;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 20;
	
	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 2;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 6;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 11;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 16;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 3;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 8;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 13;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 18;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 4;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 9;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 14;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 19;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 12;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 17;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 22;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 25;
	END IF;


	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	END IF;


	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_corporaterisktotal();

CREATE OR REPLACE FUNCTION public.f_corporaterisktotal()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	UPDATE t_CorporateRiskTotal a
--	SET "TOTAL" = x."TOTAL",
--		"CHGDA" = CURRENT_DATE
--	FROM (
--		SELECT "PRD", COUNT ("ID") AS "TOTAL" FROM t_CorporateRiskList 
--		WHERE "ENDDA" = '2999-01-01'
--		GROUP BY "PRD"
--	) AS x
--	WHERE a."PRD" = x."PRD";

	UPDATE t_CorporateRiskTotal a
	SET "TOTAL" = co."TOTAL",
		"CHGDA" = CURRENT_DATE
	FROM (
		SELECT a."PRD", x."TOTAL"
		FROM t_CorporateRiskTotal a
		LEFT JOIN
		(
				SELECT "PRD", COUNT ("ID") AS "TOTAL" FROM t_CorporateRiskList 
				WHERE "ENDDA" = '2999-01-01'
				GROUP BY "PRD"
			) AS x
		ON a."PRD" = x."PRD"
		) AS co
	WHERE a."PRD" = co."PRD";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_deleteimpactvalue();

CREATE OR REPLACE FUNCTION public.f_deleteimpactvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	DELETE FROM t_ImpactValue t1
	USING t_TemporaryImpact t2
	WHERE t1."IMCRCD" = t2."IMCRCD";
 	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_deletelikelihoodvalue();

CREATE OR REPLACE FUNCTION public.f_deletelikelihoodvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	DELETE FROM t_LikelihoodValue t1
	USING t_TemporaryLikelihood t2
	WHERE t2."LIHOCRCD" = t1."LIHOCRCD";
 	RETURN NEW;
 
END;
$function$
;

-- DROP FUNCTION public.f_gkeyrisk();

CREATE OR REPLACE FUNCTION public.f_gkeyrisk()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF NEW."GKEY" = TRUE THEN

	INSERT INTO t_GKeyIdentification ("REFCD", "RISKCD", "PRD", "RISK", "CATCD", "PRONM", "OBJTV", "CAUSE", "IMCRCD", "EXCON", "CONCD", "CSCATCD", "ID_GKEY", "VRSN", "CATMPL", "RISKTPE")
	SELECT concat('REF-',nextval('"t_gkeyidentification_ID_seq"'::regclass)+1), a."RISKCD", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE, x."RISK", x."CATCD", x."PRONM", x."OBJTV", x."CAUSE", x."IMCRCD", x."EXCON", x."CONCD", x."CSCATCD", a."ID_GKEY", a."VRSN",  x."CATMPL" , x."RISKTPE"
	FROM t_GRiskDatabaseList a
	LEFT JOIN t_GRiskIdentification x ON x."RISKCD" = a."RISKCD" AND x."PRD" = a."PRD" AND x."VRSN" = a."VRSN"-- AND x."REFCD" IS NULL
	LEFT JOIN t_GKeyIdentification y ON a."ID_GKEY" = y."ID_GKEY"
	WHERE a."GKEY" = TRUE AND y."ID_GKEY" IS NULL;

	INSERT INTO t_GKeyList ("REFCD", "RISKCD", "PRD", "DESC", "ENFOD", "ENFOR", "ID_GKEY", "SRC", "VRSN","STATCD")
	SELECT y."REFCD", k."RISKCD", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE, k."DESC", 'INACTIVE' AS "ENFOD", 'INACTIVE' AS "ENFOR", k."ID_GKEY", concat(k."RISKCD",',',k."BUNM",',',k."DESC") AS "SRC", k."VRSN", 'GKEL-1' AS "STATCD"
	FROM (
		SELECT risk.*, bu."BUNM"
		FROM 
		(
		SELECT a.*, split_part("RISKCD",'-',1) AS "BUCD" 
		FROM t_GRiskDatabaseList a
		) AS risk
		LEFT JOIN	
			(SELECT "STEXT" AS "BUCD", "LTEXT" AS "BUNM"
			 FROM t_Object
--			 WHERE "OTYPE" = 'BUCD'
			 WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01'
			) AS bu
		ON risk."BUCD" = bu."BUCD"
	) AS k
	LEFT JOIN t_GKeyList c ON k."ID_GKEY" = c."ID_GKEY"
	LEFT JOIN t_GKeyIdentification y ON k."RISKCD" = y."RISKCD" AND y."PRD" = (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE AND k."VRSN" = y."VRSN"
	WHERE k."GKEY" = 'TRUE' AND c."ID_GKEY" IS NULL;

	
	INSERT INTO t_GEnforcement ("REFID", "REFCD", "PRD", "DIRCD", "BUCD", "ALLBU", "ID_GKEY")
	SELECT y."ID", y."REFCD", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE, NULL AS "DIRCD", NULL AS "BUCD", NULL AS "ALLBU", a."ID_GKEY"
	FROM t_GRiskDatabaseList a
	LEFT JOIN t_GKeyIdentification y ON a."RISKCD" = y."RISKCD" AND y."PRD" = (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE AND a."VRSN" = y."VRSN"
	LEFT JOIN t_GEnforcement en ON a."ID_GKEY" = en."ID_GKEY"
	WHERE a."GKEY" = 'TRUE' AND en."ID_GKEY" IS NULL;

	INSERT INTO t_GEditable ("REFID", "REFCD", "RISK", "CATCD", "PRONM", "OBJTV", "CAUSE", "IMCRCD", "EXCON", "CONCD", "CSCATCD", "ID_GKEY", "PRD")
	SELECT y."ID", y."REFCD", NULL AS "RISK", NULL AS "CATCD", NULL AS "PRONM", NULL AS "OBJTV", NULL AS "CAUSE", NULL AS "IMCRCD", NULL AS "EXCON", NULL AS "CONCD", NULL AS "CSCATCD", a."ID_GKEY", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE
	FROM t_GRiskDatabaseList a
	LEFT JOIN t_GKeyIdentification y ON a."RISKCD" = y."RISKCD" AND y."PRD" = (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE AND a."VRSN" = y."VRSN"
	LEFT JOIN t_GEditable ed ON a."ID_GKEY" = ed."ID_GKEY"
	WHERE a."GKEY" = 'TRUE' AND ed."ID_GKEY" IS NULL;
	
	END IF;

	IF NEW."GKEY" = FALSE THEN
	UPDATE t_GKeyList d
	SET "ENDDA" = CURRENT_DATE - 1,
		"ENFOD" = 'INACTIVE',
		"ENFOR" = 'INACTIVE'
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = FALSE AND d."ID_GKEY" = a."ID_GKEY";--d."RISKCD" = a."RISKCD" AND d."PRD" = a."PRD";
	END IF;
	
	IF NEW."GKEY" = FALSE THEN
	UPDATE t_GEnforcement en
	SET "ENDDA" = CURRENT_DATE - 1,
		"DIRCD" = NULL,
		"BUCD" = NULL,
		"ALLBU" = 'Inactive'
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = FALSE AND en."ID_GKEY" = a."ID_GKEY";--en."REFCD" = a."RISKCD" AND en."PRD" = a."PRD";
	END IF;

	IF NEW."GKEY" = FALSE THEN
	UPDATE t_GEditable ed
	SET "ENDDA" = CURRENT_DATE - 1
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = FALSE AND ed."ID_GKEY" = a."ID_GKEY";--ed."REFCD" = a."RISKCD" AND ed."PRD" = a."PRD";
	END IF;

	IF NEW."GKEY" = TRUE THEN
	UPDATE t_GKeyList d
	SET "ENDDA" = '2999-01-01'
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = TRUE AND d."ID_GKEY" = a."ID_GKEY";--d."RISKCD" = a."RISKCD" AND d."PRD" = a."PRD";
	END IF;

	IF NEW."GKEY" = TRUE THEN
	UPDATE t_GKeyIdentification id
	SET "ENDDA" = '2999-01-01'
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = TRUE AND id."ID_GKEY" = a."ID_GKEY";--id."RISKCD" = a."RISKCD" AND id."PRD" = a."PRD";
	END IF;

	IF NEW."GKEY" = TRUE THEN
	UPDATE t_GEnforcement en
	SET "ENDDA" = '2999-01-01'
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = TRUE AND en."ID_GKEY" = a."ID_GKEY";--en."REFCD" = a."RISKCD" AND en."PRD" = a."PRD";
	END IF;

	IF NEW."GKEY" = TRUE THEN
	UPDATE t_GEditable ed
	SET "ENDDA" = '2999-01-01'
	FROM t_GRiskDatabaseList a
	WHERE a."GKEY" = TRUE AND ed."ID_GKEY" = a."ID_GKEY";--ed."REFCD" = a."RISKCD" AND ed."PRD" = a."PRD";
	END IF;


	
--	INSERT INTO t_GKeyList ("REFCD", "RISKCD", "PRD", "DESC", "ENFOD", "ENFOR", "ID_GKEY", "SRC")
--	SELECT k."RISKCD", k."RISKCD", k."PRD", k."DESC", 'INACTIVE' AS "ENFOD", 'INACTIVE' AS "ENFOR", k."ID_GKEY", concat(k."RISKCD",',',k."BUNM",',',k."DESC") AS "SRC" 
--	FROM (
--		SELECT risk.*, bu."BUNM"
--		FROM 
--		(
--		SELECT a.*, split_part("RISKCD",'-',1) AS "BUCD" 
--		FROM t_GRiskDatabaseList a
--		) AS risk
--		LEFT JOIN	
--			(SELECT "STEXT" AS "BUCD", "LTEXT" AS "BUNM"
--			 FROM t_Object
--			 WHERE "OTYPE" = 'BUCD'
--			) AS bu
--		ON risk."BUCD" = bu."BUCD"
--	) AS k
--	LEFT JOIN t_GKeyList c ON k."ID_GKEY" = c."ID_GKEY"
--	WHERE k."GKEY" = 'TRUE' AND c."ID_GKEY" IS NULL;
--
--	INSERT INTO t_GKeyIdentification ("REFCD", "RISKCD", "PRD", "RISK", "CATCD", "PRONM", "OBJTV", "CAUSE", "IMCRCD", "EXCON", "CONCD", "CSCATCD", "ID_GKEY")
--	SELECT a."RISKCD", a."RISKCD", a."PRD", x."RISK", x."CATCD", x."PRONM", x."OBJTV", x."CAUSE", x."IMCRCD", x."EXCON", x."CONCD", x."CSCATCD", a."ID_GKEY"
--	FROM t_GRiskDatabaseList a
--	LEFT JOIN t_GRiskIdentification x ON x."RISKCD" = a."RISKCD" AND x."PRD" = a."PRD"-- AND x."REFCD" IS NULL
--	LEFT JOIN t_GKeyIdentification y ON a."ID_GKEY" = y."ID_GKEY"
--	WHERE a."GKEY" = TRUE AND y."ID_GKEY" IS NULL;
--	
--	INSERT INTO t_GEnforcement ("REFID", "REFCD", "PRD", "DIRCD", "BUCD", "ALLBU", "ID_GKEY")
--	SELECT y."ID", a."RISKCD", a."PRD", NULL AS "DIRCD", NULL AS "BUCD", NULL AS "ALLBU", a."ID_GKEY"
--	FROM t_GRiskDatabaseList a
--	LEFT JOIN t_GKeyIdentification y ON a."RISKCD" = y."RISKCD" AND a."PRD" = y."PRD"
--	LEFT JOIN t_GEnforcement en ON a."ID_GKEY" = en."ID_GKEY"
--	WHERE a."GKEY" = 'TRUE' AND en."ID_GKEY" IS NULL;
--
--	INSERT INTO t_GEditable ("REFID", "REFCD", "RISK", "CATCD", "PRONM", "OBJTV", "CAUSE", "IMCRCD", "EXCON", "CONCD", "CSCATCD", "ID_GKEY", "PRD")
--	SELECT y."ID", a."RISKCD", NULL AS "RISK", NULL AS "CATCD", NULL AS "PRONM", NULL AS "OBJTV", NULL AS "CAUSE", NULL AS "IMCRCD", NULL AS "EXCON", NULL AS "CONCD", NULL AS "CSCATCD", a."ID_GKEY", a."PRD"
--	FROM t_GRiskDatabaseList a
--	LEFT JOIN t_GKeyIdentification y ON a."RISKCD" = y."RISKCD" AND a."PRD" = y."PRD"
--	LEFT JOIN t_GEditable ed ON a."ID_GKEY" = ed."ID_GKEY"
--	WHERE a."GKEY" = 'TRUE' AND ed."ID_GKEY" IS NULL;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_griskdatabase();

CREATE OR REPLACE FUNCTION public.f_griskdatabase()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_GRiskDatabase ("RISKCD", "PRD", "RISK", "CONCD", "CATCD", "CSCATCD", "CAUSE", "EXCON", "IMCRCD", "CHGDA", "CHGBY", "ID_GDB", "VRSN", "CATMPL", "RISKTPE")

	SELECT  
		a."RISKCD", a."PRD", 
		b."RISK", b."CONCD", 
		b."CATCD", b."CSCATCD", 
		b."CAUSE", b."EXCON", 
		b."IMCRCD", b."CHGDA", 
		b."CHGBY", a."ID_GDB", 
		a."VRSN", b."CATMPL", b."RISKTPE"
		FROM t_GRiskList a
		LEFT JOIN t_GRiskidentification b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD"  AND a."VRSN" = b."VRSN"
		LEFT JOIN t_GRiskDatabase c ON a."ID_GDB" = c."ID_GDB"
	WHERE a."STATCD" = 'SREG-16' AND a."ENDDA" = '2999-01-01' AND c."ID_GDB" IS NULL;


    DELETE FROM t_GRiskDatabase s
	USING t_GRiskDatabase s_new
	WHERE s."RISKCD" = s_new."RISKCD" AND s."PRD" = s_new."PRD" AND s."VRSN" < s_new."VRSN";


	INSERT INTO t_GRiskDatabaseList ("RISKCD", "PRD", "DESC", "GRDID", "CHGDA", "CHGBY", "VRSN")
--	SELECT b."RISKCD", b."PRD", b."RISK", b."GRDID", b."CHGDA", b."CHGBY", b."VRSN"
--	FROM t_GRiskDatabase b
--	ORDER BY b."CRAT" DESC LIMIT 1;
	SELECT b."RISKCD", b."PRD", b."RISK", b."GRDID", b."CHGDA", b."CHGBY", b."VRSN"
	FROM t_GRiskDatabase b
	LEFT JOIN t_GRiskDatabaseList f ON b."GRDID" = f."GRDID"
	WHERE f."GRDID" IS NULL;


  	DELETE FROM t_GRiskDatabaseList s
	USING t_GRiskDatabaseList s_new
	WHERE s."RISKCD" = s_new."RISKCD" AND s."PRD" = s_new."PRD" AND s."VRSN" < s_new."VRSN";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_griskdatabaselist();

CREATE OR REPLACE FUNCTION public.f_griskdatabaselist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_GRiskDatabaseList ("RISKCD", "PRD", "DESC", "GRDID", "CHGDA", "CHGBY", "VRSN")
	SELECT b."RISKCD", b."PRD", b."RISK", b."GRDID", b."CHGDA", b."CHGBY", b."VRSN"
	FROM t_GRiskDatabase b
	ORDER BY b."CRAT" DESC LIMIT 1;

  	DELETE FROM t_GRiskDatabaseList s
	USING t_GRiskDatabaseList s_new
	WHERE s."RISKCD" = s_new."RISKCD" AND s."PRD" = s_new."PRD" AND s."VRSN" < s_new."VRSN";

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_griskdatabaseoff();

CREATE OR REPLACE FUNCTION public.f_griskdatabaseoff()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
		
	IF NEW."ENDDA" <> '2999-01-01' THEN
	UPDATE t_GRiskDatabaseList a
	SET "GKEY" = FALSE 
	FROM t_GKeyList b
	WHERE a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD";
	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_grisklist();

CREATE OR REPLACE FUNCTION public.f_grisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN
--IF NEW."REFCD" IS NOT NULL AND NEW."VRSN" = 0 THEN
IF NEW."REFCD" IS NOT NULL THEN
	INSERT INTO t_GRiskList ("OBJTV", "RISKCD", "RISKSUM", "PRD", "REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD", "REFID", "RSCR", "DVSN")
	SELECT g."OBJTV", g."RISKCD", g."RISK", g."PRD", g."REFCD", g."VRSN", g."CHGDA", g."CHGBY", 'SREG-1' AS "STATCD", NULL AS "PRGS", g."REFPRD", g."REFID", g."RSCR", g."DVSN"
	FROM t_GRiskIdentification g
	ORDER BY g."CRAT" 
	DESC limit 1;
END IF;

--IF NEW."REFCD" IS NOT NULL AND NEW."VRSN" > 0 THEN
--	INSERT INTO t_GRiskList ("OBJTV", "RISKCD", "RISKSUM", "PRD", "REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD")
--	SELECT g."OBJTV", g."RISKCD", g."RISK", g."PRD", g."REFCD", g."VRSN", g."CHGDA", g."CHGBY", 'SREG-2' AS "STATCD", NULL AS "PRGS", g."REFPRD"
--	FROM t_GRiskIdentification g
--	ORDER BY g."CRAT" 
--	DESC limit 1;
--END IF;

IF NEW."REFCD" IS NULL THEN
	INSERT INTO t_GRiskList ("OBJTV", "RISKCD", "RISKSUM", "PRD", "REFCD", "VRSN", "CHGDA", "CHGBY", "REFPRD", "REFID", "RSCR", "DVSN")
	SELECT g."OBJTV", g."RISKCD", g."RISK", g."PRD", g."REFCD", g."VRSN", g."CHGDA", g."CHGBY", g."REFPRD", g."REFID", g."RSCR", g."DVSN"
	FROM t_GRiskIdentification g
	ORDER BY g."CRAT" 
	DESC limit 1;
END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_grisklistinrisco();

CREATE OR REPLACE FUNCTION public.f_grisklistinrisco()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 04 April 2024

--	UPDATE t_GRiskList a
--	SET "INRISCO" = c."INRISCO"
--	FROM t_GRiskMeasurement c
--	WHERE a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD";

	UPDATE t_GRiskList a
	SET "INRISCO" = c."INRISCO"
	FROM t_GRiskMeasurement c
	WHERE a."RISKCD" IN (SELECT "RISKCD" FROM t_GRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1) 
	AND a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_grisklistupdate();

CREATE OR REPLACE FUNCTION public.f_grisklistupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN  
	
--	UPDATE t_GRiskList a
--	SET "OBJTV" = b."OBJTV",
--		"RISKSUM" = b."RISK"
----		"PRD" = b."PRD"
--	FROM t_GRiskIdentification b
--	WHERE a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN";

    UPDATE t_GRiskList a
	SET "OBJTV" = b."OBJTV",
		"RISKSUM" = b."RISK",
		"INFOCD"  = b."X5"
--		"PRD" = b."PRD"
	FROM t_GRiskIdentification b
	WHERE b."RISKCD" IN (SELECT "RISKCD" FROM t_GRiskIdentification ORDER BY "CHGDA" DESC LIMIT 1)
	AND a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN";


	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_griskreferences();

CREATE OR REPLACE FUNCTION public.f_griskreferences()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	IF OLD."ENFOR" <> NEW."ENFOR" THEN
	UPDATE t_GRiskIdentification a
	SET 
		"OBJTV" = b."OBJTV",
		"RISK" = b."RISK",
		"PRONM" = b."PRONM",
		"CONCD" = b."CONCD",
		"CATCD" = b."CATCD",
		"CSCATCD" = b."CSCATCD",
		"CAUSE" = b."CAUSE",
		"EXCON" = b."EXCON",
		"IMCRCD" = b."IMCRCD",
		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date),
		"CHGDA" = b."CHGDA"	
	FROM t_GKeyIdentification b
	WHERE a."REFCD" = b."REFCD" AND a."PRD" IS NULL;
--	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_GRiskIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."PRD" IS NULL;
--	END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_griskreferenceslist();

CREATE OR REPLACE FUNCTION public.f_griskreferenceslist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GRiskList a
	SET "OBJTV" = b."OBJTV",
		"RISKSUM" = b."RISK",
		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_GRiskIdentification b
	WHERE 1=1
	AND a."REFCD" = b."REFCD" 
	AND a."REFCD" IS NOT NULL 
	AND b."REFCD" IS NOT NULL
	AND a."PRD" IS NULL;
--	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_GKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" IS NOT NULL AND b."REFCD" IS NOT NULL;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_griskreferencesupdate();

CREATE OR REPLACE FUNCTION public.f_griskreferencesupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GRiskIdentification a
	SET 
		"OBJTV" = b."OBJTV",
		"RISK" = b."RISK",
		"PRONM" = b."PRONM",
		"CONCD" = b."CONCD",
		"CATCD" = b."CATCD",
		"CSCATCD" = b."CSCATCD",
		"CAUSE" = b."CAUSE",
		"EXCON" = b."EXCON",
		"IMCRCD" = b."IMCRCD",
		"CHGDA" = b."CHGDA"
		
	 
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_GKeyIdentification b, t_GRiskList c
--	WHERE a."REFCD" = b."REFCD" AND a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2')
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_GKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND c."STATCD" IN ('SREG-1', 'SREG-2'); --AND a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2')
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_ikeyrisk();

CREATE OR REPLACE FUNCTION public.f_ikeyrisk()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF NEW."IKEY" = TRUE THEN

	INSERT INTO t_IKeyIdentification ("REFCD", "RISKCD", "INFOCD", "PRD", "IDASCD", "ASDESC", "ASOWN", "ASLOC", "SIRCCD", "ISSVUL", "ISSTH", "IMPRCD", "CONCD", "CSCATCD", "IMCRCD", "MSCONCD", "CAUSE", "EXCON", "ID_IKEY", "VRSN","RFCDGEN")
	SELECT concat('REF-',nextval('"t_ikeyidentification_ID_seq"'::regclass)+1), 
		   b."RISKCD", 
		   a."INFOCD", 
		   (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE, 
		   c."IDASCD", 
		   c."ASDESC", 
		   c."ASOWN", 
		   c."ASLOC", 
		   b."SIRCCD", 
		   e."ISSVUL", 
		   d."ISSTH", 
		   d."IMPRCD", 
		   b."CONCD", 
		   b."CSCATCD", 
		   b."IMCRCD", 
		   b."MSCONCD", 
		   b."CAUSE", 
		   b."EXCON", 
		   a."ID_IKEY", 
		   a."VRSN", 
		   -- NEW LOGIC: Ambil RFCDGEN dari t_IKeyIdentification berdasarkan REFCD dari t_IRiskIdentification
		   COALESCE(refcd_lookup."RFCDGEN", rf."RFCDGEN", y."RFCDGEN") AS "RFCDGEN"
	FROM t_IRiskDatabaseList a
	LEFT JOIN t_IRiskIdentification b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
	LEFT JOIN t_InAssets c ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
	LEFT JOIN t_InThreat d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
	LEFT JOIN t_InVulnerability e ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD" AND a."VRSN" = e."VRSN"
	-- EXISTING LOGIC: Lookup by ID_IKEY
	LEFT JOIN t_IKeyIdentification y ON a."ID_IKEY" = y."ID_IKEY"
	-- EXISTING LOGIC: Lookup by INFOCD+PRD+VRSN
	LEFT JOIN t_IKeyIdentification rf ON a."INFOCD" = rf."INFOCD" AND a."PRD" = rf."PRD" AND a."VRSN" = rf."VRSN"
	-- NEW LOGIC: Lookup RFCDGEN by REFCD dari t_IRiskIdentification
	LEFT JOIN t_IKeyIdentification refcd_lookup ON b."REFCD" = refcd_lookup."REFCD"
	WHERE a."IKEY" = TRUE AND y."ID_IKEY" IS NULL;

	INSERT INTO t_IKeyList ("REFCD", "INFOCD", "PRD", "IDASCD", "ASDESC", "ENFOD", "ENFOR", "ID_IKEY", "SRC", "VRSN", "STATCD")
	SELECT y."REFCD", k."INFOCD", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE, k."IDASCD", k."ASDESC", 'INACTIVE' AS "ENFOD", 'INACTIVE' AS "ENFOR", k."ID_IKEY", concat(k."INFOCD",',',k."BUNM",',',k."ASDESC") AS "SRC", k."VRSN", 'IKREL-1' AS "STATCD"
	FROM (
		SELECT risk.*, bu."BUNM"
		FROM 
		(
		SELECT a.*, split_part("RISKCD",'-',1) AS "BUCD" 
		FROM t_IRiskDatabaseList a
		) AS risk
		LEFT JOIN	
			(SELECT "STEXT" AS "BUCD", "LTEXT" AS "BUNM"
			 FROM t_Object
			 WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01'
			) AS bu
		ON risk."BUCD" = bu."BUCD"
	) AS k
	LEFT JOIN t_IKeyList c ON k."ID_IKEY" = c."ID_IKEY"
	LEFT JOIN t_IKeyIdentification y ON k."INFOCD" = y."INFOCD" AND y."PRD" = (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE AND k."VRSN" = y."VRSN"
	WHERE k."IKEY" = 'TRUE' AND c."ID_IKEY" IS NULL;

	INSERT INTO t_IEnforcement ("REFID", "REFCD", "PRD", "DIRCD", "BUCD", "ALLBU", "ID_IKEY")
	SELECT y."ID", y."REFCD", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE, NULL AS "DIRCD", NULL AS "BUCD", NULL AS "ALLBU", a."ID_IKEY"
	FROM t_IRiskDatabaseList a
	LEFT JOIN t_IKeyIdentification y ON a."INFOCD" = y."INFOCD" AND y."PRD" = (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE AND a."VRSN" = y."VRSN"
	LEFT JOIN t_IEnforcement en ON a."ID_IKEY" = en."ID_IKEY"
	WHERE a."IKEY" = 'TRUE' AND en."ID_IKEY" IS NULL;
	
	INSERT INTO t_IEditable ("REFID", "REFCD", "IDASCD", "ASDESC", "ASOWN", "ASLOC", "SIRCCD", "ISSVUL", "ISSTH", "MSCONCD", "CAUSE", "EXCON", "CONCD", "CSCATCD", "IMPRCD", "IMCRCD", "ID_IKEY", "PRD")
	SELECT y."ID", y."REFCD", NULL AS "IDASCD", NULL AS "ASDESC", NULL AS "ASOWN", NULL AS "ASLOC", NULL AS "SIRCCD", NULL AS "ISSVUL", NULL AS "ISSTH", NULL AS "MSCONCD", NULL AS "CAUSE", NULL AS "EXCON", NULL AS "CONCD", NULL AS "CSCATCD", NULL AS "IMPRCD", NULL AS "IMCRCD", a."ID_IKEY", (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE
	FROM t_IRiskDatabaseList a
	LEFT JOIN t_IKeyIdentification y ON a."INFOCD" = y."INFOCD" AND y."PRD" = (EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-12-31')::DATE AND a."VRSN" = y."VRSN"
	LEFT JOIN t_IEditable ed ON a."ID_IKEY" = ed."ID_IKEY"
	WHERE a."IKEY" = 'TRUE' AND ed."ID_IKEY" IS NULL;

	END IF;

	IF NEW."IKEY" = FALSE THEN
	UPDATE t_IKeyList d
	SET "ENDDA" = CURRENT_DATE - 1,
		"ENFOD" = 'INACTIVE',
		"ENFOR" = 'INACTIVE'
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = FALSE AND d."ID_IKEY" = a."ID_IKEY";
	END IF;
	
	IF NEW."IKEY" = FALSE THEN
	UPDATE t_IEnforcement en
	SET "ENDDA" = CURRENT_DATE - 1,
		"DIRCD" = NULL,
		"BUCD" = NULL,
		"ALLBU" = 'Inactive'
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = FALSE AND en."ID_IKEY" = a."ID_IKEY";
	END IF;

	IF NEW."IKEY" = FALSE THEN
	UPDATE t_IEditable ed
	SET "ENDDA" = CURRENT_DATE - 1
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = FALSE AND ed."ID_IKEY" = a."ID_IKEY";
	END IF;

	IF NEW."IKEY" = TRUE THEN
	UPDATE t_IKeyList d
	SET "ENDDA" = '2999-01-01'
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = TRUE AND d."ID_IKEY" = a."ID_IKEY";
	END IF;

	IF NEW."IKEY" = TRUE THEN
	UPDATE t_IKeyIdentification id
	SET "ENDDA" = '2999-01-01'
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = TRUE AND id."ID_IKEY" = a."ID_IKEY";
	END IF;

	IF NEW."IKEY" = TRUE THEN
	UPDATE t_IEnforcement en
	SET "ENDDA" = '2999-01-01'
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = TRUE AND en."ID_IKEY" = a."ID_IKEY";
	END IF;

	IF NEW."IKEY" = TRUE THEN
	UPDATE t_IEditable ed
	SET "ENDDA" = '2999-01-01'
	FROM t_IRiskDatabaseList a
	WHERE a."IKEY" = TRUE AND ed."ID_IKEY" = a."ID_IKEY";
	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_impactcriteria();

CREATE OR REPLACE FUNCTION public.f_impactcriteria()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_ImpactCriteria ("BEGDA", "ENDDA", "ASPCD", "IMCRCD", "IMCRNM", "DESC", "CRAT", "CHGDA", "CHGBY")
	SELECT "BEGDA", "ENDDA", "ASPCD", "IMCRCD", "IMCRNM", "DESC", "CRAT", "CHGDA", "CHGBY" 
	FROM t_TemporaryImpact
	ORDER BY "CRAT"
	DESC LIMIT 1;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_impactvalue();

CREATE OR REPLACE FUNCTION public.f_impactvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

--DECLARE
--  max_opti INT;

BEGIN
--	SELECT MAX("OPTI") INTO max_opti FROM t_ImpactValue;
	
	INSERT INTO t_ImpactValue ("BEGDA", "ENDDA", "ASPCD", "IMCRCD", "CRAT", "CHGDA", "CHGBY", "OPTI", "VAL")

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
 	CASE WHEN ti."VLOW" IS NOT NULL THEN ti."VLOW" ELSE NULL END AS value,
 	CASE WHEN ti."VLOW" IS NOT NULL THEN 1 ELSE NULL END AS score
--	CASE WHEN ti."VLOW" IS NOT NULL THEN (max_opti + ROW_NUMBER() OVER (ORDER BY "VAL") - 1) % 5 + 1 ELSE NULL END AS score
--    ROW_NUMBER() OVER (PARTITION BY ti."IMCRCD" ORDER BY ti."CRAT") AS val
 	FROM t_TemporaryImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryImpact)
	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
 
	UNION
	
	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
  	CASE WHEN ti."LOW" is not NULL THEN ti."LOW" ELSE NULL END AS value,
  	CASE WHEN ti."LOW" is not NULL THEN 2 ELSE NULL END AS score
--  	CASE WHEN ti."LOW" is not NULL THEN (max_opti + ROW_NUMBER() OVER (ORDER BY "VAL") - 1) % 5 + 1 ELSE NULL END AS score
	FROM t_TemporaryImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryImpact)
	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
	CASE WHEN ti."MEDIUM" is not NULL THEN ti."MEDIUM" ELSE NULL END AS value,
	CASE WHEN ti."MEDIUM" is not NULL THEN 3 ELSE NULL END AS score
--	CASE WHEN ti."MEDIUM" is not NULL THEN (max_opti + ROW_NUMBER() OVER (ORDER BY "VAL") - 1) % 5 + 1 ELSE NULL END AS score
	FROM t_TemporaryImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryImpact)
 	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
  
    UNION

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
	CASE WHEN ti."HIGH" is not NULL THEN ti."HIGH" ELSE NULL END AS value,
	CASE WHEN ti."HIGH" is not NULL THEN 4 ELSE NULL END AS score
--	CASE WHEN ti."HIGH" is not NULL THEN (max_opti + ROW_NUMBER() OVER (ORDER BY "VAL") - 1) % 5 + 1 ELSE NULL END AS score
	FROM t_TemporaryImpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryImpact)
 	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT ti."BEGDA", ti."ENDDA", ti."ASPCD", ti."IMCRCD", ti."CRAT", ti."CHGDA", ti."CHGBY",
	CASE WHEN ti."VHIGH" is not NULL THEN ti."VHIGH" ELSE NULL END AS value,
	CASE WHEN ti."VHIGH" is not NULL THEN 5 ELSE NULL END AS score
--	CASE WHEN ti."VHIGH" is not NULL THEN (max_opti + ROW_NUMBER() OVER (ORDER BY "VAL") - 1) % 5 + 1 ELSE NULL END AS score
	FROM t_temporaryimpact ti
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryImpact)
 	GROUP BY "BEGDA", "ENDDA", "ASPCD", ti."IMCRCD", value, score, "CRAT", "CHGDA", "CHGBY";

--	INSERT INTO t_ImpactValue ("BEGDA", "ENDDA", "ASPCD", "IMCRCD", "CRAT", "CHGDA", "CHGBY", "OPTI", "VAL")
--    SELECT * FROM t_TemporaryImpact
--    ORDER BY t_ImpactValue."VAL";
	
 
 	RETURN NEW;
 
END;
$function$
;

-- DROP FUNCTION public.f_inassetsreferences();

CREATE OR REPLACE FUNCTION public.f_inassetsreferences()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	INSERT INTO t_InAssets ("RISKCD", "IDASCD", "ASDESC", "ASOWN", "ASLOC", "CRAT", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD")
--	SELECT a."RISKCD", b."IDASCD", b."ASDESC", b."ASOWN", b."ASLOC", a."CRAT", b."CHGDA", b."CHGBY", b."PRD", a."INFOCD", a."REFCD"
--	FROM t_IRiskIdentification a
--	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
--	ORDER BY a."CRAT" 
--	DESC LIMIT 1;


IF NEW."REFCD" IS NOT NULL AND NEW."REVISED" IS NULL THEN

	INSERT INTO t_InAssets ("RISKCD", "IDASCD", "ASDESC", "ASOWN", "ASLOC", "CRAT", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN")
	SELECT a."RISKCD", b."IDASCD", b."ASDESC", b."ASOWN", b."ASLOC", a."CRAT", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."REFCD", a."VRSN"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT" 
	DESC LIMIT 1;

	INSERT INTO t_InThreat ("RISKCD", "ISSTH", "IMPRCD", "IDASCD", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN")
	SELECT a."RISKCD", b."ISSTH", b."IMPRCD", b."IDASCD", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."REFCD", a."VRSN"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD" 
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT"
	DESC LIMIT 1;

	INSERT INTO t_InVulnerability ("RISKCD", "IDASCD", "ISSVUL", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN")
	SELECT a."RISKCD", b."IDASCD", b."ISSVUL", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."REFCD", a."VRSN"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT"
	DESC LIMIT 1;

	INSERT INTO t_IRiskMeasurement ("RISKCD", "IDASCD", "CHGDA", "CHGBY", "PRD", "INFOCD", "VRSN")
	SELECT a."RISKCD", b."IDASCD", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."VRSN"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT"
	DESC LIMIT 1;

	INSERT INTO t_IResidualRisk ("RISKCD", "IDASCD", "CHGDA", "CHGBY", "PRD", "INFOCD", "VRSN")	
	SELECT a."RISKCD", b."IDASCD", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."VRSN"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT"
	DESC LIMIT 1;

END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inassetsreferencesupdate();

CREATE OR REPLACE FUNCTION public.f_inassetsreferencesupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_InAssets a
	SET 
		"IDASCD" = b."IDASCD",
		"ASDESC" = b."ASDESC",
		"ASOWN" = b."ASOWN",
		"ASLOC" = b."ASLOC",
		"CHGDA" = b."CHGDA"
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_IKeyIdentification b, t_IRiskList c
--	WHERE a."REFCD" = b."REFCD" AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_IKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND c."STATCD" IN ('SREG-1', 'SREG-2'); --AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inherentgeneral();

CREATE OR REPLACE FUNCTION public.f_inherentgeneral()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--IF NEW."LIHOVAL", NEW."IMVAL", NEW."EXCONLI", NEW."EXCONIM" IS NOT NULL THEN
	NEW."INRISCO" = NEW."LIHOVAL" * NEW."IMVAL";
	IF NEW."IMVAL" < 5 AND NEW."INRISCO" < 6 THEN
		NEW."INRICAT" := 'Low';
	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" >= 10 THEN
		NEW."INRICAT" := 'High';
	ELSEIF NEW."IMVAL" < 5 AND NEW."INRISCO" >= 15 THEN
		NEW."INRICAT" := 'High';
	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" < 10 THEN 
		NEW."INRICAT" := 'Medium';
	ELSEIF NEW."LIHOVAL" IS NULL OR NEW."IMVAL" IS NULL THEN 
		NEW."INRICAT" := '';
	ELSEIF NEW."LIHOVAL" IS NULL AND NEW."IMVAL" IS NULL THEN 
		NEW."INRICAT" := '';
	ELSE
		NEW."INRICAT" := 'Medium';
	END IF;
	
	NEW."ADINLI" = NEW."LIHOVAL" - NEW."EXCONLI";
	NEW."ADINIM" = NEW."IMVAL" - NEW."EXCONIM";
	NEW."ADINSC" = NEW."ADINLI" * NEW."ADINIM";
	IF NEW."ADINIM" < 5 AND NEW."ADINSC" < 6 THEN
		NEW."ADINSCCAT" := 'Low';
	ELSEIF NEW."ADINIM" = 5 AND NEW."ADINSC" >= 10 THEN
		NEW."ADINSCCAT" := 'High';
	ELSEIF NEW."ADINIM" < 5 AND NEW."ADINSC" >= 15 THEN
		NEW."ADINSCCAT" := 'High';
	ELSEIF NEW."ADINIM" = 5 AND NEW."ADINSC" < 15 THEN
		NEW."ADINSCCAT" := 'Medium';
	ELSEIF NEW."EXCONLI" IS NULL OR NEW."EXCONIM" IS NULL THEN 
		NEW."ADINSCCAT" := '';
	ELSEIF NEW."EXCONLI" IS NULL AND NEW."EXCONIM" IS NULL THEN 
		NEW."ADINSCCAT" := '';
	ELSE
		NEW."ADINSCCAT" := 'Medium';
	END IF;
--END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inherentgeneral_newhitmap();

CREATE OR REPLACE FUNCTION public.f_inherentgeneral_newhitmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRISCO" = 1;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 5;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 10;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 15;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 20;

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 2;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 6;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 11;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 16;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 3;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 13;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 18;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 4;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 8;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 14;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 19;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 12;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 17;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 22;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 25;

	END IF;


	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	END IF;



	NEW."ADINLI" = NEW."LIHOVAL" - NEW."EXCONLI";
	NEW."ADINIM" = NEW."IMVAL" - NEW."EXCONIM";


	--Likelihood = 1
	IF NEW."ADINLI" = 1 AND NEW."ADINIM" = 1  THEN
		NEW."ADINSC" = 1;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 5;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 10;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 15;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 20;
	
	--Likelihood = 2
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 2;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 6;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 11;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 16;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 3;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 7;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 13;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 18;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 4;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 8;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 14;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 19;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 7;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 12;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 17;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 22;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 25;

	END IF;


	--Likelihood = 1
	IF NEW."ADINLI" = 1 AND NEW."ADINIM" = 1  THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'High';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';

	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inherentinfosec();

CREATE OR REPLACE FUNCTION public.f_inherentinfosec()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	NEW."INRISCO" = NEW."LIHOVAL" * NEW."IMVAL";
--	IF NEW."IMVAL" < 5 AND NEW."INRISCO" < 6 THEN
--		NEW."INRICAT" := 'Low';
--	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" >= 10 THEN
--		NEW."INRICAT" := 'High';
--	ELSEIF NEW."IMVAL" < 5 AND NEW."INRISCO" >= 15 THEN
--		NEW."INRICAT" := 'High';
--	ELSE
--		NEW."INRICAT" := 'Medium';
--	END IF;
--	
--	NEW."ADINLI" = NEW."LIHOVAL" - NEW."EXCONLI";
--	NEW."ADINIM" = NEW."IMVAL" - NEW."EXCONIM";
--	NEW."ADINSC" = NEW."ADINLI" * NEW."ADINIM";
--	IF NEW."ADINIM" < 5 AND NEW."ADINSC" < 6 THEN
--		NEW."ADINSCCAT" := 'Low';
--	ELSEIF NEW."ADINIM" = 5 AND NEW."ADINSC" >= 10 THEN
--		NEW."ADINSCCAT" := 'High';
--	ELSEIF NEW."ADINIM" < 5 AND NEW."ADINSC" >= 15 THEN
--		NEW."ADINSCCAT" := 'High';
--	ELSE
--		NEW."ADINSCCAT" := 'Medium';
--	END IF;
	
	NEW."INRISCO" = NEW."LIHOVAL" * NEW."IMVAL";
	IF NEW."IMVAL" < 5 AND NEW."INRISCO" < 6 THEN
		NEW."INRICAT" := 'Low';
	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" >= 10 THEN
		NEW."INRICAT" := 'High';
	ELSEIF NEW."IMVAL" < 5 AND NEW."INRISCO" >= 15 THEN
		NEW."INRICAT" := 'High';
	ELSEIF NEW."IMVAL" = 5 AND NEW."INRISCO" < 10 THEN 
		NEW."INRICAT" := 'Medium';
	ELSEIF NEW."LIHOVAL" IS NULL OR NEW."IMVAL" IS NULL THEN 
		NEW."INRICAT" := '';
	ELSEIF NEW."LIHOVAL" IS NULL AND NEW."IMVAL" IS NULL THEN 
		NEW."INRICAT" := '';
	ELSE
		NEW."INRICAT" := 'Medium';
	END IF;
	
	NEW."ADINLI" = NEW."LIHOVAL" - NEW."EXCONLI";
	NEW."ADINIM" = NEW."IMVAL" - NEW."EXCONIM";
	NEW."ADINSC" = NEW."ADINLI" * NEW."ADINIM";
	IF NEW."ADINIM" < 5 AND NEW."ADINSC" < 6 THEN
		NEW."ADINSCCAT" := 'Low';
	ELSEIF NEW."ADINIM" = 5 AND NEW."ADINSC" >= 10 THEN
		NEW."ADINSCCAT" := 'High';
	ELSEIF NEW."ADINIM" < 5 AND NEW."ADINSC" >= 15 THEN
		NEW."ADINSCCAT" := 'High';
	ELSEIF NEW."ADINIM" = 5 AND NEW."ADINSC" < 15 THEN
		NEW."ADINSCCAT" := 'Medium';
	ELSEIF NEW."EXCONLI" IS NULL OR NEW."EXCONIM" IS NULL THEN 
		NEW."ADINSCCAT" := '';
	ELSEIF NEW."EXCONLI" IS NULL AND NEW."EXCONIM" IS NULL THEN 
		NEW."ADINSCCAT" := '';
	ELSE
		NEW."ADINSCCAT" := 'Medium';
	END IF;
--END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inherentinfosec_newhitmap();

CREATE OR REPLACE FUNCTION public.f_inherentinfosec_newhitmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRISCO" = 1;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 5;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 10;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 15;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 20;

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 2;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 6;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 11;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 16;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 3;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 13;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 18;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 4;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 8;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 14;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 19;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 12;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 17;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 22;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 25;

	END IF;
	

	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	END IF;

	
	NEW."ADINLI" = NEW."LIHOVAL" - NEW."EXCONLI";
	NEW."ADINIM" = NEW."IMVAL" - NEW."EXCONIM";


	--Likelihood = 1
	IF NEW."ADINLI" = 1 AND NEW."ADINIM" = 1  THEN
		NEW."ADINSC" = 1;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 5;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 10;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 15;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 20;
	
	--Likelihood = 2
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 2;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 6;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 11;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 16;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 3;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 7;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 13;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 18;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 4;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 8;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 14;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 19;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 7;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 12;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 17;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 22;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 25;

	END IF;

	--Likelihood = 1
	IF NEW."ADINLI" = 1 AND NEW."ADINIM" = 1  THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'High';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';

	END IF;



	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inthreatreferences();

CREATE OR REPLACE FUNCTION public.f_inthreatreferences()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	INSERT INTO t_InThreat ("RISKCD", "ISSTH", "IMPRCD", "IDASCD", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD")
--	SELECT a."RISKCD", b."ISSTH", b."IMPRCD", b."IDASCD", b."CHGDA", b."CHGBY", b."PRD", a."INFOCD", a."REFCD"
--	FROM t_IRiskIdentification a
--	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD" 
--	ORDER BY a."CRAT"
--	DESC LIMIT 1;

IF NEW."REFCD" IS NOT NULL THEN
	INSERT INTO t_InThreat ("RISKCD", "ISSTH", "IMPRCD", "IDASCD", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD")
	SELECT a."RISKCD", b."ISSTH", b."IMPRCD", b."IDASCD", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."REFCD"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD" 
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT"
	DESC LIMIT 1;
END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inthreatreferencesupdate();

CREATE OR REPLACE FUNCTION public.f_inthreatreferencesupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_InThreat a
	SET 
		"IDASCD" = b."IDASCD",
		"ISSTH" = b."ISSTH",
		"IMPRCD" = b."IMPRCD"
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_IKeyIdentification b, t_IRiskList c
--	WHERE a."REFCD" = b."REFCD" AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_IKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND c."STATCD" IN ('SREG-1', 'SREG-2');--AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_inventor();

CREATE OR REPLACE FUNCTION public.f_inventor()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_Users_Role ("USRNM", "NIK", "NAM", "BUCD", "RLCD", "STAT", "CHGBY")
	SELECT b."EML", a."NIK", a."INVNM", a."BUCD", 'ROLE-6' AS "RLCD", a."STAT", a."SELBY" 
	FROM t_Inventor a
	JOIN t_Personal b ON a."NIK" = b."NIK";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_invulnerabilityreferences();

CREATE OR REPLACE FUNCTION public.f_invulnerabilityreferences()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	INSERT INTO t_InVulnerability ("RISKCD", "IDASCD", "ISSVUL", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD")
--	SELECT a."RISKCD", b."IDASCD", b."ISSVUL", b."CHGDA", b."CHGBY", b."PRD", a."INFOCD", a."REFCD"
--	FROM t_IRiskIdentification a
--	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
--	ORDER BY a."CRAT"
--	DESC LIMIT 1;

IF NEW."REFCD" IS NOT NULL THEN
	INSERT INTO t_InVulnerability ("RISKCD", "IDASCD", "ISSVUL", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD")
	SELECT a."RISKCD", b."IDASCD", b."ISSVUL", b."CHGDA", b."CHGBY", concat(extract(year from current_date),'-','12-31')::date, a."INFOCD", a."REFCD"
	FROM t_IRiskIdentification a
	JOIN t_IKeyIdentification b ON a."REFCD" = b."REFCD"
	WHERE a."REFCD" IS NOT NULL
	ORDER BY a."CRAT"
	DESC LIMIT 1;
END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_invulnerabilityreferencesupdate();

CREATE OR REPLACE FUNCTION public.f_invulnerabilityreferencesupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_InVulnerability a
	SET 
		"IDASCD" = b."IDASCD",
		"ISSVUL" = b."ISSVUL"
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_IKeyIdentification b, t_IRiskList c
--	WHERE a."REFCD" = b."REFCD" AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_IKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND c."STATCD" IN ('SREG-1', 'SREG-2');--AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_iriskdatabase();

CREATE OR REPLACE FUNCTION public.f_iriskdatabase()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_IRiskDatabase ("RISKCD", "INFOCD", "PRD", "IDASCD", "ASDESC", "CATCD", "CSCATCD", "CAUSE", "EXCON", "IMCRCD", "CHGDA", "CHGBY", "ID_IDB", "VRSN")

	SELECT  a."RISKCD", a."INFOCD", a."PRD", d."IDASCD", d."ASDESC", b."CATCD", b."CSCATCD", b."CAUSE", b."EXCON", b."IMCRCD", b."CHGDA", b."CHGBY", a."ID_IDB", a."VRSN"
	FROM t_IRiskList a
	LEFT JOIN t_IRiskidentification b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
	LEFT JOIN t_InAssets d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
	LEFT JOIN t_IRiskDatabase c ON a."ID_IDB" = c."ID_IDB"
	WHERE a."STATCD" = 'SREG-16' AND a."ENDDA" = '2999-01-01' AND c."ID_IDB" IS NULL;

	DELETE FROM t_IRiskDatabase s
	USING t_IRiskDatabase s_new
	WHERE s."INFOCD" = s_new."INFOCD" AND s."PRD" = s_new."PRD" AND s."VRSN" < s_new."VRSN";

	INSERT INTO t_IRiskDatabaseList ("RISKCD", "INFOCD", "PRD", "IDASCD", "ASDESC", "IRDID", "CHGDA", "CHGBY", "VRSN")
--	SELECT b."RISKCD", b."INFOCD", b."PRD", b."IDASCD", b."ASDESC", b."IRDID", b."CHGDA", b."CHGBY", b."VRSN"
--	FROM t_IRiskDatabase b
--	ORDER BY b."CRAT" DESC LIMIT 1;
	SELECT b."RISKCD", b."INFOCD", b."PRD", b."IDASCD", b."ASDESC", b."IRDID", b."CHGDA", b."CHGBY", b."VRSN"
	FROM t_IRiskDatabase b
	LEFT JOIN t_IRiskDatabaseList g ON b."IRDID" = g."IRDID"
	WHERE g."IRDID" IS NULL;

	DELETE FROM t_IRiskDatabaseList s
	USING t_IRiskDatabaseList s_new
	WHERE s."INFOCD" = s_new."INFOCD" AND s."PRD" = s_new."PRD" AND s."VRSN" < s_new."VRSN";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_iriskdatabaselist();

CREATE OR REPLACE FUNCTION public.f_iriskdatabaselist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_IRiskDatabaseList ("RISKCD", "INFOCD", "PRD", "IDASCD", "ASDESC", "IRDID", "CHGDA", "CHGBY", "VRSN")
	SELECT b."RISKCD", b."INFOCD", b."PRD", b."IDASCD", b."ASDESC", b."IRDID", b."CHGDA", b."CHGBY", b."VRSN"
	FROM t_IRiskDatabase b
	ORDER BY b."CRAT" DESC LIMIT 1;

	DELETE FROM t_IRiskDatabaseList s
	USING t_IRiskDatabaseList s_new
	WHERE s."INFOCD" = s_new."INFOCD" AND s."PRD" = s_new."PRD" AND s."VRSN" < s_new."VRSN";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_iriskdatabaseoff();

CREATE OR REPLACE FUNCTION public.f_iriskdatabaseoff()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

	IF NEW."ENDDA" <> '2999-01-01' THEN
	UPDATE t_IRiskDatabaseList a
	SET "IKEY" = FALSE 
	FROM t_IKeyList b
	WHERE a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD";
	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_irisklist();

CREATE OR REPLACE FUNCTION public.f_irisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN
IF NEW."REFCD" IS NOT NULL THEN
	INSERT INTO t_IRiskList (
		"OBJTV", "RISKCD", "DESC", "IDASCD", "PRD", "INFOCD", 
		"REFCD", "VRSN", "CHGDA", "CHGBY", "STATCD", "PRGS", "REFPRD", "RSCR"
	)
	SELECT 
		b."IDASNM", 
		i."RISKCD", 
		a."ASDESC", 
		i."IDASCD", 
		i."PRD", 
		i."INFOCD", 
		i."REFCD", 
		i."VRSN", 
		i."CHGDA", 
		i."CHGBY", 
		'SREG-1' AS "STATCD", 
		NULL AS "PRGS", 
		i."REFPRD", 
		i."RSCR"
	FROM t_IRiskIdentification i
	LEFT JOIN t_IdAssets b ON i."IDASCD" = b."IDASCD" 
	LEFT JOIN t_InAssets a ON 
		i."RISKCD" = a."RISKCD" 
		AND i."PRD" = a."PRD"
		AND i."VRSN" = a."VRSN"
	ORDER BY i."CRAT" DESC
	LIMIT 1; 
END IF;

	
IF NEW."REFCD" IS NULL THEN
	INSERT INTO t_IRiskList (
		"OBJTV", "RISKCD", "DESC", "IDASCD", "PRD", "INFOCD", 
		"REFCD", "VRSN", "CHGDA", "CHGBY", "REFPRD", "RSCR"
	)
	SELECT 
		b."IDASNM", 
		i."RISKCD", 
		a."ASDESC", 
		i."IDASCD", 
		i."PRD", 
		i."INFOCD", 
		i."REFCD", 
		i."VRSN", 
		i."CHGDA", 
		i."CHGBY", 
		i."REFPRD", 
		i."RSCR"
	FROM t_IRiskIdentification i
	LEFT JOIN t_IdAssets b ON i."IDASCD" = b."IDASCD" 
	LEFT JOIN t_InAssets a ON 
		i."RISKCD" = a."RISKCD" 
		AND i."PRD" = a."PRD"
		AND i."VRSN" = a."VRSN"
	ORDER BY i."CRAT" DESC
	LIMIT 1; 
END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_irisklistinrisco();

CREATE OR REPLACE FUNCTION public.f_irisklistinrisco()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 04 April 2024
	
--	UPDATE t_IRiskList a
--	SET "INRISCO" = b."INRISCO"
--	FROM t_IRiskMeasurement b
--	WHERE a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD";

	UPDATE t_IRiskList a
	SET "INRISCO" = b."INRISCO"
	FROM t_IRiskMeasurement b
	WHERE a."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
	AND	a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_irisklistupdate();

CREATE OR REPLACE FUNCTION public.f_irisklistupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN
	
--	UPDATE t_IRiskList a
--	SET "OBJTV" = c."IDASNM",
--		"DESC" = b."ASDESC",
--		"IDASCD" = b."IDASCD"
----		"PRD" = b."PRD"
--	FROM t_InAssets b
--	LEFT JOIN t_IdAssets c ON b."IDASCD" = c."IDASCD"	
--	WHERE a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN";

	UPDATE t_IRiskList a
	SET "OBJTV" = c."IDASNM",
		"DESC" = b."ASDESC",
		"IDASCD" = b."IDASCD"
--		"PRD" = b."PRD"
	FROM t_InAssets b
	LEFT JOIN t_IdAssets c ON b."IDASCD" = c."IDASCD"	
	WHERE b."INFOCD" IN (SELECT "INFOCD" FROM t_InAssets ORDER BY "CHGDA" DESC LIMIT 1)
	AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_iriskreferences();

CREATE OR REPLACE FUNCTION public.f_iriskreferences()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_IRiskIdentification a
	SET 
		"RISK" = 'Information security breach terhadap data/informasi yang dimiliki oleh Business Unit',
		"CONCD" = b."CONCD",
		"CATCD" = 'CAT-3',
		"CSCATCD" = b."CSCATCD",
		"CAUSE" = b."CAUSE",
		"EXCON" = b."EXCON",
		"SIRCCD" = b."SIRCCD",
		"MSCONCD" = b."MSCONCD",
		"IMCRCD" = b."IMCRCD",
		"IDASCD" = b."IDASCD",
		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_IKeyIdentification b
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_IRiskIdentification ORDER BY "CRAT" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND a."PRD" IS NULL;
--	WHERE a."REFCD" = b."REFCD" AND a."PRD" IS NULL;
--	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_IKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."PRD" IS NULL;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_iriskreferenceslist();

CREATE OR REPLACE FUNCTION public.f_iriskreferenceslist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN	
--	UPDATE t_IRiskList a
--	SET "OBJTV" = c."IDASNM",
--		"DESC" = b."ASDESC",
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
--	FROM t_InAssets b
--	LEFT JOIN t_IdAssets c ON b."IDASCD" = c."IDASCD"	
--	WHERE a."REFCD" = b."REFCD" AND a."REFCD" IS NOT NULL AND b."REFCD" IS NOT NULL;

	UPDATE t_IRiskList a
	SET "OBJTV" = c."IDASNM",
		"DESC" = b."ASDESC",
		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_InAssets b
	LEFT JOIN t_IdAssets c ON b."IDASCD" = c."IDASCD"	
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_InAssets ORDER BY "CRAT" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND a."REFCD" IS NOT NULL AND b."REFCD" IS NOT NULL;


	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_iriskreferencesupdate();

CREATE OR REPLACE FUNCTION public.f_iriskreferencesupdate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_IRiskIdentification a
	SET 
		"RISK" = 'Information security breach terhadap data/informasi yang dimiliki oleh Business Unit',
		"CONCD" = b."CONCD",
		"CATCD" = 'CAT-3',
		"CSCATCD" = b."CSCATCD",
		"CAUSE" = b."CAUSE",
		"EXCON" = b."EXCON",
		"SIRCCD" = b."SIRCCD",
		"MSCONCD" = b."MSCONCD",
		"IMCRCD" = b."IMCRCD",
		"IDASCD" = b."IDASCD"
--		"PRD" = (SELECT concat(extract(year from current_date),'-','12-31')::date)
	FROM t_IKeyIdentification b, t_IRiskList c
--	WHERE a."REFCD" = b."REFCD" AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	WHERE a."REFCD" IN (SELECT "REFCD" FROM t_IKeyIdentification ORDER BY "CHGDA" DESC LIMIT 1) AND a."REFCD" = b."REFCD" AND c."STATCD" IN ('SREG-1', 'SREG-2');--AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND c."STATCD" IN ('SREG-1', 'SREG-2');
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_likelihoodvalue();

CREATE OR REPLACE FUNCTION public.f_likelihoodvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	INSERT INTO t_LikelihoodValue ("BEGDA", "ENDDA", "LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", "CRAT", "CHGDA", "CHGBY", "OPTI", "VAL")
	
	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
 	CASE WHEN tl."VLOW" IS NOT NULL THEN tl."VLOW" ELSE NULL END AS value,
 	CASE WHEN tl."VLOW" IS NOT NULL THEN 1 ELSE NULL END AS score
	FROM t_TemporaryLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
 
	UNION
	
	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
  	CASE WHEN tl."LOW" IS NOT NULL THEN tl."LOW" ELSE NULL END AS value,
  	CASE WHEN tl."LOW" IS NOT NULL THEN 2 ELSE NULL END AS score
	FROM t_TemporaryLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
	CASE WHEN tl."MEDIUM" IS NOT NULL THEN tl."MEDIUM" ELSE NULL END AS value,
	CASE WHEN tl."MEDIUM" IS NOT NULL THEN 3 ELSE NULL END AS score
	FROM t_TemporaryLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
  
    UNION

	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
	CASE WHEN tl."HIGH" IS NOT NULL THEN tl."HIGH" ELSE NULL END AS value,
	CASE WHEN tl."HIGH" IS NOT NULL THEN 4 ELSE NULL END AS score
	FROM t_TemporaryLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY"
 
    UNION

	SELECT tl."BEGDA", tl."ENDDA", tl."LIHOCRCD", tl."LIHOCR", tl."DESC", tl."DATAVAL", tl."CRAT", tl."CHGDA", tl."CHGBY",
	CASE WHEN tl."VHIGH" IS NOT NULL THEN tl."VHIGH" ELSE NULL END AS value,
	CASE WHEN tl."VHIGH" IS NOT NULL THEN 5 ELSE NULL END AS score
	FROM t_TemporaryLikelihood tl
	WHERE "CRAT" = (SELECT MAX("CRAT") FROM t_TemporaryLikelihood)
	GROUP BY "BEGDA", "ENDDA", tl."LIHOCRCD", "LIHOCR", "DESC", "DATAVAL", value, score, "CRAT", "CHGDA", "CHGBY";

--	ORDER BY t_LikelihoodValue."CRAT", t_LikelihoodValue."VAL";

 	RETURN NEW;
 
END;
$function$
;

-- DROP FUNCTION public.f_maxgrisklist();

CREATE OR REPLACE FUNCTION public.f_maxgrisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 	UPDATE t_GRiskList a
    SET "STATCD" = 'SREG-14',
    	"PRGS" = 100
	FROM t_IResidualRisk b
	WHERE a."RISKCD" = b."RISKCD";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_maxinfosec();

CREATE OR REPLACE FUNCTION public.f_maxinfosec()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN
	UPDATE t_GRiskList
	SET "OBJTV"   = (SELECT a."IDASNM"
					FROM t_IdAssets a, t_IRiskIdentification x, t_InAssets y, t_IRiskMeasurement z 
					WHERE x."IDASCD" = a."IDASCD" AND x."INFOCD" = z."INFOCD" AND x."INFOCD" = y."INFOCD"
					ORDER BY z."ADINSC" DESC 
					LIMIT 1),
		"RISKSUM" = (SELECT x."RISK"
					FROM t_IRiskIdentification x, t_InAssets y, t_IRiskMeasurement z 
					WHERE x."INFOCD" = z."INFOCD" AND x."INFOCD" = y."INFOCD"
					ORDER BY z."ADINSC" DESC 
					LIMIT 1),
		"INFOCD" = (SELECT x."INFOCD"
					FROM t_IRiskIdentification x, t_InAssets y, t_IRiskMeasurement z 
					WHERE x."INFOCD" = z."INFOCD" AND x."INFOCD" = y."INFOCD"
					ORDER BY z."ADINSC" DESC 
					LIMIT 1)
	WHERE t_GRiskList."RISKCD" LIKE '%-1';
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_maxiresidualrisk();

CREATE OR REPLACE FUNCTION public.f_maxiresidualrisk()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 25 Maret 202
	UPDATE t_GResidualRisk c
    SET 
		"TGTLICD"  = subquery."TGTLICD",
		"TGTLI"   = subquery."TGTLI",
		"TGTIMCD"   = subquery."TGTIMCD",
		"TGTIM" = subquery."TGTIM",
		"TGTRISC"   = subquery."TGTRISC",
		"TGTRISCAT"   = subquery."TGTRISCAT",
		"CRAT"   = subquery."CRAT",
		"CHGDA"  = subquery."CHGDA",
		"CHGBY"  = subquery."CHGBY"
--		"PRD"    = subquery."PRD"
   
    FROM (
   	SELECT a."RISKCD", a."PRD", d."INFOCD", d."TGTLICD", d."TGTLI", d."TGTIMCD", d."TGTIM", d."TGTRISC", d."TGTRISCAT",
    d."CRAT", d."CHGDA", d."CHGBY", d."VRSN", MAX(b."INRISCO") AS max_inrisco
    FROM t_IRiskIdentification a
    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
    JOIN t_IResidualRisk d ON a."RISKCD" = d."RISKCD" AND a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
    WHERE b."INRISCO" IS NOT NULL
    AND d."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
  	AND a."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
    GROUP BY a."RISKCD", a."PRD", d."INFOCD", d."TGTLICD", d."TGTLI", d."TGTIMCD", d."TGTIM", d."TGTRISC", d."TGTRISCAT",
    d."CRAT", d."CHGDA", d."CHGBY", d."VRSN"
    ORDER BY 14 DESC, 11 DESC LIMIT 1


) AS subquery

WHERE c."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1) AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD" AND c."VRSN" = subquery."VRSN";
	
	
--UPDATE t_GResidualRisk a
--SET 
----	"TGTLICD" 	= (SELECT b."TGTLICD"
----				   FROM t_IResidualRisk b, t_IRiskMeasurement c
----				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
----				   AND c."INRISCO" IS NOT NULL
----				   ORDER BY c."INRISCO" DESC
----				   LIMIT 1),
--	"TGTLI" 	= (SELECT b."TGTLI"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
----	"TGTIMCD" 	= (SELECT b."TGTIMCD"
----				   FROM t_IResidualRisk b, t_IRiskMeasurement c
----				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
----				   AND c."INRISCO" IS NOT NULL
----				   ORDER BY c."INRISCO" DESC
----				   LIMIT 1),
--	"TGTIM" 	= (SELECT b."TGTIM"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"TGTRISC" 	= (SELECT b."TGTRISC"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"TGTRISCAT" = (SELECT b."TGTRISCAT"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"CRAT" 		= (SELECT b."CRAT"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"CHGDA" 	= (SELECT b."CHGDA"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1),
--	"CHGBY" 	= (SELECT b."CHGBY"
--				   FROM t_IResidualRisk b, t_IRiskMeasurement c
--				   WHERE b."RISKCD" = c."RISKCD" AND b."INFOCD" = c."INFOCD"
--				   AND c."INRISCO" IS NOT NULL
--				   ORDER BY c."INRISCO" DESC
--				   LIMIT 1)
--FROM t_IResidualRisk b
--WHERE a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD";
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_maxiriskidentification();

CREATE OR REPLACE FUNCTION public.f_maxiriskidentification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 25 Maret 2024
	
	UPDATE t_GRiskIdentification c
    SET "OBJTV"	  = 'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit',
		"PRONM"   = 'Mengelola Keamanan Informasi Perusahaan',
--		"RISKCD"  = subquery."RISKCD",
		"RISK"    = 'Information security breach terhadap data/informasi yang dimiliki Business Unit',
		"CONCD"   = subquery."CONCD",
		"CATCD"   = subquery."CATCD",
		"CSCATCD" = subquery."CSCATCD",
		"CAUSE"   = subquery."CAUSE",
		"EXCON"   = subquery."EXCON",
		"IMCRCD"  = subquery."IMCRCD",
		"CRAT"    = subquery."CRAT",
		"CHGDA"   = subquery."CHGDA",
		"CHGBY"   = subquery."CHGBY",
		"X4" 	  = subquery."INFOCD"
		
FROM (

	SELECT x.* FROM (
 	     SELECT a."RISKCD", a."CONCD", a."CATCD", a."CSCATCD", a."CAUSE", a."EXCON", a."IMCRCD", 
	    a."CRAT", a."CHGDA", a."CHGBY", a."PRD", b."INFOCD", a."VRSN", MAX(b."INRISCO") AS max_inrisco
	    FROM t_IRiskIdentification a
	    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
	    WHERE b."INRISCO" IS NOT NULL
	    AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
	    AND a."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
	    
	    GROUP BY a."RISKCD", b."INFOCD", a."CONCD", a."CATCD", a."CSCATCD", a."CAUSE", a."EXCON", a."IMCRCD", 
	    a."CRAT", b."CHGDA", a."CHGBY", a."PRD", a."VRSN", a."CHGDA"
	    ORDER BY a."CHGDA" DESC LIMIT 1
--	    ORDER BY 13 DESC, 8 DESC
--	    WHERE "RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
--  	ORDER BY 13 ASC, 9 ASC
	) x
	ORDER BY 14 DESC, 9 DESC LIMIT 1

) AS subquery

WHERE c."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1) AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD" AND c."VRSN" = subquery."VRSN";

	
--	
--	
--	UPDATE t_GRiskIdentification c
--    SET "OBJTV"	  = 'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit',
--		"PRONM"   = 'Mengelola Keamanan Informasi Perusahaan',
----		"RISKCD"  = subquery."RISKCD",
--		"RISK"    = 'Information security breach terhadap data/informasi yang dimiliki Business Unit',
--		"CONCD"   = subquery."CONCD",
--		"CATCD"   = subquery."CATCD",
--		"CSCATCD" = subquery."CSCATCD",
--		"CAUSE"   = subquery."CAUSE",
--		"EXCON"   = subquery."EXCON",
--		"IMCRCD"  = subquery."IMCRCD",
--		"CRAT"    = subquery."CRAT",
--		"CHGDA"   = subquery."CHGDA",
--		"CHGBY"   = subquery."CHGBY"
--   
--    FROM (
--   	    SELECT a."RISKCD", a."CONCD", a."CATCD", a."CSCATCD", a."CAUSE", a."EXCON", a."IMCRCD", 
--	    a."CRAT", a."CHGDA", a."CHGBY", a."PRD", b."INFOCD", MAX(b."INRISCO") AS max_inrisco
--	    FROM t_IRiskIdentification a
--	    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
--	    WHERE b."INRISCO" IS NOT NULL
--	    AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
--	    GROUP BY a."RISKCD", b."INFOCD", a."CONCD", a."CATCD", a."CSCATCD", a."CAUSE", a."EXCON", a."IMCRCD", 
--	    a."CRAT", a."CHGDA", a."CHGBY", a."PRD"
----	    ORDER BY 13 DESC, 8 DESC
--  		ORDER BY 13 ASC, 8 ASC
--) AS subquery
--
--WHERE c."RISKCD" LIKE '%-1' AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD";

	
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_maxiriskmeasurement();

CREATE OR REPLACE FUNCTION public.f_maxiriskmeasurement()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 25 Maret 2024
	UPDATE t_GRiskMeasurement c
    SET 
		"LIHOCD"  = subquery."LIHOCD",
		"LIHOVAL"   = subquery."LIHOVAL",
		"IMVALCD"   = subquery."IMVALCD",
		"IMVAL" = subquery."IMVAL",
		"INRISCO"   = subquery."INRISCO",
		"INRICAT"   = subquery."INRICAT",
		"EXCONLI"  = subquery."EXCONLI",
		"EXCONIM"  = subquery."EXCONIM",
		"ADINLI"   = subquery."ADINLI",
		"ADINIM"   = subquery."ADINIM",
		"ADINSC"  = subquery."ADINSC",
		"ADINSCCAT"  = subquery."ADINSCCAT",
		"CRAT"   = subquery."CRAT",
		"CHGDA"  = subquery."CHGDA",
		"CHGBY"  = subquery."CHGBY"
   
    FROM (
 	SELECT x.* FROM (
	 	SELECT a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
					b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
					b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY", a."PRD", b."VRSN", MAX(b."INRISCO") AS max_inrisco
		    FROM t_IRiskIdentification a
		    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
		    WHERE b."INRISCO" IS NOT NULL
		    AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
		    AND a."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
		    GROUP BY a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
					b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
					b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY", a."PRD", b."VRSN"
	--		ORDER BY 20 ASC, 16 ASC
			ORDER BY b."CHGDA" DESC LIMIT 1
			) x
		ORDER BY 20 DESC, 16 DESC LIMIT 1
    ) AS subquery

WHERE c."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1) AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD" AND c."VRSN" = subquery."VRSN";
    
--    SELECT a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
--			b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
--			b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY", MAX(b."INRISCO") AS max_inrisco
--    FROM t_IRiskIdentification a
--    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
--    WHERE b."INRISCO" IS NOT NULL
--    GROUP BY a."RISKCD", b."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
--			b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
--			b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", b."CHGDA", b."CHGBY"
--	ORDER BY 18 ASC, 15 ASC
	
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_maxirisktreatment();

CREATE OR REPLACE FUNCTION public.f_maxirisktreatment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 19 April 2024
	INSERT INTO t_GRiskTReatment ("BEGDA", "ENDDA", "RISKCD", "ADDCON", "DDLN", "BUDG", "SNBUCD", "EFCONCD", "EFCONVAL", "PIC", "PICNIK", "TRTCD", "PRD", "CHGDA", "CHGBY", "STATCD", "VRSN")


	SELECT "BEGDA", "ENDDA", "RISKCD", "ADDCON", "DDLN", "BUDG", "SNBUCD", "EFCONCD", 000 AS "EFCONVAL", "PIC", "PICNIK", "TRTCD", tk."PRD", "CHGDA", "CHGBY", "STATCD", tk."VRSN"
		FROM t_irisktreatment AS tk
		JOIN
			(SELECT t1."INFOCD", t3."PRD", t3."VRSN" FROM t_IRiskMeasurement t1,
				(SELECT t2."RISKCD", t2."PRD", t2."VRSN", t2."INRISCO", max(t2."CHGDA") AS "CHGDA"
				FROM
				(
				SELECT "RISKCD", "PRD", "VRSN", MAX("INRISCO") AS max--, MAX("CRAT") AS maxtime
				FROM t_IRiskMeasurement
				WHERE "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
				GROUP BY "RISKCD", "PRD", "VRSN"
				) t1
				INNER JOIN t_IRiskMeasurement t2 ON t2."RISKCD" = t1."RISKCD"
				AND t2."PRD" = t1."PRD"
				AND t2."VRSN" = t1."VRSN"
				AND t2."INRISCO" = t1.max
				GROUP BY t2."RISKCD", t2."INRISCO", t2."PRD", t2."VRSN"
				) t3
			 WHERE t1."RISKCD" = t3."RISKCD" AND t1."PRD" = t3."PRD" AND t1."INRISCO" = t3."INRISCO" AND t1."VRSN" = t3."VRSN"
			 AND t1."CHGDA" = t3."CHGDA"
			 AND t1."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
			) AS tm 
		ON tk."INFOCD" = tm."INFOCD" AND tk."PRD" = tm."PRD" AND tk."VRSN" = tm."VRSN";	
	 	
    DELETE FROM t_GRiskTreatment s
	USING t_GRiskTreatment s_new
	WHERE s."CRAT" < s_new."CRAT" AND s."RISKCD" = s_new."RISKCD" AND s."PRD" = s_new."PRD" AND s."VRSN" = s_new."VRSN"
	AND s."RISKCD" LIKE '%-1'; 

--	SELECT "BEGDA", "ENDDA", "RISKCD", "ADDCON", "DDLN", "BUDG", "SNBUCD", "EFCONCD", "EFCONVAL", "PIC", "TRTCD", tk."PRD", "CHGDA", "CHGBY", "STATCD" FROM t_irisktreatment AS tk
--	JOIN
--	(SELECT t1."INFOCD", t2."PRD" FROM t_IRiskMeasurement t1,
--		(
--		SELECT "RISKCD", "PRD", MAX("INRISCO") AS max, MAX("CRAT") AS maxtime
--		FROM t_IRiskMeasurement
--		GROUP BY "RISKCD", "PRD"
--		) t2
--	 WHERE t1."RISKCD" = t2."RISKCD" AND t1."PRD" = t2."PRD" AND t1."INRISCO" = t2.max
--	 AND t1."CRAT" = t2.maxtime
--	) AS tm 
--	ON tk."INFOCD" = tm."INFOCD" AND tk."PRD" = tm."PRD";


  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_maxtrisklist();

CREATE OR REPLACE FUNCTION public.f_maxtrisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_TRiskList ("RISKCD", "RISKSUM", "PRD", "ADDCON", "TRTCD", "CRAT", "CHGDA", "CHGBY", "VRSN", "STATCD")

	SELECT d."RISKCD", c."RISK", d."PRD", d."ADDCON", d."TRTCD",
    		d."CRAT", d."CHGDA", d."CHGBY", d."VRSN",
    CASE WHEN d."STATCD" = '0' THEN 'STRE-0' WHEN d."STATCD" = '1' THEN 'STRE-1' END AS "STATCD"
    FROM t_GRiskTreatment d
    JOIN t_GRiskIdentification c ON d."RISKCD" = c."RISKCD" AND d."PRD" = c."PRD"
    WHERE d."ADDCON" IS NOT NULL AND d."RISKCD" LIKE '%-1'
    GROUP BY d."RISKCD", c."RISK", d."PRD", d."ADDCON", d."STATCD", d."TRTCD",
    		d."CRAT", d."CHGDA", d."CHGBY", d."VRSN";
    	
    DELETE FROM t_TRiskList s
	USING t_TRiskList s_new
	WHERE s."CRAT" < s_new."CRAT" AND s."TRTCD" = s_new."TRTCD" AND s."PRD" = s_new."PRD" AND s."VRSN" = s_new."VRSN"; 
	
-- 	DELETE FROM t_GRiskTreatment s
--	USING t_GRiskTreatment s_new
--	WHERE s."CRAT" < s_new."CRAT" AND s."RISKCD" = s_new."RISKCD" AND s."PRD" = s_new."PRD" AND s."VRSN" = s_new."VRSN"
--	AND s."RISKCD" LIKE '%-1'; 
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_performsum();

CREATE OR REPLACE FUNCTION public.f_performsum()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_PerformSum ("NAM", "NIK", "BUCD", "RLNM", "PRD", "STAT", "SUM", "AVG", "SUMPR", "AVGPR")

--	SELECT a."NAM", a."NIK", e."BUNM", d."RLNM", b."PRD", f."PERSTATNM", FLOOR(SUM("SCORE")), FLOOR(AVG("SCORE")),
--		   CONCAT(FLOOR(SUM("SCORE")),'%'), CONCAT(FLOOR(AVG("SCORE")*10),'%')
		   
	SELECT a."NAM", a."NIK", e."BUNM", d."RLNM", b."PRD", f."PERSTATNM", ROUND(SUM("SCORE"),1), ROUND(AVG("SCORE"),1),
		   CONCAT(ROUND(SUM("SCORE"),1),'%'), CONCAT(ROUND((AVG("SCORE")*10)),'%')
	FROM t_PerformReview a
	LEFT JOIN t_BusinessUnit e ON a."BUCD" = e."BUCD"
	LEFT JOIN t_PerformItem c ON a."PERITCD" = c."PERITCD"
	LEFT JOIN t_PerformRemarks b ON c."PEREMCD" = b."PEREMCD"
	LEFT JOIN t_Role d ON b."RLCD" = d."RLCD"
	LEFT JOIN t_PerformStatus f ON c."PERSTATCD" = f."PERSTATCD"
	WHERE a."ENDDA" = '2999-01-01' AND c."PERSTATCD" = 'STAT-1'
	GROUP BY d."RLNM", a."NAM", a."NIK", e."BUNM", b."PRD", f."PERSTATNM";

-----------------------------------------------------------
--	DELETE FROM t_PerformSum s
--	USING t_PerformSum s_new
--	WHERE s."PESUMID" < s_new."PESUMID"
--	AND s."NIK" = s_new."NIK";
--	AND s."PRD" = s_new."PRD";
	
--	INSERT INTO t_PerformSum ("NAM", "NIK", "BUCD", "RLNM", "SUM", "AVG", "PRD")
--	
--	SELECT c."NAM", c."NIK", a."BUCD", a."RLCD", SUM(c."SCORE"), AVG(c."SCORE") 
--	FROM t_Personal a, t_PerformReview c
--	WHERE c."NIK" = a."NIK" 
--	GROUP BY c."NAM", c."NIK", a."BUCD", "RLCD";
--	
--------------------------------------------------------------

	DELETE FROM t_PerformSum s
	USING t_PerformSum s_new
	WHERE s."CRAT" < s_new."CRAT";
--	AND s."NIK" = s_new."NIK"
--	AND s."PRD" = s_new."PRD";

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_progressgrisklist();

CREATE OR REPLACE FUNCTION public.f_progressgrisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 24 April 2024
	
	PERFORM try_MaxIRiskIdentification();
	PERFORM try_MaxIRiskMeasurement();
	PERFORM try_MaxIResidualRisk();
	PERFORM try_softdeleteirisktreatment();
	PERFORM try_MaxIRiskTreatment();
	PERFORM try_MaxIRiskList();



RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_realisasigeneral();

CREATE OR REPLACE FUNCTION public.f_realisasigeneral()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

--UPDATE t_GResidualRisk r
--	SET "REALI" = residual."REALI",
--		"REAIM" = residual."REAIM",
--		"REARISC" = residual."REARISC",
--		"REARISCAT" = residual."REARISCAT"
--	FROM (
--	SELECT realisasi."RISKCD", realisasi."PRD", realisasi."VRSN", realisasi."REALI", realisasi."REAIM", realisasi."REARISC",
--		   CASE 
--			   WHEN realisasi."REAIM" < 5 AND realisasi."REARISC" < 6 THEN 'Low'
--			   WHEN realisasi."REAIM" = 5 AND realisasi."REARISC" >= 10 THEN 'High'
--			   WHEN realisasi."REAIM" < 5 AND realisasi."REARISC" >= 15 THEN 'High'
--			   WHEN realisasi."REAIM" = 5 AND realisasi."REARISC" < 10 THEN 'Medium'
--		   	   WHEN realisasi."REAIM" IS NULL OR realisasi."REARISC" IS NULL THEN ''
--		   	   WHEN realisasi."REAIM" IS NULL AND realisasi."REARISC" IS NULL THEN ''
--		   	   ELSE 'Medium'
--		   	END AS "REARISCAT"			
--	FROM (
--	
--		SELECT v."RISKCD", v."PRD", v."VRSN",
--			   sum(v."ADINLI" + ((v."TGTLI" - v."ADINLI") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT"))) AS "REALI",
--			   sum(v."ADINIM" + ((v."TGTIM" - v."ADINIM") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT"))) AS "REAIM",
--			   (sum(v."ADINLI" + ((v."TGTLI" - v."ADINLI") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT")))*
--			   sum(v."ADINIM" + ((v."TGTIM" - v."ADINIM") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT")))) AS "REARISC"
--		
--		FROM (
--		SELECT a."RISKCD", a."PRD", a."VRSN", a."ADINLI", a."ADINIM", b."TGTLI", b."TGTIM", COALESCE(d."TEFC3",0)::int AS "TEFC3", COALESCE(e."TEFC4",0)::int AS "TEFC4", COALESCE(c."TOTALTREAT",0)::int AS "TOTALTREAT"
--		FROM t_GRiskMeasurement a
--		LEFT JOIN t_GResidualRisk b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
--		LEFT JOIN (
--			SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."RITREID") AS "TOTALTREAT"
--			FROM t_GRiskTreatment tr
--			GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
--			) AS c 
--		ON a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
--		LEFT JOIN (
--			SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC3"
--			FROM t_GRiskTreatment tr
--			WHERE tr."EFCONCD" = 'EFC-3'
--			GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
--			) AS d
--		ON a."RISKCD" = d."RISKCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
--		LEFT JOIN (
--			SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC4"
--			FROM t_GRiskTreatment tr
--			WHERE tr."EFCONCD" = 'EFC-4'
--			GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
--			) AS e
--		ON a."RISKCD" = e."RISKCD" AND a."PRD" = e."PRD" AND a."VRSN" = e."VRSN"
--		WHERE 
--		"TOTALTREAT" > 0
----		a."RISKCD" IN (SELECT "RISKCD" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01')
----		AND a."PRD" IN (SELECT "PRD" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01')
----		AND a."VRSN" IN (SELECT "VRSN" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01')
--		
--		) AS v
--		GROUP BY v."RISKCD", v."PRD", v."VRSN"
--	) AS realisasi
--	) AS residual
--	WHERE r."RISKCD" = residual."RISKCD" AND r."PRD" = residual."PRD"  AND r."VRSN" = residual."VRSN";
--	

--------------------------------------------------------
--new heatmap
UPDATE t_GResidualRisk r
	SET "REALI" = residual."REALI",
		"REAIM" = residual."REAIM"
	FROM (
		SELECT v."RISKCD", v."PRD", v."VRSN", v."TOTALTREAT",
			CASE WHEN "TOTALTREAT" = 0 THEN NULL WHEN "TOTALTREAT" > 0 THEN sum(v."ADINLI" + ((v."TGTLI" - v."ADINLI") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / (NULLIF(v."TOTALTREAT",0))))) END AS "REALI",
			CASE WHEN "TOTALTREAT" = 0 THEN NULL WHEN "TOTALTREAT" > 0 THEN sum(v."ADINIM" + ((v."TGTIM" - v."ADINIM") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / (NULLIF(v."TOTALTREAT",0))))) END AS "REAIM"   
		FROM (
		SELECT a."RISKCD", a."PRD", a."VRSN", a."ADINLI", a."ADINIM", b."TGTLI", b."TGTIM", COALESCE(d."TEFC3",0)::int AS "TEFC3", COALESCE(e."TEFC4",0)::int AS "TEFC4", COALESCE(c."TOTALTREAT",0)::int AS "TOTALTREAT"
		FROM t_GRiskMeasurement a
		LEFT JOIN t_GResidualRisk b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
		LEFT JOIN (
			SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."RITREID") AS "TOTALTREAT"
			FROM t_GRiskTreatment tr
			GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
			) AS c 
		ON a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
		LEFT JOIN (
			SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC3"
			FROM t_GRiskTreatment tr
			WHERE tr."EFCONCD" = 'EFC-3'
			GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
			) AS d
		ON a."RISKCD" = d."RISKCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
		LEFT JOIN (
			SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC4"
			FROM t_GRiskTreatment tr
			WHERE tr."EFCONCD" = 'EFC-4'
			GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
			) AS e
		ON a."RISKCD" = e."RISKCD" AND a."PRD" = e."PRD" AND a."VRSN" = e."VRSN"
		) AS v
		GROUP BY v."RISKCD", v."PRD", v."VRSN", v."TOTALTREAT"
	) AS residual
	WHERE r."RISKCD" IN (SELECT "RISKCD" FROM t_GRiskTreatment ORDER BY "CHGDA" DESC LIMIT 1)
	AND r."PRD" IN (SELECT "PRD" FROM t_GRiskTreatment ORDER BY "CHGDA" DESC LIMIT 1)
	AND r."VRSN" IN (SELECT "VRSN" FROM t_GRiskTreatment ORDER BY "CHGDA" DESC LIMIT 1)
	AND r."RISKCD" = residual."RISKCD" AND r."PRD" = residual."PRD"  AND r."VRSN" = residual."VRSN";

	
  	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_realisasiinfosec();

CREATE OR REPLACE FUNCTION public.f_realisasiinfosec()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	UPDATE t_IResidualRisk r
--	SET "REALI" = residual."REALI",
--		"REAIM" = residual."REAIM",
--		"REARISC" = residual."REARISC",
--		"REARISCAT" = residual."REARISCAT"
--	FROM (
--	SELECT realisasi."INFOCD", realisasi."PRD", realisasi."VRSN", realisasi."REALI"::int, realisasi."REAIM"::int, realisasi."REARISC"::int,
--		   CASE 
--			   WHEN realisasi."REAIM" < 5 AND realisasi."REARISC" < 6 THEN 'Low'
--			   WHEN realisasi."REAIM" = 5 AND realisasi."REARISC" >= 10 THEN 'High'
--			   WHEN realisasi."REAIM" < 5 AND realisasi."REARISC" >= 15 THEN 'High'
--			   WHEN realisasi."REAIM" = 5 AND realisasi."REARISC" < 10 THEN 'Medium'
--		   	   WHEN realisasi."REAIM" IS NULL OR realisasi."REARISC" IS NULL THEN ''
--		   	   WHEN realisasi."REAIM" IS NULL AND realisasi."REARISC" IS NULL THEN ''
--		   	   ELSE 'Medium'
--		   	END AS "REARISCAT"			
--	FROM (
--	
--		SELECT v."INFOCD", v."PRD", v."VRSN",
--			   sum(v."ADINLI" + ((v."TGTLI" - v."ADINLI") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT")))::int AS "REALI",
--			   sum(v."ADINIM" + ((v."TGTIM" - v."ADINIM") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT")))::int AS "REAIM",
--			   (sum(v."ADINLI" + ((v."TGTLI" - v."ADINLI") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT")))*
--			   sum(v."ADINIM" + ((v."TGTIM" - v."ADINIM") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / v."TOTALTREAT"))))::int AS "REARISC"
--		FROM (
--		SELECT a."RISKCD", a."INFOCD", a."PRD", a."VRSN", a."ADINLI"::int, a."ADINIM"::int, b."TGTLI"::int, b."TGTIM"::int, COALESCE(d."TEFC3",0)::int AS "TEFC3", COALESCE(e."TEFC4",0)::int AS "TEFC4", COALESCE(c."TOTALTREAT",0)::int AS "TOTALTREAT"
--		FROM t_IRiskMeasurement a
--		LEFT JOIN t_IResidualRisk b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
--		LEFT JOIN (
--			SELECT tr."INFOCD", tr."PRD", tr."VRSN", COUNT(tr."RITREID") AS "TOTALTREAT"
--			FROM t_IRiskTreatment tr
--			GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
--			) AS c 
--		ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
--		LEFT JOIN (
--			SELECT tr."INFOCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC3"
--			FROM t_IRiskTreatment tr
--			WHERE tr."EFCONCD" = 'EFC-3'
--			GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
--			) AS d
--		ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
--		LEFT JOIN (
--			SELECT tr."INFOCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC4"
--			FROM t_IRiskTreatment tr
--			WHERE tr."EFCONCD" = 'EFC-4'
--			GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
--			) AS e
--		ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD" and a."VRSN" = e."VRSN"
--		WHERE a."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
--		AND "TOTALTREAT" > 0
--		) AS v
--		GROUP BY v."INFOCD", v."PRD", v."VRSN"
--	) AS realisasi
--	) AS residual
--	WHERE r."INFOCD" = residual."INFOCD" AND r."PRD" = residual."PRD" AND r."VRSN" = residual."VRSN";
--	

--------------------------------------------------
--new heatmap
	UPDATE t_IResidualRisk r
	SET "REALI" = residual."REALI",
		"REAIM" = residual."REAIM"

	FROM (
		SELECT v."INFOCD", v."PRD", v."VRSN", v."TOTALTREAT",
			CASE WHEN "TOTALTREAT" = 0 THEN NULL WHEN "TOTALTREAT" > 0 THEN sum(v."ADINLI" + ((v."TGTLI" - v."ADINLI") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / (NULLIF(v."TOTALTREAT",0))))) END AS "REALI",
			CASE WHEN "TOTALTREAT" = 0 THEN NULL WHEN "TOTALTREAT" > 0 THEN sum(v."ADINIM" + ((v."TGTIM" - v."ADINIM") * ((v."TEFC3" * 1) + (v."TEFC4" * 0.5) / (NULLIF(v."TOTALTREAT",0))))) END AS "REAIM" 
	
		FROM (
		SELECT a."RISKCD", a."INFOCD", a."PRD", a."VRSN", a."ADINLI"::int, a."ADINIM"::int, b."TGTLI"::int, b."TGTIM"::int, COALESCE(d."TEFC3",0)::int AS "TEFC3", COALESCE(e."TEFC4",0)::int AS "TEFC4", COALESCE(c."TOTALTREAT",0)::int AS "TOTALTREAT"
		FROM t_IRiskMeasurement a
		LEFT JOIN t_IResidualRisk b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
		LEFT JOIN (
			SELECT tr."INFOCD", tr."PRD", tr."VRSN", COUNT(tr."RITREID") AS "TOTALTREAT"
			FROM t_IRiskTreatment tr
			GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
			) AS c 
		ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
		LEFT JOIN (
			SELECT tr."INFOCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC3"
			FROM t_IRiskTreatment tr
			WHERE tr."EFCONCD" = 'EFC-3'
			GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
			) AS d
		ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
		LEFT JOIN (
			SELECT tr."INFOCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC4"
			FROM t_IRiskTreatment tr
			WHERE tr."EFCONCD" = 'EFC-4'
			GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
			) AS e
		ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD" and a."VRSN" = e."VRSN"
		WHERE a."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
--		AND "TOTALTREAT" > 0
		) AS v
		GROUP BY v."INFOCD", v."PRD", v."VRSN", v."TOTALTREAT"
	) AS residual
	
	WHERE r."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskTreatment ORDER BY "CHGDA" DESC LIMIT 1)
	AND r."PRD" IN (SELECT "PRD" FROM t_IRiskTreatment ORDER BY "CHGDA" DESC LIMIT 1)
	AND r."VRSN" IN (SELECT "VRSN" FROM t_IRiskTreatment ORDER BY "CHGDA" DESC LIMIT 1)
	AND r."INFOCD" = residual."INFOCD" AND r."PRD" = residual."PRD"  AND r."VRSN" = residual."VRSN";

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_residualgeneral();

CREATE OR REPLACE FUNCTION public.f_residualgeneral()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

DECLARE
    a INT := (SELECT x."EFCONVAL"
	FROM t_GRiskTreatment x, t_GResidualRisk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY x."CRAT" DESC limit 1);
    
	b INT := (SELECT z."ADINLI"
	FROM t_GRiskTreatment x, t_GResidualRisk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY z."CRAT" DESC limit 1);

	c INT := (SELECT z."ADINIM"
	FROM t_GRiskTreatment x, t_GResidualRisk y, t_GRiskMeasurement z
	WHERE  y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY z."CRAT" DESC limit 1);

	d INT := (SELECT y."REALI"
	FROM t_GRiskTreatment x, t_GResidualRisk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);
	
	e INT := (SELECT y."TGTLI"
	FROM t_GRiskTreatment x, t_GResidualRisk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

	f INT := (SELECT y."REAIM"
	FROM t_GRiskTreatment x, t_GResidualRIsk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);	

	g INT := (SELECT y."TGTIM"
	FROM t_GRiskTreatment x, t_GResidualRIsk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

	h INT := (SELECT y."REARISC"
	FROM t_GRiskTreatment x, t_GResidualRIsk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

	i VARCHAR := (SELECT y."REARISCAT"
	FROM t_GRiskTreatment x, t_GResidualRIsk y, t_GRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

BEGIN
	CASE a
        WHEN 1 THEN d := b;
        WHEN 2 THEN d := b - ((b - e) * 0.5);
        WHEN 3 THEN d := d;
        WHEN 4 THEN d := b - ((b - e) * 0.5);
        WHEN 5 THEN d := b;
        ELSE d := 0;
    END CASE; 
	
	CASE a
        WHEN 1 THEN f := c;
        WHEN 2 THEN f := c - ((c - g) * 0.5);
        WHEN 3 THEN f := f;
        WHEN 4 THEN f := c - ((c - g) * 0.5);
        WHEN 5 THEN f := c;
        ELSE f := 0;
    END CASE;

   	h = d * f;
	IF f < 5 AND h < 6 THEN
		i := 'Low';
	ELSEIF f = 5 AND h >= 10 THEN
		i := 'High';
	ELSEIF f < 5 AND h >= 15 THEN
		i := 'High';
	ELSE
		i := 'Medium';
	END IF;

  	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_residualinfosec();

CREATE OR REPLACE FUNCTION public.f_residualinfosec()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

DECLARE
    a INT := (SELECT x.NEW."EFCONVAL"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");
    
	b INT := (SELECT z.NEW."ADINLI"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");

	c INT := (SELECT z.NEW."ADINIM"
	FROM t_IRiskTreatment x, t_IResidualRIsk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");

	d INT := (SELECT y."REALI"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");
	
	e INT := (SELECT y.NEW."TGTLI"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");

	f INT := (SELECT y."REAIM"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");	

	g INT := (SELECT y.NEW."TGTIM"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");

	h INT := (SELECT y."REARISC"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");

	i VARCHAR := (SELECT y."REARISCAT"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD");

BEGIN
	
	CASE a
        WHEN 1 THEN NEW.d := b;
        WHEN 2 THEN NEW.d := b - ((b - e) * 0.5);
        WHEN 3 THEN NEW.d := NEW.d;
        WHEN 4 THEN NEW.d := b - ((b - e) * 0.5);
        WHEN 5 THEN NEW.d := b;
        ELSE NEW.d := 0;
    END CASE; 
	
	CASE a
        WHEN 1 THEN NEW.f := c;
        WHEN 2 THEN NEW.f := c - ((c - g) * 0.5);
        WHEN 3 THEN NEW.f := f;
        WHEN 4 THEN NEW.f := c - ((c - g) * 0.5);
        WHEN 5 THEN NEW.f := c;
        ELSE NEW.f := 0;
    END CASE;

   	NEW.h = NEW.d * NEW.f;
	IF NEW.f < 5 AND NEW.h < 6 THEN
		NEW.i := 'Low';
	ELSEIF NEW.f = 5 AND NEW.h >= 10 THEN
		NEW.i := 'High';
	ELSEIF NEW.f < 5 AND NEW.h >= 15 THEN
		NEW.i := 'High';
	ELSE
		NEW.i := 'Medium';
	END IF;

  	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_residualinfosec2();

CREATE OR REPLACE FUNCTION public.f_residualinfosec2()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

DECLARE
    a INT := (SELECT x."EFCONVAL"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY x."CRAT" DESC limit 1);
    
	b INT := (SELECT z."ADINLI"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY z."CRAT" DESC limit 1);

	c INT := (SELECT z."ADINIM"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE  y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY z."CRAT" DESC limit 1);

	d INT := (SELECT y."REALI"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);
	
	e INT := (SELECT y."TGTLI"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

	f INT := (SELECT y."REAIM"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);	

	g INT := (SELECT y."TGTIM"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

	h INT := (SELECT y."REARISC"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

	i VARCHAR := (SELECT y."REARISCAT"
	FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
	WHERE y."RISKCD" = x."RISKCD" AND y."RISKCD" = z."RISKCD"
	ORDER BY y."CRAT" DESC limit 1);

BEGIN
	CASE a
        WHEN 1 THEN d := b;
        WHEN 2 THEN d := b - ((b - e) * 0.5);
        WHEN 3 THEN d := d;
        WHEN 4 THEN d := b - ((b - e) * 0.5);
        WHEN 5 THEN d := b;
        ELSE d := 0;
    END CASE; 
	
	CASE a
        WHEN 1 THEN f := c;
        WHEN 2 THEN f := c - ((c - g) * 0.5);
        WHEN 3 THEN f := f;
        WHEN 4 THEN f := c - ((c - g) * 0.5);
        WHEN 5 THEN f := c;
        ELSE f := 0;
    END CASE;

   	h = d * f;
	IF f < 5 AND h < 6 THEN
		i := 'Low';
	ELSEIF f = 5 AND h >= 10 THEN
		i := 'High';
	ELSEIF f < 5 AND h >= 15 THEN
		i := 'High';
	ELSE
		i := 'Medium';
	END IF;

--DECLARE
--    a INT;
--    b INT;
--    c INT;
--    d INT;
--    e INT;
--    f INT;
--    g INT;
--    h INT;
--    i VARCHAR;
--BEGIN
--    -- Fetch values based on your business logic
--    SELECT x."EFCONVAL" INTO a
--    FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
--    WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--
--    SELECT z."ADINLI" INTO b
--    FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
--    WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--
--    SELECT z."ADINIM" INTO c
--    FROM t_IRiskTreatment x, t_IResidualRisk y, t_IRiskMeasurement z
--    WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--   
--   	SELECT y."TGTLI" INTO e
--	FROM t_IRiskTreatment x, t_IResidualRIsk y, t_IRiskMeasurement z
--	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--
--	SELECT y."REAIM" into f
--	FROM t_IRiskTreatment x, t_IResidualRIsk y, t_IRiskMeasurement z
--	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";	
--
--	SELECT y."TGTIM" into g
--	FROM t_IRiskTreatment x, t_IResidualRIsk y, t_IRiskMeasurement z
--	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--
--	SELECT y."REARISC" into h
--	FROM t_IRiskTreatment x, t_IResidualRIsk y, t_IRiskMeasurement z
--	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--
--	SELECT y."REARISCAT" into i
--	FROM t_IRiskTreatment x, t_IResidualRIsk y, t_IRiskMeasurement z
--	WHERE y."IDASCD" = x."IDASCD" AND y."IDASCD" = z."IDASCD";
--
--    -- Update 'd' based on 'a', 'b', and 'e'
--    CASE a
--        WHEN 1 THEN d := b;
--        WHEN 2 THEN d := b - ((b - e) * 0.5);
--        WHEN 3 THEN d := d;
--        WHEN 4 THEN d := b - ((b - e) * 0.5);
--        WHEN 5 THEN d := b;
--        ELSE d := 0;
--    END CASE;
--
--    -- Update 'f' based on 'a', 'c', and 'g'
--    CASE a
--        WHEN 1 THEN f := c;
--        WHEN 2 THEN f := c - ((c - g) * 0.5);
--        WHEN 3 THEN f := f;
--        WHEN 4 THEN f := c - ((c - g) * 0.5);
--        WHEN 5 THEN f := c;
--        ELSE f := 0;
--    END CASE;
--
--    -- Calculate 'h' based on 'd' and 'f'
--    h := d * f;
--
--    -- Determine the category 'i' based on 'f' and 'h'
--    IF f < 5 AND h < 6 THEN
--        i := 'Low';
--    ELSIF f = 5 AND h >= 10 THEN
--        i := 'High';
--    ELSIF f < 5 AND h >= 15 THEN
--        i := 'High';
--    ELSE
--        i := 'Medium';
--    END IF;
--
--    -- Finally, update the 'REALI,' 'REAIM,' 'REARISC,' and 'REARISCAT' fields based on 'd,' 'f,' 'h,' and 'i'
----   UPDATE t_IResidualRisk
----    SET "REALI" = d,
----        "REAIM" = f,
----        "REARISC" = h,
----        "REARISCAT" = i
----    WHERE "IDASCD" = NEW."IDASCD" AND	
----    NEW."TGTRISC" = NEW."TGTLI" * NEW."TGTIM";
--
--	IF NEW."TGTIM" < 5 AND NEW."TGTRISC" < 6 THEN
--		NEW."TGTRISCAT" := 'Low';
--	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" >= 10 THEN
--		NEW."TGTRISCAT" := 'High';
--	ELSEIF NEW."TGTIM" < 5 AND NEW."TGTRISC" >= 15 THEN
--		NEW."TGTRISCAT" := 'High';
--	ELSE
--		NEW."TGTRISCAT" := 'Medium';
--	END IF;
   
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_reviewer();

CREATE OR REPLACE FUNCTION public.f_reviewer()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_Users_Role ("USRNM", "NIK", "NAM", "BUCD", "RLCD", "STAT", "CHGBY")
	SELECT a."EML", b."NIK", a."RVWNM", a."BUCD", 'ROLE-7' AS "RLCD", a."STAT", a."SELBY" 
	FROM t_Reviewer a
	JOIN t_Personal b ON a."EML" = b."EML";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_reviewrisk();

CREATE OR REPLACE FUNCTION public.f_reviewrisk()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--	SELECT a."RISKCD", b."RVWNM", a."STATCD", b."NOTES"
--	FROM t_GRiskList a, t_ReviewRisk b;
--	GROUP BY a."RISKCD", b."RVWNM", a."STATCD", b."NOTES";
--	SELECT a."RISKCD", b."RVWNM", a."STATCD", b."NOTES"
----    INTO risk_data
--    FROM t_GRiskList a
--    JOIN t_ReviewRisk b ON a."RISKCD" = b."RISKCD";
--   
--	IF b."NOTES" IS NOT NULL THEN
--		UPDATE t_GRiskList 
--		SET a."STATCD" = 'SREG-7',
--			a."NOTES" = b."NOTES"
--		WHERE b."RISKCD" = a."RISKCD" AND b."PRD" = a."PRD";
--	END IF;
--
--	IF b."NOTES" IS NULL THEN
--		UPDATE t_GRiskList 
--		SET a."STATCD" = 'SREG-6'
--		WHERE b."RISKCD" = a."RISKCD" AND b."PRD" = a."PRD";
--	END IF;

    IF NEW."NOTES" IS NOT NULL THEN
        UPDATE t_GRiskList
        SET "STATCD" = 'SREG-7',
            "NOTES" = NEW."NOTES"
        WHERE "RISKCD" = NEW."RISKCD" AND "PRD" = NEW."PRD";
    ELSE
        UPDATE t_GRiskList
        SET "STATCD" = 'SREG-6'
        WHERE "RISKCD" = NEW."RISKCD" AND "PRD" = NEW."PRD";
    END IF;

--    UPDATE t_ReviewRisk
--    SET "RVWNM" = NEW."RVWNM"
--    WHERE "RISKCD" = NEW."RISKCD" AND "PRD" = NEW."PRD";
--	
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_riskchampion();

CREATE OR REPLACE FUNCTION public.f_riskchampion()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_Users_Role ("USRNM", "NIK", "NAM", "BUCD", "RLCD", "STAT", "CHGBY")
	SELECT b."EML", a."NIK", a."RCHNM", a."BUCD", 'ROLE-5' AS "RLCD", a."STAT", a."SELBY" 
	FROM t_RiskChampion a
	JOIN t_Personal b ON a."NIK" = b."NIK";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_riskmeasurement_newheatmap();

CREATE OR REPLACE FUNCTION public.f_riskmeasurement_newheatmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRISCO" = 1;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 5;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 10;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 15;
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 20;

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 2;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 6;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 11;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 16;
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 3;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 8;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 13;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 18;
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 4;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 9;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 14;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 19;
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRISCO" = 7;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRISCO" = 12;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRISCO" = 17;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRISCO" = 22;
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRISCO" = 25;

	END IF;


	--Likelihood = 1
	IF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 1  THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 1 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 2 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 3 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 4 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 1 THEN
		NEW."INRICAT" = 'Low to Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 2 THEN
		NEW."INRICAT" = 'Moderate';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 3 THEN
		NEW."INRICAT" = 'Moderate to High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 4 THEN
		NEW."INRICAT" = 'High';
	ELSEIF NEW."LIHOVAL" = 5 AND NEW."IMVAL" = 5 THEN
		NEW."INRICAT" = 'High';

	END IF;



	NEW."ADINLI" = NEW."LIHOVAL" - NEW."EXCONLI";
	NEW."ADINIM" = NEW."IMVAL" - NEW."EXCONIM";


	--Likelihood = 1
	IF NEW."ADINLI" = 1 AND NEW."ADINIM" = 1  THEN
		NEW."ADINSC" = 1;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 5;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 10;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 15;
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 20;
	
	--Likelihood = 2
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 2;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 6;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 11;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 16;
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 3;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 8;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 13;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 18;
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 4;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 9;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 14;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 19;
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSC" = 7;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSC" = 12;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSC" = 17;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSC" = 22;
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSC" = 25;

	END IF;


	--Likelihood = 1
	IF NEW."ADINLI" = 1 AND NEW."ADINIM" = 1  THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 1 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 2 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 3 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 4 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 1 THEN
		NEW."ADINSCCAT" = 'Low to Moderate';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 2 THEN
		NEW."ADINSCCAT" = 'Moderate';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 3 THEN
		NEW."ADINSCCAT" = 'Moderate to High';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 4 THEN
		NEW."ADINSCCAT" = 'High';
	ELSEIF NEW."ADINLI" = 5 AND NEW."ADINIM" = 5 THEN
		NEW."ADINSCCAT" = 'High';

	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_riskowner();

CREATE OR REPLACE FUNCTION public.f_riskowner()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	INSERT INTO t_Users_Role ("USRNM", "NIK", "NAM", "BUCD", "RLCD", "STAT", "CHGBY")
	SELECT b."EML", a."NIK", a."ROWNM", a."BUCD", 'ROLE-4' AS "RLCD", a."STAT", a."SELBY" 
	FROM t_RiskOwner a
	JOIN t_Personal b ON a."NIK" = b."NIK";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_riskresidual_newheatmap();

CREATE OR REPLACE FUNCTION public.f_riskresidual_newheatmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISC" = 1;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 5;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 10;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 15;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 20;

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 2;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 6;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 11;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 16;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 3;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 8;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 13;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 18;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 4;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 9;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 14;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 19;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 12;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 17;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 22;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 25;
	
	END IF;


	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	END IF;

	--Likelihood = 1
	IF NEW."REALI" = 1 AND NEW."REAIM" = 1  THEN
		NEW."REARISC" = 1;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 5;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 10;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 15;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 20;

	--Likelihood = 2
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 2;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 6;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 11;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 16;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 3;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 8;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 13;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 18;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 4;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 9;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 14;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 19;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 7;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 12;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 17;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 22;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 25;
	
	END IF;

	--Likelihood = 1
	IF NEW."REALI" = 1 AND NEW."REAIM" = 1  THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'High';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_riskuniversetotal();

CREATE OR REPLACE FUNCTION public.f_riskuniversetotal()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_RiskUniverseTotal a
	SET "BUTOT" = y."BUTOT"
	FROM
	(
--	SELECT "PRD", COUNT("ID") AS "BUTOT" FROM t_RiskRegisterStatus 
--	GROUP BY "PRD"
	SELECT "PRD", COUNT("ID") AS "BUTOT" 
	FROM t_RiskRegisterVersion
	WHERE "BUCD" IN (SELECT "BUCD" FROM t_BusinessUnit WHERE "ENDDA" = '2999-01-01')
	GROUP BY "PRD"
	) y
	WHERE a."PRD" = y."PRD";

	
	UPDATE t_RiskUniverseTotal a
	SET "RISKTOT" = subquery."RISKTOT",
		"CHGDA" = CURRENT_DATE
	FROM (
	SELECT COUNT(x."GRILID") AS "RISKTOT", x."PRD"
	FROM (
	SELECT a."RISKCD", a."PRD", a."VRSN", a."GRILID" FROM t_GRiskList a
	JOIN 
			(SELECT gen."RISKCD"
			, maxver."BUCD", maxver."PRD", maxver."VRSN"
			FROM (
				SELECT "BUCD", "PRD", MAX("VRSN") AS "VRSN"
				FROM t_RiskRegisterVersion 
				GROUP BY "BUCD", "PRD"
				) AS maxver
			LEFT JOIN 
				(SELECT "RISKCD", split_part("RISKCD", '-', 1) AS "BUCD", "PRD", "VRSN"
				FROM t_GRiskList
				WHERE t_GRiskList."ENDDA" = '2999-01-01'
				) AS gen
			ON maxver."BUCD" = gen."BUCD" AND maxver."PRD" = gen."PRD" AND maxver."VRSN" = gen."VRSN"
			ORDER BY maxver."BUCD" ASC) AS vers
	ON a."RISKCD" = vers."RISKCD" AND a."PRD" = vers."PRD" AND a."VRSN" = vers."VRSN"
	) x
	GROUP BY x."PRD"
	) AS subquery
	WHERE a."PRD" = subquery."PRD";


--	UPDATE t_RiskUniverseTotal a
--	SET "RISKTOT" = x."RISKTOT",
--		"CHGDA" = CURRENT_DATE
--	FROM (
--		SELECT "PRD", COUNT("GRILID") AS "RISKTOT" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01'
--		GROUP BY "PRD"
--		UNION
--		SELECT "PRD", COUNT("IRILID") AS "RISKTOT" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01'
--		GROUP BY "PRD"
--	) AS x
--	WHERE a."PRD" = x."PRD";

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_softdeletegtreatment();

CREATE OR REPLACE FUNCTION public.f_softdeletegtreatment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

-- Rafi Muhammad Mahrus 08-09-2025
	
	UPDATE t_TRiskList
	SET "ENDDA"  = del."ENDDA",
		"CHGDA"  = del."CHGDA",
		"ADDCON" = del."ADDCON",
		"CHGBY"  = del."CHGBY",
		"PICNIK" = del."PICNIK"
	FROM 
		(SELECT "ENDDA", "CHGDA", "ADDCON", "CHGBY", "PICNIK"
		FROM t_GRiskTreatment
		ORDER BY "CHGDA" DESC LIMIT 1
		) AS del
	WHERE "TRILID" = ANY (
		SELECT b."TRILID" FROM
		(SELECT * FROM 
			(SELECT "ENDDA", "CHGDA", "ADDCON", "CHGBY", "PICNIK"
			FROM t_GRiskTreatment
			ORDER BY "CHGDA" DESC LIMIT 1
			) AS del
		LEFT JOIN t_GRiskTreatment gdel ON del."ENDDA" = gdel."ENDDA" AND del."CHGDA" = gdel."CHGDA"
		LEFT JOIN t_TRiskList tdel ON gdel."TRTCD" = tdel."TRTCD" AND gdel."PRD" = tdel."PRD" AND gdel."VRSN" = tdel."VRSN"
		) AS b
	);
	
	
--	IF NEW."ENDDA" <> OLD."ENDDA" THEN
--		UPDATE t_TRiskList
--		SET "ENDDA" = NEW."ENDDA"
--		WHERE "TRTCD" = NEW."TRTCD" AND "PRD" = NEW."PRD" AND "VRSN" = NEW."VRSN";
-- 	END IF;
	
 
 
--	UPDATE t_TRiskList a
--	SET "ENDDA" = CURRENT_DATE - 1
--	FROM t_GRiskTreatment b
--	WHERE a."TRTCD" = b."TRTCD";
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_softdeleteitreatment();

CREATE OR REPLACE FUNCTION public.f_softdeleteitreatment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

-- Rafi Mahrus 08-09-2025
	
	UPDATE t_TRiskList
	SET "ENDDA" = del."ENDDA",
		"CHGDA" = del."CHGDA"
	FROM 
		(SELECT "ENDDA", "CHGDA", "ADDCON", "CHGBY", "PICNIK"
		FROM t_IRiskTreatment
		ORDER BY "CHGDA" DESC LIMIT 1
		) AS del
	WHERE "TRILID" = ANY (
		SELECT b."TRILID" FROM
		(SELECT * FROM 
			(SELECT "ENDDA", "CHGDA", "ADDCON", "CHGBY", "PICNIK"
			FROM t_IRiskTreatment
			ORDER BY "CHGDA" DESC LIMIT 1
			) AS del
		LEFT JOIN t_IRiskTreatment gdel ON del."ENDDA" = gdel."ENDDA" AND del."CHGDA" = gdel."CHGDA"
		LEFT JOIN t_TRiskList tdel ON gdel."TRTCD" = tdel."TRTCD" AND gdel."PRD" = tdel."PRD" AND gdel."VRSN" = tdel."VRSN"
		) AS b
	);
	
--	IF NEW."ENDDA" <> OLD."ENDDA" THEN
--		UPDATE t_TRiskList
--		SET "ENDDA" = NEW."ENDDA"
--		WHERE "TRTCD" = NEW."TRTCD" AND "PRD" = NEW."PRD" AND "VRSN" = NEW."VRSN";
-- 	END IF;
	
--	UPDATE t_TRiskList a
--	SET "ENDDA" = CURRENT_DATE - 1
--	FROM t_IRiskTreatment b
--	WHERE a."TRTCD" = b."TRTCD";
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_sortimpactvalue();

CREATE OR REPLACE FUNCTION public.f_sortimpactvalue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

   UPDATE t_ImpactValue t
    SET "VAL" = subquery.new_value
    FROM (
        SELECT "VAL", ROW_NUMBER() OVER (ORDER BY "CRAT") AS new_value
        FROM t_ImpactValue
    ) AS subquery
    WHERE t."VAL" = subquery."VAL";
   
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_sregister_chgda();

CREATE OR REPLACE FUNCTION public.f_sregister_chgda()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW."CHGDA" := current_date
    RETURN;
END;
$function$
;

-- DROP FUNCTION public.f_statusgrisklist();

CREATE OR REPLACE FUNCTION public.f_statusgrisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
		UPDATE t_GRiskList
		SET "STATCD" = 'SREG-15' --Revised from Reject Reviewer
		WHERE "STATCD" = 'SREG-7' AND "PRGS" <= 100; --Need Revision from Reviewer
	
		UPDATE t_GRiskList
		SET "STATCD" = 'SREG-24' --Revised from Reject Risk Owner
		WHERE "STATCD" = 'SREG-23' AND "PRGS" <= 100; --Need Revision from Risk Owner
		
		UPDATE t_GRiskList
		SET "STATCD" = 'SREG-14' --completed
		WHERE "STATCD" = 'SREG-1' AND "PRGS" = 100; --drafted
	
		UPDATE t_GRiskList
		SET "STATCD" = 'SREG-1' --drafted
		WHERE "STATCD" = 'SREG-1' AND "PRGS" < 100; --drafter

		UPDATE t_GRiskList
		SET "STATCD" = 'SREG-1' --drafted
		WHERE "STATCD" = 'SREG-14' AND "PRGS" < 100; --drafter
-----------------------------------------------------------------------------------
--		IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
--		
--		IF TG_OP = 'INSERT' THEN
--        UPDATE t_GRiskList
--        SET "STATCD" = 
--            CASE 
--	            WHEN NEW."STATCD" IS NULL AND NEW."PRGS" = 100 THEN 'SREG-14' -- completed
--	            WHEN NEW."PRGS" = 100 THEN 'SREG-14' -- completed
--	            WHEN NEW."STATCD" IS NULL AND NEW."PRGS" < 100 THEN 'SREG-1' -- completed
--	            WHEN NEW."PRGS" < 100 THEN 'SREG-1' -- completed
--	            WHEN NEW."STATCD" = 'SREG-1' THEN 'SREG-1' --drafted
--	            WHEN NEW."STATCD" = 'SREG-1' AND NEW."PRGS" < 100 THEN 'SREG-1' -- drafted
--	            WHEN NEW."STATCD" = 'SREG-14' AND NEW."PRGS" < 100 THEN 'SREG-1' -- drafted
--              WHEN NEW."STATCD" = 'SREG-1' AND NEW."PRGS" = 100 THEN 'SREG-14' -- completed
--              WHEN NEW."STATCD" = 'SREG-7' AND NEW."PRGS" <= 100 THEN 'SREG-15' -- need revision > revised from reject reviewer
--              WHEN NEW."STATCD" = 'SREG-23' AND NEW."PRGS" <= 100 THEN 'SREG-24' -- need revision > revised from reject risk owner
--            END
--        WHERE "RISKCD" = NEW."RISKCD";
--    	END IF;
--
--		IF TG_OP = 'UPDATE' THEN
--        UPDATE t_GRiskList
--        SET "STATCD" = 
--            CASE 
--	            WHEN OLD."STATCD" IS NULL AND NEW."PRGS" = 100 THEN 'SREG-14' -- completed
--	            WHEN OLD."STATCD" = 'SREG-1' THEN 'SREG-1' --drafted
--	            WHEN OLD."STATCD" = 'SREG-1' AND NEW."PRGS" < 100 THEN 'SREG-1' -- drafted
--                WHEN OLD."STATCD" = 'SREG-14' AND NEW."PRGS" < 100 THEN 'SREG-1' -- drafted
--                WHEN OLD."STATCD" = 'SREG-1' AND NEW."PRGS" = 100 AND "RISKCD" LIKE '%-1' THEN 'SREG-14' -- completed
--                WHEN OLD."STATCD" = 'SREG-7' AND NEW."PRGS" <= 100 THEN 'SREG-15' -- need revision > revised from reject reviewer
--                WHEN OLD."STATCD" = 'SREG-23' AND NEW."PRGS" <= 100 THEN 'SREG-24' -- need revision > revised from reject risk owner
--            END
--        WHERE "RISKCD" = OLD."RISKCD";
--    	END IF;
------------------------------------------------------------------------------------------		
--	IF "STATCD" = 'SREG-1' AND "PRGS" = 100 THEN --drafted
--		UPDATE t_GRiskList a
--		SET "STATCD" = 'SREG-14' --completed
--		FROM t_GRiskList b 
--		WHERE a."RISKCD" = b."RISKCD";
--	END IF;
--	IF "STATCD" = 'SREG-7' AND "PRGS" = 100 THEN --need revision from reviewer
--		UPDATE t_GRiskList a
--		SET "STATCD" = 'SREG-15' --revised from reject reviewer
--		FROM t_GRiskList b 
--		WHERE a."RISKCD" = b."RISKCD";
--	END IF;
--	IF "STATCD" = 'SREG-23' AND "PRGS" = 100 THEN --need revision from risk owner
--		UPDATE t_GRiskList a
--		SET "STATCD" = 'SREG-24' --revised from reject risk owner
--		FROM t_GRiskList b 
--		WHERE a."RISKCD" = b."RISKCD";
--	END IF; 
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_statusirisklist();

CREATE OR REPLACE FUNCTION public.f_statusirisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
		UPDATE t_IRiskList
		SET "STATCD" = 'SREG-15' --Revised from Reject Reviewer
		WHERE "STATCD" = 'SREG-7' AND "PRGS" <= 100; --Need Revision from Reviewer
	
--		UPDATE t_IRiskList
--		SET "STATCD" = 'SREG-24' --Revised from Reject Risk Owner
--		WHERE "STATCD" = 'SREG-23' AND "PRGS" <= 100; --Need Revision from Risk Owner
		
		UPDATE t_IRiskList
		SET "STATCD" = 'SREG-14' --completed
		WHERE "STATCD" = 'SREG-1' AND "PRGS" = 100; --drafted
	
		UPDATE t_IRiskList
		SET "STATCD" = 'SREG-1' --drafted
		WHERE "STATCD" = 'SREG-1' AND "PRGS" < 100; --drafter

		UPDATE t_IRiskList
		SET "STATCD" = 'SREG-1' --drafted
		WHERE "STATCD" = 'SREG-14' AND "PRGS" < 100; --drafter
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_streatment_chgda();

CREATE OR REPLACE FUNCTION public.f_streatment_chgda()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW."CHGDA" := current_date
    RETURN;
END;
$function$
;

-- DROP FUNCTION public.f_targetgeneral();

CREATE OR REPLACE FUNCTION public.f_targetgeneral()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW."TGTRISC" = NEW."TGTLI" * NEW."TGTIM";

	IF NEW."TGTIM" < 5 AND NEW."TGTRISC" < 6 THEN
		NEW."TGTRISCAT" := 'Low';
	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" >= 10 THEN
		NEW."TGTRISCAT" := 'High';
	ELSEIF NEW."TGTIM" < 5 AND NEW."TGTRISC" >= 15 THEN
		NEW."TGTRISCAT" := 'High';
	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" < 10 THEN
		NEW."TGTRISCAT" := 'Medium';
	ELSEIF NEW."TGTIM" IS NULL OR NEW."TGTRISC" IS NULL THEN
		NEW."TGTRISCAT" := '';
	ELSEIF NEW."TGTIM" IS NULL AND NEW."TGTRISC" IS NULL THEN
		NEW."TGTRISCAT" := '';
	ELSE
		NEW."TGTRISCAT" := 'Medium';
	END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_targetgeneral_newhitmap();

CREATE OR REPLACE FUNCTION public.f_targetgeneral_newhitmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISC" = 1;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 5;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 10;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 15;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 20;

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 2;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 6;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 11;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 16;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 3;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 13;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 18;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 4;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 8;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 14;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 19;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 12;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 17;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 22;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 25;
	
	END IF;


	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	END IF;

	--Likelihood = 1
	IF NEW."REALI" = 1 AND NEW."REAIM" = 1  THEN
		NEW."REARISC" = 1;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 5;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 10;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 15;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 20;

	--Likelihood = 2
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 2;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 6;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 11;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 16;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 3;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 7;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 13;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 18;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 4;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 8;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 14;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 19;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 7;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 12;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 17;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 22;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 25;
	
	END IF;

	--Likelihood = 1
	IF NEW."REALI" = 1 AND NEW."REAIM" = 1  THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'High';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	END IF;

	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_targetinfosec();

CREATE OR REPLACE FUNCTION public.f_targetinfosec()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW."TGTRISC" = NEW."TGTLI" * NEW."TGTIM";

	IF NEW."TGTIM" < 5 AND NEW."TGTRISC" < 6 THEN
		NEW."TGTRISCAT" := 'Low';
	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" >= 10 THEN
		NEW."TGTRISCAT" := 'High';
	ELSEIF NEW."TGTIM" < 5 AND NEW."TGTRISC" >= 15 THEN
		NEW."TGTRISCAT" := 'High';
	ELSEIF NEW."TGTIM" = 5 AND NEW."TGTRISC" < 10 THEN
		NEW."TGTRISCAT" := 'Medium';
	ELSEIF NEW."TGTIM" IS NULL OR NEW."TGTRISC" IS NULL THEN
		NEW."TGTRISCAT" := '';
	ELSEIF NEW."TGTIM" IS NULL AND NEW."TGTRISC" IS NULL THEN
		NEW."TGTRISCAT" := '';
	ELSE
		NEW."TGTRISCAT" := 'Medium';
	END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_targetinfosec_newhitmap();

CREATE OR REPLACE FUNCTION public.f_targetinfosec_newhitmap()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	
	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISC" = 1;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 5;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 10;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 15;
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 20;

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 2;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 6;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 11;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 16;
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 3;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 13;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 18;
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 4;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 8;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 14;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 19;
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISC" = 7;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISC" = 12;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISC" = 17;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISC" = 22;
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISC" = 25;
	
	END IF;

	--Likelihood = 1
	IF NEW."TGTLI" = 1 AND NEW."TGTIM" = 1  THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 1 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 2 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 3 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 4 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 1 THEN
		NEW."TGTRISCAT" = 'Low to Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 2 THEN
		NEW."TGTRISCAT" = 'Moderate';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 3 THEN
		NEW."TGTRISCAT" = 'Moderate to High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 4 THEN
		NEW."TGTRISCAT" = 'High';
	ELSEIF NEW."TGTLI" = 5 AND NEW."TGTIM" = 5 THEN
		NEW."TGTRISCAT" = 'High';
	
	END IF;


	--Likelihood = 1
	IF NEW."REALI" = 1 AND NEW."REAIM" = 1  THEN
		NEW."REARISC" = 1;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 5;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 10;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 15;
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 20;

	--Likelihood = 2
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 2;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 6;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 11;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 16;
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 21;
	
	--Likelihood = 3
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 3;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 7;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 13;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 18;
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 23;
	
	--Likelihood = 4
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 4;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 8;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 14;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 19;
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 24;
	
	--Likelihood = 5
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 1 THEN
		NEW."REARISC" = 7;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 2 THEN
		NEW."REARISC" = 12;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 3 THEN
		NEW."REARISC" = 17;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 4 THEN
		NEW."REARISC" = 22;
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 5 THEN
		NEW."REARISC" = 25;
	
	END IF;

	--Likelihood = 1
	IF NEW."REALI" = 1 AND NEW."REAIM" = 1  THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 1 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';

	--Likelihood = 2
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 2 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 3
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 3 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 4
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 4 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	--Likelihood = 5
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 1 THEN
		NEW."REARISCAT" = 'Low to Moderate';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 2 THEN
		NEW."REARISCAT" = 'Moderate';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 3 THEN
		NEW."REARISCAT" = 'Moderate to High';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 4 THEN
		NEW."REARISCAT" = 'High';
	ELSEIF NEW."REALI" = 5 AND NEW."REAIM" = 5 THEN
		NEW."REARISCAT" = 'High';
	
	END IF;


	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_trisklist();

CREATE OR REPLACE FUNCTION public.f_trisklist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 05 April 2024
--Daffa 10 September 2025
--Fixed: Pakai data NEW langsung, bukan query lagi

-- Cek duplikat berdasarkan NEW data
IF NOT EXISTS (
    SELECT 1 FROM t_TRiskList 
    WHERE "RISKCD" = NEW."RISKCD" 
    AND "PRD" = NEW."PRD" 
    AND "VRSN" = NEW."VRSN"
    AND "TRTCD" = NEW."TRTCD"
    AND "ENDDA" = '2999-01-01'
) THEN

    -- Insert langsung pakai NEW data + JOIN untuk RISK
    INSERT INTO t_TRiskList ("ADDCON", "TRTCD", "RISKSUM", "PRD", "RISKCD", "CHGDA", "CHGBY", "VRSN", "PICNIK", "STATCD")
    SELECT 
        NEW."ADDCON", 
        NEW."TRTCD", 
        COALESCE(b."RISK", NEW."ADDCON") AS "RISKSUM", -- Pakai RISK dari join, fallback ke ADDCON
        NEW."PRD", 
        NEW."RISKCD", 
        NEW."CHGDA", 
        NEW."CHGBY", 
        NEW."VRSN", 
        NEW."PICNIK",
        CASE WHEN NEW."STATCD" = '0' THEN 'STRE-0' WHEN NEW."STATCD" = '1' THEN 'STRE-1' END
    FROM (SELECT 1) dummy -- Dummy table untuk FROM clause
    LEFT JOIN t_GRiskIdentification b ON b."RISKCD" = NEW."RISKCD" AND b."PRD" = NEW."PRD" AND b."VRSN" = NEW."VRSN"
    WHERE NEW."RISKCD" IN (SELECT "RISKCD" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01');
    
END IF;

RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_trisklisti();

CREATE OR REPLACE FUNCTION public.f_trisklisti()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

BEGIN
	INSERT INTO t_TRiskList ("ADDCON", "TRTCD", "RISKSUM", "PRD", "RISKCD", "CHGDA", "CHGBY", "VRSN", "PICNIK", "STATCD")
	
	SELECT a."ADDCON", a."TRTCD", 
	b."RISK",
--	'Information security breach terhadap data/informasi yang dimiliki oleh Business Unit' AS "RISK", 
	a."PRD", a."RISKCD", a."CHGDA", a."CHGBY", a."VRSN", a."PICNIK",
	CASE WHEN a."STATCD" = '0' THEN 'STRE-0' WHEN a."STATCD" = '1' THEN 'STRE-1' END
	FROM t_IRiskTreatment a
	LEFT JOIN t_IRiskIdentification b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
	WHERE a."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
	ORDER BY a."RITREID"
	DESC LIMIT 1;

--	INSERT INTO t_TRiskList ("ADDCON", "TRTCD", "RISKSUM", "PRD", "RISKCD", "CHGDA", "CHGBY")
--	
--	SELECT a."ADDCON", a."TRTCD", b."RISK", a."PRD", a."RISKCD", a."CHGDA", a."CHGBY"
--	FROM t_IRiskTreatment a
--	LEFT JOIN t_IRiskIdentification b ON a."RISKCD" = b."RISKCD"
--	ORDER BY a."CRAT"
--	DESC LIMIT 1;
	
--	INSERT INTO t_TRiskList ("ADDCON", "TRCD", "RISKSUM", "PRD")
--	SELECT g."ADDCON", g."TRTCD", i."RISK", g."PRD"
--	FROM t_IRiskTreatment g
--	JOIN t_IRiskIdentification i
--	ON i."RISKCD" = g."RISKCD" 
----	AND i."PRD" = i."PRD"
--	ORDER BY g."CRAT" 
--	DESC limit 1;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_unfreezetreatment();

CREATE OR REPLACE FUNCTION public.f_unfreezetreatment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
--Jihan 2 April 2024
--	PERFORM try_softdeletegrisktreatment();
	
	UPDATE t_TRiskList a
	SET "FRZ" = FALSE
	FROM (
		SELECT *
		FROM (
		SELECT *, split_part("RISKCD",'-',1) AS "BUCD" FROM t_TRiskList
		) AS butreat
		WHERE butreat."BUCD"
		IN (
			SELECT DISTINCT(bu."BUCD") 
			FROM (
			SELECT split_part("RISKCD",'-',1) AS "BUCD", "STATCD" 
			FROM t_GRiskList 
			WHERE "STATCD" = 'SREG-16'
			ORDER BY "CHGDA" DESC LIMIT 1
			) AS bu
		 )
	) AS tr
	WHERE a."TRTCD" = tr."TRTCD" AND a."ENDDA" = '2999-01-01';
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updatecoimpact();

CREATE OR REPLACE FUNCTION public.f_updatecoimpact()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF NEW."ENDDA" <> OLD."ENDDA" THEN
		UPDATE t_CoImpactCriteria
		SET "ENDDA" = NEW."ENDDA"
		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
	IF NEW."ASPCD" <> OLD."ASPCD" THEN
		UPDATE t_CoImpactCriteria
 		SET "ASPCD" = NEW."ASPCD"	
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."IMCRNM" <> OLD."IMCRNM" THEN
		UPDATE t_CoImpactCriteria
 		SET "IMCRNM" = NEW."IMCRNM"	
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."DESC" <> OLD."DESC" THEN
		UPDATE t_CoImpactCriteria
 		SET "DESC" = NEW."DESC"
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 
	IF NEW."ENDDA" <> OLD."ENDDA" THEN
		UPDATE t_CoImpactValue
		SET "ENDDA" = NEW."ENDDA"
		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."ASPCD" <> OLD."ASPCD" THEN
		UPDATE t_CoImpactValue
 		SET "ASPCD" = NEW."ASPCD"	
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
	IF NEW."VLOW" <> OLD."VLOW" THEN
		UPDATE t_CoImpactValue
 		SET "OPTI" = NEW."VLOW"
 		WHERE "VAL" = 1 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."LOW" <> OLD."LOW" THEN
		UPDATE t_CoImpactValue
 		SET "OPTI" = NEW."LOW"
 		WHERE "VAL" = 2 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
  	IF NEW."MEDIUM" <> OLD."MEDIUM" THEN
		UPDATE t_CoImpactValue
 		SET "OPTI" = NEW."MEDIUM"
 		WHERE "VAL" = 3 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
  	IF NEW."HIGH" <> OLD."HIGH" THEN
		UPDATE t_CoImpactValue
 		SET "OPTI" = NEW."HIGH"
 		WHERE "VAL" = 4 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
  	IF NEW."VHIGH" IS DISTINCT FROM OLD."VHIGH" THEN
		UPDATE t_CoImpactValue
 		SET "OPTI" = NEW."VHIGH"
 		WHERE "VAL" = 5 AND "IMCRCD" = NEW."IMCRCD";	
 	END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updatecolikelihood();

CREATE OR REPLACE FUNCTION public.f_updatecolikelihood()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF NEW."ENDDA" <> OLD."ENDDA" THEN
		UPDATE t_CoLikelihoodValue
		SET "ENDDA" = NEW."ENDDA"
		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."LIHOCR" <> OLD."LIHOCR" THEN
		UPDATE t_CoLikelihoodValue
 		SET "LIHOCR" = NEW."LIHOCR"	
 		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."DESC" <> OLD."DESC" THEN
		UPDATE t_CoLikelihoodValue
 		SET "DESC" = NEW."DESC"
 		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."DATAVAL" <> OLD."DATAVAL" THEN
		UPDATE t_CoLikelihoodValue
 		SET "DATAVAL" = NEW."DATAVAL"
 		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 
	IF NEW."VLOW" <> OLD."VLOW" THEN
		UPDATE t_CoLikelihoodValue
 		SET "OPTI" = NEW."VLOW"
 		WHERE "VAL" = 1 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."LOW" <> OLD."LOW" THEN
		UPDATE t_CoLikelihoodValue
 		SET "OPTI" = NEW."LOW"
 		WHERE "VAL" = 2 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
  	IF NEW."MEDIUM" <> OLD."MEDIUM" THEN
		UPDATE t_CoLikelihoodValue
 		SET "OPTI" = NEW."MEDIUM"
 		WHERE "VAL" = 3 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
  	IF NEW."HIGH" <> OLD."HIGH" THEN
		UPDATE t_CoLikelihoodValue
 		SET "OPTI" = NEW."HIGH"
 		WHERE "VAL" = 4 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
  	IF NEW."VHIGH" IS DISTINCT FROM OLD."VHIGH" THEN
		UPDATE t_CoLikelihoodValue
 		SET "OPTI" = NEW."VHIGH"
 		WHERE "VAL" = 5 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updategriskdatabase();

CREATE OR REPLACE FUNCTION public.f_updategriskdatabase()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GRiskDatabase a
	SET "TARECD" = x."TARECD",
		"CORICD" = x."CORICD",
		"DESC" = x."DESC",
		"CHANCD" = x."CHANCD", 
		"REFID" = x."REFID"
	FROM 
		(SELECT b."REFID", c."CORICD", b."CHANCD", b."GRDID" , c."DESC", c."TARECD"
		FROM t_GRiskDatabaseList b, t_CorporateRisk c
		WHERE b."REFID" = c."ID"
		) AS x
	WHERE a."GRDID" = x."GRDID";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updategriskdatabaselist();

CREATE OR REPLACE FUNCTION public.f_updategriskdatabaselist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_GRiskDatabaseList a
	SET "REFID" = x."REFID"::uuid,
		"CORICD" = x."CORICD", --corporate desc
		"CHANCD" = x."CHANCD"
	FROM 
		(SELECT b."REFID", c."CORICD", c."TARECD", b."CHANCD", b."GRDID" , c."DESC", c."TARECD"
		FROM t_GRiskDatabase b, t_CorporateRisk c
		WHERE b."CORICD" = c."CORICD"
		) AS x
	WHERE a."GRDID" = x."GRDID";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updateimpact();

CREATE OR REPLACE FUNCTION public.f_updateimpact()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF NEW."ENDDA" <> OLD."ENDDA" THEN
		UPDATE t_ImpactCriteria
		SET "ENDDA" = NEW."ENDDA"
		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
	IF NEW."ASPCD" <> OLD."ASPCD" THEN
		UPDATE t_ImpactCriteria
 		SET "ASPCD" = NEW."ASPCD"	
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."IMCRNM" <> OLD."IMCRNM" THEN
		UPDATE t_ImpactCriteria
 		SET "IMCRNM" = NEW."IMCRNM"	
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."DESC" <> OLD."DESC" THEN
		UPDATE t_ImpactCriteria
 		SET "DESC" = NEW."DESC"
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 
	IF NEW."ENDDA" <> OLD."ENDDA" THEN
		UPDATE t_ImpactValue
		SET "ENDDA" = NEW."ENDDA"
		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."ASPCD" <> OLD."ASPCD" THEN
		UPDATE t_ImpactValue
 		SET "ASPCD" = NEW."ASPCD"	
 		WHERE "IMCRCD" = NEW."IMCRCD";
 	END IF;
	IF NEW."VLOW" <> OLD."VLOW" THEN
		UPDATE t_ImpactValue
 		SET "OPTI" = NEW."VLOW"
 		WHERE "VAL" = 1 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
 	IF NEW."LOW" <> OLD."LOW" THEN
		UPDATE t_ImpactValue
 		SET "OPTI" = NEW."LOW"
 		WHERE "VAL" = 2 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
  	IF NEW."MEDIUM" <> OLD."MEDIUM" THEN
		UPDATE t_ImpactValue
 		SET "OPTI" = NEW."MEDIUM"
 		WHERE "VAL" = 3 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
  	IF NEW."HIGH" <> OLD."HIGH" THEN
		UPDATE t_ImpactValue
 		SET "OPTI" = NEW."HIGH"
 		WHERE "VAL" = 4 AND "IMCRCD" = NEW."IMCRCD";
 	END IF;
  	IF NEW."VHIGH" IS DISTINCT FROM OLD."VHIGH" THEN
		UPDATE t_ImpactValue
 		SET "OPTI" = NEW."VHIGH"
 		WHERE "VAL" = 5 AND "IMCRCD" = NEW."IMCRCD";	
 	END IF;
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updateiriskdatabase();

CREATE OR REPLACE FUNCTION public.f_updateiriskdatabase()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_IRiskDatabase a
	SET "TARECD" = x."TARECD",
		"CORICD" = x."CORICD",
		"DESC" = x."DESC",
		"CHANCD" = x."CHANCD",
		"REFID" = x."REFID"
	FROM 
		(SELECT b."REFID", c."CORICD", b."CHANCD", b."IRDID" , c."DESC", c."TARECD"
		FROM t_IRiskDatabaseList b, t_CorporateRisk c
		WHERE b."REFID" = c."ID"
		) AS x
	WHERE a."IRDID" = x."IRDID";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updateiriskdatabaselist();

CREATE OR REPLACE FUNCTION public.f_updateiriskdatabaselist()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE t_IRiskDatabaseList a
	SET "REFID" = x."REFID"::uuid,
		"CORICD" = x."CORICD", --corporate desc
		"CHANCD" = x."CHANCD"
	FROM 
		(SELECT b."REFID", c."CORICD", c."TARECD", b."CHANCD", b."IRDID" , c."DESC", c."TARECD"
		FROM t_IRiskDatabase b, t_CorporateRisk c
		WHERE b."CORICD" = c."CORICD"
		) AS x
	WHERE a."IRDID" = x."IRDID";
	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updatelikelihood();

CREATE OR REPLACE FUNCTION public.f_updatelikelihood()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF NEW."ENDDA" <> OLD."ENDDA" THEN
		UPDATE t_LikelihoodValue
		SET "ENDDA" = NEW."ENDDA"
		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."LIHOCR" <> OLD."LIHOCR" THEN
		UPDATE t_LikelihoodValue
 		SET "LIHOCR" = NEW."LIHOCR"	
 		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."DESC" <> OLD."DESC" THEN
		UPDATE t_LikelihoodValue
 		SET "DESC" = NEW."DESC"
 		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."DATAVAL" <> OLD."DATAVAL" THEN
		UPDATE t_LikelihoodValue
 		SET "DATAVAL" = NEW."DATAVAL"
 		WHERE "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 
	IF NEW."VLOW" <> OLD."VLOW" THEN
		UPDATE t_LikelihoodValue
 		SET "OPTI" = NEW."VLOW"
 		WHERE "VAL" = 1 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	IF NEW."LOW" <> OLD."LOW" THEN
		UPDATE t_LikelihoodValue
 		SET "OPTI" = NEW."LOW"
 		WHERE "VAL" = 2 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
  	IF NEW."MEDIUM" <> OLD."MEDIUM" THEN
		UPDATE t_LikelihoodValue
 		SET "OPTI" = NEW."MEDIUM"
 		WHERE "VAL" = 3 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
  	IF NEW."HIGH" <> OLD."HIGH" THEN
		UPDATE t_LikelihoodValue
 		SET "OPTI" = NEW."HIGH"
 		WHERE "VAL" = 4 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
  	IF NEW."VHIGH" IS DISTINCT FROM OLD."VHIGH" THEN
		UPDATE t_LikelihoodValue
 		SET "OPTI" = NEW."VHIGH"
 		WHERE "VAL" = 5 AND "LIHOCRCD" = NEW."LIHOCRCD";
 	END IF;
 	RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.f_updateperformancestatus();

CREATE OR REPLACE FUNCTION public.f_updateperformancestatus()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
--DECLARE
--z := (SELECT current_date);
BEGIN
	-- set @z = SELECT current_date AS z;
	-- SELECT "PRD" AS prd FROM t_PerformRemarks;
	-- IF CURRENT_DATE > prd THEN
	--	UPDATE t_PerformItem a
	--	SET "PERSTATCD" = 'STAT-2'
	--	FROM t_PerformRemarks b
	--	WHERE a."PEREMCD" = b."PEREMCD";
	-- END IF;
	-- COMMIT;
	
	UPDATE t_performitem
	set "PERSTATCD"='STAT-2'
	from
	t_performremarks pr
	where pr."PEREMCD"=t_performitem."PEREMCD" and CURRENT_DATE<pr."PRD";
	
	return null;
	
END;
$function$
;

-- DROP FUNCTION public.f_versioning();

CREATE OR REPLACE FUNCTION public.f_versioning()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

--iriskidentification versioning
INSERT INTO t_IRiskIdentification
("RISKCD", "RISK", "CONCD", "CATCD", "CSCATCD", "CAUSE", "EXCON", "SIRCCD", "MSCONCD", "IMCRCD", "CHGDA", "CHGBY", "IDASCD", "PRD", "INFOCD", "REFCD", "VRSN", "REVISED")

SELECT "RISKCD", "RISK", "CONCD", "CATCD", "CSCATCD", "CAUSE", "EXCON", "SIRCCD", "MSCONCD", "IMCRCD", "CHGDA", "CHGBY", "IDASCD", "PRD", "INFOCD", "REFCD", "VRSN"+1 AS "VRSN", 'v' AS "REVISED"
FROM t_IRiskIdentification
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);


--iriskmeasurement versioning
INSERT INTO t_IRiskMeasurement
--("LIHOVAL", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", "CHGDA", "CHGBY", "IDASCD", "PRD", "LIHOCD", "IMVALCD", "RISKCD", "INFOCD", "VRSN")
("LIHOVAL", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", "CHGBY", "IDASCD", "PRD", "LIHOCD", "IMVALCD", "RISKCD", "INFOCD", "VRSN")

SELECT "LIHOVAL", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", 
--		current_timestamp AS "CHGDA", "CHGBY", "IDASCD", "PRD", "LIHOCD", "IMVALCD", "RISKCD", "INFOCD", "VRSN"+1 AS "VRSN"
		"CHGBY", "IDASCD", "PRD", "LIHOCD", "IMVALCD", "RISKCD", "INFOCD", "VRSN"+1 AS "VRSN"
FROM t_IRiskMeasurement
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);


--iresidualrisk versioning
INSERT INTO t_IResidualRisk
--("PRD", "RISKCD", "TGTLI", "TGTIM", "TGTRISC", "TGTRISCAT", "REALI", "REAIM", "REARISC", "REARISCAT", "CHGDA", "CHGBY", "IDASCD", "INFOCD", "TGTLICD", "TGTIMCD", "VRSN")
("PRD", "RISKCD", "TGTLI", "TGTIM", "TGTRISC", "TGTRISCAT", "REALI", "REAIM", "REARISC", "REARISCAT", "CHGBY", "IDASCD", "INFOCD", "TGTLICD", "TGTIMCD", "VRSN")
	
SELECT "PRD", "RISKCD", "TGTLI", "TGTIM", "TGTRISC", "TGTRISCAT", "REALI", "REAIM", "REARISC", "REARISCAT",
--	   current_timestamp AS "CHGDA", "CHGBY", "IDASCD", "INFOCD", "TGTLICD", "TGTIMCD", "VRSN"+1 AS "VRSN"
	   "CHGBY", "IDASCD", "INFOCD", "TGTLICD", "TGTIMCD", "VRSN"+1 AS "VRSN"
FROM t_IResidualRisk
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);


--griskmeasurement versioning
INSERT INTO t_GRiskMeasurement
("RISKCD", "PRD", "LIHOCD", "LIHOVAL", "IMVALCD", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", "ADINSC", "ADINSCCAT", "CHGDA", "CHGBY", "VRSN")

SELECT "RISKCD", "PRD", "LIHOCD", "LIHOVAL", "IMVALCD", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", "ADINSC", "ADINSCCAT",
		current_timestamp AS "CHGDA", "CHGBY", "VRSN"+1 AS "VRSN"
FROM t_GRiskMeasurement
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "RISKCD" IN (SELECT "RISKCD" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);
	

--gresidualrisk versioning
INSERT INTO t_GResidualRisk
("PRD", "RISKCD", "TGTLI", "TGTIM", "TGTRISC", "TGTRISCAT", "REALI", "REAIM", "REARISC", "REARISCAT", "CHGDA", "CHGBY", "TGTLICD", "TGTIMCD", "VRSN")
	
SELECT "PRD", "RISKCD", "TGTLI", "TGTIM", "TGTRISC", "TGTRISCAT", "REALI", "REAIM", "REARISC", "REARISCAT",
	   current_timestamp AS "CHGDA", "CHGBY", "TGTLICD", "TGTIMCD", "VRSN"+1 AS "VRSN"
FROM t_GResidualRisk
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "RISKCD" IN (SELECT "RISKCD" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);


--inthreat versioning
INSERT INTO t_InThreat
("RISKCD", "ISSTH", "IMPRCD", "IDASCD", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN")
	
SELECT "RISKCD", "ISSTH", "IMPRCD", "IDASCD", current_date AS "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN"+1 AS "VRSN"
FROM t_InThreat
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);
	

--invulnerability versioning
INSERT INTO t_InVulnerability
("RISKCD", "IDASCD", "ISSVUL", "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN")

SELECT "RISKCD", "IDASCD", "ISSVUL", current_date AS "CHGDA", "CHGBY", "PRD", "INFOCD", "REFCD", "VRSN"+1 AS "VRSN"
FROM t_InVulnerability
WHERE split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN")-1 FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);


--update grisklist from enforce
UPDATE t_GRiskList
SET "STATCD" = 'SREG-2',
	"PRGS" = 100
WHERE "REFCD" IS NOT NULL
AND split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "RISKCD" IN (SELECT "RISKCD" FROM t_GRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);
	

--update irisklist from enforce
UPDATE t_IRiskList
SET "STATCD" = 'SREG-2',
	"PRGS" = 100
WHERE "REFCD" IS NOT NULL
AND split_part("RISKCD",'-',1) IN (SELECT "BUCD" FROM t_RiskRegisterStatus WHERE "VRSN" > 0 ORDER BY "CRAT" DESC LIMIT 1)
AND "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
AND "PRD" IN (
	SELECT MAX("PRD") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1)
AND "VRSN" IN (
	SELECT MAX("VRSN") FROM t_RiskRegisterStatus 
	WHERE "VRSN" > 0
	GROUP BY "CRAT"
	ORDER BY "CRAT" DESC LIMIT 1);	

	
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.generate_coba_risk_universe(in date, out varchar, out text, out text, out text, out text, out varchar, out text, out varchar, out varchar, out varchar, out text, out text, out varchar, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out int4, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out varchar);

CREATE OR REPLACE FUNCTION public.generate_coba_risk_universe(prd date, OUT "DIRNM" character varying, OUT "STATUS" text, OUT "BUCD" text, OUT "OBJTV" text, OUT "PRONM" text, OUT "RISKCD" character varying, OUT "RISK" text, OUT "CONNM" character varying, OUT "CATNM" character varying, OUT "CSCATNM" character varying, OUT "CAUSE" text, OUT "EXCON" text, OUT "IMRCNM" character varying, OUT "LIHONM" text, OUT "LIHOVAL" integer, OUT "IMVALNM" text, OUT "IMVAL" integer, OUT "INRISCO" integer, OUT "INRICAT" character varying, OUT "EXCONLI" integer, OUT "EXCONIM" integer, OUT "ADINLI" integer, OUT "ADINIM" integer, OUT "ADINSC" integer, OUT "ADINSCCAT" character varying, OUT "TADDCON" integer, OUT "TEFC1" integer, OUT "TEFC2" integer, OUT "TEFC3" integer, OUT "TEFC4" integer, OUT "TEFC5" integer, OUT "TGTLICD" text, OUT "TGTLI" integer, OUT "TGTIMCD" text, OUT "TGTIM" integer, OUT "TGTRISC" integer, OUT "TGTRISCAT" character varying, OUT "REALI" integer, OUT "REAIM" integer, OUT "REARISC" integer, OUT "REARISCAT" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
SELECT 
	   dir."DIRNM" AS "DIRNM",
	   n."OBJDS" AS "STATUS",
	   split_part(a."RISKCD",'-',1) AS "BUCD",
	   b."OBJTV", b."PRONM", a."RISKCD", b."RISK",
	   f."CONNM", g."CATNM", h."CSCATNM", b."CAUSE", b."EXCON", i."IMCRNM",
	   j."OPTI" AS "LIHONM", c."LIHOVAL", k."OPTI" AS "IMVALNM", c."IMVAL", c."INRISCO", c."INRICAT",
	   c."EXCONLI", c."EXCONIM", c."ADINLI", c."ADINIM", c."ADINSC", c."ADINSCCAT",
	   d."TADDCON"::int AS "TADDCON", p."TEFC1"::int AS "TEFC1", q."TEFC2"::int AS "TEFC2", r."TEFC3"::int AS "TEFC3", s."TEFC4"::int AS "TEFC4", t."TEFC5"::int AS "TEFC5",
	   l."OPTI" AS "TGTLICD", e."TGTLI", m."OPTI" AS "TGTIMCD", e."TGTIM", e."TGTRISC", e."TGTRISCAT",
	   e."REALI", e."REAIM", e."REARISC", e."REARISCAT"
FROM t_GRiskList a
LEFT JOIN t_Object n ON a."STATCD" = n."STEXT"
LEFT JOIN t_GRiskIdentification b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD"
LEFT JOIN t_GRiskMeasurement c ON a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", COUNT(tr."ID") AS "TADDCON"
	FROM t_GRiskTreatment tr
	GROUP BY tr."RISKCD", tr."PRD"
	) AS d
	ON a."RISKCD" = d."RISKCD" AND a."PRD" = d."PRD"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", COUNT(tr."EFCONCD") AS "TEFC1"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-1'
	GROUP BY tr."RISKCD", tr."PRD"
	) AS p
	ON a."RISKCD" = p."RISKCD" AND a."PRD" = p."PRD"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", COUNT(tr."EFCONCD") AS "TEFC2"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-2'
	GROUP BY tr."RISKCD", tr."PRD"
	) AS q
	ON a."RISKCD" = q."RISKCD" AND a."PRD" = q."PRD"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", COUNT(tr."EFCONCD") AS "TEFC3"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-3'
	GROUP BY tr."RISKCD", tr."PRD"
	) AS r
	ON a."RISKCD" = r."RISKCD" AND a."PRD" = r."PRD"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", COUNT(tr."EFCONCD") AS "TEFC4"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-4'
	GROUP BY tr."RISKCD", tr."PRD"
	) AS s
	ON a."RISKCD" = s."RISKCD" AND a."PRD" = s."PRD"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", COUNT(tr."EFCONCD") AS "TEFC5"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-5'
	GROUP BY tr."RISKCD", tr."PRD"
	) AS t
	ON a."RISKCD" = t."RISKCD" AND a."PRD" = t."PRD"
LEFT JOIN t_GResidualRisk e ON a."RISKCD" = e."RISKCD" AND a."PRD" = e."PRD"
LEFT JOIN t_Condition f ON b."CONCD" = f."CONCD"
LEFT JOIN t_Categorization g ON b."CATCD" = g."CATCD"
LEFT JOIN t_CauseCategory h ON b."CSCATCD" = h."CSCATCD"
LEFT JOIN t_ImpactCriteria i ON b."IMCRCD" = i."IMCRCD"
LEFT JOIN t_LikelihoodValue j ON c."LIHOCD" = j."LIHOCD"
LEFT JOIN t_ImpactValue k ON c."IMVALCD" = k."IMVALCD"
LEFT JOIN t_LikelihoodValue l ON e."TGTLICD" = l."LIHOCD"
LEFT JOIN t_ImpactValue m ON e."TGTIMCD" = m."IMVALCD"
LEFT JOIN (
SELECT bu."RISKCD", bu."PRD", bu."BUCD", direktorat."DIRNM", direktorat."SUBDIRNM"
FROM
	(SELECT gr."RISKCD", gr."PRD", split_part(gr."RISKCD",'-',1) AS "BUCD" FROM t_GRiskList gr
	) AS bu
LEFT JOIN 
	(SELECT 
	a."STEXT" AS "BUCD", a."LTEXT" AS "BUNM", 
	dir."DIRCD" AS "DIRCD", dir."DIRNM" AS "DIRNM",
	sdir."DIRCD" AS "SUBDIRCD", sdir."DIRNM" AS "SUBDIRNM"
	FROM t_Object a
	LEFT JOIN 
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('DIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS dir
	ON a."STEXT" = dir."BUCD"
	LEFT JOIN
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('SUBDIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS sdir
	ON a."STEXT" = sdir."BUCD"
	WHERE a."OTYPE" = 'BUCD' 
	ORDER BY a."STEXT"
	) AS direktorat
	ON bu."BUCD" = direktorat."BUCD"
) AS dir
ON a."RISKCD" = dir."RISKCD" AND a."PRD" = dir."PRD" 
WHERE a."ENDDA" = '2999-01-01' AND a."PRD" = prd
ORDER BY a."RISKCD", a."CRAT";
END
$function$
;

-- DROP FUNCTION public.generate_coba_risk_universe(in date, out varchar, out text, out text, out text, out text, out varchar, out varchar, out text, out text, out text, out varchar, out text, out varchar, in varchar, out text, out text, out varchar, out text, out varchar, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out int4, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out varchar);

CREATE OR REPLACE FUNCTION public.generate_coba_risk_universe(prd date, OUT "DIRNM" character varying, OUT "STATUS" text, OUT "BUCD" text, OUT "ISSVUL" text, OUT "ISSTH" text, OUT "IMPRNM" character varying, OUT "IDASNM" character varying, OUT "ASDESC" text, OUT "ASOWN" text, OUT "ASLOC" text, OUT "RISKCD" character varying, OUT "RISK" text, OUT "CONNM" character varying, "CSCATNM" character varying, OUT "CAUSE" text, OUT "EXCON" text, OUT "SIRCNM" character varying, OUT "MSCONNM" text, OUT "IMRCNM" character varying, OUT "LIHONM" text, OUT "LIHOVAL" integer, OUT "IMVALNM" text, OUT "IMVAL" integer, OUT "INRISCO" integer, OUT "INRICAT" character varying, OUT "EXCONLI" integer, OUT "EXCONIM" integer, OUT "ADINLI" integer, OUT "ADINIM" integer, OUT "ADINSC" integer, OUT "ADINSCCAT" character varying, OUT "TADDCON" integer, OUT "TEFC1" integer, OUT "TEFC2" integer, OUT "TEFC3" integer, OUT "TEFC4" integer, OUT "TEFC5" integer, OUT "TGTLICD" text, OUT "TGTLI" integer, OUT "TGTIMCD" text, OUT "TGTIM" integer, OUT "TGTRISC" integer, OUT "TGTRISCAT" character varying, OUT "REALI" integer, OUT "REAIM" integer, OUT "REARISC" integer, OUT "REARISCAT" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
SELECT  
	    dir."DIRNM" AS "DIRNM",
	    n."OBJDS" AS "STATUS",
	    split_part(a."RISKCD",'-',1) AS "BUCD",
		b."ISSVUL", 
		c."ISSTH", pr."IMPRNM",
		ida."IDASNM", d."ASDESC", d."ASOWN", d."ASLOC", 
		a."RISKCD", e."RISK", con."CONNM", cscat."CSCATNM", e."CAUSE", e."EXCON",
		sir."SIRCNM", 
		isms."MSCONNM", 
		imc."IMCRNM",
		liho1."OPTI" AS "LIHONM", f."LIHOVAL", imv1."OPTI" AS "IMVALNM", f."IMVAL", f."INRISCO", f."INRICAT",
		f."EXCONLI", f."EXCONIM", f."ADINLI", f."ADINIM", f."ADINSC", f."ADINSCCAT",
		g."TADDCON"::int AS "TADDCON", h."TEFC1"::int AS "TEFC1", i."TEFC2"::int AS "TEFC2", j."TEFC3"::int AS "TEFC3", k."TEFC4"::int AS "TEFC4", l."TEFC5"::int AS "TEFC5",
		liho2."OPTI" AS "TGTLICD", m."TGTLI", imv2."OPTI" AS "TGTIMCD", m."TGTIM", m."TGTRISC", m."TGTRISCAT",
		m."REALI", m."REAIM", m."REARISC", m."REARISCAT"
FROM t_IRiskList a
LEFT JOIN t_Object n ON a."STATCD" = n."STEXT"
LEFT JOIN t_InVulnerability b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD"
LEFT JOIN t_InThreat c ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD"
LEFT JOIN t_InAssets d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD"
LEFT JOIN t_IRiskIdentification e ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD"
LEFT JOIN t_IRiskMeasurement f ON a."INFOCD" = f."INFOCD" AND a."PRD" = f."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."RITREID") AS "TADDCON"
	FROM t_IRiskTreatment tr
	GROUP BY tr."INFOCD", tr."PRD"
	) AS g
	ON a."INFOCD" = g."INFOCD" AND a."PRD" = g."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC1"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-1'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS h
	ON a."INFOCD" = h."INFOCD" AND a."PRD" = h."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC2"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-2'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS i
	ON a."INFOCD" = i."INFOCD" AND a."PRD" = i."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC3"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-3'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS j
	ON a."INFOCD" = j."INFOCD" AND a."PRD" = j."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC4"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-4'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS k
	ON a."INFOCD" = k."INFOCD" AND a."PRD" = k."PRD"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", COUNT(tr."EFCONCD") AS "TEFC5"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-5'
	GROUP BY tr."INFOCD", tr."PRD"
	) AS l
	ON a."INFOCD" = l."INFOCD" AND a."PRD" = l."PRD"
LEFT JOIN t_IResidualRisk m ON a."INFOCD" = m."INFOCD" AND a."PRD" = m."PRD"
LEFT JOIN t_IdAssets ida ON d."IDASCD" = ida."IDASCD"
LEFT JOIN t_ImpactToProcess pr ON c."IMPRCD" = pr."IMPRCD"
LEFT JOIN t_Condition con ON e."CONCD" = con."CONCD"
LEFT JOIN t_Categorization cat ON e."CATCD" = cat."CATCD"
LEFT JOIN t_CauseCategory cscat ON e."CSCATCD" = cscat."CSCATCD"
LEFT JOIN t_ImpactCriteria imc ON e."IMCRCD" = imc."IMCRCD"
LEFT JOIN t_IsmsControl ms ON e."MSCONCD" = ms."MSCONCD" 
LEFT JOIN t_LikelihoodValue liho1 ON f."LIHOCD" = liho1."LIHOCD"
LEFT JOIN t_ImpactValue imv1 ON f."IMVALCD" = imv1."IMVALCD"
LEFT JOIN t_LikelihoodValue liho2 ON m."TGTLICD" = liho2."LIHOCD"
LEFT JOIN t_ImpactValue imv2 ON m."TGTIMCD" = imv2."IMVALCD"
LEFT JOIN t_SystemInfoRC sir ON e."SIRCCD" = sir."SIRCCD"
LEFT JOIN (
SELECT bu."RISKCD", bu."INFOCD", bu."PRD", bu."BUCD", direktorat."DIRNM", direktorat."SUBDIRNM"
FROM
	(SELECT ir."RISKCD", ir."INFOCD", ir."PRD", split_part(ir."RISKCD",'-',1) AS "BUCD" FROM t_IRiskList ir
	) AS bu
LEFT JOIN 
	(SELECT 
	a."STEXT" AS "BUCD", a."LTEXT" AS "BUNM", 
	dir."DIRCD" AS "DIRCD", dir."DIRNM" AS "DIRNM",
	sdir."DIRCD" AS "SUBDIRCD", sdir."DIRNM" AS "SUBDIRNM"
	FROM t_Object a
	LEFT JOIN 
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('DIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS dir
	ON a."STEXT" = dir."BUCD"
	LEFT JOIN
	(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
	FROM t_Object x
	LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
	WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('SUBDIRCD'))
	AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD')
	ORDER BY x."STEXT" ASC
	) AS sdir
	ON a."STEXT" = sdir."BUCD"
	WHERE a."OTYPE" = 'BUCD' 
	ORDER BY a."STEXT"
	) AS direktorat
	ON bu."BUCD" = direktorat."BUCD"
) AS dir
ON a."INFOCD" = dir."INFOCD" AND a."PRD" = dir."PRD"

LEFT JOIN (
	SELECT z."INFOCD", string_agg(z."OPTI", ',') AS "MSCONNM"
	FROM (
	SELECT x."INFOCD", x."ISMS", y."OPTI"
	FROM (SELECT "INFOCD", UNNEST(STRING_TO_ARRAY("MSCONCD", ',')) AS "ISMS" FROM t_IRiskIdentification a
		 ) AS x
	JOIN t_IsmsControl y ON x."ISMS" = y."MSCONCD"
	ORDER BY x."INFOCD"
	) AS z
	GROUP BY 1
	) AS isms
ON e."INFOCD" = isms."INFOCD"
WHERE a."ENDDA" = '2999-01-01' AND a."PRD" = prd
ORDER BY a."RISKCD", a."CRAT";
END
$function$
;

-- DROP FUNCTION public.generate_general_risk_universe(in date, out varchar, out text, out varchar, out int4, out text, out text, out varchar, out text, out varchar, out varchar, out varchar, out text, out text, out varchar, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out int4, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out varchar, out text, out varchar, out text, out varchar, out varchar);

CREATE OR REPLACE FUNCTION public.generate_general_risk_universe(prd date, OUT "DIREKTORAT" character varying, OUT "STATUS" text, OUT "BUNM" character varying, OUT "VRSN" integer, OUT "OBJTV" text, OUT "PRONM" text, OUT "RISKCD" character varying, OUT "RISK" text, OUT "CONNM" character varying, OUT "CATNM" character varying, OUT "CSCATNM" character varying, OUT "CAUSE" text, OUT "EXCON" text, OUT "IMRCNM" character varying, OUT "LIHONM" text, OUT "LIHOVAL" integer, OUT "IMVALNM" text, OUT "IMVAL" integer, OUT "INRISCO" integer, OUT "INRICAT" character varying, OUT "EXCONLI" integer, OUT "EXCONIM" integer, OUT "ADINLI" integer, OUT "ADINIM" integer, OUT "ADINSC" integer, OUT "ADINSCCAT" character varying, OUT "TADDCON" integer, OUT "TEFC1" integer, OUT "TEFC2" integer, OUT "TEFC3" integer, OUT "TEFC4" integer, OUT "TEFC5" integer, OUT "TGTLICD" text, OUT "TGTLI" integer, OUT "TGTIMCD" text, OUT "TGTIM" integer, OUT "TGTRISC" integer, OUT "TGTRISCAT" character varying, OUT "REALI" integer, OUT "REAIM" integer, OUT "REARISC" integer, OUT "REARISCAT" character varying, OUT "CORISK" text, OUT "CORICD" character varying, OUT "CODESC" text, OUT "TARENM" character varying, OUT "CHANNM" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
SELECT 
	   dir."DIREKTORAT"::varchar AS "DIREKTORAT",
	   n."OBJDS" AS "STATUS",
	   dir."BUNM",
	   a."VRSN"::int,
	   b."OBJTV", b."PRONM", a."RISKCD", b."RISK",
	   f."CONNM", g."CATNM", h."CSCATNM", b."CAUSE", b."EXCON", i."IMCRNM",
	   j."OPTI" AS "LIHONM", c."LIHOVAL", k."OPTI" AS "IMVALNM", c."IMVAL", c."INRISCO", c."INRICAT",
	   c."EXCONLI", c."EXCONIM", c."ADINLI", c."ADINIM", c."ADINSC", c."ADINSCCAT",
	   d."TADDCON"::int AS "TADDCON", p."TEFC1"::int AS "TEFC1", q."TEFC2"::int AS "TEFC2", r."TEFC3"::int AS "TEFC3", s."TEFC4"::int AS "TEFC4", t."TEFC5"::int AS "TEFC5",
	   l."OPTI" AS "TGTLICD", e."TGTLI", m."OPTI" AS "TGTIMCD", e."TGTIM", e."TGTRISC", e."TGTRISCAT",
	   e."REALI", e."REAIM", e."REARISC", e."REARISCAT",
	   b."RISK" AS "CORISK", corp."CORICD", corp."DESC" AS "CODESC", tare."TARENM", chan."CHANNM"
FROM t_GRiskList a
LEFT JOIN t_Object n ON a."STATCD" = n."STEXT"
LEFT JOIN t_GRiskIdentification b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
LEFT JOIN t_GRiskMeasurement c ON a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."RITREID") AS "TADDCON"
	FROM t_GRiskTreatment tr
	GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
	) AS d
	ON a."RISKCD" = d."RISKCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC1"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-1'
	GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
	) AS p
	ON a."RISKCD" = p."RISKCD" AND a."PRD" = p."PRD" AND a."VRSN" = p."VRSN"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC2"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-2'
	GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
	) AS q
	ON a."RISKCD" = q."RISKCD" AND a."PRD" = q."PRD" AND a."VRSN" = q."VRSN"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC3"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-3'
	GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
	) AS r
	ON a."RISKCD" = r."RISKCD" AND a."PRD" = r."PRD" AND a."VRSN" = r."VRSN"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC4"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-4'
	GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
	) AS s
	ON a."RISKCD" = s."RISKCD" AND a."PRD" = s."PRD" AND a."VRSN" = s."VRSN"
LEFT JOIN 
	(SELECT tr."RISKCD", tr."PRD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC5"
	FROM t_GRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-5'
	GROUP BY tr."RISKCD", tr."PRD", tr."VRSN"
	) AS t
	ON a."RISKCD" = t."RISKCD" AND a."PRD" = t."PRD" AND a."VRSN" = t."VRSN"
LEFT JOIN t_GResidualRisk e ON a."RISKCD" = e."RISKCD" AND a."PRD" = e."PRD" AND a."VRSN" = e."VRSN"
LEFT JOIN t_Condition f ON b."CONCD" = f."CONCD"
LEFT JOIN t_Categorization g ON b."CATCD" = g."CATCD"
LEFT JOIN t_CauseCategory h ON b."CSCATCD" = h."CSCATCD"
LEFT JOIN t_ImpactCriteria i ON b."IMCRCD" = i."IMCRCD"
LEFT JOIN t_LikelihoodValue j ON c."LIHOCD" = j."LIHOCD"
LEFT JOIN t_ImpactValue k ON c."IMVALCD" = k."IMVALCD"
LEFT JOIN t_LikelihoodValue l ON e."TGTLICD" = l."LIHOCD"
LEFT JOIN t_ImpactValue m ON e."TGTIMCD" = m."IMVALCD"
LEFT JOIN t_GRiskDatabase gdb ON a."RISKCD" = gdb."RISKCD" AND a."PRD" = gdb."PRD" AND a."VRSN" = gdb."VRSN"
LEFT JOIN t_CorporateRisk corp ON gdb."REFID"::varchar = corp."ID"::varchar
LEFT JOIN t_ChainAnalysis chan ON gdb."CHANCD" = chan."CHANCD"
LEFT JOIN t_CoTaksonomiResiko tare ON corp."TARECD" = tare."TARECD"
LEFT JOIN (
	SELECT z."RISKCD", z."PRD", z."VRSN", z."BUNM",
	CASE WHEN "DIRNM" IS NOT NULL THEN "DIRNM" WHEN "DIRNM" IS NULL THEN "SUBDIRNM" END AS "DIREKTORAT"
	FROM (
	
		SELECT bu."RISKCD", bu."VRSN", bu."PRD", bu."BUCD", bus."BUNM", direktorat."DIRNM", direktorat."SUBDIRNM"
		FROM
			(SELECT gr."RISKCD", gr."PRD", gr."VRSN", split_part(gr."RISKCD",'-',1) AS "BUCD" FROM t_GRiskList gr
			) AS bu
		LEFT JOIN 
			(SELECT 
			a."STEXT" AS "BUCD", a."LTEXT" AS "BUNM",
			direk."DIRCD" AS "DIRCD", direk."DIRNM" AS "DIRNM",
			sdirek."DIRCD" AS "SUBDIRCD", sdirek."DIRNM" AS "SUBDIRNM"
			FROM t_Object a
			LEFT JOIN 
				(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
				FROM t_Object x
				LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
				WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('DIRCD') AND "ENDDA" = '2999-01-01')
				AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01')
				AND x."ENDDA" = '2999-01-01'
				AND y."ENDDA" = '2999-01-01'
				ORDER BY x."STEXT" ASC
				) AS direk
			ON a."STEXT" = direk."BUCD"
			LEFT JOIN
				(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
				FROM t_Object x
				LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
				WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('SUBDIRCD') AND "ENDDA" = '2999-01-01')
				AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01')
				AND x."ENDDA" = '2999-01-01'
				AND y."ENDDA" = '2999-01-01'
				ORDER BY x."STEXT" ASC
				) AS sdirek
			ON a."STEXT" = sdirek."BUCD"
			WHERE a."OTYPE" = 'BUCD' AND a."ENDDA" = '2999-01-01'
			ORDER BY a."STEXT"
			) AS direktorat
			ON bu."BUCD" = direktorat."BUCD"
			LEFT JOIN t_BusinessUnit bus ON bu."BUCD" = bus."BUCD"
			WHERE bus."ENDDA" = '2999-01-01'
			) AS z
		) AS dir
ON a."RISKCD" = dir."RISKCD" AND a."PRD" = dir."PRD" AND a."VRSN" = dir."VRSN"
JOIN 
		(SELECT gen."RISKCD"
		, maxver."BUCD", maxver."PRD", maxver."VRSN"
		FROM (
			SELECT yy."BUCD", yy."PRD", MAX(yy."VRSN") AS "VRSN"
			FROM t_RiskRegisterVersion yy
			GROUP BY "BUCD", "PRD"
			) AS maxver
		LEFT JOIN 
			(SELECT zz."RISKCD", split_part(zz."RISKCD", '-', 1) AS "BUCD", zz."PRD", zz."VRSN"
			FROM t_GRiskList zz
			WHERE zz."ENDDA" = '2999-01-01'
			) AS gen
		ON maxver."BUCD" = gen."BUCD" AND maxver."PRD" = gen."PRD" AND maxver."VRSN" = gen."VRSN"
		ORDER BY maxver."BUCD" ASC) AS vers
ON a."RISKCD" = vers."RISKCD" AND a."PRD" = vers."PRD" AND a."VRSN" = vers."VRSN"

WHERE a."ENDDA" = '2999-01-01' AND a."PRD" = prd
--ORDER BY a."RISKCD";
ORDER BY vers."BUCD" ASC, a."CRAT" ASC;

END
$function$
;

-- DROP FUNCTION public.generate_infosec_risk_universe(in date, out varchar, out text, out varchar, out int4, out text, out text, out varchar, out varchar, out text, out text, out text, out varchar, out text, out varchar, out varchar, out text, out text, out varchar, out text, out varchar, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out varchar, out int4, out int4, out int4, out int4, out int4, out int4, out text, out int4, out text, out int4, out int4, out varchar, out int4, out int4, out int4, out varchar, out text, out varchar, out text, out varchar, out varchar);

CREATE OR REPLACE FUNCTION public.generate_infosec_risk_universe(prd date, OUT "DIREKTORAT" character varying, OUT "STATUS" text, OUT "BUNM" character varying, OUT "VRSN" integer, OUT "ISSVUL" text, OUT "ISSTH" text, OUT "IMPRNM" character varying, OUT "IDASNM" character varying, OUT "ASDESC" text, OUT "ASOWN" text, OUT "ASLOC" text, OUT "RISKCD" character varying, OUT "RISK" text, OUT "CONNM" character varying, OUT "CSCATNM" character varying, OUT "CAUSE" text, OUT "EXCON" text, OUT "SIRCNM" character varying, OUT "MSCONNM" text, OUT "IMRCNM" character varying, OUT "LIHONM" text, OUT "LIHOVAL" integer, OUT "IMVALNM" text, OUT "IMVAL" integer, OUT "INRISCO" integer, OUT "INRICAT" character varying, OUT "EXCONLI" integer, OUT "EXCONIM" integer, OUT "ADINLI" integer, OUT "ADINIM" integer, OUT "ADINSC" integer, OUT "ADINSCCAT" character varying, OUT "TADDCON" integer, OUT "TEFC1" integer, OUT "TEFC2" integer, OUT "TEFC3" integer, OUT "TEFC4" integer, OUT "TEFC5" integer, OUT "TGTLICD" text, OUT "TGTLI" integer, OUT "TGTIMCD" text, OUT "TGTIM" integer, OUT "TGTRISC" integer, OUT "TGTRISCAT" character varying, OUT "REALI" integer, OUT "REAIM" integer, OUT "REARISC" integer, OUT "REARISCAT" character varying, OUT "CORISK" text, OUT "CORICD" character varying, OUT "CODESC" text, OUT "TARENM" character varying, OUT "CHANNM" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
SELECT  
	    dir."DIREKTORAT"::varchar AS "DIREKTORAT",
	    n."OBJDS" AS "STATUS",
	    dir."BUNM",
	    a."VRSN"::int,
		b."ISSVUL", 
		c."ISSTH", pr."IMPRNM",
		ida."IDASNM", d."ASDESC", d."ASOWN", d."ASLOC", 
		a."RISKCD", e."RISK", con."CONNM", cscat."CSCATNM", e."CAUSE", e."EXCON",
		sir."SIRCNM", 
		isms."MSCONNM", 
		imc."IMCRNM",
		liho1."OPTI" AS "LIHONM", f."LIHOVAL", imv1."OPTI" AS "IMVALNM", f."IMVAL", f."INRISCO", f."INRICAT",
		f."EXCONLI", f."EXCONIM", f."ADINLI", f."ADINIM", f."ADINSC", f."ADINSCCAT",
		g."TADDCON"::int AS "TADDCON", h."TEFC1"::int AS "TEFC1", i."TEFC2"::int AS "TEFC2", j."TEFC3"::int AS "TEFC3", k."TEFC4"::int AS "TEFC4", l."TEFC5"::int AS "TEFC5",
		liho2."OPTI" AS "TGTLICD", m."TGTLI", imv2."OPTI" AS "TGTIMCD", m."TGTIM", m."TGTRISC", m."TGTRISCAT",
		m."REALI", m."REAIM", m."REARISC", m."REARISCAT",
		e."RISK" AS "CORISK", corp."CORICD", corp."DESC" AS "CODESC", tare."TARENM", chan."CHANNM"
FROM t_IRiskList a
LEFT JOIN t_Object n ON a."STATCD" = n."STEXT"
LEFT JOIN t_InVulnerability b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
LEFT JOIN t_InThreat c ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
LEFT JOIN t_InAssets d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
LEFT JOIN t_IRiskIdentification e ON a."INFOCD" = e."INFOCD" AND a."PRD" = e."PRD" AND a."VRSN" = e."VRSN"
LEFT JOIN t_IRiskMeasurement f ON a."INFOCD" = f."INFOCD" AND a."PRD" = f."PRD" AND a."VRSN" = f."VRSN"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", tr."VRSN", COUNT(tr."RITREID") AS "TADDCON"
	FROM t_IRiskTreatment tr
	GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
	) AS g
	ON a."INFOCD" = g."INFOCD" AND a."PRD" = g."PRD" AND a."VRSN" = g."VRSN"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC1"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-1'
	GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
	) AS h
	ON a."INFOCD" = h."INFOCD" AND a."PRD" = h."PRD" AND a."VRSN" = h."VRSN"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC2"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-2'
	GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
	) AS i
	ON a."INFOCD" = i."INFOCD" AND a."PRD" = i."PRD" AND a."VRSN" = i."VRSN"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC3"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-3'
	GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
	) AS j
	ON a."INFOCD" = j."INFOCD" AND a."PRD" = j."PRD" AND a."VRSN" = j."VRSN"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC4"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-4'
	GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
	) AS k
	ON a."INFOCD" = k."INFOCD" AND a."PRD" = k."PRD" AND a."VRSN" = k."VRSN"
LEFT JOIN 
	(SELECT tr."PRD", tr."INFOCD", tr."VRSN", COUNT(tr."EFCONCD") AS "TEFC5"
	FROM t_IRiskTreatment tr
	WHERE tr."EFCONCD" = 'EFC-5'
	GROUP BY tr."INFOCD", tr."PRD", tr."VRSN"
	) AS l
	ON a."INFOCD" = l."INFOCD" AND a."PRD" = l."PRD" AND a."VRSN" = l."VRSN"
LEFT JOIN t_IResidualRisk m ON a."INFOCD" = m."INFOCD" AND a."PRD" = m."PRD" AND a."VRSN" = m."VRSN"
LEFT JOIN t_IdAssets ida ON d."IDASCD" = ida."IDASCD"
LEFT JOIN t_ImpactToProcess pr ON c."IMPRCD" = pr."IMPRCD"
LEFT JOIN t_Condition con ON e."CONCD" = con."CONCD"
LEFT JOIN t_Categorization cat ON e."CATCD" = cat."CATCD"
LEFT JOIN t_CauseCategory cscat ON e."CSCATCD" = cscat."CSCATCD"
LEFT JOIN t_ImpactCriteria imc ON e."IMCRCD" = imc."IMCRCD"
--LEFT JOIN t_IsmsControl ms ON e."MSCONCD" = ms."MSCONCD" 
LEFT JOIN t_LikelihoodValue liho1 ON f."LIHOCD" = liho1."LIHOCD"
LEFT JOIN t_ImpactValue imv1 ON f."IMVALCD" = imv1."IMVALCD"
LEFT JOIN t_LikelihoodValue liho2 ON m."TGTLICD" = liho2."LIHOCD"
LEFT JOIN t_ImpactValue imv2 ON m."TGTIMCD" = imv2."IMVALCD"
LEFT JOIN t_SystemInfoRC sir ON e."SIRCCD" = sir."SIRCCD"
LEFT JOIN t_IRiskDatabase idb ON a."INFOCD" = idb."INFOCD" AND a."PRD" = idb."PRD" AND a."VRSN" = idb."VRSN"
LEFT JOIN t_CorporateRisk corp ON idb."REFID"::varchar = corp."ID"::varchar
LEFT JOIN t_ChainAnalysis chan ON idb."CHANCD" = chan."CHANCD"
LEFT JOIN t_CoTaksonomiResiko tare ON corp."TARECD" = tare."TARECD"
LEFT JOIN (
 
		SELECT z."RISKCD", z."INFOCD", z."PRD", z."VRSN", z."BUNM",
		CASE WHEN "DIRNM" IS NOT NULL THEN "DIRNM" WHEN "DIRNM" IS NULL THEN "SUBDIRNM" END AS "DIREKTORAT"
		FROM (
		 
		SELECT bu."RISKCD", bu."INFOCD", bu."PRD", bu."VRSN", bu."BUCD", bus."BUNM", direktorat."DIRNM", direktorat."SUBDIRNM"
		FROM
			(SELECT ir."RISKCD", ir."INFOCD", ir."PRD", ir."VRSN", split_part(ir."RISKCD",'-',1) AS "BUCD" FROM t_IRiskList ir
			) AS bu
		LEFT JOIN 
			(SELECT 
			a."STEXT" AS "BUCD", a."LTEXT" AS "BUNM", 
			direk."DIRCD" AS "DIRCD", direk."DIRNM" AS "DIRNM",
			sdirek."DIRCD" AS "SUBDIRCD", sdirek."DIRNM" AS "SUBDIRNM"
			FROM t_Object a
			LEFT JOIN 
				(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
				FROM t_Object x
				LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
				WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('DIRCD') AND "ENDDA" = '2999-01-01')
				AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01')
				AND x."ENDDA" = '2999-01-01'
				AND y."ENDDA" = '2999-01-01'
				ORDER BY x."STEXT" ASC
				) AS direk
			ON a."STEXT" = direk."BUCD"
			LEFT JOIN
				(SELECT DISTINCT(x."STEXT") AS "BUCD", x."LTEXT" AS "BUNM", x."OTYPE" AS "DIRCD", y."LTEXT" AS "DIRNM"
				FROM t_Object x
				LEFT JOIN t_Object y ON x."OTYPE" = y."STEXT"
				WHERE x."OTYPE" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" IN ('SUBDIRCD') AND "ENDDA" = '2999-01-01')
				AND x."STEXT" IN (SELECT "STEXT" FROM t_Object WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01')
				AND x."ENDDA" = '2999-01-01'
				AND y."ENDDA" = '2999-01-01'
				ORDER BY x."STEXT" ASC
				) AS sdirek
				ON a."STEXT" = sdirek."BUCD"
				WHERE a."OTYPE" = 'BUCD' AND a."ENDDA" = '2999-01-01'
				ORDER BY a."STEXT"
				) AS direktorat
			ON bu."BUCD" = direktorat."BUCD"
			LEFT JOIN t_BusinessUnit bus ON bu."BUCD" = bus."BUCD"
			WHERE bus."ENDDA" = '2999-01-01'
			) AS z
			) AS dir
ON a."INFOCD" = dir."INFOCD" AND a."PRD" = dir."PRD" AND a."VRSN" = dir."VRSN"
LEFT JOIN (
	SELECT z."INFOCD", z."PRD", z."VRSN", string_agg(z."OPTI", ',') AS "MSCONNM"
	FROM (
	SELECT x."INFOCD", x."PRD", x."VRSN", x."ISMS", y."OPTI"
	FROM (SELECT xx."INFOCD", xx."PRD", xx."VRSN", UNNEST(STRING_TO_ARRAY(xx."MSCONCD", ',')) AS "ISMS" FROM t_IRiskIdentification xx
		 ) AS x
	JOIN t_IsmsControl y ON x."ISMS" = y."MSCONCD"
	ORDER BY x."INFOCD"
	) AS z
	GROUP BY 1, 2, 3
	) AS isms
ON e."INFOCD" = isms."INFOCD" AND e."PRD" = isms."PRD" AND e."VRSN" = isms."VRSN" 
JOIN 
		(SELECT info."RISKCD", info."INFOCD"
		, maxver."BUCD", maxver."PRD", maxver."VRSN"
		FROM (
			SELECT yy."BUCD", yy."PRD", MAX(yy."VRSN") AS "VRSN"
			FROM t_RiskRegisterVersion yy
			GROUP BY "BUCD", "PRD"
			) AS maxver
		LEFT JOIN 
			(SELECT zz."RISKCD", "INFOCD", split_part(zz."RISKCD", '-', 1) AS "BUCD", zz."PRD", zz."VRSN"
			FROM t_IRiskList zz
			WHERE zz."ENDDA" = '2999-01-01'
			) AS info
		ON maxver."BUCD" = info."BUCD" AND maxver."PRD" = info."PRD" AND maxver."VRSN" = info."VRSN"
		ORDER BY maxver."BUCD" ASC) AS vers
ON a."INFOCD" = vers."INFOCD" AND a."PRD" = vers."PRD" AND a."VRSN" = vers."VRSN"

WHERE a."ENDDA" = '2999-01-01' AND a."PRD" = prd
ORDER BY a."RISKCD", a."CRAT";
END
$function$
;

-- DROP FUNCTION public.generate_treatment_risk_universe(in date, out varchar, out text, out int4, out varchar, out varchar, out text, out text, out date, out int8, out varchar, out varchar, out varchar);

CREATE OR REPLACE FUNCTION public.generate_treatment_risk_universe(prd date, OUT "RISKCD" character varying, OUT "RISK" text, OUT "VRSN" integer, OUT "INFOCD" character varying, OUT "IDASNM" character varying, OUT "ASDESC" text, OUT "ADDCON" text, OUT "DDLN" date, OUT "BUDG" bigint, OUT "SNBUNM" character varying, OUT "EFCONNM" character varying, OUT "PIC" character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY

SELECT treatment.* FROM
(
SELECT  a."RISKCD", c."RISK", a."VRSN", a."INFOCD", 
        e."IDASNM", d."ASDESC",
        b."ADDCON", b."DDLN", b."BUDG"::bigint AS "BUDG", bu."SNBUNM", f."EFCONNM", 
        COALESCE(pic_direct."NAM", pic_names."PIC_NAMES", '-') AS "PIC"
FROM t_IRIskList a
LEFT JOIN t_IRiskTreatment b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN" 
LEFT JOIN t_IRiskIdentification c ON a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
LEFT JOIN t_InAssets d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
LEFT JOIN t_IdAssets e ON d."IDASCD" = e."IDASCD"
LEFT JOIN t_EffectControl f ON b."EFCONCD" = f."EFCONCD"
LEFT JOIN (
          SELECT o."STEXT" AS "SNBUCD", o."LTEXT" AS "SNBUNM"
          FROM t_Object o
          WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01'
          ) AS bu
          ON b."SNBUCD" = bu."SNBUCD"
-- Option 1: Direct join to t_personal (if PIC stores PRSNID directly)
LEFT JOIN t_personal pic_direct ON b."PIC" = pic_direct."PRSNID" AND pic_direct."ENDDA" = '2999-01-01'
-- Option 2: Join through t_multiple_pic_rc (if PIC stores RLMPID)
LEFT JOIN (
          SELECT mp."RLMPID",
                 STRING_AGG(p."NAM", ', ' ORDER BY p."NAM") AS "PIC_NAMES"
          FROM t_multiple_pic_rc mp
          LEFT JOIN t_personal p ON mp."PICID" = p."PRSNID" AND p."ENDDA" = '2999-01-01'
          WHERE mp."ENDDA" = '2999-01-01'
          GROUP BY mp."RLMPID"
          ) AS pic_names
          ON b."PIC" = pic_names."RLMPID"
JOIN 
        (SELECT info."RISKCD", info."INFOCD"
        , maxver."BUCD", maxver."PRD", maxver."VRSN"
        FROM (
            SELECT yy."BUCD", yy."PRD", MAX(yy."VRSN") AS "VRSN"
            FROM t_RiskRegisterVersion yy
            GROUP BY "BUCD", "PRD"
            ) AS maxver
        LEFT JOIN 
            (SELECT zz."RISKCD", zz."INFOCD", split_part(zz."RISKCD", '-', 1) AS "BUCD", zz."PRD", zz."VRSN"
            FROM t_IRiskList zz
            WHERE zz."ENDDA" = '2999-01-01'
            ) AS info
        ON maxver."BUCD" = info."BUCD" AND maxver."PRD" = info."PRD" AND maxver."VRSN" = info."VRSN"
        ORDER BY maxver."BUCD" ASC) AS vers
ON a."INFOCD" = vers."INFOCD" AND a."PRD" = vers."PRD" AND a."VRSN" = vers."VRSN"
WHERE a."ENDDA" = '2999-01-01' AND b."TRTCD" IS NOT NULL AND a."PRD" = prd

UNION 

SELECT  a."RISKCD", c."RISK", a."VRSN", NULL AS "INFOCD",
        NULL AS "IDASNM", NULL AS "ASDESC",
        b."ADDCON", b."DDLN", b."BUDG"::bigint AS "BUDG", bu."SNBUNM", f."EFCONNM", 
        COALESCE(pic_direct."NAM", pic_names."PIC_NAMES", '-') AS "PIC"
FROM t_GRIskList a
LEFT JOIN t_GRiskTreatment b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
LEFT JOIN t_GRiskIdentification c ON a."RISKCD" = c."RISKCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
LEFT JOIN t_EffectControl f ON b."EFCONCD" = f."EFCONCD"
LEFT JOIN (
          SELECT o."STEXT" AS "SNBUCD", o."LTEXT" AS "SNBUNM"
          FROM t_Object o
          WHERE "OTYPE" = 'BUCD' AND "ENDDA" = '2999-01-01'
          ) AS bu
          ON b."SNBUCD" = bu."SNBUCD"
-- Option 1: Direct join to t_personal (if PIC stores PRSNID directly)
LEFT JOIN t_personal pic_direct ON b."PIC" = pic_direct."PRSNID" AND pic_direct."ENDDA" = '2999-01-01'
-- Option 2: Join through t_multiple_pic_rc (if PIC stores RLMPID)
LEFT JOIN (
          SELECT mp."RLMPID",
                 STRING_AGG(p."NAM", ', ' ORDER BY p."NAM") AS "PIC_NAMES"
          FROM t_multiple_pic_rc mp
          LEFT JOIN t_personal p ON mp."PICID" = p."PRSNID" AND p."ENDDA" = '2999-01-01'
          WHERE mp."ENDDA" = '2999-01-01'
          GROUP BY mp."RLMPID"
          ) AS pic_names
          ON b."PIC" = pic_names."RLMPID"
JOIN 
        (SELECT gen."RISKCD"
        , maxver."BUCD", maxver."PRD", maxver."VRSN"
        FROM (
            SELECT yy."BUCD", yy."PRD", MAX(yy."VRSN") AS "VRSN"
            FROM t_RiskRegisterVersion yy
            GROUP BY "BUCD", "PRD"
            ) AS maxver
        LEFT JOIN 
            (SELECT yy."RISKCD", split_part(yy."RISKCD", '-', 1) AS "BUCD", yy."PRD", yy."VRSN"
            FROM t_GRiskList yy
            WHERE yy."ENDDA" = '2999-01-01'
            ) AS gen
        ON maxver."BUCD" = gen."BUCD" AND maxver."PRD" = gen."PRD" AND maxver."VRSN" = gen."VRSN"
        ORDER BY maxver."BUCD" ASC) AS vers
ON a."RISKCD" = vers."RISKCD" AND a."PRD" = vers."PRD" AND a."VRSN" = vers."VRSN"
WHERE a."ENDDA" = '2999-01-01' AND b."TRTCD" IS NOT NULL AND a."RISKCD" NOT LIKE '%-1' AND a."PRD" = prd
) AS treatment
ORDER BY treatment."RISKCD";
END
$function$
;

-- DROP PROCEDURE public.p_adjinherent1(int4, int4, varchar, int4, int4, varchar, varchar);

CREATE OR REPLACE PROCEDURE public.p_adjinherent1(IN a integer, IN b integer, IN d character varying, IN e integer, IN f integer, IN j character varying, IN z character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
	c INT;
	g INT;
	h INT;
	i INT;
BEGIN
	c := a*b;
	g := a-e;
	h := b-f;
	i := g*h;

	IF b < 5 AND c < 6 THEN
		d := 'Rendah';
	ELSEIF b = 5 AND c >= 10 THEN
		d := 'Tinggi';
	ELSEIF b < 5 AND c >= 15 THEN
		d := 'Tinggi';
	ELSE
		d := 'Moderat';
	END IF;


	IF h < 5 AND i < 6 THEN
		j := 'Rendah';
	ELSEIF h = 5 AND i >= 10 THEN
		j := 'Tinggi';
	ELSEIF h < 5 AND i >= 15 THEN
		j := 'Tinggi';
	ELSE
		j := 'Moderat';
	END IF;
	INSERT INTO t_GRiskMeasurement ("LIHOVAL", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", "ADINSC", "ADINSCCAT", "RIMEAID")
	VALUES (a, b, c, d, e, f, g, h, i, j, z);
END;
$procedure$
;

-- DROP PROCEDURE public.p_adjinherent1(int4, int4, varchar, int4, int4, varchar);

CREATE OR REPLACE PROCEDURE public.p_adjinherent1(IN a integer, IN b integer, IN d character varying, IN e integer, IN f integer, IN j character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
	c INT;
	g INT;
	h INT;
	i INT;
BEGIN
	c := a*b;
	g := a-e;
	h := b-f;
	i := g*h;

	IF b < 5 AND c < 6 THEN
		d := 'Rendah';
	ELSEIF b = 5 AND c >= 10 THEN
		d := 'Tinggi';
	ELSEIF b < 5 AND c >= 15 THEN
		d := 'Tinggi';
	ELSE
		d := 'Moderat';
	END IF;


	IF h < 5 AND i < 6 THEN
		j := 'Rendah';
	ELSEIF h = 5 AND i >= 10 THEN
		j := 'Tinggi';
	ELSEIF h < 5 AND i >= 15 THEN
		j := 'Tinggi';
	ELSE
		j := 'Moderat';
	END IF;
	INSERT INTO t_GRiskMeasurement ("LIHOVAL", "IMVAL", "INRISCO", "INRICAT", "EXCONLI", "EXCONIM", "ADINLI", "ADINIM", "ADINSC", "ADINSCCAT")
	VALUES (a, b, c, d, e, f, g, h, i, j);
END;
$procedure$
;

-- DROP PROCEDURE public.p_deletetemporary(varchar);

CREATE OR REPLACE PROCEDURE public.p_deletetemporary(IN id character varying)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
	perform id;
	DELETE FROM t_TemporaryImpact
	WHERE "ID" = id;
END;
$procedure$
;

-- DROP PROCEDURE public.p_inherent(int4, int4, varchar, varchar);

CREATE OR REPLACE PROCEDURE public.p_inherent(IN a integer, IN b integer, IN d character varying, IN f character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE c INT;
BEGIN
	c := a*b;
	IF b < 5 AND c < 6 THEN
		d := 'Low';
	ELSEIF b = 5 AND c >= 10 THEN
		d := 'High';
	ELSEIF b < 5 AND c >= 15 THEN
		d := 'High';
	ELSE
		d := 'Medium';
	END IF;

	INSERT INTO t_GRiskMeasurement ("LIHOVAL", "IMVAL", "INRISCO", "INRICAT", "RIMEAID")
	VALUES (a, b, c, d, f);
END;
$procedure$
;

-- DROP PROCEDURE public.p_inherent(int4, int4, varchar);

CREATE OR REPLACE PROCEDURE public.p_inherent(IN a integer, IN b integer, IN d character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE c INT;
BEGIN
	c := a*b;
	IF b < 5 AND c < 6 THEN
		d := 'Low';
	ELSEIF b = 5 AND c >= 10 THEN
		d := 'High';
	ELSEIF b < 5 AND c >= 15 THEN
		d := 'High';
	ELSE
		d := 'Medium';
	END IF;

	INSERT INTO t_GRiskMeasurement ("LIHOVAL", "IMVAL", "INRISCO", "INRICAT")
	VALUES (a, b, c, d);
END;
$procedure$
;

-- DROP PROCEDURE public.p_insertcondition(varchar);

CREATE OR REPLACE PROCEDURE public.p_insertcondition(IN condition_name character varying)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    INSERT INTO t_Condition ("CONNM") VALUES (condition_name);
END;
$procedure$
;

-- DROP PROCEDURE public.p_insertimpactcriteria(varchar, varchar, varchar, text);

CREATE OR REPLACE PROCEDURE public.p_insertimpactcriteria(IN aspcd character varying, IN iccd character varying, IN icnm character varying, IN descr text)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
	INSERT INTO t_ImpactCriteria ("ASPCD", "IMCRCD", "IMCRNM", "DESC")
	VALUES (aspcd, iccd, icnm, descr);
END;
$procedure$
;

-- DROP PROCEDURE public.p_inserttemporary(date, date, uuid, varchar, varchar, text, text, text, text, text, text, timestamptz, date, varchar);

CREATE OR REPLACE PROCEDURE public.p_inserttemporary(IN begda date, IN endda date, IN id uuid, IN icnm character varying, IN aspcd character varying, IN descr text, IN vlow text, IN low text, IN medium text, IN high text, IN vhigh text, IN crat timestamp with time zone, IN chgda date, IN chgby character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE 
BEGIN
--	INSERT INTO t_TemporaryImpact ("BEGDA", "ENDDA", "IMVALID", "IMCRCD", "IMCRNM", "ASPCD", "DESC", "IMVALCD", "VLOW", "LOW", "MEDIUM", "HIGH", "VHIGH", "CRAT", "CHGDA", "CHGBY")
--	VALUES (begda, endda, id, iccd, icnm, aspcd, descr, ivcd, vlow, low, medium, high, vhigh, crat, chgda, chgby);
	INSERT INTO t_TemporaryImpact ("BEGDA", "ENDDA", "IMVALID", "IMCRNM", "ASPCD", "DESC", "VLOW", "LOW", "MEDIUM", "HIGH", "VHIGH", "CRAT", "CHGDA", "CHGBY")
	VALUES (begda, endda, id, icnm, aspcd, descr, vlow, low, medium, high, vhigh, crat, chgda, chgby);
END;
$procedure$
;

-- DROP FUNCTION public.search_all(text);

CREATE OR REPLACE FUNCTION public.search_all(keyword text)
 RETURNS TABLE(location text, row_data jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    r RECORD;
    v_sql TEXT;
BEGIN
    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name NOT LIKE 'pg_%'
          AND data_type IN ('text', 'character varying', 'character', 'citext')
    LOOP
        v_sql := format(
            'SELECT %L AS location, to_jsonb(t) AS row_data
             FROM %I.%I t
             WHERE %I ILIKE %L',
            r.table_schema || '.' || r.table_name || '.' || r.column_name,
            r.table_schema, r.table_name,
            r.column_name,
            '%' || keyword || '%'
        );

        RETURN QUERY EXECUTE v_sql;
    END LOOP;
END;
$function$
;

-- DROP FUNCTION public.try_maxiresidualrisk();

CREATE OR REPLACE FUNCTION public.try_maxiresidualrisk()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Jihan 25 Maret 2024
--Rafi 21 Agustus 2025
	UPDATE t_GResidualRisk c
    SET 
		"TGTLICD"  = subquery."TGTLICD",
		"TGTLI"   = subquery."TGTLI",
		"TGTIMCD"   = subquery."TGTIMCD",
		"TGTIM" = subquery."TGTIM",
		"TGTRISC"   = subquery."TGTRISC",
		"TGTRISCAT"   = subquery."TGTRISCAT",
		"CRAT"   = subquery."CRAT",
		"CHGDA"  = subquery."CHGDA",
		"CHGBY"  = subquery."CHGBY"
--		"PRD"    = subquery."PRD"
   
  FROM (
   	SELECT a."RISKCD", a."PRD", d."INFOCD", d."TGTLICD", d."TGTLI", d."TGTIMCD", d."TGTIM", d."TGTRISC", d."TGTRISCAT",
    d."CRAT", a."CHGDA", d."CHGBY", a."VRSN", MAX(b."INRISCO") AS max_inrisco
    FROM t_IRiskList a
    JOIN t_IRiskMeasurement b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
    JOIN t_IResidualRisk d ON a."INFOCD" = d."INFOCD" AND a."PRD" = d."PRD" AND a."VRSN" = d."VRSN"
    WHERE b."INRISCO" IS NOT NULL
    AND d."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
    AND a."VRSN" IN (SELECT "VRSN" FROM t_IRiskList ORDER BY "CHGDA" DESC LIMIT 1)
  	AND a."RISKCD" IN (
            SELECT x."RISKCD"
            FROM public.t_iriskidentification x
            where x."RISKCD" in (
                SELECT x."RISKCD"
                FROM public.t_griskidentification x
            where x."RISKTPE" = 'RI-2'
            )
            order by x."CHGDA" desc
            limit 1
        )
   	AND a."PRD" IN (SELECT "PRD" FROM t_IRiskList ORDER BY "CHGDA" DESC LIMIT 1)
   	AND a."ENDDA" = '2999-01-01'
    GROUP BY a."RISKCD", a."PRD", d."INFOCD", d."TGTLICD", d."TGTLI", d."TGTIMCD", d."TGTIM", d."TGTRISC", d."TGTRISCAT",
    d."CRAT", a."CHGDA", d."CHGBY", a."VRSN"
    ORDER BY 14 DESC, 11 DESC LIMIT 1

) AS subquery

WHERE c."RISKCD" IN (
    SELECT x."RISKCD"
    FROM public.t_iriskidentification x
    where x."RISKCD" in (
        SELECT x."RISKCD"
        FROM public.t_griskidentification x
    where x."RISKTPE" = 'RI-2'
    )
    order by x."CHGDA" desc
    limit 1
) AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD" AND c."VRSN" = subquery."VRSN";
	
--RETURN NEW;
--END;
$function$
;

-- DROP FUNCTION public.try_maxiriskidentification();

CREATE OR REPLACE FUNCTION public.try_maxiriskidentification()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Jihan 25 Maret 2024
-- Rafi 21 Agustus 2025
	
UPDATE t_GRiskIdentification c
    SET "CONCD"   = subquery."CONCD",
		"CATCD"   = subquery."CATCD",
		"CSCATCD" = subquery."CSCATCD",
		"CAUSE"   = subquery."CAUSE",
		"EXCON"   = subquery."EXCON",
		"IMCRCD"  = subquery."IMCRCD",
		"CRAT"    = subquery."CRAT",
		"CHGDA"   = subquery."CHGDA",
		"CHGBY"   = subquery."CHGBY",
		"X5" 	  = subquery."INFOCD"
		
    FROM (
        SELECT x.* FROM (
            SELECT c."ENDDA", a."RISKCD", a."CONCD", a."CATCD", a."CSCATCD", a."CAUSE", a."EXCON", a."IMCRCD", 
            a."CRAT", c."CHGDA", a."CHGBY", a."PRD", b."INFOCD", a."VRSN", MAX(b."INRISCO") AS max_inrisco
            FROM t_IRiskIdentification a
            JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
            JOIN t_IRiskList c ON a."RISKCD" = c."RISKCD" AND a."INFOCD" = c."INFOCD" AND a."PRD" = c."PRD" AND a."VRSN" = c."VRSN"
            WHERE b."INRISCO" IS NOT NULL
            AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
            AND a."VRSN" IN (SELECT "VRSN" FROM t_IRiskList ORDER BY "CHGDA" DESC LIMIT 1)
            AND a."RISKCD" IN (
                    SELECT x."RISKCD"
                    FROM public.t_iriskidentification x
                    where x."RISKCD" in (
                        SELECT x."RISKCD"
                        FROM public.t_griskidentification x
                    where x."RISKTPE" = 'RI-2'
                    )
                    order by x."CHGDA" desc
                    limit 1
                )
            AND a."PRD" IN (SELECT "PRD" FROM t_IRiskList ORDER BY "CHGDA" DESC LIMIT 1)
            GROUP BY c."ENDDA", a."RISKCD", b."INFOCD", a."CONCD", a."CATCD", a."CSCATCD", a."CAUSE", a."EXCON", a."IMCRCD", 
            a."CRAT", c."CHGDA", a."CHGBY", a."PRD", a."VRSN"
        ) x
        WHERE x."ENDDA" = '2999-01-01'
        ORDER BY 15 DESC, 10 DESC LIMIT 1
    ) AS subquery

WHERE c."RISKCD" IN (
    SELECT x."RISKCD"
    FROM public.t_iriskidentification x
    where x."RISKCD" in (
        SELECT x."RISKCD"
        FROM public.t_griskidentification x
    where x."RISKTPE" = 'RI-2'
    )
    order by x."CHGDA" desc
    limit 1
) AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD" AND c."VRSN" = subquery."VRSN";


	
--RETURN NEW;
--END;
$function$
;

-- DROP FUNCTION public.try_maxirisklist();

CREATE OR REPLACE FUNCTION public.try_maxirisklist()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Jihan 25 Maret 2024
--Rafi 21 Agustus 2025

	UPDATE t_GRiskList x
		SET "STATCD" = subquery."STATCD",
			"PRGS" = subquery."PRGS"
	FROM (
	
		SELECT x.* FROM (
	 	    SELECT a."RISKCD", a."CRAT", a."CHGDA", a."CHGBY", a."PRD", b."INFOCD", a."VRSN", a."STATCD", a."PRGS", MAX(b."INRISCO") AS max_inrisco
		    FROM t_IRiskList a
		    JOIN t_IRiskMeasurement b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
		    WHERE b."INRISCO" IS NOT NULL
		    AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
		    AND a."RISKCD" IN (
				SELECT x."RISKCD"
                FROM public.t_iriskidentification x
                where x."RISKCD" in
                (SELECT x."RISKCD"
                FROM public.t_griskidentification x
                where x."RISKTPE" = 'RI-2')
                order by x."CHGDA" desc
                limit 1
		    )
		    AND a."PRD" IN (SELECT "PRD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
		    GROUP BY a."RISKCD", a."CRAT", a."CHGDA", a."CHGBY", a."PRD", b."INFOCD", a."VRSN", a."STATCD", a."PRGS"
		) x
		ORDER BY 10 DESC, 3 DESC LIMIT 1
	
	) AS subquery
	
	WHERE x."RISKCD" IN (
		SELECT x."RISKCD"
		FROM public.t_iriskidentification x
		where x."RISKCD" in
		(SELECT x."RISKCD"
		FROM public.t_griskidentification x
		where x."RISKTPE" = 'RI-2')
		order by x."CHGDA" desc
		limit 1
	) AND x."RISKCD" = subquery."RISKCD" AND x."PRD" = subquery."PRD" AND x."VRSN" = subquery."VRSN";


--
--	UPDATE t_GRiskList x
--	SET "STATCD" = subquery."STATCD",
--		"PRGS" = subquery."PRGS"
--	FROM (
-- 	SELECT y.* FROM (
--	 	SELECT a."RISKCD", b."INFOCD", b."CRAT", b."CHGDA", b."CHGBY", a."PRD", b."VRSN", a."STATCD", a."PRGS", MAX(b."INRISCO") AS max_inrisco
--		    FROM t_IRiskList a
--		    JOIN t_IRiskMeasurement b ON a."RISKCD" = b."RISKCD" AND a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
--		    WHERE b."INRISCO" IS NOT NULL
--		    AND b."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
----		    AND a."RISKCD" IN (SELECT "RISKCD" FROM t_IRiskMeasurement ORDER BY "CHGDA" DESC LIMIT 1)
--		    GROUP BY a."RISKCD", b."INFOCD", b."CRAT", b."CHGDA", b."CHGBY", a."PRD", b."VRSN", a."STATCD", a."PRGS"
--	--		ORDER BY 20 ASC, 16 ASC
--			ORDER BY b."CHGDA" DESC LIMIT 1
--			) y
--	--	ORDER BY 20 DESC, 16 DESC LIMIT 1
--    ) AS subquery
--	WHERE x."RISKCD" = subquery."RISKCD" AND x."PRD" = subquery."PRD" AND x."VRSN" = subquery."VRSN";

$function$
;

-- DROP FUNCTION public.try_maxiriskmeasurement();

CREATE OR REPLACE FUNCTION public.try_maxiriskmeasurement()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Rafi 8 Agustus 2025


	UPDATE t_GRiskMeasurement c
    SET 
		"LIHOCD"  = subquery."LIHOCD",
		"LIHOVAL"   = subquery."LIHOVAL",
		"IMVALCD"   = subquery."IMVALCD",
		"IMVAL" = subquery."IMVAL",
		"INRISCO"   = subquery."INRISCO",
		"INRICAT"   = subquery."INRICAT",
		"EXCONLI"  = subquery."EXCONLI",
		"EXCONIM"  = subquery."EXCONIM",
		"ADINLI"   = subquery."ADINLI",
		"ADINIM"   = subquery."ADINIM",
		"ADINSC"  = subquery."ADINSC",
		"ADINSCCAT"  = subquery."ADINSCCAT",
		"CRAT"   = subquery."CRAT",
		"CHGDA"  = subquery."CHGDA",
		"CHGBY"  = subquery."CHGBY"
   
   FROM (
 	SELECT x.* FROM (
	 	SELECT a."ENDDA", a."RISKCD", a."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
					b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
					b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", a."CHGDA", b."CHGBY", a."PRD", a."VRSN", MAX(b."INRISCO") AS max_inrisco
		    FROM t_IRiskList a
		    JOIN t_IRiskMeasurement b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
		    WHERE b."INRISCO" IS not NULL
		    AND a."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
		 	AND a."VRSN" IN (SELECT "VRSN" FROM t_IRiskList ORDER BY "CHGDA" DESC LIMIT 1)
	        AND a."RISKCD" IN (
	        SELECT x."RISKCD"
                FROM public.t_iriskidentification x
                where x."RISKCD" in
                (SELECT x."RISKCD"
                FROM public.t_griskidentification x
                where x."RISKTPE" = 'RI-2')
                order by x."CHGDA" desc
                limit 1
	        )
	        AND a."PRD" IN (SELECT "PRD" FROM t_IRiskList ORDER BY "CHGDA" DESC LIMIT 1)
		    GROUP BY a."ENDDA", a."RISKCD", a."INFOCD", b."LIHOCD", b."LIHOVAL", b."IMVALCD",
					b."IMVAL", b."INRISCO", b."INRICAT", b."EXCONLI", b."EXCONIM", b."ADINLI",
					b."ADINIM", b."ADINSC", b."ADINSCCAT", b."CRAT", a."CHGDA", b."CHGBY", a."PRD", a."VRSN"
	--		ORDER BY 20 ASC, 16 ASC
--			ORDER BY b."CHGDA" DESC LIMIT 1
			) x
		WHERE x."ENDDA" = '2999-01-01'
		ORDER BY 21 DESC, 17 DESC LIMIT 1
    ) AS subquery

WHERE c."RISKCD" IN (
SELECT x."RISKCD"
FROM public.t_iriskidentification x
where x."RISKCD" in (
    SELECT x."RISKCD"
    FROM public.t_griskidentification x
where x."RISKTPE" = 'RI-2'
)
order by x."CHGDA" desc
limit 1
) AND c."RISKCD" = subquery."RISKCD" AND c."PRD" = subquery."PRD" AND c."VRSN" = subquery."VRSN";
    
	
--RETURN NEW;
--END;
$function$
;

-- DROP FUNCTION public.try_maxirisktreatment();

CREATE OR REPLACE FUNCTION public.try_maxirisktreatment()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Jihan 25 Maret 2024
--Rafi 21 Agustus 2025

UPDATE t_GRiskTreatment a
SET "ENDDA" = del."ENDDA"
FROM 
	(
	SELECT *
	FROM t_IRiskList
	WHERE "ENDDA" <> '2999-01-01'
	and "RISKCD" IN (
		SELECT x."RISKCD"
		FROM public.t_iriskidentification x
		where x."RISKCD" in
		(SELECT x."RISKCD"
		FROM public.t_griskidentification x
		where x."RISKTPE" = 'RI-2')
		order by x."CHGDA" desc
		limit 1
	)
	ORDER BY "CHGDA" DESC LIMIT 1
	) AS del
WHERE a."RISKCD" IN (
	SELECT x."RISKCD"
	FROM public.t_iriskidentification x
	where x."RISKCD" in
	(SELECT x."RISKCD"
	FROM public.t_griskidentification x
	where x."RISKTPE" = 'RI-2')
	order by x."CHGDA" desc
	limit 1
) 
AND a."RISKCD" = del."RISKCD" AND a."PRD" = del."PRD" AND a."VRSN" = del."VRSN";

--add TRTSRC 
INSERT INTO t_GRiskTReatment ("BEGDA", "ENDDA", "RISKCD", "ADDCON", "DDLN", "BUDG", "SNBUCD", "EFCONCD", "EFCONVAL", "PIC", "PICNIK", "TRTCD", "PRD", "CHGDA", "CHGBY", "STATCD", "VRSN","TRTSRC")

SELECT "BEGDA", "ENDDA", "RISKCD", "ADDCON", "DDLN", "BUDG", "SNBUCD", "EFCONCD", 222 AS "EFCONVAL", "PIC", "PICNIK", "TRTCD", tk."PRD", "CHGDA", "CHGBY", "STATCD", tk."VRSN", tk."TRTSRC"
		FROM t_irisktreatment AS tk
		JOIN
			(SELECT t1."INFOCD", t3."PRD", t3."VRSN" FROM t_IRiskMeasurement t1,
				(SELECT t2."RISKCD", t2."PRD", t2."VRSN", t2."INRISCO", max(t2."CHGDA") AS "CHGDA"
				FROM
				(
				SELECT "RISKCD", "PRD", "VRSN", MAX("INRISCO") AS max--, MAX("CRAT") AS maxtime
				FROM t_IRiskMeasurement
				WHERE "INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
				GROUP BY "RISKCD", "PRD", "VRSN"
				) t1
				INNER JOIN t_IRiskMeasurement t2 ON t2."RISKCD" = t1."RISKCD"
				AND t2."PRD" = t1."PRD"
				AND t2."VRSN" = t1."VRSN"
				AND t2."INRISCO" = t1.max
				GROUP BY t2."RISKCD", t2."INRISCO", t2."PRD", t2."VRSN"
				) t3
			 where t1."RISKCD" in (
				SELECT x."RISKCD"
                FROM public.t_iriskidentification x
                where x."RISKCD" in
                (SELECT x."RISKCD"
                FROM public.t_griskidentification x
                where x."RISKTPE" = 'RI-2')
                order by x."CHGDA" desc
                limit 1
			 ) 
			 and t1."RISKCD" = t3."RISKCD" AND t1."PRD" = t3."PRD" AND t1."INRISCO" = t3."INRISCO" AND t1."VRSN" = t3."VRSN"
			 AND t1."CHGDA" = t3."CHGDA"
			 AND t1."INFOCD" IN (SELECT "INFOCD" FROM t_IRiskList WHERE "ENDDA" = '2999-01-01')
			) AS tm 
		ON tk."INFOCD" = tm."INFOCD" AND tk."PRD" = tm."PRD" AND tk."VRSN" = tm."VRSN"
	WHERE tk."ENDDA" = '2999-01-01';
	 	
    DELETE FROM t_GRiskTreatment s
	USING t_GRiskTreatment s_new
	WHERE s."CRAT" < s_new."CRAT" AND s."RISKCD" = s_new."RISKCD" AND s."PRD" = s_new."PRD" AND s."VRSN" = s_new."VRSN"
	AND s."RISKCD" IN (
		SELECT x."RISKCD"
		FROM public.t_iriskidentification x
		where x."RISKCD" in
		(SELECT x."RISKCD"
		FROM public.t_griskidentification x
		where x."RISKTPE" = 'RI-2')
		order by x."CHGDA" desc
		limit 1
	); 


$function$
;

-- DROP FUNCTION public.try_riskcode1();

CREATE OR REPLACE FUNCTION public.try_riskcode1()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
INSERT INTO t_GRiskIdentification ("OBJTV", "PRONM", "RISKCD", "RISK", "CATCD", "PRD", "VRSN")
 
SELECT "OBJTV", "PRONM", CONCAT("BUCD",'-1') AS "RISKCD", "RISK", "CATCD", "PRD", "VRSN"
FROM (
SELECT DISTINCT("BUCD"),
	   'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit' AS "OBJTV",
	   'Mengelola Keamanan Informasi Perusahaan' AS "PRONM",
	   'Information security breach terhadap data/informasi yang dimiliki Business Unit' AS "RISK",
	   'CAT-3' AS "CATCD",
	   concat(extract(year from current_date),'-12-31')::date AS "PRD",
	   0 AS "VRSN"
FROM t_BusinessUnit
WHERE 1=1
AND "BEGDA" IN (SELECT MAX("BEGDA") FROM t_BusinessUnit)
AND "ENDDA" = '2999-01-01'
AND "BUCD" NOT IN (SELECT DISTINCT("BUCD") FROM
(SELECT split_part("RISKCD",'-',1) AS "BUCD" FROM t_GRiskIdentification
where "PRD" = (select concat(extract(year from current_date),'-12-31')::date)) AS r)
ORDER BY "BUCD" desc limit 1
) z;
 
 
--Risk Measurement
INSERT INTO t_GRiskMeasurement ("RISKCD", "PRD", "VRSN")
 
SELECT CONCAT("BUCD",'-1') AS "RISKCD", "PRD", "VRSN"
FROM (
SELECT DISTINCT("BUCD"),
	   'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit' AS "OBJTV",
	   'Mengelola Keamanan Informasi Perusahaan' AS "PRONM",
	   'Information security breach terhadap data/informasi yang dimiliki Business Unit' AS "RISK",
	   'CAT-3' AS "CATCD",
	   concat(extract(year from current_date),'-12-31')::date AS "PRD",
	   0 AS "VRSN"
FROM t_BusinessUnit
WHERE "BEGDA" IN (SELECT MAX("BEGDA") FROM t_BusinessUnit)
AND "ENDDA" = '2999-01-01'
AND "BUCD" NOT IN (SELECT DISTINCT("BUCD") FROM
(SELECT split_part("RISKCD",'-',1) AS "BUCD" FROM t_griskmeasurement
where "PRD" = (select concat(extract(year from current_date),'-12-31')::date)) AS r)
ORDER BY "BUCD"
) z;
 
 
--Risk Residual
INSERT INTO t_GResidualRisk ("RISKCD", "PRD", "VRSN")
 
SELECT CONCAT("BUCD",'-1') AS "RISKCD", "PRD", "VRSN"
FROM (
SELECT DISTINCT("BUCD"),
	   'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit' AS "OBJTV",
	   'Mengelola Keamanan Informasi Perusahaan' AS "PRONM",
	   'Information security breach terhadap data/informasi yang dimiliki Business Unit' AS "RISK",
	   'CAT-3' AS "CATCD",
	   concat(extract(year from current_date),'-12-31')::date AS "PRD",
	   0 AS "VRSN"
FROM t_BusinessUnit
WHERE "BEGDA" IN (SELECT MAX("BEGDA") FROM t_BusinessUnit)
AND "ENDDA" = '2999-01-01'
AND "BUCD" NOT IN (SELECT DISTINCT("BUCD") FROM
(SELECT split_part("RISKCD",'-',1) AS "BUCD" FROM t_GResidualRisk
where "PRD" = (select concat(extract(year from current_date),'-12-31')::date)) AS r)
ORDER BY "BUCD"
) z;
 
 
 
INSERT INTO t_RiskRegisterVersion ("BUCD", "PRD", "VRSN")
 
SELECT "BUCD", "PRD", 0 AS "VRSN"
FROM (
SELECT DISTINCT("BUCD"),
	   'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit' AS "OBJTV",
	   'Mengelola Keamanan Informasi Perusahaan' AS "PRONM",
	   'Information security breach terhadap data/informasi yang dimiliki Business Unit' AS "RISK",
	   'CAT-3' AS "CATCD",
	   concat(extract(year from current_date),'-12-31')::date AS "PRD"
FROM t_BusinessUnit
WHERE "BEGDA" IN (SELECT MAX("BEGDA") FROM t_BusinessUnit)
AND "ENDDA" = '2999-01-01'
AND "BUCD" NOT IN (SELECT DISTINCT("BUCD") FROM t_RiskRegisterVersion
where "PRD" = (select concat(extract(year from current_date),'-12-31')::date))
ORDER BY "BUCD"
) z;
 
 
--Risk Register Status
ALTER TABLE public.t_riskregisterstatus DISABLE TRIGGER tg_versioning;
 
 
INSERT INTO t_RiskRegisterStatus ("BUCD", "PRD", "VRSN", "STATCD")
 
SELECT "BUCD", "PRD", 0 AS "VRSN", 'HREG-1' AS "STATCD"
FROM (
SELECT DISTINCT("BUCD"),
	   'Meningkatkan awareness dan pemahaman atas keamanan informasi, serta menyeragamkan kualitas pengelolaan keamanan informasi di tingkat Business Unit' AS "OBJTV",
	   'Mengelola Keamanan Informasi Perusahaan' AS "PRONM",
	   'Information security breach terhadap data/informasi yang dimiliki Business Unit' AS "RISK",
	   'CAT-3' AS "CATCD",
	   concat(extract(year from current_date),'-12-31')::date AS "PRD"
FROM t_BusinessUnit
WHERE "BEGDA" IN (SELECT MAX("BEGDA") FROM t_BusinessUnit)
AND "ENDDA" = '2999-01-01'
AND "BUCD" NOT IN (SELECT DISTINCT("BUCD") FROM t_RiskRegisterStatus
where "PRD" = (select concat(extract(year from current_date),'-12-31')::date))
ORDER BY "BUCD"
) z;
 
ALTER TABLE public.t_riskregisterstatus ENABLE TRIGGER tg_versioning;
$function$
;

-- DROP FUNCTION public.try_softdeletegrisktreatment();

CREATE OR REPLACE FUNCTION public.try_softdeletegrisktreatment()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Jihan 25 April 2024		
UPDATE t_GRiskTreatment
SET "ENDDA" = del."ENDDA",
	"CHGDA" = del."CHGDA"
FROM 
	(SELECT "ENDDA", "CHGDA"
	FROM t_GRiskList
	WHERE "ENDDA" <> '2999-01-01'
	ORDER BY "CHGDA" DESC LIMIT 1
	) AS del
WHERE "RITREID" = ANY (
	SELECT b."RITREID" FROM
	(SELECT *--"ENDDA"
	FROM t_GRiskList
	WHERE "ENDDA" <> '2999-01-01'
	ORDER BY "CHGDA" DESC LIMIT 1
	) a
	LEFT JOIN t_GRiskTreatment b ON a."RISKCD" = b."RISKCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
	);

$function$
;

-- DROP FUNCTION public.try_softdeleteirisktreatment();

CREATE OR REPLACE FUNCTION public.try_softdeleteirisktreatment()
 RETURNS void
 LANGUAGE sql
AS $function$
--BEGIN
--Jihan 25 April 2024	
--Rafi 21 Agustus 2025	
UPDATE t_IRiskTreatment
SET "ENDDA" = del."ENDDA",
	"CHGDA" = del."CHGDA"
FROM 
	(SELECT "ENDDA", "CHGDA"
	FROM t_IRiskList
	WHERE "ENDDA" <> '2999-01-01'
	and "RISKCD" IN (
		SELECT x."RISKCD"
		FROM public.t_iriskidentification x
		where x."RISKCD" in
		(SELECT x."RISKCD"
		FROM public.t_griskidentification x
		where x."RISKTPE" = 'RI-2')
		order by x."CHGDA" desc
		limit 1
	)
	ORDER BY "CHGDA" DESC LIMIT 1
	) AS del
WHERE "RITREID" = ANY (
	SELECT b."RITREID" FROM
	(SELECT *--"ENDDA"
	FROM t_IRiskList
	WHERE "ENDDA" <> '2999-01-01'
	and "RISKCD" IN (
		SELECT x."RISKCD"
		FROM public.t_iriskidentification x
		where x."RISKCD" in
		(SELECT x."RISKCD"
		FROM public.t_griskidentification x
		where x."RISKTPE" = 'RI-2')
		order by x."CHGDA" desc
		limit 1
	)
	ORDER BY "CHGDA" DESC LIMIT 1
	) a
	LEFT JOIN t_IRiskTreatment b ON a."INFOCD" = b."INFOCD" AND a."PRD" = b."PRD" AND a."VRSN" = b."VRSN"
	);

$function$
;

-- DROP FUNCTION public.uuid_generate_v1();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- DROP FUNCTION public.uuid_generate_v1mc();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- DROP FUNCTION public.uuid_generate_v4();

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- DROP FUNCTION public.uuid_nil();

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- DROP FUNCTION public.uuid_ns_dns();

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- DROP FUNCTION public.uuid_ns_oid();

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- DROP FUNCTION public.uuid_ns_url();

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- DROP FUNCTION public.uuid_ns_x500();

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;