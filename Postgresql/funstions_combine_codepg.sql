
CREATE OR REPLACE FUNCTION public.update_code_asset()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Memperbarui asset_code di tabel t_asset jika is_verified = true
    IF NEW.is_verified = true THEN
        NEW.asset_one = NEW.asset_on_code || '-' || NEW.full_asset_code;
    END IF;

    RETURN NEW;
END;
$function$
;
