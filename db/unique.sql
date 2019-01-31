\c sku_mgmt

CREATE OR REPLACE FUNCTION unique_sku_num_seq(OUT nextfree bigint) AS
$func$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('sku_num_seq'::regclass) val 
   WHERE  NOT EXISTS (SELECT 1 FROM sku WHERE num = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$func$  LANGUAGE plpgsql;
ALTER TABLE sku ALTER COLUMN num SET DEFAULT unique_sku_num_seq();

CREATE OR REPLACE FUNCTION unique_ingred_num_seq(OUT nextfree bigint) AS
$func$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('ingredients_num_seq'::regclass) val
   WHERE  NOT EXISTS (SELECT 1 FROM ingredients WHERE num = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$func$  LANGUAGE plpgsql;
ALTER TABLE ingredients ALTER COLUMN num SET DEFAULT unique_ingred_num_seq();
