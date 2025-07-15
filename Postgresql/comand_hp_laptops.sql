log_asset 




- id_asset
- tanggal perubahan
- ticket insera
- foto asset
- foto SN
- tanggal inventaris
- tanggal verifikasi
- pic inventarisasi
- Verifikator TL
- Verifikator SDA
- kondisi
- status 
- tipe asset


CREATE TABLE public.t_log_asset(
	id serial4 NOT NULL,
	t_asset_id int4 not null,
	t_inventaris_asset_id int4 not null,
	foto_asset varchar(500)  null,
	foto_sn varchar(500)  null
	
	
--	created_by_id uuid NOT NULL,
--	updated_by_id uuid NULL,
--	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
--	updated_at timestamptz(6) NULL,
);





CREATE TABLE public.t_log_asset (
	id serial4 NOT NULL,
	t_asset_id int4 NOT NULL,
	t_inventaris_asset_id int4 NOT NULL,
	change_data timestamptz(6),
	tiket_insera varchar NULL,
	foto_asset varchar(500) NULL,
	foto_ba varchar(500) NULL,
	foto_sn varchar(500) null,
	verified_at timestamptz(6) NULL,
	inventaris_at timestamptz(6) NULL,
	pic_inventarisasi_by_id uuid NULL,
	verified_tl_by_id uuid NULL,
	verified_sda_by_id uuid NULL,
	kondisi_asset varchar null,
	status boolean,
	is_migrated bool DEFAULT false NULL
);



tiket_insera varchar NULL,



kondisi_asset varchar NULL













CREATE OR REPLACE FUNCTION public.update_asset_code_from_log()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
    v_lokasi_code text;
    v_full_asset_code text;
BEGIN
    -- Memastikan asset_code hanya diperbarui jika status_asset_verify_id adalah 1
    IF NEW.status_asset_verify_id = 1 THEN
        -- Mengambil lokasi_code dan full_asset_code dari tabel t_asset
        SELECT lokasi_code, full_asset_code
        INTO v_lokasi_code, v_full_asset_code
        FROM t_asset
        WHERE asset_id = NEW.asset_id;

        -- Memperbarui asset_code di tabel t_asset
        UPDATE t_asset
        SET asset_code = v_lokasi_code || '-' || v_full_asset_code
        WHERE asset_id = NEW.asset_id;
    END IF;

    RETURN NEW;
END;
$function$
;
CREATE TRIGGER t_insert_asset_code_from_log
AFTER insert or update ON t_log_inventaris
FOR EACH ROW
EXECUTE FUNCTION public.update_asset_code_from_log()

CREATE TRIGGER t_insert_asset_code_from_log
AFTER INSERT OR UPDATE ON public.t_log_inventaris
FOR EACH ROW
EXECUTE FUNCTION public.update_asset_code_from_log();


CREATE TABLE public.t_forgot_password (
	id serial4 NOT NULL,
	user_id uuid NOT NULL,
	"email"	varchar(100) null,
	"password" varchar null,
	created_date timestamptz(6) NULL
);

CREATE TABLE public.new_wilayah_kerja (
	id serial4 NOT NULL,
	kode_spbu varchar NULL,
	nama varchar NOT NULL,
	alamat varchar NULL,
	kota_kabupaten_id int4 NULL,
	provinsi_id int4 NULL,
	longtitude varchar NULL,
	latitude varchar NULL,
	flag varchar NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	regional_spbu varchar NULL,
	regional_spbu_id int4 NULL,
	witel_id int4 NULL,
	mor_id int4 NULL,
	"is_RAFI_2022" bool NULL,
	is_jalur_toll bool NULL,
	is_jalur_utama bool NULL,
	is_jalur_wisata bool NULL,
	is_nataru bool NULL,
	tipe_spbu_id int4 NULL,
	regional_id_2 int4 NULL,
	mor_id_2 int4 NULL,
	ploted_stock int4 NULL,
	wilayah_id int4 NULL,
	sla_id int4 NULL,
	new_regional int4 NULL,
	network varchar NULL,
	new_witel int4 NULL,
	"open" varchar NULL,
	closed varchar NULL
);


CREATE TABLE public.level (
	id_level serial4 NOT NULL,
	nama_level varchar NULL,
	keterangan uuid NOT NULL,
	CONSTRAINT pk_t_Status_reject PRIMARY KEY (id_level)
);

create table public.karyawan (
	id_karyawan serial4 not null,
	nama_karyawan varchar(250) null,
	alamat_karyawan varchar(250) null,
	handphone_karyawan varchar(250) null,
	pendidikan_karyawan varchar(250) null,
	username varchar(250) null,
	password varchar(250) null,
	id_level int4 null,
	proses varchar(250) null,
	CONSTRAINT pk_karyawan PRIMARY KEY (id_karyawan)
)


create table public.peniaian (
	id_penilaian serial4 not null,
	id_karyawan  int4 null,
	id_kriteria  int4 null,
	nilai varchar(250),
	CONSTRAINT pk_penialaian PRIMARY KEY (id_penilaian)
)


create table public.kriteria (
	id_kriteria serial4 not null,
	nama_kriteria  int4 null,
	jenis  int4 null,
	bobot varchar(250),
	keterangan varchar(250),
	CONSTRAINT pk_kriteria PRIMARY KEY (id_kriteria)
)


CREATE TABLE public.t_Status_reject (
	id serial4 NOT NULL,
	nama_status varchar NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active boolean null,
	CONSTRAINT pk_t_Status_reject PRIMARY KEY (id)
);

CREATE TABLE public.t_Status_reject (
	id serial4 NOT NULL,
	nama_status varchar NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active boolean null,
	CONSTRAINT pk_t_Status_reject PRIMARY KEY (id)
);

CREATE TABLE public.t_status_asset_verify (
	id serial4 NOT NULL,
	nama_status varchar NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	is_active boolean null,
	CONSTRAINT pk_status_asset_verify PRIMARY KEY (id)
);


ALTER TABLE public.t_inventaris_asset 
ADD COLUMN longitude varchar(100),
ADD COLUMN latitude varchar(100),
ADD COLUMN Status_Coordinate_Verify_id int4,
ADD COLUMN verified_tl_by_id uuid,
add column verified_sda_by_id uuid;


alter table public.t_inventaris_asset 
add CONSTRAINT fk_Status_Coordinate_Verify FOREIGN KEY (Status_Coordinate_Verify_id) references public.t_Status_Coordinate_Verify(id)

alter table public.t_asset 
add column status_asset_verify_id int4 default null


































CREATE TABLE public.new_lokasi (
	id serial4 NOT NULL,
	longtitude varchar NULL,
	latitude varchar NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	wilayah_kerja_id int4 null
);


CREATE OR REPLACE FUNCTION public.update_code_asset()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Memperbarui asset_code di tabel t_asset
    UPDATE t_asset
    SET asset_code = t_asset.lokasi_code || '-' || t_asset.full_asset_code
    WHERE t_asset.asset_id = NEW.asset_id;

    RETURN NEW;
END;
$function$;

UPDATE public.t_asset
SET is_active = NULL
WHERE is_migrated = TRUE;


CREATE TRIGGER trg_update_code_asset
AFTER INSERT OR UPDATE ON t_log_inventaris
FOR EACH ROW
EXECUTE FUNCTION public.update_code_asset();



create trigger t_update_code_asset_lokasi_asset before
insert
    or
update
    on
    public.t_asset for each row execute function update_code_asset()



-- DROP FUNCTION public.update_code_asset();

CREATE OR REPLACE FUNCTION public.update_code_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	select t_log_inventaris tli  tli.asset_id
	udpate(
	select t_asset ta
	ta.lokasi_code 
	ta.full_asset_code
    NEW.asset_code := ta.lokasi_code || '-' || ta.full_asset_code;
	)
    RETURN NEW;
END;
$function$
;












------------------------------------
truncate t_asset
s

CREATE OR REPLACE FUNCTION f_code_update_lokasi_from_kode_spbu()
RETURNS TRIGGER AS $$
BEGIN
    -- Ambil reg_pbu dan wit_id dari tabel kode_pbu berdasarkan kode_pbu
     
   	SELECT wk.regional_spbu_id, wk.witel_id, r.nama INTO NEW.regional_spbu_id, NEW.witel_id, NEW.lokasi_code
	from wilayah_kerja wk 
	left join regional r on wk.regional_spbu_id = r.id 
    WHERE wk.kode_spbu = NEW.kode_spbu;

    -- Mengupdate lokasi sebagai gabungan dari data_pbu dan wit_id
    NEW.lokasi_code := NEW.lokasi_code || ' - ' || NEW.witel_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


create trigger t_update_code_lokasi_asset
before insert or update on public.t_asset_backup 
for each row 
execute function f_code_update_lokasi_from_kode_spbu()

SELECT wk.regional_spbu_id, wk.witel_id, r.nama 
from wilayah_kerja wk 
left join regional r on wk.regional_spbu_id = r.id 
WHERE wk.kode_spbu = NEW.kode_spbu;

update public.t_asset 
set lokasi_code = null  ;

update public.t_asset 
set is_active = true 
where is_migrated = true ;


update public.t_asset 
set lokasi_code = null  
where is_migrated = true;

CREATE OR REPLACE FUNCTION f_code_asset_from_kode_spbu()
RETURNS TRIGGER AS $$
DECLARE 
    order_code varchar(100);
    sequence_number varchar(10);
    next_sequence integer;
BEGIN
    -- Ambil nilai order dari t_kategori_asset berdasarkan id_kategori
    SELECT tka."order"
    INTO order_code
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.id_kategori;

    -- Hitung sequence berikutnya untuk kategori yang sama
    SELECT COALESCE(MAX(SPLIT_PART(asset_code, '-', 2)::int), 0) + 1
    INTO next_sequence
    FROM asset
    WHERE id_kategori = NEW.id_kategori;

    -- Format sequence menjadi 4 digit
    sequence_number := lpad(next_sequence::text, 4, '0');

    -- Gabungkan order_code dengan sequence
    NEW.asset_code := order_code || '-' || sequence_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger t_update_code_asset_from_kode_spbu
before insert or update on public.t_asset_backup 
for each row 
execute function f_code_asset_from_kode_spbu()


CREATE OR REPLACE FUNCTION f_code_asset_from_kode_spbu()
RETURNS TRIGGER AS $$
DECLARE 
    order_code integer;  -- Menggunakan tipe integer untuk order_code
    sequence_number varchar(10);
    next_sequence integer;
BEGIN
    -- Ambil nilai order dari t_kategori_asset berdasarkan kategori_asset
    SELECT tka."order"
    INTO order_code
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.kategori_asset;  -- Menggunakan kategori_asset yang ada di t_asset_backup

    -- Hitung sequence berikutnya untuk kategori yang sama di tabel t_asset_backup
    SELECT COALESCE(MAX(SPLIT_PART(asset_code, '-', 2)::int), 0) + 1
    INTO next_sequence
    FROM t_asset_backup
    WHERE kategori_asset = NEW.kategori_asset;  -- Menghitung berdasarkan kategori yang sama

    -- Format sequence menjadi 4 digit
    sequence_number := lpad(next_sequence::text, 4, '0');

    -- Gabungkan order_code (integer) dengan sequence (string)
    NEW.asset_code := order_code || '-' || sequence_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION f_code_asset_from_kode_spbu()
RETURNS TRIGGER AS $$
DECLARE 
    order_code integer;  -- Menggunakan tipe integer untuk order_code
    sequence_number varchar(10);
    next_sequence integer;
BEGIN
    -- Ambil nilai order dari t_kategori_asset berdasarkan kategori_asset
    SELECT tka."order"
    INTO order_code
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.kategori_asset;  -- Menggunakan kategori_asset yang ada di t_asset_backup

    -- Hitung sequence berikutnya untuk kategori yang sama di tabel t_asset_backup
    -- Menambahkan pemeriksaan untuk memastikan bahwa bagian sequence tidak kosong
    SELECT COALESCE(
        MAX(CASE 
                WHEN SPLIT_PART(asset_code, '-', 2) = '' THEN 0
                ELSE SPLIT_PART(asset_code, '-', 2)::int
            END), 0
    ) + 1
    INTO next_sequence
    FROM t_asset_backup
    WHERE kategori_asset = NEW.kategori_asset;  -- Menghitung berdasarkan kategori yang sama

    -- Format sequence menjadi 4 digit
    sequence_number := lpad(next_sequence::text, 4, '0');

    -- Gabungkan order_code (integer) dengan sequence (string)
    NEW.asset_code := CAST(order_code AS TEXT) || '-' || sequence_number;  -- CAST order_code menjadi TEXT
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.f_code_asset_asset()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE 
    order_code integer;  -- Menggunakan tipe integer untuk order_code
    sequence_number varchar(10);
    next_sequence integer;
BEGIN
    -- Ambil nilai order dari t_kategori_asset berdasarkan kategori_asset
    SELECT tka."order"
    INTO order_code
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.kategori_asset;  -- Menggunakan kategori_asset yang ada di t_asset_backup

    -- Hitung sequence berikutnya untuk kategori dan kode_spbu yang sama di tabel t_asset_backup
    -- Menambahkan pemeriksaan untuk memastikan bahwa bagian sequence tidak kosong
    SELECT COALESCE(
        MAX(CASE 
                WHEN SPLIT_PART(asset_code, '-', 2) = '' THEN 0
                ELSE SPLIT_PART(asset_code, '-', 2)::int
            END), 0
    ) + 1
    INTO next_sequence
    FROM t_asset_backup
    WHERE kategori_asset = NEW.kategori_asset
      AND kode_spbu = NEW.kode_spbu;  -- Menghitung berdasarkan kategori_asset dan kode_spbu yang sama

    -- Format sequence menjadi 4 digit
    sequence_number := lpad(next_sequence::text, 4, '0');

    -- Gabungkan order_code (integer) dengan sequence (string)
    NEW.asset_code := CAST(order_code AS TEXT) || '-' || sequence_number;  -- CAST order_code menjadi TEXT
    
    RETURN NEW;
END;
$function$
;

alter table public.t_pemilik_asset 
add constraint pk_t_pemilik_asset PRIMARY KEY (id)


alter table public.t_asset 
add CONSTRAINT fk_t_asset_pemilik_asset FOREIGN KEY (pemilik_asset_id) REFERENCES public.t_pemilik_asset(id)

alter table public.t_asset 
add CONSTRAINT fk_t_asset_pemilik_asset FOREIGN KEY (pemilik_asset_id) REFERENCES public.t_pemilik_asset(id)

UPDATE public.new_wilayah_kerja
SET new_regional = CASE 
                        when new_regional = 'Regional 4' THEN '4' 
                        ELSE new_regional 
                     END;
                     
                    
                    SELECT * FROM public.t_pemilik_asset WHERE id = 1;
                    
 select pg_terminate_backend(pid)
 from pg_stat_activity
 where pid <> pg_backend_pid() and state = 'idle in transaction' 
 
 UPDATE public.t_asset
SET is_active = NULL
WHERE is_migrated = TRUE;
 
 
 -- DROP FUNCTION public.f_code_update_lokasi_from_kode_spbu();

CREATE OR REPLACE FUNCTION public.f_code_update_code_asset_lokasi_from_kode_spbu()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	nama varchar(100);
	witel_id varchar(100);
BEGIN
    -- Ambil reg_pbu dan wit_id dari tabel kode_pbu berdasarkan kode_pbu
     
   	SELECT  r.code_regional, wk.witel_id INTO nama, witel_id
	from wilayah_kerja wk 
	left join regional r on wk.regional_spbu_id = r.id 
    WHERE wk.kode_spbu = NEW.kode_spbu;

    -- Mengupdate lokasi sebagai gabungan dari data_pbu dan wit_id
    NEW.lokasi_code := nama  || ' - ' || witel_id;
    
    RETURN NEW;
END;
$function$
;


create trigger t_code_asset_t_asset before
insert
    or
update
    on
    public.t_asset for each row execute function f_code_asset_asset()

    
ALTER TABLE public.t_asset 
ALTER COLUMN kondisi_asset SET DEFAULT null ;
    
-- public.wilayah_kerja definition

-- Drop table

-- DROP TABLE public.wilayah_kerja;

CREATE TABLE public.t_wilayah_kerja (
	id int4 DEFAULT nextval('pengirim_penerima_id_seq'::regclass) NOT NULL,
	kode_spbu varchar NULL,
	nama varchar NOT NULL,
	alamat varchar NULL,
	kota_kabupaten_id int4 NULL,
	provinsi_id int4 NULL,
	longtitude varchar NULL,
	latitude varchar NULL,
	flag varchar NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	regional_spbu varchar NULL,
	regional_spbu_id int4 NULL,
	witel_id int4 NULL,
	mor_id int4 NULL,
	"is_RAFI_2022" bool NULL,
	is_jalur_toll bool NULL,
	is_jalur_utama bool NULL,
	is_jalur_wisata bool NULL,
	is_nataru bool NULL,
	tipe_spbu_id int4 NULL,
	regional_id_2 int4 NULL,
	mor_id_2 int4 NULL,
	ploted_stock int4 NULL,
	wilayah_id int4 NULL,
	sla_id int4 NULL
);


show max_connections;

pg_buff

SELECT * FROM pg_available_extensions WHERE name = 'pg_buffercache';

SHOW shared_buffers;SHOW shared_buffers;


CREATE TABLE public.new_wilayah_kerja (
	id int4 DEFAULT nextval('pengirim_penerima_id_seq'::regclass) NOT NULL,
	kode_spbu varchar NULL,
	nama varchar NOT NULL,
	alamat varchar NULL,
	kota_kabupaten_id int4 NULL,
	provinsi_id int4 NULL,
	longtitude varchar NULL,
	latitude varchar NULL,
	flag varchar NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	regional_spbu varchar NULL,
	regional_spbu_id int4 NULL,
	witel_id int4 NULL,
	mor_id int4 NULL,
	"is_RAFI_2022" bool NULL,
	is_jalur_toll bool NULL,
	is_jalur_utama bool NULL,
	is_jalur_wisata bool NULL,
	is_nataru bool NULL,
	tipe_spbu_id int4 NULL,
	regional_id_2 int4 NULL,
	mor_id_2 int4 NULL,
	ploted_stock int4 NULL,
	wilayah_id int4 NULL,
	sla_id int4 NULL
);


select * from  public.wilayah_kerja wk  where wk.kode_spbu = '%64773%'



CREATE TABLE public.new_wilayah_kerja (
	id int4 DEFAULT nextval('pengirim_penerima_id_seq'::regclass) NOT NULL,
	kode_spbu varchar NULL,
	nama varchar NOT NULL,
	alamat varchar NULL,
	kota_kabupaten_id int4 NULL,
	provinsi_id int4 NULL,
	longtitude varchar NULL,
	latitude varchar NULL,
	flag varchar NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	regional_spbu varchar NULL,
	regional_spbu_id int4 NULL,
	witel_id int4 NULL,
	mor_id int4 NULL,
	"is_RAFI_2022" bool NULL,
	is_jalur_toll bool NULL,
	is_jalur_utama bool NULL,
	is_jalur_wisata bool NULL,
	is_nataru bool NULL,
	tipe_spbu_id int4 NULL,
	regional_id_2 int4 NULL,
	mor_id_2 int4 NULL,
	ploted_stock int4 NULL,
	wilayah_id int4 NULL,
	sla_id int4 NULL,
	new_regional varchar NULL,
	network varchar NULL,
	new_witel varchar NULL,
	"open" varchar NULL,
	closed varchar NULL
);


SELECT COALESCE(
    MAX(CASE 
            WHEN SPLIT_PART(asset_code, '-', 2) = '' THEN 0
            ELSE SPLIT_PART(asset_code, '-', 2)::int
        END), 0
) + 1 AS next_sequence
FROM t_asset_backup
WHERE kategori_asset = 1
  AND kode_spbu = '7495705';

 
 SELECT 
    asset_code,
    SPLIT_PART(asset_code, '-', 2) AS sequence_part
FROM t_asset_backup
WHERE kategori_asset = 11
  AND kode_spbu = '7495705';
 
 SELECT * FROM t_asset_backup;

truncate wilayah_kerja 

show max_connections;


-- DROP FUNCTION public.f_code_asset_asset();

CREATE OR REPLACE FUNCTION public.f_code_asset_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE 
    order_code integer;  -- Using integer type for order_code
    sequence_number varchar(10);
    next_sequence integer;
BEGIN
    -- Retrieve the order value from t_kategori_asset based on kategori_asset
    SELECT tka."order"
    INTO order_code
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.kategori_asset;  -- Using kategori_asset from t_asset_backup

    -- Calculate the next sequence for the same kategori_asset in the t_asset table
    -- Adding a check to ensure the sequence part is not empty
    SELECT COALESCE(
        MAX(CASE 
                WHEN SPLIT_PART(asset_code, '-', 2) = '' THEN 0
                ELSE SPLIT_PART(asset_code, '-', 2)::int
            END), 0
    ) + 1
    INTO next_sequence
    FROM t_asset
    WHERE kategori_asset = NEW.kategori_asset;  -- Calculate based on the same kategori_asset only

    -- Format the sequence as 4 digits
    sequence_number := lpad(next_sequence::text, 5, '0');

    -- Concatenate order_code (integer) with sequence (string)
    NEW.asset_code := CAST(order_code AS TEXT) || '-' || sequence_number;  -- CAST order_code to TEXT
    
    RETURN NEW;
END;
$function$;

create trigger t_code_asset_t_asset before
insert
    or
update
    on
    public.t_asset for each row execute function f_code_asset_asset()
    
    update public.t_asset 
set kondisi_asset = null ;

CREATE TABLE public.new_witel (
	id serial4 NOT NULL,
	nama varchar NULL,
	"order" int4 NULL,
	code int4 NULL,
	CONSTRAINT new_witel_pk PRIMARY KEY (id)
);


CREATE OR REPLACE FUNCTION public.f_code_asset_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE 
    order_code integer;  -- Using integer type for order_code
    sequence_number varchar(10);
    next_sequence integer;
BEGIN
    -- Retrieve the order value from t_kategori_asset based on kategori_asset
    SELECT tka."order"
    INTO order_code
    FROM t_kategori_asset tka
    WHERE tka.id = NEW.kategori_asset;  -- Using kategori_asset from t_asset_backup

    -- Calculate the next sequence for the same kategori_asset in the t_asset table
    -- Adding a check to ensure the sequence part is not empty
    SELECT COALESCE(
        MAX(CASE 
                WHEN SPLIT_PART(asset_code, '-', 2) = '' THEN 0
                ELSE SPLIT_PART(asset_code, '-', 2)::int
            END), 0
    ) + 1
    INTO next_sequence
    FROM t_asset
    WHERE kategori_asset = NEW.kategori_asset;  -- Calculate based on the same kategori_asset only

    -- Format the sequence as 4 digits
    sequence_number := lpad(next_sequence::text, 5, '0');

    -- Concatenate order_code (integer) with sequence (string)
    NEW.asset_code := CAST(order_code AS TEXT) || '-' || sequence_number;  -- CAST order_code to TEXT
    
    RETURN NEW;
END;
$function$;



CREATE OR REPLACE FUNCTION update_code_asset()
RETURNS TRIGGER AS $$
BEGIN
    NEW.full_asset_code := NEW.code_asset || '-' || NEW.lokasi_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER t_update_code_asset_lokasi_asset
BEFORE INSERT OR UPDATE ON public.t_asset 
FOR EACH ROW
EXECUTE FUNCTION update_code_asset();

create trigger t_code_asset_lokasi_from_kode_spbu before
insert
    or
update
    on
    public.t_asset for each row execute function f_code_update_code_asset_lokasi_from_kode_spbu()

    
    create trigger t_code_asset_t_asset before
insert
    or
update
    on
    public.t_asset for each row execute function f_code_asset_asset()
    
    create trigger t_code_asset_lokasi_from_kode_spbu before
insert
    or
update
    on
    public.t_asset for each row execute function f_code_update_code_asset_lokasi_from_kode_spbu()
    
    
    PERFORM f_code_update_code_asset_lokasi_from_kode_spbu();
   
   
   create 
