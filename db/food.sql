--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.10
-- Dumped by pg_dump version 9.6.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: billxiong24
--

CREATE TABLE public.ingredients (
    name text NOT NULL,
    num integer NOT NULL,
    vend_info text,
    pkg_size character varying(100) NOT NULL,
    pkg_cost numeric NOT NULL,
    comments text,
    id integer NOT NULL,
    CONSTRAINT ingredients_pkg_cost_check CHECK ((pkg_cost > (0)::numeric))
);


ALTER TABLE public.ingredients OWNER TO billxiong24;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.ingredients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_id_seq OWNER TO billxiong24;

--
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- Name: ingredients_num_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.ingredients_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_num_seq OWNER TO billxiong24;

--
-- Name: ingredients_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.ingredients_num_seq OWNED BY public.ingredients.num;


--
-- Name: productline; Type: TABLE; Schema: public; Owner: billxiong24
--

CREATE TABLE public.productline (
    name text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.productline OWNER TO billxiong24;

--
-- Name: productline_id_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.productline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.productline_id_seq OWNER TO billxiong24;

--
-- Name: productline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.productline_id_seq OWNED BY public.productline.id;


--
-- Name: sku; Type: TABLE; Schema: public; Owner: billxiong24
--

CREATE TABLE public.sku (
    name character varying(32) NOT NULL,
    num integer NOT NULL,
    case_upc bigint NOT NULL,
    unit_upc bigint NOT NULL,
    unit_size text NOT NULL,
    count_per_case integer NOT NULL,
    prd_line text,
    comments text,
    id integer NOT NULL,
    CONSTRAINT sku_count_per_case_check CHECK ((count_per_case > 0))
);


ALTER TABLE public.sku OWNER TO billxiong24;

--
-- Name: sku_id_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_id_seq OWNER TO billxiong24;

--
-- Name: sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.sku_id_seq OWNED BY public.sku.id;


--
-- Name: sku_ingred; Type: TABLE; Schema: public; Owner: billxiong24
--

CREATE TABLE public.sku_ingred (
    sku_num integer NOT NULL,
    ingred_num integer NOT NULL
);


ALTER TABLE public.sku_ingred OWNER TO billxiong24;

--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.sku_ingred_ingred_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_ingred_ingred_num_seq OWNER TO billxiong24;

--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.sku_ingred_ingred_num_seq OWNED BY public.sku_ingred.ingred_num;


--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.sku_ingred_sku_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_ingred_sku_num_seq OWNER TO billxiong24;

--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.sku_ingred_sku_num_seq OWNED BY public.sku_ingred.sku_num;


--
-- Name: sku_num_seq; Type: SEQUENCE; Schema: public; Owner: billxiong24
--

CREATE SEQUENCE public.sku_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_num_seq OWNER TO billxiong24;

--
-- Name: sku_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: billxiong24
--

ALTER SEQUENCE public.sku_num_seq OWNED BY public.sku.num;


--
-- Name: ingredients num; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN num SET DEFAULT nextval('public.ingredients_num_seq'::regclass);


--
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- Name: productline id; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.productline ALTER COLUMN id SET DEFAULT nextval('public.productline_id_seq'::regclass);


--
-- Name: sku num; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku ALTER COLUMN num SET DEFAULT nextval('public.sku_num_seq'::regclass);


--
-- Name: sku id; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku ALTER COLUMN id SET DEFAULT nextval('public.sku_id_seq'::regclass);


--
-- Name: sku_ingred sku_num; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku_ingred ALTER COLUMN sku_num SET DEFAULT nextval('public.sku_ingred_sku_num_seq'::regclass);


--
-- Name: sku_ingred ingred_num; Type: DEFAULT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku_ingred ALTER COLUMN ingred_num SET DEFAULT nextval('public.sku_ingred_ingred_num_seq'::regclass);


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: billxiong24
--

COPY public.ingredients (name, num, vend_info, pkg_size, pkg_cost, comments, id) FROM stdin;
anothername	2	vending	5lbs	45	heldddloworld	2
ing1	44	some vending	11 gallons	15	a comment	3
459ff\\c	49	some vending	11 gallons	15	a comment	4
ing35	47	watwtaawtat	3587 gallons	15	a comment	5
name	6	vending	345lbs	45	helloworld	1
\.


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 5, true);


--
-- Name: ingredients_num_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.ingredients_num_seq', 2, true);


--
-- Data for Name: productline; Type: TABLE DATA; Schema: public; Owner: billxiong24
--

COPY public.productline (name, id) FROM stdin;
prod3	1
\.


--
-- Name: productline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.productline_id_seq', 1, true);


--
-- Data for Name: sku; Type: TABLE DATA; Schema: public; Owner: billxiong24
--

COPY public.sku (name, num, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments, id) FROM stdin;
sku23	100	5043	1123	5 lbs	4	prod3	a comment	2
sku2355	1	5048	1128	5 lbs	4	prod3	a comment	3
sku2356	2	5049	1122	5 lbs	4	prod3	a comment	5
sku210	3	102	1122	5 lbs sku23	4	prod3	a comment with sku210	6
sku2154	4	1023	11222	6 lbs sskusku	4	prod3	another comment	7
sku215423	5	102355	11222	6 lbs sskusku	6	prod3	another comment	8
sku1	12	2449	112553	10 lbs	4	prod3	a comment	4
sku215423	123	1023553	11222	6 lbs sskusku	6	prod3	another comment	9
sku1245872	55	2477	1123	5 lbs	4	prod3	a comment	1
\.


--
-- Name: sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.sku_id_seq', 9, true);


--
-- Data for Name: sku_ingred; Type: TABLE DATA; Schema: public; Owner: billxiong24
--

COPY public.sku_ingred (sku_num, ingred_num) FROM stdin;
1	49
1	47
1	2
2	2
2	47
12	47
12	2
12	49
55	2
55	44
1	6
2	6
55	6
\.


--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.sku_ingred_ingred_num_seq', 1, false);


--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.sku_ingred_sku_num_seq', 1, false);


--
-- Name: sku_num_seq; Type: SEQUENCE SET; Schema: public; Owner: billxiong24
--

SELECT pg_catalog.setval('public.sku_num_seq', 5, true);


--
-- Name: ingredients ingredients_num_key; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_num_key UNIQUE (num);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: productline productline_name_key; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.productline
    ADD CONSTRAINT productline_name_key UNIQUE (name);


--
-- Name: productline productline_pkey; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.productline
    ADD CONSTRAINT productline_pkey PRIMARY KEY (id);


--
-- Name: sku sku_case_upc_key; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_case_upc_key UNIQUE (case_upc);


--
-- Name: sku_ingred sku_ingred_pkey; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_pkey PRIMARY KEY (sku_num, ingred_num);


--
-- Name: sku sku_num; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_num UNIQUE (num);


--
-- Name: sku sku_pkey; Type: CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_pkey PRIMARY KEY (id);


--
-- Name: sku_ingred sku_ingred_ingred_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_ingred_num_fkey FOREIGN KEY (ingred_num) REFERENCES public.ingredients(num) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sku_ingred sku_ingred_sku_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_sku_num_fkey FOREIGN KEY (sku_num) REFERENCES public.sku(num) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sku sku_prd_line_fkey; Type: FK CONSTRAINT; Schema: public; Owner: billxiong24
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_prd_line_fkey FOREIGN KEY (prd_line) REFERENCES public.productline(name) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

