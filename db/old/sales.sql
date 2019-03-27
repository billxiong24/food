\c sku_mgmt
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS sales;

-- ASSUMING CUSTOMERS never change
CREATE TABLE public.customers (
    id SERIAL NOT NULL PRIMARY KEY, 
    num integer UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE public.sales (

    sku_num integer NOT NULL REFERENCES public.sku(num),
    week integer NOT NULL,
    year integer NOT NULL,
    customer_num integer NOT NULL REFERENCES customers(num),
    customer_name TEXT NOT NULL REFERENCES customers(name),
    sales integer NOT NULL,
    price_per_case decimal NOT NULL,
    PRIMARY KEY (sku_num, week, year, customer_num)
);
