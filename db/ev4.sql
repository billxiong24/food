--
-- PostgreSQL database dump
--

-- Dumped from database version 10.7 (Ubuntu 10.7-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.7 (Ubuntu 10.7-0ubuntu0.18.04.1)

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
-- Name: weights_t; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public.weights_t OWNER TO postgres;

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
-- Name: unique_users_num_seq(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.unique_users_num_seq(OUT nextfree bigint) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    num integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


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
    quantity numeric NOT NULL,
    unit text NOT NULL
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
    pkg_size numeric NOT NULL,
    unit text NOT NULL,
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
    user_id integer NOT NULL,
    deadline bigint,
    enabled boolean DEFAULT false,
    last_edit timestamp without time zone DEFAULT now()
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
    quantity numeric NOT NULL,
    start_time bigint DEFAULT 0,
    end_time bigint DEFAULT 0,
    man_line_id integer DEFAULT 0
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
-- Name: manufacturing_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_line (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    shortname character varying(5) NOT NULL,
    comment text
);


ALTER TABLE public.manufacturing_line OWNER TO postgres;

--
-- Name: manufacturing_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_line_id_seq OWNER TO postgres;

--
-- Name: manufacturing_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_line_id_seq OWNED BY public.manufacturing_line.id;


--
-- Name: manufacturing_line_sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_line_sku (
    sku_id integer NOT NULL,
    manufacturing_line_id integer NOT NULL
);


ALTER TABLE public.manufacturing_line_sku OWNER TO postgres;

--
-- Name: plant_mgr; Type: TABLE; Schema: public; Owner: vcm
--

CREATE TABLE public.plant_mgr (
    user_id integer NOT NULL,
    manline_id integer NOT NULL
);


ALTER TABLE public.plant_mgr OWNER TO vcm;

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
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    sku_num integer NOT NULL,
    week integer NOT NULL,
    year integer NOT NULL,
    customer_num integer NOT NULL,
    customer_name text NOT NULL,
    sales integer NOT NULL,
    price_per_case numeric NOT NULL
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sku (
    name character varying(32) NOT NULL,
    num integer DEFAULT public.unique_sku_num_seq() NOT NULL,
    case_upc bigint NOT NULL,
    unit_upc bigint NOT NULL,
    unit_size text NOT NULL,
    count_per_case numeric NOT NULL,
    prd_line text,
    comments text,
    id integer NOT NULL,
    formula_id integer,
    formula_scale numeric DEFAULT 1.0 NOT NULL,
    man_rate numeric NOT NULL,
    man_setup_cost numeric DEFAULT 1.0 NOT NULL,
    man_run_cost numeric DEFAULT 1.0 NOT NULL,
    CONSTRAINT sku_count_per_case_check CHECK ((count_per_case > (0)::numeric))
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
    password character varying(60) NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    analyst boolean DEFAULT false NOT NULL,
    prod_mgr boolean DEFAULT false NOT NULL,
    bus_mgr boolean DEFAULT false NOT NULL
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
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


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
-- Name: manufacturing_line id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line ALTER COLUMN id SET DEFAULT nextval('public.manufacturing_line_id_seq'::regclass);


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
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, num, name) FROM stdin;
1	0	Weis Markets
2	1	Albertsons LLC
3	2	Food Lion
4	3	Hannaford
5	4	Giant
6	5	Stop & Shop
7	6	Kroger
8	7	SpartanNash
9	8	SuperValu Inc.
10	9	Shop 'n Save
11	10	C-Town
12	11	Sunflower Farmers Market
13	12	Scolari's Food and Drug
14	13	Brookshire Grocery Company
15	14	FoodCity
16	15	Brown & Cole
17	16	K-VA-T Food Stores
18	17	Broulims
19	18	Super Saver
20	19	Raley's
21	20	Walmart
22	21	Village Market Food Center
23	22	Food Town
24	23	Western Beef
25	24	Chappells Hometown Foods
26	25	Hank's Market
27	26	Market Basket
28	27	Nam Dae Mun Farmers Market
29	28	Great Valu Markets
30	29	Felpausch
31	30	SuperTarget
32	31	Compare Foods Supermarket
33	32	Pueblo
34	33	Lauer's Supermarket and Bakery
35	34	Mayfair Markets
36	35	Schnucks
37	36	D&W Food Centers
38	37	Fred Meyer
39	38	Great American Food Stores
40	39	Fareway
41	40	Buehler's Buy-Low
42	41	Arlan's Market
43	42	Sack&Save
44	43	United Grocery Outlet
45	44	Foodland
46	45	Landis Supermarkets
47	46	Macey's Market
48	47	Food Pavilion
49	48	Miller's Fresh Foods
50	49	FoodMaxx
51	50	Sav-A-Lot
52	51	Valley Marketplace
53	52	Beach's Market
54	53	DeCicco Family Market
55	54	Gelson's Markets
56	55	Piggly Wiggly
57	56	Hollywood Super Market
58	57	Lunds & Byerlys
59	58	Red Apple
60	59	Meijer
61	60	Super Dollar Discount Foods
62	61	Breaux Mart Supermarkets
63	62	Westborn Market
64	63	Yoke's Fresh Market
65	64	Big M
66	65	The Fresh Grocer
67	66	McCaffrey's
68	67	Crosby's Marketplace
69	68	Ideal Food Basket
70	69	Western Supermarket
71	70	Zup's
72	71	Remke Markets
73	72	Acme Fresh Market
74	73	Homeland
75	74	Tom Thumb Food & Pharmacy
76	75	Pick 'N Save
77	76	Ingles Markets
78	77	Woodman's Food Market
79	78	Dahl's Foods
80	79	Harding's Friendly Markets
81	80	New Leaf Community Markets
82	81	Hugo's
83	82	Vinckier Foods
84	83	BI-LO
85	84	Mac's Fresh Market
86	85	ShopRite
87	86	Quality Foods
88	87	Sav-Mor Foods
89	88	Lin's Fresh Market
90	89	Plum Market
91	90	H-E-B
92	91	Big Y Foods
93	92	Central Market
94	93	Coborns
95	94	H-E-B Plus
96	95	Cost Cutter
97	96	Key Markets
98	97	Trade Fair
99	98	Sunfresh Market
100	99	Strack & Van Til
101	100	Shaw's and Star Market
102	101	Gristedes
103	102	Matherne's Supermarkets
104	103	Wayne's Hometown Market
\.


--
-- Data for Name: formula; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula (id, name, comment, num) FROM stdin;
5	temp	hi	4
6	232332		1870083086
7	hjj		1606971358
8	jijojklk		447225196
9	sdfadfsad		814643368
10	fr		174981705
14	dfd		110189731
19	asiago		194533447
13	19999999999		1707997933
15	1999999998		845134465
12	dgf		529439176
20	wew		1566371748
22	sa		1795272291
21	s		910865847
23	kkk		1215094996
24	kkkk		1212704914
25	kkkk		1740542157
26	kkkkkk		106538759
27	xsfxbgrdbrsascvas		984816612
30	new potatoes		253
\.


--
-- Data for Name: formula_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula_ingredients (formula_id, ingredients_id, quantity, unit) FROM stdin;
10	18	1	kg
10	19	1	kg
10	22	1	kg
14	1	1	kg
13	1	1	kg
12	1	1	kg
12	6	1	kg
12	7	1	kg
12	9	1	kg
19	1	1	kg
30	38	1	kg
\.


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (name, num, vend_info, pkg_cost, comments, id, pkg_size, unit) FROM stdin;
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
nameinger	8	dalis	10	commenting	22	2	lb
name223	9	dalis	10	commenting	23	2	lb
name142	10	dalis	10	commenting	24	2	lb
namefii	11	dalis	10	commenting	25	2	lb
name25	13	dalis	10	commenting	27	2	lb
eriuadf	14	tnoerhr vending	10	a comment	28	2	lb
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
test	101010101	hello	43	hello	44	2	lb
njnjnjnj	1474627209		12345		47	1234	kg
hbhhbb	1139352703		123		48	123	kg
jncjdncj	292495232		123		49	123	kg
ewrewr	159814885		13122		50	12121	kg
4398	889	dalis	10	commenting	20	2	lb
459ff\\c	50	some vending	15	a comment	4	2	lb
Carrots	1661988573	Somewhere	4		52	2	lb
Sugar	643490096	ConAgra	10.5		53	5	g
Corn	756313755		16		54	5	kg
\.


--
-- Data for Name: manufacturing_goal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_goal (id, name, user_id, deadline, enabled, last_edit) FROM stdin;
9	sids goals	9	1551157200000	t	2019-04-01 20:27:13.662379
34567	Christmas Bag	14	1550707200000	t	2019-04-01 20:27:13.662379
7	goal2	6	1551157200000	t	2019-04-01 20:27:13.662379
5	goal2	7	1551157200000	t	2019-04-10 14:06:41.042853
8	newgoal	6	1551157200000	f	2019-04-01 20:27:13.662379
12345	Thanksgiving Bundle	12	1550534400000	f	2019-04-16 16:23:28.30567
56789	Empty Bundle	15	1550534400000	f	2019-04-16 16:23:31.071189
23456	Sports Pack	13	1550534400000	f	2019-04-16 16:23:54.675959
12	adfe	7	1556150400000	f	2019-04-16 16:25:10.72847
13	testes	7	1556150400000	f	2019-04-16 16:25:25.918109
67890	Super Pack	16	1550793600000	t	2019-04-16 17:16:32.09228
14	Goal to Move	17	1551052800000	f	2019-04-16 17:27:09.307129
2	goal1	6	1566864000000	t	2019-04-16 17:48:31.228212
10	My Goal	17	1569456000000	f	2019-04-16 17:49:24.774222
11	Something	17	1551312000000	f	2019-04-16 17:50:22.969214
16	Gordon_test	17	1556323200000	t	2019-04-16 19:22:55.74412
\.


--
-- Data for Name: manufacturing_goal_sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_goal_sku (mg_id, sku_id, quantity, start_time, end_time, man_line_id) FROM stdin;
14	37	2	0	0	0
11	37	23	0	0	0
16	20	10	0	0	0
7	20	0.12	0	0	0
\.


--
-- Data for Name: manufacturing_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_line (id, name, shortname, comment) FROM stdin;
8	Washington Soups	DC2	\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec augue nec orci ornare fringilla. Fusce venenatis ultrices eros at vehicula. Pellentesque malesuada id felis fringilla ullamcorper. Phasellus tortor risus, blandit eget placerat et, ultrices sed felis. Phasellus sit amet pellentesque felis, id semper enim. Nam vulputate quam eu lectus.
1	hi	HI33	
2	hi	MANLI	
3	hi	MANDI	
5	naa	MAXI	
1234	Boise Manufacturing Plant 1	BMP1	smells bad
1235	Boise Manufacturing Plant 2	BMP2	smells bad
1236	Boise Manufacturing Plant 3	BMP3	smells bad
1237	Dub Manufacturing Factory 1	DMF1	located in Marca, Venuzuela
1238	Dub Manufacturing Factory 2	DMF2	Located in St. George, Alabama
0	empty	empty	empty
10	Test	TT123	
\.


--
-- Data for Name: manufacturing_line_sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_line_sku (sku_id, manufacturing_line_id) FROM stdin;
20	8
\.


--
-- Data for Name: plant_mgr; Type: TABLE DATA; Schema: public; Owner: vcm
--

COPY public.plant_mgr (user_id, manline_id) FROM stdin;
25	1234
25	1236
22	1234
22	1235
22	1236
23	8
\.


--
-- Data for Name: productline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productline (name, id) FROM stdin;
prod4	2
prod69	1
prod51	5
helloprod	6
Jerkin Turkin Meaty Burkins	201
Aunt Jemina Bakery	293
Jell-O	996
Vitamint	649
Gold	624
Cherry Farms	1031
Mama Chous	788
thehehehehe	7
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (sku_num, week, year, customer_num, customer_name, sales, price_per_case) FROM stdin;
14	1	2019	5	Stop & Shop	45	268.25
14	2	2019	30	SuperTarget	336	254.75
14	4	2019	39	Fareway	128	268.25
14	5	2019	30	SuperTarget	308	254.75
14	6	2019	5	Stop & Shop	48	268.25
14	6	2019	67	Crosby's Marketplace	84	268.25
14	6	2019	75	Pick 'N Save	42	281.75
14	7	2019	20	Walmart	197	241.5
14	7	2019	74	Tom Thumb Food & Pharmacy	19	268.25
14	8	2019	30	SuperTarget	346	254.75
14	9	2019	21	Village Market Food Center	21	362.25
14	9	2019	92	Central Market	44	268.25
14	11	2019	5	Stop & Shop	52	268.25
14	11	2019	30	SuperTarget	346	254.75
14	12	2019	12	Scolari's Food and Drug	55	281.75
24222	2	2019	34	Mayfair Markets	8	83
24222	3	2019	14	FoodCity	13	75.75
24222	3	2019	43	United Grocery Outlet	7	90.25
24222	4	2019	72	Acme Fresh Market	8	72.25
24222	5	2019	34	Mayfair Markets	7	83
24222	5	2019	49	FoodMaxx	3	72.25
24222	7	2019	20	Walmart	56	65
24222	7	2019	40	Buehler's Buy-Low	7	72.25
24222	8	2019	34	Mayfair Markets	7	83
24222	9	2019	72	Acme Fresh Market	9	72.25
24222	10	2019	49	FoodMaxx	3	72.25
24222	10	2019	66	McCaffrey's	11	79.5
24222	11	2019	34	Mayfair Markets	7	83
14	1	2018	5	Stop & Shop	51	268.25
14	2	2018	30	SuperTarget	326	254.75
14	4	2018	39	Fareway	149	268.25
14	5	2018	30	SuperTarget	347	254.75
14	6	2018	5	Stop & Shop	51	268.25
14	6	2018	67	Crosby's Marketplace	75	268.25
14	6	2018	75	Pick 'N Save	34	281.75
14	7	2018	20	Walmart	204	241.5
14	7	2018	74	Tom Thumb Food & Pharmacy	19	268.25
14	8	2018	30	SuperTarget	360	254.75
14	9	2018	21	Village Market Food Center	18	362.25
14	9	2018	92	Central Market	40	268.25
14	11	2018	5	Stop & Shop	54	268.25
14	11	2018	30	SuperTarget	348	254.75
14	12	2018	12	Scolari's Food and Drug	63	281.75
14	14	2018	30	SuperTarget	382	254.75
14	14	2018	74	Tom Thumb Food & Pharmacy	17	268.25
14	16	2018	5	Stop & Shop	55	268.25
14	17	2018	30	SuperTarget	332	254.75
14	17	2018	67	Crosby's Marketplace	78	268.25
14	18	2018	39	Fareway	132	268.25
14	20	2018	30	SuperTarget	371	254.75
14	21	2018	5	Stop & Shop	47	268.25
14	21	2018	74	Tom Thumb Food & Pharmacy	15	268.25
14	22	2018	20	Walmart	214	241.5
14	23	2018	30	SuperTarget	378	254.75
14	23	2018	75	Pick 'N Save	39	281.75
14	26	2018	5	Stop & Shop	49	268.25
14	26	2018	30	SuperTarget	326	254.75
14	27	2018	21	Village Market Food Center	20	362.25
14	27	2018	92	Central Market	41	268.25
14	28	2018	12	Scolari's Food and Drug	63	281.75
14	28	2018	67	Crosby's Marketplace	77	268.25
14	28	2018	74	Tom Thumb Food & Pharmacy	16	268.25
14	29	2018	30	SuperTarget	370	254.75
14	31	2018	5	Stop & Shop	49	268.25
14	32	2018	30	SuperTarget	356	254.75
14	32	2018	39	Fareway	148	268.25
14	35	2018	30	SuperTarget	344	254.75
14	35	2018	74	Tom Thumb Food & Pharmacy	16	268.25
14	36	2018	5	Stop & Shop	53	268.25
14	37	2018	20	Walmart	220	241.5
14	38	2018	30	SuperTarget	330	254.75
14	39	2018	67	Crosby's Marketplace	74	268.25
14	40	2018	75	Pick 'N Save	39	281.75
14	41	2018	5	Stop & Shop	48	268.25
14	41	2018	30	SuperTarget	282	254.75
14	42	2018	74	Tom Thumb Food & Pharmacy	17	268.25
14	44	2018	12	Scolari's Food and Drug	59	281.75
14	44	2018	30	SuperTarget	328	254.75
14	45	2018	21	Village Market Food Center	17	362.25
14	45	2018	92	Central Market	41	268.25
14	46	2018	5	Stop & Shop	48	268.25
14	46	2018	39	Fareway	122	268.25
14	47	2018	30	SuperTarget	296	254.75
14	49	2018	74	Tom Thumb Food & Pharmacy	17	268.25
14	50	2018	30	SuperTarget	296	254.75
14	50	2018	67	Crosby's Marketplace	87	268.25
14	51	2018	5	Stop & Shop	46	268.25
14	52	2018	20	Walmart	208	241.5
24222	2	2018	34	Mayfair Markets	8	83
24222	3	2018	14	FoodCity	11	75.75
24222	3	2018	43	United Grocery Outlet	8	90.25
24222	4	2018	72	Acme Fresh Market	8	72.25
24222	5	2018	34	Mayfair Markets	8	83
24222	5	2018	49	FoodMaxx	4	72.25
24222	7	2018	20	Walmart	54	65
24222	7	2018	40	Buehler's Buy-Low	7	72.25
24222	8	2018	34	Mayfair Markets	7	83
24222	9	2018	72	Acme Fresh Market	9	72.25
24222	10	2018	49	FoodMaxx	3	72.25
24222	10	2018	66	McCaffrey's	11	79.5
24222	11	2018	34	Mayfair Markets	8	83
24222	13	2018	14	FoodCity	11	75.75
24222	14	2018	34	Mayfair Markets	6	83
24222	14	2018	43	United Grocery Outlet	8	90.25
24222	14	2018	72	Acme Fresh Market	8	72.25
24222	15	2018	49	FoodMaxx	3	72.25
24222	17	2018	34	Mayfair Markets	7	83
24222	17	2018	40	Buehler's Buy-Low	7	72.25
24222	19	2018	72	Acme Fresh Market	9	72.25
24222	20	2018	34	Mayfair Markets	7	83
24222	20	2018	49	FoodMaxx	4	72.25
24222	22	2018	20	Walmart	49	65
24222	23	2018	14	FoodCity	13	75.75
24222	23	2018	34	Mayfair Markets	7	83
24222	24	2018	66	McCaffrey's	12	79.5
24222	24	2018	72	Acme Fresh Market	8	72.25
24222	25	2018	43	United Grocery Outlet	7	90.25
24222	25	2018	49	FoodMaxx	4	72.25
24222	26	2018	34	Mayfair Markets	6	83
24222	27	2018	40	Buehler's Buy-Low	7	72.25
24222	29	2018	34	Mayfair Markets	7	83
24222	29	2018	72	Acme Fresh Market	8	72.25
24222	30	2018	49	FoodMaxx	3	72.25
24222	32	2018	34	Mayfair Markets	6	83
24222	33	2018	14	FoodCity	11	75.75
24222	34	2018	72	Acme Fresh Market	9	72.25
24222	35	2018	34	Mayfair Markets	7	83
24222	35	2018	49	FoodMaxx	3	72.25
24222	36	2018	43	United Grocery Outlet	8	90.25
24222	37	2018	20	Walmart	47	65
24222	37	2018	40	Buehler's Buy-Low	7	72.25
24222	38	2018	34	Mayfair Markets	6	83
24222	38	2018	66	McCaffrey's	10	79.5
24222	39	2018	72	Acme Fresh Market	10	72.25
24222	40	2018	49	FoodMaxx	3	72.25
24222	41	2018	34	Mayfair Markets	6	83
24222	43	2018	14	FoodCity	12	75.75
24222	44	2018	34	Mayfair Markets	8	83
24222	44	2018	72	Acme Fresh Market	10	72.25
24222	45	2018	49	FoodMaxx	3	72.25
24222	47	2018	34	Mayfair Markets	6	83
24222	47	2018	40	Buehler's Buy-Low	7	72.25
24222	47	2018	43	United Grocery Outlet	8	90.25
24222	49	2018	72	Acme Fresh Market	9	72.25
24222	50	2018	34	Mayfair Markets	8	83
24222	50	2018	49	FoodMaxx	3	72.25
24222	52	2018	20	Walmart	43	65
24222	52	2018	66	McCaffrey's	11	79.5
14	1	2017	5	Stop & Shop	46	268.25
14	2	2017	30	SuperTarget	295	254.75
14	4	2017	39	Fareway	150	268.25
14	5	2017	30	SuperTarget	299	254.75
14	6	2017	5	Stop & Shop	43	268.25
14	6	2017	67	Crosby's Marketplace	88	268.25
14	6	2017	75	Pick 'N Save	35	281.75
14	7	2017	20	Walmart	230	241.5
14	7	2017	74	Tom Thumb Food & Pharmacy	20	268.25
14	8	2017	30	SuperTarget	349	254.75
14	9	2017	21	Village Market Food Center	22	362.25
14	9	2017	92	Central Market	45	268.25
14	11	2017	5	Stop & Shop	53	268.25
14	11	2017	30	SuperTarget	306	254.75
14	12	2017	12	Scolari's Food and Drug	64	281.75
14	14	2017	30	SuperTarget	378	254.75
14	14	2017	74	Tom Thumb Food & Pharmacy	16	268.25
14	16	2017	5	Stop & Shop	46	268.25
14	17	2017	30	SuperTarget	316	254.75
14	17	2017	67	Crosby's Marketplace	66	268.25
14	18	2017	39	Fareway	146	268.25
14	20	2017	30	SuperTarget	381	254.75
14	21	2017	5	Stop & Shop	54	268.25
14	21	2017	74	Tom Thumb Food & Pharmacy	17	268.25
14	22	2017	20	Walmart	228	241.5
14	23	2017	30	SuperTarget	364	254.75
14	23	2017	75	Pick 'N Save	33	281.75
14	26	2017	5	Stop & Shop	57	268.25
14	26	2017	30	SuperTarget	320	254.75
14	27	2017	21	Village Market Food Center	21	362.25
14	27	2017	92	Central Market	36	268.25
14	28	2017	12	Scolari's Food and Drug	65	281.75
14	28	2017	67	Crosby's Marketplace	74	268.25
14	28	2017	74	Tom Thumb Food & Pharmacy	17	268.25
14	29	2017	30	SuperTarget	376	254.75
14	31	2017	5	Stop & Shop	49	268.25
14	32	2017	30	SuperTarget	330	254.75
14	32	2017	39	Fareway	132	268.25
14	35	2017	30	SuperTarget	327	254.75
14	35	2017	74	Tom Thumb Food & Pharmacy	14	268.25
14	36	2017	5	Stop & Shop	46	268.25
14	37	2017	20	Walmart	236	241.5
14	38	2017	30	SuperTarget	290	254.75
14	39	2017	67	Crosby's Marketplace	79	268.25
14	40	2017	75	Pick 'N Save	33	281.75
14	41	2017	5	Stop & Shop	49	268.25
14	41	2017	30	SuperTarget	325	254.75
14	42	2017	74	Tom Thumb Food & Pharmacy	14	268.25
14	44	2017	12	Scolari's Food and Drug	61	281.75
14	44	2017	30	SuperTarget	339	254.75
14	45	2017	21	Village Market Food Center	18	362.25
14	45	2017	92	Central Market	40	268.25
14	46	2017	5	Stop & Shop	42	268.25
14	46	2017	39	Fareway	131	268.25
14	47	2017	30	SuperTarget	293	254.75
14	49	2017	74	Tom Thumb Food & Pharmacy	16	268.25
14	50	2017	30	SuperTarget	323	254.75
14	50	2017	67	Crosby's Marketplace	90	268.25
14	51	2017	5	Stop & Shop	48	268.25
14	52	2017	20	Walmart	215	241.5
24222	2	2017	34	Mayfair Markets	8	83
24222	3	2017	14	FoodCity	12	75.75
24222	3	2017	43	United Grocery Outlet	7	90.25
24222	4	2017	72	Acme Fresh Market	8	72.25
24222	5	2017	34	Mayfair Markets	7	83
24222	5	2017	49	FoodMaxx	3	72.25
24222	7	2017	20	Walmart	47	65
24222	7	2017	40	Buehler's Buy-Low	6	72.25
24222	8	2017	34	Mayfair Markets	8	83
24222	9	2017	72	Acme Fresh Market	9	72.25
24222	10	2017	49	FoodMaxx	3	72.25
24222	10	2017	66	McCaffrey's	11	79.5
24222	11	2017	34	Mayfair Markets	8	83
24222	13	2017	14	FoodCity	11	75.75
24222	14	2017	34	Mayfair Markets	7	83
24222	14	2017	43	United Grocery Outlet	8	90.25
24222	14	2017	72	Acme Fresh Market	8	72.25
24222	15	2017	49	FoodMaxx	4	72.25
24222	17	2017	34	Mayfair Markets	8	83
24222	17	2017	40	Buehler's Buy-Low	7	72.25
24222	19	2017	72	Acme Fresh Market	10	72.25
24222	20	2017	34	Mayfair Markets	7	83
24222	20	2017	49	FoodMaxx	3	72.25
24222	22	2017	20	Walmart	55	65
24222	23	2017	14	FoodCity	13	75.75
24222	23	2017	34	Mayfair Markets	7	83
24222	24	2017	66	McCaffrey's	10	79.5
24222	24	2017	72	Acme Fresh Market	10	72.25
24222	25	2017	43	United Grocery Outlet	7	90.25
24222	25	2017	49	FoodMaxx	3	72.25
24222	26	2017	34	Mayfair Markets	7	83
24222	27	2017	40	Buehler's Buy-Low	6	72.25
24222	29	2017	34	Mayfair Markets	7	83
24222	29	2017	72	Acme Fresh Market	10	72.25
24222	30	2017	49	FoodMaxx	4	72.25
24222	32	2017	34	Mayfair Markets	7	83
24222	33	2017	14	FoodCity	12	75.75
24222	34	2017	72	Acme Fresh Market	8	72.25
24222	35	2017	34	Mayfair Markets	7	83
24222	35	2017	49	FoodMaxx	4	72.25
24222	36	2017	43	United Grocery Outlet	8	90.25
24222	37	2017	20	Walmart	45	65
24222	37	2017	40	Buehler's Buy-Low	6	72.25
24222	38	2017	34	Mayfair Markets	7	83
24222	38	2017	66	McCaffrey's	10	79.5
24222	39	2017	72	Acme Fresh Market	10	72.25
24222	40	2017	49	FoodMaxx	3	72.25
24222	41	2017	34	Mayfair Markets	6	83
24222	43	2017	14	FoodCity	14	75.75
24222	44	2017	34	Mayfair Markets	7	83
24222	44	2017	72	Acme Fresh Market	9	72.25
24222	45	2017	49	FoodMaxx	3	72.25
24222	47	2017	34	Mayfair Markets	7	83
24222	47	2017	40	Buehler's Buy-Low	6	72.25
24222	47	2017	43	United Grocery Outlet	9	90.25
24222	49	2017	72	Acme Fresh Market	10	72.25
24222	50	2017	34	Mayfair Markets	6	83
24222	50	2017	49	FoodMaxx	3	72.25
24222	52	2017	20	Walmart	45	65
24222	52	2017	66	McCaffrey's	11	79.5
14	1	2016	5	Stop & Shop	41	268.25
14	2	2016	30	SuperTarget	305	254.75
14	4	2016	39	Fareway	151	268.25
14	5	2016	30	SuperTarget	318	254.75
14	6	2016	5	Stop & Shop	51	268.25
14	6	2016	67	Crosby's Marketplace	85	268.25
14	6	2016	75	Pick 'N Save	34	281.75
14	7	2016	20	Walmart	210	241.5
14	7	2016	74	Tom Thumb Food & Pharmacy	16	268.25
14	8	2016	30	SuperTarget	363	254.75
14	9	2016	21	Village Market Food Center	20	362.25
14	9	2016	92	Central Market	42	268.25
14	11	2016	5	Stop & Shop	45	268.25
14	11	2016	30	SuperTarget	323	254.75
14	12	2016	12	Scolari's Food and Drug	53	281.75
14	14	2016	30	SuperTarget	359	254.75
14	14	2016	74	Tom Thumb Food & Pharmacy	17	268.25
14	16	2016	5	Stop & Shop	48	268.25
14	17	2016	30	SuperTarget	374	254.75
14	17	2016	67	Crosby's Marketplace	69	268.25
14	18	2016	39	Fareway	151	268.25
14	20	2016	30	SuperTarget	391	254.75
14	21	2016	5	Stop & Shop	48	268.25
14	21	2016	74	Tom Thumb Food & Pharmacy	17	268.25
14	22	2016	20	Walmart	224	241.5
14	23	2016	30	SuperTarget	364	254.75
14	23	2016	75	Pick 'N Save	36	281.75
14	26	2016	5	Stop & Shop	53	268.25
14	26	2016	30	SuperTarget	338	254.75
14	27	2016	21	Village Market Food Center	22	362.25
14	27	2016	92	Central Market	42	268.25
14	28	2016	12	Scolari's Food and Drug	62	281.75
14	28	2016	67	Crosby's Marketplace	78	268.25
14	28	2016	74	Tom Thumb Food & Pharmacy	17	268.25
14	29	2016	30	SuperTarget	369	254.75
14	31	2016	5	Stop & Shop	49	268.25
14	32	2016	30	SuperTarget	364	254.75
14	32	2016	39	Fareway	130	268.25
14	35	2016	30	SuperTarget	351	254.75
14	35	2016	74	Tom Thumb Food & Pharmacy	17	268.25
14	36	2016	5	Stop & Shop	50	268.25
14	37	2016	20	Walmart	226	241.5
14	38	2016	30	SuperTarget	327	254.75
14	39	2016	67	Crosby's Marketplace	77	268.25
14	40	2016	75	Pick 'N Save	34	281.75
14	41	2016	5	Stop & Shop	46	268.25
14	41	2016	30	SuperTarget	288	254.75
14	42	2016	74	Tom Thumb Food & Pharmacy	17	268.25
14	44	2016	12	Scolari's Food and Drug	63	281.75
14	44	2016	30	SuperTarget	334	254.75
14	45	2016	21	Village Market Food Center	17	362.25
14	45	2016	92	Central Market	48	268.25
14	46	2016	5	Stop & Shop	41	268.25
14	46	2016	39	Fareway	135	268.25
14	47	2016	30	SuperTarget	314	254.75
14	49	2016	74	Tom Thumb Food & Pharmacy	18	268.25
14	50	2016	30	SuperTarget	304	254.75
14	50	2016	67	Crosby's Marketplace	89	268.25
14	51	2016	5	Stop & Shop	42	268.25
14	52	2016	20	Walmart	196	241.5
24222	2	2016	34	Mayfair Markets	7	83
24222	3	2016	14	FoodCity	13	75.75
24222	3	2016	43	United Grocery Outlet	8	90.25
24222	4	2016	72	Acme Fresh Market	10	72.25
24222	5	2016	34	Mayfair Markets	7	83
24222	5	2016	49	FoodMaxx	3	72.25
24222	7	2016	20	Walmart	53	65
24222	7	2016	40	Buehler's Buy-Low	7	72.25
24222	8	2016	34	Mayfair Markets	8	83
24222	9	2016	72	Acme Fresh Market	9	72.25
24222	10	2016	49	FoodMaxx	3	72.25
24222	10	2016	66	McCaffrey's	13	79.5
24222	11	2016	34	Mayfair Markets	7	83
24222	13	2016	14	FoodCity	13	75.75
24222	14	2016	34	Mayfair Markets	6	83
24222	14	2016	43	United Grocery Outlet	8	90.25
24222	14	2016	72	Acme Fresh Market	9	72.25
24222	15	2016	49	FoodMaxx	4	72.25
24222	17	2016	34	Mayfair Markets	7	83
24222	17	2016	40	Buehler's Buy-Low	6	72.25
24222	19	2016	72	Acme Fresh Market	9	72.25
24222	20	2016	34	Mayfair Markets	8	83
24222	20	2016	49	FoodMaxx	4	72.25
24222	22	2016	20	Walmart	50	65
24222	23	2016	14	FoodCity	12	75.75
24222	23	2016	34	Mayfair Markets	7	83
24222	24	2016	66	McCaffrey's	12	79.5
24222	24	2016	72	Acme Fresh Market	8	72.25
24222	25	2016	43	United Grocery Outlet	7	90.25
24222	25	2016	49	FoodMaxx	4	72.25
24222	26	2016	34	Mayfair Markets	7	83
24222	27	2016	40	Buehler's Buy-Low	8	72.25
24222	29	2016	34	Mayfair Markets	7	83
24222	29	2016	72	Acme Fresh Market	10	72.25
24222	30	2016	49	FoodMaxx	3	72.25
24222	32	2016	34	Mayfair Markets	6	83
24222	33	2016	14	FoodCity	12	75.75
24222	34	2016	72	Acme Fresh Market	10	72.25
24222	35	2016	34	Mayfair Markets	6	83
24222	35	2016	49	FoodMaxx	4	72.25
24222	36	2016	43	United Grocery Outlet	8	90.25
24222	37	2016	20	Walmart	48	65
24222	37	2016	40	Buehler's Buy-Low	6	72.25
24222	38	2016	34	Mayfair Markets	7	83
24222	38	2016	66	McCaffrey's	12	79.5
24222	39	2016	72	Acme Fresh Market	9	72.25
24222	40	2016	49	FoodMaxx	3	72.25
24222	41	2016	34	Mayfair Markets	8	83
24222	43	2016	14	FoodCity	14	75.75
24222	44	2016	34	Mayfair Markets	7	83
24222	44	2016	72	Acme Fresh Market	9	72.25
24222	45	2016	49	FoodMaxx	3	72.25
24222	47	2016	34	Mayfair Markets	8	83
24222	47	2016	40	Buehler's Buy-Low	7	72.25
24222	47	2016	43	United Grocery Outlet	9	90.25
24222	49	2016	72	Acme Fresh Market	10	72.25
24222	50	2016	34	Mayfair Markets	7	83
24222	50	2016	49	FoodMaxx	3	72.25
24222	52	2016	20	Walmart	52	65
24222	52	2016	66	McCaffrey's	12	79.5
14	1	2015	5	Stop & Shop	42	268.25
14	2	2015	30	SuperTarget	334	254.75
14	4	2015	39	Fareway	125	268.25
14	5	2015	30	SuperTarget	351	254.75
14	6	2015	5	Stop & Shop	52	268.25
14	6	2015	67	Crosby's Marketplace	87	268.25
14	6	2015	75	Pick 'N Save	34	281.75
14	7	2015	20	Walmart	206	241.5
14	7	2015	74	Tom Thumb Food & Pharmacy	16	268.25
14	8	2015	30	SuperTarget	311	254.75
14	9	2015	21	Village Market Food Center	20	362.25
14	9	2015	92	Central Market	40	268.25
14	11	2015	5	Stop & Shop	48	268.25
14	11	2015	30	SuperTarget	301	254.75
14	12	2015	12	Scolari's Food and Drug	63	281.75
14	14	2015	30	SuperTarget	379	254.75
14	14	2015	74	Tom Thumb Food & Pharmacy	17	268.25
14	16	2015	5	Stop & Shop	55	268.25
14	17	2015	30	SuperTarget	322	254.75
14	17	2015	67	Crosby's Marketplace	76	268.25
14	18	2015	39	Fareway	142	268.25
14	20	2015	30	SuperTarget	322	254.75
14	21	2015	5	Stop & Shop	52	268.25
14	21	2015	74	Tom Thumb Food & Pharmacy	17	268.25
14	22	2015	20	Walmart	215	241.5
14	23	2015	30	SuperTarget	357	254.75
14	23	2015	75	Pick 'N Save	36	281.75
14	26	2015	5	Stop & Shop	55	268.25
14	26	2015	30	SuperTarget	372	254.75
14	27	2015	21	Village Market Food Center	20	362.25
14	27	2015	92	Central Market	40	268.25
14	28	2015	12	Scolari's Food and Drug	68	281.75
14	28	2015	67	Crosby's Marketplace	78	268.25
14	28	2015	74	Tom Thumb Food & Pharmacy	15	268.25
14	29	2015	30	SuperTarget	355	254.75
14	31	2015	5	Stop & Shop	54	268.25
14	32	2015	30	SuperTarget	340	254.75
14	32	2015	39	Fareway	142	268.25
14	35	2015	30	SuperTarget	303	254.75
14	35	2015	74	Tom Thumb Food & Pharmacy	17	268.25
14	36	2015	5	Stop & Shop	52	268.25
14	37	2015	20	Walmart	236	241.5
14	38	2015	30	SuperTarget	300	254.75
14	39	2015	67	Crosby's Marketplace	89	268.25
14	40	2015	75	Pick 'N Save	38	281.75
14	41	2015	5	Stop & Shop	46	268.25
14	41	2015	30	SuperTarget	343	254.75
14	42	2015	74	Tom Thumb Food & Pharmacy	17	268.25
14	44	2015	12	Scolari's Food and Drug	63	281.75
14	44	2015	30	SuperTarget	324	254.75
14	45	2015	21	Village Market Food Center	19	362.25
14	45	2015	92	Central Market	40	268.25
14	46	2015	5	Stop & Shop	47	268.25
14	46	2015	39	Fareway	126	268.25
14	47	2015	30	SuperTarget	316	254.75
14	49	2015	74	Tom Thumb Food & Pharmacy	17	268.25
14	50	2015	30	SuperTarget	281	254.75
14	50	2015	67	Crosby's Marketplace	92	268.25
14	51	2015	5	Stop & Shop	40	268.25
14	52	2015	20	Walmart	239	241.5
24222	2	2015	34	Mayfair Markets	7	83
24222	3	2015	14	FoodCity	11	75.75
24222	3	2015	43	United Grocery Outlet	7	90.25
24222	4	2015	72	Acme Fresh Market	8	72.25
24222	5	2015	34	Mayfair Markets	7	83
24222	5	2015	49	FoodMaxx	3	72.25
24222	7	2015	20	Walmart	49	65
24222	7	2015	40	Buehler's Buy-Low	7	72.25
24222	8	2015	34	Mayfair Markets	8	83
24222	9	2015	72	Acme Fresh Market	8	72.25
24222	10	2015	49	FoodMaxx	3	72.25
24222	10	2015	66	McCaffrey's	10	79.5
24222	11	2015	34	Mayfair Markets	7	83
24222	13	2015	14	FoodCity	13	75.75
24222	14	2015	34	Mayfair Markets	7	83
24222	14	2015	43	United Grocery Outlet	6	90.25
24222	14	2015	72	Acme Fresh Market	8	72.25
24222	15	2015	49	FoodMaxx	4	72.25
24222	17	2015	34	Mayfair Markets	7	83
24222	17	2015	40	Buehler's Buy-Low	6	72.25
24222	19	2015	72	Acme Fresh Market	8	72.25
24222	20	2015	34	Mayfair Markets	8	83
24222	20	2015	49	FoodMaxx	4	72.25
24222	22	2015	20	Walmart	51	65
24222	23	2015	14	FoodCity	13	75.75
24222	23	2015	34	Mayfair Markets	7	83
24222	24	2015	66	McCaffrey's	11	79.5
24222	24	2015	72	Acme Fresh Market	8	72.25
24222	25	2015	43	United Grocery Outlet	6	90.25
24222	25	2015	49	FoodMaxx	4	72.25
24222	26	2015	34	Mayfair Markets	6	83
24222	27	2015	40	Buehler's Buy-Low	6	72.25
24222	29	2015	34	Mayfair Markets	7	83
24222	29	2015	72	Acme Fresh Market	8	72.25
24222	30	2015	49	FoodMaxx	3	72.25
24222	32	2015	34	Mayfair Markets	6	83
24222	33	2015	14	FoodCity	11	75.75
24222	34	2015	72	Acme Fresh Market	10	72.25
24222	35	2015	34	Mayfair Markets	6	83
24222	35	2015	49	FoodMaxx	3	72.25
24222	36	2015	43	United Grocery Outlet	7	90.25
24222	37	2015	20	Walmart	45	65
24222	37	2015	40	Buehler's Buy-Low	7	72.25
24222	38	2015	34	Mayfair Markets	8	83
24222	38	2015	66	McCaffrey's	12	79.5
24222	39	2015	72	Acme Fresh Market	10	72.25
24222	40	2015	49	FoodMaxx	4	72.25
24222	41	2015	34	Mayfair Markets	7	83
24222	43	2015	14	FoodCity	13	75.75
24222	44	2015	34	Mayfair Markets	8	83
24222	44	2015	72	Acme Fresh Market	10	72.25
24222	45	2015	49	FoodMaxx	3	72.25
24222	47	2015	34	Mayfair Markets	7	83
24222	47	2015	40	Buehler's Buy-Low	6	72.25
24222	47	2015	43	United Grocery Outlet	9	90.25
24222	49	2015	72	Acme Fresh Market	8	72.25
24222	50	2015	34	Mayfair Markets	8	83
24222	50	2015	49	FoodMaxx	3	72.25
24222	52	2015	20	Walmart	44	65
24222	52	2015	66	McCaffrey's	11	79.5
14	1	2014	5	Stop & Shop	47	268.25
14	2	2014	30	SuperTarget	296	254.75
14	4	2014	39	Fareway	144	268.25
14	5	2014	30	SuperTarget	339	254.75
14	6	2014	5	Stop & Shop	51	268.25
14	6	2014	67	Crosby's Marketplace	71	268.25
14	6	2014	75	Pick 'N Save	36	281.75
14	7	2014	20	Walmart	192	241.5
14	7	2014	74	Tom Thumb Food & Pharmacy	19	268.25
14	8	2014	30	SuperTarget	331	254.75
14	9	2014	21	Village Market Food Center	20	362.25
14	9	2014	92	Central Market	40	268.25
14	11	2014	5	Stop & Shop	54	268.25
14	11	2014	30	SuperTarget	305	254.75
14	12	2014	12	Scolari's Food and Drug	57	281.75
14	14	2014	30	SuperTarget	324	254.75
14	14	2014	74	Tom Thumb Food & Pharmacy	20	268.25
14	16	2014	5	Stop & Shop	46	268.25
14	17	2014	30	SuperTarget	381	254.75
14	17	2014	67	Crosby's Marketplace	71	268.25
14	18	2014	39	Fareway	144	268.25
14	20	2014	30	SuperTarget	331	254.75
14	21	2014	5	Stop & Shop	53	268.25
14	21	2014	74	Tom Thumb Food & Pharmacy	19	268.25
14	22	2014	20	Walmart	220	241.5
14	23	2014	30	SuperTarget	392	254.75
14	23	2014	75	Pick 'N Save	33	281.75
14	26	2014	5	Stop & Shop	57	268.25
14	26	2014	30	SuperTarget	340	254.75
14	27	2014	21	Village Market Food Center	22	362.25
14	27	2014	92	Central Market	39	268.25
14	28	2014	12	Scolari's Food and Drug	72	281.75
14	28	2014	67	Crosby's Marketplace	74	268.25
14	28	2014	74	Tom Thumb Food & Pharmacy	16	268.25
14	29	2014	30	SuperTarget	317	254.75
14	31	2014	5	Stop & Shop	48	268.25
14	32	2014	30	SuperTarget	330	254.75
14	32	2014	39	Fareway	148	268.25
14	35	2014	30	SuperTarget	351	254.75
14	35	2014	74	Tom Thumb Food & Pharmacy	15	268.25
14	36	2014	5	Stop & Shop	52	268.25
14	37	2014	20	Walmart	219	241.5
14	38	2014	30	SuperTarget	312	254.75
14	39	2014	67	Crosby's Marketplace	73	268.25
14	40	2014	75	Pick 'N Save	35	281.75
14	41	2014	5	Stop & Shop	46	268.25
14	41	2014	30	SuperTarget	282	254.75
14	42	2014	74	Tom Thumb Food & Pharmacy	15	268.25
14	44	2014	12	Scolari's Food and Drug	57	281.75
14	44	2014	30	SuperTarget	323	254.75
14	45	2014	21	Village Market Food Center	20	362.25
14	45	2014	92	Central Market	39	268.25
14	46	2014	5	Stop & Shop	41	268.25
14	46	2014	39	Fareway	129	268.25
14	47	2014	30	SuperTarget	285	254.75
14	49	2014	74	Tom Thumb Food & Pharmacy	18	268.25
14	50	2014	30	SuperTarget	324	254.75
14	50	2014	67	Crosby's Marketplace	78	268.25
14	51	2014	5	Stop & Shop	49	268.25
14	52	2014	20	Walmart	238	241.5
24222	2	2014	34	Mayfair Markets	8	83
24222	3	2014	14	FoodCity	12	75.75
24222	3	2014	43	United Grocery Outlet	9	90.25
24222	4	2014	72	Acme Fresh Market	10	72.25
24222	5	2014	34	Mayfair Markets	8	83
24222	5	2014	49	FoodMaxx	3	72.25
24222	7	2014	20	Walmart	45	65
24222	7	2014	40	Buehler's Buy-Low	7	72.25
24222	8	2014	34	Mayfair Markets	8	83
24222	9	2014	72	Acme Fresh Market	9	72.25
24222	10	2014	49	FoodMaxx	3	72.25
24222	10	2014	66	McCaffrey's	12	79.5
24222	11	2014	34	Mayfair Markets	7	83
24222	13	2014	14	FoodCity	13	75.75
24222	14	2014	34	Mayfair Markets	6	83
24222	14	2014	43	United Grocery Outlet	7	90.25
24222	14	2014	72	Acme Fresh Market	9	72.25
24222	15	2014	49	FoodMaxx	3	72.25
24222	17	2014	34	Mayfair Markets	6	83
24222	17	2014	40	Buehler's Buy-Low	7	72.25
24222	19	2014	72	Acme Fresh Market	8	72.25
24222	20	2014	34	Mayfair Markets	6	83
24222	20	2014	49	FoodMaxx	3	72.25
24222	22	2014	20	Walmart	52	65
24222	23	2014	14	FoodCity	13	75.75
24222	23	2014	34	Mayfair Markets	7	83
24222	24	2014	66	McCaffrey's	12	79.5
24222	24	2014	72	Acme Fresh Market	10	72.25
24222	25	2014	43	United Grocery Outlet	7	90.25
24222	25	2014	49	FoodMaxx	3	72.25
24222	26	2014	34	Mayfair Markets	6	83
24222	27	2014	40	Buehler's Buy-Low	7	72.25
24222	29	2014	34	Mayfair Markets	6	83
24222	29	2014	72	Acme Fresh Market	9	72.25
24222	30	2014	49	FoodMaxx	4	72.25
24222	32	2014	34	Mayfair Markets	7	83
24222	33	2014	14	FoodCity	13	75.75
24222	34	2014	72	Acme Fresh Market	9	72.25
24222	35	2014	34	Mayfair Markets	6	83
24222	35	2014	49	FoodMaxx	4	72.25
24222	36	2014	43	United Grocery Outlet	7	90.25
24222	37	2014	20	Walmart	49	65
24222	37	2014	40	Buehler's Buy-Low	7	72.25
24222	38	2014	34	Mayfair Markets	7	83
24222	38	2014	66	McCaffrey's	10	79.5
24222	39	2014	72	Acme Fresh Market	9	72.25
24222	40	2014	49	FoodMaxx	3	72.25
24222	41	2014	34	Mayfair Markets	7	83
24222	43	2014	14	FoodCity	13	75.75
24222	44	2014	34	Mayfair Markets	6	83
24222	44	2014	72	Acme Fresh Market	9	72.25
24222	45	2014	49	FoodMaxx	3	72.25
24222	47	2014	34	Mayfair Markets	7	83
24222	47	2014	40	Buehler's Buy-Low	7	72.25
24222	47	2014	43	United Grocery Outlet	8	90.25
24222	49	2014	72	Acme Fresh Market	8	72.25
24222	50	2014	34	Mayfair Markets	7	83
24222	50	2014	49	FoodMaxx	3	72.25
24222	52	2014	20	Walmart	52	65
24222	52	2014	66	McCaffrey's	11	79.5
14	1	2013	5	Stop & Shop	48	268.25
14	2	2013	30	SuperTarget	291	254.75
14	4	2013	39	Fareway	142	268.25
14	5	2013	30	SuperTarget	310	254.75
14	6	2013	5	Stop & Shop	52	268.25
14	6	2013	67	Crosby's Marketplace	83	268.25
14	6	2013	75	Pick 'N Save	40	281.75
14	7	2013	20	Walmart	207	241.5
14	7	2013	74	Tom Thumb Food & Pharmacy	20	268.25
14	8	2013	30	SuperTarget	353	254.75
14	9	2013	21	Village Market Food Center	18	362.25
14	9	2013	92	Central Market	42	268.25
14	11	2013	5	Stop & Shop	51	268.25
14	11	2013	30	SuperTarget	372	254.75
14	12	2013	12	Scolari's Food and Drug	60	281.75
14	14	2013	30	SuperTarget	381	254.75
14	14	2013	74	Tom Thumb Food & Pharmacy	17	268.25
14	16	2013	5	Stop & Shop	53	268.25
14	17	2013	30	SuperTarget	322	254.75
14	17	2013	67	Crosby's Marketplace	66	268.25
14	18	2013	39	Fareway	139	268.25
14	20	2013	30	SuperTarget	329	254.75
14	21	2013	5	Stop & Shop	53	268.25
14	21	2013	74	Tom Thumb Food & Pharmacy	16	268.25
14	22	2013	20	Walmart	242	241.5
14	23	2013	30	SuperTarget	331	254.75
14	23	2013	75	Pick 'N Save	32	281.75
14	26	2013	5	Stop & Shop	58	268.25
14	26	2013	30	SuperTarget	389	254.75
14	27	2013	21	Village Market Food Center	20	362.25
14	27	2013	92	Central Market	40	268.25
14	28	2013	12	Scolari's Food and Drug	71	281.75
14	28	2013	67	Crosby's Marketplace	79	268.25
14	28	2013	74	Tom Thumb Food & Pharmacy	15	268.25
14	29	2013	30	SuperTarget	329	254.75
14	31	2013	5	Stop & Shop	50	268.25
14	32	2013	30	SuperTarget	348	254.75
14	32	2013	39	Fareway	147	268.25
14	35	2013	30	SuperTarget	322	254.75
14	35	2013	74	Tom Thumb Food & Pharmacy	16	268.25
14	36	2013	5	Stop & Shop	50	268.25
14	37	2013	20	Walmart	241	241.5
14	38	2013	30	SuperTarget	332	254.75
14	39	2013	67	Crosby's Marketplace	72	268.25
14	40	2013	75	Pick 'N Save	35	281.75
14	41	2013	5	Stop & Shop	43	268.25
14	41	2013	30	SuperTarget	294	254.75
14	42	2013	74	Tom Thumb Food & Pharmacy	17	268.25
14	44	2013	12	Scolari's Food and Drug	60	281.75
14	44	2013	30	SuperTarget	334	254.75
14	45	2013	21	Village Market Food Center	18	362.25
14	45	2013	92	Central Market	48	268.25
14	46	2013	5	Stop & Shop	49	268.25
14	46	2013	39	Fareway	132	268.25
14	47	2013	30	SuperTarget	298	254.75
14	49	2013	74	Tom Thumb Food & Pharmacy	18	268.25
14	50	2013	30	SuperTarget	330	254.75
14	50	2013	67	Crosby's Marketplace	95	268.25
14	51	2013	5	Stop & Shop	44	268.25
14	52	2013	20	Walmart	231	241.5
24222	2	2013	34	Mayfair Markets	8	83
24222	3	2013	14	FoodCity	12	75.75
24222	3	2013	43	United Grocery Outlet	8	90.25
24222	4	2013	72	Acme Fresh Market	8	72.25
24222	5	2013	34	Mayfair Markets	8	83
24222	5	2013	49	FoodMaxx	4	72.25
24222	7	2013	20	Walmart	45	65
24222	7	2013	40	Buehler's Buy-Low	8	72.25
24222	8	2013	34	Mayfair Markets	7	83
24222	9	2013	72	Acme Fresh Market	9	72.25
24222	10	2013	49	FoodMaxx	3	72.25
24222	10	2013	66	McCaffrey's	12	79.5
24222	11	2013	34	Mayfair Markets	8	83
24222	13	2013	14	FoodCity	13	75.75
24222	14	2013	34	Mayfair Markets	7	83
24222	14	2013	43	United Grocery Outlet	6	90.25
24222	14	2013	72	Acme Fresh Market	9	72.25
24222	15	2013	49	FoodMaxx	3	72.25
24222	17	2013	34	Mayfair Markets	7	83
24222	17	2013	40	Buehler's Buy-Low	6	72.25
24222	19	2013	72	Acme Fresh Market	10	72.25
24222	20	2013	34	Mayfair Markets	6	83
24222	20	2013	49	FoodMaxx	4	72.25
24222	22	2013	20	Walmart	49	65
24222	23	2013	14	FoodCity	12	75.75
24222	23	2013	34	Mayfair Markets	7	83
24222	24	2013	66	McCaffrey's	10	79.5
24222	24	2013	72	Acme Fresh Market	10	72.25
24222	25	2013	43	United Grocery Outlet	6	90.25
24222	25	2013	49	FoodMaxx	3	72.25
24222	26	2013	34	Mayfair Markets	7	83
24222	27	2013	40	Buehler's Buy-Low	7	72.25
24222	29	2013	34	Mayfair Markets	7	83
24222	29	2013	72	Acme Fresh Market	10	72.25
24222	30	2013	49	FoodMaxx	3	72.25
24222	32	2013	34	Mayfair Markets	7	83
24222	33	2013	14	FoodCity	12	75.75
24222	34	2013	72	Acme Fresh Market	10	72.25
24222	35	2013	34	Mayfair Markets	7	83
24222	35	2013	49	FoodMaxx	3	72.25
24222	36	2013	43	United Grocery Outlet	7	90.25
24222	37	2013	20	Walmart	44	65
24222	37	2013	40	Buehler's Buy-Low	7	72.25
24222	38	2013	34	Mayfair Markets	7	83
24222	38	2013	66	McCaffrey's	12	79.5
24222	39	2013	72	Acme Fresh Market	10	72.25
24222	40	2013	49	FoodMaxx	3	72.25
24222	41	2013	34	Mayfair Markets	8	83
24222	43	2013	14	FoodCity	13	75.75
24222	44	2013	34	Mayfair Markets	8	83
24222	44	2013	72	Acme Fresh Market	9	72.25
24222	45	2013	49	FoodMaxx	4	72.25
24222	47	2013	34	Mayfair Markets	6	83
24222	47	2013	40	Buehler's Buy-Low	6	72.25
24222	47	2013	43	United Grocery Outlet	8	90.25
24222	49	2013	72	Acme Fresh Market	10	72.25
24222	50	2013	34	Mayfair Markets	8	83
24222	50	2013	49	FoodMaxx	3	72.25
24222	52	2013	20	Walmart	51	65
24222	52	2013	66	McCaffrey's	12	79.5
14	1	2012	5	Stop & Shop	50	268.25
14	2	2012	30	SuperTarget	302	254.75
14	4	2012	39	Fareway	132	268.25
14	5	2012	30	SuperTarget	326	254.75
14	6	2012	5	Stop & Shop	51	268.25
14	6	2012	67	Crosby's Marketplace	83	268.25
14	6	2012	75	Pick 'N Save	34	281.75
14	7	2012	20	Walmart	232	241.5
14	7	2012	74	Tom Thumb Food & Pharmacy	20	268.25
14	8	2012	30	SuperTarget	299	254.75
14	9	2012	21	Village Market Food Center	21	362.25
14	9	2012	92	Central Market	43	268.25
14	11	2012	5	Stop & Shop	53	268.25
14	11	2012	30	SuperTarget	359	254.75
14	12	2012	12	Scolari's Food and Drug	61	281.75
14	14	2012	30	SuperTarget	321	254.75
14	14	2012	74	Tom Thumb Food & Pharmacy	16	268.25
14	16	2012	5	Stop & Shop	57	268.25
14	17	2012	30	SuperTarget	383	254.75
14	17	2012	67	Crosby's Marketplace	78	268.25
14	18	2012	39	Fareway	160	268.25
14	20	2012	30	SuperTarget	363	254.75
14	21	2012	5	Stop & Shop	47	268.25
14	21	2012	74	Tom Thumb Food & Pharmacy	15	268.25
14	22	2012	20	Walmart	242	241.5
14	23	2012	30	SuperTarget	345	254.75
14	23	2012	75	Pick 'N Save	38	281.75
14	26	2012	5	Stop & Shop	56	268.25
14	26	2012	30	SuperTarget	322	254.75
14	27	2012	21	Village Market Food Center	19	362.25
14	27	2012	92	Central Market	41	268.25
14	28	2012	12	Scolari's Food and Drug	60	281.75
14	28	2012	67	Crosby's Marketplace	69	268.25
14	28	2012	74	Tom Thumb Food & Pharmacy	17	268.25
14	29	2012	30	SuperTarget	372	254.75
14	31	2012	5	Stop & Shop	48	268.25
14	32	2012	30	SuperTarget	329	254.75
14	32	2012	39	Fareway	138	268.25
14	35	2012	30	SuperTarget	361	254.75
14	35	2012	74	Tom Thumb Food & Pharmacy	17	268.25
14	36	2012	5	Stop & Shop	50	268.25
14	37	2012	20	Walmart	251	241.5
14	38	2012	30	SuperTarget	350	254.75
14	39	2012	67	Crosby's Marketplace	85	268.25
14	40	2012	75	Pick 'N Save	38	281.75
14	41	2012	5	Stop & Shop	50	268.25
14	41	2012	30	SuperTarget	280	254.75
14	42	2012	74	Tom Thumb Food & Pharmacy	16	268.25
14	44	2012	12	Scolari's Food and Drug	65	281.75
14	44	2012	30	SuperTarget	284	254.75
14	45	2012	21	Village Market Food Center	20	362.25
14	45	2012	92	Central Market	44	268.25
14	46	2012	5	Stop & Shop	45	268.25
14	46	2012	39	Fareway	144	268.25
14	47	2012	30	SuperTarget	297	254.75
14	49	2012	74	Tom Thumb Food & Pharmacy	17	268.25
14	50	2012	30	SuperTarget	317	254.75
14	50	2012	67	Crosby's Marketplace	76	268.25
14	51	2012	5	Stop & Shop	41	268.25
14	52	2012	20	Walmart	223	241.5
24222	2	2012	34	Mayfair Markets	8	83
24222	3	2012	14	FoodCity	12	75.75
24222	3	2012	43	United Grocery Outlet	8	90.25
24222	4	2012	72	Acme Fresh Market	9	72.25
24222	5	2012	34	Mayfair Markets	7	83
24222	5	2012	49	FoodMaxx	3	72.25
24222	7	2012	20	Walmart	52	65
24222	7	2012	40	Buehler's Buy-Low	6	72.25
24222	8	2012	34	Mayfair Markets	8	83
24222	9	2012	72	Acme Fresh Market	9	72.25
24222	10	2012	49	FoodMaxx	3	72.25
24222	10	2012	66	McCaffrey's	10	79.5
24222	11	2012	34	Mayfair Markets	7	83
24222	13	2012	14	FoodCity	11	75.75
24222	14	2012	34	Mayfair Markets	8	83
24222	14	2012	43	United Grocery Outlet	8	90.25
24222	14	2012	72	Acme Fresh Market	8	72.25
24222	15	2012	49	FoodMaxx	3	72.25
24222	17	2012	34	Mayfair Markets	7	83
24222	17	2012	40	Buehler's Buy-Low	7	72.25
24222	19	2012	72	Acme Fresh Market	10	72.25
24222	20	2012	34	Mayfair Markets	6	83
24222	20	2012	49	FoodMaxx	3	72.25
24222	22	2012	20	Walmart	46	65
24222	23	2012	14	FoodCity	13	75.75
24222	23	2012	34	Mayfair Markets	6	83
24222	24	2012	66	McCaffrey's	11	79.5
24222	24	2012	72	Acme Fresh Market	8	72.25
24222	25	2012	43	United Grocery Outlet	7	90.25
24222	25	2012	49	FoodMaxx	3	72.25
24222	26	2012	34	Mayfair Markets	7	83
24222	27	2012	40	Buehler's Buy-Low	6	72.25
24222	29	2012	34	Mayfair Markets	6	83
24222	29	2012	72	Acme Fresh Market	10	72.25
24222	30	2012	49	FoodMaxx	4	72.25
24222	32	2012	34	Mayfair Markets	7	83
24222	33	2012	14	FoodCity	12	75.75
24222	34	2012	72	Acme Fresh Market	9	72.25
24222	35	2012	34	Mayfair Markets	7	83
24222	35	2012	49	FoodMaxx	4	72.25
24222	36	2012	43	United Grocery Outlet	7	90.25
24222	37	2012	20	Walmart	51	65
24222	37	2012	40	Buehler's Buy-Low	7	72.25
24222	38	2012	34	Mayfair Markets	8	83
24222	38	2012	66	McCaffrey's	12	79.5
24222	39	2012	72	Acme Fresh Market	9	72.25
24222	40	2012	49	FoodMaxx	3	72.25
24222	41	2012	34	Mayfair Markets	7	83
24222	43	2012	14	FoodCity	11	75.75
24222	44	2012	34	Mayfair Markets	6	83
24222	44	2012	72	Acme Fresh Market	8	72.25
24222	45	2012	49	FoodMaxx	3	72.25
24222	47	2012	34	Mayfair Markets	7	83
24222	47	2012	40	Buehler's Buy-Low	6	72.25
24222	47	2012	43	United Grocery Outlet	8	90.25
24222	49	2012	72	Acme Fresh Market	9	72.25
24222	50	2012	34	Mayfair Markets	8	83
24222	50	2012	49	FoodMaxx	3	72.25
24222	52	2012	20	Walmart	48	65
24222	52	2012	66	McCaffrey's	13	79.5
14	1	2011	5	Stop & Shop	50	268.25
14	2	2011	30	SuperTarget	320	254.75
14	4	2011	39	Fareway	145	268.25
14	5	2011	30	SuperTarget	331	254.75
14	6	2011	5	Stop & Shop	45	268.25
14	6	2011	67	Crosby's Marketplace	77	268.25
14	6	2011	75	Pick 'N Save	38	281.75
14	7	2011	20	Walmart	227	241.5
14	7	2011	74	Tom Thumb Food & Pharmacy	17	268.25
14	8	2011	30	SuperTarget	321	254.75
14	9	2011	21	Village Market Food Center	20	362.25
14	9	2011	92	Central Market	40	268.25
14	11	2011	5	Stop & Shop	52	268.25
14	11	2011	30	SuperTarget	315	254.75
14	12	2011	12	Scolari's Food and Drug	56	281.75
14	14	2011	30	SuperTarget	366	254.75
14	14	2011	74	Tom Thumb Food & Pharmacy	16	268.25
14	16	2011	5	Stop & Shop	49	268.25
14	17	2011	30	SuperTarget	341	254.75
14	17	2011	67	Crosby's Marketplace	72	268.25
14	18	2011	39	Fareway	145	268.25
14	20	2011	30	SuperTarget	372	254.75
14	21	2011	5	Stop & Shop	55	268.25
14	21	2011	74	Tom Thumb Food & Pharmacy	16	268.25
14	22	2011	20	Walmart	218	241.5
14	23	2011	30	SuperTarget	365	254.75
14	23	2011	75	Pick 'N Save	35	281.75
14	26	2011	5	Stop & Shop	53	268.25
14	26	2011	30	SuperTarget	380	254.75
14	27	2011	21	Village Market Food Center	21	362.25
14	27	2011	92	Central Market	42	268.25
14	28	2011	12	Scolari's Food and Drug	59	281.75
14	28	2011	67	Crosby's Marketplace	75	268.25
14	28	2011	74	Tom Thumb Food & Pharmacy	15	268.25
14	29	2011	30	SuperTarget	344	254.75
14	31	2011	5	Stop & Shop	55	268.25
14	32	2011	30	SuperTarget	323	254.75
14	32	2011	39	Fareway	123	268.25
14	35	2011	30	SuperTarget	345	254.75
14	35	2011	74	Tom Thumb Food & Pharmacy	14	268.25
14	36	2011	5	Stop & Shop	48	268.25
14	37	2011	20	Walmart	255	241.5
14	38	2011	30	SuperTarget	306	254.75
14	39	2011	67	Crosby's Marketplace	79	268.25
14	40	2011	75	Pick 'N Save	36	281.75
14	41	2011	5	Stop & Shop	50	268.25
14	41	2011	30	SuperTarget	308	254.75
14	42	2011	74	Tom Thumb Food & Pharmacy	16	268.25
14	44	2011	12	Scolari's Food and Drug	57	281.75
14	44	2011	30	SuperTarget	322	254.75
14	45	2011	21	Village Market Food Center	20	362.25
14	45	2011	92	Central Market	49	268.25
14	46	2011	5	Stop & Shop	48	268.25
14	46	2011	39	Fareway	132	268.25
14	47	2011	30	SuperTarget	335	254.75
14	49	2011	74	Tom Thumb Food & Pharmacy	16	268.25
14	50	2011	30	SuperTarget	280	254.75
14	50	2011	67	Crosby's Marketplace	86	268.25
14	51	2011	5	Stop & Shop	43	268.25
14	52	2011	20	Walmart	212	241.5
24222	2	2011	34	Mayfair Markets	7	83
24222	3	2011	14	FoodCity	13	75.75
24222	3	2011	43	United Grocery Outlet	8	90.25
24222	4	2011	72	Acme Fresh Market	9	72.25
24222	5	2011	34	Mayfair Markets	7	83
24222	5	2011	49	FoodMaxx	3	72.25
24222	7	2011	20	Walmart	50	65
24222	7	2011	40	Buehler's Buy-Low	6	72.25
24222	8	2011	34	Mayfair Markets	7	83
24222	9	2011	72	Acme Fresh Market	8	72.25
24222	10	2011	49	FoodMaxx	3	72.25
24222	10	2011	66	McCaffrey's	12	79.5
24222	11	2011	34	Mayfair Markets	7	83
24222	13	2011	14	FoodCity	12	75.75
24222	14	2011	34	Mayfair Markets	7	83
24222	14	2011	43	United Grocery Outlet	7	90.25
24222	14	2011	72	Acme Fresh Market	9	72.25
24222	15	2011	49	FoodMaxx	4	72.25
24222	17	2011	34	Mayfair Markets	7	83
24222	17	2011	40	Buehler's Buy-Low	8	72.25
24222	19	2011	72	Acme Fresh Market	9	72.25
24222	20	2011	34	Mayfair Markets	7	83
24222	20	2011	49	FoodMaxx	4	72.25
24222	22	2011	20	Walmart	54	65
24222	23	2011	14	FoodCity	11	75.75
24222	23	2011	34	Mayfair Markets	7	83
24222	24	2011	66	McCaffrey's	12	79.5
24222	24	2011	72	Acme Fresh Market	9	72.25
24222	25	2011	43	United Grocery Outlet	6	90.25
24222	25	2011	49	FoodMaxx	3	72.25
24222	26	2011	34	Mayfair Markets	7	83
24222	27	2011	40	Buehler's Buy-Low	7	72.25
24222	29	2011	34	Mayfair Markets	7	83
24222	29	2011	72	Acme Fresh Market	9	72.25
24222	30	2011	49	FoodMaxx	3	72.25
24222	32	2011	34	Mayfair Markets	6	83
24222	33	2011	14	FoodCity	13	75.75
24222	34	2011	72	Acme Fresh Market	10	72.25
24222	35	2011	34	Mayfair Markets	8	83
24222	35	2011	49	FoodMaxx	4	72.25
24222	36	2011	43	United Grocery Outlet	7	90.25
24222	37	2011	20	Walmart	46	65
24222	37	2011	40	Buehler's Buy-Low	7	72.25
24222	38	2011	34	Mayfair Markets	7	83
24222	38	2011	66	McCaffrey's	12	79.5
24222	39	2011	72	Acme Fresh Market	8	72.25
24222	40	2011	49	FoodMaxx	4	72.25
24222	41	2011	34	Mayfair Markets	8	83
24222	43	2011	14	FoodCity	13	75.75
24222	44	2011	34	Mayfair Markets	7	83
24222	44	2011	72	Acme Fresh Market	10	72.25
24222	45	2011	49	FoodMaxx	3	72.25
24222	47	2011	34	Mayfair Markets	7	83
24222	47	2011	40	Buehler's Buy-Low	7	72.25
24222	47	2011	43	United Grocery Outlet	9	90.25
24222	49	2011	72	Acme Fresh Market	9	72.25
24222	50	2011	34	Mayfair Markets	8	83
24222	50	2011	49	FoodMaxx	4	72.25
24222	52	2011	20	Walmart	47	65
24222	52	2011	66	McCaffrey's	12	79.5
14	1	2010	5	Stop & Shop	45	268.25
14	2	2010	30	SuperTarget	282	254.75
14	4	2010	39	Fareway	149	268.25
14	5	2010	30	SuperTarget	350	254.75
14	6	2010	5	Stop & Shop	50	268.25
14	6	2010	67	Crosby's Marketplace	76	268.25
14	6	2010	75	Pick 'N Save	42	281.75
14	7	2010	20	Walmart	235	241.5
14	7	2010	74	Tom Thumb Food & Pharmacy	19	268.25
14	8	2010	30	SuperTarget	332	254.75
14	9	2010	21	Village Market Food Center	21	362.25
14	9	2010	92	Central Market	42	268.25
14	11	2010	5	Stop & Shop	46	268.25
14	11	2010	30	SuperTarget	312	254.75
14	12	2010	12	Scolari's Food and Drug	59	281.75
14	14	2010	30	SuperTarget	323	254.75
14	14	2010	74	Tom Thumb Food & Pharmacy	16	268.25
14	16	2010	5	Stop & Shop	48	268.25
14	17	2010	30	SuperTarget	314	254.75
14	17	2010	67	Crosby's Marketplace	75	268.25
14	18	2010	39	Fareway	150	268.25
14	20	2010	30	SuperTarget	329	254.75
14	21	2010	5	Stop & Shop	55	268.25
14	21	2010	74	Tom Thumb Food & Pharmacy	16	268.25
14	22	2010	20	Walmart	216	241.5
14	23	2010	30	SuperTarget	351	254.75
14	23	2010	75	Pick 'N Save	35	281.75
14	26	2010	5	Stop & Shop	48	268.25
14	26	2010	30	SuperTarget	340	254.75
14	27	2010	21	Village Market Food Center	22	362.25
14	27	2010	92	Central Market	37	268.25
14	28	2010	12	Scolari's Food and Drug	59	281.75
14	28	2010	67	Crosby's Marketplace	73	268.25
14	28	2010	74	Tom Thumb Food & Pharmacy	14	268.25
14	29	2010	30	SuperTarget	331	254.75
14	31	2010	5	Stop & Shop	51	268.25
14	32	2010	30	SuperTarget	315	254.75
14	32	2010	39	Fareway	133	268.25
14	35	2010	30	SuperTarget	319	254.75
14	35	2010	74	Tom Thumb Food & Pharmacy	17	268.25
14	36	2010	5	Stop & Shop	54	268.25
14	37	2010	20	Walmart	217	241.5
14	38	2010	30	SuperTarget	313	254.75
14	39	2010	67	Crosby's Marketplace	76	268.25
14	40	2010	75	Pick 'N Save	38	281.75
14	41	2010	5	Stop & Shop	46	268.25
14	41	2010	30	SuperTarget	320	254.75
14	42	2010	74	Tom Thumb Food & Pharmacy	16	268.25
14	44	2010	12	Scolari's Food and Drug	55	281.75
14	44	2010	30	SuperTarget	325	254.75
14	45	2010	21	Village Market Food Center	17	362.25
14	45	2010	92	Central Market	47	268.25
14	46	2010	5	Stop & Shop	43	268.25
14	46	2010	39	Fareway	129	268.25
14	47	2010	30	SuperTarget	337	254.75
14	49	2010	74	Tom Thumb Food & Pharmacy	18	268.25
14	50	2010	30	SuperTarget	299	254.75
14	50	2010	67	Crosby's Marketplace	79	268.25
14	51	2010	5	Stop & Shop	46	268.25
14	52	2010	20	Walmart	216	241.5
24222	2	2010	34	Mayfair Markets	9	83
24222	3	2010	14	FoodCity	13	75.75
24222	3	2010	43	United Grocery Outlet	8	90.25
24222	4	2010	72	Acme Fresh Market	9	72.25
24222	5	2010	34	Mayfair Markets	7	83
24222	5	2010	49	FoodMaxx	3	72.25
24222	7	2010	20	Walmart	52	65
24222	7	2010	40	Buehler's Buy-Low	7	72.25
24222	8	2010	34	Mayfair Markets	7	83
24222	9	2010	72	Acme Fresh Market	9	72.25
24222	10	2010	49	FoodMaxx	4	72.25
24222	10	2010	66	McCaffrey's	11	79.5
24222	11	2010	34	Mayfair Markets	7	83
24222	13	2010	14	FoodCity	13	75.75
24222	14	2010	34	Mayfair Markets	7	83
24222	14	2010	43	United Grocery Outlet	6	90.25
24222	14	2010	72	Acme Fresh Market	9	72.25
24222	15	2010	49	FoodMaxx	3	72.25
24222	17	2010	34	Mayfair Markets	7	83
24222	17	2010	40	Buehler's Buy-Low	6	72.25
24222	19	2010	72	Acme Fresh Market	9	72.25
24222	20	2010	34	Mayfair Markets	7	83
24222	20	2010	49	FoodMaxx	4	72.25
24222	22	2010	20	Walmart	50	65
24222	23	2010	14	FoodCity	11	75.75
24222	23	2010	34	Mayfair Markets	7	83
24222	24	2010	66	McCaffrey's	13	79.5
24222	24	2010	72	Acme Fresh Market	10	72.25
24222	25	2010	43	United Grocery Outlet	7	90.25
24222	25	2010	49	FoodMaxx	4	72.25
24222	26	2010	34	Mayfair Markets	6	83
24222	27	2010	40	Buehler's Buy-Low	7	72.25
24222	29	2010	34	Mayfair Markets	7	83
24222	29	2010	72	Acme Fresh Market	8	72.25
24222	30	2010	49	FoodMaxx	4	72.25
24222	32	2010	34	Mayfair Markets	7	83
24222	33	2010	14	FoodCity	11	75.75
24222	34	2010	72	Acme Fresh Market	11	72.25
24222	35	2010	34	Mayfair Markets	7	83
24222	35	2010	49	FoodMaxx	4	72.25
24222	36	2010	43	United Grocery Outlet	8	90.25
24222	37	2010	20	Walmart	47	65
24222	37	2010	40	Buehler's Buy-Low	6	72.25
24222	38	2010	34	Mayfair Markets	7	83
24222	38	2010	66	McCaffrey's	10	79.5
24222	39	2010	72	Acme Fresh Market	8	72.25
24222	40	2010	49	FoodMaxx	4	72.25
24222	41	2010	34	Mayfair Markets	7	83
24222	43	2010	14	FoodCity	11	75.75
24222	44	2010	34	Mayfair Markets	8	83
24222	44	2010	72	Acme Fresh Market	9	72.25
24222	45	2010	49	FoodMaxx	3	72.25
24222	47	2010	34	Mayfair Markets	8	83
24222	47	2010	40	Buehler's Buy-Low	7	72.25
24222	47	2010	43	United Grocery Outlet	7	90.25
24222	49	2010	72	Acme Fresh Market	9	72.25
24222	50	2010	34	Mayfair Markets	8	83
24222	50	2010	49	FoodMaxx	3	72.25
24222	52	2010	20	Walmart	47	65
24222	52	2010	66	McCaffrey's	11	79.5
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
w7oWluU3fSgmU3kzdZEq68KuYVcnnp87	{"cookie":{"originalMaxAge":86400000,"expires":"2019-04-17T04:19:33.317Z","secure":"true","httpOnly":true,"path":"/"},"user":"admin","admin":true,"user_id":7,"core_read":true,"core_write":true,"sales_read":true,"sales_write":true,"goals_read":true,"goals_write":true,"schedule_read":true,"schedule_write":[],"user_read":true,"user_write":true}	2019-04-17 17:03:53
CaZtj3czhR3K6ALZ4uK_Nij6S-6tSqY0	{"cookie":{"originalMaxAge":86400000,"expires":"2019-04-17T22:28:34.140Z","secure":"true","httpOnly":true,"path":"/"},"user":"netid_rsh25","admin":false,"user_id":22,"core_read":true,"core_write":false,"sales_read":true,"sales_write":false,"goals_read":true,"goals_write":false,"schedule_read":true,"schedule_write":[1234,1235,1236],"user_read":false,"user_write":false}	2019-04-17 18:28:46
Q6ge2HpPrT2fSwVz-_ECDcS03IK8WN_w	{"cookie":{"originalMaxAge":86400000,"expires":"2019-04-16T22:35:01.785Z","secure":"true","httpOnly":true,"path":"/"},"user":"admin","admin":true,"user_id":7,"core_read":true,"core_write":true,"sales_read":true,"sales_write":true,"goals_read":true,"goals_write":true,"schedule_read":true,"schedule_write":[],"user_read":true,"user_write":true}	2019-04-17 17:04:58
M9K7ZEE9puOyK_CZtlIC4Nvuq4MqlE55	{"cookie":{"originalMaxAge":86400000,"expires":"2019-04-17T21:50:14.763Z","secure":"true","httpOnly":true,"path":"/"},"user":"admin","admin":true,"user_id":7,"core_read":true,"core_write":true,"sales_read":true,"sales_write":true,"goals_read":true,"goals_write":true,"schedule_read":true,"schedule_write":[],"user_read":true,"user_write":true}	2019-04-17 17:51:17
\.


--
-- Data for Name: sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku (name, num, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments, id, formula_id, formula_scale, man_rate, man_setup_cost, man_run_cost) FROM stdin;
sku13462	14	3549	65653	12 lbs	998	prod4	\N	20	5	2.4	1.0	1.0	1.0
potatoes	24222	123456788101	123456788101	533	2	prod4	comemtns 	37	5	53	2.1	1.0	1.0
\.


--
-- Data for Name: sku_ingred; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku_ingred (sku_num, ingred_num, quantity) FROM stdin;
14	1414	5
14	1415	4
14	11	13
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (uname, id, password, admin, analyst, prod_mgr, bus_mgr) FROM stdin;
admin	7	$2b$10$6OEuptPXlXXHNCGK22Y2huBOaWixkxXaZgLlKfdEz0K2bUcwoCXGu	t	t	t	t
normal	26	$2b$10$hcsrQ7YkJwkWMuUudCMODud5ncSxxyp3fwWRd4.1jIjzyVKSn.a7a	f	f	f	f
gordon	25	$2b$10$N2ASjozU4szStQXpkCmHZuGV649TPFjYe7rYpjGIAFUZiQ7FSa3mS	f	t	f	f
business_manager	29	$2b$10$BW4USztG/iGZSEaX6X.4tuUFO47/ny.ocPezaSwt2p0lXJVCyJqti	f	f	f	t
analyst	27	$2b$10$YH0Fh6JOIcIRr72ed1iBhe352EafL.qmJxxXECv7Xt5/YtagtaMvq	f	t	f	f
product_manager	28	$2b$10$ynAKASW1SeZo8DS5EIseS.OFKdotC5bAPrt9vSDuiny0AdJWH3JX.	f	f	t	f
netid_rsh25	22	$2b$10$.H6ME0U1xO4dx29yXwkB1uIaJOMf0jdWXFqJU5LefdgOdCaMdScSu	f	f	f	f
bill	30	$2b$10$A.A2xRKTKAr8qkCf1ZsQX.rVCNZrixUR/OZ5/MUYbLSxyj6TCBMpe	f	t	f	f
user	23	$2b$10$JRhopjswENNwVZZWFg1nru2L/tW81a15xQ.6ogIM9W3guEQXLCC6O	f	f	f	f
hello	8	dd	f	f	f	f
siddarth	9	$2b$10$Pwp3lW15hTFzklMarcAqTuxpe3yHvlXRRKf.xSeuyxzXXTXBU5jlG	f	f	f	f
faa	10	$2b$10$6OEuptPXlXXHNCGK22Y2huBOaWixkxXaZgLlKfdEz0K2bUcwoCXGu	f	f	f	f
user1	19	$2b$10$6N4S24FvrkYMuV5uOr9Ip.I0voths0ukjYN6/JOfg.1xasolLNUJq	f	f	f	f
test	20	$2b$10$5f.J.wTCm.GmYMu4srL79eWVzlcrAR.jEj3R0wMJjA2utltl5fAxG	t	f	f	f
netid_ghh6	17	$2b$10$cAvdQ0XxPoI3a/wxu3p4j.6vpWYpsAa1rST.Wm/wNydAmZoKSmz2.	t	f	f	f
Yami	12	$2b$10$RFPqDSB88HRdOFvjnr/.Z.eSpwdobjVsY6YswCOcWHlJMA3d6keAO	f	f	f	f
Zion	13	$2b$10$WkOtBpwBtOMizbrPDRQgxOL1ceOHlbgJegw2CV1P78YIUhU.tjFvS	f	f	f	f
Santa	14	$2b$10$1SSj7lT9GhZUVdq9l057/e3XDm1VHs6TeqP7CBfiqAOROhwbdvYxm	f	f	f	f
Ulqiorra	15	$2b$10$HsFnr6AkgDdhIxW6DZKrRepMI9iGhslMxI9OVXIkHz3EbANFi4pne	f	f	f	f
Robert	16	$2b$10$Jn3i/RDS2pmo4nTdQ4Fvl.PCaGbSq2I8gWf8ErAIciGpMdMWUeXS2	f	f	f	f
netid_sk437	21	$2b$10$Cc6F9ucB7SQVi2Oyxl1sp.hiCZPYRzU5IfZmI7Qm1UOKmtrby6qIG	f	f	f	f
gordon5	6	$2b$10$ytdca/.u5rsOkGOFPAEegun5YzC683AK2i/O54fjbNuaaACGGN2sO	f	f	f	f
111	11	$2b$10$kfhhkL/TzLTqG0TnNwWnbehVuNE1LphKsDkGouf.3lVHs3r3xnpuG	f	f	f	f
\.


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 416, true);


--
-- Name: formula_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formula_id_seq', 30, true);


--
-- Name: formula_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formula_num_seq', 4, true);


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 55, true);


--
-- Name: ingredients_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_num_seq', 36, true);


--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_id_seq', 16, true);


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
-- Name: manufacturing_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_line_id_seq', 10, true);


--
-- Name: productline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productline_id_seq', 7, true);


--
-- Name: sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_id_seq', 44, true);


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
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 30, true);


--
-- Name: customers customers_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_name_key UNIQUE (name);


--
-- Name: customers customers_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_num_key UNIQUE (num);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


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
-- Name: manufacturing_line manufacturing_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line
    ADD CONSTRAINT manufacturing_line_pkey PRIMARY KEY (id);


--
-- Name: manufacturing_line manufacturing_line_shortname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line
    ADD CONSTRAINT manufacturing_line_shortname_key UNIQUE (shortname);


--
-- Name: manufacturing_line_sku manufacturing_line_sku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line_sku
    ADD CONSTRAINT manufacturing_line_sku_pkey PRIMARY KEY (sku_id, manufacturing_line_id);


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
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sku_num, week, year, customer_num);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


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
-- Name: fki_plant_mgr_manline_id_fkey; Type: INDEX; Schema: public; Owner: vcm
--

CREATE INDEX fki_plant_mgr_manline_id_fkey ON public.plant_mgr USING btree (manline_id);


--
-- Name: fki_plant_mgr_user_id_fkey; Type: INDEX; Schema: public; Owner: vcm
--

CREATE INDEX fki_plant_mgr_user_id_fkey ON public.plant_mgr USING btree (user_id);


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
-- Name: manufacturing_goal_sku manufacturing_goal_sku_man_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_man_line_id_fkey FOREIGN KEY (man_line_id) REFERENCES public.manufacturing_line(id);


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
-- Name: manufacturing_line_sku manufacturing_line_sku_manufacturing_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line_sku
    ADD CONSTRAINT manufacturing_line_sku_manufacturing_line_id_fkey FOREIGN KEY (manufacturing_line_id) REFERENCES public.manufacturing_line(id);


--
-- Name: manufacturing_line_sku manufacturing_line_sku_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line_sku
    ADD CONSTRAINT manufacturing_line_sku_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.sku(id) ON DELETE CASCADE;


--
-- Name: plant_mgr plant_mgr_manline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vcm
--

ALTER TABLE ONLY public.plant_mgr
    ADD CONSTRAINT plant_mgr_manline_id_fkey FOREIGN KEY (manline_id) REFERENCES public.manufacturing_line(id) ON DELETE CASCADE;


--
-- Name: plant_mgr plant_mgr_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vcm
--

ALTER TABLE ONLY public.plant_mgr
    ADD CONSTRAINT plant_mgr_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sales sales_customer_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_name_fkey FOREIGN KEY (customer_name) REFERENCES public.customers(name);


--
-- Name: sales sales_customer_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_num_fkey FOREIGN KEY (customer_num) REFERENCES public.customers(num);


--
-- Name: sales sales_sku_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_sku_num_fkey FOREIGN KEY (sku_num) REFERENCES public.sku(num) ON DELETE CASCADE;


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

