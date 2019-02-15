--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.10
-- Dumped by pg_dump version 9.6.10
DROP DATABASE IF EXISTS :tabl;
CREATE DATABASE :tabl;
\c :tabl

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


--
-- Name: weights_t; Type: TYPE; Schema: public; Owner: billxiong24
--

CREATE TYPE public.weights_t AS ENUM (
    'oz',
    'lb',
    't',
    'g',
    'kg',
    'fl-oz',
    'pt',
    'qt',
    'gal',
    'ml',
    'l',
    'count'
);


ALTER TYPE public.weights_t OWNER TO billxiong24;

--
-- Name: unique_ingred_num_seq(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unique_ingred_num_seq(OUT nextfree bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('ingredients_num_seq'::regclass) val
   WHERE  NOT EXISTS (SELECT 1 FROM ingredients WHERE num = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$$;


ALTER FUNCTION public.unique_ingred_num_seq(OUT nextfree bigint) OWNER TO postgres;

--
-- Name: unique_sku_num_seq(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unique_sku_num_seq(OUT nextfree bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('sku_num_seq'::regclass) val 
   WHERE  NOT EXISTS (SELECT 1 FROM sku WHERE num = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$$;


ALTER FUNCTION public.unique_sku_num_seq(OUT nextfree bigint) OWNER TO postgres;

--
-- Name: unique_users_num_seq(); Type: FUNCTION; Schema: public; Owner: billxiong24
--

CREATE FUNCTION public.unique_users_num_seq(OUT nextfree bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('users_id_seq'::regclass) val
   WHERE  NOT EXISTS (SELECT 1 FROM users WHERE id = val);
   EXIT WHEN FOUND;
END LOOP; 
END
$$;


ALTER FUNCTION public.unique_users_num_seq(OUT nextfree bigint) OWNER TO billxiong24;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: formula; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formula (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    comment text,
    num integer NOT NULL
);


ALTER TABLE public.formula OWNER TO postgres;

--
-- Name: formula_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formula_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.formula_id_seq OWNER TO postgres;

--
-- Name: formula_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formula_id_seq OWNED BY public.formula.id;


--
-- Name: formula_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formula_ingredients (
    formula_id integer,
    ingredients_id integer,
    quantity integer NOT NULL,
    unit public.weights_t NOT NULL
);


ALTER TABLE public.formula_ingredients OWNER TO postgres;

--
-- Name: formula_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formula_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.formula_num_seq OWNER TO postgres;

--
-- Name: formula_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formula_num_seq OWNED BY public.formula.num;


--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    name text NOT NULL,
    num integer DEFAULT public.unique_ingred_num_seq() NOT NULL,
    vend_info text,
    pkg_cost numeric NOT NULL,
    comments text,
    id integer NOT NULL,
    pkg_size integer NOT NULL,
    unit public.weights_t NOT NULL,
    CONSTRAINT ingredients_pkg_cost_check CHECK ((pkg_cost > (0)::numeric))
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_id_seq OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- Name: ingredients_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_num_seq OWNER TO postgres;

--
-- Name: ingredients_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_num_seq OWNED BY public.ingredients.num;


--
-- Name: manufacturing_goal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_goal (
    id integer NOT NULL,
    name text,
    user_id integer NOT NULL
);


ALTER TABLE public.manufacturing_goal OWNER TO postgres;

--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_id_seq OWNED BY public.manufacturing_goal.id;


--
-- Name: manufacturing_goal_sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_goal_sku (
    mg_id integer NOT NULL,
    sku_id integer NOT NULL,
    quantity numeric NOT NULL
);


ALTER TABLE public.manufacturing_goal_sku OWNER TO postgres;

--
-- Name: manufacturing_goal_sku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_sku_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_sku_id_seq OWNED BY public.manufacturing_goal_sku.mg_id;


--
-- Name: manufacturing_goal_sku_sku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_sku_sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_sku_sku_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_sku_sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_sku_sku_id_seq OWNED BY public.manufacturing_goal_sku.sku_id;


--
-- Name: manufacturing_goal_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_user_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_user_id_seq OWNED BY public.manufacturing_goal.user_id;


--
-- Name: productline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productline (
    name text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.productline OWNER TO postgres;

--
-- Name: productline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.productline_id_seq OWNER TO postgres;

--
-- Name: productline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productline_id_seq OWNED BY public.productline.id;


--
-- Name: sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sku (
    name character varying(32) NOT NULL,
    num integer DEFAULT public.unique_sku_num_seq() NOT NULL,
    case_upc bigint NOT NULL,
    unit_upc bigint NOT NULL,
    unit_size text NOT NULL,
    count_per_case integer NOT NULL,
    prd_line text,
    comments text,
    id integer NOT NULL,
    formula_id integer,
    formula_scale numeric DEFAULT 1.0 NOT NULL,
    man_rate numeric NOT NULL,
    CONSTRAINT sku_count_per_case_check CHECK ((count_per_case > 0))
);


ALTER TABLE public.sku OWNER TO postgres;

--
-- Name: sku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_id_seq OWNER TO postgres;

--
-- Name: sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_id_seq OWNED BY public.sku.id;


--
-- Name: sku_ingred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sku_ingred (
    sku_num integer NOT NULL,
    ingred_num integer NOT NULL,
    quantity numeric NOT NULL
);


ALTER TABLE public.sku_ingred OWNER TO postgres;

--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_ingred_ingred_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_ingred_ingred_num_seq OWNER TO postgres;

--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_ingred_ingred_num_seq OWNED BY public.sku_ingred.ingred_num;


--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_ingred_sku_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_ingred_sku_num_seq OWNER TO postgres;

--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_ingred_sku_num_seq OWNED BY public.sku_ingred.sku_num;


--
-- Name: sku_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_num_seq OWNER TO postgres;

--
-- Name: sku_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_num_seq OWNED BY public.sku.num;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uname character varying(32) NOT NULL,
    id integer DEFAULT public.unique_users_num_seq() NOT NULL,
    password character varying(60) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: formula id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula ALTER COLUMN id SET DEFAULT nextval('public.formula_id_seq'::regclass);


--
-- Name: formula num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula ALTER COLUMN num SET DEFAULT nextval('public.formula_num_seq'::regclass);


--
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- Name: manufacturing_goal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal ALTER COLUMN id SET DEFAULT nextval('public.manufacturing_goal_id_seq'::regclass);


--
-- Name: manufacturing_goal user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal ALTER COLUMN user_id SET DEFAULT nextval('public.manufacturing_goal_user_id_seq'::regclass);


--
-- Name: manufacturing_goal_sku mg_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku ALTER COLUMN mg_id SET DEFAULT nextval('public.manufacturing_goal_sku_id_seq'::regclass);


--
-- Name: manufacturing_goal_sku sku_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku ALTER COLUMN sku_id SET DEFAULT nextval('public.manufacturing_goal_sku_sku_id_seq'::regclass);


--
-- Name: productline id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productline ALTER COLUMN id SET DEFAULT nextval('public.productline_id_seq'::regclass);


--
-- Name: sku id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku ALTER COLUMN id SET DEFAULT nextval('public.sku_id_seq'::regclass);


--
-- Name: sku_ingred sku_num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred ALTER COLUMN sku_num SET DEFAULT nextval('public.sku_ingred_sku_num_seq'::regclass);


--
-- Name: sku_ingred ingred_num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred ALTER COLUMN ingred_num SET DEFAULT nextval('public.sku_ingred_ingred_num_seq'::regclass);


--
-- Data for Name: formula; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula (id, name, comment, num) FROM stdin;
1	sas	some	1
3	formula609	\N	2
4	formula6209	\N	3
5	temp	hi	4
\.


--
-- Name: formula_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formula_id_seq', 5, true);


--
-- Data for Name: formula_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula_ingredients (formula_id, ingredients_id, quantity, unit) FROM stdin;
1	16	1	lb
1	19	10	lb
4	18	0	lb
4	19	2	lb
4	21	4	lb
4	22	6	lb
3	11	3	lb
1	13	5	lb
\.


--
-- Name: formula_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formula_num_seq', 4, true);


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (name, num, vend_info, pkg_cost, comments, id, pkg_size, unit) FROM stdin;
459ff\\c	49	some vending	15	a comment	4	2	lb
name	6	vending	45	helloworld	1	2	lb
ing4545	1414	tnoerhr vending	10	a comment	6	2	lb
ing24545	1415	tnoerhr vending	10	a comment	7	2	lb
name6969	12	\N	10	\N	9	2	lb
ing234	47	please	15	a comment	5	2	lb
ing1992	563	waterino	500	\N	11	2	lb
namerino	5633	waterinrterro	5300	\N	12	2	lb
ing6663	3	dalis	10	commenting	13	2	lb
ing1112	4	dalis	10	commenting	14	2	lb
ing11123	2533	dalis	10	commenting	15	2	lb
ing111253	5	dalis	10	commenting	16	2	lb
ing190	7	dalis	10	commenting	18	2	lb
ing19309	2364	dalis	10	commenting	19	2	lb
4398	888	dalis	10	commenting	20	2	lb
114	898	dalis	10	commenting	21	2	lb
nameinger	8	dalis	10	commenting	22	2	lb
name223	9	dalis	10	commenting	23	2	lb
name142	10	dalis	10	commenting	24	2	lb
namefii	11	dalis	10	commenting	25	2	lb
name25	13	dalis	10	commenting	27	2	lb
eriuadf	14	tnoerhr vending	10	a comment	28	2	lb
adsoidf	15	\N	10	\N	29	2	lb
ing22812	16	\N	523	\N	30	2	lb
newname	17	\N	10	\N	31	2	lb
adsfiuer	18	tnoerhr vending	10	a comment	32	2	lb
inginginging	19	tnoerhr vending	10	a comment	33	2	lb
skuskus	698	someinfo please	45	newcomment wiht id	2	2	lb
nameinge	20	hi	45	\N	34	2	lb
nameingerr	29	hi	45	\N	35	2	lb
namesepingerr	30	hi	45	\N	36	2	lb
namerring	31	hi	45	\N	38	2	lb
ingeroa	32	hier	451	\N	39	2	lb
roanameing	33	company	451	\N	40	2	lb
name rooro	34	compdsany	451	\N	41	2	lb
name anotering69	35	compdsany	451	\N	42	2	lb
ing and name	36	compdsany	451	\N	43	2	lb
\.


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 43, true);


--
-- Name: ingredients_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_num_seq', 36, true);


--
-- Data for Name: manufacturing_goal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_goal (id, name, user_id) FROM stdin;
2	goal1	6
5	goal2	7
7	goal2	6
8	newgoal	6
9	sids goals	9
\.


--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_id_seq', 9, true);


--
-- Data for Name: manufacturing_goal_sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_goal_sku (mg_id, sku_id, quantity) FROM stdin;
7	3	0.6
7	5	0.32
7	7	0.88
7	20	0.12
2	3	0.43
2	6	0.43
2	5	0.47
9	8	0.4
9	1	12
9	9	0.6
8	3	1.33
8	5	1.33
8	6	1.33
8	11	1.33
\.


--
-- Name: manufacturing_goal_sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_sku_id_seq', 1, false);


--
-- Name: manufacturing_goal_sku_sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_sku_sku_id_seq', 1, false);


--
-- Name: manufacturing_goal_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_user_id_seq', 1, false);


--
-- Data for Name: productline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productline (name, id) FROM stdin;
prod4	2
prod69	1
prod51	5
helloprod	6
\.


--
-- Name: productline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productline_id_seq', 6, true);


--
-- Data for Name: sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku (name, num, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments, id, formula_id, formula_scale, man_rate) FROM stdin;
sku69	1234	23116	11222	6 lbs sskusku	6	prod69	another comment	11	3	1.5	1.0
sku6543	5727	5555	696	22	3	prod51	\N	22	4	3.3	1.0
asku4	19	551234352	443234	1 gallons	2	prod51	\N	27	4	3.3	1.0
sku1245872	55	2477	1123	5 lbs	4	prod69	a comment	1	4	1.5	1.0
namesku3	20	69283413	3649823	ten gallons	6	prod51	\N	28	4	3.3	1.0
namesku3	21	6934483413	364986623	ten gallons	6	prod51	\N	29	4	3.3	1.0
namesku3	22	9823471385	11123984	ten gallons	6	prod51	\N	30	4	3.3	1.0
namesku328	23	132874684753	34523466444	4 pounds	12	prod51	\N	31	4	3.3	1.0
sku2154	4	1023	11222	6 lbs sskusku	4	prod69	another comment	7	1	2.5	1.0
namesku328	24	34578237487	354444444	4 pounds	12	prod69	\N	32	4	1.5	1.0
nameaeriusku328	25	2853729348	354444444	4 pounds	12	prod69	\N	33	4	1.5	1.0
skueename	26	888888384	456456345	4 pounds	12	prod69	\N	34	4	1.5	1.0
skueename	27	34343434	456456345	4 pounds	12	prod69	\N	35	4	1.5	1.0
skueename	28	100000001	456456345	4 pounds	12	prod69	\N	36	4	1.5	1.0
sku2355	1	5048	1128	5 lbs	4	prod69	a comment	3	1	1.5	1.0
sku2356	2	5049	1122	5 lbs	4	prod69	a comment	5	1	1.5	1.0
sku210	3	102	1122	5 lbs sku23	4	prod69	a comment with sku210	6	1	1.5	1.0
sku215423	5	102355	11222	6 lbs sskusku	6	prod69	another comment	8	1	1.5	1.0
sku215423	123	1023553	11222	6 lbs sskusku	6	prod69	another comment	9	1	1.5	1.0
sku690	7	1001	65345	12 lbs sy98vv	98	prod4	commentingg	13	3	2.4	1.0
sku690	8	43434	65345	12 lbs sy98vv	98	prod4	commentingg	14	3	2.4	1.0
sku720	9	12345	65653	12 lbs	998	prod4	commentingg	15	4	2.4	1.0
sku1	12	2449	112553	10 lbs	4	prod4	a comment	4	4	2.4	1.0
sku723	11	123345	65653	12 lbs	998	prod4	commentingg	17	4	2.4	1.0
sku723	13	233	65653	12 lbs	998	prod4	commentingg	19	4	2.4	1.0
skusku	15	3213	65653	12 lbs	998	prod4	\N	21	4	2.4	1.0
namesku	16	413445546	14235	59 lbs	12	prod4	\N	23	4	2.4	1.0
hryname	17	23874	14235	59 lbs	12	prod4	\N	24	4	2.4	1.0
hrynamesku	18	2387334	134235	59 lb14dds	124	prod4	\N	26	4	2.4	1.0
sku13462	14	3549	65653	12 lbs	998	prod4	\N	20	5	2.4	1.0
\.


--
-- Name: sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_id_seq', 36, true);


--
-- Data for Name: sku_ingred; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku_ingred (sku_num, ingred_num, quantity) FROM stdin;
1	47	1
2	47	1
12	47	1
12	49	1
1	6	1
2	6	1
55	6	1
7	47	1
1	698	1
2	698	1
12	698	1
7	8	2
7	10	4
12	8	2
12	10	4
4	8	2
4	10	4
1	10	12
1	49	1.4
1	7	1.5
7	9	3
7	11	15
14	1414	5
14	1415	4
14	11	13
55	8	4
55	9	6
55	698	5.2
\.


--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_ingred_ingred_num_seq', 1, false);


--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_ingred_sku_num_seq', 1, false);


--
-- Name: sku_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_num_seq', 28, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (uname, id, password) FROM stdin;
gordon5	6	$2b$10$nXnMFKFaqLj00/a1Vs7fJ.EWLVdthJqxGa70b9.Y4lKzFeO5FwHo2
admin	7	$2b$10$QJigJyIlGtU7pYpnRO2foOJOBqeiladsPXeEj4vLxSnAuPQbIdAcS
fff	8	$2b$10$nraqxUvDeUlU7pWdzXb5z.AOcXb9Z2ipB1uci6NowxFTyhA4GnYaq
siddarth	9	$2b$10$Pwp3lW15hTFzklMarcAqTuxpe3yHvlXRRKf.xSeuyxzXXTXBU5jlG
faa	10	$2b$10$uVfDG4KA9rrX7mNdBm8Xt.xAjsFBUITXbyer5z6sOWBh1MAvhhDOq
111	11	$2b$10$Q9gVDGojNiyrgw63qxpOlOUuaX3mVTSBURhFhMt/l8VxVrfN3X9om
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: formula_ingredients formula_ingredients_formula_id_ingredients_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_ingredients
    ADD CONSTRAINT formula_ingredients_formula_id_ingredients_id_key UNIQUE (formula_id, ingredients_id);


--
-- Name: formula formula_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula
    ADD CONSTRAINT formula_num_key UNIQUE (num);


--
-- Name: formula formula_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula
    ADD CONSTRAINT formula_pkey PRIMARY KEY (id);


--
-- Name: ingredients ignredients_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ignredients_name_key UNIQUE (name);


--
-- Name: ingredients ingredients_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_num_key UNIQUE (num);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: manufacturing_goal manufacturing_goal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal
    ADD CONSTRAINT manufacturing_goal_pkey PRIMARY KEY (id);


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_pkey PRIMARY KEY (mg_id, sku_id);


--
-- Name: manufacturing_goal manufacturing_goal_user_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal
    ADD CONSTRAINT manufacturing_goal_user_id_name_key UNIQUE (user_id, name);


--
-- Name: productline productline_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productline
    ADD CONSTRAINT productline_name_key UNIQUE (name);


--
-- Name: productline productline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productline
    ADD CONSTRAINT productline_pkey PRIMARY KEY (id);


--
-- Name: sku sku_case_upc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_case_upc_key UNIQUE (case_upc);


--
-- Name: sku_ingred sku_ingred_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_pkey PRIMARY KEY (sku_num, ingred_num);


--
-- Name: sku sku_num; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_num UNIQUE (num);


--
-- Name: sku sku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_uname; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uname UNIQUE (uname);


--
-- Name: formula_ingredients formula_ingredients_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_ingredients
    ADD CONSTRAINT formula_ingredients_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formula(id) ON DELETE CASCADE;


--
-- Name: formula_ingredients formula_ingredients_ingredients_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_ingredients
    ADD CONSTRAINT formula_ingredients_ingredients_id_fkey FOREIGN KEY (ingredients_id) REFERENCES public.ingredients(id) ON DELETE CASCADE;


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_fkey FOREIGN KEY (mg_id) REFERENCES public.manufacturing_goal(id) ON DELETE CASCADE;


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.sku(id) ON DELETE CASCADE;


--
-- Name: manufacturing_goal manufacturing_goal_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal
    ADD CONSTRAINT manufacturing_goal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sku sku_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formula(id) ON DELETE CASCADE;


--
-- Name: sku_ingred sku_ingred_ingred_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_ingred_num_fkey FOREIGN KEY (ingred_num) REFERENCES public.ingredients(num) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sku_ingred sku_ingred_sku_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_sku_num_fkey FOREIGN KEY (sku_num) REFERENCES public.sku(num) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sku sku_prd_line_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_prd_line_fkey FOREIGN KEY (prd_line) REFERENCES public.productline(name) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

