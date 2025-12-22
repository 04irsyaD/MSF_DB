-- SAMPLE DATA
-- CREATE TABLE kode_ticket (17	A01C5D009FAD0D7A	C0FCE1C6	WBS-9	VER-007	PMK-002	JPD-001


SELECT 
    'function' AS object_type,
    n.nspname AS schema,
    p.proname AS name,
    NULL AS table_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prokind = 'f'
  AND pg_get_functiondef(p.oid) ILIKE '%RSCR%'
  
  
  
  
  
 CREATE OR REPLACE FUNCTION generate_hex8()
RETURNS TEXT AS $$
BEGIN
    RETURN UPPER(substring(md5(random()::text), 1, 8));
END;
$$ LANGUAGE plpgsql VOLATILE;



SELECT generate_hex8();


CREATE OR REPLACE FUNCTION f_set_hex16_passcode()
RETURNS trigger AS $$
BEGIN
    -- langsung isi kolom di row baru
    NEW.trackid := UPPER(substring(md5(random()::text), 1, 16));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_hex16_passcode
BEFORE INSERT ON rpeot_funtions
FOR EACH ROW
EXECUTE FUNCTION f_set_hex16_passcode();


CREATE OR REPLACE FUNCTION f_set_hex8_passcode()
RETURNS trigger AS $$
BEGIN
    -- langsung isi kolom di row baru
    NEW.passcode := UPPER(substring(md5(random()::text), 1, 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_hex8_passcode
BEFORE INSERT ON rpeot_funtions
FOR EACH ROW
EXECUTE FUNCTION f_set_hex8_passcode();


CREATE OR REPLACE FUNCTION f_set_wbs_code()
RETURNS trigger AS $$
DECLARE 
    next_num INT;
BEGIN
    SELECT COALESCE(MAX(split_part(nuper, '-', 2)::int), 0) + 1
    INTO next_num
    FROM rpeot_funtions;

    NEW.nuper := 'WBS-' || next_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_wbs_code
BEFORE INSERT ON rpeot_funtions
FOR EACH ROW
EXECUTE FUNCTION f_set_wbs_code();


CREATE OR REPLACE FUNCTION f_set_val_code()
RETURNS trigger AS $$
DECLARE 
    next_num INT;
BEGIN
    SELECT COALESCE(MAX(split_part(val, '-', 2)::int), 0) + 1
    INTO next_num
    FROM rpeot_funtions;

    NEW.val := 'VER-' || LPAD(next_num::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_val_code
BEFORE INSERT ON rpeot_funtions
FOR EACH ROW
EXECUTE FUNCTION f_set_val_code();

CREATE OR REPLACE FUNCTION f_set_pmk_code()
RETURNS trigger AS $$
DECLARE 
    next_num INT;
BEGIN
    SELECT COALESCE(MAX(split_part(pmk, '-', 2)::int), 0) + 1
    INTO next_num
    FROM rpeot_funtions;

    NEW.pmk := 'PMK-' || LPAD(next_num::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_pmk_code
BEFORE INSERT ON rpeot_funtions
FOR EACH ROW
EXECUTE FUNCTION f_set_pmk_code();


CREATE OR REPLACE FUNCTION f_set_jpd_code()
RETURNS trigger AS $$
DECLARE 
    next_num INT;
BEGIN
    SELECT COALESCE(MAX(split_part(jpd, '-', 2)::int), 0) + 1
    INTO next_num
    FROM rpeot_funtions;

    NEW.jpd := 'JPD-' || LPAD(next_num::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_jpd_code
BEFORE INSERT ON rpeot_funtions
FOR EACH ROW
EXECUTE FUNCTION f_set_jpd_code();


