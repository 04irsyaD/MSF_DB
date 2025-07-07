CREATE SEQUENCE public.code_inventaris_asset_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

--- update sequence
SELECT setval('nama_sequence', 150);



--funtions

CREATE OR REPLACE FUNCTION public.f_add_sequence_t_code_inventaris_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Format angka dengan awalan 'TS' dan leading zero (misal: PO0001, PO0002)
   	NEW."nomor_inventaris" := 'INV' || LPAD(nextval('code_inventaris_asset_seq')::text, 5, '0');
    RETURN NEW;
END;
$function$
;

-- trigger untuk memamnggil funtions

create trigger t_generate_sequence_t_inventaris_asset_seq before
insert
    on
    public.t_inventaris_asset for each row execute function f_add_sequence_t_code_inventaris_asset();